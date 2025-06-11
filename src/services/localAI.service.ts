import type { IQuizAiResponse, IQuizWithWrapper, TLang } from '@/types';
import { LANGUAGE_NAMES } from '@/constants';

export type { TLang };

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';
const MODEL_NAME = 'llama3.1:8b';

function createLocalPrompt(userPrompt: string, languageKey: TLang): any[] {
  const languageName = LANGUAGE_NAMES[languageKey];
  
  const systemPrompt = `You are an advanced interactive quiz generator. Your task is to create quizzes strictly in the specified JSON format. The response must be a JSON object only, without any extra text, explanations, or markdown formatting.

CRITICAL: ALL TEXT CONTENT must be in ${languageName} language. This includes:
- Quiz title
- All questions
- All answer options
- All rationales
Set the "language" field to "${languageKey}".

Use this exact JSON format:
{
  "title": "",
  "language": "${languageKey}",
  "questions": [
    {
      "question": "",
      "answer_options": [
        { "text": "", "rationale": "", "is_correct": false }
      ]
    }
  ]
}`;

  const userMessage = `Generate a quiz about "${userPrompt}". Create 5 questions with 4 answer options each. IMPORTANT: Write everything in ${languageName} language only. Do not use English. Respond with valid JSON only.`;

  return [
    {
      role: "system",
      content: systemPrompt
    },
    {
      role: "user", 
      content: userMessage
    }
  ];
}

export async function generateQuizViaLocalAI(
    topic: string, 
    language: TLang,
    onProgress?: (progress: number) => void
): Promise<{ quizData: IQuizWithWrapper, rawResponseText: string }> {
    try {
        const messages = createLocalPrompt(topic, language);
        
        if (onProgress) {
            onProgress(10);
        }
        
        const response = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: messages,
                format: 'json',
                stream: false,
                temperature: 0.7,
                max_tokens: 4096
            })
        });

        if (!response.ok) {
            throw new Error(`Local AI API error: ${response.status} ${response.statusText}`);
        }

        if (onProgress) {
            onProgress(50);
        }

        const data = await response.json();
        
        if (onProgress) {
            onProgress(80);
        }
        
        const fullResponseText = data.choices?.[0]?.message?.content || '';

        if (!fullResponseText) {
            throw new Error('Empty response from Local AI model');
        }

        let jsonStr = fullResponseText.trim();
        
        const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[1]) {
            jsonStr = match[1].trim();
        }
        
        const parsedData: IQuizAiResponse = JSON.parse(jsonStr);
        
        if (parsedData && parsedData.title && parsedData.questions) {
            if (onProgress) {
                onProgress(100);
            }
            const quizData: IQuizWithWrapper = { quiz: parsedData };
            return { quizData, rawResponseText: fullResponseText };
        } else {
            throw new Error("Generated quiz data is not in the expected format.");
        }
    } catch (e) {
        console.error("Error in Local AI service:", e);
        if (e instanceof Error) {
            throw new Error(`Local AI service error: ${e.message}`);
        }
        throw new Error("An unknown error occurred in the Local AI service.");
    }
} 