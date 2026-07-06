// TinyVault Spacing System
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
} as const;

// TinyVault Border
export const Border = {
  width: 3,
  radius: 0, // Pixel art - no rounded corners
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
    elevation: 4,
  },
} as const;

// TinyVault Icon Sizes
export const IconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// TinyVault Sizes
export const Size = {
  buttonHeight: 48,
  inputHeight: 48,
  chipHeight: 36,
  fabSize: 60,
  headerHeight: 60,
  cardMinHeight: 80,
} as const;
