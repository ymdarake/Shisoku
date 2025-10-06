
import type { Problem } from '../types';

// Safely evaluate a mathematical expression
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

const getPermutations = <T,>(array: T[]): T[][] => {
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


export const generateProblem = (): Problem | null => {
    const operators = ['+', '-', '*', '/'];
    const MAX_TRIES = 5000;

    for(let i = 0; i < MAX_TRIES; i++) {
        const numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));

        const numPermutations = getPermutations(numbers);
        
        for (const p of numPermutations) {
            const [a, b, c, d] = p;
            
            for (const op1 of operators) {
                for (const op2 of operators) {
                    for (const op3 of operators) {
                        const expressions = [
                            `(${a} ${op1} ${b}) ${op2} (${c} ${op3} ${d})`,
                            `((${a} ${op1} ${b}) ${op2} ${c}) ${op3} ${d}`,
                            `${a} ${op1} ((${b} ${op2} ${c}) ${op3} ${d})`,
                            `${a} ${op1} (${b} ${op2} (${c} ${op3} ${d}))`,
                            `${a} ${op1} ${b} ${op2} ${c} ${op3} ${d}`
                        ];

                        for(const exp of expressions) {
                            const result = safeEvaluateExpression(exp);
                            if (result !== null && result >= 0 && result <= 9 && Number.isInteger(result)) {
                                return { numbers, target: result };
                            }
                        }
                    }
                }
            }
        }
    }
    // Fallback if no solution found (highly unlikely with 0-9)
    return { numbers: [1, 2, 3, 4], target: 6 }; // A known solvable problem
};

// Generate multiple problems at once
export const generateProblems = (count: number): Problem[] => {
    const problems: Problem[] = [];
    for (let i = 0; i < count; i++) {
        const problem = generateProblem();
        if (problem) {
            problems.push(problem);
        }
    }
    return problems;
};
