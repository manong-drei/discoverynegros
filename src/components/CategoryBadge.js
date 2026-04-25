import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CategoryBadge({ label }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#E8F1EE',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F5D50',
  },
});
