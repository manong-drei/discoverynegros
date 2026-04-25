import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen({ onGoogleSignIn, onSignIn }) {
  const [mode, setMode] = useState('signIn');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorText('Email and password are required.');
      return;
    }

    if (mode === 'signUp' && password.length < 6) {
      setErrorText('Password must be at least 6 characters.');
      return;
    }

    setErrorText('');
    setIsSubmitting(true);

    try {
      const result = await onSignIn?.({
        mode,
        displayName,
        email: trimmedEmail,
        password,
      });

      if (result?.ok === false) {
        setErrorText(result.error || 'Authentication failed.');
      }
    } catch {
      setErrorText('Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setErrorText('');
    setIsGoogleSubmitting(true);

    try {
      const result = await onGoogleSignIn?.();

      if (result?.ok === false) {
        setErrorText(result.error || 'Google authentication failed.');
      }
    } catch {
      setErrorText('Google authentication failed. Please try again.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const isAnySubmitInProgress = isSubmitting || isGoogleSubmitting;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Negros Nature Discovery</Text>
      <Text style={styles.tagline}>Discover your next nature escape in Negros.</Text>

      <View style={styles.modeRow}>
        <Pressable
          onPress={() => setMode('signIn')}
          style={[styles.modeButton, mode === 'signIn' && styles.modeButtonActive]}
        >
          <Text style={[styles.modeButtonText, mode === 'signIn' && styles.modeButtonTextActive]}>Sign In</Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('signUp')}
          style={[styles.modeButton, mode === 'signUp' && styles.modeButtonActive]}
        >
          <Text style={[styles.modeButtonText, mode === 'signUp' && styles.modeButtonTextActive]}>Create Account</Text>
        </Pressable>
      </View>

      {mode === 'signUp' ? (
        <TextInput
          autoCapitalize="words"
          onChangeText={setDisplayName}
          placeholder="Display name"
          placeholderTextColor="#909090"
          style={styles.input}
          value={displayName}
        />
      ) : null}

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#909090"
        style={styles.input}
        value={email}
      />

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#909090"
        secureTextEntry
        style={styles.input}
        value={password}
      />

      <Pressable
        disabled={isAnySubmitInProgress}
        onPress={handleSubmit}
        style={[styles.button, isAnySubmitInProgress && styles.buttonDisabled]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>{mode === 'signIn' ? 'Sign In' : 'Create Account'}</Text>
        )}
      </Pressable>

      <Text style={styles.dividerText}>or</Text>

      <Pressable
        disabled={isAnySubmitInProgress}
        onPress={handleGoogleSubmit}
        style={[styles.googleButton, isAnySubmitInProgress && styles.buttonDisabled]}
      >
        {isGoogleSubmitting ? (
          <ActivityIndicator color="#2B2B2B" />
        ) : (
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        )}
      </Pressable>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8F6F1',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2F5D50',
  },
  tagline: {
    marginTop: 8,
    fontSize: 15,
    color: '#5C5C5C',
  },
  modeRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#ECECEC',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#2F5D50',
  },
  modeButtonText: {
    color: '#2B2B2B',
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  input: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#2B2B2B',
  },
  button: {
    marginTop: 18,
    backgroundColor: '#2F5D50',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  googleButton: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#2B2B2B',
    fontWeight: '700',
    fontSize: 16,
  },
  dividerText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#6B6B6B',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    marginTop: 14,
    color: '#B23A48',
    fontWeight: '600',
    fontSize: 13,
  },
});
