import React from 'react';

import { Button, CodeEditor } from '@/components';
import { isTestCodeChallangeGen as isTest } from '@/constants';
import { useChallengePlaygroundData as testData } from '@/data';
import { useChallengePlayground } from '@/services';
import type { ICodingChallengeWithWrapper } from '@/types';

import Header from '../header/header';
import styles from './challengePlayground.module.scss';

interface ChallengePlaygroundProps {
  challengeData: ICodingChallengeWithWrapper;
  onBackToGeneration: () => void;
}

const ChallengePlayground: React.FC<ChallengePlaygroundProps> = ({
  challengeData,
  onBackToGeneration,
}) => {
  const {
    showSolution,
    showHints,
    executionResult,
    error,
    userCode,
    handleCodeChange,
    handleToggleSolution,
    handleToggleHints,
    handleRunCode,
    formatExecutionResult,
    ...rest
  } = useChallengePlayground(challengeData);

  const challenge = isTest ? testData.challenge : rest.challenge;
  const isRunning = isTest ? false : rest.isRunning;

  if (isTest) {
    console.log('user code:', userCode);
    console.log('challenge:', challenge);
    console.log('executionResult:', executionResult);
    console.log('isRunning:', isRunning);
    console.log('error:', error);
    console.log('showSolution:', showSolution);
    console.log('showHints:', showHints);
  }

  return (
    <div className={styles.challengePlayground}>
      <Header
        challenge={challenge}
        onBackToGeneration={onBackToGeneration}
      />

      <div className={styles.challengeContent}>
        <div className={styles.challengeDescription}>
          <h3>Description</h3>
          <p>{challenge.description}</p>
        </div>

        <div className={styles.codeSection}>
          <div className={styles.codeHeader}>
            <h3>Your Solution</h3>
            <div className={styles.codeActions}>
              <Button
                onClick={handleRunCode}
                disabled={isRunning}
                variant='info'
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              {challenge.hints && challenge.hints.length > 0 && (
                <Button
                  onClick={handleToggleHints}
                  variant='success'
                >
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </Button>
              )}
              <Button
                onClick={handleToggleSolution}
                variant='warning'
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </Button>
            </div>
          </div>

          {showHints && challenge.hints && (
            <div className={styles.hints}>
              <h4>Hints</h4>
              <ul>
                {challenge.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}

          <CodeEditor
            value={userCode}
            onChange={handleCodeChange}
            language={challenge.programmingLanguage}
            height='400px'
          />

          {executionResult && (
            <div className={styles.executionResult}>
              <h4>Execution Result</h4>
              <pre className={styles.resultOutput}>
                {formatExecutionResult(executionResult)}
              </pre>
            </div>
          )}

          {showSolution && (
            <div className={styles.solution}>
              <h4>Solution</h4>
              <CodeEditor
                value={challenge.solution}
                onChange={() => {}}
                language={challenge.programmingLanguage}
                height='300px'
                readOnly={true}
              />
            </div>
          )}
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default ChallengePlayground;
