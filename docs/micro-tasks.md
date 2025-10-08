# 超小粒度作業工程表

各タスクを5-15分で完了できる最小単位に分解しています。
チェックボックスで進捗管理し、1つずつ確実に完了させていきます。

---

## 🎯 Option 1: Tone.js のローカルビルド化（推定: 1時間）✅ 完了

### Phase 1: 依存関係の追加（5分）✅
- [x] `npm install tone` を実行
- [x] `package.json` の `dependencies` に `tone` が追加されたことを確認
- [x] コミット: `:wrench: Tone.jsをnpm依存に追加`

### Phase 2: import文の追加（5分）✅
- [x] `src/services/audio.ts` を開く
- [x] ファイル冒頭に `import * as Tone from 'tone';` を追加
- [x] グローバル宣言 `declare const Tone: any;` を削除

### Phase 3: 型定義の改善（10分）✅
- [x] `any` 型を使っている箇所を特定（検索: `Tone.`）
- [x] 主要な型（`Tone.Synth`, `Tone.Transport` など）を明示的に型付け
- [x] コミット: `:recycle: Tone.jsをローカルimportに変更し型を改善`

### Phase 4: HTML からの CDN 削除（5分）✅
- [x] `index.html` を開く
- [x] `<script src="https://unpkg.com/tone@14.7.77/build/Tone.js"></script>` を削除
- [x] コミット: `:fire: Tone.jsのCDN読み込みを削除`

### Phase 5: 動作確認（15分）✅
- [x] `npm run dev` で開発サーバー起動
- [x] ゲーム開始して BGM が再生されるか確認
- [x] 効果音（クリック、正解、不正解）が鳴るか確認
- [x] ボリューム切り替えが機能するか確認
- [x] コンソールエラーがないか確認

### Phase 6: ビルド確認（10分）✅
- [x] `npm run build` を実行
- [x] ビルドエラーがないか確認
- [x] `npm run preview` でプレビュー
- [x] プレビュー環境で音声機能を再確認
- [x] コミット: `:white_check_mark: Tone.jsローカル化の動作確認完了`

### Phase 7: ドキュメント更新（10分）✅
- [x] `.claude/CLAUDE.md` の技術スタックセクションを更新
  - 「CDN経由」→「npm パッケージ」に修正
  - グローバル変数の記述を削除
- [x] コミット: `:memo: Tone.jsのローカル化をドキュメントに反映`

**🎉 Option 1 完了！** (コミット: c92f072)

---

## 🎯 Option 2: 難易度設定の実装（推定: 1-2日）

### Day 1 Morning: 型定義とロジック（2時間）

#### Step 1: 型定義の追加（10分）
- [x] `src/types.ts` を開く
- [x] `Difficulty` 型を追加: `'easy' | 'normal' | 'hard'`
- [x] `DifficultyConfig` インターフェースを定義
  ```ts
  interface DifficultyConfig {
    numberRange: [number, number];
    targetRange: [number, number];
    label: string;
  }
  ```
- [x] コミット: `:sparkles: 難易度設定の型定義を追加`

#### Step 2: 定数定義（10分）
- [x] `src/constants/difficulty.ts` を新規作成
- [x] `DIFFICULTY_CONFIGS` オブジェクトを定義
  - easy: 数字 0-5, 目標 0-5
  - normal: 数字 0-9, 目標 0-9（現在の仕様）
  - hard: 数字 0-9, 目標 0-20
- [x] コミット: `:wrench: 難易度設定の定数を定義`

#### Step 3: テストファイル作成（15分）
- [x] `src/__tests__/services/gameLogic.test.ts` を開く
- [x] `generateProblem` の難易度別テストケースを追加
  - easy: 生成された数字が 0-5 の範囲内か
  - hard: 目標値が 0-20 の範囲内か
- [x] テストを実行して失敗することを確認（Red）

