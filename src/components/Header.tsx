import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../constants';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  rightAction,
}) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <ArrowLeft size={IconSize.md} color={Colors.darkGreen} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.title}>{title.toUpperCase()}</Text>
            {subtitle && (
              <Text style={styles.subtitle}>{subtitle}</Text>
            )}
          </View>
        </View>
        {rightAction && (
          <View style={styles.rightSection}>{rightAction}</View>
        )}
      </View>
      <View style={styles.border} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Spacing.md,
    paddingBottom: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderWidth: Border.width,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    shadowColor: Colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  rightSection: {},
  title: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xxl,
    color: Colors.darkGreen,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.sm,
    color: Colors.darkGreen,
    opacity: 0.8,
    marginTop: 2,
  },
  border: {
    height: Border.width,
    backgroundColor: Colors.border,
  },
});
