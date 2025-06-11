import type { IQuizWithWrapper, TLang, TModelType } from '@/types';
import { LANGUAGE_NAMES, MODEL_NAMES } from '@/constants';
import { generateQuizViaGemini } from './geminiAI.service';
import { generateQuizViaLocalAI } from './localAI.service';

export type { TLang, TModelType };
export { LANGUAGE_NAMES as languageNames, MODEL_NAMES as modelNames };

export async function generateQuiz(
    topic: string, 
    language: TLang, 
    modelType: TModelType,
    onProgress?: (progress: number) => void
): Promise<{ quizData: IQuizWithWrapper, rawResponseText: string }> {
    
    if (modelType === 'local') {
        return await generateQuizViaLocalAI(topic, language, onProgress);
    } else {
        return await generateQuizViaGemini(topic, language);
    }
} 