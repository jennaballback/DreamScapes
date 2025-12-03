// app/index.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function StartScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white px-6 py-20 justify-start">

      {/* Title */}
      <Text className="text-4xl font-bold text-center text-[#0f0d23] mb-3">
        DreamScapes
      </Text>

      <Text className="text-center text-gray-600 mb-12">
        Welcome! Choose an option to continue.
      </Text>

      {/* Log In button */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
        className="bg-[#0f0d23] rounded-full py-4 mb-6 items-center"
      >
        <Text className="text-white text-lg font-semibold">Log in</Text>
      </TouchableOpacity>

      {/* Create Account button */}
      <TouchableOpacity
        onPress={() => router.push("/signup")}
        className="bg-gray-100 rounded-full py-4 items-center border border-gray-300"
      >
        <Text className="text-[#0f0d23] text-lg font-semibold">
          Create new account
        </Text>
      </TouchableOpacity>

    </View>
  );
}
