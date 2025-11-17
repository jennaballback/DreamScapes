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
    response: string;
    userId: string;
    id: string;
    sleepQuality?: string;
    recurringSymbols?: string[];
    notes?: string;
}

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

Please provide:
1. A short summary of the dream.
2. Symbolic meanings of key elements.
3. Psychological or emotional insights.
4. A reflective journaling prompt.
  `;
}
