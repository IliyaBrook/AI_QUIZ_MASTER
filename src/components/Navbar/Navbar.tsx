import { Link } from 'react-router';

import { appPages } from '@/settings';

import styles from './Navbar.module.scss';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <img
            src='/favicon.svg'
            alt='AI Quiz Master'
            className={styles.logoImg}
          />
          <Link
            to='/'
            className={styles.logo}
          >
            AI Quiz Master
          </Link>
        </div>

        <div className={styles.navLinks}>
          {appPages.map((page) => (
            <Link
              key={page.id}
              to={page.path}
              className={styles.navLink}
            >
              {page.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
