export interface IAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface IAISettings {
  model?: string;
  format?: 'json' | 'text';
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  num_predict?: number;
  num_ctx?: number;
  repeat_penalty?: number;
  top_k?: number;
}

export interface IAIResponse<T = unknown> {
  data: T;
  rawResponseText: string;
} 