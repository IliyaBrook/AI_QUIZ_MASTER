/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  // Печать
  printWidth: 80,
  
  // Отступы
  tabWidth: 2,
  useTabs: false,
  
  // Точки с запятой
  semi: true,
  
  // Кавычки
  singleQuote: true,
  jsxSingleQuote: true,
  
  // Запятые
  trailingComma: 'es5',
  
  // Пробелы в объектах
  bracketSpacing: true,
  
  // JSX скобки
  bracketSameLine: false,
  
  // Стрелочные функции
  arrowParens: 'avoid',
  
  // Переносы строк
  endOfLine: 'lf',
  
  // Встроенная поддержка HTML, CSS, JSON
  htmlWhitespaceSensitivity: 'css',
  
  // Форматирование встроенного кода
  embeddedLanguageFormatting: 'auto',
};

export default config; 