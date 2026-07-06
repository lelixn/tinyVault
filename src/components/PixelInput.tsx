import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Border, Spacing, Size, IconSize } from '../constants';

interface PixelInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  isSecret?: boolean;
}

export const PixelInput: React.FC<PixelInputProps> = ({
  label,
  error,
  hint,
  icon,
  containerStyle,
  isSecret = false,
  secureTextEntry,
  ...rest
}) => {
  const [showSecret, setShowSecret] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPasswordField = isSecret || secureTextEntry;
  const actualSecure = isPasswordField ? !showSecret : false;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>{label.toUpperCase()}</Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          placeholderTextColor={Colors.mutedText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={actualSecure}
          {...rest}
        />
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setShowSecret(!showSecret)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {showSecret ? (
              <EyeOff size={IconSize.sm} color={Colors.mutedText} />
            ) : (
              <Eye size={IconSize.sm} color={Colors.mutedText} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.darkGreen,
    marginBottom: Spacing.xs,
    letterSpacing: 1.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderWidth: Border.width,
    borderColor: Colors.border,
    borderRadius: Border.radius,
    height: Size.inputHeight,
    shadowColor: Colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.card,
    shadowColor: Colors.primary,
  },
  inputError: {
    borderColor: Colors.danger,
    shadowColor: Colors.danger,
  },
  iconContainer: {
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.pixelMedium,
    fontSize: FontSize.md,
    color: Colors.darkGreen,
    paddingHorizontal: Spacing.md,
    height: '100%',
  },
  inputWithIcon: {
    paddingLeft: Spacing.xs,
  },
  eyeButton: {
    padding: Spacing.md,
  },
  errorText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.xs,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
  hintText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    marginTop: Spacing.xs,
  },
});
