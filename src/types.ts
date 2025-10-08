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
  [key: string]: any;
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

/**
 * 式を構成するトークン（数字または演算子）
 * ユーザーの入力を表現するために使用
 */
export interface Token {
  value: string;
  type: 'number' | 'operator';
  originalIndex?: number; // 問題の数字配列における元のインデックス（数字の場合のみ）
}

// 難易度設定
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface DifficultyConfig {
  numberRange: [number, number];
  targetRange: [number, number];
  label: string;
}

export interface UserPreferences {
  isBgmOn: boolean;
  isSfxOn: boolean;
  language: Language;
  difficulty: Difficulty;
}