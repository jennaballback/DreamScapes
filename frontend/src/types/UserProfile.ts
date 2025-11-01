// src/types/UserProfile.ts

/**
 * ================================================================
 *  UserProfile Type Definition
 *  ---------------------------
 *  Collection: "users"
 *
 *  Each document corresponds to one Firebase Auth user (uid = doc ID)
 *  and stores public profile data + the user's interpretation preference.
 *
 *  Designed for easy expansion — you can add more cultural systems
 *  or user-level settings without changing your core Firestore structure.
 * ================================================================
 */

/**
 * All possible default interpretation categories.
 * Add new ones here as your project expands to support more cultures.
 */
export type InterpretationPref =
  | "psychological"
  | "cultural_hindu"
  | "cultural_christian"
  | "cultural_islamic"
  | "cultural_other";

/**
 * Firestore structure for each user document in the "users" collection.
 */
export interface UserProfile {
  /** Firebase Authentication UID (matches document ID in Firestore) */
  uid: string;

  /** Unique username/handle chosen by the user */
  username: string;

  /** User's given and family names */
  firstName: string;
  lastName: string;

  /** Primary email (duplicated from Firebase Auth for convenience) */
  email: string;

  /** Optional URL to the user’s profile picture in Firebase Storage */
  profilePicture?: string;

  /**
   * The user's preferred interpretation type.
   * Used by the app to decide which interpretation (psychological/cultural variant)
   * to display for their dreams.
   */
  interpretationPreference: InterpretationPref;

  /** Firestore server timestamp for when the document was first created */
  dateCreated?: any;

  /** Firestore server timestamp for the last time the profile was updated */
  updatedAt?: any;
}
