import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getSettings, saveSettings } from '../storage/settingsStorage';
import {
  addSecret as addSecretToStorage,
  clearVault as clearVaultStorage,
  deleteSecret as deleteSecretFromStorage,
  getSecrets,
  updateSecret as updateSecretInStorage,
  VaultStorageError,
} from '../storage/vaultStorage';
import {
  CreateSecretInput,
  DEFAULT_VAULT_SETTINGS,
  Secret,
  UpdateSecretInput,
  VaultSettings,
} from '../types';
import { sortSecrets } from '../utils/secrets';

interface VaultContextValue {
  secrets: Secret[];
  settings: VaultSettings;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  getSecret: (id: string) => Secret | undefined;
  addSecret: (input: CreateSecretInput) => Promise<Secret>;
  updateSecret: (id: string, input: UpdateSecretInput) => Promise<Secret>;
  deleteSecret: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<Secret>;
  clearVault: () => Promise<void>;
  updateSettings: (partial: Partial<VaultSettings>) => Promise<void>;
  clearError: () => void;
  refresh: () => Promise<void>;
}

const VaultContext = createContext<VaultContextValue | null>(null);

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [settings, setSettings] = useState<VaultSettings>(DEFAULT_VAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [storedSecrets, storedSettings] = await Promise.all([
      getSecrets(),
      getSettings(),
    ]);
    setSecrets(storedSecrets);
    setSettings(storedSettings);
  }, []);

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
    () => ({
      secrets,
      settings,
      isLoading,
      isReady,
      error,
      getSecret,
      addSecret,
      updateSecret,
      deleteSecret,
      togglePin,
      clearVault,
      updateSettings,
      clearError,
      refresh,
    }),
    [
      secrets,
      settings,
      isLoading,
      isReady,
      error,
      getSecret,
      addSecret,
      updateSecret,
      deleteSecret,
      togglePin,
      clearVault,
      updateSettings,
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
