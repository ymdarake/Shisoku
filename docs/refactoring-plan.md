# リファクタリング計画書

このドキュメントは、コードベースの品質向上のためのリファクタリング項目を優先順位順に整理したものです。

---

## 1. 🔥 最優先: 重複コード削除（DRY原則）

### 1.1 `formatTime` 関数の共通化

**現状**: 4箇所で同じ関数が重複定義されています
- `src/utils/share.ts:10`
- `src/components/EndScreen.tsx:19`
- `src/components/GameScreen.tsx:33`
- `src/components/RankingScreen.tsx:10`

**問題点**:
- コードの重複（DRY原則違反）
- 修正時に4箇所全てを変更する必要がある
- 将来的にバグの原因になる可能性

**リファクタリング計画**:
1. `src/utils/formatTime.ts` を新規作成
2. 共通の `formatTime` 関数を実装
3. テストを作成 `src/__tests__/utils/formatTime.test.ts`
4. 各ファイルで import に置き換え
5. テストが全て通ることを確認

**影響範囲**: 4ファイル

**所要時間**: 30分

**優先度**: 🔥 最高

---

## 2. ⭐ 高優先度: マジックナンバーの定数化

### 2.1 タイムアウト値の定数化

**現状**:
- `GameScreen.tsx:158, 163` - `setTimeout(..., 2000)` がハードコード
- `GameScreen.test.tsx` - `2100ms` でテスト待機

**問題点**:
- マジックナンバーの意味が不明確
- 変更時に複数箇所を修正する必要
- テストとの同期が取れなくなるリスク

**リファクタリング計画**:
1. `src/constants/game.ts` を新規作成
2. 定数を定義:
   ```typescript
   export const ANSWER_JUDGMENT_DELAY_MS = 2000; // 正解/不正解表示の待機時間
   export const TOTAL_QUESTIONS = 10; // 総問題数
   ```
3. `App.tsx:16` の `TOTAL_QUESTIONS` も移動
4. 各ファイルで import に置き換え

**影響範囲**: 3ファイル（GameScreen.tsx, GameScreen.test.tsx, App.tsx）

**所要時間**: 20分

**優先度**: ⭐ 高

---

## 3. 📦 中優先度: 型定義の整理

### 3.1 `Token` 型の移動

**現状**: `GameScreen.tsx:27-31` で定義されている

**問題点**:
- コンポーネント固有の型のように見えるが、将来的に他でも使う可能性
- 型定義の一元管理ができていない

**リファクタリング計画**:
1. `src/types.ts` に `Token` 型を移動
2. `GameScreen.tsx` で import に置き換え
3. JSDocコメントを追加して用途を明確化

**影響範囲**: 2ファイル（types.ts, GameScreen.tsx）

**所要時間**: 10分

**優先度**: 📦 中

---

## 4. 🎨 低優先度: コンポーネント分割とロジック抽出

### 4.1 `GameScreen` の入力ロジックを hooks に分離

**現状**: `GameScreen.tsx` (265行) が長く、複数の責務を持っている
- 入力バリデーション
- トークン管理
- 判定ロジック
- UI表示

**問題点**:
- コンポーネントが複雑
- テストが書きにくい
- 再利用性が低い

**リファクタリング計画**:
1. `src/hooks/useExpressionBuilder.ts` を新規作成
2. トークン管理と入力バリデーションを抽出:
   ```typescript
   export const useExpressionBuilder = (numbers: number[]) => {
     // tokens, handleNumberClick, handleOperatorClick, etc.
     return { tokens, expression, handleNumberClick, ... };
   };
   ```
3. テストを作成 `src/__tests__/hooks/useExpressionBuilder.test.ts`
4. `GameScreen.tsx` を簡素化

**影響範囲**: 2ファイル（新規hooks, GameScreen.tsx）

**所要時間**: 2時間

**優先度**: 🎨 低（動作には問題なし、今すぐ必要ではない）

---

## 5. 🔧 その他の改善候補

### 5.1 Tone.js の型定義改善

**現状**: `declare const Tone: any;` で型が `any`

**提案**: 最低限の型定義を追加
```typescript
interface ToneBasic {
  start(): Promise<void>;
  context: { state: string };
  Transport: any;
  Synth: any;
  // ... 使用している機能のみ定義
}
declare const Tone: ToneBasic;
```

**所要時間**: 1時間

**優先度**: 🔧 低（型安全性向上だが、動作には影響なし）

---

## 実施順序（推奨）

### フェーズ1: 重複コード削除（1日目午前）
- [ ] 1.1 `formatTime` 関数の共通化

### フェーズ2: 定数化（1日目午後）
- [ ] 2.1 マジックナンバーの定数化

### フェーズ3: 型整理（2日目午前）
- [ ] 3.1 `Token` 型の移動

### フェーズ4: コンポーネント分割（任意・2日目午後以降）
- [ ] 4.1 `GameScreen` の入力ロジック分離
- [ ] 5.1 Tone.js の型定義改善

---

## リファクタリングの原則

### TDD (Test-Driven Development)
- 既存のテストが全て通ることを確認してからリファクタリング開始
- リファクタリング後もテストが通ることを確認
- 新規コードには必ずテストを追加

### 小さく頻繁にコミット
- 各リファクタリング項目ごとにコミット
- コミットメッセージは `:recycle:` gitmoji を使用

### 動作保証
- リファクタリングは動作を変更しない
- UIや機能に影響がないことを確認

---

## 完了条件（Definition of Done）

各リファクタリング項目について：
- [ ] コードの重複が削除されている
- [ ] 既存のテストが全て通る
- [ ] 新規コードにテストがある（該当する場合）
- [ ] 開発サーバーでの動作確認完了
- [ ] コミット完了

---

## 参考資料

- [リファクタリング（第2版）](https://martinfowler.com/books/refactoring.html) - Martin Fowler
- [Clean Code](https://www.oreilly.co.jp/books/9784048930598/) - Robert C. Martin
- DRY原則 (Don't Repeat Yourself)
- SOLID原則（特に単一責任原則）
