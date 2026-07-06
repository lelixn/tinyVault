import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Github, Globe, Lock, Code, Cpu, Heart } from 'lucide-react-native';
import { Header, PixelButton, Divider } from '../src/components';
import { Colors, FontFamily, FontSize, Border, Spacing, IconSize } from '../src/constants';
import { APP_VERSION } from '../src/utils/mockData';

const TechBadge: React.FC<{ label: string; icon: React.ReactNode; delay: number }> = ({
  label,
  icon,
  delay,
}) => (
  <Animated.View entering={FadeInDown.delay(delay).springify().damping(15)}>
    <View style={styles.techBadge}>
      {icon}
      <Text style={styles.techLabel}>{label.toUpperCase()}</Text>
    </View>
  </Animated.View>
);

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header title="About" showBack />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <Animated.View
          entering={FadeIn.delay(100).duration(500)}
          style={styles.logoSection}
        >
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Lock size={48} color={Colors.darkGreen} strokeWidth={2} />
            </View>
            {/* Pixel corners */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>

          <Text style={styles.appName}>TINYVAULT</Text>
          <View style={styles.versionTag}>
            <Text style={styles.versionText}>v{APP_VERSION}</Text>
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View
          entering={FadeInDown.delay(200).springify().damping(15)}
          style={styles.card}
        >
          <Text style={styles.description}>
            TinyVault is a retro-styled offline secret locker. Store your
            passwords, WiFi credentials, bank details, and sensitive notes
            securely — all on your device, never in the cloud.
          </Text>
        </Animated.View>

        {/* Built With */}
        <Animated.View
          entering={FadeInDown.delay(300).springify().damping(15)}
          style={styles.card}
        >
          <View style={styles.sectionHeader}>
            <Code size={IconSize.sm} color={Colors.darkGreen} />
            <Text style={styles.cardTitle}>BUILT WITH</Text>
          </View>
          <Divider />
          <View style={styles.techGrid}>
            <TechBadge
              label="React Native"
              icon={<Cpu size={IconSize.sm} color={Colors.darkGreen} />}
              delay={360}
            />
            <TechBadge
              label="Expo"
              icon={<Globe size={IconSize.sm} color={Colors.darkGreen} />}
              delay={400}
            />
            <TechBadge
              label="TypeScript"
              icon={<Code size={IconSize.sm} color={Colors.darkGreen} />}
              delay={440}
            />
            <TechBadge
              label="Reanimated"
              icon={<Heart size={IconSize.sm} color={Colors.danger} />}
              delay={480}
            />
            <TechBadge
              label="Expo Router"
              icon={<Globe size={IconSize.sm} color={Colors.darkGreen} />}
              delay={520}
            />
            <TechBadge
              label="Lucide Icons"
              icon={<Code size={IconSize.sm} color={Colors.darkGreen} />}
              delay={560}
            />
          </View>
        </Animated.View>

        {/* Features */}
        <Animated.View
          entering={FadeInDown.delay(420).springify().damping(15)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>✦ FEATURES</Text>
          <Divider />
          {[
            '🔒 100% Offline — No cloud, no tracking',
            '🎮 Retro pixel art design',
            '📂 6 secret categories',
            '🔍 Instant search & filter',
            '📌 Pin important secrets',
            '👁 Show/hide secret values',
            '📋 One-tap copy to clipboard',
            '🔐 Biometric & PIN lock ready',
          ].map((feature, i) => (
            <Animated.View
              key={i}
              entering={FadeInDown.delay(460 + i * 40).springify().damping(15)}
              style={styles.featureRow}
            >
              <Text style={styles.featureText}>{feature}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Developer */}
        <Animated.View
          entering={FadeInDown.delay(600).springify().damping(15)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>👨‍💻 DEVELOPER</Text>
          <Divider />
          <Text style={styles.developerName}>Made with ❤️ by</Text>
          <Text style={styles.developerHandle}>@tinyvault_dev</Text>

          <View style={styles.linkButtons}>
            <PixelButton
              label="GitHub"
              onPress={() => Linking.openURL('https://github.com')}
              variant="secondary"
              icon={<Github size={IconSize.sm} color={Colors.darkGreen} />}
              style={styles.linkBtn}
            />
            <PixelButton
              label="Website"
              onPress={() => Linking.openURL('https://example.com')}
              variant="primary"
              icon={<Globe size={IconSize.sm} color={Colors.darkGreen} />}
              style={styles.linkBtn}
            />
          </View>
        </Animated.View>

        {/* Footer */}
        <Animated.View
          entering={FadeInDown.delay(700).springify().damping(15)}
          style={styles.footer}
        >
          <Text style={styles.footerText}>
            TinyVault v{APP_VERSION} — All rights reserved
          </Text>
          <Text style={styles.footerText}>
            Built for privacy. No data leaves your device.
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
    alignItems: 'center',
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  logoOuter: {
    width: 120,
    height: 120,
    backgroundColor: Colors.primary,
    borderWidth: Border.width + 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.border,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    position: 'relative',
  },
  logoInner: {
    width: 80,
    height: 80,
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: Colors.darkGreen,
  },
  cornerTL: { top: 4, left: 4 },
  cornerTR: { top: 4, right: 4 },
  cornerBL: { bottom: 4, left: 4 },
  cornerBR: { bottom: 4, right: 4 },
  appName: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.display,
    color: Colors.darkGreen,
    letterSpacing: 4,
    marginBottom: Spacing.sm,
  },
  versionTag: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  versionText: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.sm,
    color: Colors.darkGreen,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: Border.width,
    borderColor: Colors.border,
    padding: Spacing.lg,
    width: '100%',
    shadowColor: Colors.border,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.sm,
    color: Colors.darkGreen,
    letterSpacing: 2,
  },
  description: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.mutedText,
    lineHeight: 24,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  techBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primaryLight,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    shadowColor: Colors.border,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  techLabel: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xs,
    color: Colors.darkGreen,
    letterSpacing: 0.8,
  },
  featureRow: {
    paddingVertical: Spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + '66',
  },
  featureText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.darkGreen,
    lineHeight: 22,
  },
  developerName: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.md,
    color: Colors.mutedText,
    marginBottom: Spacing.xs,
  },
  developerHandle: {
    fontFamily: FontFamily.pixelBold,
    fontSize: FontSize.xl,
    color: Colors.darkGreen,
    marginBottom: Spacing.lg,
    letterSpacing: 1,
  },
  linkButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  linkBtn: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: 4,
  },
  footerText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.xs,
    color: Colors.mutedText,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