#### Step 4: gameLogic の修正（30分）
- [x] `src/services/gameLogic.ts` の `generateProblem` 関数を開く
- [x] 引数に `difficulty: Difficulty = 'normal'` を追加
- [x] `DIFFICULTY_CONFIGS[difficulty]` から範囲を取得
- [x] 数字生成ロジックを修正して範囲を反映
- [x] テストを実行して通ることを確認（Green）
- [x] コミット: `:sparkles: generateProblemに難易度パラメータを追加`

#### Step 5: generateProblems の修正（15分）
- [x] `generateProblems(count, difficulty)` に難易度を追加
- [x] 内部の `generateProblem` 呼び出しに難易度を渡す
- [x] 既存テストが通るか確認
- [x] コミット: `:recycle: generateProblemsに難易度を伝播`

#### Step 6: リファクタリング（20分）
- [ ] 重複コードの抽出
- [ ] 関数の責務を見直し
- [ ] コメントを追加（難易度ロジックの説明）
- [ ] コミット: `:recycle: 難易度ロジックをリファクタリング`

### Day 1 Afternoon: UI実装（2時間）

#### Step 7: 状態管理の追加（10分）
- [ ] `src/App.tsx` を開く
- [ ] `difficulty` ステートを追加: `useState<Difficulty>('normal')`
- [ ] `setDifficulty` 関数をエクスポート

#### Step 8: DifficultySelector コンポーネント作成（30分）
- [ ] `src/components/DifficultySelector.tsx` を新規作成
- [ ] 3つのボタン（Easy/Normal/Hard）を配置
- [ ] props: `difficulty`, `onSelect`
- [ ] 選択中の難易度をハイライト表示
- [ ] コミット: `:sparkles: DifficultySelector コンポーネントを作成`

#### Step 9: StartScreen への統合（15分）
- [ ] `src/components/StartScreen.tsx` を開く
- [ ] `DifficultySelector` をインポート
- [ ] スタートボタンの上に配置
- [ ] `difficulty` と `setDifficulty` を props で受け取り
- [ ] コミット: `:sparkles: StartScreenに難易度選択を追加`

#### Step 10: 難易度の伝播（20分）
- [ ] `App.tsx` の `startGame` 関数を修正
- [ ] `generateProblems(TOTAL_QUESTIONS, difficulty)` に難易度を渡す
- [ ] `currentProblem` の生成時にも難易度を考慮
- [ ] コミット: `:sparkles: 難易度設定をゲームロジックに連携`

#### Step 11: スタイリング（20分）
- [ ] `DifficultySelector` のボタンにカラースキーム適用
  - Easy: 緑系
  - Normal: 青系
  - Hard: 赤系
- [ ] ホバー・アクティブ状態のスタイル追加
- [ ] ダークモード対応
- [ ] コミット: `:art: 難易度選択UIのスタイリング`

#### Step 12: ローカライズ（15分）
- [ ] `src/constants/locales.ts` を開く
- [ ] 難易度ラベルを追加（ja/en）
- [ ] `DifficultySelector` で多言語テキストを使用
- [ ] コミット: `:globe_with_meridians: 難易度設定の多言語対応`

### Day 2 Morning: テストと調整（1時間）

#### Step 13: コンポーネントテスト（30分）
- [ ] `src/__tests__/components/DifficultySelector.test.tsx` を作成
- [ ] ボタンクリックで `onSelect` が呼ばれるかテスト
- [ ] 選択状態の視覚的フィードバックをテスト
- [ ] コミット: `:white_check_mark: DifficultySelector のテストを追加`

#### Step 14: 統合テスト（20分）
- [ ] 手動で全難易度をプレイ
- [ ] Easy: 簡単すぎないか確認
- [ ] Hard: 解けない問題が出ないか確認
- [ ] 問題が適切に生成されるかログ確認

