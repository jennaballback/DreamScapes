import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../src/context/AuthContext";
import "./global.css"; // IMPORTANT

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="dreamentry/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}
