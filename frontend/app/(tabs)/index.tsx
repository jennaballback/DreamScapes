// app/index.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-3xl font-bold mb-2">DreamScapes</Text>
      <Text className="text-gray-500 mb-10 text-center">
        Welcome! Choose how you’d like to start.
      </Text>

      <TouchableOpacity
        className="w-full py-4 rounded-xl bg-black mb-4"
        onPress={() => router.push("/login")}
      >
        <Text className="text-white text-center font-semibold">Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full py-4 rounded-xl bg-indigo-500"
        onPress={() => router.push("/signup")}
      >
        <Text className="text-white text-center font-semibold">Create account</Text>
      </TouchableOpacity>
    </View>
  );
}
