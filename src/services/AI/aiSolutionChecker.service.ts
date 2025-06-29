import { LANGUAGE_NAMES } from '@/data';
import { executeCode, generateResponse } from '@/services';
import type { IAIMessage, ICodingChallenge, TLang } from '@/types';

export interface ISolutionCheckResult {
  isCorrect: boolean;
  message: string;
  details?: {
    expectedOutput: string;
    actualOutput: string;
    testCase: string;
  };
}

export interface ISolutionCheckWithWrapper {
  result: ISolutionCheckResult;
}

function extractFunctionFromCode(code: string): string {
  const lines = code.split('\n');
  const functionStartIndex = lines.findIndex(
    (line) =>
      line.trim().startsWith('function ') ||
      line.trim().includes('function ') ||
      line.trim().includes('=>') ||
      (line.trim().includes('const ') && line.trim().includes('='))
  );

  if (functionStartIndex === -1) {
    return code;
  }

  let braceCount = 0;
  let functionEndIndex = functionStartIndex;
  let insideFunction = false;

  for (let i = functionStartIndex; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    if (line.includes('{')) {
      braceCount += (line.match(/\{/g) || []).length;
      insideFunction = true;
    }

    if (line.includes('}')) {
      braceCount -= (line.match(/\}/g) || []).length;
    }

    if (insideFunction && braceCount === 0) {
      functionEndIndex = i;
      break;
    }

    if (!insideFunction && line.trim() && !line.trim().startsWith('//')) {
      functionEndIndex = i;
      break;
    }
  }

  return lines.slice(functionStartIndex, functionEndIndex + 1).join('\n');
}

function extractFunctionName(code: string): string {
  const functionMatch = code.match(/function\s+(\w+)\s*\(/);
  if (functionMatch && functionMatch[1]) {
    return functionMatch[1];
  }

  const constMatch = code.match(/const\s+(\w+)\s*=/);
  if (constMatch && constMatch[1]) {
    return constMatch[1];
  }

  return 'func';
}

function analyzeFunctionSignature(code: string): {
  name: string;
  parameterCount: number;
  parameters: string[];
} {
  const functionName = extractFunctionName(code);

  const functionMatch = code.match(/function\s+\w+\s*\(([^)]*)\)/);
  if (functionMatch && functionMatch[1] !== undefined) {
    const paramsStr = functionMatch[1].trim();
    if (!paramsStr) {
      return { name: functionName, parameterCount: 0, parameters: [] };
    }

    const parameters = paramsStr
      .split(',')
      .map((p) => p.trim().split(':')[0]?.trim() || '')
      .filter((p) => p);
    return {
      name: functionName,
      parameterCount: parameters.length,
      parameters,
    };
  }

  const constMatch = code.match(/const\s+\w+\s*=\s*\(([^)]*)\)/);
  if (constMatch && constMatch[1] !== undefined) {
    const paramsStr = constMatch[1].trim();
    if (!paramsStr) {
      return { name: functionName, parameterCount: 0, parameters: [] };
    }

    const parameters = paramsStr
      .split(',')
      .map((p) => p.trim().split(':')[0]?.trim() || '')
      .filter((p) => p);
    return {
      name: functionName,
      parameterCount: parameters.length,
      parameters,
    };
  }

  return { name: functionName, parameterCount: 0, parameters: [] };
}

function createTestCodeGenerationPrompt(
  functionCode: string,
  testCases: any[],
  programmingLanguage: string,
  languageKey: TLang
): IAIMessage[] {
  const languageName = LANGUAGE_NAMES[languageKey];

  const systemPrompt = `Generate test code for a ${programmingLanguage} function. Language: ${languageName}. Return ONLY the complete executable code.

TASK:
1. Analyze the provided function code
2. Generate test calls that properly invoke the function with given test cases
3. Each test call should output the result using console.log(JSON.stringify(result))
4. Handle ALL function types: regular functions, closures, arrow functions, etc.

REQUIREMENTS:
- Include the original function code at the top
- Add test calls that match the function's calling pattern
- For closures: use pattern like functionName()(args)
- For regular functions: use pattern like functionName(args)
- For arrow functions: analyze the pattern and call accordingly
- Output results with console.log(JSON.stringify(result))
- NO explanations, ONLY executable code

Example patterns:
- Regular: myFunc(1, 2)
- Closure: createClosure()(1, 2)  
- Higher order: processArray([1,2,3])

Generate complete test code now.`;

  const testCasesDescription = testCases
    .map(
      (tc, i) =>
        `Test ${i + 1}: input="${tc.input}", expected="${tc.expectedOutput}"`
    )
    .join('\n');

  const userMessage = `Function Code:
${functionCode}

Test Cases:
${testCasesDescription}

Programming Language: ${programmingLanguage}

ANALYSIS TASK:
1. Look at the function signature and understand how it should be called
2. Generate test code that properly invokes this function with the test cases
3. Each test should output: console.log(JSON.stringify(functionCall))

Generate ONLY the complete executable ${programmingLanguage} code. No explanations.`;

  return [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: userMessage,
    },
  ];
}

