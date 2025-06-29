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
  "initialCode": "function template with test usage code",
  "solution": "complete solution code with working implementation",
  "testCases": [
    {"input": "test input", "expectedOutput": "expected result", "description": "test description"}
  ],
  "hints": ["helpful hint 1", "helpful hint 2"]
}

CRITICAL RULES for initialCode:
1. Include empty function template with "// your code here" comment
2. Include test/usage code below the function so user can click Run Code immediately
3. For return-value functions: use console.log calls with the function
4. For closures/side-effect functions: create instances and call them
5. Use proper newline characters \\n in JSON string
6. NO working implementation in function body - only "// your code here"`;

  const userMessage = `Topic: "${topic}". Create ${programmingLanguage} coding challenge. ${languageName} language. MUST include function template AND test/usage code in initialCode so user can immediately run code. Empty function body with "// your code here" only. JSON format only.`;

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
