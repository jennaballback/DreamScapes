import "../global.css";
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../src/context/AuthContext";
import "./global.css"; // IMPORTANT

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,   // Hides the default header everywhere 🔥
        }}
      />
    </AuthProvider>
  );
}
