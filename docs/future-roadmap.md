# 拡張の展望・ロードマップ

## 短期的な改善（1-3ヶ月）

### テスト基盤の整備

#### ユニットテスト導入
- **対象**: `services/gameLogic.ts`、`services/ranking.ts`
- **フレームワーク**: Vitest（Viteとの親和性が高い）
- **優先度**: 高
- **メリット**:
  - 問題生成ロジックの正確性保証
  - リファクタリング時の安全性向上
  - バグの早期発見

#### E2Eテスト導入
- **対象**: ゲームフロー全体（Start → Countdown → Game → End → Ranking）
- **フレームワーク**: Playwright または Cypress
- **優先度**: 中
- **メリット**:
  - ユーザーシナリオの自動検証
  - リグレッション防止

### アクセシビリティ改善

#### キーボード操作対応
- **実装内容**:
  - 数字キー（0-9）で数字入力
  - 演算子キー（+、-、*、/）で演算子入力
  - Enterキーで判定
  - Backspaceで最後の入力を削除
- **優先度**: 高
- **メリット**: 入力速度の向上、ユーザビリティ向上

#### スクリーンリーダー対応
- **実装内容**:
  - ARIA属性の追加
  - セマンティックHTML の使用
  - フォーカス管理の改善
- **優先度**: 中
- **メリット**: 視覚障害者でもプレイ可能

### パフォーマンス最適化

#### React.memo の活用
- **対象コンポーネント**:
  - `ProblemDisplay`
  - `InputDisplay`
  - `MessageArea`
- **優先度**: 低
- **メリット**: 不要な再レンダリング防止

#### Tone.js のローカルビルド化
- **現状**: CDN経由で読み込み
- **改善**: npm パッケージとして管理
- **優先度**: 中
- **メリット**:
  - オフライン動作可能
  - ビルド時の最適化
  - バージョン固定

## 中期的な機能追加（3-6ヶ月）

### 難易度設定

#### 難易度レベルの追加
- **イージー**: 小さい数字のみ（0-5）、簡単な目標（0-5）
- **ノーマル**: 現在の仕様
- **ハード**: 大きい数字も含む（0-9）、複雑な目標（0-20）

#### カスタム問題数
- **実装内容**:
  - 5問、10問、20問から選択可能
  - 問題数に応じてスコア計算を調整
- **優先度**: 中

### ソーシャル機能

#### スコア共有
- **実装内容**:
  - Twitter/X シェアボタン
  - スコア画像の自動生成
  - ハッシュタグ対応（例: #四則パズル）
- **優先度**: 高
- **メリット**: バイラル性の向上

#### オンラインランキング
- **実装内容**:
  - バックエンド構築（Firebase Realtime Database または Supabase）
  - グローバルランキング表示
  - 週間/月間ランキング
- **優先度**: 中
- **課題**: サーバーコスト、セキュリティ対策

### プレイモードの追加

#### タイムアタックモード
- **実装内容**:
  - 制限時間内にできるだけ多くの問題を解く
  - 難易度が徐々に上昇
- **優先度**: 中

#### 対戦モード（ローカルマルチプレイ）
- **実装内容**:
  - 2人プレイヤーで同じ問題を解く
  - 早く解いた方が勝利
- **優先度**: 低

## 長期的なビジョン（6ヶ月以降）

### モバイルアプリ化

#### ネイティブアプリ展開
- **技術スタック**:
  - React Native（既存のReactコードを再利用）
  - Expo（ビルド・デプロイの簡素化）
- **プラットフォーム**: iOS、Android
- **優先度**: 高
- **メリット**:
  - オフライン動作
  - プッシュ通知
  - ストアでの配信

#### PWA（Progressive Web App）対応
- **実装内容**:
  - Service Worker の追加
  - マニフェストファイルの作成
  - オフラインキャッシュ
- **優先度**: 中
- **メリット**: インストール可能、オフライン動作

### AI 機能の統合

