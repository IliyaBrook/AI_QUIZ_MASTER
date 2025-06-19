import { useCallback, useState } from 'react';

import type { IQuizWithWrapper, QuizScreen } from '@/types';
import { setStyleAttributeByRoute } from '@/utils/setStyleAttributeByRoute';

export const useQuizNavigation = () => {
  const [currentScreen, setCurrentScreen] =
    useState<QuizScreen>('quizzes-generation');
  const [quizData, setQuizData] = useState<IQuizWithWrapper | null>(null);

  const handleQuizGenerated = useCallback(
    (generatedQuizData: IQuizWithWrapper) => {
      setQuizData(generatedQuizData);
      setCurrentScreen('quizzes-preview');
      setStyleAttributeByRoute('quizzes-preview');
    },
    []
  );

  const handleStartQuiz = useCallback(() => {
    setCurrentScreen('quizzes-playground');
    setStyleAttributeByRoute('quizzes-playground');
  }, []);

  const handleBackToGeneration = useCallback(() => {
    setQuizData(null);
    setCurrentScreen('quizzes-generation');
    setStyleAttributeByRoute('quizzes-generation');
  }, []);

  return {
    currentScreen,
    quizData,
    handleQuizGenerated,
    handleStartQuiz,
    handleBackToGeneration,
  };
};
