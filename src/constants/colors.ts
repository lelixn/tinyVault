// TinyVault Color Palette
export const Colors = {
  background: '#DFFFD6',
  card: '#F5FFF2',
  primary: '#65D46E',
  darkGreen: '#245A32',
  border: '#184325',
  mutedText: '#5C6E60',
  danger: '#FF6B6B',
  warning: '#FFC857',
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#00000033',
  primaryDark: '#4DB856',
  primaryLight: '#A8EFAD',
  inputBg: '#EEFFEA',
  overlay: '#00000088',
  success: '#4CAF50',
  cardPressed: '#ECFEE8',
} as const;

export type ColorKey = keyof typeof Colors;
