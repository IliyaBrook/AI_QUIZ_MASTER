import { useCallback, useState } from 'react';

import { isTestCodeChallangeGen as isTest } from '@/constants';
import { useChallengePlaygroundData as testData } from '@/data';
import type { ChallengeScreen, ICodingChallengeWithWrapper } from '@/types';
import { setStyleAttributeByRoute } from '@/utils/setStyleAttributeByRoute';

export const useChallengeNavigation = () => {
  const defaultRoute = isTest
    ? 'coding-challenges-playground'
    : 'coding-challenges-generation';

  const [currentScreen, setCurrentScreen] =
    useState<ChallengeScreen>(defaultRoute);
  const [challengeData, setChallengeData] =
    useState<ICodingChallengeWithWrapper | null>(isTest ? testData : null);

  const handleChallengeGenerated = useCallback(
    (generatedChallengeData: ICodingChallengeWithWrapper) => {
      setChallengeData(generatedChallengeData);
      setCurrentScreen('coding-challenges-preview');
      setStyleAttributeByRoute('coding-challenges-preview');
    },
    []
  );

  const handleStartChallenge = useCallback(() => {
    setCurrentScreen('coding-challenges-playground');
    setStyleAttributeByRoute('coding-challenges-playground');
  }, []);

  const handleBackToGeneration = useCallback(() => {
    setChallengeData(null);
    setCurrentScreen('coding-challenges-generation');
    setStyleAttributeByRoute('coding-challenges-generation');
  }, []);

  return {
    currentScreen,
    challengeData,
    handleChallengeGenerated,
    handleStartChallenge,
    handleBackToGeneration,
  };
};
