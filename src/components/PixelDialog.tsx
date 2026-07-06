import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { AlertTriangle, X } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../constants';
import { PixelButton } from './PixelButton';

interface PixelDialogProps {
  visible: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const PixelDialog: React.FC<PixelDialogProps> = ({
  visible,
  title = 'Confirm',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0.8);
      opacity.value = withTiming(0);
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const dialogStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconColor = variant === 'danger'
    ? Colors.danger
    : variant === 'warning'
    ? Colors.warning
    : Colors.primary;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Animated.View style={[styles.overlayBg, overlayStyle]} />
      </Pressable>

      <View style={styles.centeredView}>
        <Animated.View style={[styles.dialog, dialogStyle]}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={onCancel}
            style={styles.closeButton}
            accessibilityLabel="Close dialog"
          >
            <X size={IconSize.sm} color={Colors.darkGreen} />
          </TouchableOpacity>

          {/* Icon */}
          <View style={[styles.iconContainer, { borderColor: iconColor }]}>
            <AlertTriangle size={IconSize.xl} color={iconColor} strokeWidth={2.5} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title.toUpperCase()}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Actions */}
          <View style={styles.actions}>
            <PixelButton
              label={cancelLabel}
              onPress={onCancel}
              variant="secondary"
              style={styles.actionBtn}
            />
            <PixelButton
              label={confirmLabel}
              onPress={onConfirm}
              variant={variant === 'danger' ? 'danger' : 'primary'}
              style={styles.actionBtn}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'box-none',
  },
  dialog: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    padding: Spacing.xxl,
    width: '85%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: Colors.border,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderWidth: Border.width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xl,
    color: Colors.darkGreen,
    marginBottom: Spacing.sm,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  message: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.mutedText,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
  },
});
