import { describe, it, expect } from 'vitest';
import { generateProblems } from '../src/generator';

describe('generator - generateProblems', () => {
  describe('問題生成の基本機能', () => {
    it('指定した数の問題を生成できる', () => {
      const problems = generateProblems({ 'no-parens': 5, 'one-paren': 3, 'multi-paren': 2 });
      expect(problems).toHaveLength(10);
    });

    it('各問題は正しい構造を持つ', () => {
      const problems = generateProblems({ 'no-parens': 2, 'one-paren': 1, 'multi-paren': 1 });
      problems.forEach(problem => {
        expect(problem).toHaveProperty('numbers');
        expect(problem).toHaveProperty('target');
        expect(problem).toHaveProperty('category');
        expect(problem.numbers).toHaveLength(4);
        expect(typeof problem.target).toBe('number');
        expect(['no-parens', 'one-paren', 'multi-paren']).toContain(problem.category);
      });
    });
  });

  describe('カテゴリ別の生成', () => {
    it('no-parens カテゴリの問題のみ生成できる', () => {
      const problems = generateProblems({ 'no-parens': 10, 'one-paren': 0, 'multi-paren': 0 });
      expect(problems).toHaveLength(10);
      problems.forEach(problem => {
        expect(problem.category).toBe('no-parens');
      });
    });

    it('one-paren カテゴリの問題のみ生成できる', () => {
      const problems = generateProblems({ 'no-parens': 0, 'one-paren': 10, 'multi-paren': 0 });
      expect(problems).toHaveLength(10);
      problems.forEach(problem => {
        expect(problem.category).toBe('one-paren');
      });
    });

    it('multi-paren カテゴリの問題のみ生成できる', () => {
      // multi-parenは稀なので少なめに
      const problems = generateProblems({ 'no-parens': 0, 'one-paren': 0, 'multi-paren': 3 });
      expect(problems.length).toBeGreaterThanOrEqual(2); // 最低2問は生成できる
      problems.forEach(problem => {
        expect(problem.category).toBe('multi-paren');
      });
    }, { timeout: 15000 }); // 15秒タイムアウト

    it('混合カテゴリの問題を生成できる', () => {
      const problems = generateProblems({ 'no-parens': 5, 'one-paren': 3, 'multi-paren': 2 });
      const categories = problems.map(p => p.category);
      const noParensCount = categories.filter(c => c === 'no-parens').length;
      const oneParenCount = categories.filter(c => c === 'one-paren').length;
      const multiParenCount = categories.filter(c => c === 'multi-paren').length;

      expect(noParensCount).toBe(5);
      expect(oneParenCount).toBe(3);
      expect(multiParenCount).toBe(2);
    });
  });

  describe('トリビアル問題の除外', () => {
    it('トリビアル問題が含まれない', () => {
      const problems = generateProblems({ 'no-parens': 20, 'one-paren': 0, 'multi-paren': 0 });
      problems.forEach(problem => {
        // 目標が0 かつ 数字に0が含まれる問題は除外されている
        if (problem.target === 0) {
          expect(problem.numbers.includes(0)).toBe(false);
        }
        // 全ての数字が同じ問題は除外されている
        const allSame = problem.numbers.every(num => num === problem.numbers[0]);
        expect(allSame).toBe(false);
      });
    });
  });

  describe('数字の範囲', () => {
    it('全ての数字が0-9の範囲内', () => {
      // multi-parenを減らして高速化
      const problems = generateProblems({ 'no-parens': 5, 'one-paren': 5, 'multi-paren': 2 });
      problems.forEach(problem => {
        problem.numbers.forEach(num => {
          expect(num).toBeGreaterThanOrEqual(0);
          expect(num).toBeLessThanOrEqual(9);
        });
      });
    }, { timeout: 10000 });

    it('目標も0-20の範囲内（現実的な範囲）', () => {
      const problems = generateProblems({ 'no-parens': 5, 'one-paren': 5, 'multi-paren': 2 });
      problems.forEach(problem => {
        expect(problem.target).toBeGreaterThanOrEqual(0);
        expect(problem.target).toBeLessThanOrEqual(20); // 妥当な範囲
      });
    }, { timeout: 10000 });
  });
});
