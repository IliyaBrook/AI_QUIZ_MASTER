import React, { useState, useCallback, Suspense } from 'react';
import { generateQuiz, languageNames } from '@/services';
import type { TLang } from '@/services';
import type { IQuizWithWrapper, IAnswerOption } from '@/types';
import { DEFAULT_LANGUAGE } from '@/constants';
import { LoadingSpinner, Input, Select, Button } from '@/components';
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
          <div className={styles.quizGeneration}>
            {isLoading ? (
              <LoadingSpinner message='Generating quiz...' />
            ) : (
              <>
                <Input
                  label="Quiz Topic"
                  id="topicInput"
                  value={topic}
                  onChange={setTopic}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && topic.trim() && !isLoading) {
                      handleGenerateQuiz();
                    }
                  }}
                  placeholder="e.g., Ancient Egypt History"
                  disabled={isLoading}
                />

                <Select
                  label="Language"
                  id="languageSelect"
                  value={language}
                  options={Object.entries(languageNames).map(([key, name]) => ({
                    value: key,
                    label: name
                  }))}
                  onChange={value => setLanguage(value as TLang)}
                  disabled={isLoading}
                />

                <Button
                  onClick={handleGenerateQuiz}
                  disabled={isLoading || !topic.trim()}
                  variant="primary"
                >
                  Generate Quiz
                </Button>

                {error && <div className={styles.errorMessage}>{error}</div>}
              </>
            )}
          </div>
        ) : (
          <div className={styles.quizPreview}>
            <h2>{quizData.quiz.title}</h2>
            <p>Language: {languageNames[quizData.quiz.language as TLang]}</p>
            <p>Number of questions: {quizData.quiz.questions.length}</p>

            <div className={styles.quizActions}>
              <Button onClick={handleStartQuiz} variant="primary">
                Start Quiz
              </Button>
              <Button onClick={handleBackToGeneration} variant="secondary">
                Create New Quiz
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = quizData.quiz.questions[currentQuestionIndex];
  const totalQuestions = quizData.quiz.questions.length;

  if (!currentQuestion) {
    return (
      <div className={styles.quizContainer}>
        <div className={styles.errorMessage}>Error: Question not found.</div>
        <Button onClick={handleBackToGeneration} variant="secondary">
          Back to Quiz Creation
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <h1>{quizData.quiz.title}</h1>
        <div className={styles.quizProgress}>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        <Button onClick={handleBackToGeneration} variant="secondary" size="small">
          ← New Quiz
        </Button>
      </div>

      {quizCompleted ? (
        <div className={styles.quizResults}>
          <h2>Quiz Results</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.score}>{score}</span>
            <span className={styles.separator}>/</span>
            <span className={styles.total}>{totalQuestions}</span>
          </div>
          <p className={styles.scorePercentage}>
            {Math.round((score / totalQuestions) * 100)}% correct answers
          </p>

          <div className={styles.resultsActions}>
            <Button onClick={handleRestartQuiz} variant="info">
              Retry Quiz
            </Button>
            <Button onClick={handleBackToGeneration} variant="secondary">
              Create New Quiz
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.questionContainer}>
          <h2 className={styles.questionText}>{currentQuestion.question}</h2>

          <div className={styles.answerOptions}>
            {currentQuestion.answer_options.map((option, index) => (
              <button
                key={index}
                className={`${styles.answerOption} ${
                  selectedAnswer === option ? styles.selected : ''
                } ${showRationale && option.is_correct ? styles.correct : ''} ${
                  showRationale &&
                  selectedAnswer === option &&
                  !option.is_correct
                    ? styles.incorrect
                    : ''
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={showRationale}
              >
                {option.text}
              </button>
            ))}
          </div>

          {showRationale && selectedAnswer && (
            <div
              className={`${styles.rationale} ${selectedAnswer.is_correct ? styles.correctRationale : styles.incorrectRationale}`}
            >
              <p>{selectedAnswer.rationale}</p>
            </div>
          )}

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.questionActions}>
            {!showRationale ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                variant="primary"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} variant="success">
                {currentQuestionIndex < totalQuestions - 1
                  ? 'Next Question'
                  : 'Finish Quiz'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const QuizzesWithSuspense: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Quizzes />
  </Suspense>
);

export default QuizzesWithSuspense;
