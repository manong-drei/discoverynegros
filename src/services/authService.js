import {
  createUserWithEmailAndPassword,
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

  return signInWithEmailAndPassword(auth, email.trim(), password);
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

export const logoutUser = async () => {
  await signOut(auth);
};
