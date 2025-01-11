import { useState, useEffect } from 'react';
import { Alert, Linking, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSignInWithEmail, signInWithProvider, supabase } from '~/lib/supabase';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { ThemeToggle } from '~/components/ThemeToggle';
import { Text } from '~/components/nativewindui/Text';

// Define the login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Define the type for the form data
type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const { colorScheme, colors } = useColorScheme();
  useEffect(() => {
    // Handle deep linking
    const handleDeepLink = async (event: { url: string }) => {
      if (event.url) {
        console.log('Received URL:', event.url);

        const url = new URL(event.url);
        const params = new URLSearchParams(url.hash ? url.hash.substring(1) : url.search);

        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken) {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser(accessToken);

          if (error) {
            console.error('Auth error:', error);
            Alert.alert('Error', error.message);
            return;
          }

          if (user) {
            router.replace('/(tabs)');
          }
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate: signIn, isPending } = useSignInWithEmail();

  const onSubmit = (data: LoginFormData) => {
    signIn({ email: data.email, password: data.password });
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      setIsOAuthLoading(true);
      const { error, data: user } = await signInWithProvider(provider);

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (user) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred during OAuth login');
    } finally {
      setIsOAuthLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 px-4" contentInsetAdjustmentBehavior="automatic">
      <View className={`mb-10 mt-10`}>
        <ThemeToggle />
        <Text className={`mb-2 text-4xl  font-bold`}>Welcome Back</Text>
        <Text className={`text-lg `}>Sign in to continue</Text>
      </View>
      <View className={`gap-4`}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View>
              <View className={`flex-row items-center gap-3 rounded-lg bg-white/10 p-4`}>
                <Ionicons name="mail-outline" size={20} color={colors.foreground} />
                <TextInput
                  allowFontScaling={false}
                  className={`flex-1 text-base text-white`}
                  placeholder="Email"
                  placeholderTextColor={colors.foreground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  autoComplete="email"
                />
              </View>
              {errors.email && (
                <Text className={`ml-3 mt-1 text-xs text-red-500`}>{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View>
              <View className={`flex-row items-center gap-3 rounded-lg bg-white/10 p-4`}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.foreground} />
                <TextInput
                  className={`flex-1 text-base text-white`}
                  allowFontScaling={false}
                  placeholder="Password"
                  placeholderTextColor={colors.foreground}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  autoComplete="password"
                />
              </View>
              {errors.password && (
                <Text variant="footnote" className={`ml-3 mt-1 text-xs text-red-500`}>
                  {errors.password.message}
                </Text>
              )}
            </View>
          )}
        />

        <Link href="/(auth)/forgot-password" asChild>
          <TouchableOpacity className={`items-start`}>
            <Text className={` font-semibold`}>Forgot Password?</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          className={` mt-2 items-center rounded-lg bg-white/15 p-4 ${isPending ? 'opacity-70' : ''}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}>
          <Text className={` text-base font-semibold`}>
            {isPending ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View className={`mt-4 flex-row justify-center`}>
          <Text className={``}>Don't have an account? </Text>
          <Link href="/(auth)/register" replace asChild>
            <TouchableOpacity>
              <Text className={` font-semibold`}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View className={`my-4 flex-row items-center`}>
          <View className={`h-px flex-1 bg-gray-400 opacity-20`} />
          <Text className={`mx-4 text-gray-400`}>or</Text>
          <View className={`h-px flex-1 bg-gray-400 opacity-20`} />
        </View>
        <TouchableOpacity
          className={`flex-row items-center justify-center gap-3 rounded-lg bg-white p-4`}
          onPress={() => handleOAuthLogin('google')}
          disabled={isOAuthLoading}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text className={`text-base font-semibold text-black`}>
            {isOAuthLoading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-row items-center bg-[${colors.primary}] justify-center gap-3 rounded-lg p-4`}
          onPress={() => handleOAuthLogin('facebook')}
          disabled={isOAuthLoading}>
          <Ionicons name="logo-facebook" size={20} color="white" />
          <Text className={`text-base font-semibold text-white`}>
            {isOAuthLoading ? 'Signing in...' : 'Continue with Facebook'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
