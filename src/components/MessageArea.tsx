
import React from 'react';

interface MessageAreaProps {
  message: string;
  type: 'info' | 'success' | 'error' | 'loading';
}

export const MessageArea: React.FC<MessageAreaProps> = React.memo(({ message, type }) => {
  const baseClasses = "w-full max-w-md mx-auto my-2 p-3 text-center rounded-lg font-semibold transition-all duration-300";
  const typeClasses = {
    info: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
    success: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200',
    error: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200',
    loading: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 animate-pulse',
  };

  return (
    <div className="h-12 flex items-center justify-center">
      {message && <div className={`${baseClasses} ${typeClasses[type]}`}>{message}</div>}
    </div>
  );
});
