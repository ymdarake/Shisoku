## React におけるデータ操作アーキテクチャ（Repository / UseCase / Context / Hook）

本プロジェクトで採用しているデータアクセスと状態取得の設計方針をまとめます。実装時は `~/.claude/CLAUDE.md` の規定（命名、依存方向、Tone.js 初期化、セキュリティ）を最優先とし、用語は `src/constants/locales.ts` に合わせます。

### 目的
- **疎結合**: UI とデータ取得を分離し、テスト容易性を高める
- **DI（依存性注入）**: 具体的な保存先（LocalStorage/Memory/将来のAPI）を差し替え可能にする
- **TDD**: まず契約（インターフェイス）とユースケースのテストを先に書き、段階的に実装

### レイヤ構成（依存方向）
- UI Component（React Component）
  - ↓ Hook（例: `useRanking`）
    - ↓ Context（DI された Repository へのアクセスポイント）
      - ↓ UseCase（ビジネスアプリケーション操作・薄い）
        - ↓ Repository（データ操作の抽象；Domain インターフェイス）
          - ↓ Infrastructure（LocalStorage など具体実装）

依存は常に上から下へ一方向。UI は Repository 具体型を知らず、Context 経由で抽象に触れます。

### Repository（Domain 抽象）
- 役割: データの永続化境界を抽象化。同期/非同期、保存先の違いを吸収
- 例: `src/domain/ranking/RankingRepository.ts`

```ts
export interface RankingRepository {
    getRankings(difficulty?: Difficulty): Promise<RankingEntry[]>;
    saveRanking(newEntry: RankingEntry, difficulty?: Difficulty): Promise<RankingEntry[]>;
}
```

### Infrastructure 実装（差し替え可能）
- 例: LocalStorage 実装、InMemory 実装（テスト用）
- ポイント: Repository 契約テスト（contract test）で振る舞いを固定し、実装差を吸収

```ts
// LocalStorageRankingRepository（概略）
class LocalStorageRankingRepository implements RankingRepository {
  // getRankings/saveRanking を LocalStorage で実装
}
```

### UseCase（薄いアプリケーションユースケース）
- 役割: 画面に依存しないアプリケーション操作を手続きとしてまとめる（日時付与、引数整形、バリデーションなど）
- 例: `saveScore` と `loadRankings`

```ts
export const saveScore = async (deps, score, time, name, difficulty) => {
  const entry = { name, score, time, date: deps.clock.now().toISOString() };
  return deps.rankingRepository.saveRanking(entry, difficulty);
};
```

### DI と Composition Root（アプリ起動時の依存注入）
- `src/index.tsx` で具体 Repository を生成し、Context Provider に注入
- UI 側は Context から抽象（Repository インターフェイス）として取得

```tsx
root.render(
  <React.StrictMode>
    {/* Preferences と Ranking の Repository を Provider で注入 */}
    <PreferencesRepositoryProvider repository={new LocalStoragePreferencesRepository()}>
      <RankingRepositoryProvider repository={new LocalStorageRankingRepository()}>
        <App />
      </RankingRepositoryProvider>
    </PreferencesRepositoryProvider>
  </React.StrictMode>
);
```

### React Context（依存の受け渡し）
- 役割: 木の上位で生成した Repository（抽象）を子へ配布
- 実装: `src/context/RankingRepositoryContext.tsx` 等で `createContext` + Provider + `useXxxRepository` フックを用意

```tsx
const RankingRepositoryContext = createContext<RankingRepository | null>(null);
export const RankingRepositoryProvider = ({ repository, children }) => (
  <RankingRepositoryContext.Provider value={repository}>{children}</RankingRepositoryContext.Provider>
);
export const useRankingRepository = () => {
  const repo = useContext(RankingRepositoryContext);
  if (!repo) throw new Error('RankingRepositoryContext not provided');
  return repo;
};
```

### Hook（UI からの取得ロジック集約）
- 役割: 画面横断で再利用する取得/キャッシュ/ローディング制御をまとめる
- 例: `src/hook/useRanking.ts` は難易度ごとのメモリキャッシュとエラー状態を内包

```ts
export const useRanking = (difficulty: Difficulty) => {
  const repo = useRankingRepository();
  // fetch → setState → cache などを実装
  return { list, loading, error };
};
```

### View から Context（DI）へ到達する道順（呼び出しチェーン）
1) Component（View）で `useRanking(difficulty)` を呼ぶ
2) `useRanking` の内部で `useRankingRepository()` を呼び、Context から Repository 抽象を取得
3) `useRankingRepository()` は React の `useContext(RankingRepositoryContext)` を通じて、最上位で DI されたインスタンスを受け取る
4) `index.tsx` の Composition Root で、`<RankingRepositoryProvider repository={new LocalStorageRankingRepository()} />` により具体実装を注入

