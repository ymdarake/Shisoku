# BGM停止時に音が鳴り続ける問題の調査レポート

## 問題の症状
「トップに戻る」ボタン押下時、BGMを停止(`stopBgm()`)しているにもかかわらず、キックドラムなどの音が1秒以上鳴り続ける。

---

## 調査結果

### 1. 根本原因の特定

#### 問題の核心
**`Tone.Transport.stop()` だけでは音は止まらない**

Tone.jsの公式ドキュメントとGitHub issueの調査により、以下が判明：

> Transport.stop() stops the transport and all sources synced to the transport, but the **synths themselves operate through envelopes that continue their release phase** even after Transport stops.

**意味**:
- `Transport.stop()` は「時間軸（タイムライン）」を停止する
- しかし、**既にtriggerされたシンセの音（エンベロープ）は独立して動作**する
- 特に`release`フェーズが長い音（キックドラムは1.4秒）は鳴り続ける

---

### 2. 現在の実装の問題点

#### 問題1: LoopとSequenceのインスタンスを保持していない

**現在のコード** (`src/service/audio.ts`):
```typescript
// Kick Drum
new Tone.Loop((time: any) => {
  this.kick.triggerAttackRelease('C1', '8n', time);
}, '4n').start(0);

// Hi-hat
new Tone.Loop((time: any) => {
  this.hihat.triggerAttackRelease('C4', '16n', time + Tone.Time('8n').toSeconds());
}, '4n').start(0);
```

**問題**:
- `new Tone.Loop()`で作成したインスタンスをどこにも保存していない
- そのため`loop.stop()`や`loop.dispose()`を呼べない
- `Transport.stop()`だけでは**Loopは停止するが、既に鳴っている音は止まらない**

#### 問題2: Sequenceも同様

```typescript
new Tone.Sequence((time: any, note: string | null) => {
  if (note) this.bgmSynth.triggerAttackRelease(note, '16n', time);
}, [...], '8n').start(0);
```

Sequenceも同様にインスタンスを保持していないため、明示的に停止できない。

---

### 3. なぜボリュームミュートでも効かなかったのか

**試した修正**:
```typescript
if (this.bgmVolume) {
  this.bgmVolume.mute = true;
}
```

**問題**:
- `bgmVolume`は`bgmSynth`のみに接続
- しかし、**bass, kick, hihatは個別のVolumeノードに接続**している

```typescript
this.bass.connect(new Tone.Volume(-10).toDestination());
this.kick.connect(new Tone.Volume(-6).toDestination());
this.hihat.connect(new Tone.Volume(-18).toDestination());
```

そのため、`bgmVolume.mute = true`では**ベース、キック、ハイハットの音は止まらない**。

---

## 調査資料

