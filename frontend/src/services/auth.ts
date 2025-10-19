import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
  } from "firebase/auth";
  import { auth, db } from "../firebase";
  import { doc, serverTimestamp, setDoc } from "firebase/firestore";
  
  export async function signInWithEmail(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  }
  
  export async function signUpWithEmail(
    email: string,
    password: string,
    displayName?: string,
    interpretationPreference: "psychological" | "cultural" = "psychological"
  ) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
  
    // create Firestore user profile doc
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email,
      displayName: displayName ?? "",
      interpretationPreference,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  
    return cred.user;
  }
  
  export function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }
  