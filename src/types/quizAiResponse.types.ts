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

export type TLang =
  | 'en'
  | 'ru'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'hi'
  | 'ar'
  | 'tr'
  | 'nl'
  | 'pl'
  | 'sv'
  | 'da'
  | 'no'
  | 'fi'
  | 'he';

export type TLanguageMap = {
  [K in TLang]: string;
};
