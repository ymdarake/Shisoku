## 一般アプリケーションにおけるデータ操作アーキテクチャ（UI非依存）

本ドキュメントは、React に依存しない一般的なアプリケーション（デスクトップ/モバイル/CLI/サーバーいずれも可）で、Repository / UseCase / DI を中心に据えた疎結合設計を実現するための最小指針です。実装時は `~/.claude/CLAUDE.md` の規定（命名、依存方向、初期化順序、セキュリティ）を優先し、用語は本リポジトリの `src/constant/locales.ts` に準じます。

### 目的
- UI からデータ操作を分離し、テスト容易性・移植性を最大化
- 具体的なデータ保存先（ファイル/DB/HTTP API/メモリ）を差し替え可能に
- アプリケーション手続き（日付付与/検証/整形/並び替え）を UseCase に集約

### レイヤ構成（依存方向）
- Presentation（UI/CLI/API Handler など）
  - ↓ Application（UseCase）
    - ↓ Domain（Repository 抽象/エンティティ/バリュー）
      - ↓ Infrastructure（Repository 具体実装: DB/HTTP/FS/Memory 等）

依存は常に上から下へ一方向。Presentation は Repository の具体型を知らず、Application（UseCase）経由で抽象に触れます。

### 主要インターフェイス例（概念）
```ts
// Domain
export interface RankingRepository {
  getRankings(difficulty?: Difficulty): Promise<RankingEntry[]>;
  saveRanking(newEntry: RankingEntry, difficulty?: Difficulty): Promise<RankingEntry[]>;
}

// Application（UseCase）
export class SaveScoreUseCase {
  constructor(private readonly clock: Clock) {}
  async execute(repo: RankingRepository, entry: Omit<RankingEntry, 'date'> | RankingEntry, diff?: Difficulty) {
    const withDate = { ...entry, date: (entry as any).date ?? this.clock.nowISO() } as RankingEntry
    return repo.saveRanking(withDate, diff)
  }
}

export class LoadRankingsUseCase {
  execute(repo: RankingRepository, diff?: Difficulty) {
    return repo.getRankings(diff)
  }
}
```

### Composition Root（起動時 DI）
- アプリ起動時に Repository の具体型（例: `LocalFileRankingRepository` や `HttpRankingRepository`）と、UseCase に必要な依存（Clock 等）を生成。
- DI コンテナを使う場合も使わない場合も「生成と束ね」は起動点に集約。

擬似例:
```ts
const clock: Clock = { nowISO: () => new Date().toISOString() }
const rankingRepo = new LocalFileRankingRepository('rankings.json')
const saveScore = new SaveScoreUseCase(clock)
const loadRankings = new LoadRankingsUseCase()

// Presentation 層（UI/CLI/API）からの利用
await saveScore.execute(rankingRepo, { name: 'A', score: 10, time: 30 }, 'normal')
const list = await loadRankings.execute(rankingRepo, 'normal')
```

### エラーハンドリングとポリシー
- Repository は I/O 例外や変換失敗を統一した方法で扱う（例: ドメイン例外 or 型安全なエラー戻り値）。
- UseCase は UI 依存の文言を持たず、再試行・ロギングフックを持つ。

### テスト戦略
1) Contract Test: Repository 抽象に対して InMemory/実装が同一振る舞いか検証
2) UseCase Test: Clock/Repository 差し替えで副作用と整形を検証
3) Presentation Test: ハンドラ/CLI/画面が UseCase 結果を正しく描画/返却するか検証

### 将来拡張
- 複数データソースのフェデレーション（キャッシュ→API→DB）
- 観測（メトリクス/監査ログ）を UseCase 境界に集約
- トランザクション境界（Unit of Work）を Repository 実装に付与


