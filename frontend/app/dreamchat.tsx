import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, Unsubscribe } from 'firebase/firestore';

// --- IMPORTANT IMPORTS ---
import { auth, db } from '../src/firebase';
import { getOllamaResponse } from '../src/ollama';
// -------------------------

// Define the structure for a History Item
interface DreamEntry {
    id: string;
    prompt: string;
    response: string;
    timestamp: any; // Firestore Timestamp
    userId: string;
}

export default function DreamChatScreen() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [llmResponse, setLlmResponse] = useState('');
    const [history, setHistory] = useState<DreamEntry[]>([]);
    const user = auth.currentUser;

    // --- REAL-TIME HISTORY SUBSCRIPTION ---
    useEffect(() => {
        // Determine the user ID to filter the history
        const userId = user ? user.uid : 'anonymous_dreamer';

        // 1. Create a query for the 'dreams' collection, filtered by the current user ID
        // Note: We avoid orderBy() to prevent potential Firestore errors, and will sort locally.
        const q = query(collection(db, "dreams"));

        // 2. Set up the real-time listener (onSnapshot)
        const unsubscribe: Unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedHistory: DreamEntry[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data() as Omit<DreamEntry, 'id'>;

                // Filter history locally based on the current user/session
                if (data.userId === userId) {
                    fetchedHistory.push({ id: doc.id, ...data });
                }
            });

            // Sort the history by timestamp locally (most recent first)
            fetchedHistory.sort((a, b) => b.timestamp?.toDate()?.getTime() - a.timestamp?.toDate()?.getTime());

            setHistory(fetchedHistory);
        }, (error) => {
            console.error("Error fetching dream history:", error);
            // Optional: Display a temporary error message to the user
        });

        // 3. Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, [user]); // Re-subscribe if the user state changes (login/logout)
    // ------------------------------------


    const handleSendPrompt = async () => {
        if (!prompt) {
            // NOTE: Using a simple alert for prompt validation is okay here.
            alert("Please enter a dream to analyze.");
            return;
        }

        setLoading(true);
        const userPrompt = prompt;
        setPrompt('');

        const userId = user ? user.uid : 'anonymous_dreamer';

        try {
            // 🚀 1. Call the Local LLM (Ollama)
            const responseText = await getOllamaResponse(userPrompt);
            setLlmResponse(responseText);

            // 💾 2. Save Conversation to Firestore
            const conversationData = {
                userId: userId,
                prompt: userPrompt,
                response: responseText,
                timestamp: serverTimestamp(),
                model: 'phi3:mini'
            };

            await addDoc(collection(db, "dreams"), conversationData);

        } catch (error) {
            console.error("Dream analysis failed:", error);
            // 🔄 IMPROVEMENT: Set the error message directly to the display state instead of an alert.
            setLlmResponse("Error: An issue occurred during analysis or saving to Firebase. Check your Ollama connection.");

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

            {/* Scrollable area for history and current input */}
            <ScrollView style={{ flex: 1 }}>
                {/* Current LLM Response Display (Displayed at the top of the history) */}
                {llmResponse ? (
                    <View style={[styles.responseBox, llmResponse.startsWith('Error:') && styles.errorBox]}>
                        <Text style={styles.responseLabel}>Latest Analysis:</Text>
                        <Text style={styles.responseText}>{llmResponse}</Text>
                    </View>
                ) : null}

                {/* --- DREAM HISTORY LIST --- */}
                {hasHistory && (
                    <View style={styles.historySection}>
                        <Text style={styles.historyTitle}>Your Analysis History</Text>
                        {history.map((entry) => (
                            <View key={entry.id} style={styles.historyEntry}>
                                <Text style={styles.historyPrompt}>Prompt: {entry.prompt}</Text>
                                <Text style={styles.historyDate}>
                                    {entry.timestamp?.toDate ? entry.timestamp.toDate().toLocaleTimeString() : 'Saving...'}
                                </Text>
                                <Text style={styles.historyResponse}>{entry.response.substring(0, 150)}...</Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Input controls fixed at the bottom */}
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

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
    warning: { color: 'orange', marginBottom: 10, padding: 8, backgroundColor: '#fffbe6', borderRadius: 5, borderWidth: 1, borderColor: '#ffe58f' },

    // Input Controls
    inputControls: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, backgroundColor: '#fff' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, minHeight: 80, borderRadius: 5 },
    loading: { marginVertical: 10 },

    // Response and History Display
    responseBox: { marginTop: 10, marginBottom: 20, padding: 15, backgroundColor: '#e6f7ff', borderRadius: 8, borderWidth: 1, borderColor: '#91d5ff' },
    responseLabel: { fontWeight: 'bold', marginBottom: 5, color: '#0050b3' },
    responseText: { lineHeight: 20, color: '#333' },

    // New Error Box Style for clear visual feedback
    errorBox: {
        backgroundColor: '#fff0f6', // Light red/pink
        borderColor: '#ff4d4f',      // Error red
    },

    // History List Styles
    historySection: { marginTop: 20, paddingBottom: 50 },
    historyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 2, borderBottomColor: '#ccc', paddingBottom: 5 },
    historyEntry: { marginBottom: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5, borderWidth: 1, borderColor: '#eee' },
    historyPrompt: { fontWeight: '600', color: '#1f1f1f', marginBottom: 5 },
    historyResponse: { fontSize: 13, color: '#666' },
    historyDate: { fontSize: 11, color: '#aaa', alignSelf: 'flex-end' }
});
