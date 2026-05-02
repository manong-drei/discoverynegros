import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { auth } from '../services/firebase';
import { deactivateUser, fetchAllUsers, reactivateUser } from '../services/userService';

export default function UserManagementScreen() {
  const insets = useSafeAreaInsets();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingUid, setTogglingUid] = useState(null);

  const currentUid = auth.currentUser?.uid;

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchAllUsers();
      setUsers(result);
    } catch {
      Alert.alert('Error', 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleToggle = (item) => {
    if (item.isDeactivated) {
      Alert.alert(
        'Reactivate Account',
        `Reactivate "${item.displayName || item.email}"? They will be able to log in again.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Reactivate',
            onPress: async () => {
              setTogglingUid(item.id);
              try {
                await reactivateUser(item.id);
                setUsers((prev) =>
                  prev.map((u) => (u.id === item.id ? { ...u, isDeactivated: false } : u)),
                );
              } catch {
                Alert.alert('Error', 'Failed to reactivate user.');
              } finally {
                setTogglingUid(null);
              }
            },
          },
        ],
      );
    } else {
      Alert.alert(
        'Deactivate Account',
        `Deactivate "${item.displayName || item.email}"? This will block their access immediately.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Deactivate',
            style: 'destructive',
            onPress: async () => {
              setTogglingUid(item.id);
              try {
                await deactivateUser(item.id);
                setUsers((prev) =>
                  prev.map((u) => (u.id === item.id ? { ...u, isDeactivated: true } : u)),
                );
              } catch {
                Alert.alert('Error', 'Failed to deactivate user.');
              } finally {
                setTogglingUid(null);
              }
            },
          },
        ],
      );
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderItem = ({ item }) => {
    const isSelf = item.id === currentUid;
    const isDeactivated = Boolean(item.isDeactivated);
    const isToggling = togglingUid === item.id;

    return (
      <View style={styles.item}>
        <View style={styles.itemLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(item.displayName || item.email || '?')[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.displayName || '(No name)'}
            </Text>
            <Text style={styles.itemEmail} numberOfLines={1}>{item.email}</Text>
            <Text style={styles.itemMeta}>Last login: {formatDate(item.lastLoginAt)}</Text>
          </View>
        </View>

        <View style={styles.itemRight}>
          <View style={[styles.badge, isDeactivated ? styles.badgeDeactivated : styles.badgeActive]}>
            <Text style={styles.badgeText}>{isDeactivated ? 'Deactivated' : 'Active'}</Text>
          </View>
          {isSelf ? (
            <Text style={styles.selfLabel}>Admin</Text>
          ) : (
            <Pressable
              style={[
                styles.toggleButton,
                isDeactivated ? styles.toggleReactivate : styles.toggleDeactivate,
                isToggling && styles.toggleDisabled,
              ]}
              onPress={() => handleToggle(item)}
              disabled={isToggling}
            >
              {isToggling
                ? <ActivityIndicator size="small" color="#fff" />
                : <Text style={styles.toggleText}>
                    {isDeactivated ? 'Reactivate' : 'Deactivate'}
                  </Text>
              }
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Users</Text>
        <Text style={styles.subtitle}>{users.length} total</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color="#2F5D50" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={load} tintColor="#2F5D50" />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No users found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6F1' },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#2F5D50' },
  subtitle: { fontSize: 13, color: '#888' },
  loader: { marginTop: 48 },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 },
  separator: { height: 8 },
  empty: { textAlign: 'center', color: '#888', marginTop: 48 },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2F5D50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#2B2B2B' },
  itemEmail: { fontSize: 12, color: '#666', marginTop: 1 },
  itemMeta: { fontSize: 11, color: '#999', marginTop: 2 },
  itemRight: { alignItems: 'flex-end', gap: 6, marginLeft: 8 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  badgeActive: { backgroundColor: '#2F5D50' },
  badgeDeactivated: { backgroundColor: '#B23A48' },
  toggleButton: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  toggleDeactivate: { backgroundColor: '#B23A48' },
  toggleReactivate: { backgroundColor: '#2F5D50' },
  toggleDisabled: { opacity: 0.5 },
  toggleText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  selfLabel: { fontSize: 11, color: '#888', fontStyle: 'italic' },
});
