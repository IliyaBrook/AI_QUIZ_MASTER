import type { TLanguageMap, TProgrammingLanguageMap } from '@/types';

export const LANGUAGE_NAMES: TLanguageMap = {
  en: 'English',
  ru: 'Russian',
  he: 'Hebrew',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  hi: 'Hindi',
  ar: 'Arabic',
  tr: 'Turkish',
  nl: 'Dutch',
  pl: 'Polish',
  sv: 'Swedish',
  da: 'Danish',
  no: 'Norwegian',
  fi: 'Finnish',
};

export const PROGRAMMING_LANGUAGE_NAMES: TProgrammingLanguageMap = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
};

export const PROGRAMMING_LANGUAGE_NAMES_LOWER_CASE: TProgrammingLanguageMap =
  Object.entries(PROGRAMMING_LANGUAGE_NAMES).reduce(
    (acc, [key, value]) =>
      Object.assign(acc, { [key]: value.toLocaleLowerCase() }),
    PROGRAMMING_LANGUAGE_NAMES
  );
