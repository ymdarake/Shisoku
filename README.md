<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 四則（Shisoku） - 四則演算パズルゲーム

4つの数字と四則演算（+, -, ×, ÷）を使って目標の数字を作る数学パズルゲームです。

## 特徴

- 🎮 10問連続のタイムアタック形式
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

## 技術スタック

- **React 19** - UI フレームワーク（CDN経由、importmap使用）
- **TypeScript 5.8** - 型安全な開発
- **Vite 6** - 高速ビルドツール
- **Tone.js 14.7.77** - Web Audio API ベースの音楽ライブラリ
- **Tailwind CSS 3** - ユーティリティファーストCSS（CDN経由）

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
- インターネット接続が必須（React、Tone.js、Tailwind CSSがCDN経由）
- Gemini APIキーは不要（AI Studio連携は未使用）

## プロジェクト構造

```
/
├── components/       # UIコンポーネント
│   ├── StartScreen.tsx    # スタート画面
│   ├── GameScreen.tsx     # ゲーム画面
│   ├── EndScreen.tsx      # 結果画面
│   ├── RankingScreen.tsx  # ランキング画面
│   ├── Rules.tsx          # ルール表示コンポーネント
│   └── ...
├── services/         # ビジネスロジック
│   ├── gameLogic.ts       # 問題生成・式評価
│   ├── audio.ts           # Tone.js音声システム
│   └── ranking.ts         # ランキング永続化
├── constants/
│   └── locales.ts         # 多言語テキスト定義
├── App.tsx           # ルートコンポーネント
├── types.ts          # TypeScript型定義
└── index.html        # エントリーポイント
```

**重要**: `src/` ディレクトリは存在せず、全てルート直下に配置

## 詳細なドキュメント

開発者向けの詳細情報は [.claude/CLAUDE.md](.claude/CLAUDE.md) を参照してください。

## AI Studio連携

View your app in AI Studio: https://ai.studio/apps/drive/17nDmDyfyXoRDvDg_0_RvLdeMBUDiMfGx

## ライセンス

このプロジェクトはオープンソースです。
