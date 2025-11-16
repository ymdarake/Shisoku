# プロジェクトドキュメント インデックス

このメモリは、Shisokuプロジェクトの全ドキュメントへのナビゲーションを提供します。

## 📁 ドキュメント構成

### 🏗️ アーキテクチャ関連

#### `docs/architecture.md`
- **内容**: Shisoku（React + TypeScript + Vite）のアーキテクチャ詳細
- **対象**: このプロジェクト固有のアーキテクチャ
- **トピック**: ディレクトリ構成、コアロジック、状態管理、多言語対応

#### `docs/architecture-general.md`
- **内容**: 一般的なWebアプリケーションアーキテクチャパターン
- **対象**: プラットフォーム非依存の設計パターン
- **トピック**: レイヤーアーキテクチャ、状態管理、ディレクトリ構造

#### `docs/architecture-flutter.md`
- **内容**: Flutter向けアーキテクチャガイド
- **対象**: モバイルアプリ開発
- **トピック**: BLoC/Riverpod、状態管理、ディレクトリ構造例

#### `docs/architecture-go.md`
- **内容**: Go言語向けアーキテクチャガイド
- **対象**: バックエンド/CLI開発
- **トピック**: レイヤー構造、依存性注入、ディレクトリ例

#### `docs/react-data-architecture.md`
- **内容**: Reactプロジェクトのデータアーキテクチャパターン
- **対象**: React/TypeScript開発者
- **トピック**: 状態管理、データフロー、API連携

#### `docs/ARCHITECTURE-another-repo.md`
- **内容**: 別リポジトリ（NewsAnalyzer）のアーキテクチャ参照
- **対象**: 他プロジェクトからの学習用

### 🎮 ゲーム仕様・ロードマップ

#### `docs/game-specification.md`
- **内容**: 四則演算パズルゲームの詳細仕様
- **トピック**: ゲームルール、フロー、スコアリング、音楽・効果音仕様

#### `docs/future-roadmap.md`
- **内容**: 今後の機能拡張計画
- **分類**: 短期（1-2週間）、中期（1-2ヶ月）、長期（3ヶ月以上）
- **トピック**: 難易度設定、実績システム、マルチプレイヤーなど

### 💰 収益化・配信プラットフォーム

#### `docs/ko-fi-guide.md`
- **内容**: Ko-fi寄付サービス完全ガイド
- **トピック**: 手数料、決済方法（PayPal/Stripe）、実装手順、収益シミュレーション
- **推奨**: 寄付機能実装の第一候補

#### `docs/donation-services-comparison.md`
- **内容**: 7つの寄付サービス詳細比較
- **対象サービス**: Ko-fi、GitHub Sponsors、Buy Me a Coffee、Patreon、pixivFANBOX、PayPal.me、Amazon欲しいものリスト
- **比較項目**: 手数料、決済方法、月額料金、最低支払額

#### `docs/crazygames-publishing.md`
- **内容**: CrazyGamesゲームプラットフォーム出品ガイド
- **トピック**: 技術要件（ファイルサイズ制限、SDK統合）、Basic/Full Launch、収益化

#### `docs/cloudflare-pages-simulation.md`
- **内容**: Cloudflare Pages無料プラン利用可能量シミュレーション
- **トピック**: 帯域幅、ファイルサイズ、ユーザー数別のシミュレーション（1万PV〜1000万PV）
- **結論**: 月間100万PVまで無料で運用可能

### 📋 タスク管理

#### `docs/micro-tasks.md`
- **内容**: 超小粒度作業工程表（5-15分単位）
- **オプション**: 
  - Option 1: Tone.jsローカルビルド化 ✅ 完了
  - Option 2: 難易度設定の実装（進行中）
  - Option 3: React.memo最適化
  - Option 4: E2Eテスト導入
  - Option 5: ドキュメント整備

#### `docs/next-actions.md`
- **内容**: 次のアクション項目リスト
- **用途**: 短期的なTODO管理

#### `docs/architecture-todo.md`
- **内容**: アーキテクチャ改善のTODOリスト
- **用途**: 技術的負債の管理

### 🔧 リファクタリング

#### `docs/refactoring-plan.md`
- **内容**: リファクタリング計画
- **トピック**: コード改善、最適化、リファクタリング優先順位

---

## 🎯 目的別クイックアクセス

### 新規開発者がプロジェクトを理解するには
1. `CLAUDE.md` - プロジェクト概要と技術スタック
2. `docs/architecture.md` - アーキテクチャ詳細
3. `docs/game-specification.md` - ゲーム仕様
4. `README.md` - 実行方法とルール

### 収益化を検討するには
1. `docs/ko-fi-guide.md` - 寄付機能（最推奨）
2. `docs/donation-services-comparison.md` - サービス比較
3. `docs/cloudflare-pages-simulation.md` - ホスティング試算
4. `docs/crazygames-publishing.md` - プラットフォーム出品

### 次の開発タスクを決めるには
1. `docs/micro-tasks.md` - 詳細な作業工程
2. `docs/future-roadmap.md` - 長期的な機能拡張
3. `docs/next-actions.md` - 短期的なTODO

### アーキテクチャを学ぶには
1. `docs/architecture-general.md` - 一般論
2. `docs/react-data-architecture.md` - React特化
3. `docs/architecture-flutter.md` - Flutter参考
4. `docs/architecture-go.md` - Go参考

---

## 📊 ドキュメント統計

- **総数**: 16ファイル
- **カテゴリ**: 5カテゴリ
- **最新追加**: 収益化・配信関連ドキュメント（2025-01-16）

---

*最終更新: 2025-01-16*
