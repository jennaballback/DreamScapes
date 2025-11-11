// frontend/src/ollama.ts (CRUCIAL UPDATE)

import { buildDreamPrompt, UserContext, DreamEntry } from './utils/dreamSchema';

const OLLAMA_ENDPOINT = 'http://10.2.10.65:11434/api/generate';

// ✅ Define the expected JSON structure
export interface InterpretationResponse {
    summary: string;
    symbolicMeaning: string;
    emotionalInsight: string;
    culturalAnalysis: string;
    reflectionPrompt: string;
}

/**
 * Sends a prompt to the local Ollama server and returns the RAW text response.
 */
export async function getOllamaResponse(prompt: string): Promise<string> {
    try {
        const response = await fetch(OLLAMA_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'phi3:mini',
                prompt: prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error("Error: Failed to reach Ollama server (HTTP error).");
        }

        const data = await response.json();
        return data.response.trim();

    } catch (error: any) {
        throw new Error("Error: LLM server connection failed. Is Ollama running? Details: " + error.message);
    }
}

/**
 * High-level helper for dream interpretation.
 * Builds the structured prompt, sends it to the LLM, and ROBUSTLY PARSES the JSON response.
 */
export async function interpretDream(user: UserContext, dream: DreamEntry): Promise<InterpretationResponse> {
    const prompt = buildDreamPrompt(user, dream);

    const rawJsonString = await getOllamaResponse(prompt);

    // --- ROBUST JSON EXTRACTION ---
    let cleanedString = rawJsonString.trim();

    // 1. Look for the JSON content enclosed in triple backticks (```json...```)
    const match = cleanedString.match(/```json\s*([\s\S]*?)\s*```/i);

    if (match && match[1]) {
        cleanedString = match[1].trim();
    } else {
        // 2. Fallback: Try to find the first '{' and the last '}'
        const firstBrace = cleanedString.indexOf('{');
        const lastBrace = cleanedString.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleanedString = cleanedString.substring(firstBrace, lastBrace + 1).trim();
        }
    }
    // --- END ROBUST JSON EXTRACTION ---

    try {
        const parsedObject: InterpretationResponse = JSON.parse(cleanedString);
        return parsedObject;
    } catch (e) {
        console.error("Failed to parse LLM JSON response. Raw output:", rawJsonString, "Cleaned string:", cleanedString, "Error:", e);
        throw new Error("Error: LLM output format error. Could not parse JSON. Check LLM prompt instructions.");
    }
}