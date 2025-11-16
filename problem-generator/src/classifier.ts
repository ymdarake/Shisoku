import type { ClassificationResult, ProblemCategory } from './types';
import { safeEvaluateExpression, getPermutations } from './utils';

/**
 * 括弧パターンの定義
 * 優先度順: 括弧なし → 括弧1つ → 括弧複数
 */
const BRACKET_PATTERNS = [
  // no-parens
  { pattern: 'a op1 b op2 c op3 d', category: 'no-parens' as ProblemCategory },

  // one-paren
  { pattern: '(a op1 b) op2 c op3 d', category: 'one-paren' as ProblemCategory },
  { pattern: 'a op1 (b op2 c) op3 d', category: 'one-paren' as ProblemCategory },
  { pattern: 'a op1 b op2 (c op3 d)', category: 'one-paren' as ProblemCategory },
  { pattern: '(a op1 b) op2 (c op3 d)', category: 'one-paren' as ProblemCategory },

  // multi-paren
  { pattern: '((a op1 b) op2 c) op3 d', category: 'multi-paren' as ProblemCategory },
  { pattern: '(a op1 (b op2 c)) op3 d', category: 'multi-paren' as ProblemCategory },
  { pattern: 'a op1 ((b op2 c) op3 d)', category: 'multi-paren' as ProblemCategory },
  { pattern: 'a op1 (b op2 (c op3 d))', category: 'multi-paren' as ProblemCategory },
];

/**
 * 問題を分類する（括弧なし/1つ/複数）
 *
 * @param numbers - 4つの数字
 * @param target - 目標の数字
 * @returns 分類結果（category, simplestSolution）または null（解なし）
 */
export const classifyProblem = (
  numbers: number[],
  target: number
): ClassificationResult | null => {
  const operators = ['+', '-', '*', '/'];
  const numPermutations = getPermutations(numbers);

  // 括弧パターンを優先度順に試す
  for (const { pattern, category } of BRACKET_PATTERNS) {
    for (const perm of numPermutations) {
      const [a, b, c, d] = perm;

      for (const op1 of operators) {
        for (const op2 of operators) {
          for (const op3 of operators) {
            // パターンに数字と演算子を埋め込む
            const expression = pattern
              .replace('a', String(a))
              .replace('b', String(b))
              .replace('c', String(c))
              .replace('d', String(d))
              .replace('op1', op1)
              .replace('op2', op2)
              .replace('op3', op3);

            const result = safeEvaluateExpression(expression);
            if (result === target) {
              return {
                category,
                simplestSolution: expression,
              };
            }
          }
        }
      }
    }
  }

  // 解が見つからない
  return null;
};
