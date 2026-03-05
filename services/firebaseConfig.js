// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, getReactNativePersistence, initializeAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from 'react-native';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Use expoConfig.extra instead of manifest
// const { extra } = Constants.expoConfig || {};

// const firebaseConfig = {
//   apiKey: extra?.FIREBASE_API_KEY,
//   authDomain: extra?.FIREBASE_AUTH_DOMAIN,
//   projectId: extra?.FIREBASE_PROJECT_ID,
//   storageBucket: extra?.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: extra?.FIREBASE_MESSAGING_SENDER_ID,
//   appId: extra?.FIREBASE_APP_ID,
//   measurementId: extra?.FIREBASE_MEASUREMENT_ID
// };

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID,
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
