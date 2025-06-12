import { Home } from '@/pages';
import type { IAppPage } from '@/types';

// add new pages here
export const appPages: IAppPage[] = [
  {
    index: true,
    element: <Home />,
    label: 'Home',
    path: '/',
    id: 'home-page-id-1',
  }
];
