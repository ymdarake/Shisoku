import React from 'react';
import { Rules } from './Rules';
import { DifficultySelector } from './DifficultySelector';
import { KofiWidget } from './KofiWidget';
import { KOFI_URL } from '../constant/kofi';
import type { Difficulty } from '../types';

interface StartScreenProps {
  onStart: () => void;
  onShowRanking: () => void;
  locale: { [key: string]: any };
  difficulty?: Difficulty;
  onSelectDifficulty?: (d: Difficulty) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowRanking, locale, difficulty = 'normal', onSelectDifficulty }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <Rules
        title={locale.ruleTitle}
        rules={locale.rules}
        exampleTitle={locale.exampleTitle}
        exampleLines={locale.exampleLines}
      />
      <div className="mt-4">
        <DifficultySelector difficulty={difficulty} onSelect={(d) => onSelectDifficulty?.(d)} locale={locale} />
      </div>
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onStart}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
        >
          {locale.start}
        </button>
        <button
          onClick={onShowRanking}
          className="px-8 py-3 bg-gray-600 text-white font-bold rounded-lg shadow-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
        >
          {locale.ranking}
        </button>
      </div>

      {/* Ko-fi ウィジェット */}
      <div className="mt-6">
        <KofiWidget kofiUrl={KOFI_URL} />
      </div>
    </div>
  );
};