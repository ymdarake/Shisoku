import React, { useState } from 'react';
import type { GameResult } from '../types';

interface EndScreenProps {
  results: GameResult[];
  onPlayAgain: () => void;
  onBackToTop: () => void;
  onSaveRanking: (name: string) => void;
  locale: { [key: string]: any };
  totalQuestions: number;
  totalTime: number;
}

export const EndScreen: React.FC<EndScreenProps> = ({ results, onPlayAgain, onBackToTop, onSaveRanking, locale, totalQuestions, totalTime }) => {
  const [name, setName] = useState('');
  const score = results.filter(r => r.isCorrect).length;

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSave = () => {
    if (name.trim()) {
      onSaveRanking(name.trim());
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4">{locale.finalResults}</h2>
      <div className="flex justify-center items-center space-x-8 mb-8 text-center">
        <p className="text-2xl font-semibold text-indigo-500">{locale.score.replace('{score}', score).replace('{total}', totalQuestions)}</p>
        <p className="text-2xl font-semibold text-green-500">{`${locale.time}: ${formatTime(totalTime)}`}</p>
      </div>
      
      <div className="max-w-md mx-auto my-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <label htmlFor="name-input" className="block text-center font-medium mb-2">{locale.enterYourName}</label>
        <div className="flex items-center space-x-2">
            <input 
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Player"
                className="flex-grow px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={handleSave} disabled={!name.trim()} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
                {locale.saveScore}
            </button>
        </div>
      </div>

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
                <tr key={index} className={result.skipped ? 'bg-yellow-50 dark:bg-yellow-900/20' : result.isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}>
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
