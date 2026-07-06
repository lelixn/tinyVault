import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { CheckCircle } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../constants';

interface PixelToastProps {
  visible: boolean;
  message?: string;
  onHide: () => void;
  duration?: number;
}

export const PixelToast: React.FC<PixelToastProps> = ({
  visible,
  message = '✓ Copied Successfully',
  onHide,
  duration = 2000,
}) => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 12, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });

      opacity.value = withDelay(
        duration,
        withTiming(0, { duration: 300 }, (finished) => {
          if (finished) {
            translateY.value = withTiming(100);
            runOnJS(onHide)();
          }
        })
      );
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, animatedStyle]} pointerEvents="none">
      <CheckCircle size={IconSize.sm} color={Colors.darkGreen} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderWidth: Border.width,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
    zIndex: 1000,
  },
  message: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.sm,
    color: Colors.darkGreen,
  },
});
