import React from 'react';

import { Button } from '@/components';
import { PROGRAMMING_LANGUAGE_NAMES } from '@/data';
import type { ICodingChallenge } from '@/types';

import styles from './header.module.scss';

interface HeaderProps {
  challenge: ICodingChallenge;
  onBackToGeneration: () => void;
}

const Header: React.FC<HeaderProps> = ({ challenge, onBackToGeneration }) => {
  return (
    <div className={styles.challengeHeader}>
      <h1>{challenge.title}</h1>
      <div className={styles.challengeMeta}>
        <span
          className={`${styles.difficulty} ${styles[challenge.difficulty]}`}
        >
          {challenge.difficulty}
        </span>
        <span className={styles.programmingLanguage}>
          {PROGRAMMING_LANGUAGE_NAMES[challenge.programmingLanguage]}
        </span>
      </div>
      <Button
        onClick={onBackToGeneration}
        variant='secondary'
        size='small'
      >
        ← New Challenge
      </Button>
    </div>
  );
};

export default Header;
