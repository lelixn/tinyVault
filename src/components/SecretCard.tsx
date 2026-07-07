import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  Pin,
  Eye,
  EyeOff,
  Copy,
  Pencil,
  Trash2,
} from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../constants';
import { Secret } from '../types';
import { PixelBadge } from './PixelBadge';

interface SecretCardProps {
  secret: Secret;
  index?: number;
  defaultRevealed?: boolean;
  onShow?: () => void;
  onCopy?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPress?: () => void;
}

const SecretCardComponent: React.FC<SecretCardProps> = ({
  secret,
  index = 0,
  defaultRevealed = false,
  onShow,
  onCopy,
  onEdit,
  onDelete,
  onPress,
}) => {
  const [revealed, setRevealed] = useState(defaultRevealed);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const maskedValue = '•'.repeat(Math.min(secret.value.length, 16));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handlePress = () => {
    scale.value = withSpring(0.97, { damping: 12 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    onPress?.();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify().damping(15)}
      style={animatedStyle}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.92}
        style={styles.card}
        accessibilityLabel={`Secret: ${secret.title}`}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            {secret.pinned && (
              <Pin
                size={IconSize.xs}
                color={Colors.primary}
                fill={Colors.primary}
                style={styles.pinIcon}
              />
            )}
            <Text style={styles.title} numberOfLines={1}>
              {secret.title}
            </Text>
          </View>
          <PixelBadge
            label={secret.category}
            category={secret.category}
          />
        </View>

        {/* Value Row */}
        <View style={styles.valueRow}>
          <Text
            style={[styles.value, !revealed && styles.valueMasked]}
            numberOfLines={1}
          >
            {revealed ? secret.value : maskedValue}
          </Text>
        </View>

        {/* Date */}
        <Text style={styles.date}>
          Added {formatDate(secret.createdAt)}
        </Text>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              setRevealed(!revealed);
              onShow?.();
            }}
            style={[styles.actionBtn, styles.actionBtnShow]}
            accessibilityLabel={revealed ? 'Hide value' : 'Show value'}
          >
            {revealed ? (
              <EyeOff size={IconSize.xs} color={Colors.darkGreen} />
            ) : (
              <Eye size={IconSize.xs} color={Colors.darkGreen} />
            )}
            <Text style={styles.actionBtnText}>{revealed ? 'HIDE' : 'SHOW'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onCopy?.();
            }}
            style={[styles.actionBtn, styles.actionBtnCopy]}
            accessibilityLabel="Copy value"
          >
            <Copy size={IconSize.xs} color={Colors.darkGreen} />
            <Text style={styles.actionBtnText}>COPY</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onEdit?.();
            }}
            style={[styles.actionBtn, styles.actionBtnEdit]}
            accessibilityLabel="Edit secret"
          >
            <Pencil size={IconSize.xs} color={Colors.darkGreen} />
            <Text style={styles.actionBtnText}>EDIT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(event) => {
              event.stopPropagation();
              onDelete?.();
            }}
            style={[styles.actionBtn, styles.actionBtnDelete]}
            accessibilityLabel="Delete secret"
          >
            <Trash2 size={IconSize.xs} color={Colors.white} />
            <Text style={[styles.actionBtnText, { color: Colors.white }]}>DEL</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    borderRadius: Border.radius,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  pinIcon: {
    marginRight: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.lg,
    color: Colors.darkGreen,
    flex: 1,
  },
  valueRow: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  value: {
    fontFamily: FontFamily.pixelMedium,
    fontSize: FontSize.md,
    color: Colors.darkGreen,
  },
  valueMasked: {
    color: Colors.mutedText,
    letterSpacing: 2,
  },
  date: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 3,
    shadowColor: Colors.border,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
  actionBtnShow: {
    backgroundColor: Colors.primaryLight,
  },
  actionBtnCopy: {
    backgroundColor: Colors.warning,
  },
  actionBtnEdit: {
    backgroundColor: Colors.card,
  },
  actionBtnDelete: {
    backgroundColor: Colors.danger,
    borderColor: '#CC4444',
  },
  actionBtnText: {
    fontFamily: FontFamily.pixelBold,
    fontSize: 10,
    color: Colors.darkGreen,
    letterSpacing: 0.5,
  },
});
export const SecretCard = memo(SecretCardComponent);
