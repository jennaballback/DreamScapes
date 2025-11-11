// src/utils/dreamSchema.ts (CRUCIAL UPDATE)

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
You are a thoughtful and insightful dream interpreter who blends psychological understanding, symbolic analysis, and cross-cultural context.
Avoid mystical or predictive claims. Focus on emotional meaning and reflection.

**CRITICAL INSTRUCTION: Your entire response MUST be a single, valid JSON object, enclosed within a single pair of triple backticks (\`\`\`) ONLY. Do NOT include any other text, explanation, or introduction outside of the backticks.**

The JSON object MUST contain exactly five (5) top-level keys in this precise order. The content for each key MUST be a simple string (do NOT use nested objects, arrays, or further JSON):

1. summary: Provide a **detailed, 3-4 sentence summary** of the dream.
2. symbolicMeaning: Provide a **comprehensive analysis** of the symbolic meanings of key elements, including relevant context for each symbol.
3. emotionalInsight: Offer **deep, detailed psychological and emotional insights** into the dream's core conflicts and feelings.
4. culturalAnalysis: Provide the cultural analysis (you MUST specifically reference the dreamer's Cultural Background).
5. reflectionPrompt: Generate a **thoughtful and expansive reflective journaling prompt** that encourages deep introspection.

User Context for Analysis:
- Interpretation Style: ${user.interpretationStyle ?? "psychological"}
- Preferred Tone: ${user.preferredTone ?? "gentle and reflective"}
- Cultural Background: ${user.culturalBackground ?? "General Western"}

Dream Entry (${dream.date}):
"${dream.dreamText}"

Emotions in Dream: ${dream.emotionsInDream.join(", ")}
Notes: ${dream.notes ?? "None"}

Please generate the content for the five JSON sections, ensuring the entire output is wrapped in \`\`\`json...\`\`\`.
`;
}