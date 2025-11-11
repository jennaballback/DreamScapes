// frontend/src/services/dreamService.ts (CRUCIAL UPDATE)

import { interpretDream, InterpretationResponse } from '../ollama';
import { UserContext, DreamEntry } from '../utils/dreamSchema';
 
export async function processDream(
    user: UserContext,
    dream: DreamEntry
): Promise<InterpretationResponse> {

    const result = await interpretDream(user, dream);
    console.log("Dream interpretation result:", result);

    return result;
} 