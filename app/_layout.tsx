import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  PixelifySans_400Regular,
  PixelifySans_500Medium,
  PixelifySans_600SemiBold,
  PixelifySans_700Bold,
} from '@expo-google-fonts/pixelify-sans';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '../src/constants';
import { VaultProvider, useVault } from '../src/hooks/useVault';
import { PixelButton } from '../src/components';

SplashScreen.preventAutoHideAsync();

function AppShell() {
  const { isLocked, unlockVault, registerActivity, error } = useVault();

  return (
    <View
      style={styles.container}
      onTouchStart={registerActivity}
    >
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="add" />
        <Stack.Screen name="details" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="about" />
      </Stack>

      {isLocked && (
        <View style={styles.lockOverlay}>
          <Pressable style={styles.lockBackdrop} />
          <View style={styles.lockCard}>
            <Text style={styles.lockTitle}>Vault Locked</Text>
            <Text style={styles.lockMessage}>
              Authenticate with biometrics to continue.
            </Text>
            {error ? <Text style={styles.lockError}>{error}</Text> : null}
            <PixelButton
              label="Unlock"
              onPress={() => {
                void unlockVault('Unlock TinyVault');
              }}
              variant="primary"
              fullWidth
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PixelifySans_400Regular,
    PixelifySans_500Medium,
    PixelifySans_600SemiBold,
    PixelifySans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <VaultProvider>
      <AppShell />
    </VaultProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.overlay,
  },
  lockCard: {
    width: '84%',
    maxWidth: 360,
    backgroundColor: Colors.card,
    borderWidth: 3,
    borderColor: Colors.border,
    padding: 20,
    gap: 10,
  },
  lockTitle: {
    fontFamily: 'PixelifySans_700Bold',
    fontSize: 24,
    color: Colors.darkGreen,
  },
  lockMessage: {
    fontFamily: 'PixelifySans_400Regular',
    fontSize: 14,
    color: Colors.mutedText,
    lineHeight: 20,
  },
  lockError: {
    fontFamily: 'PixelifySans_400Regular',
    fontSize: 12,
    color: Colors.danger,
  },
});
