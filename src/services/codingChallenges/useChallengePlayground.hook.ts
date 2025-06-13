import { useCallback, useState } from 'react';

import type { ICodingChallengeWithWrapper } from '@/types';

import {
  executeCode,
  formatExecutionResult,
  type CodeExecutionResult,
} from '../codeRunner.service';

export const useChallengePlayground = (
  challengeData: ICodingChallengeWithWrapper
) => {
  const [userCode, setUserCode] = useState<string>(
    challengeData.challenge.initialCode || ''
  );
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [executionResult, setExecutionResult] =
    useState<CodeExecutionResult | null>(null);
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
      setError(
        `Execution failed: ${e instanceof Error ? e.message : String(e)}`
      );
    } finally {
      setIsRunning(false);
    }
  }, [userCode, challenge.programmingLanguage]);

  const resetPlayground = useCallback(() => {
    setUserCode(challengeData.challenge.initialCode || '');
    setShowSolution(false);
    setShowHints(false);
    setExecutionResult(null);
    setIsRunning(false);
    setError(null);
  }, [challengeData.challenge.initialCode]);

  return {
    userCode,
    showSolution,
    showHints,
    executionResult,
    isRunning,
    error,
    challenge,
    handleCodeChange,
    handleToggleSolution,
    handleToggleHints,
    handleRunCode,
    resetPlayground,
    formatExecutionResult,
  };
};
