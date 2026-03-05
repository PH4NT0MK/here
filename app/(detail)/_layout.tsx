import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DetailLayout = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <StatusBar style={colorScheme === 'light' ? 'dark' : 'light'} backgroundColor={theme.colors.card} translucent={false} />
      <Slot />
    </SafeAreaView>
  );
};

export default DetailLayout;
