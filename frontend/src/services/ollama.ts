// frontend/src/services/ollama.ts (NOTE: Renamed from frontend/src/ollama.ts for consistency)

// ✅ Import your new helper and types
import { buildDreamPrompt, UserContext, DreamEntry } from '../utils/dreamSchema';

// 🚨 FIX 1: DEFINE AND EXPORT THE TYPE 🚨
export interface InterpretationResponse {
    summary: string;
    symbolicMeaning: string;
    emotionalInsight: string;
    culturalAnalysis: string;
    reflectionPrompt: string; 
}

// CONFIRMED ENDPOINT: This is the local IP you verified with curl.
// NOTE: If your local IP changes (e.g., after reconnecting to Wi-Fi), you must update this number!
const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';

/**
 * Sends a prompt to the local Ollama server (Phi-3 Mini) and returns the text response.
 * @param prompt The user's input string.
 * @returns The LLM-generated response text (which should be a JSON string).
 */
export async function getOllamaResponse(prompt: string): Promise<string> {
    try {
        const response = await fetch(OLLAMA_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'phi3:mini',
                prompt: prompt,
                stream: false, // Ensures a single, complete response
                // CRUCIAL: Add JSON format instructions if the model requires it
                format: 'json', 
            }),
        });

        if (!response.ok) {
            console.error('Ollama HTTP Error:', response.status, response.statusText);
            throw new Error("Failed to reach Ollama server (HTTP error).");
        }

        const data = await response.json();
        // The LLM response is nested inside the 'response' key by Ollama
        return data.response.trim(); 

    } catch (error) {
        console.error("Connection Error to Ollama:", error);
        throw new Error("Error: LLM server connection failed. Is Ollama running?"); // Throw for errorText display
    }
}

/**
 * High-level helper for dream interpretation.
 * Builds the structured prompt, sends it to the LLM, and parses the JSON.
 * @returns The structured InterpretationResponse object.
 */
export async function interpretDream(user: UserContext, dream: DreamEntry): Promise<InterpretationResponse> {
    const prompt = buildDreamPrompt(user, dream);
    
    // 1. Get the raw JSON string from the LLM
    const jsonString = await getOllamaResponse(prompt);
    
    // 2. 🚨 FIX 2: Parse the JSON string into the structured object
    try {
        // Remove markdown wrappers (e.g., ```json ... ```) if the LLM adds them
        const cleanedJsonString = jsonString
            .replace(/^```json\s*/, '')
            .replace(/\s*```$/, '');

        return JSON.parse(cleanedJsonString) as InterpretationResponse;

    } catch (e) {
        console.error("JSON Parsing Error from LLM response:", e);
        console.error("Raw LLM Response:", jsonString);
        // Throw a specific error if the LLM output can't be parsed
        throw new Error("LLM returned non-parsable output. Check prompt instructions and model.");
    }
} 