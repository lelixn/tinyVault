import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Moon,
  Fingerprint,
  Lock,
  Clock,
  Download,
  Upload,
  Info,
  Shield,
  ChevronRight,
} from 'lucide-react-native';
import {
  Header,
  PixelSwitch,
  Divider,
} from '../src/components';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../src/constants';
import { APP_VERSION } from '../src/utils/mockData';
import { useVault } from '../src/hooks/useVault';
import { triggerErrorHaptic, triggerSelectionHaptic, triggerSuccessHaptic } from '../src/utils/haptics';

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  type: 'switch' | 'navigate' | 'info';
  value?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  info?: string;
  infoPressable?: boolean;
  delay?: number;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  label,
  description,
  type,
  value,
  onToggle,
  onPress,
  info,
  infoPressable = false,
  delay = 0,
}) => {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify().damping(15)}>
      {type === 'switch' ? (
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>{icon}</View>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>{label}</Text>
              {description && (
                <Text style={styles.settingDesc}>{description}</Text>
              )}
            </View>
          </View>
          {onToggle && (
            <PixelSwitch
              value={value || false}
              onValueChange={onToggle}
            />
          )}
        </View>
      ) : type === 'navigate' ? (
        <TouchableOpacity onPress={onPress} style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>{icon}</View>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>{label}</Text>
              {description && (
                <Text style={styles.settingDesc}>{description}</Text>
              )}
            </View>
          </View>
          <ChevronRight size={IconSize.sm} color={Colors.mutedText} />
        </TouchableOpacity>
      ) : infoPressable ? (
        <TouchableOpacity onPress={onPress} style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>{icon}</View>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>{label}</Text>
              {description && (
                <Text style={styles.settingDesc}>{description}</Text>
              )}
            </View>
          </View>
          {info && <Text style={styles.infoText}>{info}</Text>}
        </TouchableOpacity>
      ) : (
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>{icon}</View>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>{label}</Text>
              {description && (
                <Text style={styles.settingDesc}>{description}</Text>
              )}
            </View>
          </View>
          {info && <Text style={styles.infoText}>{info}</Text>}
        </View>
      )}
    </Animated.View>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, biometric, statistics } = useVault();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const autoLockLabel = useMemo(() => {
    switch (settings.autoLockTimeoutSeconds) {
      case 30:
        return '30s';
      case 60:
        return '1m';
      case 300:
        return '5m';
      default:
        return 'Never';
    }
  }, [settings.autoLockTimeoutSeconds]);

  const storageUsage = `${(statistics.approximateStorageBytes / 1024).toFixed(2)} KB`;

  const cycleAutoLockDuration = async () => {
    const options: Array<0 | 30 | 60 | 300> = [30, 60, 300, 0];
    const currentIndex = options.indexOf(settings.autoLockTimeoutSeconds);
    const next = options[(currentIndex + 1) % options.length];
    await updateSettings({
      autoLockTimeoutSeconds: next,
      autoLock: next !== 0,
    });
    await triggerSelectionHaptic(settings.hapticFeedback);
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value && (!biometric.hasHardware || !biometric.isEnrolled)) {
      setStatusMessage(
        !biometric.hasHardware
          ? 'Biometric hardware is not available on this device.'
          : 'No biometrics enrolled on this device.'
      );
      await triggerErrorHaptic(settings.hapticFeedback);
      return;
    }

    await updateSettings({ biometricLock: value });
    await triggerSuccessHaptic(settings.hapticFeedback);
    setStatusMessage(value ? 'Biometric protection enabled.' : 'Biometric protection disabled.');
  };

  const formatCategoryStats = useMemo(() => {
    const entries = Object.entries(statistics.categories);
    if (!entries.length) {
      return 'No categories yet';
    }
    return entries.map(([key, count]) => `${key}: ${count}`).join(' • ');
  }, [statistics.categories]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="Settings" showBack />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Security Section */}
        <Animated.View
          entering={FadeInDown.delay(0).springify().damping(15)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>🔒 SECURITY</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon={<Fingerprint size={IconSize.sm} color={Colors.darkGreen} />}
              label="Biometric Lock"
              description="Use fingerprint or face unlock"
              type="switch"
              value={settings.biometricLock}
              onToggle={(value) => {
                void handleBiometricToggle(value);
              }}
              delay={60}
            />
            <Divider />
            <SettingRow
              icon={<Lock size={IconSize.sm} color={Colors.darkGreen} />}
              label="PIN Lock"
              description="Protect with a 4-digit PIN"
              type="switch"
              value={settings.pinLock}
              onToggle={(value) => {
                void updateSettings({ pinLock: value });
              }}
              delay={100}
            />
            <Divider />
            <SettingRow
              icon={<Clock size={IconSize.sm} color={Colors.darkGreen} />}
              label="Auto Lock"
              description="Tap to cycle: 30s, 1m, 5m, Never"
              type="info"
              info={autoLockLabel}
              infoPressable
              onPress={() => {
                void cycleAutoLockDuration();
              }}
              delay={140}
            />
          </View>
        </Animated.View>

        {/* Appearance Section */}
        <Animated.View
          entering={FadeInDown.delay(180).springify().damping(15)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>🎨 APPEARANCE</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon={<Moon size={IconSize.sm} color={Colors.darkGreen} />}
              label="Dark Mode"
              description="Switch to dark theme (UI only)"
              type="switch"
              value={settings.darkMode}
              onToggle={(value) => {
                void updateSettings({ darkMode: value });
              }}
              delay={220}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(500).springify().damping(15)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>📊 STATISTICS</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon={<Shield size={IconSize.sm} color={Colors.darkGreen} />}
              label="Protected Status"
              type="info"
              info={statistics.protectedStatus}
              delay={530}
            />
            <Divider />
            <SettingRow
              icon={<Info size={IconSize.sm} color={Colors.darkGreen} />}
              label="Total Secrets"
              type="info"
              info={`${statistics.totalSecrets}`}
              delay={560}
            />
            <Divider />
            <SettingRow
              icon={<Info size={IconSize.sm} color={Colors.darkGreen} />}
              label="Pinned Secrets"
              type="info"
              info={`${statistics.pinnedSecrets}`}
              delay={590}
            />
            <Divider />
            <SettingRow
              icon={<Info size={IconSize.sm} color={Colors.darkGreen} />}
              label="Categories"
              description={formatCategoryStats}
              type="info"
              info={`${Object.keys(statistics.categories).length}`}
              delay={620}
            />
            <Divider />
            <SettingRow
              icon={<Info size={IconSize.sm} color={Colors.darkGreen} />}
              label="Recently Added"
              description={
                statistics.recentlyAdded.length
                  ? statistics.recentlyAdded.map((secret) => secret.title).join(', ')
                  : 'No secrets yet'
              }
              type="info"
              info={`${statistics.recentlyAdded.length}`}
              delay={650}
            />
            <Divider />
            <SettingRow
              icon={<Info size={IconSize.sm} color={Colors.darkGreen} />}
              label="Oldest Secret"
              type="info"
              info={statistics.oldestSecret?.title ?? '-'}
              delay={680}
            />
            <Divider />
            <SettingRow
              icon={<Info size={IconSize.sm} color={Colors.darkGreen} />}
              label="Newest Secret"
              type="info"
              info={statistics.newestSecret?.title ?? '-'}
              delay={710}
            />
            <Divider />
            <SettingRow
              icon={<Info size={IconSize.sm} color={Colors.darkGreen} />}
              label="Approx. Storage Usage"
              type="info"
              info={storageUsage}
              delay={740}
            />
          </View>
        </Animated.View>

        {/* Data Section */}
        <Animated.View
          entering={FadeInDown.delay(260).springify().damping(15)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>💾 DATA</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon={<Download size={IconSize.sm} color={Colors.darkGreen} />}
              label="Backup"
              description="Export an encrypted backup"
              type="navigate"
              onPress={() => {}}
              delay={300}
            />
            <Divider />
            <SettingRow
              icon={<Upload size={IconSize.sm} color={Colors.darkGreen} />}
              label="Export"
              description="Export secrets as encrypted file"
              type="navigate"
              onPress={() => {}}
              delay={330}
            />
            <Divider />
            <SettingRow
              icon={<Download size={IconSize.sm} color={Colors.darkGreen} />}
              label="Import"
              description="Restore from a backup file"
              type="navigate"
              onPress={() => {}}
              delay={360}
            />
          </View>
        </Animated.View>

        {/* About Section */}
        <Animated.View
          entering={FadeInDown.delay(400).springify().damping(15)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>ℹ️ ABOUT</Text>
          <View style={styles.sectionCard}>
            <SettingRow
              icon={<Info size={IconSize.sm} color={Colors.darkGreen} />}
              label="About TinyVault"
              description="Version info & developer credits"
              type="navigate"
              onPress={() => router.push('/about')}
              delay={440}
            />
            <Divider />
            <SettingRow
              icon={<Shield size={IconSize.sm} color={Colors.darkGreen} />}
              label="Privacy Policy"
              description="How we handle your data"
              type="navigate"
              onPress={() => {}}
              delay={470}
            />
            <Divider />
            <SettingRow
              icon={<Info size={IconSize.sm} color={Colors.darkGreen} />}
              label="Version"
              type="info"
              info={`v${APP_VERSION}`}
              delay={500}
            />
          </View>
        </Animated.View>

        {/* Status Banner */}
        <Animated.View
          entering={FadeInDown.delay(760).springify().damping(15)}
          style={styles.warningBanner}
        >
          <Text style={styles.warningText}>
            {statusMessage ??
              `Biometric: ${biometric.hasHardware ? 'Supported' : 'Unsupported'} • Enrolled: ${
                biometric.isEnrolled ? 'Yes' : 'No'
              }`}
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    letterSpacing: 2,
    paddingHorizontal: Spacing.xs,
  },
  sectionCard: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    minHeight: 64,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: FontFamily.pixelMedium,
    fontSize: FontSize.md,
    color: Colors.darkGreen,
  },
  settingDesc: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    marginTop: 2,
    lineHeight: 16,
  },
  infoText: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  warningBanner: {
    backgroundColor: Colors.warning + '33',
    borderWidth: 2,
    borderColor: Colors.warning,
    padding: Spacing.md,
  },
  warningText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.xs,
    color: Colors.darkGreen,
    lineHeight: 18,
  },
});