#### Step 15: バグ修正（10分）
- [ ] 発見されたバグを修正
- [ ] エッジケースの処理を追加
- [ ] コミット: `:bug: 難易度設定の不具合を修正`

### Day 2 Afternoon: ドキュメントとリリース（30分）

#### Step 16: README 更新（15分）
- [ ] `README.md` に難易度設定の説明を追加
- [ ] スクリーンショットを追加（任意）
- [ ] コミット: `:memo: 難易度設定をREADMEに記載`

#### Step 17: CLAUDE.md 更新（10分）
- [ ] `.claude/CLAUDE.md` の仕様セクションを更新
- [ ] 難易度別の数字範囲・目標範囲を記載
- [ ] コミット: `:memo: 難易度設定の仕様をドキュメント化`

#### Step 18: 最終確認（5分）
- [ ] `npm run test` でテスト全件通過を確認
- [ ] `npm run build` でビルド成功を確認
- [ ] git status で未コミットファイルがないか確認

---

## 🎯 Option 3: React.memo 最適化（推定: 30分）

### Step 1: ProblemDisplay の最適化（10分）
- [ ] `src/components/ProblemDisplay.tsx` を開く
- [ ] コンポーネントを `React.memo()` でラップ
- [ ] props の型を確認（propsEqualityCheck が必要か検討）
- [ ] コミット: `:zap: ProblemDisplay を React.memo で最適化`

### Step 2: InputDisplay の最適化（10分）
- [ ] `src/components/InputDisplay.tsx` を開く
- [ ] `React.memo()` でラップ
- [ ] `input` 配列の参照が変わる問題がないか確認
- [ ] コミット: `:zap: InputDisplay を React.memo で最適化`

### Step 3: MessageArea の最適化（10分）
- [ ] `src/components/MessageArea.tsx` を開く
- [ ] `React.memo()` でラップ
- [ ] アニメーション系の props が最適化を妨げないか確認
- [ ] コミット: `:zap: MessageArea を React.memo で最適化`

### Step 4: 効果測定（任意）
- [ ] React DevTools Profiler で再レンダリング回数を計測
- [ ] 最適化前後の比較をログに記録
- [ ] 結果を `docs/performance.md` に記録（任意）

---

## 🎯 Option 4: E2E テスト導入（推定: 2日）

### Day 1: セットアップ（1時間）

#### Step 1: Playwright インストール（10分）
- [ ] `npm install -D @playwright/test` を実行
- [ ] `npx playwright install` でブラウザをインストール
- [ ] コミット: `:wrench: Playwright を追加`

#### Step 2: 設定ファイル作成（15分）
- [ ] `playwright.config.ts` を作成
- [ ] ベースURL、タイムアウト、ブラウザ設定を記述
- [ ] `package.json` に `"test:e2e": "playwright test"` を追加
- [ ] コミット: `:wrench: Playwright 設定を追加`

#### Step 3: テストディレクトリ作成（5分）
- [ ] `e2e/` ディレクトリを作成
- [ ] `.gitignore` に `e2e/test-results/` を追加

#### Step 4: 最初のテスト作成（30分）
- [ ] `e2e/smoke.spec.ts` を作成
- [ ] トップページが表示されるかテスト
- [ ] スタートボタンが存在するかテスト
- [ ] `npx playwright test` で実行
- [ ] コミット: `:white_check_mark: E2E スモークテストを追加`

### Day 1 Afternoon: ゲームフローテスト（2時間）

#### Step 5: スタート画面テスト（20分）
- [ ] `e2e/start-screen.spec.ts` を作成
- [ ] スタートボタンクリックでカウントダウンに遷移するかテスト
- [ ] 言語切り替えが機能するかテスト

#### Step 6: カウントダウンテスト（15分）
- [ ] `e2e/countdown.spec.ts` を作成
- [ ] 3秒後にゲーム画面に遷移するかテスト
- [ ] カウントダウン中に音が鳴るか（任意）

