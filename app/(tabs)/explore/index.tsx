import { Stack } from 'expo-router';
import { ScreenContent } from '~/components/ScreenContent';

export default function Explore() {
  return (
    <>
      <Stack.Screen options={{ title: 'Explore' }} />
      <ScreenContent path="app/(tabs)/explore/index.tsx" title="Explore" />
    </>
  );
}
