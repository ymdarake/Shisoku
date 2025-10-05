
import React from 'react';
import type { GameResult } from '../types';

interface EndScreenProps {
  results: GameResult[];
  onPlayAgain: () => void;
  onBackToTop: () => void;
  locale: { [key: string]: any };
  totalQuestions: number;
}

export const EndScreen: React.FC<EndScreenProps> = ({ results, onPlayAgain, onBackToTop, locale, totalQuestions }) => {
  const score = results.filter(r => r.isCorrect).length;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4">{locale.finalResults}</h2>
      <p className="text-2xl text-center mb-8 font-semibold text-indigo-500">{locale.score.replace('{score}', score).replace('{total}', totalQuestions)}</p>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{locale.question}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{locale.yourAnswer}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{locale.status}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result, index) => (
                <tr key={index} className={result.isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{`[${result.problem.numbers.join(', ')}] -> ${result.problem.target}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{result.skipped ? '---' : result.userAnswer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    {result.skipped ? locale.statusSkipped : (result.isCorrect ? locale.statusCorrect : locale.statusIncorrect)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button onClick={onPlayAgain} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">{locale.playAgain}</button>
        <button onClick={onBackToTop} className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow hover:bg-gray-700 transition">{locale.backToTop}</button>
      </div>
    </div>
  );
};
