import { Stack } from 'expo-router';
import { ScreenContent } from '~/components/ScreenContent';

export default function Notifications() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Notifications',
        }}
      />
      <ScreenContent path="app/(tabs)/[...segments]/notifications.tsx" title="Notifications" />
    </>
  );
}
