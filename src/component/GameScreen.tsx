import React, { useState, useEffect, useCallback } from 'react';
import type { Problem, Token } from '../types';
import { safeEvaluateExpression } from '../service/gameLogic';
import { useKeyboardInput } from '../hooks/useKeyboardInput';
import { isNumberKey, toOperator } from '../constant/keyboardMap';
import { ANSWER_JUDGMENT_DELAY_MS } from '../constant/game';
import { formatTime } from '../utils/formatTime';

import { ProblemDisplay } from './ProblemDisplay';
import { InputDisplay } from './InputDisplay';
import { Controls } from './Controls';
import { MessageArea } from './MessageArea';

interface GameScreenProps {
  problem: Problem;
  onCorrect: (answer: string) => void;
  onIncorrect: (answer: string) => void;
  onSkip: () => void;
  onQuit: () => void;
  locale: { [key: string]: any };
  questionNumber: number;
  totalQuestions: number;
  elapsedTime: number;
  onPlayClickSound: () => void;
  onPlayCorrectSound: () => void;
  onPlayIncorrectSound: () => void;
  onInvalidAction: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ problem, onCorrect, onIncorrect, onSkip, onQuit, locale, questionNumber, totalQuestions, elapsedTime, onPlayClickSound, onPlayCorrectSound, onPlayIncorrectSound, onInvalidAction }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [message, setMessage] = useState(locale.buildExpression);
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [isJudged, setIsJudged] = useState(false);

  const expression = tokens.map(t => t.value).join(' ');
  const usedNumberIndices = tokens.filter(t => t.type === 'number').map(t => t.originalIndex!);

  const resetForNewProblem = useCallback(() => {
    setTokens([]);
    setMessage(locale.buildExpression);
    setMessageType('info');
    setIsJudged(false);
  }, [locale.buildExpression]);

  useEffect(() => {
    resetForNewProblem();
  }, [problem, resetForNewProblem]);

  const handleNumberClick = (num: number, index: number) => {
    if (isJudged) return;

    const lastToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
    // Prevent number after number e.g. "1 2"
    // Prevent number after closing parenthesis e.g. ") 2"
    if (lastToken && (lastToken.type === 'number' || lastToken.value === ')')) {
      onInvalidAction();
      return;
    }

    onPlayClickSound();
    setTokens(prev => [...prev, { value: String(num), type: 'number', originalIndex: index }]);
  };

  const handleOperatorClick = (op: string) => {
    if (isJudged) return;

    const lastToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;

    switch (op) {
      case '+':
      case '-':
      case '*':
      case '/':
        // Operator must follow a number or a closing parenthesis
        if (!lastToken || (lastToken.type !== 'number' && lastToken.value !== ')')) {
          onInvalidAction();
          return;
        }
        break;
      case '(':
        // Opening parenthesis must NOT follow a number or a closing parenthesis
        if (lastToken && (lastToken.type === 'number' || lastToken.value === ')')) {
          onInvalidAction();
          return;
        }
        break;
      case ')':
        // Closing parenthesis must follow a number or another closing parenthesis
        if (!lastToken || (lastToken.type !== 'number' && lastToken.value !== ')')) {
          onInvalidAction();
          return;
        }
        // Check for parenthesis balance
        const openParenCount = tokens.filter(t => t.value === '(').length;
        const closeParenCount = tokens.filter(t => t.value === ')').length;
        if (closeParenCount >= openParenCount) {
          onInvalidAction();
          return;
        }
        break;
    }

    onPlayClickSound();
    setTokens(prev => [...prev, { value: op, type: 'operator' }]);
  };

  const handleClear = () => {
    if (isJudged) return;
    if (tokens.length > 0) {
      onPlayClickSound();
      setTokens([]);
    } else {
      onInvalidAction();
    }
  };

  const handleBackspace = () => {
    if (isJudged) return;
    if (tokens.length > 0) {
      onPlayClickSound();
      setTokens(prev => prev.slice(0, -1));
    } else {
      onInvalidAction();
    }
  };


  const checkAnswer = useCallback(() => {
    // Only check when all 4 numbers are used
    if (usedNumberIndices.length !== 4) return;

    // Also, must not end with an operator (unless it's a parenthesis)
    const lastToken = tokens.length > 0 ? tokens[tokens.length - 1] : null;
    if (lastToken && lastToken.type === 'operator' && lastToken.value !== ')') return;

    // Check parenthesis balance
    const openParen = tokens.filter(t => t.value === '(').length;
    const closeParen = tokens.filter(t => t.value === ')').length;
    if (openParen !== closeParen) return;

    setIsJudged(true);
    const result = safeEvaluateExpression(expression);

    if (result === problem.target) {
      setMessage(locale.correct);
      setMessageType('success');
      onPlayCorrectSound();
      setTimeout(() => onCorrect(expression), ANSWER_JUDGMENT_DELAY_MS);
    } else {
      setMessage(locale.incorrect);
      setMessageType('error');
      onPlayIncorrectSound();
      setTimeout(() => onIncorrect(expression), ANSWER_JUDGMENT_DELAY_MS);
    }
  }, [tokens, expression, problem, locale, onCorrect, onIncorrect, onPlayCorrectSound, onPlayIncorrectSound, usedNumberIndices.length]);

  useEffect(() => {
    if (!isJudged) {
      checkAnswer();
    }
  }, [tokens, isJudged, checkAnswer]);

  // キーボード入力ハンドラ（数字・演算子・特殊キー対応）
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isJudged) return;

    const key = e.key;

    // 特殊キー: Backspace（削除）, Enter（判定）, Escape（クリア）
    if (key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
      return;
    }
    if (key === 'Enter') {
      e.preventDefault();
      checkAnswer();
      return;
    }
    if (key === 'Escape') {
      e.preventDefault();
      handleClear();
      return;
    }

    // 数字キー（0-9）
    if (isNumberKey(key)) {
      const num = Number(key);
      const candidateIndex = problem.numbers.findIndex(
        (n, idx) => n === num && !usedNumberIndices.includes(idx)
      );
      if (candidateIndex !== -1) {
        handleNumberClick(num, candidateIndex);
      }
      return;
    }

    // 演算子キー（+ - * /）と括弧
    const op = toOperator(key, e.shiftKey);
    if (op) {
      handleOperatorClick(op);
    }
  }, [isJudged, problem.numbers, usedNumberIndices, handleNumberClick, handleBackspace, checkAnswer, handleClear, handleOperatorClick]);

  useKeyboardInput(handleKeyDown);

  const handleSkipClick = () => {
    onPlayClickSound();
    onSkip();
  }

  const handleQuitClick = () => {
    onPlayClickSound();
    const ok = window.confirm(locale.confirmQuit as string);
    if (ok) onQuit();
  }

  return (
    <main className="p-4 flex flex-col items-center min-h-[calc(100vh-80px)]" role="main">
      {/* ヘッダー: 問題番号とタイマー */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-4 font-bold text-lg">
        <span aria-label={`問題 ${questionNumber} / ${totalQuestions}`}>
          {`${locale.question} ${questionNumber}/${totalQuestions}`}
        </span>
        <div className="flex items-center space-x-2 text-indigo-500 dark:text-indigo-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span aria-label={`経過時間 ${formatTime(elapsedTime)}`}>{formatTime(elapsedTime)}</span>
        </div>
        <div>
          <button onClick={handleQuitClick} className="px-3 py-1 text-sm bg-gray-700 text-white rounded-md shadow hover:bg-gray-800 transition">
            {locale.backToTop}
          </button>
        </div>
      </div>

      {/* メインコンテンツ: PC時は横並び、モバイル時は縦積み */}
      <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row lg:gap-8 gap-4">
        {/* 左側: 問題表示エリア */}
        <div className="flex-1 flex flex-col items-center justify-center lg:border-r lg:border-gray-300 dark:lg:border-gray-700 lg:pr-8">
          <ProblemDisplay problem={problem} locale={locale} />
        </div>

        {/* 右側: 入力エリアとコントロール */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <MessageArea message={message} type={messageType} />
          <InputDisplay expression={expression} />
          <Controls
            numbers={problem.numbers}
            usedNumberIndices={usedNumberIndices}
            onNumberClick={handleNumberClick}
            onOperatorClick={handleOperatorClick}
            onClear={handleClear}
            onBackspace={handleBackspace}
          />
          <div className="mt-4 flex space-x-3">
            <button onClick={handleSkipClick} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition">
              {locale.skip}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};