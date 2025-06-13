import { useCallback, useState } from 'react';

import { DEFAULT_LANGUAGE } from '@/constants';
import type { TLang } from '@/types';

import { generateQuiz } from './quizGenerator.service';

export const useQuizGeneration = () => {
  const [topic, setTopic] = useState<string>('');
  const [language, setLanguage] = useState<TLang>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a quiz topic.');
      return null;
    }

    if (isLoading) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { quizData } = await generateQuiz(topic, language);
      return quizData;
    } catch (e) {
      console.error('Error generating quiz:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Quiz generation error: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [topic, language, isLoading]);

  const resetForm = useCallback(() => {
    setTopic('');
    setLanguage(DEFAULT_LANGUAGE);
    setError(null);
  }, []);

  return {
    topic,
    language,
    isLoading,
    error,
    setTopic,
    setLanguage,
    handleGenerateQuiz,
    resetForm,
  };
};
