import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveCoverImage = async (uri: string) => {
  try {
    await AsyncStorage.setItem('@today_cover_image', uri);
  } catch (e) {
    console.error('Failed to save cover image', e);
  }
};

export const getCoverImage = async () => {
  try {
    const uri = await AsyncStorage.getItem('@today_cover_image');
    return uri; // can be null
  } catch (e) {
    console.error('Failed to load cover image', e);
    return null;
  }
};
