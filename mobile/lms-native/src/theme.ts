import { MD3LightTheme, type MD3Theme } from 'react-native-paper';

export const palette = {
  primary: '#0868F3',
  primaryContainer: '#EAF2FF',
  onPrimaryContainer: '#124D9C',
  background: '#F7F8FB',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F3F7',
  onSurface: '#101526',
  onSurfaceVariant: '#555E6B',
  outline: '#76808E',
  outlineVariant: '#E5E8EE',
  success: '#159947',
  successContainer: '#EAF8EF',
  warning: '#A85C00',
  warningContainer: '#FFF2DF',
  error: '#C62F42',
  errorContainer: '#FFE9EC',
} as const;

export const appTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    primaryContainer: palette.primaryContainer,
    onPrimaryContainer: palette.onPrimaryContainer,
    background: palette.background,
    surface: palette.surface,
    surfaceVariant: palette.surfaceVariant,
    onSurface: palette.onSurface,
    onSurfaceVariant: palette.onSurfaceVariant,
    outline: palette.outline,
    outlineVariant: palette.outlineVariant,
    error: palette.error,
    errorContainer: palette.errorContainer,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: '#FFFFFF',
      level2: '#FFFFFF',
      level3: '#FFFFFF',
    },
  },
};
