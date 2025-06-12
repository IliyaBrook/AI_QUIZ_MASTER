import type { IQuizWithWrapper, TLang } from '@/types';
import { LANGUAGE_NAMES } from '@/constants';
import { generateQuizViaLocalAI } from './localAI.service';

export type { TLang };
export { LANGUAGE_NAMES as languageNames };

export async function generateQuiz(
    topic: string, 
    language: TLang,
    onProgress?: (progress: number) => void
): Promise<{ quizData: IQuizWithWrapper, rawResponseText: string }> {
    return await generateQuizViaLocalAI(topic, language, onProgress);
} 