import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateUserDisplayName } from '../services/authService';

export default function EditProfileScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { currentDisplayName } = route.params || {};

  const [displayName, setDisplayName] = useState(currentDisplayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!displayName.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await updateUserDisplayName(displayName);
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter your name"
          placeholderTextColor="#999"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          style={[styles.saveButton, isSaving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveButtonText}>Save</Text>
          }
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F1',
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2B2B2B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: '#2B2B2B',
  },
  error: {
    marginTop: 8,
    color: '#B23A48',
    fontSize: 13,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: '#2F5D50',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
