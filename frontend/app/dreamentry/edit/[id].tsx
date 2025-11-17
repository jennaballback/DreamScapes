import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { ArrowLeft, Save, Trash2 } from "lucide-react-native";

export default function EditDreamEntry() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [dreamText, setDreamText] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchDream = async () => {
      try {
        const docRef = doc(db, "dream_entry", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setDreamText(data.dream_text || "");
          setInterpretation(data.interpretation || "");
          setVisibility(data.public || false);
        }
      } catch (error) {
        console.log("Error fetching dream for edit:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDream();
  }, [id]);

  const handleSave = async () => {
    if (!dreamText.trim()) return;

    setSaving(true);
    try {
      const docRef = doc(db, "dream_entry", id as string);
      await updateDoc(docRef, {
        title: title || "Untitled",
        dream_text: dreamText,
        interpretation: interpretation || "N/A",
        public: visibility,
        updated_at: serverTimestamp(),
      });
      router.back();
    } catch (error) {
      console.log("Error updating dream:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const proceed =
      Platform.OS === "web"
        ? window.confirm("Are you sure you want to delete this entry? This action cannot be undone.")
        : await new Promise<boolean>((resolve) => {
            Alert.alert(
              "Delete Entry",
              "Are you sure you want to delete this entry? This action cannot be undone.",
              [
                { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
                { text: "Delete", style: "destructive", onPress: () => resolve(true) },
              ],
              { cancelable: true }
            );
          });

    if (!proceed) return;

    setDeleting(true);
    try {
      const docRef = doc(db, "dream_entry", id as string);
      await deleteDoc(docRef);
      router.back();
    } catch (error) {
      console.log("Error deleting dream:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading dream...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between mt-12 px-4 mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2 bg-white rounded-full shadow">
              <ArrowLeft size={20} color="#3B82F6" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">Edit Entry</Text>
          </View>

          <View className="flex-row">
            <TouchableOpacity disabled={saving} onPress={handleSave} className={`p-2 rounded-full shadow mr-2 ${saving ? "bg-blue-300" : "bg-blue-500"}`}>
              <Save size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity disabled={deleting} onPress={handleDelete} className={`p-2 rounded-full shadow ${deleting ? "bg-red-300" : "bg-red-500"}`}>
              <Trash2 size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title */}
        <View className="px-6 mb-4">
          <TextInput className="text-lg text-gray-800 font-semibold border-b border-gray-300 pb-2" placeholder="Title" value={title} onChangeText={setTitle} />
        </View>

        {/* Dream Text */}
        <View className="bg-white mx-6 rounded-2xl shadow p-5 mb-6">
          <TextInput className="text-base text-gray-800 leading-relaxed" placeholder="Edit your dream..." multiline value={dreamText} onChangeText={setDreamText} />
        </View>

        {/* Interpretation */}
        <View className="bg-blue-50 mx-6 rounded-2xl shadow p-5 mb-6">
          <Text className="text-gray-700 font-semibold mb-2">Interpretation</Text>
          <TextInput className="text-base text-gray-800 leading-relaxed" placeholder="Edit interpretation..." multiline value={interpretation} onChangeText={setInterpretation} />
        </View>

        {/* Visibility Toggle */}
        <View className="flex-row justify-between items-center mx-6 bg-white rounded-xl p-4 shadow">
          <Text className="text-gray-700 font-semibold">Visibility: {visibility ? "Public" : "Private"}</Text>
          <TouchableOpacity onPress={() => setVisibility(!visibility)} className={`px-4 py-2 rounded-full ${visibility ? "bg-blue-500" : "bg-gray-400"}`}>
            <Text className="text-white font-semibold">{visibility ? "Public" : "Private"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
