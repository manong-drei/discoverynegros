import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ExploreScreen from '../screens/ExploreScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator({
  canUndo,
  currentDestination,
  isAdmin,
  likedDestinationCount,
  nextDestinations,
  onRefreshUser,
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
      screenOptions={({ route }) => ({
        headerTitleStyle: { fontWeight: '700' },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Explore: focused ? 'compass' : 'compass-outline',
            Wishlist: focused ? 'heart' : 'heart-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explore">
        {(props) => (
          <ExploreScreen
            {...props}
            canUndo={canUndo}
            currentDestination={currentDestination}
            nextDestinations={nextDestinations}
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
            isAdmin={isAdmin}
            likedDestinationCount={likedDestinationCount}
            onRefreshUser={onRefreshUser}
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
