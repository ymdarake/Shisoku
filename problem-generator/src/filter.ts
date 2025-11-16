/**
 * トリビアル（自明すぎる）問題を判定する
 *
 * @param numbers - 4つの数字
 * @param target - 目標の数字
 * @returns true = 除外すべき問題、false = 有効な問題
 */
export const isTrivialProblem = (numbers: number[], target: number): boolean => {
  // 目標が0 かつ 数字に0が含まれる場合
  if (target === 0 && numbers.includes(0)) {
    return true;
  }

  // 全ての数字が同じ場合
  const allSame = numbers.every(num => num === numbers[0]);
  if (allSame) {
    return true;
  }

  return false;
};
