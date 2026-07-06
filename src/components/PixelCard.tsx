import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { Colors, Border, Spacing } from '../constants';

interface PixelCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  animated?: boolean;
  delay?: number;
  onPress?: () => void;
  pressed?: boolean;
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  style,
  animated = true,
  delay = 0,
}) => {
  if (animated) {
    return (
      <Animated.View
        entering={FadeInDown.delay(delay).springify().damping(15)}
        style={[styles.card, style]}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    borderRadius: Border.radius,
    padding: Spacing.lg,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
});
