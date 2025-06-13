import React from 'react';

import { Button } from '@/components';
import { useQuizPlayground } from '@/services';
import type { IQuizWithWrapper } from '@/types';

import styles from './quizPlayground.module.scss';

interface QuizPlaygroundProps {
  quizData: IQuizWithWrapper;
  onBackToGeneration: () => void;
}

const QuizPlayground: React.FC<QuizPlaygroundProps> = ({
  quizData,
  onBackToGeneration,
}) => {
  const {
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
  } = useQuizPlayground(quizData);

  if (!currentQuestion) {
    return (
      <div className={styles.errorFallback}>
        <div className={styles.errorMessage}>Error: Question not found.</div>
        <Button
          onClick={onBackToGeneration}
          variant='secondary'
        >
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
        <Button
          onClick={onBackToGeneration}
          variant='secondary'
          size='small'
        >
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
            <Button
              onClick={handleRestartQuiz}
              variant='info'
            >
              Retry Quiz
            </Button>
            <Button
              onClick={onBackToGeneration}
              variant='secondary'
            >
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
              <p>
                <strong>
                  {selectedAnswer.is_correct ? 'Correct!' : 'Incorrect!'}
                </strong>
              </p>
              {selectedAnswer.rationale && selectedAnswer.rationale.trim() && (
                <p>{selectedAnswer.rationale}</p>
              )}
              {!selectedAnswer.is_correct &&
                (() => {
                  const correctOption = currentQuestion.answer_options.find(
                    (option) => option.is_correct
                  );
                  return correctOption?.rationale &&
                    correctOption.rationale.trim() ? (
                    <div
                      style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #ddd',
                      }}
                    >
                      <p>
                        <strong>Correct answer:</strong>
                      </p>
                      <p>{correctOption.rationale}</p>
                    </div>
                  ) : null;
                })()}
            </div>
          )}

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.questionActions}>
            {!showRationale ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                variant='primary'
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                variant='success'
              >
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
