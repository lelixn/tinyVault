export type SecretCategory =
  | 'All'
  | 'Passwords'
  | 'WiFi'
  | 'Bank'
  | 'Documents'
  | 'API Keys'
  | 'Notes';

export interface Secret {
  id: string;
  title: string;
  value: string;
  category: SecretCategory;
  notes?: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateSecretInput = {
  title: string;
  value: string;
  category: Exclude<SecretCategory, 'All'>;
  notes?: string;
  pinned?: boolean;
};

export type UpdateSecretInput = Partial<
  Pick<Secret, 'title' | 'value' | 'category' | 'notes' | 'pinned'>
>;

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
