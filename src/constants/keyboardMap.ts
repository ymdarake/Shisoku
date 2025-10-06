// キーボード入力のキー定義とユーティリティ

export const NUMBER_KEYS = new Set([
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
]);

export const OPERATOR_KEYS = new Map<string, string>([
  ['+', '+'],
  ['-', '-'],
  ['*', '*'], // Shift+8 など配列依存のため、実際の入力はフック側で判定
  ['/', '/'],
]);

export const SPECIAL_KEYS = new Map<string, 'enter' | 'backspace' | 'escape'>([
  ['Enter', 'enter'],
  ['Backspace', 'backspace'],
  ['Escape', 'escape'],
]);

export function isNumberKey(key: string): boolean {
  return NUMBER_KEYS.has(key);
}

export function toOperator(key: string, shiftKey: boolean): string | null {
  if (OPERATOR_KEYS.has(key)) return key;
  // US配列想定: Shift+8 => '*'
  if (key === '8' && shiftKey) return '*';
  return null;
}

export function toSpecial(key: string): 'enter' | 'backspace' | 'escape' | null {
  return SPECIAL_KEYS.get(key) ?? null;
}


