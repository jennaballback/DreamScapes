import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../src/firebase";
import { useDbAuth as useAuth } from "../../src/context/AuthContext";
import DreamInterpreter from "../DreamInterpreter";

// ⭐ Mood tag options ⭐
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

const Create = () => {
  const router = useRouter();
  const {} = useAuth(); // not using initializing

  const [addData, setAddData] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<string>("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  // ⭐ New state for custom mood entry ⭐
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherMood, setOtherMood] = useState("");

  const tableName = { tName: "dream_entry" };

  // ⭐ Toggle mood tag selection ⭐
  const toggleMood = (tag: string) => {
    if (selectedMoods.includes(tag)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== tag));
    } else {
      setSelectedMoods([...selectedMoods, tag]);
    }
  };

  // ⭐ Add custom typed mood ⭐
  const handleAddCustomMood = () => {
    const trimmed = otherMood.trim();
    if (!trimmed) return;

    setSelectedMoods([...selectedMoods, trimmed]);
    setOtherMood("");
    setShowOtherInput(false);
  };

  // ⭐ Save Dream Entry ⭐
  const addField = async () => {
    if (!addData.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, tableName.tName), {
        title: addTitle || "Untitled",
        dream_text: addData,
        interpretation: interpretation || "N/A",
        created_at: serverTimestamp(),
        user: "user/user001",
        public: true,
        moods: selectedMoods || [],
      });

      // Reset form fields
      setAddData("");
      setAddTitle("");
      setInterpretation("");
      setSelectedMoods([]);

      router.back();
    } catch (err) {
      console.log("Error adding entry:", err);
    } finally {
      setLoading(false);
    }
  };

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
          justifyContent: "center",
          paddingBottom: 30,
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

          {/* Title Input */}
          <View className="mb-4">
            <TextInput
              className="text-lg text-gray-800 font-semibold border-b border-gray-300 pb-2"
              placeholder="Untitled"
              placeholderTextColor="#9ca3af"
              value={addTitle}
              onChangeText={setAddTitle}
            />
          </View>

          {/* Dream Input */}
          <View className="bg-white shadow-lg rounded-2xl p-5 min-h-[250px] mb-6">
            <TextInput
              className="text-base text-gray-800 leading-6"
              placeholder="Start writing your dream..."
              placeholderTextColor="#9ca3af"
              multiline
              value={addData}
              onChangeText={setAddData}
            />
          </View>

          {/* Dream Interpreter */}
          <DreamInterpreter
            dreamText={addData}
            onInterpretation={(result) => setInterpretation(result)}
          />

          {/* ⭐ Mood Tags Section ⭐ */}
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

              {/* ⭐ OTHER option ⭐ */}
              <TouchableOpacity
                onPress={() => setShowOtherInput(true)}
                className="px-4 py-2 rounded-full bg-gray-300 mr-2 mb-2"
              >
                <Text className="text-gray-800 font-medium">Other +</Text>
              </TouchableOpacity>
            </View>

            {/* ⭐ Custom Mood Input ⭐ */}
            {showOtherInput && (
              <View className="mt-3">
                <TextInput
                  className="border border-gray-300 rounded-xl px-3 py-2 text-gray-800"
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

          {/* Save Button */}
          <TouchableOpacity
            className={`mt-4 rounded-full py-4 ${
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