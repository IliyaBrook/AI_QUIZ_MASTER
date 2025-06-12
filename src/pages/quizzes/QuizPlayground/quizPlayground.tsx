import React from 'react';
import { Button } from '@/components';
import type { IQuizWithWrapper, IAnswerOption } from '@/types';
import styles from './quizPlayground.module.scss';

interface QuizPlaygroundProps {
  quizData: IQuizWithWrapper;
  currentQuestionIndex: number;
  score: number;
  selectedAnswer: IAnswerOption | null;
  showRationale: boolean;
  quizCompleted: boolean;
  error: string | null;
  onAnswerSelect: (option: IAnswerOption) => void;
  onSubmitAnswer: () => void;
  onNextQuestion: () => void;
  onRestartQuiz: () => void;
  onBackToGeneration: () => void;
}

const QuizPlayground: React.FC<QuizPlaygroundProps> = ({
  quizData,
  currentQuestionIndex,
  score,
  selectedAnswer,
  showRationale,
  quizCompleted,
  error,
  onAnswerSelect,
  onSubmitAnswer,
  onNextQuestion,
  onRestartQuiz,
  onBackToGeneration
}) => {
  const currentQuestion = quizData.quiz.questions[currentQuestionIndex];
  const totalQuestions = quizData.quiz.questions.length;

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
            <Button onClick={onRestartQuiz} variant="info">
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
                onClick={() => onAnswerSelect(option)}
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
                onClick={onSubmitAnswer}
                disabled={selectedAnswer === null}
                variant="primary"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={onNextQuestion} variant="success">
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