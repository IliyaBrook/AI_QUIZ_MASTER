import { Link } from 'react-router';
import styles from './Navbar.module.scss';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          AI Quiz Master
        </Link>
        
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            Quiz Generator
          </Link>
          <Link to="/page1" className={styles.navLink}>
            Страница 1
          </Link>
        </div>
      </div>
    </nav>
  );
} 