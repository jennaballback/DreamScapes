import React, { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import { signInWithDb, DbUser } from "../services/dbAuth";

type Ctx = {
  user: DbUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  initializing: boolean;
};

const AuthContext = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DbUser | null>(null);
  const [initializing, setInitializing] = useState(false);

  const signIn = async (email: string, password: string) => {
    setInitializing(true);
    try {
      const u = await signInWithDb(email, password);
      setUser(u);
    } finally {
      setInitializing(false);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, signIn, signOut, initializing }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useDbAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useDbAuth must be used inside AuthProvider");
  return ctx;
}

/*import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut as fbSignOut, User } from "firebase/auth";
//import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  initializing: boolean;
  signOut: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const value = useMemo(
    () => ({
      user,
      initializing,
      signOut: async () => {}, // placeholder while Auth is disabled
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to access the context anywhere
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
};*/
