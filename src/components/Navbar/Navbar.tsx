import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

import { appPages } from '@/settings';

import styles from './Navbar.module.scss';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={styles.navbar}
      ref={navbarRef}
    >
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
          className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.active : ''}`}
          onClick={toggleMobileMenu}
          aria-label='Toggle navigation menu'
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
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
