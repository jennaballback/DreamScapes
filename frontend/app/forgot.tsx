import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { resetPassword } from "../src/ts/auth";

export default function Forgot() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  const onReset = async () => {
    if (!email.trim()) return;
    try {
      setLoading(true);
      await resetPassword(email.trim());
      Alert.alert("Email sent", "Check your inbox for a reset link.");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Reset password</Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />
      <TouchableOpacity
        onPress={onReset}
        disabled={loading}
        style={{ backgroundColor: "#111827", padding: 14, borderRadius: 12, alignItems: "center" }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          {loading ? "Sending..." : "Send reset link"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
