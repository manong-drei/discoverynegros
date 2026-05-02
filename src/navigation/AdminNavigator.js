import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DestinationManagementScreen from '../screens/DestinationManagementScreen';
import DestinationFormScreen from '../screens/DestinationFormScreen';
import UserManagementScreen from '../screens/UserManagementScreen';

const DestinationsStack = createNativeStackNavigator();
const UsersStack = createNativeStackNavigator();
const AdminTab = createBottomTabNavigator();

function DestinationsStackScreen() {
  return (
    <DestinationsStack.Navigator>
      <DestinationsStack.Screen
        name="DestinationManagement"
        component={DestinationManagementScreen}
        options={{ title: 'Destinations' }}
      />
      <DestinationsStack.Screen
        name="DestinationForm"
        component={DestinationFormScreen}
        options={({ route }) => ({
          title: route.params?.destination ? 'Edit Destination' : 'New Destination',
        })}
      />
    </DestinationsStack.Navigator>
  );
}

function UsersStackScreen() {
  return (
    <UsersStack.Navigator>
      <UsersStack.Screen
        name="UserManagement"
        component={UserManagementScreen}
        options={{ title: 'Users' }}
      />
    </UsersStack.Navigator>
  );
}

export default function AdminNavigator({ onLogout }) {
  return (
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2F5D50',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#EAEAEA' },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Destinations: focused ? 'map' : 'map-outline',
            Users: focused ? 'people' : 'people-outline',
            Account: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <AdminTab.Screen name="Destinations" component={DestinationsStackScreen} />
      <AdminTab.Screen name="Users" component={UsersStackScreen} />
      <AdminTab.Screen name="Account">
        {() => <AdminAccountScreen onLogout={onLogout} />}
      </AdminTab.Screen>
    </AdminTab.Navigator>
  );
}

function AdminAccountScreen({ onLogout }) {
  const { View, Text, Pressable, StyleSheet } = require('react-native');
  const { useSafeAreaInsets } = require('react-native-safe-area-context');
  const { auth } = require('../services/firebase');
  const insets = useSafeAreaInsets();

  return (
    <View style={[accountStyles.container, { paddingBottom: insets.bottom + 24 }]}>
      <Text style={accountStyles.title}>Admin Account</Text>

      <View style={accountStyles.card}>
        <Text style={accountStyles.label}>Email</Text>
        <Text style={accountStyles.value}>{auth.currentUser?.email || '—'}</Text>
      </View>

      <View style={accountStyles.card}>
        <Text style={accountStyles.label}>Role</Text>
        <Text style={[accountStyles.value, { color: '#2F5D50', fontWeight: '700' }]}>Administrator</Text>
      </View>

      <Pressable style={accountStyles.logoutButton} onPress={onLogout}>
        <Text style={accountStyles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const accountStyles = {
  container: {
    flex: 1,
    backgroundColor: '#F8F6F1',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2F5D50',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#2B2B2B',
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: '#B23A48',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
};
