import CryptoJS from 'crypto-js';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const MASTER_KEY_STORAGE_KEY = '@tinyvault/master-key';

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function generateMasterKey(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(32);
  return bytesToHex(bytes);
}

export async function getOrCreateMasterKey(): Promise<string> {
  const existing = await SecureStore.getItemAsync(MASTER_KEY_STORAGE_KEY);
  if (existing && existing.length > 0) {
    return existing;
  }

  const generated = await generateMasterKey();
  await SecureStore.setItemAsync(MASTER_KEY_STORAGE_KEY, generated, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return generated;
}

export async function encryptValue(plainText: string): Promise<string> {
  const key = await getOrCreateMasterKey();
  return CryptoJS.AES.encrypt(plainText, key).toString();
}

export async function decryptValue(cipherText: string): Promise<string> {
  const key = await getOrCreateMasterKey();
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  const value = bytes.toString(CryptoJS.enc.Utf8);
  if (!value && cipherText) {
    throw new Error('Unable to decrypt secret value.');
  }
  return value;
}
