import { useCallback, useState } from 'react';

import { isTestCodeChallangeGen as isTest } from '@/constants';
import { useChallengePlaygroundData as testData } from '@/data';
import type { ICodingChallengeWithWrapper } from '@/types';

export type ChallengeScreen = 'generation' | 'preview' | 'playground';

export const useChallengeNavigation = () => {
  const defaultRoute = isTest ? 'playground' : 'generation';

  const [currentScreen, setCurrentScreen] =
    useState<ChallengeScreen>(defaultRoute);
  const [challengeData, setChallengeData] =
    useState<ICodingChallengeWithWrapper | null>(isTest ? testData : null);

  const handleChallengeGenerated = useCallback(
    (generatedChallengeData: ICodingChallengeWithWrapper) => {
      setChallengeData(generatedChallengeData);
      setCurrentScreen('preview');
    },
    []
  );

  const handleStartChallenge = useCallback(() => {
    setCurrentScreen('playground');
  }, []);

  const handleBackToGeneration = useCallback(() => {
    setChallengeData(null);
    setCurrentScreen('generation');
  }, []);

  console.log('challengeData', challengeData);

  return {
    currentScreen,
    challengeData,
    handleChallengeGenerated,
    handleStartChallenge,
    handleBackToGeneration,
  };
};
