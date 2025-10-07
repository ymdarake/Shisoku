# 四則（Shisoku） - 四則演算パズルゲーム

4つの数字と四則演算（+, -, ×, ÷）を使って目標の数字を作る数学パズルゲームです。

## 特徴

- 🎮 10問連続のタイムアタック形式
- ⏱️ 3,2,1カウントダウンでゲーム開始
- 🚀 問題事前生成で快適なゲームプレイ（問題間のラグなし）
- 🎵 Tone.jsによる音楽・効果音（BGM/SFXの個別ON/OFF可能）
- 🏆 ローカルランキング機能（localStorage）
- 🌐 日本語・英語の多言語対応
- 📱 レスポンシブデザイン（モバイル対応）

## ゲームルール

1. 4つの数字を全て1回ずつ使用する
2. 四則演算（+, -, ×, ÷）と括弧を使って式を作る
3. 目的の数字は0から9までの整数
4. 数字の順番は自由に変更可能
5. 割り算は結果が整数になる場合のみ有効
6. 数字を続けて入力して2桁以上の数（例: 12）を作ることは不可

### ゲーム例

**使う数字**: 8, 5, 2, 1
**目的の数字**: 4
**解答例**: `(8 + 2) / 5 + 1`

## 操作方法

### マウス操作
- 数字ボタンをクリックして式を構築
- 演算子ボタン（+, -, ×, ÷）と括弧ボタン（(, )）で計算式を作成
- **C**ボタンで全削除、**⌫**（バックスペース）ボタンで最後の入力を削除
- **スキップ**ボタンで問題をスキップ

### キーボード操作 ⌨️
- **数字キー（0-9）**: 数字を入力
- **演算子キー**: `+`, `-`, `*` (または `Shift+8`), `/` で演算子を入力
- **括弧キー**: `(` (または `Shift+9`), `)` (または `Shift+0`) で括弧を入力
- **Backspace**: 最後の入力を削除
- **Enter**: 式を判定（4つの数字を全て使用している場合）
- **Escape**: 入力をクリア

### ヘッダー操作
- **🎵/🔇**: BGMのON/OFF
- **🔊/🔈**: 効果音のON/OFF
- **☀️/🌙**: ライトモード/ダークモードの切り替え
- **言語切替**: 日本語/英語の切り替え

## 技術スタック

- **React 19** - UI フレームワーク（npmパッケージ）
- **TypeScript 5.8** - 型安全な開発
- **Vite 6** - 高速ビルドツール
- **Tone.js 14.7.77** - Web Audio API ベースの音楽ライブラリ（CDN経由）
- **Tailwind CSS 3** - ユーティリティファーストCSS（ローカルビルド with PostCSS）

## ローカル実行

**前提条件**: Node.js

1. 依存関係をインストール:
   ```bash
   npm install
   ```

2. 開発サーバーを起動:
   ```bash
   npm run dev
   ```
   → `http://localhost:3000` でアクセス可能（0.0.0.0でホスト）

3. その他のコマンド:
   ```bash
   npm run build   # プロダクションビルド
   npm run preview # ビルド後のプレビュー
   ```

**注意**:
- インターネット接続が必須（Tone.jsがCDN経由）
- Gemini APIキーは不要（AI Studio連携は未使用）

## プロジェクト構造

```
/
├── src/
│   ├── components/       # UIコンポーネント
│   │   ├── StartScreen.tsx      # スタート画面
│   │   ├── CountdownScreen.tsx  # カウントダウン画面
│   │   ├── GameScreen.tsx       # ゲーム画面
│   │   ├── EndScreen.tsx        # 結果画面
│   │   ├── RankingScreen.tsx    # ランキング画面
│   │   ├── Rules.tsx            # ルール表示コンポーネント
│   │   └── ...
│   ├── services/         # ビジネスロジック
│   │   ├── gameLogic.ts         # 問題生成・式評価
│   │   ├── audio.ts             # Tone.js音声システム
│   │   └── ranking.ts           # ランキング永続化
│   ├── constants/
│   │   └── locales.ts           # 多言語テキスト定義
│   ├── styles/
│   │   └── index.css            # Tailwindディレクティブとカスタムスタイル
│   ├── App.tsx           # ルートコンポーネント
│   ├── index.tsx         # エントリーポイント
│   └── types.ts          # TypeScript型定義
├── docs/             # ドキュメント
├── postcss.config.js # PostCSS設定
├── tailwind.config.js # Tailwind CSS設定
└── index.html        # HTML
```

## 📚 ドキュメント

### 開発者向け

- **[アーキテクチャ](docs/architecture.md)** - システム設計、ディレクトリ構成、コアロジックの詳細
- **[ゲーム仕様](docs/game-specification.md)** - ルール、ゲームフロー、スコアリング、音楽・効果音
- **[拡張の展望](docs/future-roadmap.md)** - 短期・中期・長期の機能追加計画、技術的改善
- **[Claude Code 向けガイド](.claude/CLAUDE.md)** - AI アシスタント用のプロジェクト情報

## AI Studio連携

View your app in AI Studio: https://ai.studio/apps/drive/17nDmDyfyXoRDvDg_0_RvLdeMBUDiMfGx

## ライセンス

このプロジェクトはオープンソースです。
