import type { 
  ICodingChallengeWithWrapper, 
  ICodingChallenge, 
  TLang, 
  TProgrammingLanguage, 
  IAIMessage 
} from '@/types';
import { LANGUAGE_NAMES } from '@/constants';
import { generateResponse } from './localAI.service';

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
  "initialCode": "starter code template",
  "solution": "complete solution code",
  "testCases": [
    {"input": "test input", "expectedOutput": "expected result", "description": "test description"}
  ],
  "hints": ["helpful hint 1", "helpful hint 2"]
}`;

  const userMessage = `Topic: "${topic}". Create ${programmingLanguage} coding challenge. ${languageName} language. Provide initial code template and solution. Include 3-5 test cases. JSON only.`;

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
): Promise<{ challengeData: ICodingChallengeWithWrapper, rawResponseText: string }> {
  const messages = createCodingChallengePrompt(topic, language, programmingLanguage);
  
  const response = await generateResponse<ICodingChallenge>(
    messages,
    {},
    onProgress
  );

  if (response.data && response.data.title && response.data.description) {
    const challengeData: ICodingChallengeWithWrapper = { challenge: response.data };
    return { 
      challengeData, 
      rawResponseText: response.rawResponseText 
    };
  } else {
    throw new Error('Generated coding challenge data is not in the expected format.');
  }
} 