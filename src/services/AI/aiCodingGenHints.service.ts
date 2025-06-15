import { LANGUAGE_NAMES } from '@/data';
import { generateResponse } from '@/services';
import type { IAIMessage, ICodingChallenge, TLang } from '@/types';

export interface ICodeAnalysisResult {
  suggestions: string[];
  improvements: string[];
  errors: string[];
  bestPractices: string[];
}

export interface ICodeAnalysisWithWrapper {
  analysis: ICodeAnalysisResult;
}

function createCodeAnalysisPrompt(
  userCode: string,
  executionResult: string,
  challenge: ICodingChallenge,
  languageKey: TLang
): IAIMessage[] {
  const languageName = LANGUAGE_NAMES[languageKey];

  const systemPrompt = `Analyze user's code and provide constructive feedback. Language: ${languageName}. Programming language: ${challenge.programmingLanguage}. Format:
{
  "suggestions": ["specific suggestion 1", "specific suggestion 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "errors": ["error explanation 1", "error explanation 2"],
  "bestPractices": ["best practice 1", "best practice 2"]
}

Analyze the code quality, logic, efficiency, and correctness. Compare with expected solution approach. Provide actionable feedback.`;

  const userMessage = `Challenge: "${challenge.title}"
Description: "${challenge.description}"
Programming Language: ${challenge.programmingLanguage}

User's Code:
${userCode}

Execution Result:
${executionResult}

Expected Solution:
${challenge.solution}

Analyze user's code and provide constructive feedback in JSON format. Focus on:
1. Code correctness and logic issues
2. Performance improvements
3. Best practices for ${challenge.programmingLanguage}
4. Comparison with expected approach
5. Specific suggestions for improvement

Provide feedback in ${languageName} language.`;

  return [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: userMessage,
    },
  ];
}

export async function generateCodeAnalysis(
  userCode: string,
  executionResult: string,
  challenge: ICodingChallenge,
  language: TLang,
  onProgress?: (progress: number) => void
): Promise<{
  analysisData: ICodeAnalysisWithWrapper;
  rawResponseText: string;
}> {
  const messages = createCodeAnalysisPrompt(
    userCode,
    executionResult,
    challenge,
    language
  );

  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (onProgress && attempt > 0) {
        onProgress(10 * attempt);
      }

      const response = await generateResponse<ICodeAnalysisResult>(
        messages,
        {},
        onProgress
      );

      if (response.data && response.data.suggestions) {
        const analysisData: ICodeAnalysisWithWrapper = {
          analysis: response.data,
        };
        return {
          analysisData,
          rawResponseText: response.rawResponseText,
        };
      } else {
        throw new Error(
          'Generated code analysis data is not in the expected format.'
        );
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        console.warn(
          `Attempt ${attempt + 1} failed, retrying:`,
          lastError.message
        );
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (attempt + 1))
        );
      }
    }
  }

  throw new Error(
    `Failed to generate code analysis after ${maxRetries + 1} attempts. Last error: ${lastError?.message}`
  );
}
