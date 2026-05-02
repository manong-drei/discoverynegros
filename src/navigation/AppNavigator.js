import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import DestinationDetailsScreen from '../screens/DestinationDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import PreferenceSetupScreen from '../screens/PreferenceSetupScreen';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import AdminNavigator from './AdminNavigator';

const RootStack = createNativeStackNavigator();

export default function AppNavigator({
  canUndo = false,
  currentDestination,
  hasCompletedPreferenceSetup = false,
  isAdmin = false,
  isBootstrapping = false,
  likedDestinationCount = 0,
  nextDestinations,
  onGoogleSignIn,
  onLogout,
  onRemoveFromWishlist,
  onSavePreferences,
  onSignIn,
  onSwipe,
  onUndo,
  onRefreshUser,
  preferences,
  remainingUndos = 0,
  undoCountToday = 0,
  user,
  wishlistDestinations,
}) {
  const isLoggedIn = Boolean(user);

  if (isBootstrapping) {
    return (
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Splash" component={SplashScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>

        {/* Unauthenticated */}
        {!isLoggedIn && (
          <RootStack.Screen name="Auth">
            {(props) => (
              <AuthNavigator
                {...props}
                onGoogleSignIn={onGoogleSignIn}
                onSignIn={onSignIn}
              />
            )}
          </RootStack.Screen>
        )}

        {/* Admin flow — skip preference setup, go straight to admin UI */}
        {isLoggedIn && isAdmin && (
          <RootStack.Screen name="AdminRoot">
            {(props) => <AdminNavigator {...props} onLogout={onLogout} />}
          </RootStack.Screen>
        )}

        {/* Regular user — preference setup first */}
        {isLoggedIn && !isAdmin && !hasCompletedPreferenceSetup && (
          <RootStack.Screen name="PreferenceSetup">
            {(props) => <PreferenceSetupScreen {...props} onContinue={onSavePreferences} />}
          </RootStack.Screen>
        )}

        {/* Regular user — main app */}
        {isLoggedIn && !isAdmin && hasCompletedPreferenceSetup && (
          <>
            <RootStack.Screen name="MainTabs">
              {(props) => (
                <TabNavigator
                  {...props}
                  canUndo={canUndo}
                  currentDestination={currentDestination}
                  isAdmin={isAdmin}
                  likedDestinationCount={likedDestinationCount}
                  nextDestinations={nextDestinations}
                  onRefreshUser={onRefreshUser}
                  onLogout={onLogout}
                  onRemoveFromWishlist={onRemoveFromWishlist}
                  onSwipe={onSwipe}
                  onUndo={onUndo}
                  preferences={preferences}
                  remainingUndos={remainingUndos}
                  undoCountToday={undoCountToday}
                  user={user}
                  wishlistDestinations={wishlistDestinations}
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen
              name="DestinationDetails"
              component={DestinationDetailsScreen}
              options={{ headerShown: true, title: 'Destination Details' }}
            />
            <RootStack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ headerShown: true, title: 'Edit Profile' }}
            />
          </>
        )}

      </RootStack.Navigator>
    </NavigationContainer>
  );
}
