import React from 'react';
import { LoadingSpinner, Input, Select, Button } from '@/components';
import { languageNames, useQuizGeneration } from '@/services';
import type { TLang, IQuizWithWrapper } from '@/types';
import styles from './quizGeneration.module.scss';

interface QuizGenerationProps {
  onQuizGenerated: (quizData: IQuizWithWrapper) => void;
}

const QuizGeneration: React.FC<QuizGenerationProps> = ({ onQuizGenerated }) => {
  const {
    topic,
    language,
    isLoading,
    error,
    setTopic,
    setLanguage,
    handleGenerateQuiz,
  } = useQuizGeneration();

  const onGenerateClick = async () => {
    const quizData = await handleGenerateQuiz();
    if (quizData) {
      onQuizGenerated(quizData);
    }
  };

  return (
    <div className={styles.quizGeneration}>
      {isLoading ? (
        <LoadingSpinner message='Generating quiz...' />
      ) : (
        <>
          <Input
            label='Quiz Topic'
            id='topicInput'
            value={topic}
            onChange={setTopic}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && topic.trim() && !isLoading) {
                onGenerateClick();
              }
            }}
            placeholder='e.g., Ancient Egypt History'
            disabled={isLoading}
          />

          <Select
            label='Language'
            id='languageSelect'
            value={language}
            options={Object.entries(languageNames).map(([key, name]) => ({
              value: key,
              label: name,
            }))}
            onChange={(value) => setLanguage(value as TLang)}
            disabled={isLoading}
          />

          <Button
            onClick={onGenerateClick}
            disabled={isLoading || !topic.trim()}
            variant='primary'
          >
            Generate Quiz
          </Button>

          {error && <div className={styles.errorMessage}>{error}</div>}
        </>
      )}
    </div>
  );
};

export default QuizGeneration;
