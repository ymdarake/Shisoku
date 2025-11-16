import { describe, it, expect } from 'vitest';
import { safeEvaluateExpression } from '../../service/gameLogic';

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