async function generateTestCode(
  functionCode: string,
  testCases: any[],
  programmingLanguage: string,
  languageKey: TLang
): Promise<string> {
  const messages = createTestCodeGenerationPrompt(
    functionCode,
    testCases,
    programmingLanguage,
    languageKey
  );

  try {
    const response = await generateResponse(messages, { format: 'text' });

    if (!response || !response.rawResponseText) {
      throw new Error('Empty response from AI');
    }

    let codeText = response.rawResponseText.trim();

    if (codeText.includes('```')) {
      const codeMatch = codeText.match(
        /```(?:typescript|javascript|ts|js|python|py)?\n([\s\S]*?)\n```/
      );
      if (codeMatch && codeMatch[1]) {
        codeText = codeMatch[1].trim();
      }
    }

    return codeText;
  } catch (error) {
    console.error(
      'Failed to generate test code with AI, falling back to simple approach:',
      error
    );

    const signature = analyzeFunctionSignature(functionCode);
    let testCode = functionCode + '\n\n';

    testCases.forEach((testCase) => {
      let functionCall: string;

      if (signature.parameterCount === 0) {
        functionCall = `${signature.name}()`;
      } else {
        functionCall = `${signature.name}(${testCase.input})`;
      }

      if (programmingLanguage === 'typescript') {
        testCode += `console.log(JSON.stringify(${functionCall}));\n`;
      } else {
        testCode += `print(json.dumps(${functionCall}))\n`;
      }
    });

    return testCode;
  }
}

async function runCodeWithTests(
  functionCode: string,
  testCases: any[],
  programmingLanguage: string,
  languageKey: TLang
): Promise<string[]> {
  const testCode = await generateTestCode(
    functionCode,
    testCases,
    programmingLanguage,
    languageKey
  );

  console.log('🧪 Running test code:', testCode);

  const result = await executeCode(testCode, programmingLanguage as any);

  if (!result.success) {
    throw new Error(`Code execution failed: ${result.error}`);
  }

  return result.output.split('\n').filter((line) => line.trim());
}

function createAIComparisonPrompt(
  userOutput: string[],
  expectedOutput: string[],
  challenge: ICodingChallenge,
  languageKey: TLang
): IAIMessage[] {
  const languageName = LANGUAGE_NAMES[languageKey];

  const systemPrompt = `Compare execution results and determine if user's solution is correct. Language: ${languageName}. Format:
{
  "isCorrect": true/false,
  "message": "Success message or explanation of differences",
  "details": {
    "expectedOutput": "expected results",
    "actualOutput": "user's results", 
    "testCase": "context information"
  }
}

COMPARISON RULES:
1. If outputs are identical or functionally equivalent - mark as CORRECT
2. Ignore minor formatting differences (spaces, brackets, etc.)
3. Focus on actual values and their correctness
4. Consider different valid representations of same data as correct
5. If outputs match the expected logic - mark as CORRECT

JSON arrays [1,2,3] and [1, 2, 3] are equivalent.
"123" and [1,2,3] can be equivalent if task expects concatenation vs array.

If correct - provide encouraging message in ${languageName}.
If incorrect - explain specific differences and what was expected.`;

  const userMessage = `Challenge: "${challenge.title}"
Description: "${challenge.description}"

Expected Output (from official solution):
${expectedOutput.join('\n')}

User's Output:
${userOutput.join('\n')}

ANALYSIS:
1. Compare the actual outputs line by line
2. Determine if they represent the same logical result
3. Consider the task requirements from description
4. Account for different valid data representations

Are these outputs equivalent for this task? Respond in JSON format. Message in ${languageName} language.`;

  return [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: userMessage,
    },
  ];
}

