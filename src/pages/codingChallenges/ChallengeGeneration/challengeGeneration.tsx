import React, { useState, useCallback } from 'react';
import { LoadingSpinner, Input, Select, Button } from '@/components';
import { languageNames, generateCodingChallenge } from '@/services';
import type { TLang, TProgrammingLanguage, ICodingChallengeWithWrapper } from '@/types';
import { DEFAULT_LANGUAGE, PROGRAMMING_LANGUAGE_NAMES, DEFAULT_PROGRAMMING_LANGUAGE } from '@/constants';
import styles from './challengeGeneration.module.scss';

interface ChallengeGenerationProps {
  onChallengeGenerated: (challengeData: ICodingChallengeWithWrapper) => void;
}

const ChallengeGeneration: React.FC<ChallengeGenerationProps> = ({
  onChallengeGenerated
}) => {
  const [topic, setTopic] = useState<string>('');
  const [language, setLanguage] = useState<TLang>(DEFAULT_LANGUAGE);
  const [programmingLanguage, setProgrammingLanguage] = useState<TProgrammingLanguage>(DEFAULT_PROGRAMMING_LANGUAGE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateChallenge = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a challenge topic.');
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { challengeData } = await generateCodingChallenge(topic, language, programmingLanguage);
      onChallengeGenerated(challengeData);
    } catch (e) {
      console.error('Error generating challenge:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Challenge generation error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [topic, language, programmingLanguage, isLoading, onChallengeGenerated]);

  return (
    <div className={styles.challengeGeneration}>
      {isLoading ? (
        <LoadingSpinner message='Generating coding challenge...' />
      ) : (
        <>
          <Input
            label="Challenge Topic"
            id="topicInput"
            value={topic}
            onChange={setTopic}
            onKeyDown={e => {
              if (e.key === 'Enter' && topic.trim() && !isLoading) {
                handleGenerateChallenge();
              }
            }}
            placeholder="e.g., Array Manipulation, Binary Search"
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

          <Select
            label="Programming Language"
            id="programmingLanguageSelect"
            value={programmingLanguage}
            options={Object.entries(PROGRAMMING_LANGUAGE_NAMES).map(([key, name]) => ({
              value: key,
              label: name
            }))}
            onChange={value => setProgrammingLanguage(value as TProgrammingLanguage)}
            disabled={isLoading}
          />

          <Button
            onClick={handleGenerateChallenge}
            disabled={isLoading || !topic.trim()}
            variant="primary"
          >
            Generate Challenge
          </Button>

          {error && <div className={styles.errorMessage}>{error}</div>}
        </>
      )}
    </div>
  );
};

export default ChallengeGeneration; 