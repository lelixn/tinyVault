import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Border, Spacing } from '../constants';

interface SecretCardSkeletonProps {
  index?: number;
}

function SkeletonBlock({
  width,
  height,
  opacity,
}: {
  width: number | `${number}%`;
  height: number;
  opacity: Animated.SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height },
        animatedStyle,
      ]}
    />
  );
}

export const SecretCardSkeleton: React.FC<SecretCardSkeletonProps> = ({
  index = 0,
}) => {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 700 }),
        withTiming(0.45, { duration: 700 })
      ),
      -1,
      false
    );
  }, [opacity]);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify().damping(15)}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <SkeletonBlock width="55%" height={18} opacity={opacity} />
        <SkeletonBlock width={72} height={22} opacity={opacity} />
      </View>
      <SkeletonBlock width="100%" height={40} opacity={opacity} />
      <View style={styles.spacer} />
      <SkeletonBlock width="40%" height={12} opacity={opacity} />
      <View style={styles.actions}>
        <SkeletonBlock width={58} height={28} opacity={opacity} />
        <SkeletonBlock width={58} height={28} opacity={opacity} />
        <SkeletonBlock width={58} height={28} opacity={opacity} />
        <SkeletonBlock width={48} height={28} opacity={opacity} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    borderRadius: Border.radius,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  block: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  spacer: {
    height: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.md,
  },
});
