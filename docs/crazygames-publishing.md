# CrazyGames 出品ガイド

このドキュメントは、四則（Shisoku）ゲームをCrazyGamesに出品するための要件と手順をまとめたものです。

## CrazyGamesとは

CrazyGamesは世界最大級のHTML5ゲームプラットフォームの一つで、月間数千万人のユーザーを抱えています。開発者は広告収益シェアモデルで収益化できます。

## 出品プロセス

CrazyGamesには2段階の公開プロセスがあります：

### Basic Launch（基本公開）

- **特徴**: CrazyGamesのカスタマイズなしで即座に公開可能
- **SDK**: オプション（不要）
- **収益化**: 利用不可
- **適用シーン**: テスト公開、初期リリース

### Full Launch（完全公開）

- **特徴**: プラットフォーム全体に最適化された形で公開
- **SDK**: 必須
- **収益化**: 広告収益シェアが利用可能
- **昇格条件**: エンゲージメント指標（平均プレイ時間、ゲームプレイへの転換率、リテンション）がプラットフォームの基準を満たす必要がある

## 技術要件

### ファイルサイズ制限

| 項目 | Basic Launch | Full Launch |
|---|---|---|
| 初期ダウンロードサイズ | ≤50MB | ≤50MB |
| 総ファイルサイズ | ≤250MB | ≤250MB |
| ファイル数 | ≤1,500 | ≤1,500 |
| モバイルホームページ掲載 | 初期ダウンロード≤20MB | 初期ダウンロード≤20MB |

**初期ダウンロードサイズの測定**:
- SDK統合時: ローディング開始から最初の `Gameplay start` イベントまで
- SDK未統合時: プレイ可能になるまでの時間（目標≤20秒）

### ブラウザ・デバイス互換性

- **必須対応ブラウザ**: Chrome、Edge
- **Safari**: パフォーマンスに応じて個別評価
- **Chromebook**: 4GB RAMのデバイスでスムーズに動作する必要あり
- **入力方法**: マウス、キーボード、タッチ（モバイル対応時）
- **画面方向**: デスクトップは横向きが必須、縦向きゲームは適切なフォーマットで対応可能

### モバイル固有の要件

- iOS/低メモリデバイスではDevice Pixel Ratio (DPR) = 1に設定される
- 不要なタッチジェスチャーを防ぐCSS: `-webkit-user-select: none;`
- Unityゲームはクラッシュリスクのため、iOS上ではデフォルトで無効（エンゲージメント十分な場合に評価可能）

### その他の技術要件

- **ファイルパス**: 相対パスのみ使用可能（絶対パスは読み込み失敗）
- **サイトロック**: 実装する場合は全てのCrazyGamesドメインをホワイトリスト化
- **プライバシー通知**: SDKイベント以外の個人データを収集する場合は必須

## ゲームプレイ要件

### Basic Launch

- ビジュアルQAチェックに合格
- PEGI 12（12歳以上）対応コンテンツ

### Full Launch

- 完全なビジュアルQA
- **直接ゲームプレイエントリー**: 新規ユーザーをすぐにゲームプレイに誘導（最大1クリックまで許容）
- ゲーム名、アセット、全体のコンテンツにオリジナリティが必要

## SDK統合要件

### SDK概要

CrazyGames SDKはHTML5/JavaScriptゲームで以下のように利用します：

```javascript
// SDKへのアクセス
const sdk = window.CrazyGames.SDK.game;
```

### Full Launch に必要なSDK実装

1. **ゲームプレイトラッキング（必須）**
   ```javascript
   // ゲーム開始/再開時
   sdk.gameplayStart();

   // ポーズ、メニュー遷移、レベル間の移行時
   sdk.gameplayStop();
   ```

2. **ローディングメトリクス（オプション、推奨）**
   ```javascript
   // ローディング開始時
   sdk.loadingStart();

   // ローディング完了時
   sdk.loadingStop();
   ```

3. **データモジュール（該当する場合）**
   - ユーザー進捗のセーブ機能
   - CrazyGamesアカウントとの連携

4. **ユーザーモジュール（該当する場合）**
   - プラットフォームのユーザー名/アバターを使用
   - 登録ユーザーの自動ログイン

