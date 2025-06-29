import React, { Suspense } from 'react';

import { LoadingSpinner } from '@/components';
import { renderChallengeScreen, useChallengeNavigation } from '@/services';

import ChallengeGeneration from './ChallengeGeneration/challengeGeneration';
import ChallengePlayground from './ChallengePlayground/challengePlayground';
import ChallengePreview from './ChallengePreview/challengePreview';
import styles from './codingChallenges.module.scss';

const RenderCodingChallenges: React.FC = () => {
  const {
    currentScreen,
    challengeData,
    handleChallengeGenerated,
    handleStartChallenge,
    handleBackToGeneration,
  } = useChallengeNavigation();

  const components = {
    ChallengeGeneration,
    ChallengePreview,
    ChallengePlayground,
  };

  const handlers = {
    handleChallengeGenerated,
    handleStartChallenge,
    handleBackToGeneration,
  };

  return (
    <div className={styles.challengeContainer}>
      <h1>AI Coding Challenge</h1>
      {renderChallengeScreen({
        currentScreen,
        challengeData,
        components,
        handlers,
      })}
    </div>
  );
};

export const CodingChallenges: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <RenderCodingChallenges />
  </Suspense>
);
