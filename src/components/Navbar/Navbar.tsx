import { useState } from 'react';
import { Link } from 'react-router';

import { appPages } from '@/settings';

import styles from './Navbar.module.scss';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

        <button
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
          aria-label='Toggle navigation menu'
        >
          <span
            className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.active : ''}`}
          ></span>
          <span
            className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.active : ''}`}
          ></span>
          <span
            className={`${styles.hamburgerLine} ${isMobileMenuOpen ? styles.active : ''}`}
          ></span>
        </button>

        <div
          className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}
        >
          {appPages.map((page) => (
            <Link
              key={page.id}
              to={page.path}
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {page.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
