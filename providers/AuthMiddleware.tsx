import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from './AuthProvider';

// Define which routes require authentication
const PROTECTED_SEGMENTS = ['(tabs)/', 'profile'];

export function AuthMiddleware({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inProtectedRoute = segments.some((segment) => PROTECTED_SEGMENTS.includes(segment));

    // console.log('user', user);
    if (!user && inProtectedRoute) {
      router.replace('/(auth)/login');
    } else if (user) {
      router.replace('/(tabs)/home');
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}
