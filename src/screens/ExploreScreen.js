import React, { useEffect, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ActionButtons from '../components/ActionButtons';
import DestinationCard from '../components/DestinationCard';
import EmptyState from '../components/EmptyState';

const SWIPE_THRESHOLD = 80;
const SWIPE_OUT_DURATION = 200;

export default function ExploreScreen({
  canUndo,
  currentDestination,
  navigation,
  nextDestinations = [],
  onSwipe,
  onUndo,
  remainingUndos,
}) {
  const insets = useSafeAreaInsets();
  const pan = useRef(new Animated.ValueXY()).current;
  const onSwipeRef = useRef(onSwipe);

  useEffect(() => {
    onSwipeRef.current = onSwipe;
  }, [onSwipe]);

  // Reset pan AFTER React re-renders with the new card, not inside the animation
  // callback. Resetting inside the callback runs before the state update commits,
  // which snaps the outgoing card back to center for one frame (visible flicker).
  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
  }, [currentDestination?.id]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10,
      onPanResponderMove: Animated.event([null, { dx: pan.x }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, { dx }) => {
        if (dx > SWIPE_THRESHOLD) {
          Animated.timing(pan, {
            toValue: { x: 500, y: 0 },
            duration: SWIPE_OUT_DURATION,
            useNativeDriver: false,
          }).start(() => {
            onSwipeRef.current('right');
          });
        } else if (dx < -SWIPE_THRESHOLD) {
          Animated.timing(pan, {
            toValue: { x: -500, y: 0 },
            duration: SWIPE_OUT_DURATION,
            useNativeDriver: false,
          }).start(() => {
            onSwipeRef.current('left');
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const rotate = pan.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: ['-12deg', '0deg', '12deg'],
    extrapolate: 'clamp',
  });

  // Colored overlays fade in as the card is dragged — no text, just a tint
  const likeOverlayOpacity = pan.x.interpolate({
    inputRange: [10, SWIPE_THRESHOLD],
    outputRange: [0, 0.38],
    extrapolate: 'clamp',
  });

  const skipOverlayOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -10],
    outputRange: [0.38, 0],
    extrapolate: 'clamp',
  });

  // Behind cards rise and expand as the top card is dragged in either direction
  const nextCardScale = pan.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.95, 1],
    extrapolate: 'clamp',
  });

  const nextCardTranslateY = pan.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [0, 10, 0],
    extrapolate: 'clamp',
  });

  const thirdCardScale = pan.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [0.95, 0.90, 0.95],
    extrapolate: 'clamp',
  });

  const thirdCardTranslateY = pan.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [10, 20, 10],
    extrapolate: 'clamp',
  });

  const openDestinationDetails = () => {
    if (!currentDestination) return;
    navigation.navigate('DestinationDetails', { destination: currentDestination });
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
      <Text style={styles.title}>Explore Nature</Text>
      <Text style={styles.subtitle}>Undos left today: {remainingUndos}</Text>

      <View style={styles.cardArea}>
        {currentDestination ? (
          <View style={styles.stackWrapper}>
            {/* Third card — furthest back, absolutely positioned behind */}
            {nextDestinations[1] && (
              <Animated.View
                style={[
                  styles.behindCard,
                  { transform: [{ scale: thirdCardScale }, { translateY: thirdCardTranslateY }] },
                ]}
              >
                <DestinationCard destination={nextDestinations[1]} />
              </Animated.View>
            )}

            {/* Second card — one behind the top, absolutely positioned */}
            {nextDestinations[0] && (
              <Animated.View
                style={[
                  styles.behindCard,
                  { transform: [{ scale: nextCardScale }, { translateY: nextCardTranslateY }] },
                ]}
              >
                <DestinationCard destination={nextDestinations[0]} />
              </Animated.View>
            )}

            {/* Top card — in normal flow, sets the wrapper height */}
            <Animated.View
              style={{ transform: [{ translateX: pan.x }, { rotate }] }}
              {...panResponder.panHandlers}
            >
              <Animated.View
                pointerEvents="none"
                style={[styles.overlay, styles.likeOverlay, { opacity: likeOverlayOpacity }]}
              />
              <Animated.View
                pointerEvents="none"
                style={[styles.overlay, styles.skipOverlay, { opacity: skipOverlayOpacity }]}
              />
              <DestinationCard destination={currentDestination} onPress={openDestinationDetails} />
            </Animated.View>
          </View>
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
  stackWrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  behindCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    zIndex: 10,
  },
  likeOverlay: {
    backgroundColor: '#2F5D50',
  },
  skipOverlay: {
    backgroundColor: '#B23A48',
  },
});
