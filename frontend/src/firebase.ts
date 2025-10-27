// src/firebase.ts
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWcsoy2s1RDRYs5yUnPZ-NtTH0aoRx54g",
  authDomain: "dreamscapes-f76f6.firebaseapp.com",
  projectId: "dreamscapes-f76f6",
  storageBucket: "dreamscapes-f76f6.firebasestorage.app",
  messagingSenderId: "452477464932",
  appId: "1:452477464932:web:ac8712b27d930e9e6c6a71",
};

const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Auth (different init for native vs web)
let auth = getAuth(app);
if (Platform.OS !== "web") {
  // React Native needs initializeAuth with AsyncStorage persistence
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // initializeAuth may be called twice in dev; fall back to getAuth
    auth = getAuth(app);
  }
} else {
  // Web persistence (don’t use top-level await)
  setPersistence(auth, browserLocalPersistence).catch(() => {});
}

export const db = getFirestore(app);
export { auth, app };