呼び出し関係の全体像:

```
Component(View)
  -> useRanking(difficulty)
     -> useRankingRepository()  // Context 参照
        -> useContext(RankingRepositoryContext)
           -> Provider が注入した repository インスタンス（LocalStorage など）
```

最少コード例:

```tsx
// 1) View: Component から useRanking を呼ぶ
export const RankingList: React.FC<{ difficulty: Difficulty }> = ({ difficulty }) => {
  const { list, loading, error } = useRanking(difficulty);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return (
    <ul>
      {list.map((r) => (
        <li key={`${r.name}-${r.date}`}>{r.name}: {r.score}</li>
      ))}
    </ul>
  );
};

// 2) Hook: useRanking 内部で Context から Repository を取得
export const useRanking = (difficulty: Difficulty) => {
  const rankingRepository = useRankingRepository();
  // ここで rankingRepository.getRankings(difficulty) を使って取得
  // ... loading/error/caching を内包して返す
  return { list, loading, error };
};

// 3) Context: Provider/Hook 実装
const RankingRepositoryContext = createContext<RankingRepository | null>(null);
export const RankingRepositoryProvider: React.FC<{ repository: RankingRepository; children: React.ReactNode }>
  = ({ repository, children }) => (
    <RankingRepositoryContext.Provider value={repository}>{children}</RankingRepositoryContext.Provider>
  );

export const useRankingRepository = (): RankingRepository => {
  const repo = useContext(RankingRepositoryContext);
  if (!repo) throw new Error('RankingRepositoryContext not provided');
  return repo;
};

// 4) Composition Root: index.tsx で具体実装を DI
root.render(
  <React.StrictMode>
    <PreferencesRepositoryProvider repository={new LocalStoragePreferencesRepository()}>
      <RankingRepositoryProvider repository={new LocalStorageRankingRepository()}>
        <App />
      </RankingRepositoryProvider>
    </PreferencesRepositoryProvider>
  </React.StrictMode>
);
```

ポイント:
- View は Repository の具体型を一切知らず、`useRanking` だけを呼ぶ
- `useRanking` は Context 経由で「抽象」を受け取り、取得ロジックを集約
- 具体実装の選択は Composition Root（`index.tsx`）に集約し、テストでは Provider に Stub/Memory 実装を注入して差し替え可能

### Component（UI）
- 役割: 表示とユーザー操作、Hook の結果をレンダリング
- 注意: 直接 Repository メソッドを呼ばず Hook/UseCase を通す（ロジック重複を防止）

### テスト戦略（TDD）
1) Contract Test: Repository 抽象に対して InMemory/LocalStorage 実装が同一振る舞いか検証
2) UseCase Test: Repository をモックし、入出力（副作用）を検証
3) Hook Test: Provider で Stub Repository を注入し、ローディング/キャッシュ/エラー遷移を検証
4) Component Test: Provider で Stub を注入し、UI の表示・タブ切替・i18n 文言などを検証

### 例: ランキング読み込みフロー
1) Component -> `useRanking(difficulty)` を呼ぶ
2) Hook -> Context から `RankingRepository` を取得し `getRankings(difficulty)` 実行
3) Repository -> LocalStorage から取得（将来は API に置換可）
4) Hook -> ステート更新（list/loading/error）
5) UI -> リスト描画、タブ変更時は再取得

### 例: スコア保存フロー
1) Component -> 入力完了で UseCase `saveScore` を呼ぶ
2) UseCase -> Clock で日時付与し Repository に委譲
3) Repository -> 保存し、最新配列を返す
4) Component/Hook -> リスト更新

### エラーハンドリング
- Repository は例外を投げる／空配列を返すなどポリシーを統一
- Hook は `error` ステートを持ち、UI でリトライ導線を表示

### キャッシュ方針
- Hook で軽量なメモリキャッシュ（セッション内）
- しきい値や無効化は必要に応じて拡張（キー: 難易度など）

### 命名・依存ルール
- Domain 配下にタイプ定義（例: `src/domain/ranking/type.ts`）
- Repository は単数形命名、グローバル変数は使用しない
- 依存の生成は Composition Root（`index.tsx`）に集約

### 将来拡張
- API Repository の追加（HTTP クライアント差し替え）
- オフライン同期（LocalStorage と API のハイブリッド）
- 高度なキャッシュ（SWR/React Query への委譲）

---
このドキュメントは実装とテストに直結する最小ガイドです。追加の詳細は `docs/architecture.md` と `docs/architecture-todo.md` を参照してください。


