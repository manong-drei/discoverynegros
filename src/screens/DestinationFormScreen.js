import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NATURE_CATEGORIES } from '../constants/categories';
import {
  archiveDestination,
  createDestination,
  updateDestination,
} from '../services/destinationService';

const NATURE_TYPE_LABEL = {
  beaches: 'Beach',
  waterfalls: 'Waterfall',
  mountains: 'Mountain',
  rivers: 'River',
  campsites: 'Campsite',
  natureParks: 'Nature Park',
  scenicSpots: 'Scenic Spot',
};

export default function DestinationFormScreen({ navigation, route }) {
  const existing = route.params?.destination ?? null;
  const isEditing = Boolean(existing);

  const [name, setName] = useState(existing?.name ?? '');
  const [location, setLocation] = useState(existing?.location ?? '');
  const [natureTypeKey, setNatureTypeKey] = useState(existing?.natureTypeKey ?? 'beaches');
  const [shortDescription, setShortDescription] = useState(existing?.shortDescription ?? '');
  const [fullDescription, setFullDescription] = useState(existing?.fullDescription ?? '');
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? '');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(existing?.googleMapsUrl ?? '');
  const [isActive, setIsActive] = useState(existing?.isActive ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!name.trim() || !location.trim() || !shortDescription.trim()) {
      setError('Name, location, and short description are required.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const data = {
        name: name.trim(),
        location: location.trim(),
        natureTypeKey,
        natureType: NATURE_TYPE_LABEL[natureTypeKey],
        category: 'Nature',
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        imageUrl: imageUrl.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        isActive,
      };
      if (isEditing) {
        await updateDestination(existing.id, data);
      } else {
        await createDestination(data);
      }
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Failed to save destination.');
      setIsSaving(false);
    }
  };

  const handleArchive = () => {
    Alert.alert(
      'Archive Destination',
      `"${existing.name}" will be hidden from users but kept for future reference.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: async () => {
            try {
              await archiveDestination(existing.id);
              navigation.goBack();
            } catch (err) {
              setError(err.message || 'Failed to archive.');
            }
          },
        },
      ],
    );
  };

  const handleRestore = async () => {
    try {
      await updateDestination(existing.id, { isArchived: false, isActive: true });
      navigation.goBack();
    } catch (err) {
      setError(err.message || 'Failed to restore.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionHeader}>Basic Info</Text>

        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Destination name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="City, Province"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Nature Type *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
          {NATURE_CATEGORIES.map((cat) => (
            <Pressable
              key={cat.key}
              style={[styles.pill, natureTypeKey === cat.key && styles.pillSelected]}
              onPress={() => setNatureTypeKey(cat.key)}
            >
              <Text style={[styles.pillText, natureTypeKey === cat.key && styles.pillTextSelected]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.sectionHeader}>Descriptions</Text>

        <Text style={styles.label}>Short Description *</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={shortDescription}
          onChangeText={setShortDescription}
          placeholder="One-line summary shown on cards"
          placeholderTextColor="#999"
          multiline
          numberOfLines={2}
        />

        <Text style={styles.label}>Full Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={fullDescription}
          onChangeText={setFullDescription}
          placeholder="Detailed description for the details screen"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sectionHeader}>Media & Links</Text>

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="https://..."
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="url"
        />

        <Text style={styles.label}>Google Maps URL</Text>
        <TextInput
          style={styles.input}
          value={googleMapsUrl}
          onChangeText={setGoogleMapsUrl}
          placeholder="https://maps.google.com/..."
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="url"
        />

        <View style={styles.toggleRow}>
          <Text style={styles.label}>Active (visible to users)</Text>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ true: '#2F5D50', false: '#ccc' }}
            thumbColor="#fff"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.saveButton, isSaving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveButtonText}>{isEditing ? 'Save Changes' : 'Create Destination'}</Text>
          }
        </Pressable>

        {isEditing && (
          existing?.isArchived ? (
            <Pressable style={styles.restoreButton} onPress={handleRestore}>
              <Text style={styles.restoreButtonText}>Restore Destination</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.archiveButton} onPress={handleArchive}>
              <Text style={styles.archiveButtonText}>Archive Destination</Text>
            </Pressable>
          )
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6F1' },
  content: { padding: 16, paddingBottom: 48 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2F5D50',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 20,
    marginBottom: 10,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#2B2B2B', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2B2B2B',
    marginBottom: 14,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  pillRow: { marginBottom: 14 },
  pill: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2F5D50',
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  pillSelected: { backgroundColor: '#2F5D50' },
  pillText: { fontSize: 13, color: '#2F5D50', fontWeight: '600' },
  pillTextSelected: { color: '#fff' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  error: { color: '#B23A48', fontSize: 13, marginBottom: 10 },
  saveButton: {
    backgroundColor: '#2F5D50',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  archiveButton: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#B23A48',
  },
  archiveButtonText: { color: '#B23A48', fontWeight: '700', fontSize: 15 },
  restoreButton: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2F5D50',
  },
  restoreButtonText: { color: '#2F5D50', fontWeight: '700', fontSize: 15 },
});
