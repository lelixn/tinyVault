import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../constants';

interface PixelCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  description?: string;
  style?: ViewStyle;
}

export const PixelCheckbox: React.FC<PixelCheckboxProps> = ({
  checked,
  onToggle,
  label,
  description,
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.85, { damping: 8 }, () => {
      scale.value = withSpring(1, { damping: 8 });
    });
    onToggle();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <Animated.View
        style={[
          animatedStyle,
          styles.box,
          checked && styles.boxChecked,
        ]}
      >
        {checked && (
          <Check size={IconSize.sm} color={Colors.darkGreen} strokeWidth={3} />
        )}
      </Animated.View>
      {(label || description) && (
        <View style={styles.textContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: Border.width,
    borderColor: Colors.border,
    backgroundColor: Colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  boxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.darkGreen,
  },
  textContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  label: {
    fontFamily: FontFamily.pixelMedium,
    fontSize: FontSize.md,
    color: Colors.darkGreen,
  },
  description: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    marginTop: 2,
  },
});
