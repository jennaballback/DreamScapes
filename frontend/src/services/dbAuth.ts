// src/services/dbAuth.ts
import { collection, addDoc, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../firebase";

export type DbUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // dev-only, plain text
  interpretationPreference?: string;
};

export async function signInWithDb(
  email: string,
  password: string
): Promise<DbUser> {
  const q = query(
    collection(db, "user"),
    where("email", "==", email.trim().toLowerCase()),
    limit(1)
  );
  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error("No account found for that email.");
  }

  const doc0 = snap.docs[0];
  const data = doc0.data() as any;

  if (!data.password) {
    throw new Error("This account has no password set.");
  }

  if (data.password !== password) {
    throw new Error("Incorrect password.");
  }

  return { id: doc0.id, ...data } as DbUser;
}

export async function signUpWithDb(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  interpretationPreference?: string;
}): Promise<DbUser> {
  const email = input.email.trim().toLowerCase();

  // check for existing user
  const q = query(collection(db, "user"), where("email", "==", email), limit(1));
  const snap = await getDocs(q);
  if (!snap.empty) {
    throw new Error("That email is already registered.");
  }

  const docRef = await addDoc(collection(db, "user"), {
    ...input,
    email,
  });

  return { id: docRef.id, ...input, email };
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
