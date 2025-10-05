
import React from 'react';
import { Rules } from './Rules';

interface StartScreenProps {
  onStart: () => void;
  locale: { [key: string]: any };
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, locale }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <Rules title={locale.ruleTitle} rules={locale.rules} />
      <button
        onClick={onStart}
        className="mt-6 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
      >
        {locale.start}
      </button>
    </div>
  );
};
