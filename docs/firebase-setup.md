# Firebase セットアップガイド

このプロジェクトでは、グローバルランキング機能にFirebase Firestoreを使用しています。

## 前提条件

- Googleアカウント
- Node.js（既にインストール済み）

## セットアップ手順

### 1. Firebaseプロジェクトを作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `shisoku-game`）
4. Google Analyticsは任意（不要なら無効化可）
5. プロジェクト作成完了を待つ

### 2. Firestoreデータベースを作成

1. Firebase Consoleで作成したプロジェクトを開く
2. 左メニューから「Firestore Database」を選択
3. 「データベースを作成」をクリック
4. ロケーション選択:
   - 本番環境: `asia-northeast1`（東京）推奨
   - テスト: どこでも可
5. セキュリティルール:
   - **「本番環境モード」を選択**
   - 後でルールを設定するため

### 3. Webアプリを追加

1. Firebase Consoleのプロジェクト概要ページ
2. 「アプリを追加」 → 「Web（</>）」を選択
3. アプリのニックネーム入力（例: `Shisoku Web App`）
4. Firebase Hostingは **チェック不要**（GitHub Pagesを使用）
5. 「アプリを登録」をクリック
6. **SDK設定情報をコピー** （次のステップで使用）

### 3.1. ドメインの許可（重要）

GitHub Pages からアクセスできるようにするため、ドメインを許可リストに追加します：

1. Firebase Console の左メニューから「Authentication」を選択
2. 「Settings」タブ → 「Authorized domains」を選択
3. 「Add domain」をクリック
4. GitHub Pagesのドメイン（例: `ymdarake.github.io`）を入力して追加

※ Authenticationを使っていなくても、CORSやセキュリティ設定のために推奨されます。

表示される設定は以下のような形式：

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 4. 環境変数を設定

1. プロジェクトルートで `.env` ファイルを作成:
   ```bash
   cp .env.example .env
   ```

2. `.env` ファイルを編集し、Firebase設定値を入力:
   ```bash
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

### 5. Firestoreセキュリティルールをデプロイ

#### オプション1: Firebase CLI（推奨）

1. Firebase CLIをインストール:
   ```bash
   npm install -g firebase-tools
   ```

2. Firebaseにログイン:
   ```bash
   firebase login
   ```

3. プロジェクトを初期化:
   ```bash
   firebase init firestore
   ```
   - 既存のプロジェクトを選択
   - `firestore.rules` と `firestore.indexes.json` を使用（既に用意済み）

4. ルールをデプロイ:
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only firestore:indexes
   ```

#### オプション2: Firebase Console（手動）

1. Firebase Console → Firestore Database → ルール
2. `firestore.rules` の内容をコピー＆ペースト
3. 「公開」をクリック

### 6. 動作確認

1. ローカルで開発サーバーを起動:
   ```bash
   npm run dev
   ```

2. ゲームをプレイしてランキングを投稿
3. Firebase Console → Firestore Database → データ
4. `rankings` コレクションにデータが保存されていることを確認

## トラブルシューティング

### エラー: "Firebase not initialized"

- `.env` ファイルが正しく設定されているか確認
- 環境変数名が `VITE_` で始まっているか確認
- 開発サーバーを再起動（環境変数変更後は必須）

### エラー: "Missing or insufficient permissions"

- Firestoreセキュリティルールが正しくデプロイされているか確認
- Firebase Console → Firestore Database → ルールで内容を確認

### ランキングが表示されない

1. ブラウザの開発者ツール（F12）でコンソールエラーを確認
2. Firebase Console → Firestore Database → データでデータが保存されているか確認
3. ネットワークタブでFirestoreへのリクエストが成功しているか確認

## セキュリティに関する注意事項

### APIキーの公開について

Firebaseの `apiKey` はクライアントサイドで公開されても問題ありません：

- セキュリティはFirestoreのセキュリティルールで制御
- APIキーはアプリの識別のみに使用
- 不正利用はセキュリティルールで防止

### セキュリティルールの重要性

`firestore.rules` で以下を実現：

1. **読み取り制限なし** - ランキングは公開情報
2. **書き込みバリデーション**:
   - スコア範囲チェック（0-10）
   - 時間範囲チェック（20秒-1時間）
   - 難易度チェック（easy/normal/hard）
   - 名前長さ制限（最大20文字）
3. **更新・削除禁止** - 一度保存したランキングは変更不可

## コスト

### 無料枠（Spark プラン）

- **読み取り**: 50,000/日
- **書き込み**: 20,000/日
- **ストレージ**: 1GB

### 想定使用量（1,000 DAU、1日5回プレイ）

- 読み取り: 5,000/日 → **無料枠内**
- 書き込み: 5,000/日 → **無料枠内**
- ストレージ: ~10MB → **無料枠内**

**結論**: 中規模まで完全無料で運用可能

## 参考リンク

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore セキュリティルール](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Pricing](https://firebase.google.com/pricing)
