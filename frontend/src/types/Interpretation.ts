// src/types/Interpretation.ts

import type { InterpretationPref } from "./UserProfile";

/**
 * Each document in the "interpretations" collection stores AI-generated
 * interpretations for one dream, with multiple cultural/psychological fields.
 */
export interface Interpretation {
  /** Firestore document ID (usually equals dreamId for 1:1 mapping) */
  interpretationId: string;

  /** Dream foreign key */
  dreamId: string;

  /** User foreign key */
  userId: string;

  /** Each variant of interpretation content (optional fields) */
  Psychological?: string;
  Cultural_Hindu?: string;
  Cultural_Christian?: string;
  Cultural_Islamic?: string;
  Cultural_Other?: string;

  /** Which interpretation type was shown/generated based on user pref */
  preferenceUsed?: InterpretationPref;

  /** Firestore timestamps */
  createdAt?: any;
  updatedAt?: any;
}
