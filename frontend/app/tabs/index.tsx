
// app/index.tsx
import "../global.css";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { db } from "../../src/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { UserProfile } from "../../src/types/UserProfile";


const user = {
  displayName : 'jerry',
  email : 'jerry@gmail.com'
}

export default function Home() {
  const { user, initializing, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // When user is logged in, subscribe to their profile doc
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }
    setLoadingProfile(true);
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
      setLoadingProfile(false);
    });
    return unsub;
  }, [user]);

  // Wait for Firebase to restore session or finish profile read
  if (initializing || loadingProfile) {
  // const { user, initializing, signOut } = useAuth();
  const { initializing, signOut } = useAuth();

  // Show a spinner while Firebase restores the session
  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Not logged in? send to /login
  //if (!user) return <Redirect href="/login" />;

  // Logged in view
  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        hello, {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user.email}
      </Text>

      <Text style={{ textAlign: "center" }}>
        Preference: {profile?.interpretationPreference ?? "—"}
      </Text>

      <Text style={{ textAlign: "center", opacity: 0.8 }}>
        replace this screen with your feed / tabs, or redirect to <Text style={{ fontWeight: "700" }}>(tabs)</Text> after login.
      </Text>

      <TouchableOpacity
        onPress={signOut}
        style={{
          marginTop: 16,
          backgroundColor: "#111827",
          padding: 12,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
