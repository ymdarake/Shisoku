// 純粋なWeb Audio API実装（Tone.js不使用）

// 音階を周波数に変換
const noteToFreq = (note: string): number => {
  const notes: { [key: string]: number } = {
    'C1': 32.70, 'C2': 65.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'C3': 130.81,
    'D#3': 155.56, 'C4': 261.63, 'C5': 523.25, 'E5': 659.25, 'F5': 698.46,
    'G5': 783.99, 'A5': 880.00, 'B5': 987.77, 'C6': 1046.50
  };
  return notes[note] || 440;
};

class AudioServiceWebAPI {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  // マスターゲイン
  private masterGain: GainNode | null = null;

  // BGM用ゲイン（個別に制御可能）
  private bgmMasterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // 設定
  private _isBgmOn = true;
  private _isSfxOn = true;

  // BGMループ制御
  private bgmLoopInterval: number | null = null;
  private readonly BPM = 150;
  private readonly BEAT_DURATION = 60 / 150; // 0.4秒（四分音符）

  // BGMパターン
  private readonly MELODY_PATTERN = [
    'C5', null, 'E5', 'G5', 'A5', null, 'G5', null,
    'F5', null, 'A5', 'C6', 'B5', null, 'A5', 'G5',
  ];
  private readonly BASS_PATTERN = [
    'C3', 'C3', null, 'C3', 'A2', 'A2', null, 'A2',
    'F2', 'F2', null, 'F2', 'G2', 'G2', null, 'G2',
  ];

  get isBgmOn() { return this._isBgmOn; }
  get isSfxOn() { return this._isSfxOn; }

  async init() {
    if (this.isInitialized) return;

    this.audioContext = new AudioContext();

    // マスターゲイン
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);

    // BGMマスターゲイン
    this.bgmMasterGain = this.audioContext.createGain();
    this.bgmMasterGain.gain.value = 0.3; // BGM全体のボリューム
    this.bgmMasterGain.connect(this.masterGain);

    // SFXゲイン
    this.sfxGain = this.audioContext.createGain();
    this.sfxGain.gain.value = 0.5;
    this.sfxGain.connect(this.masterGain);

    this.isInitialized = true;

