import { Stack } from 'expo-router';

export default function ForYouLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
      }}
    />
  );
}
