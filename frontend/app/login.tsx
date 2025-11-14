// app/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { signInWithDb } from "../src/services/dbAuth"; // <- from the file we wrote

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      // DEV auth against Firestore “user” collection
      const user = await signInWithDb(email, password);

      // If you have an AuthContext with setUser/signIn, call it here.
      // For now, just navigate to tabs:
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white px-6 py-10">
      <Text className="text-3xl font-bold mb-10">Log in</Text>

      <Text className="mb-2 text-gray-700">Email</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
      />

      <Text className="mb-2 text-gray-700">Password</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />

      <TouchableOpacity
        disabled={loading}
        onPress={handleLogin}
        className={`w-full py-4 rounded-xl ${loading ? "bg-gray-400" : "bg-black"}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold">Log in</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600 mr-2">New here?</Text>
        <Link href="/signup" className="text-indigo-600 font-semibold">
          Create an account
        </Link>
      </View>
    </View>
  );
}


/*import React, { useState } from "react";
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
}*/