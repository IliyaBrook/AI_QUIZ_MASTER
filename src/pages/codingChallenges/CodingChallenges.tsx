import React, { Suspense } from 'react';
import { LoadingSpinner } from '@/components';
import { useChallengeNavigation, renderChallengeScreen } from '@/services';
import ChallengeGeneration from './ChallengeGeneration/challengeGeneration';
import ChallengePreview from './ChallengePreview/challengePreview';
import ChallengePlayground from './ChallengePlayground/challengePlayground';
import styles from './CodingChallenges.module.scss';

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
