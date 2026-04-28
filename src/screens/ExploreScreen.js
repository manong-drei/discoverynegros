import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionButtons from '../components/ActionButtons';
import DestinationCard from '../components/DestinationCard';
import EmptyState from '../components/EmptyState';

export default function ExploreScreen({
  canUndo,
  currentDestination,
  navigation,
  onSwipe,
  onUndo,
  remainingUndos,
}) {
  const insets = useSafeAreaInsets();

  const openDestinationDetails = () => {
    if (!currentDestination) {
      return;
    }

    navigation.navigate('DestinationDetails', {
      destination: currentDestination,
    });
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
      <Text style={styles.title}>Explore Nature</Text>
      <Text style={styles.subtitle}>Undos left today: {remainingUndos}</Text>

      <View style={styles.cardArea}>
        {currentDestination ? (
          <DestinationCard destination={currentDestination} onPress={openDestinationDetails} />
        ) : (
          <EmptyState
            title="No more destinations in this round"
            message="You have swiped all available cards. More destinations will appear once data refreshes."
          />
        )}
      </View>

      <ActionButtons
        disableUndo={!canUndo}
        onLike={() => onSwipe('right')}
        onLove={() => onSwipe('love')}
        onSkip={() => onSwipe('left')}
        onUndo={onUndo}
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2F5D50',
  },
  subtitle: {
    marginTop: 4,
    color: '#5C5C5C',
    fontSize: 13,
  },
  cardArea: {
    marginTop: 12,
    flex: 1,
    justifyContent: 'center',
  },
});
