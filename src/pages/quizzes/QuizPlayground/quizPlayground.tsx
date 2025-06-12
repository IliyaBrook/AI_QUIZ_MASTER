import React, { useState, useCallback } from 'react';
import { Button } from '@/components';
import type { IQuizWithWrapper, IAnswerOption } from '@/types';
import styles from './quizPlayground.module.scss';

interface QuizPlaygroundProps {
  quizData: IQuizWithWrapper;
  onBackToGeneration: () => void;
}

const QuizPlayground: React.FC<QuizPlaygroundProps> = ({
  quizData,
  onBackToGeneration
}) => {
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

  if (!currentQuestion) {
    return (
      <div className={styles.errorFallback}>
        <div className={styles.errorMessage}>Error: Question not found.</div>
        <Button onClick={onBackToGeneration} variant="secondary">
          Back to Quiz Creation
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.quizPlayground}>
      <div className={styles.quizHeader}>
        <h1>{quizData.quiz.title}</h1>
        <div className={styles.quizProgress}>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        <Button onClick={onBackToGeneration} variant="secondary" size="small">
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
            <Button onClick={onBackToGeneration} variant="secondary">
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

export default QuizPlayground; 