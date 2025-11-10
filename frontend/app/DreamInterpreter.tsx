import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { processDream } from "@/src/services/dreamServices";

export default function DreamInterpreter({ dreamText, onInterpretation }) {
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState("");

  const handleInterpret = async () => {
    if (!dreamText.trim()) return alert("Please enter a dream first.");
    setLoading(true);

    try {
      const userContext = {
        id: "anonymous_dreamer",
        interpretationStyle: "psychological",
        preferredTone: "warm and reflective",
      };
      const dream = {
        id: "",
        userId: "anonymous_dreamer",
        dreamText,
      };

      const responseText = await processDream(userContext, dream);
      setInterpretation(responseText);
      onInterpretation(responseText); // pass up to parent
    } catch (error) {
      setInterpretation("⚠️ Error generating interpretation.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="mt-6">
      <TouchableOpacity
        className={`rounded-full py-4 ${loading ? "bg-blue-300" : "bg-blue-500"}`}
        disabled={loading}
        onPress={handleInterpret}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center text-white text-lg font-semibold">
            Interpret Dream
          </Text>
        )}
      </TouchableOpacity>

      {interpretation ? (
        <View className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <Text className="text-lg font-semibold text-blue-700 mb-2">
            Interpretation
          </Text>
          <Text className="text-gray-700 leading-6">{interpretation}</Text>
        </View>
      ) : null}
    </View>
  );
}
