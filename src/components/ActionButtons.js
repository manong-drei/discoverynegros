import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function ActionButton({ disabled, label, onPress, tone }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, tone === 'primary' && styles.primary, disabled && styles.disabled]}
    >
      <Text style={[styles.label, tone === 'primary' && styles.primaryLabel]}>{label}</Text>
    </Pressable>
  );
}

export default function ActionButtons({ disableUndo = false, onUndo, onSkip, onLove, onLike }) {
  return (
    <View style={styles.row}>
      <ActionButton disabled={disableUndo} label="Undo" onPress={onUndo} />
      <ActionButton label="Skip" onPress={onSkip} />
      <ActionButton label="Love" onPress={onLove} tone="primary" />
      <ActionButton label="Like" onPress={onLike} tone="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#EFEFEF',
  },
  primary: {
    backgroundColor: '#2F5D50',
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
});
