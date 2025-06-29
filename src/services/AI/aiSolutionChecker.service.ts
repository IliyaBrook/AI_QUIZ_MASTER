import { LANGUAGE_NAMES } from '@/data';
import { generateResponse } from '@/services';
import type { IAIMessage, ICodingChallenge, TLang } from '@/types';

export interface ISolutionCheckResult {
  isCorrect: boolean;
  message: string;
  details?: {
    expectedOutput: string;
    actualOutput: string;
    testCase: string;
  };
}

export interface ISolutionCheckWithWrapper {
  result: ISolutionCheckResult;
}

function createSolutionCheckPrompt(
  userCode: string,
  challenge: ICodingChallenge,
  languageKey: TLang
): IAIMessage[] {
  const languageName = LANGUAGE_NAMES[languageKey];

  const systemPrompt = `Check if user's code solution fulfills the task requirements. Language: ${languageName}. Programming language: ${challenge.programmingLanguage}. Format:
{
  "isCorrect": true/false,
  "message": "Success message or explanation of what's wrong",
  "details": {
    "expectedOutput": "what would be expected based on description",
    "actualOutput": "what user's code would output",
    "testCase": "context of the requirement"
  }
}

MANDATORY ANALYSIS PROCESS:
1. IGNORE the official solution completely - it's only for reference
2. Read ONLY the task description and evaluate user's code against it
3. If description contains vague words like "операции", "действия", "actions", "operations" - be VERY flexible
4. If description is specific like "вывести каждый", "print each", "calculate sum" - be strict

VAGUE DESCRIPTIONS (mark as CORRECT if code does ANY meaningful operation):
- "выполняет операции с элементами" → ANY operation on elements is correct
- "perform actions with elements" → ANY action is correct
- "process array elements" → ANY processing is correct
- "работает с массивом" → ANY work with array is correct

SPECIFIC DESCRIPTIONS (be strict):
- "выводит каждый элемент" → must print each element individually
- "вычисляет сумму" → must calculate sum
- "print each element" → must print each element
- "finds maximum" → must find maximum

CURRENT TASK ANALYSIS:
If description says "выполняет определенные операции" or similar vague wording, then user's code is correct if it:
- Iterates through array (for, forEach, while, etc.)
- Does something meaningful with elements (sum, print, transform, etc.)

NEVER compare with official solution for vague descriptions!

If correct - congratulate user enthusiastically. If incorrect - explain why the code doesn't match the task requirements.`;

  const testCasesText = challenge.testCases
    .map(
      (tc, index) =>
        `Test Case ${index + 1}: Input: ${typeof tc.input === 'string' ? tc.input : JSON.stringify(tc.input)}, Expected: ${typeof tc.expectedOutput === 'string' ? tc.expectedOutput : JSON.stringify(tc.expectedOutput)}`
    )
    .join('\n');

  const isVagueDescription =
    /операции|действия|actions|operations|process.*elements|работает.*массив/i.test(
      challenge.description
    );

  const userMessage = `Challenge: "${challenge.title}"
Description: "${challenge.description}"

User's Code:
${userCode}

${
  !isVagueDescription
    ? `Official Solution (for reference only):
${challenge.solution}

Test Cases (for reference):
${testCasesText}`
    : ''
}

ANALYSIS INSTRUCTIONS:
Description Analysis: "${challenge.description}"
${
  isVagueDescription
    ? `🔄 VAGUE DESCRIPTION DETECTED: This description uses general terms like "операции/actions/operations". 
  ✅ RULE: Any meaningful iteration + operation on array elements = CORRECT
  ❌ DO NOT compare with official solution
  ✅ Accept ANY approach that iterates and does something useful with elements`
    : `🎯 SPECIFIC DESCRIPTION: This description has specific requirements.
  ✅ RULE: User code must match the specific requirements described
  🔍 Compare with official solution if needed for clarity`
}

EVALUATION CRITERIA:
${
  isVagueDescription
    ? `For VAGUE description - mark as CORRECT if user's code:
  1. Successfully iterates through array (any method: for, forEach, while, etc.)
  2. Performs ANY meaningful operation with elements (sum, print, multiply, transform, etc.)
  3. Code is syntactically correct and would execute without errors`
    : `For SPECIFIC description - evaluate based on exact requirements in description`
}

Analyze user's code against the task description. Return JSON format. Message in ${languageName} language.`;

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

export async function checkSolution(
  userCode: string,
  challenge: ICodingChallenge,
  language: TLang,
  onProgress?: (progress: number) => void
): Promise<{
  checkData: ISolutionCheckWithWrapper;
  rawResponseText: string;
}> {
  console.log('🔍 AI Solution Checker - User Code:', userCode);
  console.log('📝 AI Solution Checker - Challenge:', challenge.title);
  console.log('📄 AI Solution Checker - Description:', challenge.description);

  const messages = createSolutionCheckPrompt(userCode, challenge, language);

  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (onProgress && attempt > 0) {
        onProgress(10 * attempt);
      }

      const response = await generateResponse<ISolutionCheckResult>(
        messages,
        {},
        onProgress
      );

      if (response.data && typeof response.data.isCorrect === 'boolean') {
        const checkData: ISolutionCheckWithWrapper = {
          result: response.data,
        };
        return {
          checkData,
          rawResponseText: response.rawResponseText,
        };
      } else {
        throw new Error(
          'Generated solution check data is not in the expected format.'
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
    `Failed to check solution after ${maxRetries + 1} attempts. Last error: ${lastError?.message}`
  );
}
