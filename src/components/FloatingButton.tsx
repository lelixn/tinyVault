import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';
import { Colors, Border, IconSize } from '../constants';

interface FloatingButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  label?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  style,
  label,
}) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withSpring(-4, { damping: 3, stiffness: 80 }),
        withSpring(0, { damping: 3, stiffness: 80 })
      ),
      -1,
      true
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10 });
    translateY.value = withSpring(0);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
    translateY.value = withRepeat(
      withSequence(
        withSpring(-4, { damping: 3, stiffness: 80 }),
        withSpring(0, { damping: 3, stiffness: 80 })
      ),
      -1,
      true
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.fab, animatedStyle, style]}
      activeOpacity={0.85}
      accessibilityLabel="Add new secret"
      accessibilityRole="button"
    >
      <Plus size={IconSize.xl} color={Colors.darkGreen} strokeWidth={3} />
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 60,
    height: 60,
    backgroundColor: Colors.primary,
    borderWidth: Border.width,
    borderColor: Colors.border,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.border,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
});
