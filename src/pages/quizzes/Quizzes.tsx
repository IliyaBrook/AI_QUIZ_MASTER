import React, { Suspense } from 'react';

import { LoadingSpinner } from '@/components';
import { renderQuizScreen, useQuizNavigation } from '@/services';

import QuizGeneration from './QuizGeneration/quizGeneration';
import QuizPlayground from './QuizPlayground/quizPlayground';
import QuizPreview from './QuizPreview/quizPreview';
import styles from './Quizzes.module.scss';

const RenderQuizzes: React.FC = () => {
  const {
    currentScreen,
    quizData,
    handleQuizGenerated,
    handleStartQuiz,
    handleBackToGeneration,
  } = useQuizNavigation();

  const currentScreenComponent = renderQuizScreen({
    currentScreen,
    quizData,
    components: {
      QuizGeneration,
      QuizPreview,
      QuizPlayground,
    },
    handlers: {
      handleQuizGenerated,
      handleStartQuiz,
      handleBackToGeneration,
    },
  });

  return <div className={styles.quizContainer}>{currentScreenComponent}</div>;
};

export const Quizzes: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <RenderQuizzes />
  </Suspense>
);
