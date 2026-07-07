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
import { AlertCircle, CheckCircle, Info } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../constants';

export type ToastVariant = 'success' | 'error' | 'info';

interface PixelToastProps {
  visible: boolean;
  message?: string;
  variant?: ToastVariant;
  onHide: () => void;
  duration?: number;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { backgroundColor: string; borderColor: string; Icon: typeof CheckCircle }
> = {
  success: {
    backgroundColor: Colors.primary,
    borderColor: Colors.border,
    Icon: CheckCircle,
  },
  error: {
    backgroundColor: Colors.danger,
    borderColor: '#CC4444',
    Icon: AlertCircle,
  },
  info: {
    backgroundColor: Colors.warning,
    borderColor: Colors.border,
    Icon: Info,
  },
};

export const PixelToast: React.FC<PixelToastProps> = ({
  visible,
  message = '✓ Copied Successfully',
  variant = 'success',
  onHide,
  duration = 2000,
}) => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const variantStyle = VARIANT_STYLES[variant];
  const IconComponent = variantStyle.Icon;
  const textColor = variant === 'error' ? Colors.white : Colors.darkGreen;
  const iconColor = variant === 'error' ? Colors.white : Colors.darkGreen;

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
  }, [visible, duration, onHide, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    >
      <IconComponent size={IconSize.sm} color={iconColor} />
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
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
    borderWidth: Border.width,
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
  },
});
