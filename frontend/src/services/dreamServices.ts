// frontend/src/services/dreamService.ts
import { interpretDream } from '@/src/services/ollama';
import { UserContext, DreamEntry } from '../utils/dreamSchema';

export async function processDream(user: UserContext, dream: DreamEntry) {
    const result = await interpretDream(user, dream);
    console.log("Dream interpretation result:", result);
    return result;
}
