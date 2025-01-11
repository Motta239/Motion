import { Stack } from 'expo-router';
import { ScreenContent } from '~/components/ScreenContent';

export default function Profile() {
  return (
    <>
      <Stack.Screen />
      <ScreenContent path="app/(tabs)/profile/index.tsx" title="Profile" />
    </>
  );
}
