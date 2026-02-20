import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const DetailLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <Slot />
    </SafeAreaView>
  );
};

export default DetailLayout;