#### ヒント機能
- **実装内容**:
  - AIが最適な解答へのヒントを提供
  - 段階的なヒント表示（軽いヒント → 詳細なヒント）
- **技術**: Claude API または GPT-4 API
- **優先度**: 低

#### 問題生成の高度化
- **実装内容**:
  - AIによる「面白い」問題の生成
  - ユーザーの得意/不得意を学習して適切な難易度を提供
- **優先度**: 低

### 教育機能の追加

#### 学習モード
- **実装内容**:
  - 解答過程の可視化
  - 計算ステップの説明
  - 算数の基礎概念の解説
- **ターゲット**: 小学生の算数学習
- **優先度**: 中

#### 成績トラッキング
- **実装内容**:
  - プレイ履歴の記録
  - 正答率・平均時間の統計
  - 成長グラフの表示
- **優先度**: 中

### グローバル展開

#### 多言語対応の拡充
- **追加言語**:
  - 中国語（簡体字/繁体字）
  - スペイン語
  - フランス語
  - ドイツ語
- **優先度**: 低

#### 地域別ランキング
- **実装内容**:
  - 国別・地域別のランキング表示
  - タイムゾーン対応
- **優先度**: 低

## 技術的リファクタリング

### TypeScript 型定義の強化
- **実装内容**:
  - `any` 型の排除（特に Tone.js）
  - Tone.js の型定義ファイル（`.d.ts`）の作成
  - Zod などのランタイム型検証導入
- **優先度**: 中

### 状態管理ライブラリの導入
- **候補**:
  - Zustand（軽量、シンプル）
  - Jotai（Atomic State Management）
- **目的**: 状態管理の複雑化に対応
- **優先度**: 低（現状は App.tsx の props で十分）

### コンポーネントライブラリの導入
- **候補**:
  - Radix UI（ヘッドレスUI）
  - shadcn/ui（Tailwind CSS ベース）
- **目的**: UI の一貫性向上、開発速度向上
- **優先度**: 低

## デザイン改善

### ダークモード対応
- **実装内容**:
  - ライト/ダークテーマの切り替え
  - システム設定に追従
- **優先度**: 中

### アニメーション強化
- **実装内容**:
  - Framer Motion の導入
  - 問題遷移時のスムーズなアニメーション
  - スコア増加時のカウントアップアニメーション
- **優先度**: 低

### カスタムテーマ
- **実装内容**:
  - 色テーマのカスタマイズ
  - 背景画像の変更
  - フォントサイズの調整
- **優先度**: 低

## 収益化の検討

### 広告表示
- **実装方法**:
  - Google AdSense
  - ゲーム終了画面に表示
- **優先度**: 低
- **課題**: ユーザー体験への影響

### プレミアムプラン
- **実装内容**:
  - 広告なし
  - 追加のゲームモード
  - 詳細な統計情報
- **価格**: $2.99/月 または $19.99/年
- **優先度**: 低

### 買い切り型モバイルアプリ
- **価格**: $4.99（一回限りの購入）
- **内容**: 全機能アンロック
- **優先度**: 低

## まとめ

### 優先度マトリクス

| 優先度 | 短期（1-3ヶ月） | 中期（3-6ヶ月） | 長期（6ヶ月以降） |
|--------|----------------|----------------|------------------|
| **高** | ・テスト基盤<br>・キーボード操作 | ・スコア共有 | ・モバイルアプリ化 |
| **中** | ・Tone.jsローカル化<br>・スクリーンリーダー | ・難易度設定<br>・オンラインランキング | ・PWA対応<br>・学習モード |
| **低** | ・React.memo | ・対戦モード | ・AI機能<br>・カスタムテーマ |

### 推奨される実装順序

1. **テスト基盤の整備**（Vitest導入）
2. **キーボード操作対応**（ユーザビリティ向上）
3. **スコア共有機能**（バイラル性向上）
4. **Tone.js のローカルビルド化**（オフライン対応）
5. **難易度設定**（ユーザー層の拡大）
6. **モバイルアプリ化**（リーチの拡大）

