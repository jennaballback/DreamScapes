// src/services/dbAuth.ts
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  limit,
  serverTimestamp,
} from "firebase/firestore";

// --- Type for your database user ---
export interface DbUser {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string; // DEV-ONLY — remove when real auth is added
  photoURL?: string;
  interpretationPreference?: string;
  userId?: number;
  dateCreated?: any;
}

// --- Login helper (fetch by email + compare plaintext password) ---
export async function signInWithDb(
  email: string,
  password: string
): Promise<DbUser> {
  const q = query(collection(db, "user"), where("email", "==", email.trim()), limit(1));
  const snap = await getDocs(q);
  const doc0 = snap.docs[0];
  if (!doc0) throw new Error("No account found for that email.");

  const data = doc0.data() as DbUser;
  if (!data.password) throw new Error("This account has no password set (dev only).");
  if (data.password !== password) throw new Error("Incorrect password.");

  return { id: doc0.id, ...data };
}

// --- Signup helper (create new user document in Firestore) ---
export interface NewUserInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string; // plaintext for now
  photoURL?: string;
  interpretationPreference?: "psychological" | "spiritual" | "symbolic";
}

export async function createUser(input: NewUserInput): Promise<DbUser> {
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim();

  const usersCol = collection(db, "user");

  // Check for duplicate email
  const emailSnap = await getDocs(query(usersCol, where("email", "==", email)));
  if (!emailSnap.empty) {
    throw new Error("An account with this email already exists.");
  }

  // Check for duplicate username
  const usernameSnap = await getDocs(query(usersCol, where("username", "==", username)));
  if (!usernameSnap.empty) {
    throw new Error("That username is already taken.");
  }

  const newDoc = {
    email,
    username,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    password: input.password,
    photoURL: input.photoURL ?? "",
    interpretationPreference: input.interpretationPreference ?? "psychological",
    userId: Date.now(),
    dateCreated: serverTimestamp(),
  };

  const ref = await addDoc(usersCol, newDoc);

  return { id: ref.id, ...newDoc };
}

// --- Optional: quick fetch helper for profile by email ---
export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const q = query(collection(db, "user"), where("email", "==", email.trim()), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const doc0 = snap.docs[0];
  return { id: doc0.id, ...(doc0.data() as DbUser) };
}


/*import { collection, query, where, limit, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export type DbUser = {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string; // dev only
  [k: string]: any;
};

// DEV-ONLY: Look up by email and compare plaintext password.
export async function signInWithDb(email: string, password: string): Promise<DbUser> {
  const q = query(collection(db, "user"), where("email", "==", email.trim()), limit(1));
  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error("No account found for that email.");
  }

  // snap.docs[0] is guaranteed to exist here
  const doc0: QueryDocumentSnapshot = snap.docs[0];
  const data = doc0.data() as DbUser;

  if (!data.password) throw new Error("This account has no password set (dev only).");
  if (data.password !== password) throw new Error("Incorrect password.");

  // This is now perfectly valid and type-safe
  return { id: doc0.id, ...data };
}*/
