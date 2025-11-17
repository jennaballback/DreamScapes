// app/login.tsx
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
}*/