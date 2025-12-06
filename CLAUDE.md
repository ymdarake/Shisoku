# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

四則演算（四則）パズルゲーム - 4つの数字と四則演算を使って目標の数字を作る数学パズルゲーム。React + TypeScript + Viteで実装されており、Web Audio APIによる音楽・効果音機能とFirebase Firestoreによるグローバルランキング機能を備えています。

## 開発コマンド

```bash
# 開発サーバー起動（localhost:3000）
npm run dev


# プロダクションビルド
npm run build

# テスト実行（Vitest）
npm test                # 全テスト実行
npm run test:ui         # テストUIモード
npm run test:coverage   # カバレッジレポート生成
```

## アーキテクチャ

### ディレクトリ構成（クリーンアーキテクチャ）

```
src/
├── component/          # UIコンポーネント（プレゼンテーション層）
├── config/             # 設定（Firebase初期化など）
├── constant/           # 定数（locales, game設定, difficulty）
├── context/            # Reactコンテキスト
├── domain/             # ドメイン層（型定義・インターフェース）
│   ├── ranking/        # ランキング関連の型とリポジトリインターフェース
│   └── preferences/    # 設定関連の型とリポジトリインターフェース
├── repository/         # データアクセス層（リポジトリ実装）
│   ├── firebase/       # FirebaseRankingRepository
│   ├── localStorage/   # LocalStorageRankingRepository, LocalStoragePreferencesRepository
│   └── memory/         # InMemoryRankingRepository（テスト用）
├── service/            # サービス層
│   ├── gameLogic.ts    # 問題生成・式評価
│   ├── audio.ts        # Web Audio API音声システム
│   └── problemDatabase.ts  # 問題データベース
├── usecase/            # ユースケース層
│   ├── saveScore.ts    # スコア保存
│   └── loadRankings.ts # ランキング読み込み
├── hook/               # カスタムフック
├── hooks/              # カスタムフック（useDarkMode, useKeyboardInput）
├── utils/              # ユーティリティ関数
├── App.tsx             # ルートコンポーネント・状態管理
└── types.ts            # 共通型定義
```

### 設計パターン

**リポジトリパターン**: ドメインインターフェースを定義し、複数の実装（Firebase, LocalStorage, InMemory）を切り替え可能

```
domain/ranking/RankingRepository.ts  # インターフェース定義
repository/firebase/FirebaseRankingRepository.ts    # Firestore実装
repository/localStorage/LocalStorageRankingRepository.ts  # localStorage実装
repository/memory/InMemoryRankingRepository.ts      # テスト用メモリ実装
```

**ユースケース層**: ビジネスロジックをリポジトリから分離
- `SaveScoreUseCase`: スコア保存（日付自動付与）
- `LoadRankingsUseCase`: ランキング取得

**状態管理**: App.tsxで集中管理
- `gameState`: 'idle' | 'countdown' | 'playing' | 'finished' | 'ranking'
- `difficulty`: 'easy' | 'normal' | 'hard'

### ゲームフロー

1. StartScreen → 難易度選択・ゲーム開始
2. CountdownScreen → 3,2,1カウントダウン（この間に全10問を事前生成）
3. GameScreen → 10問連続でプレイ
4. EndScreen → スコア表示・ランキング保存
5. RankingScreen → グローバルランキング一覧

### コアロジック

**gameLogic.ts** - 問題生成とバリデーション
- `generateProblem()`: 4つのランダムな数字から有効な問題を生成
- `safeEvaluateExpression()`: ユーザー入力式の安全な評価

**audio.ts** - 純粋なWeb Audio API実装（Tone.js不使用）
- BGM: オシレーター + メロディパターン + ベースパターン
- SFX: クリック音、正解音、不正解音、カウントダウン音など

### Firebase構成

**Firestore**:
- コレクション: `rankings`
- セキュリティルール: `firestore.rules`
- インデックス: `firestore.indexes.json`

**環境変数**（`.env.development`, `.env.production`）:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_PROJECT_ID`
- 他Firebase設定

**プロジェクトエイリアス**（`.firebaserc`）:
- `tes`: 開発用（shisoku-tes）
- `prd`: 本番用（shisoku-prd）

## 技術スタック

- **React 19** + TypeScript 5.8
- **Vite 6** - ビルドツール
- **Firebase Firestore** - グローバルランキング
- **Web Audio API** - 音楽・効果音
- **Tailwind CSS 3** - スタイリング
- **Vitest** - テスト

## 重要な制約・仕様

1. **問題生成**: 必ず解答可能な問題のみ生成（最大5000回試行）
2. **割り算ルール**: 結果が整数の場合のみ有効
3. **全数字使用必須**: 4つの数字を全て1回ずつ使う
4. **数字の結合禁止**: 連続入力で2桁以上の数を作ることは不可
5. **Firestoreルール**: `time >= 0`, `score 0-10`, `difficulty` は 'easy'|'normal'|'hard'

## デプロイ

**GitHub Pages**: `.github/workflows/gh-pages.yml`
- Firebase環境変数はGitHub Secretsから注入

**Firestoreルールデプロイ**:
```bash
firebase use tes && firebase deploy --only firestore:rules  # 開発
firebase use prd && firebase deploy --only firestore:rules  # 本番
```
