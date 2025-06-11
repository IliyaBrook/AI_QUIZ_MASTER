import { Link } from 'react-router';
import styles from './Page1.module.scss';

export default function Page1() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Страница 1</h1>
      <p className={styles.description}>Это первая страница нашего приложения React Router.</p>
      
      <div className={styles.navigation}>
        <Link to="/page2" className={`${styles.navButton} ${styles.primary}`}>
          Перейти на страницу 2
        </Link>
        <Link to="/" className={`${styles.navButton} ${styles.secondary}`}>
          Вернуться на главную
        </Link>
      </div>
      
      <div className={styles.features}>
        <h3 className={styles.featuresTitle}>Особенности страницы 1:</h3>
        <ul className={styles.featuresList}>
          <li>Простая навигация между страницами</li>
          <li>Использует React Router v7</li>
          <li>Адаптивный дизайн</li>
          <li>Современный TypeScript</li>
        </ul>
      </div>
    </div>
  );
} 