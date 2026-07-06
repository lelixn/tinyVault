import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import {
  CreateSecretInput,
  Secret,
  SecretCategory,
  UpdateSecretInput,
} from '../types';
import { generateId } from '../utils/id';
import { sortSecrets } from '../utils/secrets';

const VALID_CATEGORIES: SecretCategory[] = [
  'All',
  'Passwords',
  'WiFi',
  'Bank',
  'Documents',
  'API Keys',
  'Notes',
];

function isSecret(value: unknown): value is Secret {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === 'string' &&
    typeof record.title === 'string' &&
    typeof record.value === 'string' &&
    typeof record.category === 'string' &&
    VALID_CATEGORIES.includes(record.category as SecretCategory) &&
    record.category !== 'All' &&
    typeof record.pinned === 'boolean' &&
    typeof record.createdAt === 'string' &&
    typeof record.updatedAt === 'string' &&
    (record.notes === undefined || typeof record.notes === 'string')
  );
}

function parseSecrets(raw: string | null): Secret[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return sortSecrets(parsed.filter(isSecret));
  } catch {
    return [];
  }
}

async function persistSecrets(secrets: Secret[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.SECRETS, JSON.stringify(secrets));
}

export async function loadSecrets(): Promise<Secret[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.SECRETS);
  return parseSecrets(raw);
}

export async function getSecretById(id: string): Promise<Secret | undefined> {
  const secrets = await loadSecrets();
  return secrets.find((secret) => secret.id === id);
}

export async function createSecret(input: CreateSecretInput): Promise<Secret> {
  const secrets = await loadSecrets();
  const now = new Date().toISOString();

  const secret: Secret = {
    id: generateId(),
    title: input.title.trim(),
    value: input.value.trim(),
    category: input.category,
    notes: input.notes?.trim() || undefined,
    pinned: input.pinned ?? false,
    createdAt: now,
    updatedAt: now,
  };

  const nextSecrets = sortSecrets([secret, ...secrets]);
  await persistSecrets(nextSecrets);

  return secret;
}

export async function updateSecret(
  id: string,
  input: UpdateSecretInput
): Promise<Secret> {
  const secrets = await loadSecrets();
  const index = secrets.findIndex((secret) => secret.id === id);

  if (index === -1) {
    throw new Error(`Secret not found: ${id}`);
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

  const sorted = sortSecrets(nextSecrets);
  await persistSecrets(sorted);

  return updated;
}

export async function deleteSecret(id: string): Promise<void> {
  const secrets = await loadSecrets();
  const nextSecrets = secrets.filter((secret) => secret.id !== id);
  await persistSecrets(nextSecrets);
}

export async function togglePinSecret(id: string): Promise<Secret> {
  const secret = await getSecretById(id);

  if (!secret) {
    throw new Error(`Secret not found: ${id}`);
  }

  return updateSecret(id, { pinned: !secret.pinned });
}

export async function clearAllSecrets(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.SECRETS);
}
