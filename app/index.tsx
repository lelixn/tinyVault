import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Info, Lock } from 'lucide-react-native';
import {
  SearchBar,
  CategoryChip,
  SecretCard,
  FloatingButton,
  EmptyState,
  PixelToast,
  PixelDialog,
  PixelModal,
  PixelInput,
  PixelButton,
  PixelCheckbox,
} from '../src/components';
import { MOCK_SECRETS, CATEGORIES } from '../src/utils/mockData';
import { Secret, SecretCategory } from '../src/types';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../src/constants';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SecretCategory>('All');
  const [secrets, setSecrets] = useState<Secret[]>(MOCK_SECRETS);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('✓ Copied Successfully');
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

  // Filtered secrets
  const filteredSecrets = useMemo(() => {
    return secrets.filter((s) => {
      const matchesCategory =
        selectedCategory === 'All' || s.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [secrets, selectedCategory, searchQuery]);

  const handleCopy = (value: string) => {
    setToastMessage('✓ Copied Successfully');
    setShowToast(true);
  };

  const handleDeletePress = (secretId: string) => {
    setDeleteDialog({ visible: true, secretId });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.secretId) {
      setSecrets((prev) => prev.filter((s) => s.id !== deleteDialog.secretId));
      setDeleteDialog({ visible: false, secretId: null });
    }
  };

  const handleEditPress = (secret: Secret) => {
    setEditTitle(secret.title);
    setEditValue(secret.value);
    setEditNotes(secret.notes || '');
    setEditPinned(secret.pinned);
    setEditModal({ visible: true, secret });
  };

  const handleEditSave = () => {
    if (editModal.secret) {
      setSecrets((prev) =>
        prev.map((s) =>
          s.id === editModal.secret!.id
            ? {
                ...s,
                title: editTitle,
                value: editValue,
                notes: editNotes,
                pinned: editPinned,
                updatedAt: new Date().toISOString(),
              }
            : s
        )
      );
      setEditModal({ visible: false, secret: null });
      setToastMessage('✓ Secret Updated');
      setShowToast(true);
    }
  };

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
          {filteredSecrets.length} SECRET{filteredSecrets.length !== 1 ? 'S' : ''}
        </Text>
        <View style={styles.secureTag}>
          <Text style={styles.secureText}>🔒 OFFLINE</Text>
        </View>
      </View>

      {/* Secret List */}
      {filteredSecrets.length === 0 ? (
        <EmptyState
          title="No Secrets Found"
          description={
            searchQuery
              ? `No secrets match "${searchQuery}"`
              : 'Store passwords, notes and important information securely.'
          }
          onAction={() => router.push('/add')}
          actionLabel="+ Add Secret"
        />
      ) : (
        <FlatList
          data={filteredSecrets}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <SecretCard
              secret={item}
              index={index}
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
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      )}

      {/* Floating Action Button */}
      <FloatingButton onPress={() => router.push('/add')} />

      {/* Toast */}
      <PixelToast
        visible={showToast}
        message={toastMessage}
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
