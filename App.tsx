
import React, { useState, useEffect, useCallback } from 'react';
import type { GameState, Language, Problem, GameResult } from './types';
import { locales } from './constants/locales';
import { generateProblem } from './services/gameLogic';

import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { EndScreen } from './components/EndScreen';
import { MessageArea } from './components/MessageArea';

const TOTAL_QUESTIONS = 10;

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ja');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const locale = locales[language];
  
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const createNewProblem = useCallback(() => {
    setIsLoading(true);
    // Use timeout to allow UI to update to loading state
    setTimeout(() => {
        const problem = generateProblem();
        setCurrentProblem(problem);
        setIsLoading(false);
    }, 100);
  }, []);

  const handleStartGame = () => {
    setCurrentQuestionIndex(0);
    setResults([]);
    setGameState('playing');
    createNewProblem();
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      createNewProblem();
    } else {
      setGameState('finished');
    }
  }, [currentQuestionIndex, createNewProblem]);

  const handleCorrect = (userAnswer: string) => {
    if (!currentProblem) return;
    setResults(prev => [...prev, { problem: currentProblem, userAnswer, isCorrect: true, skipped: false }]);
    handleNextQuestion();
  };
  
  const handleIncorrect = (userAnswer: string) => {
    if (!currentProblem) return;
    setResults(prev => [...prev, { problem: currentProblem, userAnswer, isCorrect: false, skipped: false }]);
    handleNextQuestion();
  };

  const handleSkip = () => {
    if (!currentProblem) return;
    setResults(prev => [...prev, { problem: currentProblem, userAnswer: '', isCorrect: false, skipped: true }]);
    handleNextQuestion();
  };
  
  const handlePlayAgain = () => {
    setGameState('idle');
  };

  const renderContent = () => {
    if (isLoading) {
        return <MessageArea message={locale.generatingProblem as string} type="loading" />;
    }

    switch (gameState) {
      case 'playing':
        return currentProblem ? (
          <GameScreen
            problem={currentProblem}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
            onSkip={handleSkip}
            locale={locale}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={TOTAL_QUESTIONS}
          />
        ) : null;
      case 'finished':
        return <EndScreen 
                  results={results} 
                  onPlayAgain={handlePlayAgain} 
                  onBackToTop={handlePlayAgain}
                  locale={locale}
                  totalQuestions={TOTAL_QUESTIONS}
               />;
      case 'idle':
      default:
        return <StartScreen onStart={handleStartGame} locale={locale} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header 
        title={locale.title as string} 
        language={language} 
        onLanguageChange={handleLanguageChange}
        languageLabel={locale.language as string}
      />
      <main className="flex-grow container mx-auto p-4">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-xs text-gray-500">
        &copy; 2024 Math Puzzle Game
      </footer>
    </div>
  );
};

export default App;
