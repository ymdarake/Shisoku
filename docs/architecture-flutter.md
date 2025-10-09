## Flutter におけるデータ操作アーキテクチャ（Repository / UseCase / DI）

本ドキュメントは Flutter で本リポジトリの設計方針（Repository / UseCase / DI）を実現するためのガイドです。`~/.claude/CLAUDE.md` の規定（命名、依存方向、初期化順序、セキュリティ）を優先します。

### 目的
- UI（Widget）をシンプルにし、データ取得/保存の手続きを外へ出す
- 端末保存（SharedPreferences/ファイル）やHTTPなど保存先を差し替えやすくする
- 日付付与・整形・検証などを UseCase にまとめ、画面ごとの差をなくす

### レイヤ構成
- Presentation（Widget/StateNotifier/BLoC/Cubit など）
  - ↓ Application（UseCase）
    - ↓ Domain（Repository 抽象/Entity/Value）
      - ↓ Infrastructure（実装: SharedPreferences/Isar/HTTP/Memory 等）

### 各レイヤの役割
- Presentation: 画面（Widget）や `StateNotifier`/`BLoC` がある層。UIの状態管理と描画に集中し、データ操作は UseCase を呼ぶだけにします。
- Application（UseCase）: アプリ固有の手続きの置き場。日付付与、入力整形、並び替えなどをひとつに集約します。
- Domain: ルールと抽象（`RankingRepository` など）を定義。ここは技術要素から独立しています。
- Infrastructure: 実際の保存方法（SharedPreferences/Isar/HTTPなど）を実装。Domain の抽象に従います。

### ディレクトリ構造（例）
```
lib/
  presentation/                 // Widget/Route/State管理（Riverpod/BLoC等）
    pages/
    widgets/
    providers/
  application/                  // UseCase
    usecase/
      save_score.dart
      load_rankings.dart
  domain/                       // 抽象・モデル
    ranking/
      ranking_entry.dart
      ranking_repository.dart   // 抽象
      types.dart
  infrastructure/               // 具体実装
    ranking/
      shared_prefs/
        ranking_repository.dart
      http/
        ranking_repository.dart
      memory/
        ranking_repository.dart
  shared/
    clock.dart
  main.dart                     // Composition Root（Provider束ね）
```

### 依存注入（例）
- Riverpod（または get_it）を利用して Composition Root で依存を束ねる。

```dart
// Domain
abstract class RankingRepository {
  Future<List<RankingEntry>> getRankings([Difficulty? difficulty]);
  Future<List<RankingEntry>> saveRanking(RankingEntry newEntry, [Difficulty? difficulty]);
}

// Application (UseCase)
class SaveScoreUseCase {
  final Clock clock;
  const SaveScoreUseCase(this.clock);

  Future<List<RankingEntry>> execute(RankingRepository repo, RankingEntry entry, [Difficulty? diff]) async {
    final withDate = entry.copyWith(date: entry.date ?? clock.nowISO());
    return repo.saveRanking(withDate, diff);
  }
}

class LoadRankingsUseCase {
  Future<List<RankingEntry>> execute(RankingRepository repo, [Difficulty? diff]) {
    return repo.getRankings(diff);
  }
}
```

### Composition Root（Riverpod例）
```dart
final clockProvider = Provider<Clock>((ref) => SystemClock());
final rankingRepoProvider = Provider<RankingRepository>((ref) => SharedPrefsRankingRepository());

final saveScoreUseCaseProvider = Provider<SaveScoreUseCase>((ref) => SaveScoreUseCase(ref.read(clockProvider)));
final loadRankingsUseCaseProvider = Provider<LoadRankingsUseCase>((ref) => LoadRankingsUseCase());
```

### Presentation からの呼び出し（概念）
```dart
final save = ref.read(saveScoreUseCaseProvider);
final repo = ref.read(rankingRepoProvider);
await save.execute(repo, RankingEntry(name: 'A', score: 10, time: 30));

final load = ref.read(loadRankingsUseCaseProvider);
final list = await load.execute(repo, Difficulty.normal);
```

### テスト戦略
- Repository を InMemory 実装に差し替え、UseCase の日時付与や整形を検証。
- Widget テストでは Provider のオーバーライドを活用。

### 注意点
- 初期化順（音/セキュリティなど副作用）は UseCase 境界で担保。
- UI 文言やロケールは Presentation 層に限定し、UseCase/Domain は言語非依存に保つ。


