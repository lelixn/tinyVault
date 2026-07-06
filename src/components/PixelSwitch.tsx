import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import { Colors, FontFamily, FontSize, Border, Spacing } from '../constants';

interface PixelSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  description?: string;
  style?: ViewStyle;
}

export const PixelSwitch: React.FC<PixelSwitchProps> = ({
  value,
  onValueChange,
  label,
  description,
  style,
}) => {
  const progress = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, { damping: 12, stiffness: 200 });
  }, [value]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(progress.value * 24, { damping: 12, stiffness: 200 }),
      },
    ],
  }));

  const trackColor = useDerivedValue(() =>
    interpolateColor(
      progress.value,
      [0, 1],
      [Colors.inputBg, Colors.primary]
    )
  );

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: trackColor.value,
    borderColor: progress.value > 0.5 ? Colors.darkGreen : Colors.border,
  }));

  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => onValueChange(!value)}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Animated.View style={[styles.track, trackStyle]}>
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.lg,
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
  track: {
    width: 52,
    height: 28,
    borderRadius: 0,
    borderWidth: Border.width,
    justifyContent: 'center',
    paddingHorizontal: 2,
    shadowColor: Colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 2,
  },
});
