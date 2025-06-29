import { useCallback, useState } from 'react';

import { DEFAULT_LANGUAGE } from '@/constants';
import type { ICodingChallengeWithWrapper, TLang } from '@/types';

import {
  generateCodeAnalysis,
  type ICodeAnalysisWithWrapper,
} from '../AI/aiCodingGenHints.service';
import {
  checkSolution,
  type ISolutionCheckWithWrapper,
} from '../AI/aiSolutionChecker.service';
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
  const [codeAnalysis, setCodeAnalysis] =
    useState<ICodeAnalysisWithWrapper | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [solutionCheck, setSolutionCheck] =
    useState<ISolutionCheckWithWrapper | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [showSolutionCheck, setShowSolutionCheck] = useState<boolean>(false);

  const challenge = challengeData.challenge;

  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    console.log('✏️ Code changed - New code:', newCode);
    console.log('📏 Code changed - Length:', newCode.length);

    setUserCode(newCode);
    setSolutionCheck(null);
    setShowSolutionCheck(false);
    setCodeAnalysis(null);
    setShowAnalysis(false);
  }, []);

  const handleToggleSolution = useCallback(() => {
    setShowSolution(!showSolution);
  }, [showSolution]);

  const handleToggleHints = useCallback(() => {
    setShowHints(!showHints);
  }, [showHints]);

  const handleToggleAnalysis = useCallback(() => {
    setShowAnalysis(!showAnalysis);
  }, [showAnalysis]);

  const handleToggleSolutionCheck = useCallback(() => {
    setShowSolutionCheck(!showSolutionCheck);
  }, [showSolutionCheck]);

  const handleAnalyzeCode = useCallback(async () => {
    if (!userCode.trim()) {
      setError('Please write some code to analyze.');
      return;
    }

    if (!challenge.programmingLanguage) {
      setError('Programming language not specified.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setSolutionCheck(null);
    setShowSolutionCheck(false);

    try {
      const result = await executeCode(userCode, challenge.programmingLanguage);
      const executionResultText = formatExecutionResult(result);

      const { analysisData } = await generateCodeAnalysis(
        userCode,
        executionResultText,
        challenge,
        (challenge.language as TLang) || DEFAULT_LANGUAGE
      );

      setCodeAnalysis(analysisData);
      setShowAnalysis(true);
    } catch (e) {
      setError(
        `Analysis failed: ${e instanceof Error ? e.message : String(e)}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [userCode, challenge]);

  const handleCheckSolution = useCallback(async () => {
    console.log('🎯 Check Solution Called - userCode:', userCode);
    console.log('🎯 Check Solution Called - userCode length:', userCode.length);

    if (!userCode.trim()) {
      setError('Please write some code to check.');
      return;
    }

    console.log('🚀 Hook - Sending to AI Checker:', userCode);
    console.log(
      '📋 Hook - Current userCode state:',
      userCode.length,
      'characters'
    );

    setIsChecking(true);
    setError(null);
    setSolutionCheck(null);
    setShowSolutionCheck(false);
    setCodeAnalysis(null);
    setShowAnalysis(false);

    try {
      const { checkData } = await checkSolution(
        userCode,
        challenge,
        (challenge.language as TLang) || DEFAULT_LANGUAGE
      );

      setSolutionCheck(checkData);
      setShowSolutionCheck(true);
    } catch (e) {
      setError(
        `Solution check failed: ${e instanceof Error ? e.message : String(e)}`
      );
    } finally {
      setIsChecking(false);
    }
  }, [userCode, challenge]);

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
    setSolutionCheck(null);
    setShowSolutionCheck(false);

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
    setCodeAnalysis(null);
    setIsAnalyzing(false);
    setShowAnalysis(false);
    setSolutionCheck(null);
    setIsChecking(false);
    setShowSolutionCheck(false);
  }, [challengeData.challenge.initialCode]);

  return {
    userCode,
    showSolution,
    showHints,
    executionResult,
    isRunning,
    error,
    challenge,
    codeAnalysis,
    isAnalyzing,
    showAnalysis,
    solutionCheck,
    isChecking,
    showSolutionCheck,
    handleCodeChange,
    handleToggleSolution,
    handleToggleHints,
    handleRunCode,
    handleAnalyzeCode,
    handleToggleAnalysis,
    handleCheckSolution,
    handleToggleSolutionCheck,
    resetPlayground,
    formatExecutionResult,
  };
};
