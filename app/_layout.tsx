import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { Slot, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { AuthProvider, useAuth } from '../context/authContext';
import { HabitsProvider } from '../context/habitContext';
import { JournalProvider } from '../context/journalContext';

SplashScreen.preventAutoHideAsync();

const RootNavigation = () => {
  const scheme = useColorScheme();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('visible');

      NavigationBar.setButtonStyleAsync(scheme === 'dark' ? 'light' : 'dark');
    }
  }, [scheme]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) {
      router.replace('/(main)/today');
    } else {
      router.replace('/(auth)/sign-in');
    }

    SplashScreen.hideAsync();
  }, [loading, user]);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Slot />
    </ThemeProvider>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <HabitsProvider>
        <JournalProvider>
          <RootNavigation />
        </JournalProvider>
      </HabitsProvider>
    </AuthProvider>
  );
};

export default RootLayout;
