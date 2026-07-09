import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Info, Lock } from 'lucide-react-native';
import {
  SearchBar,
  CategoryChip,
  SecretCard,
  SecretCardSkeleton,
  FloatingButton,
  EmptyState,
  PixelToast,
  PixelDialog,
  PixelModal,
  PixelInput,
  PixelButton,
  PixelCheckbox,
} from '../src/components';
import type { ToastVariant } from '../src/components/PixelToast';
import { CATEGORIES } from '../src/utils/mockData';
import { Secret, SecretCategory } from '../src/types';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../src/constants';
import { useVault } from '../src/hooks/useVault';
import { filterSecrets } from '../src/utils/secrets';
import { copyToClipboard } from '../src/utils/clipboard';
import {
  triggerCopyHaptic,
  triggerDeleteHaptic,
  triggerErrorHaptic,
  triggerSelectionHaptic,
  triggerSuccessHaptic,
} from '../src/utils/haptics';

const SKELETON_COUNT = 4;

export default function HomeScreen() {
  const router = useRouter();
  const { secrets, settings, isLoading, updateSecret, deleteSecret } = useVault();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SecretCategory>('All');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('✓ Copied Successfully');
  const [toastVariant, setToastVariant] = useState<ToastVariant>('success');
  const [deleteDialog, setDeleteDialog] = useState<{ visible: boolean; secretId: string | null }>({
    visible: false,
    secretId: null,
  });
  const [editModal, setEditModal] = useState<{ visible: boolean; secret: Secret | null }>({
    visible: false,
    secret: null,
  });
  const [editTitle, setEditTitle] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPinned, setEditPinned] = useState(false);

  const defaultRevealed = !settings.defaultHidden;

  const filteredSecrets = useMemo(
    () => filterSecrets(secrets, searchQuery, selectedCategory),
    [secrets, searchQuery, selectedCategory]
  );

  const showSuccessToast = useCallback((message: string) => {
    setToastVariant('success');
    setToastMessage(message);
    setShowToast(true);
  }, []);

  const handleCopy = useCallback(async (value: string) => {
    try {
      await copyToClipboard(value);
      await triggerCopyHaptic(settings.hapticFeedback);
      showSuccessToast('✓ Copied Successfully');
    } catch {
      await triggerErrorHaptic(settings.hapticFeedback);
      setToastVariant('error');
      setToastMessage('Failed to copy to clipboard');
      setShowToast(true);
    }
  }, [settings.hapticFeedback, showSuccessToast]);

  const handleDeletePress = useCallback((secretId: string) => {
    setDeleteDialog({ visible: true, secretId });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteDialog.secretId) return;

    try {
      await deleteSecret(deleteDialog.secretId);
      setDeleteDialog({ visible: false, secretId: null });
      await triggerDeleteHaptic(settings.hapticFeedback);
      showSuccessToast('✓ Secret Deleted');
    } catch {
      await triggerErrorHaptic(settings.hapticFeedback);
      setDeleteDialog({ visible: false, secretId: null });
      setToastVariant('error');
      setToastMessage('Failed to delete secret');
      setShowToast(true);
    }
  }, [deleteDialog.secretId, deleteSecret, settings.hapticFeedback, showSuccessToast]);

  const handleEditPress = useCallback((secret: Secret) => {
    setEditTitle(secret.title);
    setEditValue(secret.value);
    setEditNotes(secret.notes || '');
    setEditPinned(secret.pinned);
    setEditModal({ visible: true, secret });
  }, []);

  const handleEditSave = useCallback(async () => {
    if (!editModal.secret) return;

    if (!editTitle.trim() || !editValue.trim()) {
      setToastVariant('error');
      setToastMessage('Title and secret value are required');
      setShowToast(true);
      return;
    }

    try {
      await updateSecret(editModal.secret.id, {
        title: editTitle,
        value: editValue,
        notes: editNotes,
        pinned: editPinned,
      });
      setEditModal({ visible: false, secret: null });
      await triggerSuccessHaptic(settings.hapticFeedback);
      showSuccessToast('✓ Secret Updated');
    } catch {
      await triggerErrorHaptic(settings.hapticFeedback);
      setToastVariant('error');
      setToastMessage('Failed to update secret');
      setShowToast(true);
    }
  }, [
    editModal.secret,
    editTitle,
    editValue,
    editNotes,
    editPinned,
    updateSecret,
    settings.hapticFeedback,
    showSuccessToast,
  ]);

  const handleShowToggle = useCallback(async () => {
    await triggerSelectionHaptic(settings.hapticFeedback);
  }, [settings.hapticFeedback]);

  const renderItem: ListRenderItem<Secret> = useCallback(
    ({ item, index }) => (
      <SecretCard
        secret={item}
        index={index}
        defaultRevealed={defaultRevealed}
        onShow={handleShowToggle}
        onCopy={() => handleCopy(item.value)}
        onEdit={() => handleEditPress(item)}
        onDelete={() => handleDeletePress(item.id)}
        onPress={() =>
          router.push({
            pathname: '/details',
            params: { id: item.id },
          })
        }
      />
    ),
    [
      defaultRevealed,
      handleShowToggle,
      handleCopy,
      handleEditPress,
      handleDeletePress,
      router,
    ]
  );

  const keyExtractor = useCallback((item: Secret) => item.id, []);

  const listEmpty = !isLoading && filteredSecrets.length === 0;
  const showSkeleton = isLoading;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoIcon}>
            <Lock size={IconSize.md} color={Colors.darkGreen} strokeWidth={2.5} />
          </View>
          <View>
            <Text style={styles.headerTitle}>TinyVault 🔒</Text>
            <Text style={styles.headerSubtitle}>Your Offline Secret Locker</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            style={styles.headerIconBtn}
            accessibilityLabel="Settings"
          >
            <Settings size={IconSize.md} color={Colors.darkGreen} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/about')}
            style={styles.headerIconBtn}
            accessibilityLabel="About"
          >
            <Info size={IconSize.md} color={Colors.darkGreen} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.headerBorder} />

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search secrets..."
        />
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat.label}
            label={cat.label}
            selected={selectedCategory === cat.label}
            onPress={() => setSelectedCategory(cat.label)}
          />
        ))}
      </ScrollView>

      {/* Secret Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {isLoading ? '...' : filteredSecrets.length} SECRET{filteredSecrets.length !== 1 ? 'S' : ''}
        </Text>
        <View style={styles.secureTag}>
          <Text style={styles.secureText}>🔒 OFFLINE</Text>
        </View>
      </View>

      {/* Secret List */}
      {showSkeleton ? (
        <View style={styles.listContent}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <SecretCardSkeleton key={`skeleton-${index}`} index={index} />
          ))}
        </View>
      ) : listEmpty ? (
        <EmptyState
          title="No Secrets Found"
          description={
            searchQuery || selectedCategory !== 'All'
              ? searchQuery
                ? `No secrets match "${searchQuery}"`
                : `No secrets in ${selectedCategory}`
              : 'Store passwords, notes and important information securely.'
          }
          onAction={() => router.push('/add')}
          actionLabel="+ Add Secret"
        />
      ) : (
        <FlatList
          data={filteredSecrets}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews
        />
      )}

      {/* Floating Action Button */}
      {!isLoading && <FloatingButton onPress={() => router.push('/add')} />}

      {/* Toast */}
      <PixelToast
        visible={showToast}
        message={toastMessage}
        variant={toastVariant}
        onHide={() => setShowToast(false)}
      />

      {/* Delete Dialog */}
      <PixelDialog
        visible={deleteDialog.visible}
        title="Delete Secret"
        message="Are you sure you want to delete this secret? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ visible: false, secretId: null })}
        variant="danger"
      />

      {/* Edit Modal */}
      <PixelModal
        visible={editModal.visible}
        title="Edit Secret"
        onClose={() => setEditModal({ visible: false, secret: null })}
      >
        <PixelInput
          label="Title"
          value={editTitle}
          onChangeText={setEditTitle}
          placeholder="e.g. Netflix Password"
        />
        <PixelInput
          label="Secret Value"
          value={editValue}
          onChangeText={setEditValue}
          placeholder="Enter the secret..."
          isSecret
        />
        <PixelInput
          label="Notes (Optional)"
          value={editNotes}
          onChangeText={setEditNotes}
          placeholder="Add notes..."
          multiline
          numberOfLines={3}
          style={{ height: 80 }}
        />
        <PixelCheckbox
          checked={editPinned}
          onToggle={() => setEditPinned(!editPinned)}
          label="Pin this secret"
          description="Pinned secrets appear at the top"
        />
        <View style={styles.editActions}>
          <PixelButton
            label="Cancel"
            onPress={() => setEditModal({ visible: false, secret: null })}
            variant="secondary"
            style={styles.editBtn}
          />
          <PixelButton
            label="Save"
            onPress={handleEditSave}
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
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderWidth: Border.width,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xl,
    color: Colors.darkGreen,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.xs,
    color: Colors.darkGreen,
    opacity: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderWidth: Border.width,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBorder: {
    height: Border.width,
    backgroundColor: Colors.border,
  },
  searchSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  countText: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    letterSpacing: 1.5,
  },
  secureTag: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  secureText: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.darkGreen,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: 100,
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
