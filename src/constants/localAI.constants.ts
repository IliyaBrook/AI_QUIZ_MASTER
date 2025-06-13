import type { IAISettings } from '@/types';

export const DEFAULT_AI_SETTINGS: Required<IAISettings> = {
  model: 'qwen2.5:3b',
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
  top_k: 30,
};
