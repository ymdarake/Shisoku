import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateProblems } from './generator';
import type { Problem } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET_COUNTS = {
  'no-parens': 800,
  'one-paren': 800,
  'multi-paren': 400,
} as const;

const TOTAL_COUNT = Object.values(TARGET_COUNTS).reduce((a, b) => a + b, 0);

console.log('🎮 四則演算パズル - 問題生成開始');
console.log(`目標: ${TOTAL_COUNT}問 (no-parens: ${TARGET_COUNTS['no-parens']}, one-paren: ${TARGET_COUNTS['one-paren']}, multi-paren: ${TARGET_COUNTS['multi-paren']})`);
console.log('');

const startTime = Date.now();

console.log('📝 問題を生成中...');
const problems: Problem[] = generateProblems(TARGET_COUNTS);

const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(`✓ ${problems.length}問生成完了 (${elapsed}秒)`);
console.log('');

// カテゴリ別の統計
const stats = {
  'no-parens': problems.filter(p => p.category === 'no-parens').length,
  'one-paren': problems.filter(p => p.category === 'one-paren').length,
  'multi-paren': problems.filter(p => p.category === 'multi-paren').length,
};

console.log('📊 カテゴリ別内訳:');
console.log(`  no-parens: ${stats['no-parens']}問 (${((stats['no-parens'] / problems.length) * 100).toFixed(1)}%)`);
console.log(`  one-paren: ${stats['one-paren']}問 (${((stats['one-paren'] / problems.length) * 100).toFixed(1)}%)`);
console.log(`  multi-paren: ${stats['multi-paren']}問 (${((stats['multi-paren'] / problems.length) * 100).toFixed(1)}%)`);
console.log('');

// 出力先
const outputPath = path.join(__dirname, '../../src/data/problems.json');
const outputDir = path.dirname(outputPath);

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1行1問のフォーマットで出力
const lines = ['['];
problems.forEach((p, i) => {
  const line = JSON.stringify(p) + (i < problems.length - 1 ? ',' : '');
  lines.push(line);
});
lines.push(']');
fs.writeFileSync(outputPath, lines.join('\n'));

console.log(`💾 保存完了: ${outputPath}`);
console.log(`📦 ファイルサイズ: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
console.log('');
console.log('✨ 問題生成が完了しました！');
