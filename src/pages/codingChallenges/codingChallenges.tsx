import React, { useState, Suspense } from 'react';
import type { ICodingChallengeWithWrapper } from '@/types';
import { LoadingSpinner } from '@/components';
import ChallengeGeneration from './ChallengeGeneration/challengeGeneration';
import ChallengePreview from './ChallengePreview/challengePreview';
import ChallengePlayground from './ChallengePlayground/challengePlayground';
import styles from './codingChallenges.module.scss';

type ChallengeScreen = 'generation' | 'preview' | 'playground';

const testChallengeData: any = {
  "challenge": {
      "title": "Перебор Массивов",
      "description": "Реализуйте функцию, которая перебирает элементы массива и выполняет определенные действия с ними.",
      "language": "ru",
      "programmingLanguage": "javascript",
      "difficulty": "medium",
      "initialCode": "\nfunction processArray(arr) {\n    // ваш код здесь\n}\n\nconsole.log('Test case 1:', processArray([1, 2, 3]));\n// Expected output: [result1, result2, result3]\n\nconsole.log('Test case 2:', processArray([4, 5]));\n// Expected output: [result4, result5]\n\nconsole.log('Test case 3:', processArray([]));\n// Expected output: []",
      "solution": "\nfunction processArray(arr) {\n    let result = [];\n    for (let i = 0; i < arr.length; i++) {\n        // здесь выполняются действия с элементами массива\n        result.push(i * 2);\n    }\n    return result;\n}",
      "testCases": [
          {
              "input": "[1, 2, 3]",
              "expectedOutput": "[2, 4, 6]"
          },
          {
              "input": "[4, 5]",
              "expectedOutput": "[8, 10]"
          },
          {
              "input": "[10]",
              "expectedOutput": "[20]"
          },
          {
              "input": "[]",
              "expectedOutput": "[]"
          }
      ],
      "hints": [
          "Попробуйте использовать цикл for для перебора элементов массива.",
          "Не забудьте вернуть результат из функции."
      ]
  }
}

const CodingChallenges: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ChallengeScreen>('generation');
  const [challengeData, setChallengeData] = useState<ICodingChallengeWithWrapper | null>(testChallengeData);

  const handleChallengeGenerated = (generatedChallengeData: ICodingChallengeWithWrapper) => {
    setChallengeData(generatedChallengeData);
    setCurrentScreen('preview');
  };

  const handleStartChallenge = () => {
    setCurrentScreen('playground');
  };

  const handleBackToGeneration = () => {
    setChallengeData(null);
    setCurrentScreen('generation');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'generation':
        return <ChallengeGeneration onChallengeGenerated={handleChallengeGenerated} />;
      case 'preview':
        return challengeData ? (
          <ChallengePreview
            challengeData={challengeData}
            onStartChallenge={handleStartChallenge}
            onBackToGeneration={handleBackToGeneration}
          />
        ) : null;
      case 'playground':
        return challengeData ? (
          <ChallengePlayground
            challengeData={challengeData}
            onBackToGeneration={handleBackToGeneration}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={styles.challengeContainer}>
      <h1>AI Coding Challenge</h1>
      {renderCurrentScreen()}
    </div>
  );
};

const CodingChallengesWithSuspense: React.FC = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <CodingChallenges />
  </Suspense>
);

export default CodingChallengesWithSuspense; 