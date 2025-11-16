/**
 * 数式を安全に評価する
 */
export const safeEvaluateExpression = (expression: string): number | null => {
  if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
    return null;
  }

  // Prevent expressions like '1/0'
  if (/\/\s*0(?![.])/.test(expression)) {
    return null;
  }

  try {
    const result = new Function('return ' + expression)();
    if (typeof result === 'number' && Number.isFinite(result)) {
      // Ensure division results are integers as per rules
      if (expression.includes('/')) {
        if (result !== Math.floor(result)) {
          return null;
        }
      }
      return result;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * 配列の全順列を生成する
 */
export const getPermutations = <T,>(array: T[]): T[][] => {
  const result: T[][] = [];
  const permute = (arr: T[], m: T[] = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };
  permute(array);
  return result;
};
