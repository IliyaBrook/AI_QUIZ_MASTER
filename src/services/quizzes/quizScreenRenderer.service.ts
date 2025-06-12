import React from 'react';
import type { IQuizWithWrapper } from '@/types';
import type { QuizScreen } from './useQuizNavigation.hook';

interface QuizComponents {
  QuizGeneration: React.ComponentType<{ onQuizGenerated: (quizData: IQuizWithWrapper) => void }>;
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
  handlers
}: RenderScreenParams): React.ReactElement | null => {
  const { QuizGeneration, QuizPreview, QuizPlayground } = components;
  const { handleQuizGenerated, handleStartQuiz, handleBackToGeneration } = handlers;

  switch (currentScreen) {
    case 'generation':
      return React.createElement(QuizGeneration, { onQuizGenerated: handleQuizGenerated });
    case 'preview':
      return quizData ? React.createElement(QuizPreview, {
        quizData,
        onStartQuiz: handleStartQuiz,
        onBackToGeneration: handleBackToGeneration
      }) : null;
    case 'playground':
      return quizData ? React.createElement(QuizPlayground, {
        quizData,
        onBackToGeneration: handleBackToGeneration
      }) : null;
    default:
      return null;
  }
}; 