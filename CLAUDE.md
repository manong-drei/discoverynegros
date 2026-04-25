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
```

There are no lint or test scripts defined. The app uses Expo SDK 54 with the new React Native architecture enabled (`newArchEnabled: true`).

## Environment Variables

Copy `.env.local` is already present with Firebase and Google OAuth credentials. All variables use the `EXPO_PUBLIC_` prefix (required by Expo for client-side access):

- `EXPO_PUBLIC_FIREBASE_*` — Firebase project config
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` — Google OAuth (web); Android/iOS variants also supported via `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` / `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`

## Architecture

**State management**: All app state lives in `App.js` and is prop-drilled down through navigators to screens. There is no React Context or external state library.

**Navigation flow** (`src/navigation/`):
- `AppNavigator` — root stack, renders `SplashScreen` while bootstrapping, then switches between `AuthNavigator` (unauthenticated), `PreferenceSetupScreen` (first login), and the main `TabNavigator`
- `TabNavigator` — bottom tabs: Explore, Wishlist, Profile
- Modal `DestinationDetailsScreen` is pushed from the root stack (not the tab navigator)

**Data flow for destinations** (`src/services/destinationService.js`):
- Destinations are a hardcoded static array — there is no Firestore collection for them
- `fetchActiveDestinations()` filters by `isActive: true`
- Each destination has a `natureTypeKey` (e.g. `'beaches'`, `'waterfalls'`) that maps to the preference system

**Recommendation engine** (`src/services/recommendationService.js`):
- `rankDestinations` sorts unswiped destinations by preference score descending
- `applyDiscoveryMix` keeps the top 70% ranked and shuffles the remaining 30% to surface variety (ratio from `RECOMMENDATION_RATIO` in `src/constants/categories.js`)

**Preference system** (`src/utils/preferenceUtils.js`):
- Preferences are a flat object `{ beaches: number, waterfalls: number, ... }` keyed by `natureTypeKey`
- Swipe actions update weights: `left: -1`, `right: +1`, `love: +3` (weights in `ACTION_WEIGHTS`)
- Initial preference setup adds `+1` to each selected category
- `reverseActionOnPreference` subtracts the same delta when undoing a swipe

**Undo system** (in `App.js`):
- Max 3 undos per day (`MAX_UNDOS_PER_DAY`)
- `undoCountToday` and `undoResetDate` are persisted to Firestore on each undo
- Daily reset is checked via `shouldResetUndo` (`src/utils/dateUtils.js`)

**Firebase** (`src/services/firebase.js`, `src/services/authService.js`):
- Auth uses `initializeAuth` with `AsyncStorage` persistence for React Native
- User documents are stored in Firestore under `users/{uid}`
- Fields persisted per user: `preferences`, `hasCompletedPreferenceSetup`, `undoCountToday`, `undoResetDate`, `lastLoginAt`

**Google Sign-In** (`App.js`):
- Uses `expo-auth-session` with a promise-based bridge: `promptGoogleAuth()` is triggered, then the `useEffect` watching `googleResponse` resolves the pending promise via `pendingGoogleSignInRef`
