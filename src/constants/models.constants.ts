import type { TLang, TLanguageMap, TModelMap } from '@/types/quizAiResponse.types';

export const LANGUAGE_NAMES: TLanguageMap = {
    'ru': 'Russian',
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German'
};

export const MODEL_NAMES: TModelMap = {
    'local': 'Local AI (Llama 3.1 8B)',
    'gemini': 'Google Gemini'
};

export const DEFAULT_LANGUAGE: TLang = 'ru';
export const DEFAULT_MODEL = 'local'; 