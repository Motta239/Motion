import { Toaster, toast } from 'sonner-native';
import { View } from '~/components/nativewindui';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { BlurView } from 'expo-blur';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { ThemeToggle } from '../ThemeToggle';
import { GlobalBackground } from '../GlobalBackground';

interface CustomToastProps {
  title: string;
  icon?: React.ReactNode;
  type: 'success' | 'error' | 'info' | 'warning' | 'loading';
}

const TOAST_ICONS = {
  success: <Ionicons name="checkmark-circle" size={24} color="white" />,
  error: <Ionicons name="close-circle" size={24} color="white" />,
  warning: <Ionicons name="warning" size={24} color="white" />,
  info: <Ionicons name="information-circle" size={24} color="white" />,
  loading: <Ionicons name="sync" size={24} color="white" />,
};

const CustomToast = ({ title, icon, type }: CustomToastProps) => {
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <GlobalBackground type={type}>
      <BlurView
        intensity={isDarkColorScheme ? 40 : 90}
        tint={isDarkColorScheme ? 'dark' : 'light'}
        className=" overflow-hidden rounded-2xl">
        <View className="flex-row items-center justify-between gap-3 bg-transparent px-4 py-3">
          {icon}
          <Text className="text-base font-medium text-white">{title}</Text>

          <ThemeToggle />

          <TouchableOpacity onPress={() => toast.dismiss()}>
            <BlurView
              intensity={40}
              tint="light"
              className=" overflow-hidden rounded-full p-2 px-3 shadow-xl">
              <Text className="text-base font-bold text-white">Close</Text>
            </BlurView>
          </TouchableOpacity>
        </View>
      </BlurView>
    </GlobalBackground>
  );
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useColorScheme();

  return (
    <>
      {children}
      <Toaster
        theme={colorScheme}
        position="top-center"
        duration={4000}
        richColors
        icons={TOAST_ICONS}
        style={{
          marginTop: Platform.OS === 'ios' ? 60 : 40,
        }}
        toastOptions={{
          style: {
            backgroundColor: 'transparent',
          },
          toastContainerStyle: {
            backgroundColor: 'transparent',
            alignItems: 'center',

            width: 'auto',
          },
        }}
      />
    </>
  );
}

// Custom toast function with blur effect
export function showToast(
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'success'
) {
  toast.custom(<CustomToast title={message} icon={TOAST_ICONS[type]} type={type} />);
}
