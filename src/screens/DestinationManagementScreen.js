import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchAllDestinations } from '../services/destinationService';

export default function DestinationManagementScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchAllDestinations();
      setDestinations([...result].sort((a, b) => a.name.localeCompare(b.name)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Refresh list when returning from the form screen
  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.item}
      onPress={() => navigation.navigate('DestinationForm', { destination: item })}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemLocation} numberOfLines={1}>{item.location}</Text>
      </View>
      <View style={styles.badgeGroup}>
        {item.isArchived ? (
          <View style={[styles.badge, styles.badgeArchived]}>
            <Text style={styles.badgeText}>Archived</Text>
          </View>
        ) : (
          <View style={[styles.badge, item.isActive ? styles.badgeActive : styles.badgeInactive]}>
            <Text style={styles.badgeText}>{item.isActive ? 'Active' : 'Inactive'}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Destinations</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('DestinationForm', {})}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color="#2F5D50" />
      ) : (
        <FlatList
          data={destinations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F6F1' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#2F5D50' },
  addButton: {
    backgroundColor: '#2F5D50',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  loader: { marginTop: 48 },
  list: { paddingHorizontal: 16, paddingTop: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  itemInfo: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 15, fontWeight: '600', color: '#2B2B2B' },
  itemLocation: { fontSize: 12, color: '#5C5C5C', marginTop: 2 },
  badgeGroup: { alignItems: 'flex-end' },
  badge: { borderRadius: 6, paddingHorizontal: 9, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  badgeActive: { backgroundColor: '#2F5D50' },
  badgeInactive: { backgroundColor: '#999' },
  badgeArchived: { backgroundColor: '#B23A48' },
  separator: { height: 8 },
});
