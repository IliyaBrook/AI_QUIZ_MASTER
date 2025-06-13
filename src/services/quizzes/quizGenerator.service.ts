import type { IQuizWithWrapper, IQuizAiResponse, TLang, IAIMessage } from '@/types';
import { LANGUAGE_NAMES } from '@/constants';
import { generateResponse } from '@/services';

export type { TLang };
export { LANGUAGE_NAMES as languageNames };

function createQuizPrompt(userPrompt: string, languageKey: TLang): IAIMessage[] {
  const languageName = LANGUAGE_NAMES[languageKey];

  const systemPrompt = `Generate quiz JSON. Language: ${languageName}. Format:
{
  "title": "Title",
  "language": "${languageKey}",
  "questions": [
    {
      "question": "Question?",
      "answer_options": [
        {"text": "Option", "rationale": "Why", "is_correct": true}
      ]
    }
  ]
}`;

  const userMessage = `Topic: "${userPrompt}". 5 questions, 4 options each. ${languageName} language. JSON only.`;

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

export async function generateQuiz(
    topic: string, 
    language: TLang,
    onProgress?: (progress: number) => void
): Promise<{ quizData: IQuizWithWrapper, rawResponseText: string }> {
    const messages = createQuizPrompt(topic, language);
    
    const response = await generateResponse<IQuizAiResponse>(
      messages,
      {},
      onProgress
    );

    if (response.data && response.data.title && response.data.questions) {
      const quizData: IQuizWithWrapper = { quiz: response.data };
      return { 
        quizData, 
        rawResponseText: response.rawResponseText 
      };
    } else {
      throw new Error('Generated quiz data is not in the expected format.');
    }
} 