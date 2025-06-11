import type { ICreatePromptHistoryResponse } from '@/types/createPromptHistory.types';
import type { IQuizAiResponse, IQuizWithWrapper, IAnswerOption, IQuestion, TLang } from '@/types/quizAiResponse.types';
import { LANGUAGE_NAMES } from '@/constants/models.constants';
import { geminiApiKey } from '@/utils/constants';
import { GoogleGenAI } from '@google/genai';

export type { TLang, IAnswerOption as AnswerOption, IQuestion as Question, IQuizAiResponse as Quiz, IQuizWithWrapper as QuizData };

const modelName = 'gemini-2.5-flash-preview-04-17';

let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({ apiKey: geminiApiKey });
} else {
  console.error("API_KEY is not set in environment variables. Gemini API client could not be initialized.");
}

const genAIConfig = {
  responseMimeType: 'application/json',
  temperature: 0.7,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

function createPromptHistory(userPrompt: string, languageKey: TLang): ICreatePromptHistoryResponse {
  const languageName = LANGUAGE_NAMES[languageKey];
  return [
    {
      "role": "user",
      "parts": [
        { "text": "You are an advanced interactive quiz generator. Your task is to create quizzes strictly in the specified JSON format, ensuring the keys and structure remain identical for every generated quiz. The response must be a JSON object only, without any extra text, explanations, or markdown formatting, except for the JSON itself. Pay close attention to the 'language' key and ensure all textual content (quiz title, questions, answer options, rationales) is provided in the specified language." }
      ]
    },
    {
      "role": "model",
      "parts": [
        { "text": "Understood. I will generate quizzes in the strict JSON format, without additional text, and ensure all content is in the requested language. Please provide the quiz topic, number of questions, and the desired language for the quiz." }
      ]
    },
    {
      "role": "user",
      "parts": [
        { "text": "Generate a quiz on the history of Ancient Egypt, 3 questions. The desired language for the quiz is English. Use the following JSON format for the response: \n\n```json\n{\n  \"title\": \"\",\n  \"language\": \"\",\n  \"questions\": [\n    {\n      \"question\": \"\",\n      \"answer_options\": [\n        { \"text\": \"\", \"rationale\": \"\", \"is_correct\": false }\n      ]\n    }\n  ]\n}\n```" }
      ]
    },
    {
      "role": "model",
      "parts": [
        { "text": "```json\n{\n  \"title\": \"Quiz: History of Ancient Egypt\",\n  \"language\": \"en\",\n  \"questions\": [\n    {\n      \"question\": \"Which pharaoh is famous for their golden burial mask found in their tomb?\",\n      \"answer_options\": [\n        { \"text\": \"Ramses II\", \"rationale\": \"Ramses II was a powerful pharaoh, but not primarily known for a golden burial mask.\", \"is_correct\": false },\n        { \"text\": \"Akhenaten\", \"rationale\": \"Akhenaten was known for his religious reforms, not a golden burial mask.\", \"is_correct\": false },\n        { \"text\": \"Tutankhamun\", \"rationale\": \"Tutankhamun's nearly intact tomb, discovered by Howard Carter, contained his famous golden burial mask.\", \"is_correct\": true },\n        { \"text\": \"Hatshepsut\", \"rationale\": \"Hatshepsut was a powerful female pharaoh, but her legacy isn't centered on a golden mask.\", \"is_correct\": false }\n      ]\n    },\n    {\n      \"question\": \"What river was crucial to the civilization of Ancient Egypt?\",\n      \"answer_options\": [\n        { \"text\": \"Tigris River\", \"rationale\": \"The Tigris River is associated with Mesopotamia.\", \"is_correct\": false },\n        { \"text\": \"Euphrates River\", \"rationale\": \"The Euphrates River is associated with Mesopotamia.\", \"is_correct\": false },\n        { \"text\": \"Nile River\", \"rationale\": \"The Nile River provided fertile land, transportation, and resources essential for Ancient Egyptian civilization.\", \"is_correct\": true },\n        { \"text\": \"Indus River\", \"rationale\": \"The Indus River is associated with ancient Indian civilizations.\", \"is_correct\": false }\n      ]\n    },\n    {\n      \"question\": \"What large structures were built as tombs for pharaohs?\",\n      \"answer_options\": [\n        { \"text\": \"Ziggurats\", \"rationale\": \"Ziggurats were massive structures built in ancient Mesopotamia.\", \"is_correct\": false },\n        { \"text\": \"Pyramids\", \"rationale\": \"Pyramids were monumental structures built primarily as tombs for pharaohs and their consorts during the Old and Middle Kingdom periods.\", \"is_correct\": true },\n        { \"text\": \"Temples\", \"rationale\": \"Temples were built for worship, not primarily as tombs.\", \"is_correct\": false },\n        { \"text\": \"Obelisks\", \"rationale\": \"Obelisks were tall, four-sided, narrow tapering monuments, but not tombs.\", \"is_correct\": false }\n      ]\n    }\n  ]\n}\n```" }
      ]
    },
    {
      "role": "user",
      "parts": [
        { "text": `Generate a quiz based on the topic: "${userPrompt}". Create 5 questions. The desired language for the quiz is ${languageName} (${languageKey}). Use the exact JSON format provided above.` }
      ]
    }
  ];
}

export async function generateQuizViaGemini(topic: string, language: TLang): Promise<{ quizData: IQuizWithWrapper, rawResponseText: string }> {
    if (!ai) {
        throw new Error("Gemini API client is not initialized. API Key may be missing or invalid.");
    }

    const contents = createPromptHistory(topic, language);
    
    try {
        const stream = await ai.models.generateContentStream({
            model: modelName,
            config: genAIConfig,
            contents: contents,
        });

        let fullResponseText = '';
        for await (const chunk of stream) {
            fullResponseText += chunk.text || '';
        }

        let jsonStr = fullResponseText.trim();
        const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[1]) {
            jsonStr = match[1].trim();
        }
        
        const parsedData: IQuizAiResponse = JSON.parse(jsonStr);
        if (parsedData && parsedData.title && parsedData.questions) {
            const quizData: IQuizWithWrapper = { quiz: parsedData };
            return { quizData, rawResponseText: fullResponseText };
        } else {
            throw new Error("Generated quiz data is not in the expected format.");
        }
    } catch (e) {
        console.error("Error in Gemini service:", e);
        if (e instanceof Error) {
            throw new Error(`Gemini service error: ${e.message}`);
        }
        throw new Error("An unknown error occurred in the Gemini service.");
    }
}
