import type { TDifficulty, TProgrammingLanguage } from './options.type';

export interface ICodingChallenge {
  title: string;
  description: string;
  language: string;
  programmingLanguage: TProgrammingLanguage;
  difficulty: 'easy' | 'medium' | 'hard';
  initialCode: string;
  solution: string;
  testCases: ITestCase[];
  hints: string[];
}

export interface ITestCase {
  input: string | Array<string>;
  expectedOutput: string | Array<string>;
  description?: string;
}

export interface ICodingChallengeWithWrapper {
  challenge: ICodingChallenge;
}

export type TProgrammingLanguageMap = Record<TProgrammingLanguage, string>;
export type TDifficultyMap = Record<TDifficulty, string>;