この順序により、ユーザー体験を段階的に向上させながら、技術的な負債を減らし、将来的な拡張性を確保できます。

---

## 🚀 次にすぐ実装できる機能（具体的な計画）

### 1. ✅ キーボード操作対応（優先度: 高）

**実装期間**: 1-2日
**TDD対応**: 可能

#### 📋 実装タスク

##### Phase 1: 数字キー入力（1日目午前）
1. **テストを書く**（Red）
   - `GameScreen.test.tsx` を作成
   - 数字キー（0-9）押下で対応する数字が入力されるテストケース
   - 使用済みの数字は入力できないテストケース

2. **実装**（Green）
   - `GameScreen.tsx` に `useEffect` で `keydown` イベントリスナーを追加
   - 数字キー（48-57: 0-9）の検出
   - `handleNumberClick` を呼び出す

3. **リファクタリング**（Refactor）
   - カスタムフック `useKeyboardInput` に切り出し
   - キーコード定数化

##### Phase 2: 演算子キー入力（1日目午後）
1. **テストを書く**
   - `+`, `-`, `*`, `/` キー押下のテストケース
   - Shift押下の検証（`*` は Shift+8）

2. **実装**
   - 演算子キーの検出ロジック追加
   - Shift キーの状態管理

3. **リファクタリング**
   - キーマッピング定数化

##### Phase 3: 特殊キー対応（2日目午前）
1. **テストを書く**
   - Backspace キー押下で最後の入力削除
   - Enter キー押下で判定実行（全数字使用時のみ）
   - Escape キー押下でクリア

2. **実装**
   - 特殊キーのハンドラー追加

3. **リファクタリング**
   - コード整理・最適化

##### Phase 4: アクセシビリティ対応（2日目午後）
1. **テストを書く**
   - フォーカス状態の管理テスト
   - ARIA属性の存在確認

2. **実装**
   - フォーカスインジケーター追加
   - ARIA属性追加（`aria-label`, `role`）

3. **リファクタリング**
   - アクセシビリティヘルパー関数化

#### 📝 実装ファイル構成
```
src/
├── hooks/
│   └── useKeyboardInput.ts          # NEW: キーボード入力カスタムフック
├── components/
│   └── GameScreen.tsx               # MODIFY: キーボードイベント追加
├── constants/
│   └── keyboardMap.ts               # NEW: キーマッピング定義
└── __tests__/
    ├── hooks/
    │   └── useKeyboardInput.test.ts # NEW: フックのテスト
    └── components/
        └── GameScreen.test.tsx      # NEW: コンポーネントテスト
```

#### 🎯 実装の成果物
- ✅ キーボードだけでゲームプレイ可能
- ✅ アクセシビリティ向上
- ✅ テストカバレッジ 80% 以上
- ✅ ドキュメント更新（README.md に操作方法追記）

---

### 2. ✅ Vitest テスト基盤の整備（優先度: 高）

**実装期間**: 2-3日
**前提条件**: なし

#### 📋 実装タスク

##### Phase 1: Vitest セットアップ（1日目）
1. **依存関係のインストール**
   ```bash
   npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
   ```

2. **設定ファイル作成**
   - `vitest.config.ts` を作成
   - `tsconfig.json` の test 設定追加

3. **テストスクリプト追加**
   ```json
   "scripts": {
     "test": "vitest",
     "test:ui": "vitest --ui",
     "test:coverage": "vitest --coverage"
   }
   ```

##### Phase 2: ユニットテスト作成（2日目）
1. **services/gameLogic.ts のテスト**
   - `generateProblem()` のテスト
   - `safeEvaluateExpression()` のテスト
   - エッジケースの網羅

2. **services/ranking.ts のテスト**
   - `saveRanking()` のテスト
   - `getRankings()` のテスト
   - localStorage モックの使用

##### Phase 3: コンポーネントテスト作成（3日目）
1. **ProblemDisplay のテスト**
2. **InputDisplay のテスト**
3. **Controls のテスト**

