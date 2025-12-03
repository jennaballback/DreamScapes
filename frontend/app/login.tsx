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
import { useDbAuth } from "../src/context/AuthContext"; // adjust path if needed

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading } = useDbAuth(); // <-- your context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    // 1) Client-side validation
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError(null);

      // 2) Call your DB login function
      await signIn(email, password);

      // 3) On success, AuthContext will redirect to /(tabs)/index
      // so we don't need to navigate here.
    } catch (err: any) {
      console.log("Login error:", err);

      const msg = err?.message ?? "Something went wrong. Please try again.";

      // 4) Map technical messages to friendly ones
      if (msg.includes("No account found")) {
        setError("We couldn't find an account with that email.");
      } else if (msg.includes("Incorrect password")) {
        setError("Incorrect password. Please try again.");
      } else {
        setError(msg);
      }
    }
  };

  return (
    <View className="flex-1 bg-white px-6 py-10">
      <Text className="text-3xl font-bold mb-10 text-center">Login</Text>

      {/* Error message box */}
      {error && (
        <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <Text className="text-red-700 text-sm">{error}</Text>
        </View>
      )}

      {/* Email */}
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

      {/* Password */}
      <Text className="mb-2 text-gray-700">Password</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-black"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor="#9CA3AF"
      />

      {/* Login button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className="bg-[#0f0d23] rounded-2xl py-4 items-center"
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-semibold">Login</Text>
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
}*/