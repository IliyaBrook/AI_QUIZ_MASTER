import React, { useState, useCallback } from 'react';
import { LoadingSpinner, Input, Select, Button } from '@/components';
import { languageNames, generateQuiz } from '@/services';
import type { TLang } from '@/services';
import type { IQuizWithWrapper } from '@/types';
import { DEFAULT_LANGUAGE } from '@/constants';
import styles from './quizGeneration.module.scss';

interface QuizGenerationProps {
  onQuizGenerated: (quizData: IQuizWithWrapper) => void;
}

const QuizGeneration: React.FC<QuizGenerationProps> = ({
  onQuizGenerated
}) => {
  const [topic, setTopic] = useState<string>('');
  const [language, setLanguage] = useState<TLang>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      const { quizData } = await generateQuiz(topic, language);
      onQuizGenerated(quizData);
    } catch (e) {
      console.error('Error generating quiz:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Quiz generation error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [topic, language, isLoading, onQuizGenerated]);

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
  );
};

export default QuizGeneration; 