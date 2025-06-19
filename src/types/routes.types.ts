import type { RouteObject } from 'react-router';

import type { TKebabCase } from './utils.types';

export type AppLabels = 'Home' | 'Quizzes' | 'Coding Challenges';
export type AppPaths = '/' | '/quizzes' | '/coding-challenges';

export type IAppPage = {
  label: AppLabels;
  path: AppPaths;
  id: string;
} & RouteObject;

export type TransformedAppLabels = TKebabCase<Lowercase<AppLabels>>;
