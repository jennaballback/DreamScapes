// src/services/dbAuth.ts
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export type DbUser = {
  id: string;         // Firestore doc ID = user id
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  photoURL?: string;  // stays optional, but we won't set it now
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

  if (snap.empty) throw new Error("No account found for that email.");

  const doc0 = snap.docs[0];
  const data = doc0.data() as any;

  if (!data.password) throw new Error("This account has no password set.");
  if (data.password !== password) throw new Error("Incorrect password.");

  // The doc ID is the canonical user id
  return { id: doc0.id, ...data } as DbUser;
}

export async function signUpWithDb(input: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<DbUser> {
  const email = input.email.trim().toLowerCase();

  // Check email uniqueness
  const emailQ = query(
    collection(db, "user"),
    where("email", "==", email),
    limit(1)
  );
  const emailSnap = await getDocs(emailQ);
  if (!emailSnap.empty) throw new Error("That email is already registered.");

  // Check username uniqueness
  const usernameQ = query(
    collection(db, "user"),
    where("username", "==", input.username),
    limit(1)
  );
  const userSnap = await getDocs(usernameQ);
  if (!userSnap.empty) throw new Error("That username is already taken.");

  // Create account
const docRef = await addDoc(collection(db, "user"), {
  username: input.username,
  firstName: input.firstName,
  lastName: input.lastName,
  email,
  password: input.password,
});

// write the id field into the document
await updateDoc(doc(db, "user", docRef.id), {
  id: docRef.id,
});

return {
  id: docRef.id,
  username: input.username,
  firstName: input.firstName,
  lastName: input.lastName,
  email,
  password: input.password,
};
}
