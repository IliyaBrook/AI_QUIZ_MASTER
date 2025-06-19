import { useCallback, useState } from 'react';

import type { QuizScreen } from '@/settings';
import type { IQuizWithWrapper } from '@/types';

export const useQuizNavigation = () => {
  const [currentScreen, setCurrentScreen] =
    useState<QuizScreen>('quizzes-generation');
  const [quizData, setQuizData] = useState<IQuizWithWrapper | null>(null);

  const handleQuizGenerated = useCallback(
    (generatedQuizData: IQuizWithWrapper) => {
      setQuizData(generatedQuizData);
      setCurrentScreen('quizzes-preview');
    },
    []
  );

  const handleStartQuiz = useCallback(() => {
    setCurrentScreen('quizzes-playground');
  }, []);

  const handleBackToGeneration = useCallback(() => {
    setQuizData(null);
    setCurrentScreen('quizzes-generation');
  }, []);

  return {
    currentScreen,
    quizData,
    handleQuizGenerated,
    handleStartQuiz,
    handleBackToGeneration,
  };
};
