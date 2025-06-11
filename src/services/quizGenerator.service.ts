import type { IQuizWithWrapper, TLang, TModelType } from '@/types/quizAiResponse.types';
import { LANGUAGE_NAMES, MODEL_NAMES } from '@/constants/models.constants';
import { generateQuizViaGemini } from './geminiAI.service';
import { generateQuizViaLocalAI } from './localAI.service';

export type { TLang, TModelType };
export { LANGUAGE_NAMES as languageNames, MODEL_NAMES as modelNames };

export async function generateQuiz(
    topic: string, 
    language: TLang, 
    modelType: TModelType
): Promise<{ quizData: IQuizWithWrapper, rawResponseText: string }> {
    
    if (modelType === 'local') {
        return await generateQuizViaLocalAI(topic, language);
    } else {
        return await generateQuizViaGemini(topic, language);
    }
} 