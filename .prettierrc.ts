import { type Config } from "prettier";

const config: Config = {
    printWidth: 80,
    useTabs: false,
    tabWidth: 2,
    trailingComma: 'es5',
    semi: true,
    singleQuote: true,
    jsxSingleQuote: true,
    bracketSpacing: true,
    arrowParens: 'always',
    bracketSameLine: false,
    endOfLine: 'lf',
    embeddedLanguageFormatting: 'auto',
    htmlWhitespaceSensitivity: 'css'
};

export default config;