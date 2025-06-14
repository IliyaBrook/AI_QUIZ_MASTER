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
    title: 'Перебор Массивов',
    description:
      'Реализуйте функцию, которая перебирает элементы массива и выполняет определенные действия с каждым из них.',
    language: 'ru',
    programmingLanguage: 'javascript',
    difficulty: 'medium',
    initialCode:
      "function processArray(arr) {\n    // ваш код здесь\n}\n\nconsole.log('Test case 1:', processArray([1, 2, 3]));\n// Expected output: [result1, result2, result3]\n\nconsole.log('Test case 2:', processArray(['a', 'b']));\n// Expected output: ['resultA', 'resultB']\n\nconsole.log('Test case 3:', processArray([]));\n// Expected output: []",
    solution:
      'function processArray(arr) {\n    let result = [];\n    for (let i = 0; i < arr.length; i++) {\n        result.push(i * 2);\n    }\n    return result;\n}',
    testCases: [
      {
        input: '[1, 2, 3]',
        expectedOutput: '[2, 4, 6]',
      },
      {
        input: ['a', 'b'],
        expectedOutput: ['resultA', 'resultB'],
      },
      {
        input: [],
        expectedOutput: [],
      },
    ],
    hints: [
      'Попробуйте использовать цикл for для перебора массива.',
      'Не забудьте вернуть результат из функции.',
    ],
  },
};

export const userCode = `
user code: function processArray(arr) {
    // ваш код здесь
}

console.log('Test case 1:', processArray([1, 2, 3]));
// Expected output: [result1, result2, result3]

console.log('Test case 2:', processArray(['a', 'b']));
// Expected output: ['resultA', 'resultB']

console.log('Test case 3:', processArray([]));
// Expected output: []
`;
