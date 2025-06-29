import React from 'react';

import { Button } from '@/components';
import { PROGRAMMING_LANGUAGE_NAMES } from '@/data';
import { languageNames } from '@/services';
import type { ICodingChallengeWithWrapper, TLang } from '@/types';

import styles from './challengePreview.module.scss';

interface ChallengePreviewProps {
  challengeData: ICodingChallengeWithWrapper;
  onStartChallenge: () => void;
  onBackToGeneration: () => void;
}

const ChallengePreview: React.FC<ChallengePreviewProps> = ({
  challengeData,
  onStartChallenge,
  onBackToGeneration,
}) => {
  const challenge = challengeData.challenge;

  return (
    <div className={styles.challengePreview}>
      <h2>{challenge.title}</h2>
      <div className={styles.challengeMeta}>
        <p>Language: {languageNames[challenge.language as TLang]}</p>
        <p>
          Programming Language:
          {PROGRAMMING_LANGUAGE_NAMES[challenge.programmingLanguage]}
        </p>
        <p>
          Difficulty:
          <span
            className={`${styles.difficulty} ${styles[challenge.difficulty]}`}
          >
            {challenge.difficulty}
          </span>
        </p>
      </div>
      <div className={styles.challengeDescription}>
        <p>{challenge.description}</p>
      </div>

      <div className={styles.challengeActions}>
        <Button
          onClick={onStartChallenge}
          variant='primary'
        >
          Start Challenge
        </Button>
        <Button
          onClick={onBackToGeneration}
          variant='secondary'
        >
          Create New Challenge
        </Button>
      </div>
    </div>
  );
};

export default ChallengePreview;
