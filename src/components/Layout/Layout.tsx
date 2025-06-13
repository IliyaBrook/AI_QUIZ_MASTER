import { Outlet } from 'react-router';
import styles from './Layout.module.scss';
import { Navbar } from '@/components';

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