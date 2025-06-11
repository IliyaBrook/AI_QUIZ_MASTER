import React, { useState, useCallback, Suspense } from 'react';
import { generateQuiz, languageNames, modelNames } from '@/services';
import type { TLang, TModelType } from '@/services';
import type { IQuizWithWrapper, IAnswerOption } from '@/types';
import { DEFAULT_LANGUAGE, DEFAULT_MODEL } from '@/constants';
import { LoadingSpinner } from '@/components';
import './InteractiveQuiz.scss';

const InteractiveQuiz: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [language, setLanguage] = useState<TLang>(DEFAULT_LANGUAGE);
  const [modelType, setModelType] = useState<TModelType>(DEFAULT_MODEL);
  const [quizData, setQuizData] = useState<IQuizWithWrapper | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<IAnswerOption | null>(null);
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
      const { quizData: newQuizData } = await generateQuiz(topic, language, modelType);
      setQuizData(newQuizData);
    } catch (e) {
      console.error('Error generating quiz:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Quiz generation error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [topic, language, modelType, isLoading]);

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
      <div className="quiz-container">
        <h1>AI Quiz Master</h1>
        
        {!quizData ? (
          <div className="quiz-generation">
            {isLoading ? (
              <LoadingSpinner message="Generating quiz..." />
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="topicInput">Quiz Topic:</label>
                  <input
                    type="text"
                    id="topicInput"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && topic.trim() && !isLoading) {
                        handleGenerateQuiz();
                      }
                    }}
                    placeholder="e.g., Ancient Egypt History"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="languageSelect">Language:</label>
                  <select
                    id="languageSelect"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as TLang)}
                    disabled={isLoading}
                  >
                    {Object.entries(languageNames).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="modelSelect">Model:</label>
                  <select
                    id="modelSelect"
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value as TModelType)}
                    disabled={isLoading}
                  >
                    {Object.entries(modelNames).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </div>
                
                <button 
                  onClick={handleGenerateQuiz} 
                  disabled={isLoading || !topic.trim()}
                  className="generate-button"
                >
                  Generate Quiz
                </button>
                
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="quiz-preview">
            <h2>{quizData.quiz.title}</h2>
            <p>Language: {languageNames[quizData.quiz.language as TLang]}</p>
            <p>Number of questions: {quizData.quiz.questions.length}</p>
            
            <div className="quiz-actions">
              <button onClick={handleStartQuiz} className="start-button">
                Start Quiz
              </button>
              <button onClick={handleBackToGeneration} className="back-button">
                Create New Quiz
              </button>
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
      <div className="quiz-container">
        <div className="error-message">Error: Question not found.</div>
        <button onClick={handleBackToGeneration}>Back to Quiz Creation</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>{quizData.quiz.title}</h1>
        <div className="quiz-progress">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        <button onClick={handleBackToGeneration} className="back-to-generation">
          ← New Quiz
        </button>
      </div>

      {quizCompleted ? (
        <div className="quiz-results">
          <h2>Quiz Results</h2>
          <div className="score-display">
            <span className="score">{score}</span>
            <span className="separator">/</span>
            <span className="total">{totalQuestions}</span>
          </div>
          <p className="score-percentage">
            {Math.round((score / totalQuestions) * 100)}% correct answers
          </p>
          
          <div className="results-actions">
            <button onClick={handleRestartQuiz} className="restart-button">
              Retry Quiz
            </button>
            <button onClick={handleBackToGeneration} className="new-quiz-button">
              Create New Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="question-container">
          <h2 className="question-text">{currentQuestion.question}</h2>
          
          <div className="answer-options">
            {currentQuestion.answer_options.map((option, index) => (
              <button
                key={index}
                className={`answer-option ${
                  selectedAnswer === option ? 'selected' : ''
                } ${
                  showRationale && option.is_correct ? 'correct' : ''
                } ${
                  showRationale && selectedAnswer === option && !option.is_correct ? 'incorrect' : ''
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={showRationale}
              >
                {option.text}
              </button>
            ))}
          </div>

          {showRationale && selectedAnswer && (
            <div className={`rationale ${selectedAnswer.is_correct ? 'correct-rationale' : 'incorrect-rationale'}`}>
              <p>{selectedAnswer.rationale}</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="question-actions">
            {!showRationale ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="submit-button"
              >
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNextQuestion} className="next-button">
                {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const InteractiveQuizWithSuspense: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <InteractiveQuiz />
  </Suspense>
);

export default InteractiveQuizWithSuspense;