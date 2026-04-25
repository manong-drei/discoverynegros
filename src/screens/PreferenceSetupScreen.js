import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PreferenceChip from '../components/PreferenceChip';
import { NATURE_CATEGORIES } from '../constants/categories';

const MAX_SELECTED = 3;

export default function PreferenceSetupScreen({ onContinue }) {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [errorText, setErrorText] = useState('');

  const canSubmit = useMemo(() => selectedKeys.length >= 1 && selectedKeys.length <= MAX_SELECTED, [selectedKeys]);

  const togglePreference = (key) => {
    if (selectedKeys.includes(key)) {
      setSelectedKeys((prev) => prev.filter((item) => item !== key));
      setErrorText('');
      return;
    }

    if (selectedKeys.length >= MAX_SELECTED) {
      setErrorText('You can select up to 3 preferences only.');
      return;
    }

    setSelectedKeys((prev) => [...prev, key]);
    setErrorText('');
  };

  const handleContinue = () => {
    if (!canSubmit) {
      setErrorText('Please select at least 1 preference.');
      return;
    }

    onContinue(selectedKeys);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Nature Preferences</Text>
      <Text style={styles.subtitle}>Select at least 1 and up to 3 categories.</Text>

      <View style={styles.chipWrap}>
        {NATURE_CATEGORIES.map((item) => (
          <PreferenceChip
            key={item.key}
            label={item.label}
            selected={selectedKeys.includes(item.key)}
            onPress={() => togglePreference(item.key)}
          />
        ))}
      </View>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

      <Pressable
        style={[styles.continueButton, !canSubmit && styles.disabledButton]}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue to Explore</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F1',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2F5D50',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#5C5C5C',
  },
  chipWrap: {
    marginTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  errorText: {
    marginTop: 14,
    color: '#B23A48',
    fontWeight: '600',
  },
  continueButton: {
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: '#2F5D50',
    alignItems: 'center',
    paddingVertical: 14,
  },
  disabledButton: {
    opacity: 0.55,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
