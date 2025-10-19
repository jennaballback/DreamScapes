
import "../global.css";
import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

export default function Home() {
  const { user, initializing, signOut } = useAuth();

  // Show a spinner while Firebase restores the session
  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Not logged in? send to /login
  if (!user) return <Redirect href="/login" />;

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
        hello, {user.displayName || user.email}
      </Text>

      <Text style={{ textAlign: "center" }}>
        you’re logged in. replace this with your feed or “test users list” screen.
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
