import { Outlet } from 'react-router';

import { Navbar } from '@/components';

import styles from './Layout.module.scss';

export function Layout() {
  return (
    <div className={styles['layout']}>
      <Navbar />
      <main className={styles['main']}>
        <Outlet />
      </main>
    </div>
  );
}
