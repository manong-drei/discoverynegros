import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { getLocalDateKey } from '../utils/dateUtils';
import { createEmptyPreferences } from '../utils/preferenceUtils';
import { auth, db } from './firebase';

const nameFromEmail = (email = '') => {
  const head = email.split('@')[0] || '';
  return head.trim();
};

export const signInWithEmail = async ({ email, password } = {}) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  try {
    return await signInWithEmailAndPassword(auth, email.trim(), password);
  } catch (error) {
    if (error.code === 'auth/invalid-credential') {
      const methods = await fetchSignInMethodsForEmail(auth, email.trim()).catch(() => []);
      if (methods.includes('google.com')) {
        const googleError = new Error('google-account');
        googleError.code = 'auth/google-account';
        throw googleError;
      }
    }
    throw error;
  }
};

export const signInWithGoogleIdToken = async ({ idToken } = {}) => {
  if (!idToken) {
    throw new Error('Google ID token is required.');
  }

  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
};

export const signUpWithEmail = async ({ email, password, displayName } = {}) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const nextDisplayName = (displayName || nameFromEmail(email)).trim();

  if (nextDisplayName) {
    await updateProfile(result.user, { displayName: nextDisplayName });
  }

  return result;
};

export const saveUserProfile = async (firebaseUser) => {
  if (!firebaseUser?.uid) {
    throw new Error('Cannot save user profile without a valid Firebase user.');
  }

  const userRef = doc(db, 'users', firebaseUser.uid);
  const snapshot = await getDoc(userRef);
  const existingData = snapshot.exists() ? snapshot.data() : null;

  await setDoc(
    userRef,
    {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName || existingData?.displayName || nameFromEmail(firebaseUser.email),
      email: firebaseUser.email || existingData?.email || '',
      photoURL: firebaseUser.photoURL || existingData?.photoURL || '',
      createdAt: existingData?.createdAt || serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      hasCompletedPreferenceSetup: Boolean(existingData?.hasCompletedPreferenceSetup),
      preferences: existingData?.preferences || createEmptyPreferences(),
      undoCountToday: Number.isInteger(existingData?.undoCountToday)
        ? existingData.undoCountToday
        : 0,
      undoResetDate:
        typeof existingData?.undoResetDate === 'string'
          ? existingData.undoResetDate
          : getLocalDateKey(),
    },
    { merge: true },
  );

  return userRef;
};

export const updateUserDisplayName = async (displayName) => {
  if (!auth.currentUser) throw new Error('Not authenticated.');
  const trimmed = displayName.trim();
  if (!trimmed) throw new Error('Display name cannot be empty.');
  await updateProfile(auth.currentUser, { displayName: trimmed });
  await setDoc(
    doc(db, 'users', auth.currentUser.uid),
    { displayName: trimmed },
    { merge: true },
  );
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getAuthErrorMessage = (error) => {
  switch (error?.code) {
    case 'auth/google-account':
      return 'This account was created with Google. Please use "Continue with Google" to sign in.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Wrong email or password. Please double-check and try again.';
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try signing in instead.';
    case 'auth/weak-password':
      return 'Your password needs to be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'That doesn\'t look like a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been suspended. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'No internet connection. Please check your network and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
};
