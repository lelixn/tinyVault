import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricSupport {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
}

export async function getBiometricSupport(): Promise<BiometricSupport> {
  const [hasHardware, isEnrolled, supportedTypes] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  return { hasHardware, isEnrolled, supportedTypes };
}

export function getBiometricErrorMessage(error?: string): string {
  switch (error) {
    case 'not_available':
      return 'Biometric authentication is not available on this device.';
    case 'not_enrolled':
      return 'No biometrics enrolled. Please set up Face ID or fingerprint in device settings.';
    case 'lockout':
      return 'Too many failed attempts. Please wait and try again.';
    case 'user_cancel':
    case 'app_cancel':
    case 'system_cancel':
      return 'Authentication was cancelled.';
    case 'timeout':
      return 'Authentication timed out. Please try again.';
    case 'authentication_failed':
      return 'Biometric check failed. Please try again.';
    default:
      return 'Authentication failed. Please try again.';
  }
}

export async function authenticateWithBiometrics(promptMessage: string): Promise<{
  success: boolean;
  message?: string;
}> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel: 'Cancel',
    disableDeviceFallback: false,
    biometricsSecurityLevel: 'strong',
  });

  if (result.success) {
    return { success: true };
  }

  return {
    success: false,
    message: getBiometricErrorMessage(result.error),
  };
}
