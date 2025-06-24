export const ollamaUrl = import.meta.env.DEV
  ? ''
  : import.meta.env.VITE_OLLAMA_URL;

export const pistonUrl = import.meta.env.DEV
  ? ''
  : import.meta.env.VITE_PISTON_URL;

export const isTestCodeChallangeGen =
  import.meta.env.VITE_IS_TEST_CODE_CHALLANGE_GEN === 'true';
