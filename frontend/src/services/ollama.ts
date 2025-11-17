// frontend/src/ollama.ts
import { buildDreamPrompt, UserContext, DreamEntry } from '@/utils/dreamSchema';

// CONFIRMED ENDPOINT: This is the local IP you verified with curl.
// NOTE: If your local IP changes (e.g., after reconnecting to Wi-Fi), you must update this number!
const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';

/**
 * Sends a prompt to the local Ollama server (Phi-3 Mini) and returns the text response.
 * @param prompt The user's input string.
 * @returns The LLM-generated response text.
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
            }),
        });

        if (!response.ok) {
            console.error('Ollama HTTP Error:', response.status, response.statusText);
            throw new Error("Failed to reach Ollama server (HTTP error).");
        }

        const data = await response.json();
        return data.response.trim(); // Extract and return the LLM's text response

    } catch (error) {
        console.error("Connection Error to Ollama:", error);
        // Return a user-friendly error message if the connection fails
        return "Error: LLM server connection failed. Is Ollama running?";
    }
}

/**
 * High-level helper for dream interpretation.
 * Builds the structured prompt and sends it to the LLM.
 */
export async function interpretDream(user: UserContext, dream: DreamEntry): Promise<string> {
    const prompt = buildDreamPrompt(user, dream);
    return await getOllamaResponse(prompt);
}
