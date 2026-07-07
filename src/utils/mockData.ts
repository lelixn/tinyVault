import { SecretCategory } from '../types';
import { APP_INFO } from '../constants';

export const APP_VERSION = APP_INFO.version;

export const CATEGORIES: { label: SecretCategory }[] = [
  { label: 'All' },
  { label: 'Passwords' },
  { label: 'WiFi' },
  { label: 'Bank' },
  { label: 'Documents' },
  { label: 'API Keys' },
  { label: 'Notes' },
];

export const CATEGORY_COLORS: Record<SecretCategory, string> = {
  All: '#65D46E',
  Passwords: '#FF8FA3',
  WiFi: '#5BC0EB',
  Bank: '#FFC857',
  Documents: '#C77DFF',
  'API Keys': '#FF6B35',
  Notes: '#A8DADC',
};
