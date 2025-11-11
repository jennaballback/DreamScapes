/*import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { UserProfile, InterpretationPref } from "../types/UserProfile";

// ensure users/{uid} exists (idempotent)
async function ensureUserDoc(uid: string, data: Partial<UserProfile> = {}) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid,
      email: data.email ?? "",
      username: data.username ?? "",
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      profilePicture: data.profilePicture ?? "",
      interpretationPreference: (data.interpretationPreference ?? "psychological") as InterpretationPref,
      dateCreated: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } satisfies UserProfile);
  }
  return ref;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  username: string,
  interpretationPreference: InterpretationPref = "psychological"
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // optional: set display name for convenience in Auth
  await updateProfile(cred.user, { displayName: `${firstName} ${lastName}` });

  // create users/{uid}
  await ensureUserDoc(cred.user.uid, {
    email,
    firstName,
    lastName,
    username,
    interpretationPreference,
  });

  return cred.user;
}

export async function signInWithEmail(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  // backfill users/{uid} if missing (useful for test accounts)
  await ensureUserDoc(user.uid, { email: user.email ?? "" });
  return user;
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}
*/