# ランキングDB保存方法の検討レポート

## 目次
1. [現状と課題](#現状と課題)
2. [DB保存のメリット・デメリット](#db保存のメリットデメリット)
3. [技術選択肢の比較](#技術選択肢の比較)
4. [推奨アーキテクチャ](#推奨アーキテクチャ)
5. [実装ステップ](#実装ステップ)
6. [コスト試算](#コスト試算)
7. [考慮事項](#考慮事項)

---

## 現状と課題

### 現在の実装
- **保存方法**: localStorage
- **データ構造**:
  ```typescript
  interface RankingEntry {
    name: string;      // プレイヤー名
    score: number;     // 正解数
    time: number;      // プレイ時間（秒）
    date: string;      // 記録日時
  }
  ```
- **保存ロジック**:
  - 難易度別にキーを分離 (`mathPuzzleRanking:easy`, `mathPuzzleRanking:normal`, `mathPuzzleRanking:hard`)
  - 各難易度で最大10件を保存
  - スコア降順 → 時間昇順でソート

### 課題
1. **ローカル限定**: ユーザーのブラウザ内でのみランキングが管理される
2. **グローバル競争なし**: 他のプレイヤーとスコアを競えない
3. **データの永続性**: ブラウザキャッシュクリアで消失
4. **デバイス間共有不可**: 異なるデバイスでランキングが共有されない
5. **不正対策なし**: クライアント側で簡単にスコア改ざんが可能

---

## DB保存のメリット・デメリット

### メリット
| 項目 | 説明 |
|------|------|
| グローバルランキング | 全プレイヤーのスコアをリアルタイムで競える |
| データ永続性 | ブラウザキャッシュに依存しない安定した保存 |
| デバイス間共有 | ログインすれば複数デバイスで同じランキングを閲覧 |
| 統計分析 | 全体の平均スコア、プレイ回数などの分析が可能 |
| ソーシャル機能拡張 | フレンド機能、シェア機能などの実装が容易に |

### デメリット
| 項目 | 説明 |
|------|------|
| 実装コスト | バックエンドAPIの開発が必要 |
| 運用コスト | サーバー費用、データベース費用が継続的に発生 |
| 複雑性増加 | 認証、セキュリティ、不正対策などの考慮が必要 |
| パフォーマンス | ネットワーク遅延による応答速度の低下 |
| プライバシー懸念 | ユーザーデータの管理責任が発生 |

---

## 技術選択肢の比較

### 1. Firebase (Firestore)

**概要**: Googleが提供するBaaS（Backend as a Service）

#### メリット
- ✅ 設定が簡単、ゼロコンフィグで開始可能
- ✅ リアルタイムデータ同期（ランキングの自動更新）
- ✅ クライアントSDKが充実（認証、ストレージ、分析など統合）
- ✅ 無料枠が充実（月間50,000読み取り、20,000書き込み）
- ✅ セキュリティルールでアクセス制御が可能

#### デメリット
- ❌ ベンダーロックインのリスク
- ❌ 複雑なクエリに制限あり
- ❌ 大規模化するとコストが高い

#### コード例
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, addDoc } from 'firebase/firestore';

const db = getFirestore(app);

// ランキング取得
const q = query(
  collection(db, 'rankings'),
  where('difficulty', '==', 'normal'),
  orderBy('score', 'desc'),
  orderBy('time', 'asc'),
  limit(10)
);

// ランキング保存
await addDoc(collection(db, 'rankings'), {
  name: 'Player1',
  score: 10,
  time: 120,
  difficulty: 'normal',
  date: new Date().toISOString()
});
```

#### 推定コスト（月間）
- 無料枠: 50,000 reads / 20,000 writes
- 想定: 1,000 DAU、各5回プレイ/日
  - 読み取り: 1,000 × 5 × 30 = 150,000 reads/月 → **無料枠超過: $0.36**
  - 書き込み: 1,000 × 5 × 30 = 150,000 writes/月 → **無料枠超過: $1.80**
  - **合計: 約$2.16/月**

---

### 2. Supabase (PostgreSQL)

**概要**: オープンソースのFirebase代替、PostgreSQLベース

#### メリット
- ✅ オープンソース、ベンダーロックインを回避
- ✅ PostgreSQLの強力なクエリ機能
- ✅ リアルタイムサブスクリプション対応
- ✅ Row Level Security（RLS）で細かいアクセス制御
- ✅ 無料枠が充実（500MB DB、5GB転送量）

#### デメリット
- ❌ Firebaseより設定が複雑
- ❌ リアルタイム機能はFirebaseほど洗練されていない

#### コード例
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ランキング取得
const { data, error } = await supabase
  .from('rankings')
  .select('*')
  .eq('difficulty', 'normal')
  .order('score', { ascending: false })
  .order('time', { ascending: true })
  .limit(10);

// ランキング保存
const { error } = await supabase
  .from('rankings')
  .insert({
    name: 'Player1',
    score: 10,
    time: 120,
    difficulty: 'normal',
    date: new Date().toISOString()
  });
```

#### 推定コスト（月間）
- 無料枠: 500MB DB、5GB転送量、50,000 MAU
- 想定: 1,000 DAU
  - データベース: ~10MB（十分に無料枠内）
  - 転送量: ~1GB（無料枠内）
  - **合計: $0/月（無料枠内）**
- スケール後（Pro: $25/月）

---

### 3. Cloudflare D1 (SQLite)

**概要**: Cloudflareのエッジデータベース（SQLite互換）

#### メリット
- ✅ エッジで実行、超低レイテンシ
- ✅ Cloudflare Workersと統合、既存のホスティングと相性良い
- ✅ 無料枠が広い（500万 reads/日、10万 writes/日）
- ✅ GitHubと連携したCI/CD（Wrangler）

#### デメリット
- ❌ リアルタイム更新はなし（定期的なポーリングが必要）
- ❌ まだベータ版、機能が限定的
- ❌ クライアントSDKなし（Workers APIを自作）

#### コード例（Cloudflare Workers）
```typescript
export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/rankings') {
      const difficulty = new URL(request.url).searchParams.get('difficulty');
      const results = await env.DB.prepare(
        'SELECT * FROM rankings WHERE difficulty = ? ORDER BY score DESC, time ASC LIMIT 10'
      ).bind(difficulty).all();
      return Response.json(results);
    }

    if (pathname === '/api/rankings' && request.method === 'POST') {
      const data = await request.json();
      await env.DB.prepare(
        'INSERT INTO rankings (name, score, time, difficulty, date) VALUES (?, ?, ?, ?, ?)'
      ).bind(data.name, data.score, data.time, data.difficulty, new Date().toISOString()).run();
      return Response.json({ success: true });
    }
  }
};
```

#### 推定コスト（月間）
- 無料枠: 5M reads/日、100K writes/日
- 想定: 1,000 DAU、各5回プレイ/日
  - 読み取り: 5,000/日（無料枠内）
  - 書き込み: 5,000/日（無料枠内）
  - **合計: $0/月（無料枠内）**

---

### 4. Vercel KV (Redis) + Vercel Postgres

**概要**: Vercelが提供するマネージドDB

#### メリット
- ✅ Vercelとのシームレスな統合
- ✅ サーバーレス関数と同じインフラで管理
- ✅ Redis（KV）は超高速

#### デメリット
- ❌ Vercelにロックイン
- ❌ 無料枠が小さい（KV: 256MB、Postgres: 256MB）
- ❌ コストがやや高め

#### 推定コスト（月間）
- KV Hobby: $0.25/100K commands
- Postgres Hobby: 無料（256MB、60時間コンピュート/月）
- **合計: $3-5/月**

---

### 5. カスタムバックエンド（Node.js + MongoDB/PostgreSQL）

**概要**: 自前でAPI + DBを構築

#### メリット
- ✅ 完全なコントロール、カスタマイズ自由
- ✅ 長期的にコスト最適化可能
- ✅ 他サービスへの移行が容易

#### デメリット
- ❌ 開発・保守コストが最大
- ❌ セキュリティ、スケーリング、監視を全て自前で管理
- ❌ サーバー費用が継続的に発生

#### 推定コスト（月間）
- VPS（例: Hetzner、DigitalOcean）: $5-10/月
- 開発・保守時間: 初期20時間、月間2-5時間

---

## 技術選択肢の比較表

| 項目 | Firebase | Supabase | Cloudflare D1 | Vercel | カスタム |
|------|----------|----------|---------------|--------|----------|
| 初期実装時間 | ⭐⭐⭐ (2-3時間) | ⭐⭐ (4-6時間) | ⭐⭐ (5-8時間) | ⭐⭐ (4-6時間) | ⭐ (20-40時間) |
| コスト（小規模） | $0-5/月 | $0/月 | $0/月 | $3-5/月 | $5-10/月 |
| スケーラビリティ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| リアルタイム性 | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ | ⭐⭐ |
| 学習コスト | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐ | ⭐ |
| ベンダーロックイン | ❌ | ⭕ | ❌ | ❌ | ⭕ |
| 既存ホスティング統合 | ⭕ | ⭕ | ⭐⭐⭐ | ⭐⭐ | ⭕ |

---

## 推奨アーキテクチャ

### 🏆 推奨: **Cloudflare D1 + Cloudflare Workers**

#### 理由
1. **既存ホスティングとの統合**: 現在Cloudflare Pagesを使用しているため、同じエコシステム内で完結
2. **コスト**: 無料枠が非常に広く、中規模までスケールしても無料
3. **パフォーマンス**: エッジで実行されるため、グローバルでの低レイテンシ
4. **シンプル**: リアルタイム性が不要なら、定期ポーリングで十分
5. **学習機会**: Cloudflareのエコシステムを学ぶ良い機会

#### アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (React App)                       │
│                  Cloudflare Pages                           │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ fetch('/api/rankings')
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare Workers (API)                        │
│  - GET /api/rankings?difficulty=normal                      │
│  - POST /api/rankings                                       │
│  - GET /api/rankings/stats                                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ SQL queries
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare D1 (SQLite)                          │
│  Table: rankings                                            │
│  - id (INTEGER PRIMARY KEY)                                 │
│  - name (TEXT)                                              │
│  - score (INTEGER)                                          │
│  - time (INTEGER)                                           │
│  - difficulty (TEXT)                                        │
│  - date (TEXT)                                              │
│  - created_at (TEXT)                                        │
└─────────────────────────────────────────────────────────────┘
```

### データベーススキーマ

```sql
CREATE TABLE rankings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  time INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'normal', 'hard')),
  date TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_difficulty_score_time ON rankings(difficulty, score DESC, time ASC);
CREATE INDEX idx_created_at ON rankings(created_at DESC);
```

### API設計

#### 1. ランキング取得
```
GET /api/rankings?difficulty=normal&limit=10

Response:
{
  "rankings": [
    {
      "name": "Player1",
      "score": 10,
      "time": 120,
      "date": "2025-11-16T14:30:00Z"
    },
    ...
  ]
}
```

#### 2. ランキング投稿
```
POST /api/rankings

Request:
{
  "name": "Player1",
  "score": 10,
  "time": 120,
  "difficulty": "normal"
}

Response:
{
  "success": true,
  "rank": 5  // 現在のランク
}
```

#### 3. 統計情報取得（拡張機能）
```
GET /api/rankings/stats?difficulty=normal

Response:
{
  "total_plays": 1234,
  "average_score": 7.5,
  "average_time": 180,
  "high_score": 10
}
```

---

## 実装ステップ

### Phase 1: Cloudflare Workers + D1のセットアップ（2-3時間）

1. **Wranglerのインストールと設定**
   ```bash
   npm install -g wrangler
   wrangler login
   wrangler init ranking-api
   ```

2. **D1データベースの作成**
   ```bash
   wrangler d1 create shisoku-rankings
   wrangler d1 execute shisoku-rankings --file=./schema.sql
   ```

3. **Workers APIの実装**
   - GET /api/rankings（ランキング取得）
   - POST /api/rankings（スコア投稿）

4. **デプロイ**
   ```bash
   wrangler publish
   ```

### Phase 2: フロントエンド統合（3-4時間）

1. **RankingRepository インターフェースの拡張**
   ```typescript
   export interface RankingRepository {
     getRankings(difficulty?: Difficulty): Promise<RankingEntry[]>;
     saveRanking(entry: Omit<RankingEntry, 'date'>, difficulty?: Difficulty): Promise<RankingEntry[]>;
     // 新規追加
     getGlobalRankings(difficulty: Difficulty): Promise<RankingEntry[]>;
     saveToGlobalRanking(entry: Omit<RankingEntry, 'date'>, difficulty: Difficulty): Promise<{ success: boolean; rank: number }>;
   }
   ```

2. **CloudflareRankingRepository の実装**
   ```typescript
   export class CloudflareRankingRepository implements RankingRepository {
     private apiUrl = 'https://your-worker.workers.dev/api/rankings';

     async getGlobalRankings(difficulty: Difficulty): Promise<RankingEntry[]> {
       const res = await fetch(`${this.apiUrl}?difficulty=${difficulty}&limit=10`);
       const data = await res.json();
       return data.rankings;
     }

     async saveToGlobalRanking(entry: Omit<RankingEntry, 'date'>, difficulty: Difficulty) {
       const res = await fetch(this.apiUrl, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ ...entry, difficulty })
       });
       return res.json();
     }

     // localStorage実装も維持（ハイブリッド）
     async getRankings(difficulty?: Difficulty): Promise<RankingEntry[]> {
       // 既存のlocalStorage実装
     }

     async saveRanking(entry: Omit<RankingEntry, 'date'>, difficulty?: Difficulty): Promise<RankingEntry[]> {
       // 既存のlocalStorage実装
     }
   }
   ```

3. **UI追加: グローバルランキング表示**
   - タブ切り替え: 「マイランキング」「グローバルランキング」
   - グローバルランキングへのスコア投稿ボタン

### Phase 3: セキュリティ・不正対策（4-6時間）

1. **Rate Limiting（レート制限）**
   ```typescript
   // Cloudflare Workers KV を使ったレート制限
   const rateLimit = async (ip: string, limit: number, window: number) => {
     const key = `ratelimit:${ip}`;
     const current = await env.KV.get(key);
     if (current && parseInt(current) >= limit) {
       return false; // 制限超過
     }
     await env.KV.put(key, String((parseInt(current || '0') + 1)), { expirationTtl: window });
     return true;
   };
   ```

2. **スコア検証（サーバーサイド）**
   - スコアの妥当性チェック（0-10の範囲内）
   - 時間の妥当性チェック（最低20秒以上、最大1時間以内など）

3. **CAPTCHA導入（オプション）**
   - Cloudflare Turnstileを使った bot 対策

### Phase 4: モニタリング・分析（2-3時間）

1. **Cloudflare Analytics の設定**
2. **エラーログ収集（Sentry連携など）**
3. **ダッシュボード作成（Grafana/Cloudflare Analytics）**

---

## コスト試算

### Cloudflare D1 + Workers（推奨構成）

| 規模 | DAU | 読み取り/日 | 書き込み/日 | 月額コスト |
|------|-----|------------|------------|-----------|
| 小規模 | 100 | 500 | 500 | **$0** |
| 中規模 | 1,000 | 5,000 | 5,000 | **$0** |
| 大規模 | 10,000 | 50,000 | 50,000 | **$0** |
| 超大規模 | 100,000 | 500,000 | 500,000 | **$0** |

※ 無料枠: 500万 reads/日、10万 writes/日

### Firebase比較（同条件）

| 規模 | DAU | 月額コスト |
|------|-----|-----------|
| 小規模 | 100 | $0 |
| 中規模 | 1,000 | $2-5 |
| 大規模 | 10,000 | $20-50 |
| 超大規模 | 100,000 | $200-500 |

---

## 考慮事項

### 1. プライバシー・GDPR対応

- **個人情報の最小化**: 名前のみ（ニックネーム推奨）
- **削除リクエスト対応**: ユーザーが自分のデータ削除をリクエストできる機能
- **匿名オプション**: 名前を匿名（Anonymous）にするオプション

### 2. セキュリティ

| 脅威 | 対策 |
|------|------|
| スコア改ざん | サーバーサイドでスコア検証（範囲チェック、時間妥当性） |
| DDoS攻撃 | Cloudflare Rate Limiting、IPベース制限 |
| SQLインジェクション | D1のプリペアドステートメント使用（自動エスケープ） |
| XSS | 入力値のサニタイズ、Content Security Policy |

### 3. ユーザー体験

#### ハイブリッドアプローチ（推奨）

```
┌─────────────────────────────────┐
│   ローカルランキング             │
│   - すぐに表示（localStorage）  │
│   - オフラインでも動作           │
│   - 個人の記録管理               │
└─────────────────────────────────┘
                +
┌─────────────────────────────────┐
│   グローバルランキング           │
│   - オプトイン（投稿ボタン）     │
│   - 上位10件を表示               │
│   - 競争要素の追加               │
└─────────────────────────────────┘
```

**メリット**:
- ネットワークエラー時もローカルランキングは動作
- グローバルランキングは任意で投稿（プライバシー配慮）
- 段階的な移行が可能

### 4. パフォーマンス最適化

- **キャッシュ戦略**:
  - グローバルランキングを5分間キャッシュ（Cloudflare Cache API）
  - SWR（Stale-While-Revalidate）パターンで即座に表示、バックグラウンドで更新

- **Prefetch**:
  - ゲーム終了時にグローバルランキングをprefetch

### 5. 段階的な実装

#### MVP（最小限の機能）
- ✅ GET /api/rankings（グローバルランキング取得）
- ✅ POST /api/rankings（スコア投稿）
- ✅ 難易度別フィルタリング
- ✅ 上位10件表示

#### Phase 2（エンゲージメント向上）
- ⭐ 自分のランクを表示（例: "あなたは567位です"）
- ⭐ 週間・月間ランキング
- ⭐ 国別ランキング（IPベース）

#### Phase 3（ソーシャル機能）
- 🎮 フレンド機能（Firebase Authenticationなど追加）
- 🎮 スコアシェア（Twitter/X、Discord連携）
- 🎮 実績・バッジシステム

---

## まとめ

### 推奨構成
**Cloudflare D1 + Cloudflare Workers + ハイブリッドアプローチ**

### 理由
1. ✅ **コスト最適**: 無料枠が広く、中規模まで無料
2. ✅ **実装シンプル**: 既存のCloudflare Pages環境に統合
3. ✅ **パフォーマンス**: エッジで実行、グローバル低レイテンシ
4. ✅ **スケーラビリティ**: 大規模化しても追加コストなし
5. ✅ **段階的移行**: ローカルランキングと併用可能

### 実装優先度
1. **Phase 1** (必須): Workers + D1セットアップ（2-3時間）
2. **Phase 2** (推奨): フロントエンド統合（3-4時間）
3. **Phase 3** (重要): セキュリティ対策（4-6時間）
4. **Phase 4** (オプション): モニタリング・拡張機能

### 想定タイムライン
- 初期実装: 1-2週間（週末作業ベース）
- テスト・調整: 1週間
- 本番リリース: 3-4週間後

### 次のアクション
1. Cloudflare Workersアカウント確認
2. D1データベース作成
3. サンプルAPIの実装とテスト
4. フロントエンドのプロトタイプ作成
