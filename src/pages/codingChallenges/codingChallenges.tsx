import React, { useState, useCallback, Suspense } from 'react';
import { generateCodingChallenge, languageNames } from '@/services';
import type { TLang, TProgrammingLanguage, ICodingChallengeWithWrapper } from '@/types';
import { DEFAULT_LANGUAGE, PROGRAMMING_LANGUAGE_NAMES, DEFAULT_PROGRAMMING_LANGUAGE } from '@/constants';
import { LoadingSpinner, CodeEditor, Button, Select, Input } from '@/components';
import { executeCode, formatExecutionResult, type CodeExecutionResult } from '@/services';
import Header from './header/header';
import styles from './codingChallenges.module.scss';

const testChallengeData: any = {
  "challenge": {
      "title": "Перебор Массивов",
      "description": "Реализуйте функцию, которая перебирает элементы массива и выполняет определенные действия с ними.",
      "language": "ru",
      "programmingLanguage": "javascript",
      "difficulty": "medium",
      "initialCode": "\nfunction processArray(arr) {\n    // ваш код здесь\n}\n\nconsole.log('Test case 1:', processArray([1, 2, 3]));\n// Expected output: [result1, result2, result3]\n\nconsole.log('Test case 2:', processArray([4, 5]));\n// Expected output: [result4, result5]\n\nconsole.log('Test case 3:', processArray([]));\n// Expected output: []",
      "solution": "\nfunction processArray(arr) {\n    let result = [];\n    for (let i = 0; i < arr.length; i++) {\n        // здесь выполняются действия с элементами массива\n        result.push(i * 2);\n    }\n    return result;\n}",
      "testCases": [
          {
              "input": "[1, 2, 3]",
              "expectedOutput": "[2, 4, 6]"
          },
          {
              "input": "[4, 5]",
              "expectedOutput": "[8, 10]"
          },
          {
              "input": "[10]",
              "expectedOutput": "[20]"
          },
          {
              "input": "[]",
              "expectedOutput": "[]"
          }
      ],
      "hints": [
          "Попробуйте использовать цикл for для перебора элементов массива.",
          "Не забудьте вернуть результат из функции."
      ]
  }
}

const CodingChallenges: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [language, setLanguage] = useState<TLang>(DEFAULT_LANGUAGE);
  const [programmingLanguage, setProgrammingLanguage] = useState<TProgrammingLanguage>(DEFAULT_PROGRAMMING_LANGUAGE);
  const [challengeData, setChallengeData] = useState<ICodingChallengeWithWrapper | null>(testChallengeData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [userCode, setUserCode] = useState<string>('');
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [challengeStarted, setChallengeStarted] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
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
    setExecutionResult(null);
    setIsRunning(false);
  };

  const handleStartChallenge = () => {
    if (challengeData?.challenge.initialCode) {
      setUserCode(challengeData.challenge.initialCode);
    }
    setChallengeStarted(true);
    setShowSolution(false);
    setShowHints(false);
    setExecutionResult(null);
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

  const handleRunCode = async () => {
    if (!userCode.trim()) {
      setError('Please write some code to run.');
      return;
    }

    if (!challengeData?.challenge.programmingLanguage) {
      setError('Programming language not specified.');
      return;
    }

    setIsRunning(true);
    setError(null);

    try {
      const result = await executeCode(userCode, challengeData.challenge.programmingLanguage);
      setExecutionResult(result);
      
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch (e) {
      setError(`Execution failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsRunning(false);
    }
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
                <Input
                  label="Challenge Topic"
                  id="topicInput"
                  value={topic}
                  onChange={setTopic}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && topic.trim() && !isLoading) {
                      handleGenerateChallenge();
                    }
                  }}
                  placeholder="e.g., Array Manipulation, Binary Search"
                  disabled={isLoading}
                />

                <Select
                  label="Language"
                  id="languageSelect"
                  value={language}
                  options={Object.entries(languageNames).map(([key, name]) => ({
                    value: key,
                    label: name
                  }))}
                  onChange={value => setLanguage(value as TLang)}
                  disabled={isLoading}
                />

                <Select
                  label="Programming Language"
                  id="programmingLanguageSelect"
                  value={programmingLanguage}
                  options={Object.entries(PROGRAMMING_LANGUAGE_NAMES).map(([key, name]) => ({
                    value: key,
                    label: name
                  }))}
                  onChange={value => setProgrammingLanguage(value as TProgrammingLanguage)}
                  disabled={isLoading}
                />

                <Button
                  onClick={handleGenerateChallenge}
                  disabled={isLoading || !topic.trim()}
                  variant="primary"
                >
                  Generate Challenge
                </Button>

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
              <Button onClick={handleStartChallenge} variant="primary">
                Start Challenge
              </Button>
              <Button onClick={handleBackToGeneration} variant="secondary">
                Create New Challenge
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const challenge = challengeData.challenge;

  return (
    <div className={styles.challengeContainer}>
      <Header challenge={challenge} onBackToGeneration={handleBackToGeneration} />

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

const CodingChallengesWithSuspense: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <CodingChallenges />
  </Suspense>
);

export default CodingChallengesWithSuspense; 