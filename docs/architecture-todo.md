# アーキテクチャ適用 TODO（TDDで進める）

小さな粒度で実装できる作業項目のリストです。各タスクは「テスト追加(RED) → 実装(GREEN) → リファクタリング(REFACTOR)」の順に進めます。

## 1) Composition Root（DI注入）
- [ ] index.tsx に DI 構成ルートを作成（Repository を注入）
  - RED: `index.test.tsx` で `setRankingRepository`/`setPreferencesRepository` がアプリ起動時1度だけ呼ばれる
  - GREEN: index.tsx で LocalStorage 実装を注入
  - REFACTOR: DI リセットのテストヘルパ

## 2) InMemory リポジトリ
- [ ] Ranking: `repository/memory/InMemoryRankingRepository.ts` を追加
  - RED: 契約テスト（保存/取得/難易度分離/ソート/上限）
  - GREEN: メモリ配列で実装
  - REFACTOR: ソート/上限をユーティリティ化
- [ ] Preferences: `repository/memory/InMemoryPreferencesRepository.ts` を追加
  - RED: 保存→読込往復、破損時 null
  - GREEN: メモリ実装

## 3) リポジトリ契約テスト
- [ ] `__tests__/repository/ranking.contract.test.ts` を作成（`runRankingContract(repoFactory)`）
- [ ] `__tests__/repository/preferences.contract.test.ts` を作成（`runPreferencesContract(repoFactory)`）

## 4) UseCase レイヤ（薄い）
- [ ] `usecase/saveScore.ts`（ランキング保存 + 難易度 + 日付付与）
  - RED: Repository モックで保存結果を検証
  - GREEN: Repository 経由で保存し配列返却
  - REFACTOR: Clock を DI
- [ ] `usecase/loadRankings.ts`（難易度別取得）
  - RED: 難易度渡しで対応データ
  - GREEN: Repository 経由で取得

## 5) Preferences Provider 導入
- [ ] `context/PreferencesContext.tsx` を作成
  - RED: 初期化・更新・保存が機能する（repoLoadPreferences/repoSavePreferences をモック）
  - GREEN: 実装して `App.tsx` から移行

## 6) 取得フックの抽象化
- [ ] `hook/useRankings.ts`（簡易キャッシュ）
  - RED: 難易度変更時にフェッチ/キャッシュ/ローディング表示
  - GREEN: `repoGetRankings` 呼び出しとメモリキャッシュ
  - REFACTOR: `RankingScreen` を置換

## 7) ドメイン型の分離の徹底
- [ ] `domain/game/type.ts` に `Problem`/`GameResult` を移動
  - RED: import スモーク
  - GREEN: 参照更新してビルド/テスト通過

## 8) パスエイリアス整備
- [ ] `tsconfig.json` に `@domain/*`, `@repository/*`, `@service/*`, `@usecase/*` を設定
  - RED: エイリアス import テスト
  - GREEN: 主要 import をエイリアス化

## 9) E2E 見据えた data-testid 付与（最小）
- [ ] `RankingScreen` のタブと行に `data-testid` を付与
  - RED: `getByTestId` で取得できる
  - GREEN: 実装してテスト更新

## 10) ドキュメント更新
- [ ] `README.md` にアーキテクチャ概要と DI 導入を追記
  - RED: 見出し/文言の存在を docs スナップショットで検証
  - GREEN: 追記
- [ ] `.claude/CLAUDE.md` に TDD/DI/Repository の開発フローを追記
  - RED: 見出し存在テスト
  - GREEN: 追記

---
進め方の例:
1. InMemory Ranking Repository から着手 → 契約テストで検証
2. Composition Root で注入箇所を1点に集約
3. `usecase`/`hook` で UI からの依存を薄く
