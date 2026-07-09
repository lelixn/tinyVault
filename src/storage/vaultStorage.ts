import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { decryptValue, encryptValue } from '../security/encryption';
import {
  CreateSecretInput,
  Secret,
  SecretCategory,
  SecretCategoryValue,
  UpdateSecretInput,
} from '../types';
import { sortSecrets } from '../utils/secrets';
import { generateUUID } from '../utils/uuid';

type StoredSecret = Omit<Secret, 'value' | 'notes'> & {
  valueEncrypted?: string;
  notesEncrypted?: string;
  value?: string;
  notes?: string;
};

const VALID_CATEGORIES: SecretCategoryValue[] = [
  'Passwords',
  'WiFi',
  'Bank',
  'Documents',
  'API Keys',
  'Notes',
];

export class VaultStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VaultStorageError';
  }
}

function isSecretCategoryValue(value: unknown): value is SecretCategoryValue {
  return typeof value === 'string' && VALID_CATEGORIES.includes(value as SecretCategoryValue);
}

function isStoredSecret(value: unknown): value is StoredSecret {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === 'string' &&
    typeof record.title === 'string' &&
    (typeof record.valueEncrypted === 'string' || typeof record.value === 'string') &&
    isSecretCategoryValue(record.category) &&
    typeof record.pinned === 'boolean' &&
    typeof record.createdAt === 'string' &&
    typeof record.updatedAt === 'string' &&
    (record.notesEncrypted === undefined ||
      typeof record.notesEncrypted === 'string' ||
      typeof record.notes === 'string')
  );
}

async function parseSecrets(raw: string | null): Promise<Secret[]> {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const storedSecrets = parsed.filter(isStoredSecret);
    const decrypted = await Promise.all(
      storedSecrets.map(async (secret): Promise<Secret | null> => {
        try {
          const decryptedValue = secret.valueEncrypted
            ? await decryptValue(secret.valueEncrypted)
            : secret.value;
          if (typeof decryptedValue !== 'string') {
            return null;
          }

          const decryptedNotes = secret.notesEncrypted
            ? await decryptValue(secret.notesEncrypted)
            : secret.notes;

          return {
            id: secret.id,
            title: secret.title,
            value: decryptedValue,
            category: secret.category,
            notes: typeof decryptedNotes === 'string' ? decryptedNotes : undefined,
            pinned: secret.pinned,
            createdAt: secret.createdAt,
            updatedAt: secret.updatedAt,
          };
        } catch {
          return null;
        }
      })
    );
    return sortSecrets(decrypted.filter((value): value is Secret => value !== null));
  } catch {
    return [];
  }
}

export async function getSecrets(): Promise<Secret[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SECRETS);
    return await parseSecrets(raw);
  } catch {
    throw new VaultStorageError('Failed to load secrets from storage.');
  }
}

export async function saveSecrets(secrets: Secret[]): Promise<void> {
  try {
    const encryptedSecrets: StoredSecret[] = await Promise.all(
      sortSecrets(secrets).map(async (secret) => ({
        id: secret.id,
        title: secret.title,
        valueEncrypted: await encryptValue(secret.value),
        notesEncrypted: secret.notes ? await encryptValue(secret.notes) : undefined,
        category: secret.category,
        pinned: secret.pinned,
        createdAt: secret.createdAt,
        updatedAt: secret.updatedAt,
      }))
    );
    await AsyncStorage.setItem(STORAGE_KEYS.SECRETS, JSON.stringify(encryptedSecrets));
  } catch {
    throw new VaultStorageError('Failed to save secrets to storage.');
  }
}

export async function addSecret(input: CreateSecretInput): Promise<Secret> {
  const secrets = await getSecrets();
  const now = new Date().toISOString();

  const secret: Secret = {
    id: generateUUID(),
    title: input.title.trim(),
    value: input.value.trim(),
    category: input.category,
    notes: input.notes?.trim() || undefined,
    pinned: input.pinned ?? false,
    createdAt: now,
    updatedAt: now,
  };

  await saveSecrets([secret, ...secrets]);
  return secret;
}

export async function updateSecret(
  id: string,
  input: UpdateSecretInput
): Promise<Secret> {
  const secrets = await getSecrets();
  const index = secrets.findIndex((secret) => secret.id === id);

  if (index === -1) {
    throw new VaultStorageError(`Secret not found: ${id}`);
  }

  const current = secrets[index];
  const updated: Secret = {
    ...current,
    ...input,
    title: input.title !== undefined ? input.title.trim() : current.title,
    value: input.value !== undefined ? input.value.trim() : current.value,
    notes:
      input.notes !== undefined
        ? input.notes.trim() || undefined
        : current.notes,
    updatedAt: new Date().toISOString(),
  };

  const nextSecrets = [...secrets];
  nextSecrets[index] = updated;
  await saveSecrets(nextSecrets);

  return updated;
}

export async function deleteSecret(id: string): Promise<void> {
  const secrets = await getSecrets();
  await saveSecrets(secrets.filter((secret) => secret.id !== id));
}

export async function clearVault(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SECRETS);
  } catch {
    throw new VaultStorageError('Failed to clear vault.');
  }
}

export function isValidCategory(category: SecretCategory): category is SecretCategoryValue {
  return category !== 'All' && VALID_CATEGORIES.includes(category as SecretCategoryValue);
}
