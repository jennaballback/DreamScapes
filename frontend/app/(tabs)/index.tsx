// app/(tabs)/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useDbAuth } from "../../src/context/AuthContext";

export default function HomeTab() {
  const { user, loading, signOut } = useDbAuth();

  // While auth context is figuring things out
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  // If somehow there is no user, bounce back to login screen
  if (!user) {
    return <Redirect href="/login" />;
  }

  const displayName =
    user.firstName || user.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : user.email;

  return (
    <View className="flex-1 bg-[#F5F6FA] px-6 pt-16 pb-8">
      {/* Title */}
      <View className="items-center mb-10">
        <Text className="text-xs tracking-[0.2em] text-gray-500 uppercase">
          Home
        </Text>
        <Text className="mt-2 text-3xl font-extrabold text-[#030014]">
          Welcome back
        </Text>
      </View>

      {/* Card with user info */}
      <View className="bg-white rounded-3xl px-6 py-8 shadow-sm border border-gray-100">
        <Text className="text-sm text-gray-500 mb-1">
          Logged in as
        </Text>
        <Text className="text-2xl font-semibold text-[#030014] mb-1">
          {displayName}
        </Text>
        <Text className="text-sm text-gray-500 mb-4">{user.email}</Text>

      </View>

      {/* Actions */}
      <View className="mt-10 gap-4">
        <Text className="text-sm text-gray-500">
          Use the tabs below to record a new dream, browse entries, or update your profile.
        </Text>

        <TouchableOpacity
          onPress={signOut}
          className="mt-4 self-start rounded-full border border-gray-300 px-5 py-2"
        >
          <Text className="text-sm font-medium text-gray-700">Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