### Stack Overflow
- [Tone.js completely stop all playing sounds](https://stackoverflow.com/questions/63994325/tone-js-completely-stop-all-playing-sounds)
  - 解決策: すべてのノートを手動で`release`する
  - 例: `piano.keyUp({midi: i}, '+0')` をすべてのキーに対して実行

### GitHub Issues
- [Issue #924: PolySynth playing nonstop when calling Transport.Stop()](https://github.com/Tonejs/Tone.js/issues/924)
  - Transport.stop()前にノートがトリガーされると、リリースが完了するまで鳴り続ける
  - 解決策: Stop時に明示的にreleaseAllを呼ぶ

- [Issue #303: Loop/Transport Problem](https://github.com/Tonejs/Tone.js/issues/303)
  - `Transport.cancel()`はスケジュールをクリアするが、**Loopインスタンス自体は停止しない**
  - 解決策: `loop.stop()`または`loop.dispose()`を呼ぶ

### 公式ドキュメント
- [Loop.stop()](https://tonejs.github.io/docs/14.7.77/Loop#stop)
  - 個別のループインスタンスを停止
  - Transport.stop()とは独立

- [Loop.dispose()](https://tonejs.github.io/docs/14.7.77/Loop#dispose)
  - ループインスタンスを完全に破棄
  - Web Audioノードを解放

---

## 修正方針

### ✅ 正しい停止手順

1. **LoopとSequenceのインスタンスを保持**
   ```typescript
   private melodySeq: Tone.Sequence | null = null;
   private bassSeq: Tone.Sequence | null = null;
   private kickLoop: Tone.Loop | null = null;
   private hihatLoop: Tone.Loop | null = null;
   ```

2. **stopBgm()で各インスタンスを明示的に停止**
   ```typescript
   stopBgm() {
     // 1. 新しい音のスケジューリングを停止
     this.melodySeq?.stop();
     this.bassSeq?.stop();
     this.kickLoop?.stop();
     this.hihatLoop?.stop();

     // 2. Transportを停止
     Tone.Transport.stop();
     Tone.Transport.cancel();

     // 3. 現在鳴っている音を即座に停止
     this.bgmSynth?.releaseAll();
     this.bass?.triggerRelease();
     this.kick?.triggerRelease();
     this.hihat?.triggerRelease();
   }
   ```

3. **オプション: 完全に破棄する場合**
   ```typescript
   stopBgm() {
     this.melodySeq?.dispose();
     this.bassSeq?.dispose();
     this.kickLoop?.dispose();
     this.hihatLoop?.dispose();

     // ただし、dispose後は再度new Tone.Loop()が必要
   }
   ```

---

## 推奨する実装

### Option A: stop()を使う（推奨）
- メリット: 再度`start()`で再開可能
- デメリット: インスタンスはメモリに残る

### Option B: dispose()を使う
- メリット: メモリを完全に解放
- デメリット: 再開時に`new Tone.Loop()`が必要

### 判断
このアプリでは**BGMは何度もON/OFFされる**ため、**Option A (stop())**が適切。

---

## 真の原因と最終的な解決策

### ❌ 当初の仮説（誤り）

当初、`Transport.stop()` だけでは音が止まらないことが原因だと考えたが、実際の問題は**より根本的**だった。

### ✅ 真の原因

**`window.confirm()` がJavaScriptをブロックしている間、BGMが鳴り続ける**

**実行順序**:
1. ユーザーが「トップに戻る」ボタンをクリック
2. `GameScreen.tsx` の `handleQuitClick()` が実行
3. クリック音を再生 (`onPlayClickSound()`)
4. **`window.confirm()` が呼ばれ、JavaScriptの実行がブロック** ← ここで問題発生！
5. ユーザーがOKをクリック
6. `onQuit()` → `handleBackToTop()` → `audioService.stopBgm()` が呼ばれる

**問題**: 手順4で `window.confirm()` がモーダルダイアログを表示している間、JavaScriptの実行は完全に停止するが、**Web Audio APIの音声は独立して動作し続ける**。そのため、手順6でようやく `stopBgm()` が実行されるまで、BGMが鳴り続ける。

### ✅ 正しい解決策

**`window.confirm()` の前にBGMを停止する**

```typescript
// src/component/GameScreen.tsx
const handleQuitClick = () => {
  onPlayClickSound();

  // ✅ confirmの前にBGMを停止
  audioService.stopBgm();

  const ok = window.confirm(locale.confirmQuit as string);

  if (ok) {
    onQuit();  // 状態をidleに戻す
  } else {
    // キャンセル時はBGMを再開
    audioService.playBgm();
  }
}
```

**これにより**:
1. confirmダイアログ表示前にBGMが停止
2. ユーザーがOKを押せば、そのまま終了
3. ユーザーがキャンセルを押せば、BGMを再開してゲーム続行

---

## 参考リンク

- [Tone.js公式ドキュメント - Transport](https://tonejs.github.io/docs/r13/Transport)
- [Tone.js公式ドキュメント - Loop](https://tonejs.github.io/docs/14.7.77/Loop)
- [Tone.js公式ドキュメント - Sequence](https://tonejs.github.io/docs/14.7.77/Sequence)
- [Stack Overflow: Tone.js completely stop all playing sounds](https://stackoverflow.com/questions/63994325/tone-js-completely-stop-all-playing-sounds)
- [GitHub Issue #924: PolySynth playing nonstop](https://github.com/Tonejs/Tone.js/issues/924)
- [GitHub Issue #303: Loop/Transport Problem](https://github.com/Tonejs/Tone.js/issues/303)

---

**作成日**: 2025-11-16
**対象バージョン**: Tone.js 15.1.22
