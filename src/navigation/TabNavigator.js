import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreScreen from '../screens/ExploreScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator({
  canUndo,
  currentDestination,
  likedDestinationCount,
  onLogout,
  onSwipe,
  onUndo,
  preferences,
  remainingUndos,
  undoCountToday,
  user,
  wishlistDestinations,
}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tab.Screen name="Explore">
        {(props) => (
          <ExploreScreen
            {...props}
            canUndo={canUndo}
            currentDestination={currentDestination}
            onSwipe={onSwipe}
            onUndo={onUndo}
            remainingUndos={remainingUndos}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Wishlist">
        {(props) => <WishlistScreen {...props} wishlistDestinations={wishlistDestinations} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {(props) => (
          <ProfileScreen
            {...props}
            likedDestinationCount={likedDestinationCount}
            onLogout={onLogout}
            preferences={preferences}
            remainingUndos={remainingUndos}
            undoCountToday={undoCountToday}
            user={user}
            wishlistCount={wishlistDestinations?.length || 0}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