#### 📝 実装ファイル構成
```
/
├── vitest.config.ts                 # NEW: Vitest設定
├── src/
│   └── __tests__/                   # NEW: テストディレクトリ
│       ├── services/
│       │   ├── gameLogic.test.ts
│       │   └── ranking.test.ts
│       └── components/
│           ├── ProblemDisplay.test.tsx
│           ├── InputDisplay.test.tsx
│           └── Controls.test.tsx
└── coverage/                        # テストカバレッジレポート
```

#### 🎯 実装の成果物
- ✅ テストフレームワーク導入完了
- ✅ 主要ロジックのテストカバレッジ 80% 以上
- ✅ CI/CD パイプラインへの統合準備完了

---

### 3. ✅ スコア共有機能（優先度: 高）

**実装期間**: 1日
**TDD対応**: 可能

#### 📋 実装タスク

##### Phase 1: Twitter/X シェア機能（午前）
1. **テストを書く**
   - シェアテキスト生成のテスト
   - URL エンコードのテスト

2. **実装**
   - `EndScreen.tsx` にシェアボタン追加
   - Twitter Web Intent URL の生成
   - スコア・時間・ハッシュタグをテキスト化

3. **リファクタリング**
   - `generateShareText()` ユーティリティ関数化

##### Phase 2: 画像生成（午後）※オプション
1. **実装**
   - Canvas API でスコア画像生成
   - Twitter Card メタタグ追加

#### 📝 実装例
```typescript
// utils/share.ts
export const generateShareText = (score: number, time: number, totalQuestions: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `四則パズルで ${score}/${totalQuestions} 問正解！⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}\n#四則パズル #数学ゲーム`;
};

export const shareToTwitter = (text: string) => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank');
};
```

#### 🎯 実装の成果物
- ✅ Twitter/X シェアボタン追加
- ✅ スコア・時間を含むシェアテキスト自動生成
- ✅ バイラル性向上

---

### 4. ✅ ダークモード対応（優先度: 中）

**実装期間**: 半日
**TDD対応**: 部分的に可能

#### 📋 実装タスク

1. **Tailwind CSS の dark mode 設定**
   - `tailwind.config.js` に `darkMode: 'class'` 追加済み
   - システム設定追従の場合は `darkMode: 'media'` に変更

2. **状態管理**
   - `localStorage` でテーマ設定を保存
   - `useDarkMode` カスタムフック作成

3. **UI追加**
   - Header にダークモード切り替えボタン追加
   - 太陽/月のアイコン表示

#### 📝 実装例
```typescript
// hooks/useDarkMode.ts
export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  return [isDark, setIsDark] as const;
};
```

#### 🎯 実装の成果物
- ✅ ライト/ダークモード切り替え
- ✅ システム設定に追従
- ✅ ユーザー設定の永続化

---

## 📅 実装スケジュール（2週間スプリント案）

### Week 1
- **月**: Vitest セットアップ + gameLogic テスト
- **火**: ranking テスト + コンポーネントテスト
- **水**: キーボード操作 Phase 1-2（数字・演算子）
- **木**: キーボード操作 Phase 3-4（特殊キー・a11y）
- **金**: スコア共有機能 + ダークモード

### Week 2
- **月**: PWA 対応（マニフェスト作成）
- **火**: Service Worker 実装（オフラインキャッシュ）
- **水**: 難易度設定 UI 追加
- **木**: 難易度別問題生成ロジック
- **金**: テスト・バグフィックス・ドキュメント更新

---

## 🛠️ 技術的な前提条件

### 必要な npm パッケージ
```bash
# テスト関連
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# PWA 関連（Week 2）
npm install -D vite-plugin-pwa workbox-window
```

### 開発環境
- Node.js 18+
- npm 9+
- VSCode（推奨）
- Vitest VSCode Extension（推奨）

この計画に沿って実装すれば、TDD を徹底しながら、2週間で主要な機能追加が完了します。
