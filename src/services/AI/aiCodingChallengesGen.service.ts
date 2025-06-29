import { LANGUAGE_NAMES } from '@/data';
import { generateResponse } from '@/services';
import type {
  IAIMessage,
  ICodingChallenge,
  ICodingChallengeWithWrapper,
  TDifficulty,
  TLang,
  TProgrammingLanguage,
} from '@/types';

export type { TProgrammingLanguage };
export { LANGUAGE_NAMES as languageNames };

function createCodingChallengePrompt(
  topic: string,
  languageKey: TLang,
  programmingLanguage: TProgrammingLanguage,
  difficulty: TDifficulty
): IAIMessage[] {
  const languageName = LANGUAGE_NAMES[languageKey];

  const systemPrompt = `Generate coding challenge JSON. Language: ${languageName}. Programming language: ${programmingLanguage}. Format:
{
  "title": "Challenge Title",
  "description": "Task description",
  "language": "${languageKey}",
  "programmingLanguage": "${programmingLanguage}",
  "difficulty": "${difficulty}",
  "initialCode": "function template with test usage code",
  "solution": "complete solution code with working implementation",
  "testCases": [
    {"input": "test input", "expectedOutput": "expected result", "description": "test description"}
  ],
  "hints": ["helpful hint 1", "helpful hint 2"]
}

CRITICAL JSON FORMAT RULES:
- NEVER use template literals (backticks \`) in JSON
- ALWAYS use double quotes for strings
- Use \\n for newlines inside JSON strings
- Use proper escaping for all special characters

Example of CORRECT initialCode JSON format:
"initialCode": "function processArray(arr: number[]): number[] {\\n    // your code here\\n}\\n\\nconsole.log(processArray([1, 2, 3])); // Expected: [2, 4, 6]\\nconsole.log(processArray([4, 5])); // Expected: [8, 10]"

CRITICAL RULES for initialCode:
1. Include empty function template with "// your code here" comment
2. Include test/usage code below the function so user can click Run Code immediately
3. ALL functions MUST return something - avoid void functions
4. Use console.log calls to show the returned results
5. Add comments showing expected output for each test call
6. Use ONLY \\n for newlines in JSON strings - NO template literals
7. NO working implementation in function body - only "// your code here"
8. For TypeScript: ALWAYS include type annotations for parameters (e.g., arr: number[], str: string)
9. For TypeScript: Include return type annotations - NEVER use void, always return something useful

FUNCTION DESIGN RULES:
10. ALL functions must return meaningful values:
    - Array processing → return processed array or result
    - Closures → return function that can be called
    - Calculations → return computed value
    - Transformations → return transformed data
11. Test code must include expected output comments:
    - console.log(myFunction([1, 2, 3])); // Expected: [2, 4, 6]
    - console.log(closure()); // Expected: "Functions executed"
12. NEVER use void return type - always return something useful

TYPESCRIPT TYPING RULES:
13. Use CORRECT TypeScript syntax - double check all type annotations
14. For function arrays: use (() => void)[] for simple functions, (() => ReturnType)[] for functions that return
15. For function parameters: use (param: Type) => ReturnType
16. For generic types: use proper generic syntax T, U, etc.
17. For objects: use proper interface or inline object types
18. VERIFY all TypeScript types are syntactically correct before generating
19. Common patterns:
    - Function array: (() => void)[] or (() => string)[]
    - Callback function: (value: T) => U
    - Optional parameters: param?: Type
    - Union types: string | number
    - Array types: Type[] or Array<Type>
20. Return types should be specific: number[], string, () => void, etc.`;

  const userMessage = `Topic: "${topic}". Create ${programmingLanguage} coding challenge. ${languageName} language. 

CRITICAL REQUIREMENTS:
- Function MUST return something useful (never void) - arrays return arrays, closures return functions, etc.
- MUST include function template AND test/usage code in initialCode so user can immediately run code
- Empty function body with "// your code here" only
- Test calls MUST have comments showing expected output: console.log(func(input)); // Expected: output
- ${programmingLanguage === 'typescript' ? 'CRITICAL: Use CORRECT TypeScript types - verify syntax! Return types must be specific: number[], string, () => void, etc.' : ''}
- STRICT JSON format - NO template literals, only double quotes with \\n for newlines

JSON FORMAT WARNING:
- NEVER use backticks \` in JSON
- Use "string with \\n" format for multiline code
- Example: "initialCode": "function name() {\\n    // code\\n}"

EXAMPLE FORMAT (as JSON string):
"function processArray(arr: number[]): number[] {\\n    // your code here\\n}\\n\\nconsole.log(processArray([1, 2, 3])); // Expected: [2, 4, 6]\\nconsole.log(processArray([4, 5])); // Expected: [8, 10]"

Generate the challenge now.`;

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
  difficulty: TDifficulty,
  onProgress?: (progress: number) => void
): Promise<{
  challengeData: ICodingChallengeWithWrapper;
  rawResponseText: string;
}> {
  const messages = createCodingChallengePrompt(
    topic,
    language,
    programmingLanguage,
    difficulty
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
