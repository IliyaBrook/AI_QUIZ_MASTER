import React from 'react';

import { Button } from '@/components';
import { languageNames } from '@/services';
import type { IQuizWithWrapper, TLang } from '@/types';

import styles from './quizPreview.module.scss';

interface QuizPreviewProps {
  quizData: IQuizWithWrapper;
  onStartQuiz: () => void;
  onBackToGeneration: () => void;
}

const QuizPreview: React.FC<QuizPreviewProps> = ({
  quizData,
  onStartQuiz,
  onBackToGeneration,
}) => {
  return (
    <div className={styles.quizPreview}>
      <h2>{quizData.quiz.title}</h2>
      <p>Language: {languageNames[quizData.quiz.language as TLang]}</p>
      <p>Number of questions: {quizData.quiz.questions.length}</p>

      <div className={styles.quizActions}>
        <Button onClick={onStartQuiz} variant='primary'>
          Start Quiz
        </Button>
        <Button onClick={onBackToGeneration} variant='secondary'>
          Create New Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizPreview;
