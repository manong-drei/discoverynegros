import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function DestinationCard({ destination, onPress }) {
  if (!destination) {
    return null;
  }

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: destination.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{destination.name}</Text>
        <Text style={styles.meta}>{destination.category} - {destination.natureType}</Text>
        <Text style={styles.meta}>{destination.location}</Text>
        <Text style={styles.description} numberOfLines={2}>{destination.shortDescription}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.warmWhite,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#D9D9D9',
  },
  content: {
    padding: 14,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkCharcoal,
  },
  meta: {
    fontSize: 13,
    color: '#5C5C5C',
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: '#4A4A4A',
  },
});
