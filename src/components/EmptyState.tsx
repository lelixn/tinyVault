import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Lock } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../constants';
import { PixelButton } from './PixelButton';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Secrets Yet',
  description = 'Store passwords, notes and important information securely.',
  actionLabel = '+ Add Secret',
  onAction,
  style,
}) => {
  return (
    <Animated.View
      entering={FadeIn.delay(200).duration(400)}
      style={[styles.container, style]}
    >
      {/* Pixel Vault Illustration */}
      <View style={styles.illustration}>
        <View style={styles.vaultOuter}>
          <View style={styles.vaultInner}>
            <Lock size={IconSize.xxl} color={Colors.darkGreen} strokeWidth={2} />
          </View>
          {/* Pixel dots */}
          <View style={[styles.pixel, styles.pixelTL]} />
          <View style={[styles.pixel, styles.pixelTR]} />
          <View style={[styles.pixel, styles.pixelBL]} />
          <View style={[styles.pixel, styles.pixelBR]} />
        </View>
        {/* Stars */}
        <View style={styles.starsRow}>
          {['★', '✦', '★'].map((star, i) => (
            <Text key={i} style={[styles.star, i === 1 && styles.starLarge]}>
              {star}
            </Text>
          ))}
        </View>
      </View>

      <Text style={styles.title}>{title.toUpperCase()}</Text>
      <Text style={styles.description}>{description}</Text>

      {onAction && (
        <PixelButton
          label={actionLabel}
          onPress={onAction}
          variant="primary"
          size="lg"
          style={styles.button}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    paddingTop: Spacing.huge,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  vaultOuter: {
    width: 120,
    height: 120,
    borderWidth: Border.width + 1,
    borderColor: Colors.border,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.border,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    marginBottom: Spacing.md,
    position: 'relative',
  },
  vaultInner: {
    width: 80,
    height: 80,
    borderWidth: Border.width,
    borderColor: Colors.darkGreen,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pixel: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: Colors.darkGreen,
  },
  pixelTL: { top: 4, left: 4 },
  pixelTR: { top: 4, right: 4 },
  pixelBL: { bottom: 4, left: 4 },
  pixelBR: { bottom: 4, right: 4 },
  starsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
    color: Colors.darkGreen,
    opacity: 0.6,
  },
  starLarge: {
    fontSize: 24,
    opacity: 1,
  },
  title: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xxl,
    color: Colors.darkGreen,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.mutedText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
    maxWidth: 280,
  },
  button: {
    minWidth: 200,
  },
});
