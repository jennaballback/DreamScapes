import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, Unsubscribe } from 'firebase/firestore';

// --- IMPORTANT IMPORTS: FIX - Using absolute path alias '@/' ---
import { auth, db } from '../src/firebase';
import { processDream } from '../src/services/dreamServices';
import { UserContext, DreamEntry } from '../src/utils/dreamSchema';
import { InterpretationResponse } from '../src/services/ollama';
// -----------------------------------------------------------------

// --- HELPER FUNCTION: Safely get summary for history display ---
// This handles both old plain text responses and new structured JSON responses.
const getEntrySummary = (responseText: string): string => {
  if (!responseText) return 'Analysis not yet available.';

  try {
    // 1. Try to parse as the new structured JSON format
    const parsed = JSON.parse(responseText);
    // If successful, extract the Summary for a clean display
    return parsed.summary ? `Summary: ${parsed.summary}` : 'New Analysis (Summary section missing)';
  } catch (e) {
    // 2. If parsing fails, assume it's an old plain text entry
    const preview = responseText.substring(0, 150);
    return preview + (responseText.length > 150 ? '... (Old Format)' : ' (Old Format)');
  }
};

// --- HELPER COMPONENT: Renders one section cleanly (for fixed output order) ---
interface AnalysisSectionProps {
  label: string;
  // Set to 'any' for robustness against LLM generating an object instead of a string
  content: string | any;
  isCultural?: boolean;
  isPrompt?: boolean;
}
const AnalysisSection: React.FC<AnalysisSectionProps> = ({ label, content, isCultural, isPrompt }) => {

  // DEFENSIVE FIX: Check and convert content to a string if it's an object
  let contentToRender: string;
  if (typeof content === 'object' && content !== null) {
    // If the LLM returned an object where a string was expected, stringify it
    contentToRender = "⚠️ Formatting Error: LLM returned an object. Raw data: " + JSON.stringify(content, null, 2);
  } else {
    // Otherwise, use the content as a string
    contentToRender = String(content);
  }

  return (
    <View style={[styles.sectionContainer, isCultural && styles.culturalSection, isPrompt && styles.promptSection]}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Text style={styles.sectionContent}>{contentToRender}</Text>
    </View>
  );
};
// -----------------------------------------------------


