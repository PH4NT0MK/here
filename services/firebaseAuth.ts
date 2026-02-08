// services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

// Register a new user
export const register = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login an existing user
export const login = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout current user
export const logout = async () => {
  return signOut(auth);
};
