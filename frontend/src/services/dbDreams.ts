// src/services/dbDreams.ts
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
  } from "firebase/firestore";
  import { db } from "../firebase";
  import type { DreamEntry } from "../types/DreamEntry";
  
  export async function addDreamEntry(
    userId: string,
    data: {
      title: string;
      content: string;
      createdAt: Date; // or whatever type you use
    }
  ): Promise<DreamEntry> {
    const docRef = await addDoc(collection(db, "dream_entries"), {
      userId,                     //  connect dream to user
      title: data.title,
      content: data.content,
      createdAt: data.createdAt,
    });
  
    return {
      dreamId: docRef.id,
      userId,
      title: data.title,
      content: data.content,
      createdAt: data.createdAt.toString(), // adjust to your type
    };
  }
  