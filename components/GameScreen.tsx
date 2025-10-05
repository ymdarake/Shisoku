import React, { useState, useEffect, useCallback } from 'react';
import type { Problem } from '../types';
import { safeEvaluateExpression } from '../services/gameLogic';

import { ProblemDisplay } from './ProblemDisplay';
import { InputDisplay } from './InputDisplay';
import { Controls } from './Controls';
import { MessageArea } from './MessageArea';

interface GameScreenProps {
  problem: Problem;
  onCorrect: (answer: string) => void;
  onIncorrect: (answer: string) => void;
  onSkip: () => void;
  locale: { [key: string]: any };
  questionNumber: number;
  totalQuestions: number;
  elapsedTime: number;
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const GameScreen: React.FC<GameScreenProps> = ({ problem, onCorrect, onIncorrect, onSkip, locale, questionNumber, totalQuestions, elapsedTime }) => {
  const [expression, setExpression] = useState('');
  const [usedNumberIndices, setUsedNumberIndices] = useState<number[]>([]);
  const [message, setMessage] = useState(locale.buildExpression);
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [isJudged, setIsJudged] = useState(false);

  const resetForNewProblem = useCallback(() => {
    setExpression('');
    setUsedNumberIndices([]);
    setMessage(locale.buildExpression);
    setMessageType('info');
    setIsJudged(false);
  }, [locale.buildExpression]);

  useEffect(() => {
    resetForNewProblem();
  }, [problem, resetForNewProblem]);
  
  const handleNumberClick = (num: number, index: number) => {
    if (isJudged) return;
    setExpression(prev => prev + num);
    setUsedNumberIndices(prev => [...prev, index]);
  };
  
  const handleOperatorClick = (op: string) => {
    if (isJudged) return;
    setExpression(prev => `${prev} ${op} `);
  };
  
  const handleClear = () => {
    if (isJudged) return;
    setExpression('');
    setUsedNumberIndices([]);
  };

  const handleBackspace = () => {
    if (isJudged) return;
    const lastPart = expression.trim().split(' ').pop();
    if(lastPart && /^\d+$/.test(lastPart)) {
        const lastNum = parseInt(lastPart, 10);
        const lastNumIndex = usedNumberIndices.find(idx => problem.numbers[idx] === lastNum && !usedNumberIndices.slice(0, -1).includes(idx));
        
        const indexToRemove = usedNumberIndices.lastIndexOf(
            problem.numbers.findIndex((n, i) => n === lastNum && !usedNumberIndices.slice(0, usedNumberIndices.length-1).includes(i))
        );

        if (indexToRemove !== -1) {
             const newUsedIndices = [...usedNumberIndices];
             newUsedIndices.splice(indexToRemove, 1);
             setUsedNumberIndices(newUsedIndices);
        }
    }
    setExpression(prev => prev.trim().slice(0, prev.trim().lastIndexOf(' ')).trim());
  };


  const checkAnswer = useCallback(() => {
    const usedDigits = expression.match(/\d+/g)?.map(Number) || [];
    const problemDigits = [...problem.numbers].sort();
    
    if (usedDigits.length !== 4) return;
    if (usedDigits.sort().join('') !== problemDigits.join('')) return;

    const openParen = (expression.match(/\(/g) || []).length;
    const closeParen = (expression.match(/\)/g) || []).length;
    if (openParen !== closeParen) return;
    
    setIsJudged(true);
    const result = safeEvaluateExpression(expression);

    if (result === problem.target) {
      setMessage(locale.correct);
      setMessageType('success');
      setTimeout(() => onCorrect(expression), 2000);
    } else {
      setMessage(result === null ? locale.invalidExpression : locale.incorrect);
      setMessageType('error');
      setTimeout(() => onIncorrect(expression), 2000);
    }
  }, [expression, problem, locale, onCorrect, onIncorrect]);

  useEffect(() => {
    if (!isJudged) {
        checkAnswer();
    }
  }, [expression, isJudged, checkAnswer]);

  return (
    <div className="p-4 flex flex-col items-center">
       <div className="w-full max-w-md mx-auto flex justify-between items-center mb-2 font-bold text-lg">
        <span>{`${locale.question} ${questionNumber}/${totalQuestions}`}</span>
        <div className="flex items-center space-x-2 text-indigo-500 dark:text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span>{formatTime(elapsedTime)}</span>
        </div>
      </div>
      <ProblemDisplay problem={problem} locale={locale} />
      <InputDisplay expression={expression} />
      <MessageArea message={message} type={messageType} />
      <Controls 
        numbers={problem.numbers}
        usedNumberIndices={usedNumberIndices}
        onNumberClick={handleNumberClick}
        onOperatorClick={handleOperatorClick}
        onClear={handleClear}
        onBackspace={handleBackspace}
      />
      <div className="mt-4">
        <button onClick={onSkip} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition">
          {locale.skip}
        </button>
      </div>
    </div>
  );
};
