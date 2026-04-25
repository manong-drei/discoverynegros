import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function EmptyState({ title = 'Nothing here yet', message = 'Please check again later.' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
  },
  message: {
    marginTop: 6,
    fontSize: 14,
    color: '#5C5C5C',
    textAlign: 'center',
  },
});
