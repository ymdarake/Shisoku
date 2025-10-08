import { describe, it, expect } from 'vitest';
import { safeEvaluateExpression, generateProblem, generateProblems } from '../../services/gameLogic';

describe('safeEvaluateExpression', () => {
  describe('正常系', () => {
    it('should evaluate simple addition', () => {
      expect(safeEvaluateExpression('1 + 2')).toBe(3);
    });

    it('should evaluate simple subtraction', () => {
      expect(safeEvaluateExpression('5 - 3')).toBe(2);
    });

    it('should evaluate simple multiplication', () => {
      expect(safeEvaluateExpression('2 * 3')).toBe(6);
    });

    it('should evaluate simple division with integer result', () => {
      expect(safeEvaluateExpression('6 / 2')).toBe(3);
    });

    it('should evaluate expression with parentheses', () => {
      expect(safeEvaluateExpression('(1 + 2) * 3')).toBe(9);
    });

    it('should evaluate complex expression', () => {
      expect(safeEvaluateExpression('((8 + 2) / 5) + 1')).toBe(3);
    });

    it('should handle expressions with multiple operations', () => {
      expect(safeEvaluateExpression('4 * 3 / 2 / 1')).toBe(6);
    });
  });

  describe('境界値・エラーケース', () => {
    it('should return null for division by zero', () => {
      expect(safeEvaluateExpression('1 / 0')).toBeNull();
    });

    it('should return null for division resulting in non-integer', () => {
      expect(safeEvaluateExpression('7 / 2')).toBeNull();
    });

    it('should return null for invalid characters', () => {
      expect(safeEvaluateExpression('1 + a')).toBeNull();
    });

    it('should return null for malformed expression', () => {
      expect(safeEvaluateExpression('1 +')).toBeNull();
    });

    it('should return null for expression with semicolon (injection attempt)', () => {
      expect(safeEvaluateExpression('1; alert("test")')).toBeNull();
    });

    it('should return null for empty expression', () => {
      expect(safeEvaluateExpression('')).toBeNull();
    });

    it('should handle negative results', () => {
      expect(safeEvaluateExpression('1 - 5')).toBe(-4);
    });

    it('should evaluate zero result', () => {
      expect(safeEvaluateExpression('5 - 5')).toBe(0);
    });
  });
});

describe('generateProblem', () => {
  it('should generate a valid problem', () => {
    const problem = generateProblem();
    expect(problem).not.toBeNull();
    expect(problem?.numbers).toHaveLength(4);
    expect(problem?.target).toBeGreaterThanOrEqual(0);
    expect(problem?.target).toBeLessThanOrEqual(9);
  });

  it('should generate numbers between 0 and 9', () => {
    const problem = generateProblem();
    expect(problem).not.toBeNull();
    problem?.numbers.forEach(num => {
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThanOrEqual(9);
    });
  });

  it('should generate integer target', () => {
    const problem = generateProblem();
    expect(problem).not.toBeNull();
    expect(Number.isInteger(problem?.target)).toBe(true);
  });

  it('should generate different problems on multiple calls', () => {
    const problem1 = generateProblem();
    const problem2 = generateProblem();

    // At least one of the problems should be different (statistically very likely)
    const areDifferent =
      JSON.stringify(problem1?.numbers) !== JSON.stringify(problem2?.numbers) ||
      problem1?.target !== problem2?.target;

    expect(areDifferent).toBe(true);
  });
});

describe('generateProblems', () => {
  it('should generate the specified number of problems', () => {
    const count = 5;
    const problems = generateProblems(count);
    expect(problems).toHaveLength(count);
  });

  it('should generate 10 problems for a full game', () => {
    const problems = generateProblems(10);
    expect(problems).toHaveLength(10);
  });

  it('should generate zero problems when count is 0', () => {
    const problems = generateProblems(0);
    expect(problems).toHaveLength(0);
  });

  it('should generate valid problems', () => {
    const problems = generateProblems(3);
    problems.forEach(problem => {
      expect(problem.numbers).toHaveLength(4);
      expect(problem.target).toBeGreaterThanOrEqual(0);
      expect(problem.target).toBeLessThanOrEqual(9);
      expect(Number.isInteger(problem.target)).toBe(true);
    });
  });
});

describe('difficulty ranges (Red first)', () => {
  it('easy: numbers should be within 0-5', () => {
    const problem = generateProblem('easy');
    expect(problem).not.toBeNull();
    if (problem) {
      expect(problem.numbers.every(n => n >= 0 && n <= 5)).toBe(true);
    }
  });

  it('hard: target should be within 0-20', () => {
    const problem = generateProblem('hard');
    expect(problem).not.toBeNull();
    if (problem) {
      expect(problem.target).toBeGreaterThanOrEqual(0);
      expect(problem.target).toBeLessThanOrEqual(20);
    }
  });
});
