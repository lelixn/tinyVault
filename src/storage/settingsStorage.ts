import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { DEFAULT_VAULT_SETTINGS, VaultSettings } from '../types';
import { VaultStorageError } from './vaultStorage';

function isVaultSettings(value: unknown): value is VaultSettings {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.defaultHidden === 'boolean' &&
    typeof record.darkMode === 'boolean' &&
    typeof record.hapticFeedback === 'boolean' &&
    typeof record.autoLock === 'boolean' &&
    typeof record.biometricLock === 'boolean' &&
    typeof record.pinLock === 'boolean'
  );
}

function parseSettings(raw: string | null): VaultSettings {
  if (!raw) {
    return DEFAULT_VAULT_SETTINGS;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return isVaultSettings(parsed) ? { ...DEFAULT_VAULT_SETTINGS, ...parsed } : DEFAULT_VAULT_SETTINGS;
  } catch {
    return DEFAULT_VAULT_SETTINGS;
  }
}

export async function getSettings(): Promise<VaultSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return parseSettings(raw);
  } catch {
    throw new VaultStorageError('Failed to load settings from storage.');
  }
}

export async function saveSettings(settings: VaultSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    throw new VaultStorageError('Failed to save settings to storage.');
  }
}