5. **Happy Time機能（オプション）**
   ```javascript
   // 重要な達成時にお祝いアニメーション
   sdk.happytime();
   ```
   ※控えめに使用し、特別な瞬間のみに使用すること

## 広告・収益化

### Basic Launch
- CrazyGamesの収益化なし
- 外部広告の掲載は禁止

### Full Launch
- **広告収益シェアモデル**: SDK経由で配信される広告のみ許可
- AdBlock有効時でも機能する必要がある
- 選ばれたゲームはXsollaを使用したゲーム内課金が利用可能（招待制）

## アカウント統合（該当する場合）

### Basic Launch
- 外部ログインオプションなし

### Full Launch
- CrazyGamesアカウントに進捗をリンク
- プラットフォームのユーザー名/アバターを使用
- 登録ユーザーの自動ログインを有効化

## マルチプレイヤー（該当する場合）

### Basic Launch
- 招待ボタンとリンクが必要

### Full Launch
- インスタントマルチプレイヤーフロー
- 永続的なルーム
- DisableChat設定のサポート

## 提出に必要なもの

1. **ゲームファイル**
   - ビルドされたHTML5ゲーム（index.html + アセット）
   - ファイルサイズ・ファイル数制限内

2. **メタデータ**
   - ゲーム名
   - 説明文
   - カテゴリー/タグ

3. **ビジュアルアセット**
   - カバー画像
   - スクリーンショット
   - プレイ動画（推奨）

4. **SDK統合（Full Launch時）**
   - ゲームプレイトラッキング実装
   - 広告統合
   - データ保存（該当する場合）

## 現在のゲーム状況分析

### ✅ クリア済み

- **ファイルサイズ**: Viteビルド後のサイズは十分小さい（要確認）
- **ブラウザ互換性**: React + Viteで一般的なブラウザに対応
- **入力方法**: マウス、タッチ、キーボード対応済み
- **PEGI 12対応**: 数学パズルゲームで年齢制限なし
- **オリジナリティ**: 独自の四則演算パズルゲーム
- **直接ゲームプレイエントリー**: スタート画面から1クリックでゲーム開始

### ⚠️ 要確認・調整

1. **初期ダウンロードサイズ**
   - 現在のビルドサイズを測定
   - 50MB以下であることを確認（理想は20MB以下）
   - 必要に応じてアセット最適化

2. **Tone.js依存関係**
   - 現在npm経由でインストール（15.1.22）
   - ビルド後のサイズへの影響を確認

3. **localStorage使用**
   - ランキングデータの保存にlocalStorageを使用
   - SDK Data Moduleへの移行検討（Full Launch時）

### ❌ 未実装（Full Launch に必要）

1. **CrazyGames SDK統合**
   - SDKのインストール・初期化
   - `gameplayStart()` / `gameplayStop()` の実装
   - 広告表示ポイントの設定

2. **ゲームプレイトラッキング**
   - ゲーム開始時: StartScreen → CountdownScreen 開始時
   - ゲーム停止時: ゲーム終了時、ランキング画面遷移時

3. **データ保存のSDK化**
   - 現在のlocalStorageベースのランキングシステム
   - SDK Data Moduleを使用したクラウド保存への移行

4. **広告統合**
   - 広告表示タイミングの設計（問題間、ゲーム終了時など）
   - 広告SDK呼び出しの実装

## 実装ロードマップ

### Phase 1: Basic Launch準備

1. **ビルドサイズ確認**
   ```bash
   npm run build
   # distフォルダのサイズを確認
   ```

2. **技術要件チェックリスト**
   - [ ] 初期ダウンロードサイズ ≤ 50MB
   - [ ] 総ファイルサイズ ≤ 250MB
   - [ ] ファイル数 ≤ 1,500
   - [ ] Chrome/Edgeで動作確認
   - [ ] 相対パスのみ使用

3. **メタデータ準備**
   - [ ] ゲーム名: 「四則（Shisoku）」
   - [ ] 英語名: 「Shisoku - Math Puzzle」
   - [ ] 説明文（日本語・英語）
   - [ ] カテゴリー: Puzzle / Math
   - [ ] スクリーンショット撮影
   - [ ] プレイ動画作成

