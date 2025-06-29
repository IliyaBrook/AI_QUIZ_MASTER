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

CRITICAL EVALUATION RULES:
1. NEVER compare implementation methods (for vs forEach vs while) - only results matter
2. Focus ONLY on whether the code achieves the described outcome
3. Different implementation approaches are equally valid if they produce the same result
4. IGNORE the official solution completely - it's just one possible approach

TASK OUTCOME EVALUATION:
- If task says "перебирает массив и выводит каждый элемент" → ANY iteration method + console.log(each element) = CORRECT
- If task says "вычисляет сумму" → ANY method that calculates sum = CORRECT  
- If task says "находит максимум" → ANY method that finds maximum = CORRECT

IMPLEMENTATION FLEXIBILITY:
✅ CORRECT approaches for "print each element":
- for loop + console.log(arr[i])
- forEach + console.log(elem)
- for..of + console.log(elem)
- while loop + console.log
- map + console.log (if used for side effect)

❌ INCORRECT only if:
- Doesn't iterate through array at all
- Doesn't print each element individually
- Prints something different (like sum instead of each element)

ALGORITHM vs IMPLEMENTATION:
- Algorithm: WHAT the code does (iterate + print each)
- Implementation: HOW the code does it (for vs forEach)
- Evaluate ALGORITHM, ignore IMPLEMENTATION differences

If user's code produces the same outcome as described in task - mark as CORRECT regardless of implementation method.

If correct - congratulate user enthusiastically. If incorrect - explain why the outcome doesn't match requirements.`;

  const userMessage = `Challenge: "${challenge.title}"
Description: "${challenge.description}"

User's Code:
${userCode}

ANALYSIS TASK:
1. Read the task description: "${challenge.description}"
2. Understand WHAT outcome the task requires (not HOW to implement it)
3. Evaluate if user's code achieves the same outcome
4. Ignore implementation differences (for vs forEach vs while etc.)

EVALUATION FOCUS:
- Task: "перебирает массив и выводит каждый элемент" 
- Question: Does user's code iterate through array AND output each element?
- Methods: for, forEach, for..of, while - ALL are valid if they achieve the outcome

- Task: "вычисляет сумму элементов"
- Question: Does user's code calculate sum of elements?
- Methods: reduce, for loop, forEach - ALL are valid if they calculate sum

DECISION LOGIC:
✅ CORRECT if: User's code achieves the described outcome (regardless of method)
❌ INCORRECT if: User's code does NOT achieve the described outcome

Do NOT compare implementation style with any reference solution - only evaluate if the outcome matches the task description.

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
