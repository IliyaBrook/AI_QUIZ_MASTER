import { useState, useCallback } from 'react';
import type { IAnswerOption, IQuizWithWrapper } from '@/types';

export const useQuizPlayground = (quizData: IQuizWithWrapper) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<IAnswerOption | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = quizData.quiz.questions[currentQuestionIndex];
  const totalQuestions = quizData.quiz.questions.length;

  const resetQuizState = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowRationale(false);
    setQuizCompleted(false);
    setError(null);
  }, []);

  const handleAnswerSelect = useCallback((option: IAnswerOption) => {
    if (!showRationale) {
      setSelectedAnswer(option);
    }
  }, [showRationale]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedAnswer === null) {
      setError('Please select an answer option!');
      return;
    }
    setError(null);
    setShowRationale(true);
    if (selectedAnswer.is_correct) {
      setScore(prevScore => prevScore + 1);
    }
  }, [selectedAnswer]);

  const handleNextQuestion = useCallback(() => {
    setShowRationale(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const handleRestartQuiz = useCallback(() => {
    resetQuizState();
  }, [resetQuizState]);

  return {
    currentQuestionIndex,
    score,
    selectedAnswer,
    showRationale,
    quizCompleted,
    error,
    currentQuestion,
    totalQuestions,
    handleAnswerSelect,
    handleSubmitAnswer,
    handleNextQuestion,
    handleRestartQuiz,
    resetQuizState
  };
}; 