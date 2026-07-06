import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontFamily, FontSize, Border, Spacing } from '../constants';
import { CATEGORY_COLORS } from '../utils/mockData';
import { SecretCategory } from '../types';

interface PixelBadgeProps {
  label: string;
  category?: SecretCategory;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  size?: 'sm' | 'md';
}

export const PixelBadge: React.FC<PixelBadgeProps> = ({
  label,
  category,
  color,
  textColor,
  style,
  size = 'sm',
}) => {
  const bgColor = color || (category ? CATEGORY_COLORS[category] : Colors.primary);
  const fgColor = textColor || Colors.darkGreen;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bgColor },
        size === 'md' && styles.badgeMd,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: fgColor },
          size === 'md' && styles.labelMd,
        ]}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Border.radius,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  label: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    letterSpacing: 0.8,
  },
  labelMd: {
    fontSize: FontSize.sm,
  },
});