    // AudioContextを再開（自動再生ポリシー対策）
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // メロディ音を再生
  private playMelodyNote(freq: number, startTime: number, duration: number) {
    if (!this.audioContext || !this.bgmMasterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    // エンベロープ (attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.4)
    const now = startTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.01); // attack
    gain.gain.linearRampToValueAtTime(0.03, now + 0.11); // decay
    gain.gain.setValueAtTime(0.03, now + duration - 0.4); // sustain
    gain.gain.linearRampToValueAtTime(0, now + duration); // release

    osc.connect(gain);
    gain.connect(this.bgmMasterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // ベース音を再生
  private playBassNote(freq: number, startTime: number, duration: number) {
    if (!this.audioContext || !this.bgmMasterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = freq;

    // エンベロープ (attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.4)
    const now = startTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.21);
    gain.gain.setValueAtTime(0.02, now + duration - 0.4);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(gain);
    gain.connect(this.bgmMasterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // キックドラムを再生
  private playKick(startTime: number) {
    if (!this.audioContext || !this.bgmMasterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';

    // ピッチエンベロープ（100Hz → 30Hz）
    osc.frequency.setValueAtTime(100, startTime);
    osc.frequency.exponentialRampToValueAtTime(30, startTime + 0.15);

    // ゲインエンベロープ (attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4)
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.8, startTime + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
    gain.gain.linearRampToValueAtTime(0.001, startTime + 1.8);

    osc.connect(gain);
    gain.connect(this.bgmMasterGain);

    osc.start(startTime);
    osc.stop(startTime + 1.8);
  }

  // ハイハットを再生（ノイズベース）
  private playHihat(startTime: number) {
    if (!this.audioContext || !this.bgmMasterGain) return;

    const bufferSize = this.audioContext.sampleRate * 0.1;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // ホワイトノイズ生成
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 5000;

    const gain = this.audioContext.createGain();

    // エンベロープ (attack: 0.001, decay: 0.1, release: 0.01)
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.05, startTime + 0.001);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmMasterGain);

    noise.start(startTime);
    noise.stop(startTime + 0.1);
  }

  // BGMループを開始
  private scheduleBGMLoop() {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const loopDuration = this.BEAT_DURATION * 16; // 16拍 = 6.4秒（ベースのループ長）

    // メロディ（8分音符間隔、16ステップ）
    this.MELODY_PATTERN.forEach((note, i) => {
      if (note) {
        const startTime = now + i * this.BEAT_DURATION * 0.5; // 8n = 0.2秒
        this.playMelodyNote(noteToFreq(note), startTime, 0.1); // 16n = 0.1秒
      }
    });

    // メロディの2周目（3.2秒後）
    this.MELODY_PATTERN.forEach((note, i) => {
      if (note) {
        const startTime = now + 3.2 + i * this.BEAT_DURATION * 0.5;
        this.playMelodyNote(noteToFreq(note), startTime, 0.1);
      }
    });

    // ベースライン（四分音符間隔、16ステップ）
    this.BASS_PATTERN.forEach((note, i) => {
      if (note) {
        const startTime = now + i * this.BEAT_DURATION; // 4n = 0.4秒
        this.playBassNote(noteToFreq(note), startTime, 0.2); // 8n = 0.2秒
      }
    });

    // キック（四分音符ごと）
    for (let i = 0; i < 16; i++) {
      const startTime = now + i * this.BEAT_DURATION;
      this.playKick(startTime);
    }

    // ハイハット（四分音符ごと、8nオフセット）
    for (let i = 0; i < 16; i++) {
      const startTime = now + i * this.BEAT_DURATION + 0.2; // 8nオフセット
      this.playHihat(startTime);
    }

    // 次のループをスケジュール（少し早めに次をスケジュール）
    this.bgmLoopInterval = window.setTimeout(() => {
      if (this._isBgmOn) {
        this.scheduleBGMLoop();
      }
    }, loopDuration * 1000 - 100); // 100ms前に次をスケジュール
  }

  playBgm() {
    if (this.isInitialized && this._isBgmOn && !this.bgmLoopInterval) {
      // BGMゲインを有効化
      if (this.bgmMasterGain) {
        this.bgmMasterGain.gain.value = 0.3;
      }
      this.scheduleBGMLoop();
    }
  }

  stopBgm() {
    // ループを停止
    if (this.bgmLoopInterval) {
      clearTimeout(this.bgmLoopInterval);
      this.bgmLoopInterval = null;
    }

    // BGM専用のGainNodeを切断して再作成（スケジュール済みの音をクリア）
    if (this.bgmMasterGain && this.masterGain && this.audioContext) {
      this.bgmMasterGain.disconnect();
      this.bgmMasterGain = this.audioContext.createGain();
      this.bgmMasterGain.gain.value = 0;
      this.bgmMasterGain.connect(this.masterGain);
    }
  }

  toggleBgm(forceState?: boolean) {
    this._isBgmOn = forceState !== undefined ? forceState : !this._isBgmOn;
    if (this._isBgmOn) {
      this.playBgm();
    } else {
      this.stopBgm();
    }
    return this._isBgmOn;
  }

  toggleSfx(forceState?: boolean) {
    this._isSfxOn = forceState !== undefined ? forceState : !this._isSfxOn;
    return this._isSfxOn;
  }

  // SFX効果音
  playClickSound() {
    if (!this.isInitialized || !this._isSfxOn || !this.audioContext || !this.sfxGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'triangle';
    osc.frequency.value = noteToFreq('C5');

    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  playCorrectSound() {
    if (!this.isInitialized || !this._isSfxOn || !this.audioContext || !this.sfxGain) return;

    const notes = ['C5', 'E5', 'G5'];
    const now = this.audioContext.currentTime;

    notes.forEach((note, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'triangle';
      osc.frequency.value = noteToFreq(note);

      const startTime = now + i * 0.1;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  playIncorrectSound() {
    if (!this.isInitialized || !this._isSfxOn || !this.audioContext || !this.sfxGain) return;

    const notes = ['C3', 'D#3']; // 不協和音
    const now = this.audioContext.currentTime;

    notes.forEach(note => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'triangle';
      osc.frequency.value = noteToFreq(note);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  playInvalidActionSound() {
    if (!this.isInitialized || !this._isSfxOn || !this.audioContext || !this.sfxGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'triangle';
    osc.frequency.value = noteToFreq('F2') * 0.5; // 低音

    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  playCountdownSound() {
    if (!this.isInitialized || !this._isSfxOn || !this.audioContext || !this.sfxGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.value = 440; // A4

    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playStartSound() {
    if (!this.isInitialized || !this._isSfxOn || !this.audioContext || !this.sfxGain) return;

    const notes = ['C5', 'E5', 'C6'];
    const now = this.audioContext.currentTime;

    notes.forEach((note, i) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = 'sine';
      osc.frequency.value = noteToFreq(note);

      const startTime = now + i * 0.08;
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }
}

export const audioService = new AudioServiceWebAPI();
