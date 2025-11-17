// app/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useDbAuth } from "../src/context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading } = useDbAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }
    await signIn(email, password);
    // signIn will navigate to "/(tabs)" on success
  };

  return (
    <View className="flex-1 bg-white px-6 py-10">
      <Text className="text-3xl font-bold mb-10 text-center">Log in</Text>

      <Text className="mb-2 text-gray-700">Email</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-black"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        placeholderTextColor="#9CA3AF"
      />

      <Text className="mb-2 text-gray-700">Password</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-black"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor="#9CA3AF"
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-[#0f0d23] rounded-2xl py-4 items-center"
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-semibold">Log in</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/signup")}
        className="mt-6 items-center"
      >
        <Text className="text-[#0f0d23] underline">
          Don&apos;t have an account? Sign up
        </Text>
      </TouchableOpacity>
    </View>
  );
}



/*// app/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { signInWithDb } from "../src/services/dbAuth";

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
      // Verify against Firestore "user" docs (dev auth)
      const user = await signInWithDb(email, password);

      // Go to tabs and pass the email so Home can greet by name
      router.replace({ pathname: "/(tabs)", params: { email: user.email } });
    } catch (e: any) {
      Alert.alert("Login failed", e?.message ?? "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white px-6 py-10">
    <Text className="text-3xl font-bold mb-10">Login</Text>

    <Text className="mb-2 text-gray-700">Email</Text>
    <TextInput
      className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-black"
      autoCapitalize="none"
      keyboardType="email-address"
      value={email}
      onChangeText={setEmail}
      placeholder="you@example.com"
      placeholderTextColor="#6B7280"
    />

    <Text className="mb-2 text-gray-700">Password</Text>
    <TextInput
      className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-black"
      secureTextEntry
      value={password}
      onChangeText={setPassword}
      placeholder="••••••••"
      placeholderTextColor="#6B7280"
    />

      <TouchableOpacity
        disabled={loading}
        onPress={handleLogin}
        className={`w-full py-4 rounded-xl ${loading ? "bg-gray-400" : "bg-black"}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold">Login</Text>
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
}*/
