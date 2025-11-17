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

type SignUpInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  interpretationPreference?: string;
};

interface AuthContextType {
  user: DbUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpInput) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // later you can restore a saved session here
  useEffect(() => {
    // placeholder
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const u = await signInWithDb(email, password);
      setUser(u);                 // ✅ store user in context
      router.replace("/(tabs)");  // ✅ go to main tabs after login
    } catch (err: any) {
      alert(err?.message ?? "Error logging in.");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpInput) => {
    try {
      setLoading(true);
      const u = await signUpWithDb(data);
      setUser(u);                 // ✅ auto-login after sign-up
      router.replace("/(tabs)");
    } catch (err: any) {
      alert(err?.message ?? "Error creating account.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Main hook
export function useDbAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useDbAuth must be used inside an AuthProvider");
  }
  return ctx;
}

// Optional alias if anything still imports useAuth()
export const useAuth = useDbAuth;
