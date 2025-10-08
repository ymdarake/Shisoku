
import React from 'react';

interface InputDisplayProps {
  expression: string;
}

export const InputDisplay: React.FC<InputDisplayProps> = React.memo(({ expression }) => {
  return (
    <div
      data-testid="input-display"
      className="w-full max-w-md mx-auto my-4 p-4 h-16 flex items-center justify-end bg-gray-200 dark:bg-gray-800 rounded-lg shadow-inner text-2xl font-mono"
      role="status"
      aria-live="polite"
      aria-label="入力中の式"
    >
      {expression || <span className="text-gray-400 dark:text-gray-500">...</span>}
    </div>
  );
});
