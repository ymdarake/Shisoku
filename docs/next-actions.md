# 🚀 次にすぐ実装できる機能（具体的な計画 / Next Actions）

このドキュメントは、`docs/future-roadmap.md` の「次にすぐ実装できる機能」を独立させ、すぐに着手できるようにステップバイステップで具体化した実装タスク集です。各セクションはチェックリスト形式で、コマンド例・ファイル作成先・受け入れ条件（Acceptance Criteria）を含みます。

---

## 1. ✅ キーボード操作対応（優先度: 高）

**所要**: 1-2日 / **TDD**: 対応

### 1.1 セットアップ（共通下準備）
- [x] `src/hooks` ディレクトリがなければ作成
- [x] `src/constants` に `keyboardMap.ts` を作成
- [x] 既存の `src/components/GameScreen.tsx` の読み取り（イベント接続ポイントの確認）

### 1.2 Phase 1: 数字キー入力（1日目午前）
1) テスト作成（Red）
- [x] `src/__tests__/components/GameScreen.test.tsx` を新規作成
- [x] ケース: 数字キー 0-9 押下で `InputDisplay` に反映される（現状は代表値で検証）
- [x] ケース: 使用済み数字は再入力不可（`disabled`/無視）

2) 実装（Green）
- [x] `GameScreen.tsx` に `useEffect` で `window.addEventListener('keydown', ...)` を追加
- [x] キーコード（`Digit0`-`Digit9`）/ `event.key` を判定
- [x] 既存の `handleNumberClick`（または等価の挙動）を呼ぶ

3) リファクタ（Refactor）
- [x] `src/hooks/useKeyboardInput.ts` を作成してロジックを抽出
- [x] `keyboardMap.ts` にキー定義（数字/演算子/特殊）を定数化

受け入れ条件（AC）
- [ ] 物理キーボードの 0-9 による入力がマウス操作と等価に機能
- [ ] 使用済み数字は無視される（UI とロジックが一致）

### 1.3 Phase 2: 演算子キー入力（1日目午後）
1) テスト
- [x] `+`, `-`, `*`, `/` キー押下で `handleOperatorClick` が発火
- [x] `*` はキーボード `*` 入力で検証（配列差の影響を回避）

2) 実装
- [x] `useKeyboardInput` に演算子判定を追加
- [x] Shift 状態（`event.shiftKey`）を考慮（内部マップで対応）

3) リファクタ
- [x] `keyboardMap.ts` に演算子マッピングを集約

AC
- [ ] 4 演算子が全てキーボードから入力可能
- [ ] シフト有無の差異を正しく解釈

### 1.4 Phase 3: 特殊キー（2日目午前）
1) テスト
- [x] Backspace で最後の入力を削除
- [x] Enter で判定実行（全数字使用時のみ）
- [x] Escape でクリア

2) 実装
- [x] `useKeyboardInput` に特殊キーのハンドラを追加
- [x] `GameScreen.tsx` へフックを適用

3) リファクタ
- [x] 条件分岐の簡素化、早期 return で可読性向上

AC
- [x] Backspace/Enter/Escape が UI ボタンと等価に作用

### 1.5 Phase 4: アクセシビリティ（2日目午後）
1) テスト
- [x] フォーカス管理（主要操作領域へ初期フォーカス）
- [x] ARIA 属性（`aria-label`, `role` 等）の存在確認

2) 実装
- [x] フォーカスリング/インジケーターの追加（Tailwind）
- [x] スクリーンリーダー向けラベル付与

3) リファクタ
- [x] a11y ヘルパー関数へ集約（任意）

AC
- [x] キーボードのみでゲーム進行が可能
- [x] スクリーンリーダーで主要操作が把握可能

### 1.6 生成/変更ファイル
```
src/
├── hooks/
│   └── useKeyboardInput.ts          # NEW: キーボード入力フック
├── constants/
│   └── keyboardMap.ts               # NEW: キーマップ
├── components/
│   └── GameScreen.tsx               # MODIFY: イベント接続
└── __tests__/
    ├── hooks/
    │   └── useKeyboardInput.test.ts # NEW
    └── components/
        └── GameScreen.test.tsx      # NEW
```

Definition of Done（DoD）
- [ ] キーボードのみでフルプレイ可能
- [ ] 主要ケースのテストカバレッジ 80%+
- [ ] README に操作方法を追記

---

## 2. ✅ Vitest テスト基盤の整備（優先度: 高）

**所要**: 2-3日 / **前提**: なし

### 2.1 依存追加・設定
- [x] 依存を追加
```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```
- [x] `vitest.config.ts` をプロジェクトルートに作成
- [x] `tsconfig.json` に `types: ["vitest", "jest-dom"]` を追記（`compilerOptions`）
- [x] `package.json` にスクリプト追加
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### 2.2 ユニットテスト
- [x] `src/__tests__/services/gameLogic.test.ts`
  - `generateProblem()` の正常系/境界値
  - `safeEvaluateExpression()` の妥当性/エラーケース
- [x] `src/__tests__/services/ranking.test.ts`
  - `saveRanking()`/`getRankings()`、`localStorage` モック

### 2.3 コンポーネントテスト
- [x] `ProblemDisplay.test.tsx`
- [x] `InputDisplay.test.tsx`
- [x] `Controls.test.tsx`

AC / DoD
- [x] `npm run test:coverage` で主要ロジック 80%+ を達成
- [x] 失敗テストが 0 で安定実行

---

## 3. ✅ スコア共有機能（優先度: 高）

**所要**: 1日 / **TDD**: 対応

### 3.1 Twitter/X シェア（午前）
1) テスト
- [x] 共有テキスト生成のテスト（時間整形、ゼロパディング）
- [x] URL エンコードのテスト

2) 実装
- [x] `src/utils/share.ts` を新規作成し `generateShareText`/`shareToTwitter` を実装
- [x] `src/components/EndScreen.tsx` にシェアボタンを追加

3) リファクタ
- [x] テキスト生成処理のユーティリティ化と単体テスト

AC / DoD
- [x] 実行時に新規タブで Web Intent が開く
- [x] スコア、時間、総問題数、ハッシュタグを含む

### 3.2 画像生成（午後・任意）
- [ ] Canvas API でシェア画像生成ユーティリティ（任意）
- [ ] OGP/Twitter Card メタタグを `index.html` に追加

---

## 4. ✅ ダークモード対応（優先度: 中）

**所要**: 半日 / **TDD**: 部分対応

### 4.1 Tailwind 設定と状態管理
- [ ] `tailwind.config.js` の `darkMode` 設定を確認（`class`/`media`）
- [ ] `src/hooks/useDarkMode.ts` を新規作成
- [ ] `localStorage` でテーマ永続化、初期値は `prefers-color-scheme`

### 4.2 UI 実装
- [ ] `src/components/Header.tsx` にトグルボタン追加
- [ ] 太陽/月アイコンの切替

AC / DoD
- [ ] ライト/ダークが即時反映
- [ ] 再訪時にユーザー設定が保持

---

## 付録: 作業の進め方（推奨）

### テスト駆動
- [ ] 各フェーズで Red → Green → Refactor を徹底
- [ ] カバレッジは関数/分岐を意識して指標管理

### ブランチとコミット
- [ ] 機能ごとに `feat/keyboard-input`, `feat/share`, `chore/test-setup` などで分岐
- [ ] 小さく頻繁にコミットし、テスト通過を確認

### スケジュール（2週間例）
- Week1: テスト基盤 → キーボード操作（P1-2）→ コンポーネントテスト
- Week2: キーボード操作（P3-4）→ シェア機能 → ダークモード


