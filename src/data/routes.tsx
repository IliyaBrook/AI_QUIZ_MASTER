import Home from '@/pages/home/Home';
import Page1 from '@/pages/page1/Page1';
import type { IAppPage } from '@/types/routes.types';

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
