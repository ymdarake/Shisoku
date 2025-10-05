import React from 'react';
import { Rules } from './Rules';

interface StartScreenProps {
  onStart: () => void;
  onShowRanking: () => void;
  locale: { [key: string]: any };
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowRanking, locale }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <Rules title={locale.ruleTitle} rules={locale.rules} />
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
    </div>
  );
};