4. **提出**
   - [ ] Developer Portal（developer.crazygames.com）でアカウント作成
   - [ ] ゲームアップロード
   - [ ] QA審査待ち

### Phase 2: Full Launch準備（Basic Launch公開後）

1. **SDK統合**
   - [ ] CrazyGames SDK インストール
   - [ ] SDK初期化コード追加
   - [ ] `gameplayStart()` 実装（CountdownScreen完了時）
   - [ ] `gameplayStop()` 実装（EndScreen、RankingScreen遷移時）
   - [ ] `loadingStart()` / `loadingStop()` 実装（問題生成時）

2. **広告統合**
   - [ ] 広告表示ポイントの決定
     - ゲーム開始前
     - 5問目終了後（中間広告）
     - ゲーム終了後
   - [ ] 広告SDK呼び出し実装
   - [ ] AdBlock有効時の動作確認

3. **データ保存移行**
   - [ ] SDK Data Moduleの統合
   - [ ] ランキングデータのクラウド保存
   - [ ] localStorageからの移行パス

4. **テスト・最適化**
   - [ ] エンゲージメント指標のモニタリング
   - [ ] ユーザーフィードバック収集
   - [ ] パフォーマンス最適化

5. **Full Launch申請**
   - [ ] 全SDK要件の実装完了
   - [ ] エンゲージメント指標が基準達成
   - [ ] Full Launch審査申請

## 参考リンク

- **CrazyGames公式ドキュメント**: https://docs.crazygames.com/
- **Developer Portal**: https://developer.crazygames.com/
- **技術要件**: https://docs.crazygames.com/requirements/technical/
- **SDK統合ガイド**: https://docs.crazygames.com/sdk/game/
- **要件イントロ**: https://docs.crazygames.com/requirements/intro/

## 補足: SDK統合の実装例

### App.tsxへのSDK統合イメージ

```typescript
// SDKの型定義（追加が必要）
declare global {
  interface Window {
    CrazyGames?: {
      SDK: {
        game: {
          gameplayStart: () => void;
          gameplayStop: () => void;
          loadingStart: () => void;
          loadingStop: () => void;
          happytime: () => void;
        };
      };
    };
  }
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const sdk = window.CrazyGames?.SDK.game;

  // ゲーム開始時
  const handleStartGame = () => {
    setGameState('countdown');
    // カウントダウン完了後にゲームプレイ開始を通知
  };

  // カウントダウン完了時（ゲームプレイ開始）
  const handleCountdownComplete = (problems: Problem[]) => {
    sdk?.gameplayStart(); // SDK: ゲームプレイ開始通知
    setGeneratedProblems(problems);
    setGameState('playing');
  };

  // ゲーム終了時
  const handleGameEnd = (results: GameResult[]) => {
    sdk?.gameplayStop(); // SDK: ゲームプレイ停止通知
    setResults(results);
    setGameState('finished');

    // スコアが高い場合はHappy Time
    const score = results.filter(r => r.correct).length;
    if (score >= 8) {
      sdk?.happytime();
    }
  };

  // ランキング画面への遷移時
  const handleViewRanking = () => {
    sdk?.gameplayStop(); // SDK: ゲームプレイ停止通知
    setGameState('ranking');
  };

  // ...
};
```

### 問題生成時のローディング通知

```typescript
// CountdownScreen.tsxでの実装例
const generateProblems = async () => {
  const sdk = window.CrazyGames?.SDK.game;

  sdk?.loadingStart(); // ローディング開始通知

  try {
    const problems = await gameLogic.generateProblems(TOTAL_QUESTIONS);
    sdk?.loadingStop(); // ローディング完了通知
    return problems;
  } catch (error) {
    sdk?.loadingStop();
    throw error;
  }
};
```

## 次のステップ

1. まずはBasic Launch向けにビルドサイズを確認
2. メタデータ（説明文、スクリーンショット）を準備
3. CrazyGames Developer Portalでアカウント作成
4. Basic Launchで公開してフィードバック収集
5. エンゲージメントを見ながらFull Launch（SDK統合）を検討

---

*最終更新: 2025-01-16*
