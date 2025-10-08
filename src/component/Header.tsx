import React from 'react';
import type { Language, Locale } from '../types';
import { MusicOnIcon, MusicOffIcon, SfxOnIcon, SfxOffIcon } from './icons';
import { useDarkMode } from '../hooks/useDarkMode';

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
  onTitleClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, language, onLanguageChange, languageLabel, isBgmOn, isSfxOn, onToggleBgm, onToggleSfx, locale, onTitleClick }) => {
  const [isDark, toggleDarkMode] = useDarkMode();

  return (
    <header className="p-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <button
          onClick={onTitleClick}
          className="text-left focus:outline-none"
          aria-label={title}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400 hover:underline">{title}</h1>
        </button>
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
            {/* ダークモードトグル */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            >
              {isDark ? (
                // 太陽アイコン（ライトモード）
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                // 月アイコン（ダークモード）
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
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