# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

四則演算（四則）パズルゲーム - 4つの数字と四則演算を使って目標の数字を作る数学パズルゲーム。React + TypeScript + Viteで実装されており、Tone.jsを使った音楽・効果音機能とランキング機能を備えています。

## 開発コマンド

```bash
# 開発サーバー起動（localhost:3000、0.0.0.0でホスト）
npm run dev

# プロダクションビルド
npm run build

# プレビュー（ビルド後の確認）
npm preview

# 依存関係のインストール
npm install

# テスト実行（Vitest）
npm test                # テスト実行
npm run test:ui         # テストUIモード
npm run test:coverage   # カバレッジレポート生成
npm run coverage:md     # カバレッジをMarkdown形式で出力
```

## アーキテクチャ

### ディレクトリ構成

```
/
├── src/
│   ├── components/      # UIコンポーネント（12ファイル）
│   │   ├── StartScreen.tsx
│   │   ├── CountdownScreen.tsx  # カウントダウン画面
│   │   ├── GameScreen.tsx
│   │   ├── EndScreen.tsx
│   │   ├── RankingScreen.tsx
│   │   ├── Header.tsx
│   │   ├── Controls.tsx
│   │   ├── InputDisplay.tsx
│   │   ├── ProblemDisplay.tsx
│   │   ├── MessageArea.tsx
│   │   ├── Rules.tsx
│   │   └── icons.tsx
│   ├── services/        # ビジネスロジック
│   │   ├── gameLogic.ts    # 問題生成・式評価
│   │   ├── audio.ts        # Tone.js音声システム
│   │   └── ranking.ts      # localStorage永続化
│   ├── constants/
│   │   └── locales.ts      # 多言語テキスト定義
│   ├── styles/
│   │   └── index.css       # Tailwindディレクティブとカスタムスタイル
│   ├── App.tsx             # ルートコンポーネント・状態管理
│   ├── index.tsx           # エントリーポイント
│   └── types.ts            # TypeScript型定義
├── docs/                   # ドキュメント
├── postcss.config.js       # PostCSS設定
├── tailwind.config.js      # Tailwind CSS設定
└── index.html              # HTML
```

### 主要な設計パターン

**状態管理**: App.tsxで集中管理し、propsで各コンポーネントに配布
- `gameState`: 'idle' | 'playing' | 'finished' | 'ranking' の画面遷移を管理
- `currentProblem`: 現在のゲーム問題（4つの数字と目標値）
- `results`: ゲーム結果の配列（全10問分）

**ゲームフロー**:
1. StartScreen → ユーザーがスタートボタンをクリック
2. CountdownScreen → 3,2,1カウントダウン（この間に全10問を事前生成）
3. GameScreen → 10問連続でプレイ（事前生成された問題を順番に表示）
4. EndScreen → スコア表示・ランキング保存
5. RankingScreen → ランキング一覧表示

### コアロジック（services/）

**gameLogic.ts** - 問題生成とバリデーション
- `generateProblem()`: 4つのランダムな数字から有効な問題を生成
  - 全ての順列組み合わせ（4! = 24通り）
  - 全ての演算子組み合わせ（4³ = 64通り）
  - 5種類の括弧パターン
  - 結果が0-9の整数になる組み合わせを探索
- `generateProblems(count)`: 複数の問題を一括生成（カウントダウン中に全10問生成）
- `safeEvaluateExpression()`: ユーザー入力式の安全な評価
  - 数式の妥当性検証（不正な文字の排除）
  - ゼロ除算チェック
  - 整数結果の保証（割り算は整数結果のみ有効）

**audio.ts** - Tone.jsベースの音楽システム
- BGM: FM合成シンセ + ベース + ドラム（キック・ハイハット）の4トラック構成
- SFX:
  - クリック音、正解音（3和音上昇）、不正解音（不協和音）、無効操作音
  - カウントダウン音（A4音）
  - スタート音（C5→E5→C6の上昇和音）
- ボリューム管理: BGMとSFXは独立してON/OFF可能

**ranking.ts** - ランキング永続化
- localStorage使用（キー: 'mathPuzzleRanking'）
- 最大10件保存
- ソートロジック: スコア降順 → 時間昇順

