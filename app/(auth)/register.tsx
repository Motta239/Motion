import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSignUpWithEmail, signInWithProvider } from '~/lib/supabase';
import { useColorScheme } from '~/lib/useColorScheme';

// Define the register schema
const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Define the type for the form data
type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const { colors } = useColorScheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: signUp, isPending } = useSignUpWithEmail();

  const onSubmit = (data: RegisterFormData) => {
    signUp({ email: data.email.toLowerCase(), password: data.password });
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    const { error, data: user } = await signInWithProvider(provider);
    if (error) Alert.alert('Error', error.message);
    if (user) router.replace('/(tabs)');
  };

  return (
    <ScrollView className="flex-1 px-4">
      <View className="mb-10 mt-10">
        <Text
          maxFontSizeMultiplier={1.2}
          className={`text-4xl font-bold text-[${colors.foreground}] mb-2`}>
          Create Account
        </Text>
        <Text maxFontSizeMultiplier={1.2} className={`text-lg text-[${colors.foreground}]`}>
          Sign up to get started
        </Text>
      </View>

      <View className="gap-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View>
              <View className="flex-row items-center rounded-lg bg-white/5 px-4">
                <Ionicons name="mail-outline" size={20} color={colors.foreground} />
                <TextInput
                  className="ml-3 h-12 flex-1 text-base text-white"
                  placeholder="Email"
                  placeholderTextColor={colors.foreground}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                />
              </View>
              {errors.email && (
                <Text className="ml-3 mt-1 text-xs text-red-500">{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View>
              <View className="flex-row items-center rounded-lg bg-white/5 px-4">
                <Ionicons name="lock-closed-outline" size={20} color={colors.foreground} />
                <TextInput
                  className="ml-3 h-12 flex-1 text-base text-white"
                  placeholder="Password"
                  placeholderTextColor={colors.foreground}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              </View>
              {errors.password && (
                <Text className="ml-3 mt-1 text-xs text-red-500">{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <View>
              <View className="flex-row items-center rounded-lg bg-white/5 px-4">
                <Ionicons name="lock-closed-outline" size={20} color={colors.foreground} />
                <TextInput
                  className="ml-3 h-12 flex-1 text-base text-white"
                  placeholder="Confirm Password"
                  placeholderTextColor={colors.foreground}
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
              </View>
              {errors.confirmPassword && (
                <Text className="ml-3 mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          className={`bg-[${colors.primary}] mt-2 items-center rounded-lg p-4 ${isPending ? 'opacity-70' : ''}`}
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}>
          <Text className={`text-[${colors.foreground}] text-base font-semibold`}>
            {isPending ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View className="mt-4 flex-row justify-center">
          <Text className={`text-[${colors.foreground}]`}>Already have an account? </Text>
          <Link href="/login" replace asChild>
            <TouchableOpacity>
              <Text className={`text-[${colors.primary}] font-semibold`}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="my-4 flex-row items-center">
        <View className={`h-px flex-1 bg-[${colors.foreground}] opacity-20`} />
        <Text className={`mx-4 text-[${colors.foreground}]`}>or</Text>
        <View className={`h-px flex-1 bg-[${colors.foreground}] opacity-20`} />
      </View>

      <View className="my-4 gap-4">
        <TouchableOpacity
          className="flex-row items-center justify-center gap-3 rounded-lg bg-white p-4"
          onPress={() => handleOAuthLogin('google')}
          disabled={isPending}>
          <Ionicons name="logo-google" size={20} color="#DB4437" />
          <Text className="text-base font-semibold text-black">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-row items-center justify-center gap-3 rounded-lg bg-[#1877F2] p-4`}
          onPress={() => handleOAuthLogin('facebook')}
          disabled={isPending}>
          <Ionicons name="logo-facebook" size={20} color="white" />
          <Text className="text-base font-semibold text-white">Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
