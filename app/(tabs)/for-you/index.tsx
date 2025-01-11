import { Stack } from 'expo-router';
import { ScreenContent } from '~/components/ScreenContent';

export default function ForYou() {
  return (
    <>
      <Stack.Screen options={{ title: 'For You' }} />
      <ScreenContent path="app/(tabs)/for-you/index.tsx" title="For You" />
    </>
  );
}
