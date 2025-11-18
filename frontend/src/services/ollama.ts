import { buildDreamPrompt, UserContext, DreamEntry } from '@/utils/dreamSchema';

// Local Ollama endpoint
const OLLAMA_ENDPOINT = 'http://localhost:11434/api/generate';

/**
 * Sends a prompt to the local Ollama server (Phi-3 Mini) and returns the response.
 * @param prompt The structured dream prompt.
 * @returns The LLM-generated response text.
 */
export async function getOllamaResponse(prompt: string): Promise<string> {
    try {
        const response = await fetch(OLLAMA_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'phi3:mini',
                prompt,
                stream: false, // Get complete response
            }),
        });

        if (!response.ok) {
            console.error('Ollama HTTP Error:', response.status, response.statusText);
            throw new Error('Failed to reach Ollama server (HTTP error).');
        }

        const data = await response.json();
        return data.response.trim();

    } catch (error) {
        console.error('Connection Error to Ollama:', error);
        return 'Error: LLM server connection failed. Is Ollama running?';
    }
}

/**
 * High-level helper to interpret a dream.
 * @param user User context for interpretation.
 * @param dream Dream entry object.
 * @returns LLM-generated interpretation string.
 */
export async function interpretDream(user: UserContext, dream: DreamEntry): Promise<string> {
    const prompt = buildDreamPrompt(user, dream);
    return await getOllamaResponse(prompt);
}
