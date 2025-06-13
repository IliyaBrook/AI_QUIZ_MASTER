import React, { Suspense } from 'react';
import { LoadingSpinner } from '@/components';
import { useQuizNavigation, renderQuizScreen } from '@/services';
import QuizGeneration from './QuizGeneration/quizGeneration';
import QuizPreview from './QuizPreview/quizPreview';
import QuizPlayground from './QuizPlayground/quizPlayground';
import styles from './quizzes.module.scss';

const Quizzes: React.FC = () => {
  const {
    currentScreen,
    quizData,
    handleQuizGenerated,
    handleStartQuiz,
    handleBackToGeneration
  } = useQuizNavigation();

  const currentScreenComponent = renderQuizScreen({
    currentScreen,
    quizData,
    components: {
      QuizGeneration,
      QuizPreview,
      QuizPlayground
    },
    handlers: {
      handleQuizGenerated,
      handleStartQuiz,
      handleBackToGeneration
    }
  });

  return (
    <div className={styles.quizContainer}>
      <h1>AI Quiz Master</h1>
      {currentScreenComponent}
    </div>
  );
};

const QuizzesWithSuspense: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Quizzes />
  </Suspense>
);

export default QuizzesWithSuspense;
