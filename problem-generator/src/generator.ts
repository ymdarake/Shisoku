import type { Problem, ProblemCategory } from './types';
import { classifyProblem } from './classifier';
import { isTrivialProblem } from './filter';

const MAX_TRIES_PER_PROBLEM = 1000;

/**
 * カテゴリ別の問題数を指定して問題を生成する
 *
 * @param targetCounts - カテゴリごとの生成目標数
 * @returns 生成された問題の配列
 */
export const generateProblems = (targetCounts: Record<ProblemCategory, number>): Problem[] => {
  const problems: Problem[] = [];
  const needed: Record<ProblemCategory, number> = { ...targetCounts };

  let totalTries = 0;
  const maxTotalTries = Object.values(targetCounts).reduce((a, b) => a + b, 0) * MAX_TRIES_PER_PROBLEM;

  while (
    (needed['no-parens'] > 0 || needed['one-paren'] > 0 || needed['multi-paren'] > 0) &&
    totalTries < maxTotalTries
  ) {
    totalTries++;

    // ランダムに4つの数字を生成（0-9）
    const numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));

    // ランダムな目標値を設定（0-20の範囲で合理的）
    const target = Math.floor(Math.random() * 21);

    // トリビアル問題をスキップ
    if (isTrivialProblem(numbers, target)) {
      continue;
    }

    // 問題を分類
    const result = classifyProblem(numbers, target);
    if (!result) {
      // 解が見つからない
      continue;
    }

    const { category } = result;

    // 必要なカテゴリか確認
    if (needed[category] > 0) {
      problems.push({
        numbers,
        target,
        category,
      });
      needed[category]--;
    }
  }

  // 目標数に達しなかった場合の警告（実装では基本的に達成できるはず）
  if (needed['no-parens'] > 0 || needed['one-paren'] > 0 || needed['multi-paren'] > 0) {
    console.warn('警告: 目標数の問題を生成できませんでした', needed);
  }

  return problems;
};
