import type { TLang } from './options.type';

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

export type TLanguageMap = {
  [K in TLang]: string;
};
