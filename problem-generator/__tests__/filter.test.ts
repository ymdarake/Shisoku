import { describe, it, expect } from 'vitest';
import { isTrivialProblem } from '../src/filter';

describe('filter - isTrivialProblem', () => {
  describe('目標が0でかつ数字に0が含まれる場合', () => {
    it('除外すべき（trueを返す）', () => {
      expect(isTrivialProblem([0, 1, 2, 3], 0)).toBe(true);
      expect(isTrivialProblem([5, 0, 8, 2], 0)).toBe(true);
      expect(isTrivialProblem([0, 0, 0, 0], 0)).toBe(true);
    });
  });

  describe('全ての数字が同じ場合', () => {
    it('除外すべき（trueを返す）', () => {
      expect(isTrivialProblem([2, 2, 2, 2], 8)).toBe(true);
      expect(isTrivialProblem([5, 5, 5, 5], 20)).toBe(true);
      expect(isTrivialProblem([0, 0, 0, 0], 0)).toBe(true);
    });
  });

  describe('有効な問題の場合', () => {
    it('除外しない（falseを返す）', () => {
      // 目標が0だが、数字に0が含まれない
      expect(isTrivialProblem([1, 2, 3, 4], 0)).toBe(false);

      // 数字に0が含まれるが、目標が0ではない
      expect(isTrivialProblem([0, 1, 2, 3], 5)).toBe(false);

      // 通常の問題
      expect(isTrivialProblem([1, 2, 3, 4], 6)).toBe(false);
      expect(isTrivialProblem([8, 5, 2, 1], 3)).toBe(false);
      expect(isTrivialProblem([9, 7, 4, 2], 5)).toBe(false);
    });
  });
});
