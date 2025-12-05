// app/(tabs)/create.tsx
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../src/firebase";
import { useDbAuth as useAuth } from "../../src/context/AuthContext";
import DreamInterpreter from "../DreamInterpreter";

// Mood tag options
const MOOD_TAGS = [
  "Happy",
  "Anxious",
  "Confused",
  "Scared",
  "Excited",
  "Sad",
  "Hopeful",
  "Angry",
  "Peaceful",
];

// Dream Type options
const DREAM_TYPE_TAGS = [
  "Nightmare",
  "Recurring",
  "Lucid",
  "Vivid",
  "Stress Dream",
  "Surreal",
];

const Create = () => {
  const router = useRouter();
  const { user, initializing } = useAuth();

  const [dreamDate, setDreamDate] = useState("");    // date of the dream
  const [addTitle, setAddTitle] = useState("");      // title of dream
  const [addData, setAddData] = useState("");        // description of dream
  const [loading, setLoading] = useState(false);

  const [interpretation, setInterpretation] = useState<string>("");
  
  // Mood tag states
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherMood, setOtherMood] = useState("");

  // Dream type tags state
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showOtherTypeInput, setShowOtherTypeInput] = useState(false);
  const [otherType, setOtherType] = useState("");

  const tableName = { tName: "dream_entry" };

  // Toggle selection of a preset mood tag
  const toggleMood = (tag: string) => {
    if (selectedMoods.includes(tag)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== tag));
    } else {
      setSelectedMoods([...selectedMoods, tag]);
    }
  };

  // Add a custom typed mood to the selected list
  const handleAddCustomMood = () => {
    const trimmed = otherMood.trim();
    if (!trimmed) return;

    setSelectedMoods([...selectedMoods, trimmed]);
    setOtherMood("");
    setShowOtherInput(false);
  };

  // Toggle selection of a preset dream type tag
  const toggleType = (tag: string) => {
    if (selectedTypes.includes(tag)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== tag));
    } else {
      setSelectedTypes([...selectedTypes, tag]);
    }
  };

  // Add a custom typed dream type
  const handleAddCustomType = () => {
    const trimmed = otherType.trim();
    if (!trimmed) return;

    setSelectedTypes([...selectedTypes, trimmed]);
    setOtherType("");
    setShowOtherTypeInput(false);
  };

  // Save dream entry to Firestore
  const addField = async () => {
    if (!addData.trim()) return;
    if (!user || !user.id) {
      alert("You must be logged in to save a dream entry.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, tableName.tName), {
        title: addTitle || "Untitled",
        dream_text: addData,
        interpretation: interpretation || "N/A",
        created_at: serverTimestamp(),

        // New: when the user says the dream happened
        dream_date: dreamDate || null,

        // Link this dream to the specific user
        userId: user.id,
        user: user.id, // optional compatibility field

        public: true,

        // Tags
        moods: selectedMoods || [],
        dreamTypes: selectedTypes || [],
      });

      // Reset form fields
      setDreamDate("");
      setAddTitle("");
      setAddData("");
      setInterpretation("");
      setSelectedMoods([]);
      setSelectedTypes([]);

      router.back();
    } catch (err) {
      console.log("Error adding entry:", err);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) return null;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gradient-to-b from-blue-100 to-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          paddingBottom: 140,
        }}
      >
        <View className="px-6 py-8">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <Text className="text-blue-600 text-lg font-medium">← Back</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-800">
              New Dream Entry
            </Text>
            <View className="w-10" />
          </View>

          {/* Date of Dream */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-1">
              Date of Dream
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-3 py-2 text-gray-800 bg-white"
              placeholder="MM/DD/YYYY"
              placeholderTextColor="#9ca3af"
              value={dreamDate}
              onChangeText={setDreamDate}
            />
          </View>

          {/* Mood Tags Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Mood Tags
            </Text>

            <View className="flex-row flex-wrap">
              {MOOD_TAGS.map((tag) => {
                const selected = selectedMoods.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => toggleMood(tag)}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      selected ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`${
                        selected ? "text-white" : "text-gray-700"
                      } font-medium`}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* OTHER option */}
              <TouchableOpacity
                onPress={() => setShowOtherInput(true)}
                className="px-4 py-2 rounded-full bg-gray-300 mr-2 mb-2"
              >
                <Text className="text-gray-800 font-medium">Other +</Text>
              </TouchableOpacity>
            </View>

            {/* Custom Mood Input */}
            {showOtherInput && (
              <View className="mt-3">
                <TextInput
                  className="border border-gray-300 rounded-xl px-3 py-2 text-gray-800 bg-white"
                  placeholder="Enter custom mood..."
                  placeholderTextColor="#9ca3af"
                  value={otherMood}
                  onChangeText={setOtherMood}
                />

                <TouchableOpacity
                  onPress={handleAddCustomMood}
                  className="bg-blue-500 px-4 py-2 rounded-full mt-2"
                >
                  <Text className="text-white font-semibold text-center">
                    Add Mood
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {/* Dream Type Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Dream Type
            </Text>

            <View className="flex-row flex-wrap">
              {DREAM_TYPE_TAGS.map((tag) => {
                const selected = selectedTypes.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => toggleType(tag)}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      selected ? "bg-purple-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`${
                        selected ? "text-white" : "text-gray-700"
                      } font-medium`}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {/* Dream Type OTHER option */}
              <TouchableOpacity
                onPress={() => setShowOtherTypeInput(true)}
                className="px-4 py-2 rounded-full bg-gray-300 mr-2 mb-2"
              >
                <Text className="text-gray-800 font-medium">Other +</Text>
              </TouchableOpacity>
            </View>

            {/* Custom Dream Type Input */}
            {showOtherTypeInput && (
              <View className="mt-3">
                <TextInput
                  className="border border-gray-300 rounded-xl px-3 py-2 text-gray-800 bg-white"
                  placeholder="Enter custom dream type..."
                  placeholderTextColor="#9ca3af"
                  value={otherType}
                  onChangeText={setOtherType}
                />

                <TouchableOpacity
                  onPress={handleAddCustomType}
                  className="bg-purple-500 px-4 py-2 rounded-full mt-2"
                >
                  <Text className="text-white font-semibold text-center">
                    Add Dream Type
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Title Input */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-1">
              Title of Dream
            </Text>
            <TextInput
              className="text-lg text-gray-800 font-semibold border-b border-gray-300 pb-2 bg-transparent"
              placeholder="Untitled"
              placeholderTextColor="#9ca3af"
              value={addTitle}
              onChangeText={setAddTitle}
            />
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-semibold mb-1">
              Description of Dream
            </Text>

            <View className="bg-white shadow-lg rounded-2xl p-4 min-h-[200px]">
              <TextInput
                className="text-base text-gray-800 leading-6 w-full h-full"
                placeholder="Start writing your dream..."
                placeholderTextColor="#9ca3af"
                multiline
                value={addData}
                onChangeText={setAddData}
                style={{ textAlignVertical: "top" }} // ensures text starts at the top on Android + Web
              />
            </View>
          </View>


          {/* Interpret Dream (now after mood tags) */}
          <DreamInterpreter
            dreamText={addData}
            onInterpretation={(result) => setInterpretation(result)}
          />

          {/* Save Button */}
          <TouchableOpacity
            className={`mt-6 rounded-full py-4 ${
              loading ? "bg-blue-300" : "bg-blue-500"
            }`}
            disabled={loading}
            onPress={addField}
          >
            {loading ? (
              <ActivityIndicator color="#fff" className="text-center" />
            ) : (
              <Text className="text-center text-white text-lg font-semibold">
                Save Entry
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Create;
