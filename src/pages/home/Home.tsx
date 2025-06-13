import { Link } from 'react-router';
import styles from './Home.module.scss';

export function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            <span className={styles.titleMain}>AI Quiz Master</span>
            <span className={styles.titleSub}>
              Next-Generation Learning Platform
            </span>
          </h1>

          <p className={styles.description}>
            Master any subject with AI-powered quizzes and coding challenges.
            Test your knowledge, improve your skills, and accelerate your
            learning journey!
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🧠</div>
              <h3>Interactive Quizzes</h3>
              <p>
                AI-generated quizzes with instant feedback and detailed
                explanations
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>💻</div>
              <h3>Coding Challenges</h3>
              <p>
                Practice programming with AI-created challenges and real-time
                code execution
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>🌍</div>
              <h3>Multilingual Support</h3>
              <p>
                Learn in your preferred language with global content support
              </p>
            </div>
          </div>

          <div className={styles.cta}>
            <Link to='/quizzes' className={styles.primaryButton}>
              Create Quiz
            </Link>
            <Link to='/coding-challenges' className={styles.secondaryButton}>
              Coding Challenge
            </Link>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.floatingCards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🧠</div>
              <span>Quizzes</span>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>⚡</div>
              <span>AI-Powered</span>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🚀</div>
              <span>Challenges</span>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>📈</div>
              <span>Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
