// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "expo-router";
import { signInWithDb, signUpWithDb, type DbUser } from "../services/dbAuth";

interface AuthContextType {
  user: DbUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    photoUri?: string;  // local URI from ImagePicker
  }) => Promise<void>;
  signOut: () => void;

  updateUserProfileInContext: (partial: Partial<DbUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // later: restore session if you want
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const u = await signInWithDb(email, password);
      setUser(u);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Sign in error:", err);
      alert(err?.message ?? "Error logging in.");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    photoUri?: string;
  }) => {
    setLoading(true);
    try {
      const u = await signUpWithDb(data);
      setUser(u);
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("Sign up error:", err);
      alert(err?.message ?? "Error creating account.");
      throw err; // so the signup screen can also react if it wants
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    router.replace("/login");
  };

  const updateUserProfileInContext = (partial: Partial<DbUser>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUserProfileInContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useDbAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useDbAuth must be used inside an AuthProvider");
  return ctx;
}

export const useAuth = useDbAuth;
