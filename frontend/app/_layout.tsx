import "../global.css";
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../src/context/AuthContext";
import "./global.css"; // IMPORTANT

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Log in", headerShown: false }} />
        <Stack.Screen name="signup" options={{ title: "Sign up", headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
