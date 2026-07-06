import { Secret, SecretCategory } from '../types';

export function sortSecrets(secrets: Secret[]): Secret[] {
  return [...secrets].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function filterSecrets(
  secrets: Secret[],
  searchQuery: string,
  category: SecretCategory
): Secret[] {
  const query = searchQuery.trim().toLowerCase();

  const filtered = secrets.filter((secret) => {
    const matchesCategory = category === 'All' || secret.category === category;

    if (!matchesCategory) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      secret.title.toLowerCase().includes(query) ||
      secret.category.toLowerCase().includes(query) ||
      secret.value.toLowerCase().includes(query) ||
      (secret.notes?.toLowerCase().includes(query) ?? false)
    );
  });

  return sortSecrets(filtered);
}
