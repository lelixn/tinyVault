export type SecretCategory =
  | 'All'
  | 'Passwords'
  | 'WiFi'
  | 'Bank'
  | 'Documents'
  | 'API Keys'
  | 'Notes';

export type SecretCategoryValue = Exclude<SecretCategory, 'All'>;

export interface Secret {
  id: string;
  title: string;
  value: string;
  category: SecretCategoryValue;
  notes?: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateSecretInput = {
  title: string;
  value: string;
  category: SecretCategoryValue;
  notes?: string;
  pinned?: boolean;
};

export type UpdateSecretInput = Partial<
  Pick<Secret, 'title' | 'value' | 'category' | 'notes' | 'pinned'>
>;
