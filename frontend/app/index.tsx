import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthContext";

// (optional) if you want to read the user's profile doc
// import { db } from "../src/firebase";
// import { doc, onSnapshot } from "firebase/firestore";

export default function Home() {
  const { user, initializing, signOut } = useAuth();

  // OPTIONAL: load extra profile fields from Firestore (e.g., interpretationPreference)
  // const [preference, setPreference] = useState<string | null>(null);
  // useEffect(() => {
  //   if (!user) return;
  //   const ref = doc(db, "users", user.uid);
  //   const unsub = onSnapshot(ref, (snap) => {
  //     setPreference((snap.data()?.interpretationPreference as string) ?? null);
  //   });
  //   return unsub;
  // }, [user]);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // not logged in? go to /login
  if (!user) return <Redirect href="/login" />;

  // logged in view
  return (
    <View style={{ flex: 1, padding: 24, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        hello, {user.displayName || user.email}
      </Text>
      {/* <Text>Your preference: {preference ?? "—"}</Text> */}

      <Text style={{ textAlign: "center" }}>
        you’re logged in. replace this with your feed or “test users list” screen.
      </Text>

      <TouchableOpacity
        onPress={signOut}
        style={{ marginTop: 16, backgroundColor: "#111827", padding: 12, borderRadius: 12 }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
