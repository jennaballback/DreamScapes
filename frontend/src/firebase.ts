import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
<<<<<<< HEAD
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
=======
import { getStorage } from "firebase/storage";

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';
>>>>>>> 3c453604ff08fbb4067b9adffd2a6f309760e474

// TODO: Replace the following with your app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWcsoy2s1RDRYs5yUnPZ-NtTH0aoRx54g",
  authDomain: "dreamscapes-f76f6.firebaseapp.com",
  projectId: "dreamscapes-f76f6",
  storageBucket: "dreamscapes-f76f6.firebasestorage.app",
  messagingSenderId: "452477464932",
  appId: "1:456427432021:web:3d0e0c9b6e3a5a7b2c6f2b",
};

// Initialize the app once
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };

// Get a list of cities from your database
/*export async function getUsers() {
  const usersCol = collection(db, "users");
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return userList;
}*/
/*
// src/firebase.ts
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// --- Your Firebase configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyCWcsoy2s1RDRYs5yUnPZ-NtTH0aoRx54g",
  authDomain: "dreamscapes-f76f6.firebaseapp.com",
  projectId: "dreamscapes-f76f6",
  storageBucket: "dreamscapes-f76f6.firebasestorage.app",
  messagingSenderId: "452477464932",
  appId: "1:456427432021:web:3d0e0c9b6e3a5a7b2c6f2b",
};

// --- Initialize app (singleton) ---
export const app: FirebaseApp =
  getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

// --- Auth setup (with persistence) ---
let auth = getAuth(app);

if (Platform.OS === "web") {
  // Web: store sessions in browser localStorage
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} else {
  // Native: persist sessions with AsyncStorage
  try {
    const { getReactNativePersistence } = require("firebase/auth/react-native");
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    console.warn("React Native Auth persistence fallback:", error);
    auth = getAuth(app);
  }
}

export { auth };

// --- Firestore setup (force registration) ---
export const db = initializeFirestore(
  app,
  Platform.OS === "web"
    ? {} // web defaults
    : {
        experimentalForceLongPolling: true, // fixes RN networking/firestore issues
      }
);*/
