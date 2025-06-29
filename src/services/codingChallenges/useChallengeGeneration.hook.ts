import { useCallback, useState } from 'react';

import {
  DEFAULT_DIFFICULTY,
  DEFAULT_LANGUAGE,
  DEFAULT_PROGRAMMING_LANGUAGE,
} from '@/constants';
import type { TDifficulty, TLang, TProgrammingLanguage } from '@/types';

import { generateCodingChallenge } from '../AI/aiCodingChallengesGen.service';

export const useChallengeGeneration = () => {
  const [topic, setTopic] = useState<string>('');
  const [language, setLanguage] = useState<TLang>(DEFAULT_LANGUAGE);
  const [programmingLanguage, setProgrammingLanguage] =
    useState<TProgrammingLanguage>(DEFAULT_PROGRAMMING_LANGUAGE);
  const [difficulty, setDifficulty] = useState<TDifficulty>(DEFAULT_DIFFICULTY);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateChallenge = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a challenge topic.');
      return null;
    }

    if (isLoading) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { challengeData } = await generateCodingChallenge(
        topic,
        language,
        programmingLanguage,
        difficulty
      );
      return challengeData;
    } catch (e) {
      console.error('Error generating challenge:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Challenge generation error: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [topic, language, programmingLanguage, difficulty, isLoading]);

  const resetForm = useCallback(() => {
    setTopic('');
    setLanguage(DEFAULT_LANGUAGE);
    setProgrammingLanguage(DEFAULT_PROGRAMMING_LANGUAGE);
    setDifficulty(DEFAULT_DIFFICULTY);
    setError(null);
  }, []);

  return {
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
    handleGenerateChallenge,
    resetForm,
  };
};
