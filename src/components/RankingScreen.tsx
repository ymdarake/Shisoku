import React from 'react';
import type { RankingEntry, Difficulty } from '../types';
import { formatTime } from '../utils/formatTime';

interface RankingScreenProps {
  rankings: RankingEntry[];
  onBackToTop: () => void;
  locale: { [key: string]: any };
  difficulty?: Difficulty;
}

export const RankingScreen: React.FC<RankingScreenProps> = ({ rankings, onBackToTop, locale, difficulty = 'normal' }) => {
  const difficultyLabel =
    difficulty === 'easy' ? locale.difficultyEasy : difficulty === 'hard' ? locale.difficultyHard : locale.difficultyNormal;
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">{`${locale.ranking} (${difficultyLabel})`}</h2>

      {rankings.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{locale.rank}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{locale.name}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{locale.score.split(':')[0]}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{locale.time}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{locale.date}</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {rankings.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{entry.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.score}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatTime(entry.time)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(entry.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 my-12">{locale.noRankings}</p>
      )}


      <div className="flex justify-center">
        <button onClick={onBackToTop} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition">{locale.backToMenu}</button>
      </div>
    </div>
  );
};
