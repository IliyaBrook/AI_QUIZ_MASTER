import { Home, Quizzes, CodingChallenges } from '@/pages';
import type { IAppPage } from '@/types';
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