#### Step 7: ゲーム画面テスト（40分）
- [ ] `e2e/game-screen.spec.ts` を作成
- [ ] 数字ボタンクリックで入力できるかテスト
- [ ] 演算子ボタンが機能するかテスト
- [ ] Clearボタンでリセットされるかテスト
- [ ] Backspaceで削除されるかテスト

#### Step 8: 正解判定テスト（30分）
- [ ] 正しい式を入力して正解判定されるかテスト
- [ ] 不正解の式で不正解判定されるかテスト
- [ ] 無効な式（括弧不一致など）でエラーになるかテスト

#### Step 9: 問題遷移テスト（15分）
- [ ] 正解後に次の問題に進むかテスト
- [ ] 10問完了後にエンド画面に遷移するかテスト

### Day 2: エンド画面とランキング（1.5時間）

#### Step 10: エンド画面テスト（30分）
- [ ] `e2e/end-screen.spec.ts` を作成
- [ ] スコアが正しく表示されるかテスト
- [ ] Retry ボタンでスタート画面に戻るかテスト
- [ ] ランキングボタンでランキング画面に遷移するかテスト

#### Step 11: ランキングテスト（30分）
- [ ] `e2e/ranking.spec.ts` を作成
- [ ] ランキングが保存されるかテスト（localStorage確認）
- [ ] 最大10件で制限されるかテスト
- [ ] ソート順が正しいかテスト

#### Step 12: フルフローテスト（30分）
- [ ] `e2e/full-game.spec.ts` を作成
- [ ] Start → Game → End → Ranking の全フローをテスト
- [ ] 2回目のプレイもスムーズに開始できるかテスト

### Day 2 Afternoon: 仕上げ（30分）

#### Step 13: CI 設定（任意・15分）
- [ ] `.github/workflows/e2e.yml` を作成
- [ ] プルリクエスト時に E2E テストを実行
- [ ] コミット: `:construction_worker: E2E テストを CI に追加`

#### Step 14: ドキュメント更新（15分）
- [ ] `README.md` に E2E テスト実行方法を追加
- [ ] `docs/testing.md` を作成（テスト戦略の説明）
- [ ] コミット: `:memo: E2E テストのドキュメントを追加`

---

## 🎯 Option 5: ドキュメント整備（推定: 1時間）

### Step 1: カバレッジバッジ追加（20分）
- [ ] `npm run test:coverage` を実行
- [ ] カバレッジ結果をスクリーンショット
- [ ] `README.md` にカバレッジセクションを追加
- [ ] バッジ画像を埋め込み（任意）
- [ ] コミット: `:memo: カバレッジ情報をREADMEに追加`

### Step 2: 操作方法の詳細化（20分）
- [ ] `README.md` の Usage セクションを拡充
- [ ] キーボードショートカット一覧を追加
- [ ] 難易度別のプレイ時間目安を記載
- [ ] コミット: `:memo: 操作方法を詳細化`

### Step 3: アーキテクチャ図の追加（20分）
- [ ] `docs/architecture.md` を作成
- [ ] コンポーネント間のデータフロー図を Mermaid で記述
- [ ] 状態管理の説明を追加
- [ ] コミット: `:memo: アーキテクチャドキュメントを追加`

---

## 📊 推奨実装順序

**最速で価値を出す順**:
1. **Tone.js ローカル化**（1時間） → すぐ完了、オフライン対応
2. **React.memo 最適化**（30分） → 即座にパフォーマンス向上
3. **難易度設定**（1-2日） → ユーザー体験の大幅向上
4. **E2E テスト**（2日） → 品質保証の強化
5. **ドキュメント整備**（1時間） → 保守性向上

**学習効果が高い順**:
1. **E2E テスト**（Playwright の習得）
2. **難易度設定**（TDD の実践）
3. **React.memo 最適化**（パフォーマンスチューニング）

どのオプションから始めますか？
