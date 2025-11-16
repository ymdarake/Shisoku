# 技術スタックと設定ファイル インデックス

このメモリは、Shisokuプロジェクトの技術スタック、設定ファイル、開発環境へのナビゲーションを提供します。

## 🛠️ 技術スタック

### フロントエンド

#### React 19
- **用途**: UIフレームワーク
- **特徴**: 関数コンポーネント + Hooks
- **管理**: npm パッケージ（CDNから移行済み）

#### TypeScript 5.8
- **用途**: 型安全な開発
- **設定**: `tsconfig.json`

#### Vite 6
- **用途**: 高速ビルドツール
- **設定**: `vite.config.ts`
- **特徴**: 
  - ポート3000（0.0.0.0でホスト）
  - パスエイリアス: `@/` → ルートディレクトリ

#### Tone.js 15.1.22
- **用途**: Web Audio APIベースの音楽ライブラリ
- **管理**: npm パッケージ
- **型定義**: 付属（`Tone.PolySynth`, `Tone.Volume` 等）

#### Tailwind CSS 3
- **用途**: ユーティリティファーストCSS
- **ビルド**: ローカル（PostCSS + autoprefixer）
- **設定**: `tailwind.config.js`, `postcss.config.js`
- **カスタム**: shake-animation（振動エフェクト）

### テスト

#### Vitest 3.2.4
- **用途**: テストフレームワーク
- **設定**: `vitest.config.ts`（未作成の場合はvite.config.tsを使用）

#### @testing-library/react 16.3.0
- **用途**: Reactコンポーネントテスト
- **特徴**: ユーザー中心のテスト

#### @vitest/coverage-v8
- **用途**: カバレッジレポート生成
- **コマンド**: `npm run test:coverage`

#### jsdom
- **用途**: ブラウザ環境シミュレーション

### ストレージ

#### localStorage
- **用途**: データ永続化
- **キー**: 
  - `'mathPuzzleRanking'` - ランキングデータ
  - `'mathPuzzlePreferences'` - 設定データ

---

## 📁 重要な設定ファイル

### ビルド・開発環境

#### `vite.config.ts`
```typescript
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Shisoku/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
```

**注意**: Gemini API関連の設定は削除済み（未使用のため）

#### `tsconfig.json`
- **役割**: TypeScript設定
- **主要設定**: 
  - target: ES2020
  - jsx: react-jsx
  - strict mode有効

#### `package.json`
- **scripts**:
  - `dev`: 開発サーバー起動
  - `build`: プロダクションビルド
  - `preview`: ビルド後のプレビュー
  - `test`: テスト実行
  - `test:ui`: テストUIモード
  - `test:coverage`: カバレッジレポート
  - `coverage:md`: カバレッジMarkdown出力

#### `tailwind.config.js`
- **役割**: Tailwind CSS設定
- **content**: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- **theme**: カスタムアニメーション定義
- **darkMode**: `'class'`（クラスベース）

#### `postcss.config.js`
- **役割**: PostCSS設定
- **plugins**: 
  - `tailwindcss`
  - `autoprefixer`

### HTML

#### `index.html`
- **役割**: エントリーポイントHTML
- **特徴**: 
  - React rootマウント
  - Tone.jsのCDN読み込みは削除済み（npmパッケージに移行）

### Git・CI/CD

#### `.gitignore`
- **除外対象**: 
  - `node_modules/`
  - `dist/`
  - `.env`
  - エディタ設定ファイル

### ドキュメント

#### `CLAUDE.md`
- **役割**: Claude Code向けプロジェクト情報
- **場所**: ルートディレクトリ（`.claude/`から移動済み）
- **内容**: 
  - プロジェクト概要
  - 開発コマンド
  - アーキテクチャ
  - 技術スタック
  - 重要な制約・仕様

#### `README.md`
- **役割**: プロジェクトREADME
- **内容**: 
  - ゲーム説明
  - 操作方法
  - ローカル実行手順
  - 技術スタック

---

## 🎯 開発コマンド

### 開発環境

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動（localhost:3000、0.0.0.0でホスト）
npm run dev

# プロダクションビルド
npm run build

# プレビュー（ビルド後の確認）
npm run preview
```

### テスト

```bash
# テスト実行
npm test

# テストUIモード
npm run test:ui

# カバレッジレポート生成
npm run test:coverage

# カバレッジをMarkdown形式で出力
npm run coverage:md
```

### Git操作

```bash
# 現在の状態確認
git status

# コミット履歴確認
git log --oneline -5

# 変更内容確認
git diff
```

---

## 🌐 ブラウザAPI依存

### 必須API

#### localStorage
- **用途**: ランキング・設定の永続化
- **キー**: 
  - `mathPuzzleRanking`
  - `mathPuzzlePreferences`

#### Web Audio API（Tone.js）
- **用途**: BGM・効果音の再生
- **初期化**: ユーザーインタラクション後に `Tone.start()`
- **制約**: autoplay policyに注意

---

## 📦 主要な依存関係

### dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "tone": "^15.1.22"
}
```

### devDependencies

```json
{
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.0",
  "@testing-library/user-event": "^14.6.1",
  "@types/node": "^22.14.0",
  "@vitejs/plugin-react": "^5.0.0",
  "@vitest/coverage-v8": "^3.2.4",
  "@vitest/ui": "^3.2.4",
  "autoprefixer": "^10.4.20",
  "jsdom": "^27.0.0",
  "postcss": "^8.4.49",
  "tailwindcss": "^3.4.17",
  "typescript": "~5.8.2",
  "vite": "^6.2.0",
  "vitest": "^3.2.4"
}
```

---

## 🚨 重要な制約

### ファイルサイズ

- **ビルド後サイズ**: 約597 KB（gzip: 159 KB）
- **ファイル数**: 3ファイル
- **警告**: JSバンドルが500 KBを超えている
  - コード分割（dynamic import）を検討推奨

### 実行環境

- **Node.js**: 必須
- **インターネット接続**: 不要（全依存関係ローカルビルド）
- **対応ブラウザ**: Chrome、Edge、Safari（モダンブラウザ）

### 技術的制約

- **式評価**: `new Function()` を使用（サーバーサイドレンダリング不可）
- **音声初期化**: Tone.jsはユーザーインタラクション後に初期化必須

---

## 🔧 デバッグのヒント

### Tone.js関連

**問題**: BGM/効果音が再生されない

**チェックポイント**:
1. ユーザーインタラクション後に `Tone.start()` を呼んでいるか
2. ブラウザのautoplay policyをチェック
3. コンソールエラーを確認

### localStorage関連

**問題**: ランキングが保存されない

**チェックポイント**:
1. localStorage容量制限（通常5-10MB）
2. ブラウザのlocalStorageブロック設定
3. プライベートブラウジングモードではないか

### ビルド関連

**問題**: ビルドサイズが大きい

**対処法**:
1. dynamic import でコード分割
2. `build.rollupOptions.output.manualChunks` でチャンク最適化
3. 未使用の依存関係を削除

---

## 📊 プロジェクト統計

- **総ファイル数**: 約60ファイル
- **コード行数**: 推定5,000行以上
- **テストカバレッジ**: 高（主要ロジックをカバー）
- **ビルド時間**: 約1.3秒
- **開発サーバー起動時間**: 約2秒

---

*最終更新: 2025-01-16*
