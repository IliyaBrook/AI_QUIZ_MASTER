import Editor from '@monaco-editor/react';
import React, { useRef } from 'react';

import './CodeEditor.scss';

import { PROGRAMMING_LANGUAGE_NAMES_LOWER_CASE } from '@/data';
import type { TProgrammingLanguage } from '@/types';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: TProgrammingLanguage;
  height?: string;
  readOnly?: boolean;
  theme?: 'vs-dark' | 'light';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  height = '400px',
  readOnly = false,
  theme = 'vs-dark',
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value);
  };

  const handleBeforeMount = (monaco: any) => {
    // Configure JavaScript/TypeScript language service for better IntelliSense
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
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
    });

    // Configure diagnostics
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // Enable IntelliSense suggestions
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  };

  const getMonacoLanguage = (lang: TProgrammingLanguage): string => {
    return PROGRAMMING_LANGUAGE_NAMES_LOWER_CASE[lang] || 'node';
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
