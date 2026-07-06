import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import {
  Header,
  PixelInput,
  PixelButton,
  PixelCheckbox,
  PixelToast,
  Divider,
} from '../src/components';
import { CATEGORIES, CATEGORY_COLORS } from '../src/utils/mockData';
import { SecretCategory } from '../src/types';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../src/constants';
import { useSecrets } from '../src/hooks/useSecrets';

export default function AddScreen() {
  const router = useRouter();
  const { createSecret } = useSecrets();

  const [title, setTitle] = useState('');
  const [secretValue, setSecretValue] = useState('');
  const [category, setCategory] = useState<SecretCategory>('Passwords');
  const [notes, setNotes] = useState('');
  const [pinned, setPinned] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; value?: string }>({});

  const categories = CATEGORIES.filter((c) => c.label !== 'All');

  const validate = () => {
    const newErrors: { title?: string; value?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!secretValue.trim()) newErrors.value = 'Secret value is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    await createSecret({
      title,
      value: secretValue,
      category,
      notes: notes.trim() || undefined,
      pinned,
    });

    setShowToast(true);
    setTimeout(() => router.back(), 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Add Secret" showBack />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>SECRET DETAILS</Text>
            <Divider />

            <PixelInput
              label="Title"
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
              }}
              placeholder="e.g. Netflix Password"
              error={errors.title}
            />

            <PixelInput
              label="Secret Value"
              value={secretValue}
              onChangeText={(v) => {
                setSecretValue(v);
                if (errors.value) setErrors((e) => ({ ...e, value: undefined }));
              }}
              placeholder="Enter your secret..."
              isSecret
              error={errors.value}
              hint="Your data stays on device only"
            />

            {/* Category Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>CATEGORY</Text>
              <TouchableOpacity
                onPress={() => setDropdownOpen(!dropdownOpen)}
                style={[
                  styles.dropdownTrigger,
                  { borderColor: CATEGORY_COLORS[category] },
                ]}
                accessibilityLabel="Select category"
              >
                <View style={styles.dropdownSelected}>
                  <View
                    style={[
                      styles.categoryDot,
                      { backgroundColor: CATEGORY_COLORS[category] },
                    ]}
                  />
                  <Text style={styles.dropdownSelectedText}>
                    {category.toUpperCase()}
                  </Text>
                </View>
                {dropdownOpen ? (
                  <ChevronUp size={IconSize.sm} color={Colors.darkGreen} />
                ) : (
                  <ChevronDown size={IconSize.sm} color={Colors.darkGreen} />
                )}
              </TouchableOpacity>

              {dropdownOpen && (
                <View style={styles.dropdownList}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.label}
                      onPress={() => {
                        setCategory(cat.label);
                        setDropdownOpen(false);
                      }}
                      style={[
                        styles.dropdownItem,
                        category === cat.label && styles.dropdownItemSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.categoryDot,
                          { backgroundColor: CATEGORY_COLORS[cat.label] },
                        ]}
                      />
                      <Text
                        style={[
                          styles.dropdownItemText,
                          category === cat.label && styles.dropdownItemTextSelected,
                        ]}
                      >
                        {cat.label.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <PixelInput
              label="Notes (Optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add a description or hint..."
              multiline
              numberOfLines={3}
              style={{ height: 80 }}
              containerStyle={{ marginTop: Spacing.md }}
            />

            <Divider label="Options" />

            <PixelCheckbox
              checked={pinned}
              onToggle={() => setPinned(!pinned)}
              label="Pin this secret"
              description="Pinned secrets appear at the top of your list"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <PixelButton
              label="Cancel"
              onPress={() => router.back()}
              variant="secondary"
              style={styles.actionBtn}
            />
            <PixelButton
              label="Save Secret"
              onPress={handleSave}
              variant="primary"
              style={styles.actionBtn}
            />
          </View>

          {/* Tip */}
          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              💡 TIP: Your secrets are stored locally and never leave your device.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <PixelToast
        visible={showToast}
        message="✓ Secret Saved!"
        onHide={() => setShowToast(false)}
        duration={1500}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    padding: Spacing.lg,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    letterSpacing: 2,
  },
  dropdownContainer: {
    marginBottom: Spacing.lg,
  },
  dropdownLabel: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.darkGreen,
    marginBottom: Spacing.xs,
    letterSpacing: 1.5,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.inputBg,
    borderWidth: Border.width,
    borderColor: Colors.border,
    height: 48,
    paddingHorizontal: Spacing.md,
    shadowColor: Colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  dropdownSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  dropdownSelectedText: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.md,
    color: Colors.darkGreen,
  },
  dropdownList: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    borderTopWidth: 0,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  dropdownItemText: {
    fontFamily: FontFamily.pixelMedium,
    fontSize: FontSize.sm,
    color: Colors.mutedText,
  },
  dropdownItemTextSelected: {
    color: Colors.darkGreen,
    fontFamily: FontFamily.pixelBold,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionBtn: {
    flex: 1,
  },
  tipBox: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: Spacing.md,
  },
  tipText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.xs,
    color: Colors.darkGreen,
    lineHeight: 18,
  },
});
