import { useState, useCallback } from 'react';
import type { ICodingChallengeWithWrapper } from '@/types';

export type ChallengeScreen = 'generation' | 'preview' | 'playground';

export const useChallengeNavigation = () => {
  const [currentScreen, setCurrentScreen] = useState<ChallengeScreen>('generation');
  const [challengeData, setChallengeData] = useState<ICodingChallengeWithWrapper | null>(null);

  const handleChallengeGenerated = useCallback((generatedChallengeData: ICodingChallengeWithWrapper) => {
    setChallengeData(generatedChallengeData);
    setCurrentScreen('preview');
  }, []);

  const handleStartChallenge = useCallback(() => {
    setCurrentScreen('playground');
  }, []);

  const handleBackToGeneration = useCallback(() => {
    setChallengeData(null);
    setCurrentScreen('generation');
  }, []);

  return {
    currentScreen,
    challengeData,
    handleChallengeGenerated,
    handleStartChallenge,
    handleBackToGeneration
  };
}; 