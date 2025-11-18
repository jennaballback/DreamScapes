// src/utils/dreamSchema.ts

export interface UserContext {
    id: string;
    ageRange?: string;
    culturalBackground?: string;
    interpretationStyle?: "psychological" | "creative" | "spiritual";
    preferredTone?: string;
}

export interface DreamEntry {
    date: string;
    dreamText: string;
    emotionsInDream: string[];
    moodBeforeSleep?: string;
    timestamp: any;
    moodAfterWaking?: string;
    sleepQuality?: string;
    recurringSymbols?: string[];
    notes?: string;
    response?: string;
    userId: string;
    id: string;
}

/**
 * Builds a structured prompt to send to the Ollama LLM.
 * Instructs the LLM to return the dream interpretation in the ✨ / 🎶 / ❤️ / 🌍 / ⚠️ format.
 */
export function buildDreamPrompt(user: UserContext, dream: DreamEntry): string {
    return `
You are a thoughtful and insightful dream interpreter who blends psychological understanding with symbolic analysis.
Avoid mystical or predictive claims. Focus on emotional meaning and reflection.

User Context:
- Interpretation Style: ${user.interpretationStyle ?? "psychological"}
- Preferred Tone: ${user.preferredTone ?? "gentle and reflective"}
- Age Range: ${user.ageRange ?? "N/A"}
- Cultural Background: ${user.culturalBackground ?? "N/A"}

Dream Entry (${dream.date}):
"${dream.dreamText}"

Emotions in Dream: ${dream.emotionsInDream.join(", ")}
Mood Before Sleep: ${dream.moodBeforeSleep ?? "N/A"}
Mood After Waking: ${dream.moodAfterWaking ?? "N/A"}
Sleep Quality: ${dream.sleepQuality ?? "N/A"}
Recurring Symbols: ${(dream.recurringSymbols ?? []).join(", ")}
Notes: ${dream.notes ?? "None"}

Please format your response using these labeled sections exactly as shown:
✨ Dream Summary
🎶 Symbolic Meaning
❤️ Emotional Insight
🌍 Cultural Analysis
⚠️ Reflection Prompt

Your response **MUST** contain all five sections listed below in the exact order and with the exact labels. Do not include any extra punctuation (like colons or dots) after the label text.
`;
}