import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '~/lib/useColorScheme';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  useAnimatedScrollHandler,
  FadeIn,
} from 'react-native-reanimated';
import { showToast } from '~/components/ui/toast';

interface ScreenContentProps {
  path: string;
  title: string;
}

export function ScreenContent({ path, title }: ScreenContentProps) {
  const { isDarkColorScheme } = useColorScheme();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handlePress = (index: number) => {
    showToast(` ${index + 1}`, 'success');
  };

  return (
    <View className="flex-1 bg-black">
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerStyle={{ paddingVertical: 80, paddingHorizontal: 16 }}
        stickyHeaderIndices={[0]}>
        <Animated.View>
          <BlurView
            intensity={isDarkColorScheme ? 40 : 60}
            tint={'light'}
            className="overflow-hidden rounded-3xl">
            <View className="items-center justify-center p-6">
              <Text className="text-2xl font-bold text-white">{title}</Text>
              <Text className="mt-4 text-center text-base text-zinc-100">
                Open up {path} to start working on your app!
              </Text>
            </View>
          </BlurView>
        </Animated.View>

        {/* Additional content to demonstrate scroll */}
        {[...Array(10)].map((_, i) => (
          <Animated.View key={i} entering={FadeIn.delay(i * 100)}>
            <BlurView
              intensity={isDarkColorScheme ? 30 : 40}
              tint={isDarkColorScheme ? 'dark' : 'light'}
              className="mt-4 overflow-hidden rounded-3xl">
              <TouchableOpacity onPress={() => handlePress(i)} className="p-6">
                <View>
                  <Text className="text-xl font-semibold text-white">Section {i + 1}</Text>
                  <Text className="mt-2 text-zinc-100">
                    Scroll through this beautiful gradient background with blur effects. The
                    combination creates a modern, frosted glass appearance.
                  </Text>
                </View>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}
