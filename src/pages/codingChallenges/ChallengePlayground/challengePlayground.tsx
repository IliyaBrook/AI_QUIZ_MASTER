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
    codeAnalysis,
    isAnalyzing,
    showAnalysis,
    handleCodeChange,
    handleToggleSolution,
    handleToggleHints,
    handleRunCode,
    handleAnalyzeCode,
    handleToggleAnalysis,
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
                size='small'
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              <Button
                onClick={handleAnalyzeCode}
                disabled={isAnalyzing}
                variant='primary'
                size='small'
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
              </Button>
              {challenge.hints && challenge.hints.length > 0 && (
                <Button
                  onClick={handleToggleHints}
                  variant='success'
                  size='small'
                >
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </Button>
              )}
              <Button
                onClick={handleToggleSolution}
                variant='warning'
                size='small'
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
            key='user-code'
            path={`user-code.${challenge.programmingLanguage === 'typescript' ? 'ts' : 'py'}`}
          />

          {executionResult && (
            <div className={styles.executionResult}>
              <h4>Execution Result</h4>
              <pre className={styles.resultOutput}>
                {formatExecutionResult(executionResult)}
              </pre>
            </div>
          )}

          {showAnalysis && codeAnalysis && (
            <div className={styles.codeAnalysis}>
              <div className={styles.analysisHeader}>
                <h4>Code Analysis</h4>
                <Button
                  onClick={handleToggleAnalysis}
                  variant='secondary'
                  size='small'
                >
                  Hide Analysis
                </Button>
              </div>

              {codeAnalysis.analysis.errors.length > 0 && (
                <div className={styles.analysisSection}>
                  <h5>Issues Found</h5>
                  <ul>
                    {codeAnalysis.analysis.errors.map((error, index) => (
                      <li
                        key={index}
                        className={styles.errorItem}
                      >
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {codeAnalysis.analysis.suggestions.length > 0 && (
                <div className={styles.analysisSection}>
                  <h5>Suggestions</h5>
                  <ul>
                    {codeAnalysis.analysis.suggestions.map(
                      (suggestion, index) => (
                        <li
                          key={index}
                          className={styles.suggestionItem}
                        >
                          {suggestion}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {codeAnalysis.analysis.improvements.length > 0 && (
                <div className={styles.analysisSection}>
                  <h5>Improvements</h5>
                  <ul>
                    {codeAnalysis.analysis.improvements.map(
                      (improvement, index) => (
                        <li
                          key={index}
                          className={styles.improvementItem}
                        >
                          {improvement}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {codeAnalysis.analysis.bestPractices.length > 0 && (
                <div className={styles.analysisSection}>
                  <h5>Best Practices</h5>
                  <ul>
                    {codeAnalysis.analysis.bestPractices.map(
                      (practice, index) => (
                        <li
                          key={index}
                          className={styles.practiceItem}
                        >
                          {practice}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {showSolution && (
            <div className={styles.solution}>
              <h4>Solution</h4>
              <CodeEditor
                key='solution-code'
                value={challenge.solution}
                onChange={() => {}}
                language={challenge.programmingLanguage}
                height='300px'
                readOnly={true}
                path={`solution-code.${challenge.programmingLanguage === 'typescript' ? 'ts' : 'py'}`}
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
