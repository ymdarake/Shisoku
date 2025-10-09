## Go におけるデータ操作アーキテクチャ（Repository / UseCase / DI）

本ドキュメントは Go で本リポジトリの設計方針（Repository / UseCase / DI）を実現するためのガイドです。`~/.claude/CLAUDE.md` の規定（命名、依存方向、初期化順序、セキュリティ）を優先します。

### レイヤ構成
- Interface Adapter（HTTP Handler/CLIなどの入出力）
  - ↓ Application（UseCase）
    - ↓ Domain（Repository 抽象/Entity/Value）
      - ↓ Infrastructure（実装: DB/FS/HTTP/Memory 等）

### Domain 抽象（例）
```go
type Difficulty string

type RankingEntry struct {
  Name  string
  Score int
  Time  int
  Date  string
}

type RankingRepository interface {
  GetRankings(diff *Difficulty) ([]RankingEntry, error)
  SaveRanking(newEntry RankingEntry, diff *Difficulty) ([]RankingEntry, error)
}
```

### UseCase（例）
```go
type Clock interface { NowISO() string }

type SaveScoreUseCase struct { clock Clock }

func NewSaveScoreUseCase(clock Clock) *SaveScoreUseCase { return &SaveScoreUseCase{clock: clock} }

func (u *SaveScoreUseCase) Execute(repo RankingRepository, entry RankingEntry, diff *Difficulty) ([]RankingEntry, error) {
  if entry.Date == "" { entry.Date = u.clock.NowISO() }
  return repo.SaveRanking(entry, diff)
}

type LoadRankingsUseCase struct{}

func NewLoadRankingsUseCase() *LoadRankingsUseCase { return &LoadRankingsUseCase{} }

func (u *LoadRankingsUseCase) Execute(repo RankingRepository, diff *Difficulty) ([]RankingEntry, error) {
  return repo.GetRankings(diff)
}
```

### Composition Root（起動時 DI）
```go
clock := SystemClock{}
repo := NewFileRankingRepository("rankings.json")
save := NewSaveScoreUseCase(clock)
load := NewLoadRankingsUseCase()

_, _ = save.Execute(repo, RankingEntry{Name: "A", Score: 10, Time: 30}, strPtr("normal"))
list, _ := load.Execute(repo, strPtr("normal"))
_ = list
```

### ハンドラ層からの利用（概念）
```go
func (h *Handler) PostScore(w http.ResponseWriter, r *http.Request) {
  var in postScoreInput
  _ = json.NewDecoder(r.Body).Decode(&in)
  _, err := h.Save.Execute(h.Repo, RankingEntry{Name: in.Name, Score: in.Score, Time: in.Time}, strPtr(in.Difficulty))
  if err != nil { http.Error(w, err.Error(), 500); return }
  w.WriteHeader(http.StatusNoContent)
}
```

### テスト戦略
- InMemory 実装で Contract を満たすか検証。
- UseCase は Clock を固定し日時付与や整形の副作用を検証。

### 注意点
- エラーは `error` を返し、境界（Handler/UseCase/Repo）で適切に変換。
- ロギング/メトリクスは UseCase 境界へ集約。


