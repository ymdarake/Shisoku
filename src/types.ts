export type ProblemCategory = 'no-parens' | 'one-paren' | 'multi-paren';

export interface Problem {
  numbers: number[];
  target: number;
  category?: ProblemCategory; // オプション: 問題データベースから読み込まれた問題に含まれる
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

// moved to domain/ranking/types.ts

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

// moved to domain/preferences/types.ts