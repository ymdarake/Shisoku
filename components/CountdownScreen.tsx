import React, { useEffect, useState } from 'react';
import type { Language } from '../types';

interface CountdownScreenProps {
  language: Language;
  onComplete: () => void;
}

const CountdownScreen: React.FC<CountdownScreenProps> = ({ language, onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

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
