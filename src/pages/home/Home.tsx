import InteractiveQuiz from '@/components/InteractiveQuiz/InteractiveQuiz';
import styles from './Home.module.scss';
import quizJson2 from '@/data/testQuiz2.json';

export default function Home() {
  return (
    <div className={styles.home}>
     <InteractiveQuiz quizJson={quizJson2} />
    </div>
  );
} 