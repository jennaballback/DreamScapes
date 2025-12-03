// app/signup.tsx
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

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useDbAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (submitting) return;

    if (!firstName || !lastName || !username || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await signUp({
        firstName,
        lastName,
        username,
        email,
        password,
      });

      // signUp in AuthContext will navigate to "/(tabs)"
    } catch (e: any) {
      console.error("Signup error:", e);
      setError(e?.message ?? "Failed to create account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 py-10">
      <Text className="text-3xl font-bold mb-4 text-center">
        Create New Account
      </Text>

      <View>
        <Text className="mb-2 text-gray-700">First name</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First name"
          placeholderTextColor="#9CA3AF"
        />

        <Text className="mb-2 text-gray-700">Last name</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last name"
          placeholderTextColor="#9CA3AF"
        />

        <Text className="mb-2 text-gray-700">Username</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          placeholder="dreamer123"
          placeholderTextColor="#9CA3AF"
        />

        <Text className="mb-2 text-gray-700">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-gray-900"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="#9CA3AF"
        />

        <Text className="mb-2 text-gray-700">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-gray-900"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {error && (
        <Text className="text-red-500 mb-4 text-center">{error}</Text>
      )}

      <TouchableOpacity
        onPress={handleSignup}
        disabled={submitting}
        className={`rounded-full py-3 items-center ${
          submitting ? "bg-gray-400" : "bg-primary"
        }`}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-lg">Sign up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/login")}
        className="mt-4 items-center"
      >
        <Text className="text-sm text-slate-700">
          Already registered?{" "}
          <Text className="font-semibold text-indigo-600">Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
