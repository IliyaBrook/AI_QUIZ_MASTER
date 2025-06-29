import { pistonUrl } from '@/constants';
import { PROGRAMMING_LANGUAGE_NAMES_LOWER_CASE } from '@/data';
import type { TProgrammingLanguage } from '@/types';

export interface PistonFile {
  name?: string;
  content: string;
  encoding?: 'base64' | 'hex' | 'utf8';
}

export interface PistonExecuteRequest {
  language: string;
  version: string;
  files: PistonFile[];
  stdin?: string;
  args?: string[];
  compile_timeout?: number;
  run_timeout?: number;
  compile_memory_limit?: number;
  run_memory_limit?: number;
}

export interface PistonStageResult {
  stdout: string;
  stderr: string;
  output: string;
  code: number | null;
  signal: string | null;
}

export interface PistonExecuteResponse {
  language: string;
  version: string;
  run: PistonStageResult;
  compile?: PistonStageResult;
}

export interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
  runtime?: string;
}

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
  language: string;
  version: string;
}

export async function getAvailableRuntimes(): Promise<PistonRuntime[]> {
  try {
    const response = await fetch(`${pistonUrl}/api/v2/runtimes`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch runtimes: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Piston runtimes:', error);
    throw new Error('Failed to fetch available programming languages');
  }
}

export async function executeCode(
  code: string,
  programmingLanguage: TProgrammingLanguage
): Promise<CodeExecutionResult> {
  const startTime = Date.now();

  try {
    const pistonLanguage =
      PROGRAMMING_LANGUAGE_NAMES_LOWER_CASE[programmingLanguage];

    if (!pistonLanguage) {
      throw new Error(
        `Unsupported programming language: ${programmingLanguage}`
      );
    }

    const executeRequest: PistonExecuteRequest = {
      language: pistonLanguage,
      version: '*',
      files: [
        {
          name: getFileName(programmingLanguage),
          content: code,
        },
      ],
      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    };

    const response = await fetch(`${pistonUrl}/api/v2/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(executeRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Execution failed: ${response.status} ${response.statusText}`
      );
    }

    const result: PistonExecuteResponse = await response.json();
    const executionTime = Date.now() - startTime;

    const hasCompileError = result.compile && result.compile.code !== 0;
    const hasRuntimeError = result.run.code !== 0;

    let output = '';
    let error = '';

    if (hasCompileError && result.compile) {
      error = `Compilation Error:\n${result.compile.stderr}`;
      if (result.compile.stdout) {
        error += `\nCompilation Output:\n${result.compile.stdout}`;
      }
    } else if (hasRuntimeError) {
      error = `Runtime Error (Exit Code: ${result.run.code}):\n${result.run.stderr}`;
      output = result.run.stdout;
    } else {
      output = result.run.output || result.run.stdout;
    }

    const trimmedError = error.trim();
    const resultObj: CodeExecutionResult = {
      success: !hasCompileError && !hasRuntimeError,
      output: output.trim(),
      executionTime,
      language: result.language,
      version: result.version,
    };

    if (trimmedError) {
      resultObj.error = trimmedError;
    }

    return resultObj;
  } catch (error) {
    const executionTime = Date.now() - startTime;

    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : String(error),
      executionTime,
      language: programmingLanguage,
      version: 'unknown',
    };
  }
}

function getFileName(programmingLanguage: TProgrammingLanguage): string {
  const extensions: Record<TProgrammingLanguage, string> = {
    typescript: 'main.ts',
    python: 'main.py',
  };

  return extensions[programmingLanguage] || 'main.txt';
}

export function formatExecutionResult(result: CodeExecutionResult): string {
  let formatted = '';

  if (result.success && result.output) {
    formatted += `Output:\n${result.output}`;
  } else if (result.error) {
    formatted += `Error:\n${result.error}`;
  } else if (!result.output && !result.error) {
    formatted += 'No output';
  }

  if (result.output && result.error) {
    formatted = `Output:\n${result.output}\n\nError:\n${result.error}`;
  }

  formatted += `\n\nLanguage: ${result.language} ${result.version}`;

  if (result.executionTime !== undefined) {
    formatted += `\nExecution time: ${result.executionTime}ms`;
  }

  return formatted;
}
