// // app/_layout.tsx
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { useColorScheme } from 'react-native';
// import { AuthProvider } from './context/authContext';

// export default function RootLayout() {
//   const scheme = useColorScheme();

//   return (
//     <AuthProvider>
//       <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="splash" />
//           <Stack.Screen name="(auth)" />
//           <Stack.Screen name="(main)" />
//         </Stack>
//         <StatusBar style="auto" />
//       </ThemeProvider>
//     </AuthProvider>
//   );
// }


// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { AuthProvider, useAuth } from './context/authContext';

// Keep native splash visible
SplashScreen.preventAutoHideAsync();

const RootNavigation = () => {
  const scheme = useColorScheme();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Keep nav bar visible
      NavigationBar.setVisibilityAsync('visible');

      // Set button style: 'dark' for dark icons, 'light' for light icons
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
    return null; // native splash stays visible
  }

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(detail)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
};

export default RootLayout;
