import { CodingChallenges, Home, Quizzes } from '@/pages';
import type { IAppPage, TransformedAppLabels } from '@/types';

export const appPages: IAppPage[] = [
  {
    index: true,
    element: <Home />,
    label: 'Home',
    path: '/',
    id: 'home-page-id-1',
  },
  {
    index: false,
    element: <Quizzes />,
    label: 'Quizzes',
    path: '/quizzes',
    id: 'quizzes-page-id-1',
  },
  {
    index: false,
    element: <CodingChallenges />,
    label: 'Coding Challenges',
    path: '/coding-challenges',
    id: 'coding-challenges-page-id-1',
  },
];

export const appPagesOptions = appPages.map((page: IAppPage) =>
  page.label.toLowerCase().replace(/\s+/g, '-')
) as TransformedAppLabels[];
export type AppPagesVariants = (typeof appPagesOptions)[number];

console.log(appPagesOptions);

export type QuizScreen =
  | 'quizzes-preview'
  | 'quizzes-playground'
  | 'quizzes-generation';
