import { Stack } from 'expo-router';

export default function SegmentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    />
  );
}
