import React from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CategoryBadge from '../components/CategoryBadge';
import { buildGoogleMapsUrl, isValidGoogleMapsUrl } from '../utils/mapUtils';

export default function DestinationDetailsScreen({ route }) {
  const destination = route?.params?.destination;

  if (!destination) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No destination selected</Text>
      </View>
    );
  }

  const mapUrl =
    destination.googleMapsUrl ||
    buildGoogleMapsUrl({
      query: destination.location,
    });

  const openInMaps = async () => {
    if (!isValidGoogleMapsUrl(mapUrl)) {
      Alert.alert('Invalid map link', 'This destination does not have a valid Google Maps URL yet.');
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(mapUrl);
      if (!canOpen) {
        Alert.alert('Cannot open Maps', 'No app is available to open this map link right now.');
        return;
      }

      await Linking.openURL(mapUrl);
    } catch (error) {
      Alert.alert('Failed to open Maps', 'Please try again in a moment.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: destination.imageUrl }} style={styles.image} />

      <Text style={styles.title}>{destination.name}</Text>
      <CategoryBadge label={destination.category} />
      <Text style={styles.meta}>{destination.natureType}</Text>
      <Text style={styles.meta}>{destination.location}</Text>

      <Text style={styles.sectionTitle}>Short Description</Text>
      <Text style={styles.bodyText}>{destination.shortDescription}</Text>

      <Text style={styles.sectionTitle}>Full Description</Text>
      <Text style={styles.bodyText}>{destination.fullDescription}</Text>

      <Pressable style={styles.mapButton} onPress={openInMaps}>
        <Text style={styles.mapButtonText}>Open in Google Maps</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F6F1',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B2B2B',
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 14,
    backgroundColor: '#D9D9D9',
  },
  title: {
    marginTop: 14,
    fontSize: 24,
    fontWeight: '800',
    color: '#2F5D50',
  },
  meta: {
    marginTop: 4,
    color: '#595959',
    fontSize: 14,
  },
  sectionTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '700',
    color: '#2B2B2B',
  },
  bodyText: {
    marginTop: 6,
    lineHeight: 21,
    color: '#4A4A4A',
    fontSize: 14,
  },
  mapButton: {
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: '#2F5D50',
    alignItems: 'center',
    paddingVertical: 14,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
