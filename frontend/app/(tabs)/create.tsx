import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Create() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Text className="text-xl font-bold mb-4">Create a New Journal Entry</Text>

      {/* Back/Close button */}
      <TouchableOpacity
        className="bg-blue-500 px-4 py-2 rounded-full"
        onPress={() => router.back()}
      >
        <Text className="text-white font-semibold">Close</Text>
      </TouchableOpacity>
    </View>
  );
}
