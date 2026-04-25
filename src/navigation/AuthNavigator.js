import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator({ onGoogleSignIn, onSignIn }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            onGoogleSignIn={onGoogleSignIn}
            onSignIn={onSignIn}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
