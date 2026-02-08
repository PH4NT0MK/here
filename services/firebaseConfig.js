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
const firebaseConfig = {
  apiKey: "AIzaSyDruC0Tv0dbD0t_kyoPcDD1RQxO49HmQDE",
  authDomain: "here-a053d.firebaseapp.com",
  projectId: "here-a053d",
  storageBucket: "here-a053d.firebasestorage.app",
  messagingSenderId: "375824437507",
  appId: "1:375824437507:web:375afd90e3e86b3c615936",
  measurementId: "G-YD94BDHSXP"
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
