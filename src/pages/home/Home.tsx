import InteractiveQuiz from '@/components/InteractiveQuiz/InteractiveQuiz';
import styles from './Home.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
     <InteractiveQuiz />
    </div>
  );
} 