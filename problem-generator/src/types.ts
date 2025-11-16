export type ProblemCategory = 'no-parens' | 'one-paren' | 'multi-paren';

export interface Problem {
  numbers: number[];
  target: number;
  category: ProblemCategory;
}

export interface ClassificationResult {
  category: ProblemCategory;
  simplestSolution: string;
}
