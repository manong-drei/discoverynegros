import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NATURE_CATEGORIES } from '../constants/categories';

export default function ProfileScreen({
  likedDestinationCount,
  onLogout,
  preferences,
  remainingUndos,
  undoCountToday,
  user,
  wishlistCount,
}) {
  const activePreferenceLabels = useMemo(() => {
    if (!preferences) {
      return [];
    }

    return NATURE_CATEGORIES.filter((item) => (preferences[item.key] || 0) > 0).map((item) => item.label);
  }, [preferences]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.value}>Name: {user?.displayName || 'Guest'}</Text>
        <Text style={styles.value}>Email: {user?.email || '-'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preference Summary</Text>
        <Text style={styles.value}>
          {activePreferenceLabels.length ? activePreferenceLabels.join(', ') : 'No preferences selected yet'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <Text style={styles.value}>Wishlist: {wishlistCount}</Text>
        <Text style={styles.value}>Liked Destinations: {likedDestinationCount}</Text>
        <Text style={styles.value}>Undo Used Today: {undoCountToday}</Text>
        <Text style={styles.value}>Undo Remaining: {remainingUndos}</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F6F1',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2F5D50',
  },
  section: {
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    color: '#4F4F4F',
    marginBottom: 3,
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#B23A48',
    alignItems: 'center',
    paddingVertical: 14,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
