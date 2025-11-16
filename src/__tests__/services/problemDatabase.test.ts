import { describe, it, expect } from 'vitest';
import { getProblems } from '../../service/problemDatabase';

describe('problemDatabase - getProblems', () => {
  describe('Easy難易度', () => {
    it('10問取得できる', () => {
      const problems = getProblems('easy', 10);
      expect(problems).toHaveLength(10);
    });

    it('全てno-parensカテゴリ', () => {
      const problems = getProblems('easy', 20);
      problems.forEach(problem => {
        expect(problem.category).toBe('no-parens');
      });
    });

    it('重複しない問題を返す', () => {
      const problems = getProblems('easy', 50);
      const uniqueProblems = new Set(problems.map(p => JSON.stringify(p)));
      expect(uniqueProblems.size).toBe(50);
    });
  });

  describe('Normal難易度', () => {
    it('10問取得できる', () => {
      const problems = getProblems('normal', 10);
      expect(problems).toHaveLength(10);
    });

    it('no-parensとone-parenが約50%ずつ', () => {
      const problems = getProblems('normal', 100);
      const categories = problems.map(p => p.category);
      const noParensCount = categories.filter(c => c === 'no-parens').length;
      const oneParenCount = categories.filter(c => c === 'one-paren').length;

      // 50%前後（±15%の誤差を許容）
      expect(noParensCount).toBeGreaterThan(35);
      expect(noParensCount).toBeLessThan(65);
      expect(oneParenCount).toBeGreaterThan(35);
      expect(oneParenCount).toBeLessThan(65);
    });
  });

  describe('Hard難易度', () => {
    it('10問取得できる', () => {
      const problems = getProblems('hard', 10);
      expect(problems).toHaveLength(10);
    });

    it('no-parens 20%, one-paren 40%, multi-paren 40%の比率', () => {
      const problems = getProblems('hard', 100);
      const categories = problems.map(p => p.category);
      const noParensCount = categories.filter(c => c === 'no-parens').length;
      const oneParenCount = categories.filter(c => c === 'one-paren').length;
      const multiParenCount = categories.filter(c => c === 'multi-paren').length;

      // 20%前後（±10%の誤差を許容）
      expect(noParensCount).toBeGreaterThan(10);
      expect(noParensCount).toBeLessThan(30);

      // 40%前後（±15%の誤差を許容）
      expect(oneParenCount).toBeGreaterThan(25);
      expect(oneParenCount).toBeLessThan(55);

      expect(multiParenCount).toBeGreaterThan(25);
      expect(multiParenCount).toBeLessThan(55);
    });
  });

  describe('問題の構造', () => {
    it('各問題は正しいフィールドを持つ', () => {
      const problems = getProblems('normal', 10);
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
});
