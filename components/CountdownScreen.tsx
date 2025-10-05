import React, { useEffect, useState } from 'react';
import type { Language } from '../types';
import { audioService } from '../services/audio';

interface CountdownScreenProps {
  language: Language;
  onComplete: () => void;
}

const CountdownScreen: React.FC<CountdownScreenProps> = ({ language, onComplete }) => {
  const [count, setCount] = useState(3);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    // 最初のレンダリング時
    if (isFirstRender) {
      setIsFirstRender(false);
      audioService.playCountdownSound(); // 3の音を鳴らす
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (count > 0) {
      audioService.playCountdownSound();
      const timer = setTimeout(() => {
        if (count === 1) {
          // 1の次はスタート音を鳴らしてから0にする
          audioService.playStartSound();
        }
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // count=0: スタート！表示（音はcount=1のタイマーで既に鳴らした）
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete, isFirstRender]);

  const text = count > 0 ? count.toString() : (language === 'ja' ? 'スタート！' : 'Start!');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="text-9xl font-bold text-indigo-600 dark:text-indigo-400 animate-pulse">
          {text}
        </div>
      </div>
    </div>
  );
};

export default CountdownScreen;
