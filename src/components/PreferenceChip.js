import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function PreferenceChip({ label, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.selectedChip]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#EDEDED',
  },
  selectedChip: {
    backgroundColor: '#2F5D50',
  },
  label: {
    fontWeight: '600',
    color: '#2B2B2B',
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});
