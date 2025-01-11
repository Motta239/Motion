import '../global.css';
import 'expo-dev-client';

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { ToastProvider } from '~/components/ui/toast';
import { AuthProvider, AuthMiddleware, QueryProvider, ThemeProvider } from '~/providers';
import { useMemoryTracker } from '~/lib/useMemoryTracker';

export { ErrorBoundary } from 'expo-router';

function ProvidersLayout({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ToastProvider>
          <QueryProvider>
            <BottomSheetModalProvider>
              <ActionSheetProvider>
                <ThemeProvider>
                  <AuthMiddleware>{children}</AuthMiddleware>
                </ThemeProvider>
              </ActionSheetProvider>
            </BottomSheetModalProvider>
          </QueryProvider>
        </ToastProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ProvidersLayout>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ProvidersLayout>
  );
}
