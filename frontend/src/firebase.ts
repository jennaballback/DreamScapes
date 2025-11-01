// frontend/src/firebase.ts


import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

/** Shape of the values you defined in app.json/app.config.js under expo.extra */
interface FirebaseExtra {
  EXPO_PUBLIC_FIREBASE_API_KEY: string;
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: string;
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: string; // may be *.firebasestorage.app or *.appspot.com
  EXPO_PUBLIC_FIREBASE_SENDER_ID: string;
  EXPO_PUBLIC_FIREBASE_APP_ID: string;
  EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID?: string;
}

/** Read Expo config at runtime (SDK 50+: expoConfig; older runtimes: manifest) */
const extra: Partial<FirebaseExtra> =
  (Constants.expoConfig?.extra as Partial<FirebaseExtra>) ||
  (Constants.manifest?.extra as Partial<FirebaseExtra>) ||
  {};

/**
 * Your Firebase configuration comes from the Firebase Console.
 * These environment variables are stored safely in your app.json
 * and accessed through process.env.EXPO_PUBLIC_...
 */
const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY || extra.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || extra.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || extra.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || extra.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID || extra.EXPO_PUBLIC_FIREBASE_SENDER_ID,
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID || extra.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || extra.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// TEMP sanity check (remove later)
console.log("Firebase config check:", firebaseConfig);

// Initialize Firebase app only once (avoids "app already initialized" error)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export Firebase services you’ll use
export const auth = getAuth(app);
export const db = getFirestore(app);

