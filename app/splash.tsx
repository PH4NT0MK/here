// app/splash.tsx
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from './context/authContext';

export default function SplashScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) {
      router.replace('/(main)/today');
    } else {
      router.replace('/(auth)/sign-in');
    }
  }, [loading, user]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <ThemedText>Loading…</ThemedText>
    </View>
  );
}
