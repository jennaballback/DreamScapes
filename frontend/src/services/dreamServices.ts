<<<<<<< HEAD
// frontend/src/services/dreamService.ts (CRUCIAL UPDATE)

import { interpretDream, InterpretationResponse } from './ollama';
import { UserContext, DreamEntry } from '../utils/dreamSchema';
 
export async function processDream(
    user: UserContext,
    dream: DreamEntry
): Promise<InterpretationResponse> {

    const result = await interpretDream(user, dream);
    console.log("Dream interpretation result:", result);

    return result;
} 
=======
// frontend/src/services/dreamService.ts
import { interpretDream } from '@/src/services/ollama';
import { UserContext, DreamEntry } from '../utils/dreamSchema';

export async function processDream(user: UserContext, dream: DreamEntry) {
    const result = await interpretDream(user, dream);
    console.log("Dream interpretation result:", result);
    return result;
}
>>>>>>> 3c453604ff08fbb4067b9adffd2a6f309760e474
