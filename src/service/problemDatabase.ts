import type { Problem, ProblemCategory, Difficulty } from '../types';
import problemsData from '../data/problems.json';

// 問題データベース（型付き）
const problems = problemsData as Problem[];

// 難易度別のカテゴリ比率
const DIFFICULTY_DISTRIBUTIONS: Record<Difficulty, Record<ProblemCategory, number>> = {
  easy: {
    'no-parens': 1.0,
    'one-paren': 0.0,
    'multi-paren': 0.0,
  },
  normal: {
    'no-parens': 0.5,
    'one-paren': 0.5,
    'multi-paren': 0.0,
  },
  hard: {
    'no-parens': 0.2,
    'one-paren': 0.4,
    'multi-paren': 0.4,
  },
};

/**
 * カテゴリ別に問題を分類
 */
const problemsByCategory: Record<ProblemCategory, Problem[]> = {
  'no-parens': problems.filter(p => p.category === 'no-parens'),
  'one-paren': problems.filter(p => p.category === 'one-paren'),
  'multi-paren': problems.filter(p => p.category === 'multi-paren'),
};

/**
 * 指定された難易度に応じた問題を取得する
 *
 * @param difficulty - 難易度
 * @param count - 取得する問題数
 * @returns 問題の配列
 */
export const getProblems = (difficulty: Difficulty, count: number): Problem[] => {
  const distribution = DIFFICULTY_DISTRIBUTIONS[difficulty];
  const result: Problem[] = [];

  // カテゴリごとに必要な問題数を計算
  const counts: Record<ProblemCategory, number> = {
    'no-parens': Math.round(count * distribution['no-parens']),
    'one-paren': Math.round(count * distribution['one-paren']),
    'multi-paren': Math.round(count * distribution['multi-paren']),
  };

  // 丸め誤差の調整（合計がcountになるように）
  const total = counts['no-parens'] + counts['one-paren'] + counts['multi-paren'];
  if (total < count) {
    // 不足分を最も多いカテゴリに追加
    const maxCategory = (Object.keys(counts) as ProblemCategory[]).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );
    counts[maxCategory] += count - total;
  } else if (total > count) {
    // 超過分を最も多いカテゴリから減らす
    const maxCategory = (Object.keys(counts) as ProblemCategory[]).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );
    counts[maxCategory] -= total - count;
  }

  // 各カテゴリからランダムに問題を選択
  const categories: ProblemCategory[] = ['no-parens', 'one-paren', 'multi-paren'];
  const usedIndices: Record<ProblemCategory, Set<number>> = {
    'no-parens': new Set(),
    'one-paren': new Set(),
    'multi-paren': new Set(),
  };

  for (const category of categories) {
    const categoryProblems = problemsByCategory[category];
    const neededCount = counts[category];

    for (let i = 0; i < neededCount; i++) {
      // ランダムに選択（重複除外）
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * categoryProblems.length);
      } while (usedIndices[category].has(randomIndex));

      usedIndices[category].add(randomIndex);
      result.push(categoryProblems[randomIndex]);
    }
  }

  // ランダムにシャッフル
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};
