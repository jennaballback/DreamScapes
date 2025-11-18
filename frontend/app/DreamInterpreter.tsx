import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { interpretDream } from "../src/services/ollama";
import { UserContext, DreamEntry } from "../src/utils/dreamSchema";

type DreamInterpreterProps = {
  dreamText: string;
  onInterpretation?: (result: string) => void;
};

// Helper to render a section with label and content
const Section: React.FC<{ label: string; content: string; color?: string }> = ({ label, content, color }) => (
  <View style={[styles.sectionContainer, color ? { borderLeftColor: color } : {}]}>
    <Text style={styles.sectionLabel}>{label}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

export default function DreamInterpreter({
  dreamText,
  onInterpretation,
}: DreamInterpreterProps) {
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState("");

  const handleInterpret = async () => {
    if (!dreamText.trim()) return alert("Please enter a dream first.");
    setLoading(true);
    const now = new Date();

    try {
      // Properly structure userContext with required fields
      const userContext: UserContext = {
        id: "anonymous_dreamer",
        interpretationStyle: "psychological",
        preferredTone: "warm and reflective",
      };

      // Properly structure dream entry with required fields
      const dream: DreamEntry = {
        id: `temp_dream_${now.getTime()}`,
        userId: "anonymous_dreamer",
        date: now.toLocaleDateString(),
        dreamText,
        emotionsInDream: [],
        timestamp: now,
        response: "",
      };

      const responseText = await interpretDream(userContext, dream);
      setInterpretation(responseText);
      onInterpretation?.(responseText);
    } catch (err) {
      console.error(err);
      setInterpretation("⚠️ Error generating interpretation.");
    } finally {
      setLoading(false);
    }
  };

  // Parse sections from the LLM response using regex (✨ / 🎶 / ❤️ / 🌍 / ⚠️)
  const parseSections = (text: string) => {
    // 1. Define the regex to capture the full labels including emojis.
    const regex = /(✨ Dream Summary|🎶 Symbolic Meaning|❤️ Emotional Insight|🌍 Cultural Analysis|⚠️ Reflection Prompt)/g;

    // 2. Split the text, capturing the delimiters (the section labels)
    const parts = text.split(regex);
    const sections: { label: string; content: string }[] = [];

    // Start loop at index 1 to ignore any initial non-section content (pre-amble)
    for (let i = 1; i < parts.length; i += 2) {
      const label = parts[i]?.trim();
      let content = parts[i + 1]?.trim() ?? ""; // Get the raw content

      // 🐛 FIX: Clean up any leading punctuation (colons, dots, asterisks)
      // This handles the extra colon/dots/asterisks that often appear at the start of the content section
      content = content.replace(/^[:\.\*]+\s*/, '');

      // Ensure we have both a label and content
      if (label && content) {
        sections.push({ label, content });
      }
    }
    return sections;
  };

  const sections = parseSections(interpretation);

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
          <Text className="text-center text-white text-lg font-semibold">Interpret Dream</Text>
        )}
      </TouchableOpacity>

      {interpretation ? (
        <ScrollView style={{ marginTop: 16 }}>
          {sections.map((s, idx) => {
            let color;
            // Determine border color based on section label
            switch (s.label) {
              case "✨ Dream Summary":
                color = "#007bff"; // blue
                break;
              case "🎶 Symbolic Meaning":
                color = "#6610f2"; // purple
                break;
              case "❤️ Emotional Insight":
                color = "#dc3545"; // red
                break;
              case "🌍 Cultural Analysis":
                color = "#28a745"; // green
                break;
              case "⚠️ Reflection Prompt":
                color = "#ffc107"; // yellow/orange
                break;
              default:
                color = "#343a40"; // default dark color for unknown sections
            }
            return <Section key={idx} label={s.label} content={s.content} color={color} />;
          })}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
    color: "#212529",
  },
});