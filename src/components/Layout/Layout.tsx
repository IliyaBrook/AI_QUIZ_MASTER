import { Outlet } from 'react-router';
import Navbar from '../../navbar/Navbar';
import styles from './Layout.module.scss';

export default function Layout() {
  return (
    <div className={styles['layout']}>
      <Navbar />
      <main className={styles['main']}>
        <Outlet />
      </main>
    </div>
  );
} 