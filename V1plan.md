# Negros App V1 Implementation Plan (JavaScript + Expo Go)

## Summary
Build V1 from scratch as an Expo React Native app (JavaScript) with Firebase backend, focused strictly on: Google auth, preference onboarding, swipe discovery (left/right/love), undo (3/day), wishlist, destination details, and Google Maps redirect.  
Success target: one stable Expo Go build that fully passes V1 acceptance scenarios.

## Key Implementation Changes
1. **Project foundation**
- Initialize Expo app in `c:\Negros` (JavaScript template).
- Add navigation (stack + bottom tabs): Splash, Login, Preference Setup, Explore, Wishlist, Profile, Destination Details.
- Set up environment config for Firebase keys and app constants (categories, colors, action weights).

2. **Firebase backend and contracts**
- Configure Firebase Auth (Google sign-in), Firestore, and Storage.
- Implement Firestore collections/subcollections:
- `users`
- `destinations`
- `users/{uid}/swipeHistory`
- `users/{uid}/wishlist`
- `users/{uid}/likedDestinations`
- Add Firestore security rules so users can only read/write their own user data; destinations are read-only client-side.
- Seed 20–30 high-quality destination records with valid image and Google Maps links.

3. **Authentication and app bootstrap flow**
- Splash logic:
- Not logged in -> Login
- Logged in + no preferences -> Preference Setup
- Logged in + preferences done -> Explore
- On first login, persist user profile fields and timestamps.
- Add logout from Profile.

4. **Preference setup + recommendation baseline**
- Build preference selector with strict rule: min 1, max 3.
- Save initial score map (+1 each selected).
- Implement recommendation service:
- Score-aware feed generation
- 70/30 mix (preference-driven/random)
- Exclude/deprioritize recently acted-on destinations as appropriate.

5. **Explore swipe engine**
- Card UI with image, destination name, category/type, location, short description.
- Actions: Left (-1), Right (+1 + liked), Love (+3 + wishlist), Undo.
- Persist each action in swipeHistory and immediately update preference scores.
- Keep a “latest actionable swipe” pointer for reliable undo.

6. **Undo and daily limit**
- Implement undo for most recent action only.
- Enforce 3 undos per local day based on stored reset date.
- Undo must reverse data side effects exactly:
- Left -> revert score
- Right -> revert score + remove liked record if created by that action
- Love -> revert score + remove wishlist record if created by that action

7. **Wishlist, details, and maps**
- Wishlist screen lists loved destinations only.
- Destination details show V1-approved fields only (no removed advanced fields).
- “Open in Google Maps” uses external URL deep link handling with fallback error message.

8. **UX hardening for V1**
- Add loading, empty, and error states across auth, fetch, and action operations.
- Apply “premium nature adventure” visual direction consistently.
- Add basic telemetry/logging hooks for key failures (auth, fetch, swipe write, undo write).

## To-Do List (Build Order)
- [ ] Create Expo JavaScript app and install core dependencies.
- [ ] Configure Firebase project and connect app credentials.
- [ ] Implement navigation shell and screen placeholders.
- [ ] Build splash auth-routing logic.
- [ ] Implement Google login/logout and user profile persistence.
- [ ] Build preference setup UI + min/max validation.
- [ ] Persist initial preference scores and completion flag.
- [ ] Create destination data seed set (20-30 entries) in Firestore/Storage.
- [ ] Build Explore card UI and action buttons.
- [ ] Implement swipe action persistence and score updates.
- [ ] Implement recommendation ordering (70/30 weighted mix).
- [ ] Implement undo-most-recent with 3/day reset.
- [ ] Implement Wishlist read/list and navigation to details.
- [ ] Implement Destination Details screen + Maps deep link button.
- [ ] Add Profile summary (photo, name, email, preferences, undo count).
- [ ] Add loading/empty/error states for all major screens.
- [ ] Add Firestore security rules and validate access boundaries.
- [ ] Run full manual acceptance test pass on Expo Go (Android device).
- [ ] Fix regressions and finalize V1 release checklist.

## Public Interfaces / Data Contracts
- **User document fields:** `uid`, `displayName`, `email`, `photoURL`, `createdAt`, `lastLoginAt`, `hasCompletedPreferenceSetup`, `preferences`, `undoCountToday`, `undoResetDate`.
- **Destination document fields:** `name`, `category`, `natureType`, `location`, `shortDescription`, `fullDescription`, `imageUrl`, `galleryImages`, `googleMapsUrl`, `tags`, `isActive`, timestamps.
- **Swipe history action enum:** `left | right | love`, with `undone` flag.
- **Recommendation weights (fixed in V1):** initial `+1`, left `-1`, right `+1`, love `+3`, undo = exact reversal.

## Test Plan
- **Unit tests**
- Preference score updates for each action.
- Undo reversal correctness for each action type.
- Daily undo reset logic and limit enforcement.
- Recommendation mixer returns expected 70/30 behavior.
- **Integration tests**
- Splash routing for all 3 user states.
- First-time login flow through preference setup to Explore.
- Swipe writes update Firestore and UI state consistently.
- Wishlist reflects love/undo transitions accurately.
- **Manual acceptance scenarios**
- New user completes onboarding and sees curated feed.
- Returning user skips onboarding and lands in Explore.
- Undo works exactly 3 times/day, then blocks with clear message.
- Maps link opens external Google Maps for valid destinations.
- Error/empty states appear when data unavailable or request fails.

## Assumptions (Locked Defaults)
- Codebase starts empty at `c:\Negros`.
- V1 implementation uses **JavaScript** (not TypeScript).
- First delivery target is **Expo Go** testing build (not APK/Play track yet).
- App remains **online-only**.
- Destination ingestion is manual seed data for V1 (no admin dashboard).
