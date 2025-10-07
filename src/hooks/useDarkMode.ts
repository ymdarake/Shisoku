import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

/**
 * ダークモードを管理するカスタムフック
 * - localStorage でテーマを永続化
 * - 初期値は localStorage → prefers-color-scheme の順で決定
 * - html 要素の class を操作して Tailwind のダークモードを制御
 */
export const useDarkMode = (): [boolean, () => void] => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // 1. localStorage から復元
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    if (saved === 'dark' || saved === 'light') {
      return saved === 'dark';
    }

    // 2. システム設定を参照
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }

    // 3. デフォルトはライトモード
    return false;
  });

  // テーマが変更されたら html 要素の class と localStorage を更新
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  return [isDark, toggleDarkMode];
};