### GameScreen の式構築ロジック

**Token システム**:
- ユーザー入力を `Token[]` として管理（`{value: string, type: 'number' | 'operator', originalIndex?: number}`）
- 数字は元の配列のインデックスを保持し、使用済み数字の追跡に使用

**入力バリデーション**:
- 数字の後に数字を置けない（「1 2」は不可）
- 数字の後に開き括弧を置けない（「1 (」は不可）
- 演算子の後に演算子を置けない（「+ *」は不可）
- 括弧のバランスをリアルタイムチェック

**自動判定トリガー**:
- 4つの数字を全て使用
- 最後のトークンが数字または閉じ括弧
- 括弧が正しくバランスしている
→ この3条件が揃うと自動的に `checkAnswer()` が実行される

### 多言語対応

`constants/locales.ts` で日本語・英語の全UIテキストを定義。
`Language` 型（'ja' | 'en'）でアプリ全体の言語を切り替え。

**ルール表示コンポーネント (components/Rules.tsx)**:
- ゲームルールを表示する再利用可能なコンポーネント
- props:
  - `title`: ルールセクションのタイトル
  - `rules`: ルール項目のオブジェクト（ `{ [key: string]: string }` 形式）
  - `exampleTitle`: 例題セクションのタイトル
  - `exampleLines`: 例題の各行データ（`{ label: string, value: string }[]` 形式）
- StartScreenで使用され、ゲーム開始前にルールと具体例を表示
 - 例題表示: `8, 5, 2, 1` → `3` の解答例として `(8 + 2) / 5 + 1` を提示

## 技術スタック

- **フレームワーク**: React 19 (関数コンポーネント + Hooks)
  - npmパッケージとして管理（CDNから移行済み）
- **ビルドツール**: Vite 6
  - サーバー: ポート3000、ホスト0.0.0.0
  - パスエイリアス: `@/` → ルートディレクトリ
- **言語**: TypeScript 5.8
- **音楽**: Tone.js 15.1.22
  - npm パッケージとして管理（`import * as Tone from 'tone'`）
  - 型定義付き（`Tone.PolySynth`, `Tone.Volume` 等）
- **スタイリング**: Tailwind CSS 3
  - ローカルビルド（PostCSS + autoprefixer）
  - カスタムアニメーション: `shake-animation`（振動エフェクト）
  - 設定ファイル: `tailwind.config.js`, `postcss.config.js`
- **ストレージ**: localStorage（キー: `'mathPuzzleRanking'`）

## 重要な制約・仕様

1. **問題生成**: 必ず解答可能な問題のみ生成（最大5000回試行、失敗時はフォールバック問題）
2. **割り算ルール**: 結果が整数の場合のみ有効（例: 8/2=4 は有効、7/2=3.5 は無効）
3. **全数字使用必須**: 4つの数字を全て1回ずつ使う必要がある
4. **数字の結合禁止**: 連続した数字入力で2桁以上の数（例: 12）を作ることは不可（例: `1` と `2` は別々の数字として扱う）
5. **音声初期化**: Tone.jsはユーザーインタラクション後に初期化（`audioService.init()` → `await Tone.start()`）
6. **定数**: `TOTAL_QUESTIONS = 10` (App.tsx:15) - ゲームは常に10問

## 開発・デバッグ時の注意点

### 環境要件
- **ブラウザAPI**: localStorage、Web Audio API（Tone.js）が必要
- **ポート3000**: デフォルト開発サーバーポート
- **オフライン動作**: 全依存関係がローカルビルドされるため、オフライン環境でも動作可能

### 技術的制約
- 式評価に `new Function()` を使用（サーバーサイドレンダリング不可）

### テスト
- **テストフレームワーク**: Vitest 3.2.4
- **テストライブラリ**: @testing-library/react 16.3.0
- **カバレッジツール**: @vitest/coverage-v8
- **環境**: jsdom（ブラウザ環境のシミュレーション）
- ユニットテスト・コンポーネントテスト導入済み

### デバッグポイント
- Tone.js初期化エラー → ユーザーインタラクション後に `Tone.start()` を確認
- 音声再生されない → ブラウザのautoplay policyを確認
- ランキング保存されない → localStorage容量・ブロック設定を確認
