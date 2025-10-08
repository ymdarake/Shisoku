import React, { useEffect, useState } from 'react';
import type { Difficulty } from '../types';
import type { RankingEntry } from '../domain/ranking/type';
import { formatTime } from '../utils/formatTime';
import { useRankingService } from '../context/RankingServiceContext';

interface RankingScreenProps {
  rankings: RankingEntry[]; // 初期表示用（現在の難易度）
  onBackToTop: () => void;
  locale: { [key: string]: any };
  difficulty?: Difficulty;
}

export const RankingScreen: React.FC<RankingScreenProps> = ({ rankings, onBackToTop, locale, difficulty = 'normal' }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(difficulty);
  const [list, setList] = useState<RankingEntry[]>(rankings);
  const rankingService = useRankingService();

  useEffect(() => {
    setSelectedDifficulty(difficulty);
    setList(rankings);
  }, [difficulty, rankings]);

  useEffect(() => {
    rankingService.getRankings(selectedDifficulty).then(setList);
  }, [rankingService, selectedDifficulty]);

  const difficultyLabel =
    selectedDifficulty === 'easy' ? locale.difficultyEasy : selectedDifficulty === 'hard' ? locale.difficultyHard : locale.difficultyNormal;
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">{`${locale.ranking} (${difficultyLabel})`}</h2>

      {/* 難易度タブ */}
      <div className="flex justify-center mb-4 space-x-2">
        <button
          onClick={() => setSelectedDifficulty('easy')}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition ${selectedDifficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-green-100 dark:bg-green-900/30'}`}
        >
          {locale.difficultyEasy}
        </button>
        <button
          onClick={() => setSelectedDifficulty('normal')}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition ${selectedDifficulty === 'normal' ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-blue-900/30'}`}
        >
          {locale.difficultyNormal}
        </button>
        <button
          onClick={() => setSelectedDifficulty('hard')}
          className={`px-3 py-1 rounded-md text-sm font-semibold transition ${selectedDifficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-red-100 dark:bg-red-900/30'}`}
        >
          {locale.difficultyHard}
        </button>
      </div>

      {list.length > 0 ? (
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
                {list.map((entry, index) => (
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
