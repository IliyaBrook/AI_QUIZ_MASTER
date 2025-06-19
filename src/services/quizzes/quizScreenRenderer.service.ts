import React from 'react';

import type { QuizScreen } from '@/settings';
import type { IQuizWithWrapper } from '@/types';

interface QuizComponents {
  QuizGeneration: React.ComponentType<{
    onQuizGenerated: (quizData: IQuizWithWrapper) => void;
  }>;
  QuizPreview: React.ComponentType<{
    quizData: IQuizWithWrapper;
    onStartQuiz: () => void;
    onBackToGeneration: () => void;
  }>;
  QuizPlayground: React.ComponentType<{
    quizData: IQuizWithWrapper;
    onBackToGeneration: () => void;
  }>;
}

interface RenderScreenParams {
  currentScreen: QuizScreen;
  quizData: IQuizWithWrapper | null;
  components: QuizComponents;
  handlers: {
    handleQuizGenerated: (quizData: IQuizWithWrapper) => void;
    handleStartQuiz: () => void;
    handleBackToGeneration: () => void;
  };
}

export const renderQuizScreen = ({
  currentScreen,
  quizData,
  components,
  handlers,
}: RenderScreenParams): React.ReactElement | null => {
  const { QuizGeneration, QuizPreview, QuizPlayground } = components;
  const { handleQuizGenerated, handleStartQuiz, handleBackToGeneration } =
    handlers;

  switch (currentScreen) {
    case 'quizzes-generation':
      return React.createElement(QuizGeneration, {
        onQuizGenerated: handleQuizGenerated,
      });
    case 'quizzes-preview':
      return quizData
        ? React.createElement(QuizPreview, {
            quizData,
            onStartQuiz: handleStartQuiz,
            onBackToGeneration: handleBackToGeneration,
          })
        : null;
    case 'quizzes-playground':
      return quizData
        ? React.createElement(QuizPlayground, {
            quizData,
            onBackToGeneration: handleBackToGeneration,
          })
        : null;
    default:
      return null;
  }
};
