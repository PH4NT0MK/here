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

// const firebaseConfig = {
//   apiKey: extra?.firebaseApiKey,
//   authDomain: extra?.firebaseAuthDomain,
//   projectId: extra?.firebaseProjectId,
//   storageBucket: extra?.firebaseStorageBucket,
//   messagingSenderId: extra?.firebaseMessagingSenderId,
//   appId: extra?.firebaseAppId,
//   measurementId: extra?.firebaseMeasurementId,
// };

const firebaseConfig = {
  apiKey: "AIzaSyDHu70MPE5NyYFhzmVEVd3u9zruJiD50lI",
  authDomain: "here-a053d.firebaseapp.com",
  projectId: "here-a053d",
  storageBucket: "here-a053d.firebasestorage.app",
  messagingSenderId: "375824437507",
  appId: "1:375824437507:web:a322d926c71abbba615936",
  measurementId: "G-T4NVZR31PY"
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
