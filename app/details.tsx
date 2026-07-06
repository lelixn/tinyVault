import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Eye,
  EyeOff,
  Copy,
  Pencil,
  Trash2,
  Pin,
  Calendar,
  FileText,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Header,
  PixelButton,
  PixelBadge,
  PixelToast,
  PixelDialog,
  PixelModal,
  PixelInput,
  PixelCheckbox,
  Divider,
} from '../src/components';
import { MOCK_SECRETS } from '../src/utils/mockData';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../src/constants';
import { Secret } from '../src/types';

export default function DetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const secret = MOCK_SECRETS.find((s) => s.id === id) || MOCK_SECRETS[0];

  const [revealed, setRevealed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('✓ Copied!');
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(secret.title);
  const [editValue, setEditValue] = useState(secret.value);
  const [editNotes, setEditNotes] = useState(secret.notes || '');
  const [editPinned, setEditPinned] = useState(secret.pinned);

  const maskedValue = '•'.repeat(Math.min(secret.value.length, 24));

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleCopy = () => {
    setToastMsg('✓ Copied to Clipboard');
    setShowToast(true);
  };

  const handleDelete = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Details"
        showBack
        rightAction={
          <TouchableOpacity
            onPress={() => setShowEdit(true)}
            style={styles.editHeaderBtn}
          >
            <Pencil size={IconSize.sm} color={Colors.darkGreen} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Card */}
        <Animated.View
          entering={FadeInDown.delay(0).springify().damping(15)}
          style={styles.titleCard}
        >
          {secret.pinned && (
            <View style={styles.pinnedBanner}>
              <Pin size={IconSize.xs} color={Colors.darkGreen} fill={Colors.darkGreen} />
              <Text style={styles.pinnedText}>PINNED SECRET</Text>
            </View>
          )}
          <Text style={styles.secretTitle}>{secret.title}</Text>
          <PixelBadge label={secret.category} category={secret.category} size="md" />
        </Animated.View>

        {/* Value Card */}
        <Animated.View
          entering={FadeInDown.delay(80).springify().damping(15)}
          style={styles.valueCard}
        >
          <View style={styles.valueLabelRow}>
            <Text style={styles.valueLabel}>SECRET VALUE</Text>
            <TouchableOpacity
              onPress={() => setRevealed(!revealed)}
              style={styles.toggleBtn}
            >
              {revealed ? (
                <EyeOff size={IconSize.sm} color={Colors.darkGreen} />
              ) : (
                <Eye size={IconSize.sm} color={Colors.darkGreen} />
              )}
              <Text style={styles.toggleText}>
                {revealed ? 'HIDE' : 'SHOW'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.valueBox}>
            <Text
              style={[styles.value, !revealed && styles.valueMasked]}
              selectable={revealed}
            >
              {revealed ? secret.value : maskedValue}
            </Text>
          </View>

          <PixelButton
            label="Copy to Clipboard"
            onPress={handleCopy}
            variant="warning"
            icon={<Copy size={IconSize.sm} color={Colors.darkGreen} />}
            fullWidth
            style={{ marginTop: Spacing.md }}
          />
        </Animated.View>

        {/* Notes Card */}
        {secret.notes && (
          <Animated.View
            entering={FadeInDown.delay(160).springify().damping(15)}
            style={styles.infoCard}
          >
            <View style={styles.infoHeader}>
              <FileText size={IconSize.sm} color={Colors.darkGreen} />
              <Text style={styles.infoTitle}>NOTES</Text>
            </View>
            <Text style={styles.notesText}>{secret.notes}</Text>
          </Animated.View>
        )}

        {/* Metadata Card */}
        <Animated.View
          entering={FadeInDown.delay(240).springify().damping(15)}
          style={styles.infoCard}
        >
          <View style={styles.infoHeader}>
            <Calendar size={IconSize.sm} color={Colors.darkGreen} />
            <Text style={styles.infoTitle}>DETAILS</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>CREATED</Text>
            <Text style={styles.metaValue}>{formatDate(secret.createdAt)}</Text>
          </View>

          <Divider />

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>CATEGORY</Text>
            <Text style={styles.metaValue}>{secret.category}</Text>
          </View>

          <Divider />

          <View style={styles.metaRow}>
            <Text style={styles.metaKey}>PINNED</Text>
            <Text style={styles.metaValue}>{secret.pinned ? 'YES 📌' : 'NO'}</Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInDown.delay(320).springify().damping(15)}
          style={styles.actionsCard}
        >
          <PixelButton
            label="Edit Secret"
            onPress={() => setShowEdit(true)}
            variant="secondary"
            icon={<Pencil size={IconSize.sm} color={Colors.darkGreen} />}
            fullWidth
            style={{ marginBottom: Spacing.md }}
          />
          <PixelButton
            label="Delete Secret"
            onPress={() => setShowDelete(true)}
            variant="danger"
            icon={<Trash2 size={IconSize.sm} color={Colors.white} />}
            fullWidth
          />
        </Animated.View>
      </ScrollView>

      <PixelToast
        visible={showToast}
        message={toastMsg}
        onHide={() => setShowToast(false)}
      />

      <PixelDialog
        visible={showDelete}
        title="Delete Secret"
        message={`Are you sure you want to delete "${secret.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        variant="danger"
      />

      <PixelModal
        visible={showEdit}
        title="Edit Secret"
        onClose={() => setShowEdit(false)}
      >
        <PixelInput
          label="Title"
          value={editTitle}
          onChangeText={setEditTitle}
          placeholder="Secret title"
        />
        <PixelInput
          label="Secret Value"
          value={editValue}
          onChangeText={setEditValue}
          placeholder="Secret value"
          isSecret
        />
        <PixelInput
          label="Notes"
          value={editNotes}
          onChangeText={setEditNotes}
          placeholder="Optional notes"
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
        />
        <PixelCheckbox
          checked={editPinned}
          onToggle={() => setEditPinned(!editPinned)}
          label="Pinned"
          description="Show at top of list"
        />
        <View style={styles.editActions}>
          <PixelButton
            label="Cancel"
            onPress={() => setShowEdit(false)}
            variant="secondary"
            style={styles.editBtn}
          />
          <PixelButton
            label="Save"
            onPress={() => {
              setShowEdit(false);
              setToastMsg('✓ Secret Updated');
              setShowToast(true);
            }}
            variant="primary"
            style={styles.editBtn}
          />
        </View>
      </PixelModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  editHeaderBtn: {
    width: 40,
    height: 40,
    borderWidth: Border.width,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
    gap: Spacing.lg,
  },
  titleCard: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    padding: Spacing.xl,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  pinnedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  pinnedText: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.darkGreen,
    letterSpacing: 1,
  },
  secretTitle: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xxxl,
    color: Colors.darkGreen,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  valueCard: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    padding: Spacing.lg,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  valueLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  valueLabel: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    letterSpacing: 2,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  toggleText: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.darkGreen,
  },
  valueBox: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: Spacing.md,
    minHeight: 60,
    justifyContent: 'center',
  },
  value: {
    fontFamily: FontFamily.pixelMedium,
    fontSize: FontSize.md,
    color: Colors.darkGreen,
    lineHeight: 22,
  },
  valueMasked: {
    color: Colors.mutedText,
    letterSpacing: 3,
    fontSize: FontSize.xl,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    padding: Spacing.lg,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  infoTitle: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.sm,
    color: Colors.darkGreen,
    letterSpacing: 2,
  },
  notesText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.mutedText,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  metaKey: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    letterSpacing: 1.5,
  },
  metaValue: {
    fontFamily: FontFamily.pixelMedium,
    fontSize: FontSize.sm,
    color: Colors.darkGreen,
    textAlign: 'right',
    flex: 1,
    marginLeft: Spacing.md,
  },
  actionsCard: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    padding: Spacing.lg,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  editBtn: {
    flex: 1,
  },
});
