import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

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
