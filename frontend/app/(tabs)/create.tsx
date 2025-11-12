import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
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


  const user = {
    displayName : 'Anna',
    email : 'anna.brooks@gmail.com'
  }
  
  const tableName = {
    tName : 'dream_entry',
  }

  const addField = async () => {
    if (!addData.trim()) return;


//This is where we would do the interpretation step and get the interpretation back
//Some call to the LLM, probably via a component made out of it
//set the value that returns equal to interpretation value

    setLoading(true);
    try {
      await addDoc(collection(db, tableName.tName), {
        title: addTitle || "Untitlted",
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
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View className="px-6 py-10">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-8">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-blue-600 text-lg font-medium">← Back</Text>
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-gray-800">
              New Dream Entry
            </Text>
            {/* Title Input*/}
            <View>
                <TextInput
                className="text-base text-gray-800"
                placeholder="Untitled"
                placeholderTextColor="#9ca3af"
                multiline
                autoFocus
                value={addTitle}
                onChangeText={setAddTitle}
              />
              </View>
            <View className="w-10" />
          </View>

          {/* Input */}
          <View className="bg-white shadow-md rounded-2xl p-5 min-h-[250px]">
            <TextInput
              className="text-base text-gray-800"
              placeholder="Start writing your dream..."
              placeholderTextColor="#9ca3af"
              multiline
              autoFocus
              value={addData}
              onChangeText={setAddData}
            />
          </View>
          {/*Interpretation Being sent*/}
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
            <Text className="text-center text-white text-lg font-semibold">
              {loading ? "Saving..." : "Save Entry"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Create;
