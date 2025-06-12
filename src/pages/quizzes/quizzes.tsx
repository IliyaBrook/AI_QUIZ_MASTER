import React, { useState, Suspense } from 'react';
import type { IQuizWithWrapper } from '@/types';
import { LoadingSpinner } from '@/components';
import QuizGeneration from './QuizGeneration/quizGeneration';
import QuizPreview from './QuizPreview/quizPreview';
import QuizPlayground from './QuizPlayground/quizPlayground';
import styles from './quizzes.module.scss';

type QuizScreen = 'generation' | 'preview' | 'playground';

const Quizzes: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<QuizScreen>('generation');
  const [quizData, setQuizData] = useState<IQuizWithWrapper | null>(null);

  const handleQuizGenerated = (generatedQuizData: IQuizWithWrapper) => {
    setQuizData(generatedQuizData);
    setCurrentScreen('preview');
  };

  const handleStartQuiz = () => {
    setCurrentScreen('playground');
  };

  const handleBackToGeneration = () => {
    setQuizData(null);
    setCurrentScreen('generation');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'generation':
        return <QuizGeneration onQuizGenerated={handleQuizGenerated} />;
      case 'preview':
        return quizData ? (
          <QuizPreview
            quizData={quizData}
            onStartQuiz={handleStartQuiz}
            onBackToGeneration={handleBackToGeneration}
          />
        ) : null;
      case 'playground':
        return quizData ? (
          <QuizPlayground
            quizData={quizData}
            onBackToGeneration={handleBackToGeneration}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={styles.quizContainer}>
      <h1>AI Quiz Master</h1>
      {renderCurrentScreen()}
    </div>
  );
};

const QuizzesWithSuspense: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Quizzes />
  </Suspense>
);

export default QuizzesWithSuspense;
