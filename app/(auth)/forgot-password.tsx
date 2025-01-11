import { useState } from 'react';
import { View, Text, TouchableOpacity, Keyboard, ScrollView, TextInput } from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner-native';
import { useColorScheme } from '~/lib/useColorScheme';
import { sendPasswordResetEmail } from '~/lib/supabase';
import { ThemeToggle } from '~/components/ThemeToggle';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const { colors } = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const email = watch('email');

  const handleResetPassword = async (data: ForgotPasswordFormData) => {
    try {
      Keyboard.dismiss();
      setIsLoading(true);
      const response = await sendPasswordResetEmail(data.email.toLowerCase());

      if (!response.success) {
        if (response.message.includes('No account found')) {
          toast.error(
            'No account found with this email address. Please check your email or sign up.'
          );
          return;
        }
        toast.error(response.message || 'Failed to send reset email');
        return;
      }

      setEmailSent(true);
      toast.success(response.message);
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView className="flex-1 bg-[#121212]">
        <ScrollView>
          <View className="flex-1 items-center justify-center px-4 py-8">
            <View className="mb-8 items-center">
              <Ionicons name="mail-outline" size={64} color={colors.primary} />
              <Text className="mt-4 text-center text-2xl font-bold text-white">
                Check Your Email
              </Text>
              <Text className="mt-2 px-6 text-center text-gray-400">
                We've sent password reset instructions to:
              </Text>
              <Text className={`text-[${colors.primary}] mt-2 font-semibold`}>{email}</Text>
            </View>

            <View className="w-full gap-4">
              <TouchableOpacity
                onPress={handleSubmit(handleResetPassword)}
                className="rounded-lg bg-white/10 p-4">
                <Text className="text-center font-semibold text-white">Resend Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.replace('/login')}
                className={`bg-[${colors.primary}] rounded-lg p-4`}>
                <Text className="text-center font-semibold text-white">Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#121212]">
      <ScrollView>
        <View className="gap-4 px-4 py-8">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text className="ml-2 text-2xl font-semibold text-white">Back</Text>
          </TouchableOpacity>

          <View>
            <Text className="mb-2 text-3xl font-bold text-white">Reset Password</Text>
            <Text className="mb-8 text-gray-400">
              Enter your email address and we'll send you instructions to reset your password
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
                    <Text className="ml-3 mt-1 text-sm text-red-500">{errors.email.message}</Text>
                  )}
                </View>
              )}
            />

            <TouchableOpacity
              onPress={handleSubmit(handleResetPassword)}
              disabled={isLoading}
              className={`bg-[${colors.primary}] rounded-lg p-4 ${isLoading ? 'opacity-50' : ''}`}>
              <Text className="text-center font-semibold text-white">
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Text>
            </TouchableOpacity>

            <View className="mt-2 flex-row justify-center">
              <Text className="text-gray-400">Remember your password? </Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text className={`text-[${colors.primary}] font-semibold`}>Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
