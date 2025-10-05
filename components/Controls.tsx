import React from 'react';
import { BackspaceIcon } from './icons';

interface ControlsProps {
  numbers: number[];
  usedNumberIndices: number[];
  onNumberClick: (num: number, index: number) => void;
  onOperatorClick: (op: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onPlayClickSound: () => void;
}

const OperatorButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-md text-2xl font-bold hover:bg-gray-400 dark:hover:bg-gray-500 transition-all transform hover:scale-105">
        {children}
    </button>
);

export const Controls: React.FC<ControlsProps> = ({ numbers, usedNumberIndices, onNumberClick, onOperatorClick, onClear, onBackspace, onPlayClickSound }) => {
  const operators = ['+', '-', '*', '/', '(', ')'];
  
  const handleOperatorClick = (op: string) => {
    onPlayClickSound();
    onOperatorClick(op);
  }
  
  const handleNumberClick = (num: number, index: number) => {
    onPlayClickSound();
    onNumberClick(num, index);
  }
  
  const handleClearClick = () => {
      onPlayClickSound();
      onClear();
  }

  const handleBackspaceClick = () => {
    onPlayClickSound();
    onBackspace();
  }
  
  return (
    <div className="w-full max-w-md mx-auto my-4 p-4 bg-white dark:bg-gray-800/50 rounded-lg shadow-lg">
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {numbers.map((num, index) => {
          const isUsed = usedNumberIndices.includes(index);
          return (
            <button
              key={index}
              onClick={() => handleNumberClick(num, index)}
              disabled={isUsed}
              className={`w-16 h-16 rounded-lg shadow-md text-2xl font-bold transition-all transform hover:scale-105 ${
                isUsed ? 'bg-gray-400 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-500'
              }`}
            >
              {num}
            </button>
          );
        })}
        
        {operators.map(op => (
            <OperatorButton key={op} onClick={() => handleOperatorClick(op)}>{op}</OperatorButton>
        ))}

        <button onClick={handleBackspaceClick} className="w-16 h-16 bg-orange-500 text-white rounded-lg shadow-md flex items-center justify-center hover:bg-orange-600 transition-all transform hover:scale-105">
            <BackspaceIcon className="w-8 h-8"/>
        </button>
        <button onClick={handleClearClick} className="w-16 h-16 bg-red-500 text-white rounded-lg shadow-md text-2xl font-bold hover:bg-red-600 transition-all transform hover:scale-105">
            C
        </button>

      </div>
    </div>
  );
};