export async function checkSolution(
  userCode: string,
  challenge: ICodingChallenge,
  language: TLang,
  onProgress?: (progress: number) => void
): Promise<{
  checkData: ISolutionCheckWithWrapper;
  rawResponseText: string;
}> {
  console.log('🔍 AI Solution Checker - Starting execution-based check');
  console.log('👤 User Code (RAW):', userCode);
  console.log('🏆 Official Solution (RAW):', challenge.solution);

  try {
    onProgress?.(20);

    let userFunctionCode = extractFunctionFromCode(userCode);
    const officialFunctionCode = extractFunctionFromCode(challenge.solution);

    console.log('📝 Extracted User Function:', userFunctionCode);
    console.log('📝 Extracted Official Function:', officialFunctionCode);

    if (
      userFunctionCode.includes('// your code here') ||
      userFunctionCode.trim() === challenge.description
    ) {
      console.warn(
        '⚠️ User function code still contains placeholder or description - using full user code'
      );
      userFunctionCode = userCode.trim();
      console.log('📝 Using corrected user code:', userFunctionCode);
    }

    if (officialFunctionCode.includes('// your code here')) {
      console.error(
        '❌ Official solution contains placeholder - cannot validate'
      );
      const errorResult: ISolutionCheckResult = {
        isCorrect: false,
        message:
          'Internal error: Official solution is not properly configured. Please contact the administrator.',
        details: {
          expectedOutput: 'Valid official solution required',
          actualOutput: 'Official solution contains placeholder',
          testCase: challenge.title,
        },
      };

      return {
        checkData: { result: errorResult },
        rawResponseText: JSON.stringify(errorResult),
      };
    }

    onProgress?.(40);

    let userResults: string[];
    try {
      console.log('🧪 Running user code...');
      userResults = await runCodeWithTests(
        userFunctionCode,
        challenge.testCases,
        challenge.programmingLanguage,
        language
      );
      console.log('📊 User Results:', userResults);
    } catch (userError) {
      console.error('❌ User code execution failed:', userError);

      const isCompilationError =
        userError instanceof Error &&
        userError.message.includes('Compilation Error');

      const errorResult: ISolutionCheckResult = {
        isCorrect: false,
        message: isCompilationError
          ? 'Your code contains compilation errors. Make sure the function is correctly implemented and returns a value.'
          : `Error executing your code: ${userError instanceof Error ? userError.message : String(userError)}`,
        details: {
          expectedOutput: 'Code should compile and execute successfully',
          actualOutput:
            userError instanceof Error ? userError.message : String(userError),
          testCase: challenge.title,
        },
      };

      return {
        checkData: { result: errorResult },
        rawResponseText: JSON.stringify(errorResult),
      };
    }

    onProgress?.(60);

    let officialResults: string[];
    try {
      console.log('🧪 Running official solution...');
      officialResults = await runCodeWithTests(
        officialFunctionCode,
        challenge.testCases,
        challenge.programmingLanguage,
        language
      );
      console.log('📊 Official Results:', officialResults);
    } catch (officialError) {
      console.error('❌ Official solution execution failed:', officialError);

      const errorResult: ISolutionCheckResult = {
        isCorrect: false,
        message:
          'Internal error: Failed to execute the reference solution. Please contact the administrator.',
        details: {
          expectedOutput: 'Reference solution should work correctly',
          actualOutput: userResults.join(', '),
          testCase: challenge.title,
        },
      };

      return {
        checkData: { result: errorResult },
        rawResponseText: JSON.stringify(errorResult),
      };
    }

    onProgress?.(80);

    const resultsMatch =
      JSON.stringify(userResults) === JSON.stringify(officialResults);

    if (resultsMatch) {
      console.log('✅ Results match - solution is correct!');

      const result: ISolutionCheckResult = {
        isCorrect: true,
        message:
          'Excellent! Your solution works correctly and produces the expected results.',
        details: {
          expectedOutput: officialResults.join(', '),
          actualOutput: userResults.join(', '),
          testCase: `All tests passed successfully for challenge: ${challenge.title}`,
        },
      };

      return {
        checkData: { result },
        rawResponseText: JSON.stringify(result),
      };
    }

    console.log('❌ Results differ - using AI for detailed comparison...');

    const messages = createAIComparisonPrompt(
      userResults,
      officialResults,
      challenge,
      language
    );

    const response = await generateResponse<ISolutionCheckResult>(
      messages,
      {},
      onProgress
    );

    if (response.data && typeof response.data.isCorrect === 'boolean') {
      return {
        checkData: { result: response.data },
        rawResponseText: response.rawResponseText,
      };
    } else {
      throw new Error(
        'Generated solution check data is not in the expected format.'
      );
    }
  } catch (error) {
    console.error('❌ Unexpected error in solution check:', error);

    const errorResult: ISolutionCheckResult = {
      isCorrect: false,
      message: `An unexpected error occurred while checking the solution: ${error instanceof Error ? error.message : String(error)}`,
      details: {
        expectedOutput: 'Failed to perform check',
        actualOutput: 'System error',
        testCase: challenge.title,
      },
    };

    return {
      checkData: { result: errorResult },
      rawResponseText: JSON.stringify(errorResult),
    };
  }
}
