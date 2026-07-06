import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors, FontFamily, FontSize, Border, Spacing } from '../constants';
import { SecretCategory } from '../types';
import { CATEGORY_COLORS } from '../utils/mockData';

interface CategoryChipProps {
  label: SecretCategory;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  selected,
  onPress,
  style,
}) => {
  const chipColor = CATEGORY_COLORS[label];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.chip,
        selected && { backgroundColor: chipColor, borderColor: Colors.border },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
        ]}
      >
        {label.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: Border.width,
    borderColor: Colors.border,
    borderRadius: Border.radius,
    backgroundColor: Colors.card,
    marginRight: Spacing.sm,
    shadowColor: Colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    minWidth: 60,
    alignItems: 'center',
  },
  label: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    letterSpacing: 0.8,
  },
  labelSelected: {
    color: Colors.darkGreen,
  },
});
