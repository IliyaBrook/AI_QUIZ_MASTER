export interface IQuizAiResponse {
  title: string;
  language: string;
  questions: IQuestion[];
}

export interface IQuizWithWrapper {
  quiz: IQuizAiResponse;
}

export interface IQuestion {
  question: string;
  answer_options: IAnswerOption[];
}

export interface IAnswerOption {
  text: string;
  rationale: string;
  is_correct: boolean;
}

export type TLang = 'ru' | 'en' | 'es' | 'fr' | 'de';

export type TLanguageMap = {
  [K in TLang]: string;
};

export type TModelType = 'local' | 'gemini';

export type TModelMap = {
  [K in TModelType]: string;
};
  