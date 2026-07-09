import * as Haptics from 'expo-haptics';

export async function triggerSelectionHaptic(enabled: boolean): Promise<void> {
  if (!enabled) return;
  try {
    await Haptics.selectionAsync();
  } catch {
    // Haptics unavailable on this device
  }
}

export async function triggerCopyHaptic(enabled: boolean): Promise<void> {
  if (!enabled) return;
  try {
    await Haptics.selectionAsync();
  } catch {
    // Haptics unavailable on this device
  }
}

export async function triggerSuccessHaptic(enabled: boolean): Promise<void> {
  if (!enabled) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Haptics unavailable on this device
  }
}

export async function triggerDeleteHaptic(enabled: boolean): Promise<void> {
  if (!enabled) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics unavailable on this device
  }
}

export async function triggerErrorHaptic(enabled: boolean): Promise<void> {
  if (!enabled) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    // Haptics unavailable on this device
  }
}

export async function triggerAuthHaptic(
  enabled: boolean,
  success: boolean
): Promise<void> {
  if (!enabled) return;
  try {
    await Haptics.notificationAsync(
      success ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error
    );
  } catch {
    // Haptics unavailable on this device
  }
}
