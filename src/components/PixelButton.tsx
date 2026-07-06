import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors, FontFamily, FontSize, Border, Spacing, Size } from '../constants';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type PixelButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'warning';
type PixelButtonSize = 'sm' | 'md' | 'lg';

interface PixelButtonProps {
  label: string;
  onPress: () => void;
  variant?: PixelButtonVariant;
  size?: PixelButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<PixelButtonVariant, { bg: string; text: string; border: string; shadow: string }> = {
  primary: {
    bg: Colors.primary,
    text: Colors.darkGreen,
    border: Colors.border,
    shadow: Colors.border,
  },
  secondary: {
    bg: Colors.card,
    text: Colors.darkGreen,
    border: Colors.border,
    shadow: Colors.border,
  },
  danger: {
    bg: Colors.danger,
    text: Colors.white,
    border: '#CC4444',
    shadow: '#CC4444',
  },
  ghost: {
    bg: 'transparent',
    text: Colors.darkGreen,
    border: Colors.border,
    shadow: Colors.border,
  },
  warning: {
    bg: Colors.warning,
    text: Colors.darkGreen,
    border: '#CC9900',
    shadow: '#CC9900',
  },
};

const sizeStyles: Record<PixelButtonSize, { height: number; px: number; fontSize: number }> = {
  sm: { height: 36, px: Spacing.md, fontSize: FontSize.sm },
  md: { height: Size.buttonHeight, px: Spacing.lg, fontSize: FontSize.md },
  lg: { height: 56, px: Spacing.xxl, fontSize: FontSize.lg },
};

export const PixelButton: React.FC<PixelButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  const vs = variantStyles[variant];
  const ss = sizeStyles[size];
  const opacity = disabled || loading ? 0.5 : 1;

  return (
    <Animated.View style={[animatedStyle, fullWidth && styles.fullWidth, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[
          styles.button,
          {
            backgroundColor: vs.bg,
            borderColor: vs.border,
            height: ss.height,
            paddingHorizontal: ss.px,
            opacity,
            shadowColor: vs.shadow,
          },
          fullWidth && styles.fullWidth,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={vs.text} />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === 'left' && (
              <View style={styles.iconLeft}>{icon}</View>
            )}
            <Text
              style={[
                styles.label,
                { color: vs.text, fontSize: ss.fontSize },
                textStyle,
              ]}
            >
              {label}
            </Text>
            {icon && iconPosition === 'right' && (
              <View style={styles.iconRight}>{icon}</View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: Border.width,
    borderRadius: Border.radius,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  label: {
    fontFamily: FontFamily.pixelBold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
