import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { getSettings, saveSettings } from '../storage/settingsStorage';
import {
  addSecret as addSecretToStorage,
  clearVault as clearVaultStorage,
  deleteSecret as deleteSecretFromStorage,
  getSecrets,
  updateSecret as updateSecretInStorage,
  VaultStorageError,
} from '../storage/vaultStorage';
import { authenticateWithBiometrics, getBiometricSupport } from '../security/biometric';
import {
  CreateSecretInput,
  DEFAULT_VAULT_SETTINGS,
  Secret,
  UpdateSecretInput,
  VaultSettings,
} from '../types';
import { triggerAuthHaptic } from '../utils/haptics';
import { sortSecrets } from '../utils/secrets';

interface BiometricState {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypesCount: number;
}

interface VaultStatistics {
  totalSecrets: number;
  pinnedSecrets: number;
  categories: Record<string, number>;
  recentlyAdded: Secret[];
  oldestSecret?: Secret;
  newestSecret?: Secret;
  approximateStorageBytes: number;
  protectedStatus: string;
}

interface VaultContextValue {
  secrets: Secret[];
  settings: VaultSettings;
  isLoading: boolean;
  isReady: boolean;
  isLocked: boolean;
  error: string | null;
  biometric: BiometricState;
  statistics: VaultStatistics;
  getSecret: (id: string) => Secret | undefined;
  addSecret: (input: CreateSecretInput) => Promise<Secret>;
  updateSecret: (id: string, input: UpdateSecretInput) => Promise<Secret>;
  deleteSecret: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<Secret>;
  clearVault: () => Promise<void>;
  updateSettings: (partial: Partial<VaultSettings>) => Promise<void>;
  lockVault: () => void;
  unlockVault: (promptMessage?: string) => Promise<boolean>;
  registerActivity: () => void;
  clearError: () => void;
  refresh: () => Promise<void>;
}

