import type { IQuizAiResponse, IQuizWithWrapper, TLang } from '@/types';
import { LANGUAGE_NAMES } from '@/constants';

export type { TLang };

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';
const MODEL_NAME = 'qwen2.5:3b';  // options: llama3.2:3b, qwen2.5:3b, phi3:mini

function createLocalPrompt(userPrompt: string, languageKey: TLang): any[] {
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
            onProgress(15);
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
                temperature: 0.2,
                max_tokens: 1500,
                top_p: 0.95,
                frequency_penalty: 0.2,
                presence_penalty: 0.1,
                num_predict: 1500,
                num_ctx: 2048,
                repeat_penalty: 1.15,
                top_k: 30
            })
        });

        if (!response.ok) {
            throw new Error(`Local AI API error: ${response.status} ${response.statusText}`);
        }

        if (onProgress) {
            onProgress(70);
        }

        const data = await response.json();
        
        if (onProgress) {
            onProgress(90);
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