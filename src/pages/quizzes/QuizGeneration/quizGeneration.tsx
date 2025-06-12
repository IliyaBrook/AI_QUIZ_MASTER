import React from 'react';
import { LoadingSpinner, Input, Select, Button } from '@/components';
import { languageNames } from '@/services';
import type { TLang } from '@/services';
import styles from './quizGeneration.module.scss';

interface QuizGenerationProps {
  topic: string;
  language: TLang;
  isLoading: boolean;
  error: string | null;
  onTopicChange: (topic: string) => void;
  onLanguageChange: (language: TLang) => void;
  onGenerateQuiz: () => void;
}

const QuizGeneration: React.FC<QuizGenerationProps> = ({
  topic,
  language,
  isLoading,
  error,
  onTopicChange,
  onLanguageChange,
  onGenerateQuiz
}) => {
  return (
    <div className={styles.quizGeneration}>
      {isLoading ? (
        <LoadingSpinner message='Generating quiz...' />
      ) : (
        <>
          <Input
            label="Quiz Topic"
            id="topicInput"
            value={topic}
            onChange={onTopicChange}
            onKeyDown={e => {
              if (e.key === 'Enter' && topic.trim() && !isLoading) {
                onGenerateQuiz();
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
            onChange={value => onLanguageChange(value as TLang)}
            disabled={isLoading}
          />

          <Button
            onClick={onGenerateQuiz}
            disabled={isLoading || !topic.trim()}
            variant="primary"
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