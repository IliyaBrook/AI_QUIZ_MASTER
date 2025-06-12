import type { IAIMessage, IAISettings, IAIResponse } from '@/types';
import { DEFAULT_AI_SETTINGS } from '@/constants';

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';

export async function generateResponse<T = unknown>(
  messages: IAIMessage[],
  settings: Partial<IAISettings> = {},
  onProgress?: (progress: number) => void
): Promise<IAIResponse<T>> {
  try {
    const finalSettings = { ...DEFAULT_AI_SETTINGS, ...settings };
    
    if (onProgress) {
      onProgress(15);
    }

    const response = await fetch(`${OLLAMA_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: finalSettings.model,
        messages: messages,
        format: finalSettings.format,
        stream: finalSettings.stream,
        temperature: finalSettings.temperature,
        max_tokens: finalSettings.max_tokens,
        top_p: finalSettings.top_p,
        frequency_penalty: finalSettings.frequency_penalty,
        presence_penalty: finalSettings.presence_penalty,
        num_predict: finalSettings.num_predict,
        num_ctx: finalSettings.num_ctx,
        repeat_penalty: finalSettings.repeat_penalty,
        top_k: finalSettings.top_k,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Local AI API error: ${response.status} ${response.statusText}`
      );
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

    if (finalSettings.format === 'json') {
      const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }

      const parsedData: T = JSON.parse(jsonStr);

      if (onProgress) {
        onProgress(100);
      }

      return {
        data: parsedData,
        rawResponseText: fullResponseText,
      };
    } else {
      if (onProgress) {
        onProgress(100);
      }

      return {
        data: fullResponseText as T,
        rawResponseText: fullResponseText,
      };
    }
  } catch (e) {
    console.error('Error in Local AI service:', e);
    if (e instanceof Error) {
      throw new Error(`Local AI service error: ${e.message}`);
    }
    throw new Error('An unknown error occurred in the Local AI service.');
  }
}
