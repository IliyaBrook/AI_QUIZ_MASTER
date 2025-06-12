import styles from './Home.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            <span className={styles.titleMain}>AI Quiz Master</span>
            <span className={styles.titleSub}>Next-Generation Intelligent Quizzes</span>
          </h1>
          
          <p className={styles.description}>
            Create and take quizzes on any topic using artificial intelligence. 
            Learn new things, test your knowledge, and grow with us!
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🤖</div>
              <h3>AI Generation</h3>
              <p>Quizzes are created by artificial intelligence based on your requests</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🌍</div>
              <h3>Multilingual</h3>
              <p>Support for quizzes in various languages around the world</p>
            </div>
            
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Interactive</h3>
              <p>Instant feedback and detailed explanations for answers</p>
            </div>
          </div>

          <div className={styles.cta}>
            <button className={styles.primaryButton}>
              Create Quiz
            </button>
            <button className={styles.secondaryButton}>
              Learn More
            </button>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.floatingCards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>❓</div>
              <span>History</span>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🔬</div>
              <span>Science</span>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>🎨</div>
              <span>Arts</span>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>💻</div>
              <span>Technology</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 