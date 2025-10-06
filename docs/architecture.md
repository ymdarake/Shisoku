# アーキテクチャドキュメント

## ディレクトリ構成

```
/
├── components/      # UIコンポーネント（12ファイル）
│   ├── StartScreen.tsx
│   ├── CountdownScreen.tsx  # カウントダウン画面
│   ├── GameScreen.tsx
│   ├── EndScreen.tsx
│   ├── RankingScreen.tsx
│   ├── Header.tsx
│   ├── Controls.tsx
│   ├── InputDisplay.tsx
│   ├── ProblemDisplay.tsx
│   ├── MessageArea.tsx
│   ├── Rules.tsx
│   └── icons.tsx
├── services/        # ビジネスロジック
│   ├── gameLogic.ts    # 問題生成・式評価
│   ├── audio.ts        # Tone.js音声システム
│   └── ranking.ts      # localStorage永続化
├── constants/
│   └── locales.ts      # 多言語テキスト定義
├── App.tsx             # ルートコンポーネント・状態管理
├── index.tsx           # エントリーポイント
├── index.css           # Tailwindディレクティブとカスタムスタイル
├── types.ts            # TypeScript型定義
├── postcss.config.js   # PostCSS設定
├── tailwind.config.js  # Tailwind CSS設定
└── index.html          # HTML
```

**重要**: `src/` ディレクトリは存在せず、ルート直下に配置

## 主要な設計パターン

### 状態管理

**App.tsx で集中管理し、props で各コンポーネントに配布**

- `gameState`: 'idle' | 'playing' | 'finished' | 'ranking' の画面遷移を管理
- `currentProblem`: 現在のゲーム問題（4つの数字と目標値）
- `results`: ゲーム結果の配列（全10問分）

### ゲームフロー

1. **StartScreen** → ユーザーがスタートボタンをクリック
2. **CountdownScreen** → 3,2,1カウントダウン（この間に全10問を事前生成）
3. **GameScreen** → 10問連続でプレイ（事前生成された問題を順番に表示）
4. **EndScreen** → スコア表示・ランキング保存
5. **RankingScreen** → ランキング一覧表示

## コアロジック（services/）

### gameLogic.ts - 問題生成とバリデーション

#### `generateProblem()`
4つのランダムな数字から有効な問題を生成

**アルゴリズム**:
- 全ての順列組み合わせ（4! = 24通り）
- 全ての演算子組み合わせ（4³ = 64通り）
- 5種類の括弧パターン
- 結果が0-9の整数になる組み合わせを探索
- 最大5000回試行、失敗時はフォールバック問題を返す

#### `generateProblems(count)`
複数の問題を一括生成（カウントダウン中に全10問生成）

#### `safeEvaluateExpression()`
ユーザー入力式の安全な評価

**検証項目**:
- 数式の妥当性検証（不正な文字の排除）
- ゼロ除算チェック
- 整数結果の保証（割り算は整数結果のみ有効）

### audio.ts - Tone.js ベースの音楽システム

#### BGM
FM合成シンセ + ベース + ドラム（キック・ハイハット）の4トラック構成

#### SFX（効果音）
- クリック音
- 正解音（3和音上昇）
- 不正解音（不協和音）
- 無効操作音
- カウントダウン音（A4音）
- スタート音（C5→E5→C6の上昇和音）

#### ボリューム管理
BGMとSFXは独立してON/OFF可能

### ranking.ts - ランキング永続化

- **ストレージ**: localStorage（キー: `'mathPuzzleRanking'`）
- **最大保存件数**: 10件
- **ソートロジック**: スコア降順 → 時間昇順

## GameScreen の式構築ロジック

### Token システム

ユーザー入力を `Token[]` として管理

```typescript
type Token = {
  value: string;
  type: 'number' | 'operator';
  originalIndex?: number;
}
```

- 数字は元の配列のインデックスを保持し、使用済み数字の追跡に使用

### 入力バリデーション

- **数字の後に数字を置けない**（「1 2」は不可）
- **数字の後に開き括弧を置けない**（「1 (」は不可）
- **演算子の後に演算子を置けない**（「+ *」は不可）
- **括弧のバランスをリアルタイムチェック**

### 自動判定トリガー

以下の3条件が揃うと自動的に `checkAnswer()` が実行される:

1. 4つの数字を全て使用
2. 最後のトークンが数字または閉じ括弧
3. 括弧が正しくバランスしている

## 多言語対応

### locales.ts

`constants/locales.ts` で日本語・英語の全UIテキストを定義

```typescript
type Language = 'ja' | 'en';
```

### Rules コンポーネント

**components/Rules.tsx** - ゲームルールを表示する再利用可能なコンポーネント

**Props**:
- `title`: ルールセクションのタイトル
- `rules`: ルール項目のオブジェクト（`{ [key: string]: string }` 形式）
- `exampleTitle`: 例題セクションのタイトル
- `exampleLines`: 例題の各行データ（`{ label: string, value: string }[]` 形式）

**使用例**:
- StartScreenで使用され、ゲーム開始前にルールと具体例を表示
- 例題表示: `8, 5, 2, 1` → `4` の解答例として `(8 + 2) / 5 + 1` を提示

## 技術スタック

| 分類 | 技術 | 詳細 |
|------|------|------|
| **フレームワーク** | React 19 | 関数コンポーネント + Hooks、npmパッケージとして管理 |
| **ビルドツール** | Vite 6 | ポート3000、ホスト0.0.0.0、パスエイリアス `@/` |
| **言語** | TypeScript 5.8 | 型安全性確保 |
| **音楽** | Tone.js 14.7.77 | CDN経由、グローバル変数 `Tone` として宣言 |
| **スタイリング** | Tailwind CSS 3 | ローカルビルド（PostCSS + autoprefixer）、カスタムアニメーション `shake-animation` |
| **ストレージ** | localStorage | キー: `'mathPuzzleRanking'` |

## 開発・デバッグ時の注意点

### 環境要件

- **インターネット接続**: Tone.jsのみCDN経由（React、Tailwind CSSはローカルビルド）
- **ブラウザAPI**: localStorage、Web Audio API（Tone.js）が必要
- **ポート3000**: デフォルト開発サーバーポート

### 技術的制約

- 式評価に `new Function()` を使用（サーバーサイドレンダリング不可）
- Tone.jsのみCDN依存
- テストフレームワーク未導入（手動テストのみ）

### デバッグポイント

| 問題 | 確認ポイント |
|------|--------------|
| Tone.js初期化エラー | ユーザーインタラクション後に `Tone.start()` を確認 |
| 音声再生されない | ブラウザのautoplay policyを確認 |
| ランキング保存されない | localStorage容量・ブロック設定を確認 |

## 定数

- **TOTAL_QUESTIONS**: 10 (`App.tsx:15`) - ゲームは常に10問
