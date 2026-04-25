import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Negros Nature Discovery</Text>
      <Text style={styles.subtitle}>Loading your next nature escape...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F6F1',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2F5D50',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#5C5C5C',
    textAlign: 'center',
  },
});
