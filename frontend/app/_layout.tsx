import "../global.css";
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../src/context/AuthContext";

// Main app layout
export default function RootLayout() {
  return (
    // Wraps all screens so user data is shared everywhere
    <AuthProvider>
      {/* Controls main navigation between screens */}
      <Stack>
        {/* Bottom tab navigation */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Opens a specific dream entry */}
        <Stack.Screen
          name="dreamentry/[id]"
          options={{ headerShown: false }}
        />

        {/* You can add login/signup screens here later */}
        {/* <Stack.Screen name="login" options={{ headerShown: false }} /> */}
      </Stack>
    </AuthProvider>
  );
}

