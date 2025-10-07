// frontend/src/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Your Firebase configuration comes from the Firebase Console.
 * These environment variables are stored safely in your app.json
 * and accessed through process.env.EXPO_PUBLIC_...
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app only once (avoids "app already initialized" error)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Export Firebase services you’ll use
export const auth = getAuth(app);
export const db = getFirestore(app);