const VaultContext = createContext<VaultContextValue | null>(null);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [settings, setSettings] = useState<VaultSettings>(DEFAULT_VAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [biometric, setBiometric] = useState<BiometricState>({
    hasHardware: false,
    isEnrolled: false,
    supportedTypesCount: 0,
  });
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    const [storedSecrets, storedSettings] = await Promise.all([
      getSecrets(),
      getSettings(),
    ]);
    setSecrets(storedSecrets);
    setSettings(storedSettings);
  }, []);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  const lockVault = useCallback(() => {
    clearInactivityTimer();
    setIsLocked(true);
  }, [clearInactivityTimer]);

  const unlockVault = useCallback(async (promptMessage = 'Authenticate to unlock TinyVault') => {
    if (!settings.biometricLock) {
      setIsLocked(false);
      return true;
    }

    try {
      const support = await getBiometricSupport();
      setBiometric({
        hasHardware: support.hasHardware,
        isEnrolled: support.isEnrolled,
        supportedTypesCount: support.supportedTypes.length,
      });

      if (!support.hasHardware) {
        setError('This device does not support biometric authentication.');
        setIsLocked(true);
        await triggerAuthHaptic(settings.hapticFeedback, false);
        return false;
      }

      if (!support.isEnrolled) {
        setError('No biometrics enrolled. Add fingerprint or face unlock in device settings.');
        setIsLocked(true);
        await triggerAuthHaptic(settings.hapticFeedback, false);
        return false;
      }

      const result = await authenticateWithBiometrics(promptMessage);
      setIsLocked(!result.success);
      if (!result.success) {
        setError(result.message ?? 'Authentication failed.');
      } else {
        setError(null);
      }
      await triggerAuthHaptic(settings.hapticFeedback, result.success);
      return result.success;
    } catch {
      setError('Authentication failed. Please try again.');
      setIsLocked(true);
      await triggerAuthHaptic(settings.hapticFeedback, false);
      return false;
    }
  }, [settings.biometricLock, settings.hapticFeedback]);

  const registerActivity = useCallback(() => {
    if (isLocked || !settings.autoLock || settings.autoLockTimeoutSeconds === 0) {
      return;
    }

    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(() => {
      setIsLocked(true);
    }, settings.autoLockTimeoutSeconds * 1000);
  }, [clearInactivityTimer, isLocked, settings.autoLock, settings.autoLockTimeoutSeconds]);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const [storedSecrets, storedSettings] = await Promise.all([
          getSecrets(),
          getSettings(),
        ]);

        if (isMounted) {
          setSecrets(storedSecrets);
          setSettings(storedSettings);
          const support = await getBiometricSupport();
          setBiometric({
            hasHardware: support.hasHardware,
            isEnrolled: support.isEnrolled,
            supportedTypesCount: support.supportedTypes.length,
          });
          if (storedSettings.biometricLock) {
            setIsLocked(true);
          } else {
            setIsLocked(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof VaultStorageError
              ? err.message
              : 'Failed to load vault data.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsReady(true);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (!settings.biometricLock) {
      setIsLocked(false);
      return;
    }
    void unlockVault('Unlock TinyVault');
  }, [isReady, settings.biometricLock, unlockVault]);

  useEffect(() => {
    if (!isReady) return;
    registerActivity();
    return clearInactivityTimer;
  }, [clearInactivityTimer, isReady, registerActivity, isLocked]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        lockVault();
        return;
      }
      if (nextState === 'active' && settings.biometricLock) {
        void unlockVault('Welcome back to TinyVault');
      }
    });
    return () => {
      subscription.remove();
    };
  }, [lockVault, settings.biometricLock, unlockVault]);

  const clearError = useCallback(() => setError(null), []);

  const getSecret = useCallback(
    (id: string) => secrets.find((secret) => secret.id === id),
    [secrets]
  );

  const addSecret = useCallback(async (input: CreateSecretInput) => {
    try {
      const created = await addSecretToStorage(input);
      setSecrets((current) => sortSecrets([created, ...current]));
      return created;
    } catch (err) {
      const message =
        err instanceof VaultStorageError ? err.message : 'Failed to add secret.';
      setError(message);
      throw err;
    }
  }, []);

  const updateSecret = useCallback(async (id: string, input: UpdateSecretInput) => {
    try {
      const updated = await updateSecretInStorage(id, input);
      setSecrets((current) =>
        sortSecrets(current.map((secret) => (secret.id === id ? updated : secret)))
      );
      return updated;
    } catch (err) {
      const message =
        err instanceof VaultStorageError ? err.message : 'Failed to update secret.';
      setError(message);
      throw err;
    }
  }, []);

  const deleteSecret = useCallback(async (id: string) => {
    try {
      await deleteSecretFromStorage(id);
      setSecrets((current) => current.filter((secret) => secret.id !== id));
    } catch (err) {
      const message =
        err instanceof VaultStorageError ? err.message : 'Failed to delete secret.';
      setError(message);
      throw err;
    }
  }, []);

  const togglePin = useCallback(async (id: string) => {
    const secret = secrets.find((item) => item.id === id);
    if (!secret) {
      throw new VaultStorageError(`Secret not found: ${id}`);
    }
    return updateSecret(id, { pinned: !secret.pinned });
  }, [secrets, updateSecret]);

  const clearVault = useCallback(async () => {
    try {
      await clearVaultStorage();
      setSecrets([]);
    } catch (err) {
      const message =
        err instanceof VaultStorageError ? err.message : 'Failed to clear vault.';
      setError(message);
      throw err;
    }
  }, []);

  const updateSettings = useCallback(async (partial: Partial<VaultSettings>) => {
    try {
      const nextSettings = { ...settings, ...partial };
      await saveSettings(nextSettings);
      setSettings(nextSettings);
    } catch (err) {
      const message =
        err instanceof VaultStorageError ? err.message : 'Failed to save settings.';
      setError(message);
      throw err;
    }
  }, [settings]);

  const value = useMemo(
    () => {
      const categories = secrets.reduce<Record<string, number>>((acc, secret) => {
        acc[secret.category] = (acc[secret.category] ?? 0) + 1;
        return acc;
      }, {});
      const byCreatedAt = [...secrets].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const oldestSecret = byCreatedAt[0];
      const newestSecret = byCreatedAt[byCreatedAt.length - 1];
      const recentlyAdded = [...byCreatedAt].reverse().slice(0, 3);
      const approximateStorageBytes = new Blob([JSON.stringify(secrets)]).size;

      return ({
      secrets,
      settings,
      isLoading,
      isReady,
      isLocked,
      error,
      biometric,
      statistics: {
        totalSecrets: secrets.length,
        pinnedSecrets: secrets.filter((secret) => secret.pinned).length,
        categories,
        recentlyAdded,
        oldestSecret,
        newestSecret,
        approximateStorageBytes,
        protectedStatus: settings.biometricLock
          ? isLocked
            ? 'Locked (Biometric Enabled)'
            : 'Unlocked (Biometric Enabled)'
          : 'Unlocked (Biometric Disabled)',
      },
      getSecret,
      addSecret,
      updateSecret,
      deleteSecret,
      togglePin,
      clearVault,
      updateSettings,
      lockVault,
      unlockVault,
      registerActivity,
      clearError,
      refresh,
    });
  },
    [
      secrets,
      settings,
      isLoading,
      isReady,
      isLocked,
      error,
      biometric,
      getSecret,
      addSecret,
      updateSecret,
      deleteSecret,
      togglePin,
      clearVault,
      updateSettings,
      lockVault,
      unlockVault,
      registerActivity,
      clearError,
      refresh,
    ]
  );

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault(): VaultContextValue {
  const context = useContext(VaultContext);

  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }

  return context;
}
