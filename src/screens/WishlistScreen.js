import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DestinationCard from '../components/DestinationCard';
import EmptyState from '../components/EmptyState';

export default function WishlistScreen({ navigation, wishlistDestinations = [] }) {
  const insets = useSafeAreaInsets();

  if (!wishlistDestinations.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Wishlist</Text>
        <EmptyState
          title="No loved destinations yet"
          message="Tap Love on destination cards in Explore to save them here."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>
      <FlatList
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
        data={wishlistDestinations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DestinationCard
            destination={item}
            onPress={() => navigation.navigate('DestinationDetails', { destination: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F1',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2F5D50',
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
});
