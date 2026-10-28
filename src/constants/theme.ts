export const BitcoinColors = {
  // Backgrounds
  background: '#0B0E14',
  surface: '#131824',
  surfaceElevated: '#1D2436',
  surfaceHighlight: '#263047',
  
  // Borders
  border: '#232C40',
  borderHighlight: '#F7931A',
  
  // Brand & Bitcoin Accents
  bitcoin: '#F7931A',
  bitcoinLight: '#FFAF47',
  bitcoinDark: '#D47504',
  bitcoinGold: '#FFB800',
  
  // Functional Colors
  lightning: '#A855F7',
  lightningCyan: '#06B6D4',
  success: '#10B981',
  successDark: '#047857',
  error: '#EF4444',
  errorDark: '#B91C1C',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Typography
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDim: '#475569',

  // Gradients and Overlays
  overlay: 'rgba(11, 14, 20, 0.85)',
  cardGlow: 'rgba(247, 147, 26, 0.15)',
};

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#F8FAFC',
    backgroundElement: '#E2E8F0',
    backgroundSelected: '#CBD5E1',
    textSecondary: '#64748B',
    accent: BitcoinColors.bitcoin,
  },
  dark: {
    text: BitcoinColors.text,
    background: BitcoinColors.background,
    backgroundElement: BitcoinColors.surface,
    backgroundSelected: BitcoinColors.surfaceElevated,
    textSecondary: BitcoinColors.textSecondary,
    accent: BitcoinColors.bitcoin,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;
