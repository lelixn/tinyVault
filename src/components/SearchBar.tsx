import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Border, Spacing, Size, IconSize } from '../constants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search secrets...',
  style,
  onClear,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchIcon}>
        <Search size={IconSize.md} color={Colors.darkGreen} strokeWidth={2.5} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.mutedText}
        returnKeyType="search"
        accessibilityLabel="Search secrets"
        accessibilityHint="Type to filter your secrets"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          style={styles.clearButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={IconSize.sm} color={Colors.mutedText} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderWidth: Border.width,
    borderColor: Colors.border,
    borderRadius: Border.radius,
    height: Size.inputHeight + 4,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  searchIcon: {
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.pixelMedium,
    fontSize: FontSize.md,
    color: Colors.darkGreen,
    height: '100%',
  },
  clearButton: {
    paddingHorizontal: Spacing.md,
  },
});
