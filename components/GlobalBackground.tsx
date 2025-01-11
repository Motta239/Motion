import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  interpolate,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

interface GlobalBackgroundProps {
  children: React.ReactNode;
  type?: 'success' | 'error' | 'info' | 'warning' | 'loading';
}

export function GlobalBackground({ children, type }: GlobalBackgroundProps) {
  const opacity = useSharedValue(0.4);
  const scale = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.6, { duration: 1000 }), withTiming(0.4, { duration: 1000 })),
      -1,
      true
    );
    scale.value = withRepeat(
      withSequence(withTiming(0.1, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const colors: Record<string, readonly [string, string]> = {
    success: ['green', 'green'],
    error: ['#EF4444', '#B91C1C'],
    info: ['#3B82F6', '#1D4ED8'],
    warning: ['#F59E0B', '#D97706'],
    loading: ['#6366F1', '#4F46E5'],
  };
  return (
    <>
      <AnimatedGradient
        colors={type ? colors[type] : ['#4F46E5', '#3730A3']}
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            height: 'auto',
            top: 0,
            bottom: 0,
            zIndex: -1,
            overflow: 'hidden',
            borderRadius: 100,
          },
          animatedStyle,
        ]}
        start={{ x: 0, y: 0.4 }}
        end={{ x: 1, y: 1 }}
      />
      {children}
    </>
  );
}
