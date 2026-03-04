// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, getReactNativePersistence, initializeAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from 'react-native';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Use expoConfig.extra instead of manifest
const { extra } = Constants.expoConfig || {};

// Throw helpful error in development if secrets are missing
if (__DEV__) {
  const requiredKeys = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'FIREBASE_MEASUREMENT_ID',
  ];
  requiredKeys.forEach(key => {
    if (!extra?.[key]) {
      console.warn(`⚠️ Missing Firebase config key: ${key}`);
    }
  });
}

const firebaseConfig = {
  apiKey: extra?.FIREBASE_API_KEY,
  authDomain: extra?.FIREBASE_AUTH_DOMAIN,
  projectId: extra?.FIREBASE_PROJECT_ID,
  storageBucket: extra?.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: extra?.FIREBASE_MESSAGING_SENDER_ID,
  appId: extra?.FIREBASE_APP_ID,
  measurementId: extra?.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth =
  Platform.OS === 'web'
    ? (() => {
      const webAuth = getAuth(app);
      setPersistence(webAuth, browserLocalPersistence);
      return webAuth;
    })()
    : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

export const db = getFirestore(app);
