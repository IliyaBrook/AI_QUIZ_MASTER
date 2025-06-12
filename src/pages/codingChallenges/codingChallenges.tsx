import React, { useState, useCallback, Suspense } from 'react';
import { generateCodingChallenge, languageNames } from '@/services';
import type { TLang, TProgrammingLanguage, ICodingChallengeWithWrapper } from '@/types';
import { DEFAULT_LANGUAGE, PROGRAMMING_LANGUAGE_NAMES, DEFAULT_PROGRAMMING_LANGUAGE } from '@/constants';
import { LoadingSpinner, CodeEditor } from '@/components';
import styles from './codingChallenges.module.scss';

const CodingChallenges: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [language, setLanguage] = useState<TLang>(DEFAULT_LANGUAGE);
  const [programmingLanguage, setProgrammingLanguage] = useState<TProgrammingLanguage>(DEFAULT_PROGRAMMING_LANGUAGE);
  const [challengeData, setChallengeData] = useState<ICodingChallengeWithWrapper | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [userCode, setUserCode] = useState<string>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [challengeStarted, setChallengeStarted] = useState<boolean>(false);

  const handleGenerateChallenge = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a challenge topic.');
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setChallengeData(null);
    resetChallengeState();

    try {
      const { challengeData: newChallengeData } = await generateCodingChallenge(topic, language, programmingLanguage);
      setChallengeData(newChallengeData);
    } catch (e) {
      console.error('Error generating challenge:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Challenge generation error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [topic, language, programmingLanguage, isLoading]);

  const resetChallengeState = () => {
    setUserCode('');
    setShowSolution(false);
    setShowHints(false);
    setChallengeStarted(false);
  };

  const handleStartChallenge = () => {
    if (challengeData?.challenge.initialCode) {
      setUserCode(challengeData.challenge.initialCode);
    }
    setChallengeStarted(true);
    setShowSolution(false);
    setShowHints(false);
  };

  const handleBackToGeneration = () => {
    setChallengeData(null);
    setChallengeStarted(false);
    resetChallengeState();
    setError(null);
  };

  const handleCodeChange = (value: string | undefined) => {
    setUserCode(value || '');
  };

  const handleToggleSolution = () => {
    setShowSolution(!showSolution);
  };

  const handleToggleHints = () => {
    setShowHints(!showHints);
  };

  if (!challengeData || !challengeStarted) {
    return (
      <div className={styles.challengeContainer}>
        <h1>AI Coding Challenge</h1>

        {!challengeData ? (
          <div className={styles.challengeGeneration}>
            {isLoading ? (
              <LoadingSpinner message='Generating coding challenge...' />
            ) : (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor='topicInput'>Challenge Topic:</label>
                  <input
                    type='text'
                    id='topicInput'
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && topic.trim() && !isLoading) {
                        handleGenerateChallenge();
                      }
                    }}
                    placeholder='e.g., Array Manipulation, Binary Search'
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor='languageSelect'>Language:</label>
                  <select
                    id='languageSelect'
                    value={language}
                    onChange={e => setLanguage(e.target.value as TLang)}
                    disabled={isLoading}
                  >
                    {Object.entries(languageNames).map(([key, name]) => (
                      <option key={key} value={key}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor='programmingLanguageSelect'>Programming Language:</label>
                  <select
                    id='programmingLanguageSelect'
                    value={programmingLanguage}
                    onChange={e => setProgrammingLanguage(e.target.value as TProgrammingLanguage)}
                    disabled={isLoading}
                  >
                    {Object.entries(PROGRAMMING_LANGUAGE_NAMES).map(([key, name]) => (
                      <option key={key} value={key}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleGenerateChallenge}
                  disabled={isLoading || !topic.trim()}
                  className={styles.generateButton}
                >
                  Generate Challenge
                </button>

                {error && <div className={styles.errorMessage}>{error}</div>}
              </>
            )}
          </div>
        ) : (
          <div className={styles.challengePreview}>
            <h2>{challengeData.challenge.title}</h2>
            <div className={styles.challengeMeta}>
              <p>Language: {languageNames[challengeData.challenge.language as TLang]}</p>
              <p>Programming Language: {PROGRAMMING_LANGUAGE_NAMES[challengeData.challenge.programmingLanguage]}</p>
              <p>Difficulty: <span className={`${styles.difficulty} ${styles[challengeData.challenge.difficulty]}`}>{challengeData.challenge.difficulty}</span></p>
            </div>
            <div className={styles.challengeDescription}>
              <p>{challengeData.challenge.description}</p>
            </div>

            <div className={styles.challengeActions}>
              <button onClick={handleStartChallenge} className={styles.startButton}>
                Start Challenge
              </button>
              <button onClick={handleBackToGeneration} className={styles.backButton}>
                Create New Challenge
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const challenge = challengeData.challenge;

  return (
    <div className={styles.challengeContainer}>
      <div className={styles.challengeHeader}>
        <h1>{challenge.title}</h1>
        <div className={styles.challengeMeta}>
          <span className={`${styles.difficulty} ${styles[challenge.difficulty]}`}>{challenge.difficulty}</span>
          <span className={styles.programmingLanguage}>{PROGRAMMING_LANGUAGE_NAMES[challenge.programmingLanguage]}</span>
        </div>
        <button onClick={handleBackToGeneration} className={styles.backToGeneration}>
          ← New Challenge
        </button>
      </div>

      <div className={styles.challengeContent}>
        <div className={styles.challengeDescription}>
          <h3>Description</h3>
          <p>{challenge.description}</p>
        </div>

        {challenge.testCases && challenge.testCases.length > 0 && (
          <div className={styles.testCases}>
            <h3>Test Cases</h3>
            {challenge.testCases.map((testCase, index) => (
              <div key={index} className={styles.testCase}>
                <p><strong>Input:</strong> {testCase.input}</p>
                <p><strong>Expected Output:</strong> {testCase.expectedOutput}</p>
                {testCase.description && <p><strong>Description:</strong> {testCase.description}</p>}
              </div>
            ))}
          </div>
        )}

        <div className={styles.codeSection}>
          <div className={styles.codeHeader}>
            <h3>Your Solution</h3>
            <div className={styles.codeActions}>
              {challenge.hints && challenge.hints.length > 0 && (
                <button onClick={handleToggleHints} className={styles.hintButton}>
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </button>
              )}
              <button onClick={handleToggleSolution} className={styles.solutionButton}>
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
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

const CodingChallengesWithSuspense: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <CodingChallenges />
  </Suspense>
);

export default CodingChallengesWithSuspense; 