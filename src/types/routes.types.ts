import type { RouteObject } from 'react-router';

import type { AppPagesVariants } from '@/settings';

import type { TKebabCase } from './utils.types';

export type AppLabels = 'Home' | 'Quizzes' | 'Coding Challenges';
export type AppPaths = '/' | '/quizzes' | '/coding-challenges';

export type IAppPage = {
  label: AppLabels;
  path: AppPaths;
  id: string;
} & RouteObject;

export type TransformedAppLabels = TKebabCase<Lowercase<AppLabels>>;

export type ChallengeScreen =
  | 'coding-challenges-generation'
  | 'coding-challenges-preview'
  | 'coding-challenges-playground';
export type QuizScreen =
  | 'quizzes-preview'
  | 'quizzes-playground'
  | 'quizzes-generation';

export type TPageStyleAttribute =
  | AppPagesVariants
  | QuizScreen
  | ChallengeScreen;
