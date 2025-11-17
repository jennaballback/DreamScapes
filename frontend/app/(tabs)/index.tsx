// app/index.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, Link } from "expo-router";

export default function Landing() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      {/* Title */}
      <Text className="text-4xl font-extrabold text-[#0F1A3A] text-center mb-3">
        DreamScapes
      </Text>
      <Text className="text-base text-gray-500 text-center mb-12">
        Welcome! Choose an option to continue.
      </Text>

      {/* Primary CTAs */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
        className="w-full py-4 rounded-2xl bg-[#0F1A3A] mb-4"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/signup")}
        className="w-full py-4 rounded-2xl bg-[#1f2d5c1A] border border-[#0F1A3A]"
      >
        <Text className="text-[#0F1A3A] text-center text-lg font-semibold">
          Create new account
        </Text>
      </TouchableOpacity>
    </View>
  );
}



/*// app/index.tsx
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
}*/
