
import "../global.css";
import React, { useEffect, useState } from "react";
<<<<<<< HEAD:frontend/app/index.tsx
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
=======
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { db } from "@/src/firebase";
import { collection, getDocs } from "firebase/firestore";
>>>>>>> 6a61b3209f0ace77415707ee4fd66078fda7eedf:frontend/app/(tabs)/index.tsx

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
<<<<<<< HEAD:frontend/app/index.tsx
=======


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fafafa",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
});
>>>>>>> 6a61b3209f0ace77415707ee4fd66078fda7eedf:frontend/app/(tabs)/index.tsx
