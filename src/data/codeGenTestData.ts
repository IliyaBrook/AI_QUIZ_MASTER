import type { ICodingChallenge } from '@/types';

interface IUseChallengePlaygroundData {
  challenge: ICodingChallenge;
  showSolution: boolean;
  showHints: boolean;
}

export const useChallengePlaygroundData: IUseChallengePlaygroundData = {
  showSolution: true,
  showHints: true,
  challenge: {
    title: 'Array Iteration',
    description:
      'Implement a function that iterates through array elements and performs certain actions with each of them.',
    language: 'en',
    programmingLanguage: 'typescript',
    difficulty: 'medium',
    initialCode:
      "function processArray(arr: number[]): number[] {\n    // your code here\n}\n\nconsole.log('Test case 1:', processArray([1, 2, 3]));\n// Expected output: [result1, result2, result3]\n\nconsole.log('Test case 2:', processArray([4, 5]));\n// Expected output: [result4, result5]\n\nconsole.log('Test case 3:', processArray([]));\n// Expected output: []",
    solution:
      'function processArray(arr: number[]): number[] {\n    let result: number[] = [];\n    for (let i = 0; i < arr.length; i++) {\n        result.push(i * 2);\n    }\n    return result;\n}',
    testCases: [
      {
        input: '[1, 2, 3]',
        expectedOutput: '[0, 2, 4]',
      },
      {
        input: '[4, 5]',
        expectedOutput: '[0, 2]',
      },
      {
        input: '[]',
        expectedOutput: '[]',
      },
    ],
    hints: [
      'Try using a for loop to iterate through the array.',
      "Don't forget to return the result from the function.",
    ],
  },
};

export const userCode = `
user code: function processArray(arr: number[]): number[] {
    // your code here
}

console.log('Test case 1:', processArray([1, 2, 3]));
// Expected output: [result1, result2, result3]

console.log('Test case 2:', processArray([4, 5]));
// Expected output: [result4, result5]

console.log('Test case 3:', processArray([]));
// Expected output: []
`;
