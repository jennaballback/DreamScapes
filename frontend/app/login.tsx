import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useDbAuth } from "../src/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { signIn } = useDbAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErr(""); setLoading(true);
    try {
      await signIn(email, password);      // dev-only
      router.replace("/(tabs)");          // go to tabs home
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex:1, padding:24, justifyContent:"center", gap:12 }}>
      <Text style={{ fontSize:24, fontWeight:"700" }}>Login</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth:1, borderColor:"#ccc", borderRadius:8, padding:12 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth:1, borderColor:"#ccc", borderRadius:8, padding:12 }}
      />

      {err ? <Text style={{ color:"crimson" }}>{err}</Text> : null}

      <Pressable
        onPress={onSubmit}
        disabled={loading}
        style={{ backgroundColor:"#111827", padding:12, borderRadius:10, opacity: loading ? 0.7 : 1 }}
      >
        <Text style={{ color:"white", textAlign:"center", fontWeight:"600" }}>
          {loading ? "Signing in..." : "Sign in"}
        </Text>
      </Pressable>
    </View>
  );
}