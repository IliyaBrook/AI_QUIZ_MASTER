import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.scss';
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
  theme = 'vs-dark'
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value);
  };

  const getMonacoLanguage = (lang: TProgrammingLanguage): string => {
    const languageMap: Record<TProgrammingLanguage, string> = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      csharp: 'csharp',
      go: 'go',
      rust: 'rust',
      php: 'php',
      ruby: 'ruby'
    };
    return languageMap[lang] || 'javascript';
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
        }}
      />
    </div>
  );
};