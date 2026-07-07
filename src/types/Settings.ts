export interface VaultSettings {
  defaultHidden: boolean;
  darkMode: boolean;
  hapticFeedback: boolean;
  autoLock: boolean;
  biometricLock: boolean;
  pinLock: boolean;
}

export const DEFAULT_VAULT_SETTINGS: VaultSettings = {
  defaultHidden: true,
  darkMode: false,
  hapticFeedback: true,
  autoLock: true,
  biometricLock: true,
  pinLock: false,
};
