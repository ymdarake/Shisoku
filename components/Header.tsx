
import React from 'react';
import type { Language } from '../types';

interface HeaderProps {
  title: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  languageLabel: string;
}

export const Header: React.FC<HeaderProps> = ({ title, language, onLanguageChange, languageLabel }) => {
  return (
    <header className="p-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">{title}</h1>
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{languageLabel}</span>
            <button
                onClick={() => onLanguageChange('ja')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${language === 'ja' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
            JA
            </button>
            <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${language === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
            EN
            </button>
        </div>
      </div>
    </header>
  );
};
