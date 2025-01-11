// src/providers/QueryProvider.tsx
import { PropsWithChildren } from 'react';
import { useColorScheme } from '~/lib/useColorScheme';
import { NAV_THEME } from '~/theme';
import { ThemeProvider as NavThemeProvider } from '@react-navigation/native';

export function ThemeProvider({ children }: PropsWithChildren) {
  const { colorScheme } = useColorScheme();
  return <NavThemeProvider value={NAV_THEME[colorScheme]}>{children}</NavThemeProvider>;
}