export default function DreamChatScreen() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  // UPDATED STATE: Now holds the structured object or null
  const [llmResponse, setLlmResponse] = useState<InterpretationResponse | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [history, setHistory] = useState<DreamEntry[]>([]);
  const user = auth.currentUser;

  // --- REAL-TIME HISTORY SUBSCRIPTION ---
  useEffect(() => {
    const userId = user ? user.uid : 'anonymous_dreamer';
    const q = query(collection(db, "dreams"));

    const unsubscribe: Unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedHistory: DreamEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<DreamEntry, 'id'>;
        if (data.userId === userId) {
          fetchedHistory.push({ id: doc.id, ...data });
        }
      });

      fetchedHistory.sort((a, b) => b.timestamp?.toDate()?.getTime() - a.timestamp?.toDate()?.getTime());
      setHistory(fetchedHistory);
    }, (error) => {
      console.error("Error fetching dream history:", error);
    });

    return () => unsubscribe();
  }, [user]);
  // ------------------------------------

  // UPDATED handleSendPrompt
  const handleSendPrompt = async () => {
    if (!prompt) {
      alert("Please enter a dream to analyze.");
      return;
    }

    setLoading(true);
    const userPrompt = prompt.trim();
    setPrompt('');

    const userId = user ? user.uid : 'anonymous_dreamer';

    // Define the context for dream interpretation (includes culturalBackground)
    const userContext: UserContext = {
      id: userId,
      interpretationStyle: 'psychological',
      preferredTone: 'warm and reflective',
      // NOTE: Replace 'Norse Mythology' with actual user profile data when ready
      culturalBackground: 'Norse Mythology',
    }; 

    const dream: DreamEntry = {
      id: '',
      userId,
      timestamp: serverTimestamp(),
      date: new Date().toISOString().split('T')[0],
      dreamText: userPrompt,
      emotionsInDream: [],
      response: '',
      moodBeforeSleep: undefined,
      moodAfterWaking: undefined,
      sleepQuality: undefined,
      recurringSymbols: [],
      notes: '',
    };

    try {
      setErrorText(null); // Clear any previous errors

      // 1. Call your structured LLM helper (returns InterpretationResponse object)
      const responseObj = await processDream(userContext, dream);
      setLlmResponse(responseObj);

      // 2. Save the structured data as a JSON string for fixed storage
      const responseJsonString = JSON.stringify(responseObj);

      const conversationData = {
        userId: userId,
        prompt: userPrompt,
        response: responseJsonString, // <--- SAVE THE JSON STRING
        timestamp: serverTimestamp(),
        model: 'phi3:mini',
      };

      // 3. Save to Firebase (maintains history as requested)
      await addDoc(collection(db, "dreams"), conversationData);

    } catch (error: any) {
      console.error("Dream analysis failed:", error);
      setLlmResponse(null); // Clear successful response
      // Catch error thrown from ollama.ts (connection/parsing failure)
      setErrorText(error.message || "An issue occurred during analysis or saving to Firebase.");
    } finally {
      setLoading(false);
    }
  };

  const currentUserId = user ? user.uid : 'anonymous_dreamer';
  const hasHistory = history.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dream Analyzer (Phi-3 Mini)</Text>

      {!user && (
        <Text style={styles.warning}>
          You are currently analyzing anonymously (ID: {currentUserId}). Log in to save your dream history!
        </Text>
      )}

      <ScrollView style={{ flex: 1 }}>

        {/* --- Latest Analysis Rendering: Error Box --- */}
        {errorText && (
          <View style={[styles.responseBox, styles.errorBox]}>
            <Text style={styles.responseLabel}>Analysis Error:</Text>
            <Text style={styles.responseText}>{errorText}</Text>
          </View>
        )}

        {/* --- Latest Analysis Rendering: Structured Response --- */}
        {llmResponse ? (
          <View style={styles.responseBox}>
            <Text style={styles.responseLabel}>Latest Analysis:</Text>

            {/* RENDER SECTIONS IN FIXED ORDER: Summary, Symbolic, Emotional, Cultural, Reflection */}
            <AnalysisSection label="✨ Dream Summary" content={llmResponse.summary} />
            <AnalysisSection label="🗝️ Symbolic Meaning" content={llmResponse.symbolicMeaning} />
            <AnalysisSection label="❤️ Emotional Insight" content={llmResponse.emotionalInsight} />

            {/* THE NEW CULTURAL ANALYSIS SECTION */}
            <AnalysisSection
              label="🌍 Cultural Analysis"
              content={llmResponse.culturalAnalysis}
              isCultural={true}
            />

            <AnalysisSection label="✍️ Reflection Prompt" content={llmResponse.reflectionPrompt} isPrompt={true} />

          </View>
        ) : null}

        {/* --- History Section Rendering (Handles Old/New Formats) --- */}
        {hasHistory && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Your Analysis History</Text>
            {history.map((entry) => (
              <View key={entry.id} style={styles.historyEntry}>
                <Text style={styles.historyPrompt}>Prompt: {entry.dreamText}</Text>
                <Text style={styles.historyDate}>
                  {entry.timestamp?.toDate ? entry.timestamp.toDate().toLocaleTimeString() : 'Saving...'}
                </Text>
                {/* Use the helper to safely display old text or new JSON summary */}
                <Text style={styles.historyResponse}>{getEntrySummary(entry.response)}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.inputControls}>
        <TextInput
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Describe your dream here..."
          style={styles.input}
          multiline
          editable={!loading}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
        ) : (
          <Button
            onPress={handleSendPrompt}
            title="Get Dream Analysis"
            disabled={!prompt}
          />
        )}
      </View>
    </View>
  );
}


// --- STYLESHEET (Includes new section styles for structured output) ---
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  warning: { color: 'orange', marginBottom: 10, padding: 8, backgroundColor: '#fffbe6', borderRadius: 5, borderWidth: 1, borderColor: '#ffe58f' },
  inputControls: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, minHeight: 80, borderRadius: 5 },
  loading: { marginVertical: 10 },
  responseBox: { marginTop: 10, marginBottom: 20, padding: 15, backgroundColor: '#e6f7ff', borderRadius: 8, borderWidth: 1, borderColor: '#91d5ff' },
  responseLabel: { fontWeight: 'bold', marginBottom: 5, color: '#0050b3' },
  responseText: { lineHeight: 20, color: '#333' },
  errorBox: { backgroundColor: '#fff0f6', borderColor: '#ff4d4f' },
  historySection: { marginTop: 20, paddingBottom: 50 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 2, borderBottomColor: '#ccc', paddingBottom: 5 },
  historyEntry: { marginBottom: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5, borderWidth: 1, borderColor: '#eee' },
  historyPrompt: { fontWeight: '600', color: '#1f1f1f', marginBottom: 5 },
  historyResponse: { fontSize: 13, color: '#666' },
  historyDate: { fontSize: 11, color: '#aaa', alignSelf: 'flex-end' },

  // NEW STYLES FOR SMOOTH SECTION RENDERING
  sectionContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff', // Blue for general sections
    marginBottom: 8,
  },
  sectionLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    color: '#0050b3',
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  culturalSection: { // Distinct style for the new cultural section
    borderLeftColor: '#28a745', // Green
    backgroundColor: '#f1fff1',
  },
  promptSection: { // Distinct style for the reflection prompt
    borderLeftColor: '#ffc107', // Yellow/Orange
    backgroundColor: '#fffbe0',
  },
});