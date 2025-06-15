import { LANGUAGE_NAMES } from '@/data';
import { generateResponse } from '@/services';
import type {
  IAIMessage,
  ICodingChallenge,
  ICodingChallengeWithWrapper,
  TLang,
  TProgrammingLanguage,
} from '@/types';

export type { TProgrammingLanguage };
export { LANGUAGE_NAMES as languageNames };

function createCodingChallengePrompt(
  topic: string,
  languageKey: TLang,
  programmingLanguage: TProgrammingLanguage
): IAIMessage[] {
  const languageName = LANGUAGE_NAMES[languageKey];

  const systemPrompt = `Generate coding challenge JSON. Language: ${languageName}. Programming language: ${programmingLanguage}. Format:
{
  "title": "Challenge Title",
  "description": "Task description",
  "language": "${languageKey}",
  "programmingLanguage": "${programmingLanguage}",
  "difficulty": "easy|medium|hard",
  "initialCode": "function with test cases as console.log calls",
  "solution": "complete solution code with working implementation",
  "testCases": [
    {"input": "test input", "expectedOutput": "expected result", "description": "test description"}
  ],
  "hints": ["helpful hint 1", "helpful hint 2"]
}

IMPORTANT: In initialCode, include the function template and test cases as console.log calls showing expected output in comments. Example:
function functionName(param) {
    // your code here
}

console.log("Test case 1:", functionName([1, 2, 3]));
// Expected output: [result1, result2, result3]

console.log("Test case 2:", functionName([4, 5]));
// Expected output: [result4, result5]`;

  const userMessage = `Topic: "${topic}". Create ${programmingLanguage} coding challenge. ${languageName} language. Include function template with test cases as console.log calls in initialCode. Provide working solution. Include 3-4 test cases. JSON only.`;

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

export async function generateCodingChallenge(
  topic: string,
  language: TLang,
  programmingLanguage: TProgrammingLanguage,
  onProgress?: (progress: number) => void
): Promise<{
  challengeData: ICodingChallengeWithWrapper;
  rawResponseText: string;
}> {
  const messages = createCodingChallengePrompt(
    topic,
    language,
    programmingLanguage
  );

  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (onProgress && attempt > 0) {
        onProgress(10 * attempt);
      }

      const response = await generateResponse<ICodingChallenge>(
        messages,
        {},
        onProgress
      );

      if (response.data && response.data.title && response.data.description) {
        const challengeData: ICodingChallengeWithWrapper = {
          challenge: response.data,
        };
        return {
          challengeData,
          rawResponseText: response.rawResponseText,
        };
      } else {
        throw new Error(
          'Generated coding challenge data is not in the expected format.'
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
    `Failed to generate coding challenge after ${maxRetries + 1} attempts. Last error: ${lastError?.message}`
  );
}
