import Editor from '@monaco-editor/react';
import React, { useRef } from 'react';

import './CodeEditor.scss';

import type { TProgrammingLanguage } from '@/types';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: TProgrammingLanguage;
  height?: string;
  readOnly?: boolean;
  theme?: 'vs-dark' | 'light';
  path?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  height = '400px',
  readOnly = false,
  theme = 'vs-dark',
  path,
}) => {
  const editorRef = useRef(null);
  const uniqueId = useRef(Math.random().toString(36).substr(2, 9));

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value);
  };

  const handleBeforeMount = (monaco: any) => {
    // Configure TypeScript language service for better IntelliSense
    const compilerOptions = {
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
      strict: false,
      noImplicitAny: false,
    };

    const diagnosticsOptions = {
      noSemanticValidation: false,
      noSyntaxValidation: false,
      // Don't show TypeScript-specific errors for pure language features
      diagnosticCodesToIgnore: [],
    };

    // Configure TypeScript defaults
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
      compilerOptions
    );
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
      diagnosticsOptions
    );
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

    // Also configure JavaScript defaults for backwards compatibility
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
      compilerOptions
    );
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
      diagnosticsOptions
    );
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

    // Ensure TypeScript language is properly registered
    if (
      !monaco.languages
        .getLanguages()
        .find((lang: any) => lang.id === 'typescript')
    ) {
      console.warn('TypeScript language not found in Monaco Editor');
    }
  };

  const getMonacoLanguage = (lang: TProgrammingLanguage): string => {
    const languageMap: Record<TProgrammingLanguage, string> = {
      typescript: 'typescript',
      python: 'python',
    };
    return languageMap[lang] || 'typescript';
  };

  return (
    <div className='code-editor-container'>
      <Editor
        className='code-editor'
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        beforeMount={handleBeforeMount}
        theme={theme}
        path={
          path ||
          `${readOnly ? 'solution' : 'user'}-${uniqueId.current}.${language === 'typescript' ? 'ts' : 'py'}`
        }
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          folding: true,
          lineDecorationsWidth: 20,
          lineNumbersMinChars: 3,
          glyphMargin: false,
          fixedOverflowWidgets: true,
          // Enhanced IntelliSense options
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
          parameterHints: {
            enabled: true,
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showColor: false,
            showFile: false,
            showReference: false,
            showFolder: false,
            showTypeParameter: true,
            showUnit: false,
            showValue: true,
            showModule: false,
            showProperty: true,
            showEvent: false,
            showOperator: false,
            showVariable: true,
            showClass: true,
            showInterface: true,
            showStruct: false,
            showEnum: false,
            showEnumMember: false,
            showFunction: true,
            showField: true,
            showConstant: true,
            showConstructor: true,
            showUser: false,
            showIssue: false,
          },
        }}
      />
    </div>
  );
};
