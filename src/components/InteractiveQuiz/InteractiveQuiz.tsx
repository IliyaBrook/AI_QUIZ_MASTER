import React, { useState, useEffect } from 'react';
import type { ImmersiveQuizFormat, Question, AnswerOption } from '../../types/quiz.types'; // Убедитесь, что путь правильный

interface InteractiveQuizProps {
  quizJson: ImmersiveQuizFormat; // Ваш JSON-объект викторины
}

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ quizJson }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowRationale(false);
    setQuizCompleted(false);
  }, [quizJson]);

  if (!quizJson || !quizJson.quiz || !quizJson.quiz.questions || quizJson.quiz.questions.length === 0) {
    return <div className="quiz-container">Ошибка: Данные викторины недействительны или пусты.</div>;
  }

  const quiz = quizJson.quiz;
  const currentQuestion: Question | undefined = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleAnswerSelect = (option: AnswerOption) => {
    if (!showRationale) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      alert('Пожалуйста, выберите вариант ответа!');
      return;
    }
    setShowRationale(true);
    if (selectedAnswer.is_correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowRationale(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowRationale(false);
    setQuizCompleted(false);
  };

  if (!currentQuestion) {
    return <div className="quiz-container">Ошибка: Текущий вопрос не найден.</div>;
  }

  return (
    <div className="quiz-container">
      <h1 id="quiz-title">{quiz.title}</h1>

      {quizCompleted ? (
        <div id="quiz-results">
          <h2>Ваши результаты</h2>
          <p>Вы набрали <span id="score">{score}</span> из <span id="total-questions">{totalQuestions}</span>.</p>
          <button onClick={handleRestartQuiz}>Начать заново</button>
        </div>
      ) : (
        <div id="question-container">
          <h2 id="question-text">{currentQuestion.question}</h2>
          <div id="answer-options">
            {currentQuestion.answer_options?.map((option, index) => (
              <div
                key={index}
                className={`answer-option ${selectedAnswer === option ? 'selected' : ''} ${showRationale && option.is_correct ? 'correct' : ''} ${showRationale && selectedAnswer === option && !option.is_correct ? 'incorrect' : ''}`}
                onClick={() => handleAnswerSelect(option)}
                style={{ pointerEvents: showRationale ? 'none' : 'auto' }} // Отключаем клики после проверки
              >
                {option.text}
              </div>
            ))}
          </div>

          {showRationale && selectedAnswer && (
            <p id="rationale-text" className={selectedAnswer.is_correct ? 'correct-rationale' : 'incorrect-rationale'}>
              {selectedAnswer.rationale}
            </p>
          )}

          {!showRationale ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              Ответить
            </button>
          ) : (
            <button onClick={handleNextQuestion}>
              {currentQuestionIndex < totalQuestions - 1 ? 'Следующий вопрос' : 'Завершить викторину'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InteractiveQuiz;