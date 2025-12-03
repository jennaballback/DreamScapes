// src/types/UserProfile.ts

// Single source of truth for what a “user profile” looks like in the app
export type UserProfile = {
  id: string;           // Firestore document id
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;    // optional profile picture URL
};

export const emptyUserProfile: UserProfile = {
  id: "",
  username: "",
  firstName: "",
  lastName: "",
  email: "",
};
