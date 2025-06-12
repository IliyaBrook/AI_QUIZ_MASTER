import React, { useState, useCallback } from 'react';
import { CodeEditor, Button } from '@/components';
import { executeCode, formatExecutionResult, type CodeExecutionResult } from '@/services';
import type { ICodingChallengeWithWrapper } from '@/types';
import Header from '../header/header';
import styles from './challengePlayground.module.scss';

interface ChallengePlaygroundProps {
  challengeData: ICodingChallengeWithWrapper;
  onBackToGeneration: () => void;
}

const ChallengePlayground: React.FC<ChallengePlaygroundProps> = ({
  challengeData,
  onBackToGeneration
}) => {
  const [userCode, setUserCode] = useState<string>(challengeData.challenge.initialCode || '');
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const challenge = challengeData.challenge;

  const handleCodeChange = useCallback((value: string | undefined) => {
    setUserCode(value || '');
  }, []);

  const handleToggleSolution = useCallback(() => {
    setShowSolution(!showSolution);
  }, [showSolution]);

  const handleToggleHints = useCallback(() => {
    setShowHints(!showHints);
  }, [showHints]);

  const handleRunCode = useCallback(async () => {
    if (!userCode.trim()) {
      setError('Please write some code to run.');
      return;
    }

    if (!challenge.programmingLanguage) {
      setError('Programming language not specified.');
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      const result = await executeCode(userCode, challenge.programmingLanguage);
      setExecutionResult(result);
      
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch (e) {
      setError(`Execution failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsRunning(false);
    }
  }, [userCode, challenge.programmingLanguage]);

  return (
    <div className={styles.challengePlayground}>
      <Header challenge={challenge} onBackToGeneration={onBackToGeneration} />

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
                variant="info"
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              {challenge.hints && challenge.hints.length > 0 && (
                <Button onClick={handleToggleHints} variant="success">
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </Button>
              )}
              <Button onClick={handleToggleSolution} variant="warning">
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