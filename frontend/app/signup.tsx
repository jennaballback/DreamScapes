// app/signup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useDbAuth } from "../src/context/AuthContext";

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, loading } = useDbAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preference, setPreference] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (submitting) return;
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await signUp({
        firstName,
        lastName,
        email,
        password,
        interpretationPreference: preference,
      });
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e?.message ?? "Failed to create account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 py-10">
      <Text className="text-3xl font-bold mb-2 text-center">Create New Account</Text>

      <View className="mt-6">
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

        {/* you can style the interpretation radios here later */}
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
    </View>
  );
}


/*// app/signup.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter, Link } from "expo-router";
import { createUser } from "../src/services/dbAuth";

export default function Signup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [username,  setUsername]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);

  async function handleSignup() {
    if (!firstName || !lastName || !username || !email || !password) {
      Alert.alert("Missing info", "Please fill out all fields.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Write a new user doc (dev auth includes plaintext password)
      await createUser({
        firstName,
        lastName,
        username,
        email,
        password,
        interpretationPreference: "psychological",
      });

      // Go straight to tabs and pass the email so Home can greet by name
      router.replace({ pathname: "/(tabs)", params: { email } });
    } catch (e: any) {
      Alert.alert("Sign up failed", e?.message ?? "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white px-6 py-10">
      <Text className="text-3xl font-bold mb-8">Create account</Text>

      <Text className="mb-2 text-gray-700">First name</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Anna"
      />

      <Text className="mb-2 text-gray-700">Last name</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Brooks"
      />

      <Text className="mb-2 text-gray-700">Username</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        placeholder="annab"
      />

      <Text className="mb-2 text-gray-700">Email</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="anna@example.com"
      />

      <Text className="mb-2 text-gray-700">Password</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />

      <Text className="mb-2 text-gray-700">Confirm password</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        placeholder="••••••••"
      />

      <TouchableOpacity
        disabled={loading}
        onPress={handleSignup}
        className={`w-full py-4 rounded-xl ${loading ? "bg-gray-400" : "bg-indigo-500"}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-semibold">Create account</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600 mr-2">Already have an account?</Text>
        <Link href="/login" className="text-indigo-600 font-semibold">
          Log in
        </Link>
      </View>
    </View>
  );
}*/