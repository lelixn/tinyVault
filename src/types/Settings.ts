export interface VaultSettings {
  defaultHidden: boolean;
  darkMode: boolean;
  hapticFeedback: boolean;
  autoLock: boolean;
  autoLockTimeoutSeconds: 0 | 30 | 60 | 300;
  biometricLock: boolean;
  pinLock: boolean;
}

export const DEFAULT_VAULT_SETTINGS: VaultSettings = {
  defaultHidden: true,
  darkMode: false,
  hapticFeedback: true,
  autoLock: true,
  autoLockTimeoutSeconds: 30,
  biometricLock: true,
  pinLock: false,
};
