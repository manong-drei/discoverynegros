import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import DestinationDetailsScreen from '../screens/DestinationDetailsScreen';
import PreferenceSetupScreen from '../screens/PreferenceSetupScreen';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

const RootStack = createNativeStackNavigator();

export default function AppNavigator({
  canUndo = false,
  currentDestination,
  hasCompletedPreferenceSetup = false,
  isBootstrapping = false,
  likedDestinationCount = 0,
  onGoogleSignIn,
  onLogout,
  onSavePreferences,
  onSignIn,
  onSwipe,
  onUndo,
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

        {isLoggedIn && !hasCompletedPreferenceSetup && (
          <RootStack.Screen name="PreferenceSetup">
            {(props) => <PreferenceSetupScreen {...props} onContinue={onSavePreferences} />}
          </RootStack.Screen>
        )}

        {isLoggedIn && hasCompletedPreferenceSetup && (
          <>
            <RootStack.Screen name="MainTabs">
              {(props) => (
                <TabNavigator
                  {...props}
                  canUndo={canUndo}
                  currentDestination={currentDestination}
                  likedDestinationCount={likedDestinationCount}
                  onLogout={onLogout}
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
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
