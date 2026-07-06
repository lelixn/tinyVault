import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createSecret as createSecretInStorage,
  deleteSecret as deleteSecretInStorage,
  loadSecrets,
  togglePinSecret as togglePinSecretInStorage,
  updateSecret as updateSecretInStorage,
} from '../services/secretsStorage';
import {
  CreateSecretInput,
  Secret,
  UpdateSecretInput,
} from '../types';
import { sortSecrets } from '../utils/secrets';

interface SecretsContextValue {
  secrets: Secret[];
  isLoading: boolean;
  isReady: boolean;
  getSecret: (id: string) => Secret | undefined;
  createSecret: (input: CreateSecretInput) => Promise<Secret>;
  updateSecret: (id: string, input: UpdateSecretInput) => Promise<Secret>;
  deleteSecret: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<Secret>;
  refreshSecrets: () => Promise<void>;
}

const SecretsContext = createContext<SecretsContextValue | null>(null);

export function SecretsProvider({ children }: { children: React.ReactNode }) {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const refreshSecrets = useCallback(async () => {
    const storedSecrets = await loadSecrets();
    setSecrets(storedSecrets);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const storedSecrets = await loadSecrets();
        if (isMounted) {
          setSecrets(storedSecrets);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsReady(true);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  const getSecret = useCallback(
    (id: string) => secrets.find((secret) => secret.id === id),
    [secrets]
  );

  const createSecret = useCallback(async (input: CreateSecretInput) => {
    const created = await createSecretInStorage(input);
    setSecrets((current) => sortSecrets([created, ...current]));
    return created;
  }, []);

  const updateSecret = useCallback(async (id: string, input: UpdateSecretInput) => {
    const updated = await updateSecretInStorage(id, input);
    setSecrets((current) =>
      sortSecrets(current.map((secret) => (secret.id === id ? updated : secret)))
    );
    return updated;
  }, []);

  const deleteSecret = useCallback(async (id: string) => {
    await deleteSecretInStorage(id);
    setSecrets((current) => current.filter((secret) => secret.id !== id));
  }, []);

  const togglePin = useCallback(async (id: string) => {
    const updated = await togglePinSecretInStorage(id);
    setSecrets((current) =>
      sortSecrets(current.map((secret) => (secret.id === id ? updated : secret)))
    );
    return updated;
  }, []);

  const value = useMemo(
    () => ({
      secrets,
      isLoading,
      isReady,
      getSecret,
      createSecret,
      updateSecret,
      deleteSecret,
      togglePin,
      refreshSecrets,
    }),
    [
      secrets,
      isLoading,
      isReady,
      getSecret,
      createSecret,
      updateSecret,
      deleteSecret,
      togglePin,
      refreshSecrets,
    ]
  );

  return (
    <SecretsContext.Provider value={value}>{children}</SecretsContext.Provider>
  );
}

export function useSecrets(): SecretsContextValue {
  const context = useContext(SecretsContext);

  if (!context) {
    throw new Error('useSecrets must be used within a SecretsProvider');
  }

  return context;
}
