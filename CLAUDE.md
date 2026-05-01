# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web

# Seed Firestore with destination data (uses firebase-admin, requires service account)
node scripts/seedDestinations.js
```

There are no lint or test scripts defined. The app uses Expo SDK 54 with the new React Native architecture enabled (`newArchEnabled: true`).

## Environment Variables

`.env.local` is already present with Firebase and Google OAuth credentials. All variables use the `EXPO_PUBLIC_` prefix (required by Expo for client-side access):

- `EXPO_PUBLIC_FIREBASE_*` — Firebase project config (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` — Google OAuth (web); Android/iOS variants also supported via `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` / `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`

## Architecture

**State management**: All app state lives in `App.js` and is prop-drilled down through navigators to screens. There is no React Context or external state library. Custom hooks exist in `src/hooks/` (`useSwipe`, `useAuth`, `useDestinations`, `usePreferences`) but are **not currently used** — they are legacy/unused.

**Navigation flow** (`src/navigation/`):
- `AppNavigator` — root stack; renders `SplashScreen` during a 900ms bootstrap delay, then switches to `AuthNavigator` (unauthenticated), `PreferenceSetupScreen` (first login only), or `TabNavigator` (authenticated)
- `TabNavigator` — bottom tabs: Explore, Wishlist, Profile
- `DestinationDetailsScreen` — modal pushed from the root stack (not from a tab)

**Screens** (`src/screens/`):
- `SplashScreen` — loading screen shown during app bootstrap
- `LoginScreen` — email/password and Google Sign-In
- `PreferenceSetupScreen` — one-time category selection on first login
- `ExploreScreen` — swipe card interface (main feature)
- `WishlistScreen` — user's saved destinations
- `ProfileScreen` — user info, swipe stats, logout
- `DestinationDetailsScreen` — full destination detail (opened as a modal)

**Services** (`src/services/`):
- `firebase.js` — Firebase app init with `AsyncStorage` persistence for auth
- `authService.js` — email/password signup & signin, Google ID token auth, user profile upserts, auth error message mapping
- `destinationService.js` — `fetchActiveDestinations()` (queries `isActive == true`), `fetchDestinationById()`
- `swipeService.js` — save swipe actions, undo swipes, fetch user swipe history
- `wishlistService.js` — add, remove, fetch wishlist items
- `recommendationService.js` — `rankDestinations` + `applyDiscoveryMix`

**Data flow for destinations**:
- `fetchActiveDestinations()` reads from the Firestore `destinations` collection where `isActive == true`
- Each destination has a `natureTypeKey` (e.g. `'beaches'`, `'waterfalls'`) that maps to the preference system
- Nature categories (7): `beaches`, `waterfalls`, `mountains`, `rivers`, `campsites`, `natureParks`, `scenicSpots` — defined in `src/constants/categories.js`

**Recommendation engine** (`src/services/recommendationService.js`):
- `rankDestinations` sorts unswiped destinations by preference score descending
- `applyDiscoveryMix` keeps the top 70% preference-ranked and shuffles the bottom 30% to surface variety (ratio controlled by `RECOMMENDATION_RATIO` in `src/constants/categories.js`)

**Preference system** (`src/utils/preferenceUtils.js`):
- Preferences are a flat object `{ beaches: number, waterfalls: number, ... }` keyed by `natureTypeKey`
- Swipe weights: `left: -1`, `right: +1`, `love: +3` — defined in `ACTION_WEIGHTS`
- Initial setup adds `+1` to each selected category
- `reverseActionOnPreference` subtracts the same delta when undoing a swipe

**Undo system** (in `App.js`):
- Max 3 undos per day (`MAX_UNDOS_PER_DAY`)
- `undoCountToday` and `undoResetDate` are persisted to Firestore on each undo
- Daily reset is checked via `shouldResetUndo` (`src/utils/dateUtils.js`)

**Firebase** (`src/services/firebase.js`, `src/services/authService.js`):
- Auth uses `initializeAuth` with `AsyncStorage` persistence for React Native
- All Firestore user doc writes use `{ merge: true }` to avoid clobbering unrelated fields
- Swipe and preference updates are batched with `Promise.all()`

**Firestore schema**:
```
destinations/{id}
  isActive: boolean
  natureTypeKey: string
  name, description, location, imageUrl, ...

users/{uid}
  uid, displayName, email, photoURL
  preferences: { beaches: number, waterfalls: number, ... }
  hasCompletedPreferenceSetup: boolean
  undoCountToday: number
  undoResetDate: "YYYY-MM-DD"
  createdAt, lastLoginAt (server timestamps)

users/{uid}/swipes/{destinationId}
  action: "left" | "right" | "love"
  destinationId, natureTypeKey, clientCreatedAt, ...

users/{uid}/wishlist/{destinationId}
  destinationId, createdAt
```

**Google Sign-In** (`App.js`):
- Uses `expo-auth-session` with a promise-based bridge: `promptGoogleAuth()` triggers the OAuth prompt; a `useEffect` watching `googleResponse` resolves the pending promise stored in `pendingGoogleSignInRef`
