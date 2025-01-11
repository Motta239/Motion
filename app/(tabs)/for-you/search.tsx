import { Stack } from 'expo-router';
import { View, Text, TextInput, ScrollView } from 'react-native';

export default function Search() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Search',
          presentation: 'modal',
          headerBlurEffect: 'regular',
          animation: 'slide_from_bottom',
        }}
      />

      <ScrollView className="flex-1 bg-background">
        <View className="p-4">
          <TextInput
            placeholder="Search..."
            className="w-full rounded-lg bg-muted p-3 text-foreground"
            placeholderTextColor="#666"
            autoFocus
          />
          <View className="mt-4">
            <Text className="text-lg font-semibold text-foreground">Personalized Searches</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
