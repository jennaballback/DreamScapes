// src/types/DreamEntry.ts

/**
 * Each document in the "dreams" collection represents one dream journal entry.
 */
export interface DreamEntry {
    /** Firestore document ID (e.g., "dream_123") */
    dreamId: string;
  
    /** UID of the user who owns this dream */
    userId: string;
  
    /** Title or short label for the dream */
    title: string;
  
    /** Main text/content of the dream */
    content: string;
  
    /** Optional mood/quality or tags */
    mood?: string;
    tags?: string[];
  
    /** When this dream was recorded */
    createdAt?: any; // Firestore Timestamp
    updatedAt?: any; // Firestore Timestamp
  }
  