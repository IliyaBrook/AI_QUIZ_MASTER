import React, { useState, useCallback, Suspense } from 'react';
import { generateQuiz } from '@/services';
import type { TLang } from '@/services';
import type { IQuizWithWrapper, IAnswerOption } from '@/types';
import { DEFAULT_LANGUAGE } from '@/constants';
import { LoadingSpinner } from '@/components';
import QuizGeneration from './QuizGeneration/quizGeneration';
import QuizPreview from './QuizPreview/quizPreview';
import QuizPlayground from './QuizPlayground/quizPlayground';
import styles from './quizzes.module.scss';

const Quizzes: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [language, setLanguage] = useState<TLang>(DEFAULT_LANGUAGE);
  const [quizData, setQuizData] = useState<IQuizWithWrapper | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<IAnswerOption | null>(
    null
  );
  const [showRationale, setShowRationale] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleGenerateQuiz = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a quiz topic.');
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuizData(null);
    resetQuizState();

    try {
      const { quizData: newQuizData } = await generateQuiz(topic, language);
      setQuizData(newQuizData);
    } catch (e) {
      console.error('Error generating quiz:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Quiz generation error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [topic, language, isLoading]);

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowRationale(false);
    setQuizCompleted(false);
    setQuizStarted(false);
  };

  const handleStartQuiz = () => {
    resetQuizState();
    setQuizStarted(true);
  };

  const handleAnswerSelect = (option: IAnswerOption) => {
    if (!showRationale) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      setError('Please select an answer option!');
      return;
    }
    setError(null);
    setShowRationale(true);
    if (selectedAnswer.is_correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowRationale(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < (quizData?.quiz.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    resetQuizState();
  };

  const handleBackToGeneration = () => {
    setQuizData(null);
    setQuizStarted(false);
    resetQuizState();
    setError(null);
  };

  if (!quizData || !quizStarted) {
    return (
      <div className={styles.quizContainer}>
        <h1>AI Quiz Master</h1>

        {!quizData ? (
          <QuizGeneration
            topic={topic}
            language={language}
            isLoading={isLoading}
            error={error}
            onTopicChange={setTopic}
            onLanguageChange={setLanguage}
            onGenerateQuiz={handleGenerateQuiz}
          />
        ) : (
          <QuizPreview
            quizData={quizData}
            onStartQuiz={handleStartQuiz}
            onBackToGeneration={handleBackToGeneration}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
      <QuizPlayground
        quizData={quizData}
        currentQuestionIndex={currentQuestionIndex}
        score={score}
        selectedAnswer={selectedAnswer}
        showRationale={showRationale}
        quizCompleted={quizCompleted}
        error={error}
        onAnswerSelect={handleAnswerSelect}
        onSubmitAnswer={handleSubmitAnswer}
        onNextQuestion={handleNextQuestion}
        onRestartQuiz={handleRestartQuiz}
        onBackToGeneration={handleBackToGeneration}
      />
    </div>
  );
};

const QuizzesWithSuspense: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Quizzes />
  </Suspense>
);

export default QuizzesWithSuspense;
