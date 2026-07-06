import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '../constants';

interface DividerProps {
  label?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ label, style }) => {
  if (label) {
    return (
      <View style={[styles.row, style]}>
        <View style={styles.line} />
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <View style={styles.line} />
      </View>
    );
  }

  return <View style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 3,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border,
  },
  label: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    letterSpacing: 1.5,
    paddingHorizontal: Spacing.sm,
  },
});
