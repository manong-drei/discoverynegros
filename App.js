import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { MAX_UNDOS_PER_DAY, RECOMMENDATION_RATIO } from './src/constants/categories';
import { fetchActiveDestinations } from './src/services/destinationService';
import { applyDiscoveryMix, rankDestinations } from './src/services/recommendationService';
import { auth, db } from './src/services/firebase';
import {
  logoutUser,
  saveUserProfile,
  signInWithEmail,
  signInWithGoogleIdToken,
  signUpWithEmail,
} from './src/services/authService';
import { getLocalDateKey, shouldResetUndo } from './src/utils/dateUtils';
import {
  applyInitialPreferences,
  createEmptyPreferences,
  reverseActionOnPreference,
  updatePreferenceByAction,
} from './src/utils/preferenceUtils';

const BOOTSTRAP_DELAY_MS = 900;
const MISSING_GOOGLE_CLIENT_ID = 'MISSING_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_IDS = {
  android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '',
  ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '',
  web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
  universal: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
};

WebBrowser.maybeCompleteAuthSession();

const normalizePreferences = (input) => ({
  ...createEmptyPreferences(),
  ...(input || {}),
});

export default function App() {
  const [isDestinationsBootstrapping, setIsDestinationsBootstrapping] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [user, setUser] = useState(null);
  const [hasCompletedPreferenceSetup, setHasCompletedPreferenceSetup] = useState(false);
  const [preferences, setPreferences] = useState(createEmptyPreferences());
  const [destinations, setDestinations] = useState([]);
  const [swipedDestinationIds, setSwipedDestinationIds] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [likedDestinationIds, setLikedDestinationIds] = useState([]);
  const [lastSwipeAction, setLastSwipeAction] = useState(null);
  const [undoCountToday, setUndoCountToday] = useState(0);
  const [undoResetDate, setUndoResetDate] = useState(getLocalDateKey());
  const pendingGoogleSignInRef = useRef(null);

  const platformGoogleClientId = useMemo(
    () =>
      Platform.select({
        android: GOOGLE_CLIENT_IDS.android || GOOGLE_CLIENT_IDS.universal,
        ios: GOOGLE_CLIENT_IDS.ios || GOOGLE_CLIENT_IDS.universal,
        default: GOOGLE_CLIENT_IDS.web || GOOGLE_CLIENT_IDS.universal,
      }) || '',
    [],
  );

  const hasGoogleClientId = Boolean(platformGoogleClientId);

  const [googleRequest, googleResponse, promptGoogleAuth] = Google.useIdTokenAuthRequest({
    androidClientId: GOOGLE_CLIENT_IDS.android || undefined,
    iosClientId: GOOGLE_CLIENT_IDS.ios || undefined,
    webClientId: GOOGLE_CLIENT_IDS.web || undefined,
    clientId: platformGoogleClientId || MISSING_GOOGLE_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
    selectAccount: true,
  });

  const resolvePendingGoogleSignIn = (result) => {
    if (pendingGoogleSignInRef.current) {
      pendingGoogleSignInRef.current(result);
      pendingGoogleSignInRef.current = null;
    }
  };

  const resetSessionState = () => {
    setHasCompletedPreferenceSetup(false);
    setPreferences(createEmptyPreferences());
    setSwipedDestinationIds([]);
    setWishlistIds([]);
    setLikedDestinationIds([]);
    setLastSwipeAction(null);
    setUndoCountToday(0);
    setUndoResetDate(getLocalDateKey());
  };

  useEffect(() => {
    let isMounted = true;
    let timerId;

    const bootstrap = async () => {
      try {
        const result = await fetchActiveDestinations();
        if (isMounted) {
          setDestinations(result);
        }
      } catch (error) {
        console.error('Failed to bootstrap destinations', error);
      } finally {
        if (isMounted) {
          timerId = setTimeout(() => {
            setIsDestinationsBootstrapping(false);
          }, BOOTSTRAP_DELAY_MS);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        resetSessionState();
        setIsAuthReady(true);
        return;
      }

      setUser(firebaseUser);

      try {
        await saveUserProfile(firebaseUser);

        const userRef = doc(db, 'users', firebaseUser.uid);
        const profileSnap = await getDoc(userRef);
        const profileData = profileSnap.exists() ? profileSnap.data() : null;

        const nextPreferences = normalizePreferences(profileData?.preferences);
        const nextSetupState = Boolean(profileData?.hasCompletedPreferenceSetup);

        let nextUndoCount = Number.isInteger(profileData?.undoCountToday)
          ? profileData.undoCountToday
          : 0;
        let nextUndoResetDate =
          typeof profileData?.undoResetDate === 'string'
            ? profileData.undoResetDate
            : getLocalDateKey();

        if (shouldResetUndo(nextUndoResetDate)) {
          nextUndoCount = 0;
          nextUndoResetDate = getLocalDateKey();

          await setDoc(
            userRef,
            {
              undoCountToday: 0,
              undoResetDate: nextUndoResetDate,
              lastLoginAt: serverTimestamp(),
            },
            { merge: true },
          );
        }

        setHasCompletedPreferenceSetup(nextSetupState);
        setPreferences(nextPreferences);
        setUndoCountToday(nextUndoCount);
        setUndoResetDate(nextUndoResetDate);
      } catch (error) {
        console.error('Failed to load user profile from Firestore', error);
      } finally {
        setIsAuthReady(true);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!googleResponse) {
      return;
    }

    const authenticateWithGoogle = async () => {
      if (googleResponse.type !== 'success') {
        resolvePendingGoogleSignIn({
          ok: false,
          error:
            googleResponse.type === 'cancel' || googleResponse.type === 'dismiss'
              ? 'Google sign-in was canceled.'
              : 'Google sign-in failed.',
        });
        return;
      }

      const idToken = googleResponse.params?.id_token ?? googleResponse.authentication?.idToken;
      if (!idToken) {
        resolvePendingGoogleSignIn({
          ok: false,
          error: 'Google did not return a valid ID token.',
        });
        return;
      }

      try {
        await signInWithGoogleIdToken({ idToken });
        resolvePendingGoogleSignIn({ ok: true });
      } catch (error) {
        console.error('Firebase Google auth failed', error);
        resolvePendingGoogleSignIn({
          ok: false,
          error: error?.message || 'Unable to authenticate with Google.',
        });
      }
    };

    authenticateWithGoogle();
  }, [googleResponse]);

  const remainingUndos = useMemo(() => {
    if (shouldResetUndo(undoResetDate)) {
      return MAX_UNDOS_PER_DAY;
    }

    return Math.max(0, MAX_UNDOS_PER_DAY - undoCountToday);
  }, [undoCountToday, undoResetDate]);

  const canUndo = Boolean(lastSwipeAction) && remainingUndos > 0;

  const availableDestinations = useMemo(() => {
    const unswiped = destinations.filter(
      (item) => item.isActive && !swipedDestinationIds.includes(item.id),
    );
    const ranked = rankDestinations(unswiped, preferences);
    return applyDiscoveryMix(ranked, RECOMMENDATION_RATIO.randomDiscovery);
  }, [destinations, preferences, swipedDestinationIds]);

  const currentDestination = availableDestinations[0] || null;

  const wishlistDestinations = useMemo(
    () => destinations.filter((item) => wishlistIds.includes(item.id)),
    [destinations, wishlistIds],
  );

  const handleSignIn = async ({ mode = 'signIn', displayName, email, password } = {}) => {
    try {
      if (mode === 'signUp') {
        await signUpWithEmail({ displayName, email, password });
      } else {
        await signInWithEmail({ email, password });
      }

      return { ok: true };
    } catch (error) {
      console.error('Firebase email auth failed', error);
      return {
        ok: false,
        error: error?.message || 'Unable to authenticate with email and password.',
      };
    }
  };

  const handleGoogleSignIn = async () => {
    if (!hasGoogleClientId) {
      const requiredEnvVar = Platform.select({
        android: 'EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID',
        ios: 'EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID',
        default: 'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
      });

      return {
        ok: false,
        error: `Google sign-in is not configured for this platform. Set ${requiredEnvVar} (or EXPO_PUBLIC_GOOGLE_CLIENT_ID).`,
      };
    }

    if (!googleRequest) {
      return {
        ok: false,
        error: 'Google sign-in is still loading. Please try again.',
      };
    }

    if (pendingGoogleSignInRef.current) {
      return {
        ok: false,
        error: 'Google sign-in is already in progress.',
      };
    }

    return new Promise((resolve) => {
      pendingGoogleSignInRef.current = resolve;

      promptGoogleAuth().then((result) => {
        if (result.type === 'cancel' || result.type === 'dismiss') {
          resolvePendingGoogleSignIn({
            ok: false,
            error: 'Google sign-in was canceled.',
          });
        } else if (result.type !== 'success') {
          resolvePendingGoogleSignIn({
            ok: false,
            error: 'Google sign-in failed.',
          });
        }
      }).catch((error) => {
        console.error('Google auth prompt failed', error);
        resolvePendingGoogleSignIn({
          ok: false,
          error: error?.message || 'Unable to start Google sign-in.',
        });
      });
    });
  };

  const handleSavePreferences = async (selectedPreferenceKeys) => {
    const nextPreferences = applyInitialPreferences(selectedPreferenceKeys);

    setPreferences(nextPreferences);
    setHasCompletedPreferenceSetup(true);

    if (!auth.currentUser?.uid) {
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          hasCompletedPreferenceSetup: true,
          preferences: nextPreferences,
          lastLoginAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error('Failed to save preferences', error);
    }
  };

  const handleSwipe = (action) => {
    if (!currentDestination) {
      return;
    }

    const natureTypeKey = currentDestination.natureTypeKey;

    setPreferences((prev) => updatePreferenceByAction(prev, natureTypeKey, action));
    setSwipedDestinationIds((prev) =>
      prev.includes(currentDestination.id) ? prev : [...prev, currentDestination.id],
    );

    if (action === 'love') {
      setWishlistIds((prev) =>
        prev.includes(currentDestination.id) ? prev : [...prev, currentDestination.id],
      );
    }

    if (action === 'right') {
      setLikedDestinationIds((prev) =>
        prev.includes(currentDestination.id) ? prev : [...prev, currentDestination.id],
      );
    }

    setLastSwipeAction({
      action,
      destinationId: currentDestination.id,
      natureTypeKey,
      createdAt: Date.now(),
    });
  };

  const handleUndo = () => {
    if (!lastSwipeAction) {
      return false;
    }

    const todayKey = getLocalDateKey();
    let currentUndoCount = undoCountToday;

    if (shouldResetUndo(undoResetDate)) {
      currentUndoCount = 0;
      setUndoCountToday(0);
    }

    if (currentUndoCount >= MAX_UNDOS_PER_DAY) {
      return false;
    }

    const nextUndoCount = currentUndoCount + 1;

    setPreferences((prev) =>
      reverseActionOnPreference(prev, lastSwipeAction.natureTypeKey, lastSwipeAction.action),
    );
    setSwipedDestinationIds((prev) => prev.filter((id) => id !== lastSwipeAction.destinationId));

    if (lastSwipeAction.action === 'right') {
      setLikedDestinationIds((prev) => prev.filter((id) => id !== lastSwipeAction.destinationId));
    }

    if (lastSwipeAction.action === 'love') {
      setWishlistIds((prev) => prev.filter((id) => id !== lastSwipeAction.destinationId));
    }

    setUndoCountToday(nextUndoCount);
    setUndoResetDate(todayKey);
    setLastSwipeAction(null);

    if (auth.currentUser?.uid) {
      setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          undoCountToday: nextUndoCount,
          undoResetDate: todayKey,
          lastLoginAt: serverTimestamp(),
        },
        { merge: true },
      ).catch((error) => {
        console.error('Failed to persist undo counters', error);
      });
    }

    return true;
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isBootstrapping = isDestinationsBootstrapping || !isAuthReady;

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator
        canUndo={canUndo}
        currentDestination={currentDestination}
        hasCompletedPreferenceSetup={hasCompletedPreferenceSetup}
        isBootstrapping={isBootstrapping}
        likedDestinationCount={likedDestinationIds.length}
        onGoogleSignIn={handleGoogleSignIn}
        onLogout={handleLogout}
        onSavePreferences={handleSavePreferences}
        onSignIn={handleSignIn}
        onSwipe={handleSwipe}
        onUndo={handleUndo}
        preferences={preferences}
        remainingUndos={remainingUndos}
        undoCountToday={undoCountToday}
        user={user}
        wishlistDestinations={wishlistDestinations}
      />
    </>
  );
}
