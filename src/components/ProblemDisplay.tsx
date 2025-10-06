
import React from 'react';
import type { Problem } from '../types';

interface ProblemDisplayProps {
  problem: Problem;
  locale: { [key: string]: any };
}

export const ProblemDisplay: React.FC<ProblemDisplayProps> = ({ problem, locale }) => {
  return (
    <div className="w-full max-w-md mx-auto my-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-center text-gray-500 dark:text-gray-400 mb-2">{locale.numbersToUse}</h3>
        <div className="flex justify-center gap-2 md:gap-4">
          {problem.numbers.map((num, index) => (
            <div key={index} className="flex items-center justify-center w-16 h-20 bg-white dark:bg-gray-700 rounded-lg shadow-md text-3xl font-bold text-indigo-600 dark:text-indigo-300">
              {num}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-center text-gray-500 dark:text-gray-400 mb-2">{locale.targetNumber}</h3>
        <div className="flex items-center justify-center w-24 h-24 mx-auto bg-white dark:bg-gray-700 rounded-full shadow-lg text-5xl font-bold text-green-600 dark:text-green-400">
          {problem.target}
        </div>
      </div>
    </div>
  );
};
