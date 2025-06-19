import React from 'react';

import type { ChallengeScreen, ICodingChallengeWithWrapper } from '@/types';

interface ChallengeComponents {
  ChallengeGeneration: React.ComponentType<{
    onChallengeGenerated: (challengeData: ICodingChallengeWithWrapper) => void;
  }>;
  ChallengePreview: React.ComponentType<{
    challengeData: ICodingChallengeWithWrapper;
    onStartChallenge: () => void;
    onBackToGeneration: () => void;
  }>;
  ChallengePlayground: React.ComponentType<{
    challengeData: ICodingChallengeWithWrapper;
    onBackToGeneration: () => void;
  }>;
}

interface RenderScreenParams {
  currentScreen: ChallengeScreen;
  challengeData: ICodingChallengeWithWrapper | null;
  components: ChallengeComponents;
  handlers: {
    handleChallengeGenerated: (
      challengeData: ICodingChallengeWithWrapper
    ) => void;
    handleStartChallenge: () => void;
    handleBackToGeneration: () => void;
  };
}

export const renderChallengeScreen = ({
  currentScreen,
  challengeData,
  components,
  handlers,
}: RenderScreenParams): React.ReactElement | null => {
  const { ChallengeGeneration, ChallengePreview, ChallengePlayground } =
    components;
  const {
    handleChallengeGenerated,
    handleStartChallenge,
    handleBackToGeneration,
  } = handlers;

  switch (currentScreen) {
    case 'coding-challenges-generation':
      return React.createElement(ChallengeGeneration, {
        onChallengeGenerated: handleChallengeGenerated,
      });
    case 'coding-challenges-preview':
      return challengeData
        ? React.createElement(ChallengePreview, {
            challengeData,
            onStartChallenge: handleStartChallenge,
            onBackToGeneration: handleBackToGeneration,
          })
        : null;
    case 'coding-challenges-playground':
      return challengeData
        ? React.createElement(ChallengePlayground, {
            challengeData,
            onBackToGeneration: handleBackToGeneration,
          })
        : null;
    default:
      return null;
  }
};
