import { Home, Page1 } from '@/pages';
import type { IAppPage } from '@/types';

export const appPages: IAppPage[] = [
  {
    index: true,
    element: <Home />,
    label: 'Home',
    path: '/',
  },
  {
    element: <Page1 />,
    label: 'Page 1',
    path: '/page1',
  },
];
