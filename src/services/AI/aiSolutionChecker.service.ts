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
    const response = await generateResponse<{ code: string }>(messages, {});

    if (!response || !response.rawResponseText) {
      throw new Error('Empty response from AI');
    }

    // AI should return just the code, not wrapped in JSON
    if (response.rawResponseText.includes('```')) {
      // Extract code from markdown blocks
      const codeMatch = response.rawResponseText.match(
        /```(?:typescript|javascript|ts|js)?\n([\s\S]*?)\n```/
      );
      if (codeMatch && codeMatch[1]) {
        return codeMatch[1].trim();
      }
    }

    // If no code blocks, treat entire response as code
    return response.rawResponseText.trim();
  } catch (error) {
    console.error(
      'Failed to generate test code with AI, falling back to simple approach:',
      error
    );

    // Fallback to basic approach
    const functionName = extractFunctionName(functionCode);
    let testCode = functionCode + '\n\n';

    testCases.forEach((testCase) => {
      if (programmingLanguage === 'typescript') {
        testCode += `console.log(JSON.stringify(${functionName}(${testCase.input})));\n`;
      } else {
        testCode += `print(json.dumps(${functionName}(${testCase.input})))\n`;
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
  console.log('👤 User Code:', userCode);
  console.log('🏆 Official Solution:', challenge.solution);

  try {
    onProgress?.(20);

    const userFunctionCode = extractFunctionFromCode(userCode);
    const officialFunctionCode = extractFunctionFromCode(challenge.solution);

    console.log('📝 Extracted User Function:', userFunctionCode);
    console.log('📝 Extracted Official Function:', officialFunctionCode);

    onProgress?.(40);

    console.log('🧪 Running user code...');
    const userResults = await runCodeWithTests(
      userFunctionCode,
      challenge.testCases,
      challenge.programmingLanguage,
      language
    );

    onProgress?.(60);

    console.log('🧪 Running official solution...');
    const officialResults = await runCodeWithTests(
      officialFunctionCode,
      challenge.testCases,
      challenge.programmingLanguage,
      language
    );

    onProgress?.(80);

    console.log('📊 User Results:', userResults);
    console.log('📊 Official Results:', officialResults);

    const resultsMatch =
      JSON.stringify(userResults) === JSON.stringify(officialResults);

    if (resultsMatch) {
      console.log('✅ Results match - solution is correct!');

      const result: ISolutionCheckResult = {
        isCorrect: true,
        message:
          'Отлично! Ваше решение работает правильно и дает корректные результаты.',
        details: {
          expectedOutput: officialResults.join(', '),
          actualOutput: userResults.join(', '),
          testCase: `Все тесты пройдены успешно для задачи: ${challenge.title}`,
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
    console.error('❌ Solution check failed:', error);

    const errorResult: ISolutionCheckResult = {
      isCorrect: false,
      message: `Ошибка при выполнении кода: ${error instanceof Error ? error.message : String(error)}`,
      details: {
        expectedOutput: 'Не удалось выполнить',
        actualOutput: 'Ошибка выполнения',
        testCase: challenge.title,
      },
    };

    return {
      checkData: { result: errorResult },
      rawResponseText: JSON.stringify(errorResult),
    };
  }
}
