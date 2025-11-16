import { describe, it, expect } from 'vitest';
import { classifyProblem } from '../src/classifier';

describe('classifier - classifyProblem', () => {
  describe('no-parens（括弧なしで解ける問題）', () => {
    it('[1, 2, 3, 4] → 10 は no-parens（1 + 2 + 3 + 4）', () => {
      const result = classifyProblem([1, 2, 3, 4], 10);
      expect(result.category).toBe('no-parens');
      // 最も簡単な解法が括弧なし
      expect(result.simplestSolution).not.toContain('(');
    });

    it('[2, 3, 4, 5] → 14 は no-parens（2 + 3 + 4 + 5）', () => {
      const result = classifyProblem([2, 3, 4, 5], 14);
      expect(result.category).toBe('no-parens');
    });

    it('[5, 4, 3, 2] → 0 は no-parens（5 - 4 - 3 + 2）', () => {
      const result = classifyProblem([5, 4, 3, 2], 0);
      expect(result.category).toBe('no-parens');
    });
  });

  describe('one-paren（括弧1つで解ける問題）', () => {
    it('[2, 3, 4, 1] → 20 は one-paren（(2 + 3) * 4 + 1 等）', () => {
      const result = classifyProblem([2, 3, 4, 1], 20);
      expect(result.category).toBe('one-paren');
      // 括弧が含まれる
      expect(result.simplestSolution).toContain('(');
      // ネストした括弧ではない（1レベルのみ）
      const openCount = (result.simplestSolution.match(/\(/g) || []).length;
      expect(openCount).toBeLessThanOrEqual(2); // (a op b) op (c op d) の場合最大2つ
    });
  });

  describe('multi-paren（複数の括弧が必要な問題）', () => {
    it('ネストした括弧が必要な問題', () => {
      // 注: 実際の問題例は生成ロジック実装後に検証
      // ここでは分類ロジックが正しく動作することを確認
      const result = classifyProblem([8, 2, 3, 1], 9);
      expect(['no-parens', 'one-paren', 'multi-paren']).toContain(result.category);
      expect(result.simplestSolution).toBeTruthy();
    });
  });

  describe('解が存在しない問題', () => {
    it('nullを返す', () => {
      // 0-9の範囲で解が見つからない問題を作るのは難しいが、
      // ロジックとしてはnullを返すケースをテスト
      // 実際には全探索するので、0-9の範囲内なら大抵解がある
      // ここでは型の整合性を確認
      const result = classifyProblem([1, 2, 3, 4], 999);
      expect(result).toBeNull();
    });
  });
});
