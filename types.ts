export interface Problem {
  numbers: number[];
  target: number;
}

export interface GameResult {
  problem: Problem;
  userAnswer: string;
  isCorrect: boolean;
  skipped: boolean;
}

export type GameState = 'idle' | 'playing' | 'finished' | 'ranking';

export type Language = 'ja' | 'en';

export interface Locale {
  [key: string]: string | { [key: string]: string };
}

export interface Locales {
  ja: Locale;
  en: Locale;
}

export interface RankingEntry {
    name: string;
    score: number;
    time: number; // in seconds
    date: string;
}
