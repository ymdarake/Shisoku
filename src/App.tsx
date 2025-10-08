import React, { useState, useEffect, useCallback } from 'react';
import type { GameState, Language, Problem, GameResult, Difficulty } from './types';
import type { RankingEntry } from './domain/ranking/type';
import { locales } from './constant/locales';
import { TOTAL_QUESTIONS } from './constant/game';
import { generateProblems } from './service/gameLogic';
import { useRankingRepository } from './context/RankingRepositoryContext';
import { audioService } from './service/audio';

import { Header } from './component/Header';
import { StartScreen } from './component/StartScreen';
import CountdownScreen from './component/CountdownScreen';
import { GameScreen } from './component/GameScreen';
import { EndScreen } from './component/EndScreen';
import { MessageArea } from './component/MessageArea';
import { RankingScreen } from './component/RankingScreen';
import { usePreferencesRepository } from './context/PreferencesRepositoryContext';

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
  const [isShaking, setIsShaking] = useState(false);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [showCountdown, setShowCountdown] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const rankingRepository = useRankingRepository();
  const preferencesRepository = usePreferencesRepository();

  const locale = locales[language];

  useEffect(() => {
    rankingRepository.getRankings(difficulty).then(setRankings);
  }, [rankingRepository, difficulty]);

  // Load user preferences on app start
  useEffect(() => {
    (async () => {
      const prefs = await preferencesRepository.load();
      if (prefs) {
        setLanguage(prefs.language);
        setDifficulty(prefs.difficulty);
        setIsBgmOn(prefs.isBgmOn);
        setIsSfxOn(prefs.isSfxOn);
      }
      setPrefsLoaded(true);
    })();
  }, []);

  // Persist preferences when changed (after initial load)
  useEffect(() => {
    if (!prefsLoaded) return;
    void preferencesRepository.save({
      language,
      difficulty,
      isBgmOn,
      isSfxOn,
    });
  }, [language, difficulty, isBgmOn, isSfxOn, prefsLoaded, preferencesRepository]);

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

  const handleStartGame = async () => {
    await audioService.init();
    setShowCountdown(true);
    // Generate all problems during countdown
    setIsLoading(true);
    setTimeout(() => {
      const problems = generateProblems(TOTAL_QUESTIONS, difficulty);
      setAllProblems(problems);
      setIsLoading(false);
    }, 100);
  };

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    audioService.playBgm();
    setCurrentQuestionIndex(0);
    setResults([]);
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameState('playing');
    if (allProblems.length > 0) {
      setCurrentProblem(allProblems[0]);
    }
  }, [allProblems]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentProblem(allProblems[nextIndex]);
    } else {
      setGameState('finished');
      audioService.stopBgm();
      audioService.playFinishSound();
    }
  }, [currentQuestionIndex, allProblems]);

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

  const handleInvalidAction = useCallback(() => {
    audioService.playInvalidActionSound();
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  const handleSaveRanking = (name: string) => {
    const score = results.filter(r => r.isCorrect).length;
    const newEntry: RankingEntry = {
      name,
      score,
      time: elapsedTime,
      date: new Date().toISOString(),
    };
    rankingRepository.saveRanking(newEntry, difficulty).then(setRankings);
    setGameState('ranking');
  };

  const renderContent = () => {
    if (showCountdown) {
      return (
        <CountdownScreen
          language={language}
          onComplete={handleCountdownComplete}
        />
      );
    }

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
            onQuit={handleBackToTop}
            locale={locale}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={TOTAL_QUESTIONS}
            elapsedTime={elapsedTime}
            onPlayClickSound={playClickSound}
            onPlayCorrectSound={playCorrectSound}
            onPlayIncorrectSound={playIncorrectSound}
            onInvalidAction={handleInvalidAction}
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
        // FIX: Corrected typo in prop name from `onBackTo-Top` to `onBackToTop`.
        return <RankingScreen rankings={rankings} onBackToTop={handleBackToTop} locale={locale} difficulty={difficulty} />;
      case 'idle':
      default:
        return <StartScreen onStart={handleStartGame} onShowRanking={handleShowRanking} locale={locale} difficulty={difficulty} onSelectDifficulty={setDifficulty} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 ${isShaking ? 'shake-animation' : ''}`}>
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
        onTitleClick={handleBackToTop}
      />
      <main className="flex-grow container mx-auto p-4">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-xs text-gray-500 dark:text-gray-400">
        <a href="https://github.com/ymdarake/" target="_blank" rel="noopener noreferrer">&copy; 2025 ymdarake</a>
      </footer>
    </div>
  );
};

export default App;