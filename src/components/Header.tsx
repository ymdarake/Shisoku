import React from 'react';
import type { Language, Locale } from '../types';
import { MusicOnIcon, MusicOffIcon, SfxOnIcon, SfxOffIcon } from './icons';

interface HeaderProps {
  title: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  languageLabel: string;
  isBgmOn: boolean;
  isSfxOn: boolean;
  onToggleBgm: () => void;
  onToggleSfx: () => void;
  locale: Locale;
}

export const Header: React.FC<HeaderProps> = ({ title, language, onLanguageChange, languageLabel, isBgmOn, isSfxOn, onToggleBgm, onToggleSfx, locale }) => {
  return (
    <header className="p-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">{title}</h1>
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <button 
                  onClick={onToggleBgm} 
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label={isBgmOn ? locale.bgmOff as string : locale.bgmOn as string}
                >
                    {isBgmOn ? <MusicOnIcon /> : <MusicOffIcon />}
                </button>
                <button 
                  onClick={onToggleSfx} 
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  aria-label={isSfxOn ? locale.sfxOff as string : locale.sfxOn as string}
                >
                    {isSfxOn ? <SfxOnIcon /> : <SfxOffIcon />}
                </button>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium hidden sm:inline">{languageLabel}</span>
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
      </div>
    </header>
  );
};