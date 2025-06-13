import { useState, useCallback } from 'react';
import type { IQuizWithWrapper } from '@/types';

export type QuizScreen = 'generation' | 'preview' | 'playground';

export const useQuizNavigation = () => {
  const [currentScreen, setCurrentScreen] = useState<QuizScreen>('generation');
  const [quizData, setQuizData] = useState<IQuizWithWrapper | null>(null);

  const handleQuizGenerated = useCallback(
    (generatedQuizData: IQuizWithWrapper) => {
      setQuizData(generatedQuizData);
      setCurrentScreen('preview');
    },
    []
  );

  const handleStartQuiz = useCallback(() => {
    setCurrentScreen('playground');
  }, []);

  const handleBackToGeneration = useCallback(() => {
    setQuizData(null);
    setCurrentScreen('generation');
  }, []);

  return {
    currentScreen,
    quizData,
    handleQuizGenerated,
    handleStartQuiz,
    handleBackToGeneration,
  };
};
