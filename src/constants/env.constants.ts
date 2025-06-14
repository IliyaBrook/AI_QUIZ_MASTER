export const ollamaUrl =
  import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434';

export const isTestCodeChallangeGen =
  import.meta.env.VITE_IS_TEST_CODE_CHALLANGE_GEN === 'true';
