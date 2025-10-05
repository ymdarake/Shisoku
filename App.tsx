import React, { useState, useEffect, useCallback } from 'react';
import type { GameState, Language, Problem, GameResult, RankingEntry } from './types';
import { locales } from './constants/locales';
import { generateProblem } from './services/gameLogic';
import { getRankings, saveRanking } from './services/ranking';
import { audioService } from './services/audio';

import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { EndScreen } from './components/EndScreen';
import { MessageArea } from './components/MessageArea';
import { RankingScreen } from './components/RankingScreen';

const TOTAL_QUESTIONS = 10;

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ja');
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [isBgmOn, setIsBgmOn] = useState(true);
  const [isSfxOn, setIsSfxOn] = useState(true);

  const locale = locales[language];

  useEffect(() => {
    setRankings(getRankings());
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (gameState === 'playing' && startTime) {
      interval = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [gameState, startTime]);
  
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const createNewProblem = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
        const problem = generateProblem();
        setCurrentProblem(problem);
        setIsLoading(false);
    }, 100);
  }, []);

  const handleStartGame = async () => {
    await audioService.init();
    audioService.playBgm();
    setCurrentQuestionIndex(0);
    setResults([]);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameState('playing');
    createNewProblem();
  };

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      createNewProblem();
    } else {
      setGameState('finished');
      audioService.stopBgm();
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
  
  const handleBackToTop = () => {
    setGameState('idle');
    audioService.stopBgm();
  };

  const handleShowRanking = () => {
    setGameState('ranking');
  };
  
  const handleToggleBgm = () => {
      setIsBgmOn(audioService.toggleBgm());
  }
  
  const handleToggleSfx = () => {
      setIsSfxOn(audioService.toggleSfx());
  }
  
  const playClickSound = useCallback(() => audioService.playClickSound(), []);
  const playCorrectSound = useCallback(() => audioService.playCorrectSound(), []);
  const playIncorrectSound = useCallback(() => audioService.playIncorrectSound(), []);
  const playInvalidActionSound = useCallback(() => audioService.playInvalidActionSound(), []);

  const handleSaveRanking = (name: string) => {
    const score = results.filter(r => r.isCorrect).length;
    const newEntry: RankingEntry = {
      name,
      score,
      time: elapsedTime,
      date: new Date().toISOString(),
    };
    const updatedRankings = saveRanking(newEntry);
    setRankings(updatedRankings);
    setGameState('ranking');
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
            elapsedTime={elapsedTime}
            onPlayClickSound={playClickSound}
            onPlayCorrectSound={playCorrectSound}
            onPlayIncorrectSound={playIncorrectSound}
            onPlayInvalidActionSound={playInvalidActionSound}
          />
        ) : null;
      case 'finished':
        return <EndScreen 
                  results={results} 
                  onPlayAgain={handleStartGame} 
                  onBackToTop={handleBackToTop}
                  onSaveRanking={handleSaveRanking}
                  locale={locale}
                  totalQuestions={TOTAL_QUESTIONS}
                  totalTime={elapsedTime}
               />;
      case 'ranking':
        return <RankingScreen rankings={rankings} onBackToTop={handleBackToTop} locale={locale} />;
      case 'idle':
      default:
        return <StartScreen onStart={handleStartGame} onShowRanking={handleShowRanking} locale={locale} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header 
        title={locale.title as string} 
        language={language} 
        onLanguageChange={handleLanguageChange}
        languageLabel={locale.language as string}
        isBgmOn={isBgmOn}
        isSfxOn={isSfxOn}
        onToggleBgm={handleToggleBgm}
        onToggleSfx={handleToggleSfx}
        locale={locale}
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