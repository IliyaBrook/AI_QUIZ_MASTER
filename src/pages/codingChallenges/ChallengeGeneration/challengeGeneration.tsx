import React, { useCallback } from 'react';

import { Button, Input, LoadingSpinner, Select } from '@/components';
import { DIFFICULTY_NAMES, PROGRAMMING_LANGUAGE_NAMES } from '@/data';
import { languageNames, useChallengeGeneration } from '@/services';
import type {
  ICodingChallengeWithWrapper,
  TDifficulty,
  TLang,
  TProgrammingLanguage,
} from '@/types';

import styles from './challengeGeneration.module.scss';

interface ChallengeGenerationProps {
  onChallengeGenerated: (challengeData: ICodingChallengeWithWrapper) => void;
}

const ChallengeGeneration: React.FC<ChallengeGenerationProps> = ({
  onChallengeGenerated,
}) => {
  const {
    topic,
    language,
    programmingLanguage,
    difficulty,
    isLoading,
    error,
    setTopic,
    setLanguage,
    setProgrammingLanguage,
    setDifficulty,
    handleGenerateChallenge: generateChallenge,
  } = useChallengeGeneration();

  const handleGenerateChallenge = useCallback(async () => {
    const challengeData = await generateChallenge();
    if (challengeData) {
      onChallengeGenerated(challengeData);
    }
  }, [generateChallenge, onChallengeGenerated]);

  return (
    <div className={styles.challengeGeneration}>
      {isLoading ? (
        <LoadingSpinner message='Generating coding challenge...' />
      ) : (
        <>
          <Input
            label='Challenge Topic'
            id='topicInput'
            value={topic}
            onChange={setTopic}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && topic.trim() && !isLoading) {
                handleGenerateChallenge();
              }
            }}
            placeholder='e.g., Array Manipulation, Binary Search'
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

          <Select
            label='Programming Language'
            id='programmingLanguageSelect'
            value={programmingLanguage}
            options={Object.entries(PROGRAMMING_LANGUAGE_NAMES).map(
              ([key, name]) => ({
                value: key,
                label: name,
              })
            )}
            onChange={(value) =>
              setProgrammingLanguage(value as TProgrammingLanguage)
            }
            disabled={isLoading}
          />

          <Select
            label='Difficulty'
            id='difficultySelect'
            value={difficulty}
            options={Object.entries(DIFFICULTY_NAMES).map(([key, name]) => ({
              value: key,
              label: name,
            }))}
            onChange={(value) => setDifficulty(value as TDifficulty)}
            disabled={isLoading}
          />

          <Button
            onClick={handleGenerateChallenge}
            disabled={isLoading || !topic.trim()}
            variant='primary'
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
