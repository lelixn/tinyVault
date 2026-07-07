export type {
  Secret,
  SecretCategory,
  SecretCategoryValue,
  CreateSecretInput,
  UpdateSecretInput,
} from './Secret';

export type { VaultSettings } from './Settings';
export { DEFAULT_VAULT_SETTINGS } from './Settings';

import type { SecretCategory } from './Secret';

export interface Category {
  id: string;
  label: SecretCategory;
  icon: string;
}

export interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: 'switch' | 'navigate' | 'info';
  value?: boolean;
}

export interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}
