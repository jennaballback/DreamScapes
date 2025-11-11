import { View, Text, TouchableOpacity } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native"; // optional: nice back icon

export default function DreamEntryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 mt-12 bg-gray-100 p-4">
      {/* Header with back button */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 p-2 bg-white rounded-full shadow"
        >
          <ArrowLeft size={20} color="blue" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Dream Entry {id}</Text>
      </View>

      {/* Content area */}
      <View className="flex-1">
        <Text className="text-gray-700 text-base leading-relaxed">
          This is where detailed info about the dream will appear.
        </Text>
      </View>
    </View>
  );
}



/*
This whole file shows how you can take information from an href link and have it appear in your code
here in the index we had the line

<Link href="/movie/avengers">Avenger Movie</Link>


and then used the avengers part of the link and had it appear after haveing the [] to pass it
*/