import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../src/firebase";
import { useDbAuth as useAuth } from "../../src/context/AuthContext";
import DreamInterpreter from "../DreamInterpreter";

const Create = () => {
  const router = useRouter();
  const { initializing } = useAuth();
  const [addData, setAddData] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<string>("");

  const tableName = { tName: "dream_entry" };

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
      });
      setAddData("");
      setAddTitle("");
      setInterpretation("");
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
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 30 }}
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

          {/* Save Button */}
          <TouchableOpacity
            className={`mt-8 rounded-full py-4 ${
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
