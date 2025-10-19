import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { signInWithEmail } from "../src/services/auth";

export default function Login() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // if already logged in, bounce to home
  useEffect(() => {
    if (user) router.replace("/");
  }, [user]);

  const onLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Missing info", "Please enter email and password.");
    }
    try {
      setLoading(true);
      await signInWithEmail(email.trim(), password);
      // onAuthStateChanged will redirect via effect above
    } catch (e: any) {
      Alert.alert("Login failed", e.message ?? "Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 8 }}>
        DreamScapes
      </Text>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderRadius: 12, padding: 12 }}
      />

      <TouchableOpacity
        onPress={onLogin}
        disabled={loading}
        style={{ backgroundColor: "#111827", padding: 14, borderRadius: 12, alignItems: "center" }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          {loading ? "Logging in..." : "Log In"}
        </Text>
      </TouchableOpacity>

      <Link href="/forgot" style={{ textAlign: "center", marginTop: 8 }}>
        Forgot password?
      </Link>

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 12 }}>
        <Text>New here? </Text>
        <Link href="/signup" style={{ fontWeight: "700" }}>
          Create an account
        </Link>
      </View>
    </View>
  );
}
