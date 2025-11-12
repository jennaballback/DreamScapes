// src/services/ollama.ts
import { buildDreamPrompt, UserContext, DreamEntry } from "../utils/dreamSchema";

export async function interpretDream(
  user: UserContext,
  dream: DreamEntry
): Promise<string> {
  const prompt = buildDreamPrompt(user, dream);  // or just use dream.text if you prefer
  // TODO: call your real model/server here; returning a stub for now:
  return `(${user.interpretationStyle}) ${prompt.slice(0, 200)}`;
}
export { interpretDream as processDream };