// This declaration is needed because Tone.js is loaded from a CDN.
declare const Tone: any;

class AudioService {
  private isInitialized = false;
  private bgmSynth: any;
  private sfxSynth: any;
  private kick: any;
  private bass: any;
  private hihat: any;
  private bgmVolume: any;
  private sfxVolume: any;
  
  private _isBgmOn = true;
  private _isSfxOn = true;

  constructor() {
    if (typeof Tone !== 'undefined') {
      // --- Volume Controls ---
      this.bgmVolume = new Tone.Volume(-16).toDestination();
      this.sfxVolume = new Tone.Volume(4).toDestination();

      // --- BGM Instruments ---
      this.bgmSynth = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 3.01,
        modulationIndex: 14,
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.4 },
      }).connect(this.bgmVolume);

      this.bass = new Tone.MonoSynth({
        oscillator: { type: 'fmsquare' },
        filter: { Q: 2, type: 'lowpass', rolloff: -24 },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.4 },
        filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.8, release: 0.5, baseFrequency: 200, octaves: 4 }
      }).connect(new Tone.Volume(-10).toDestination());
      
      this.kick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: 'exponential' },
      }).connect(new Tone.Volume(-6).toDestination());

      this.hihat = new Tone.MetalSynth({
        frequency: 200,
        envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
      }).connect(new Tone.Volume(-18).toDestination());

      // --- SFX Instrument ---
      this.sfxSynth = new Tone.PolySynth(Tone.Synth, {
         oscillator: { type: 'triangle' },
         envelope: { attack: 0.005, decay: 0.1, sustain: 0.1, release: 0.2 },
      }).connect(this.sfxVolume);
      
      // --- BGM Composition ---
      Tone.Transport.bpm.value = 150;

      // Melody
      new Tone.Sequence((time: any, note: string | null) => {
        if (note) this.bgmSynth.triggerAttackRelease(note, '16n', time);
      }, [
        'C5', null, 'E5', 'G5', 'A5', null, 'G5', null,
        'F5', null, 'A5', 'C6', 'B5', null, 'A5', 'G5',
      ], '8n').start(0);

      // Bassline
      new Tone.Sequence((time: any, note: string | null) => {
        if (note) this.bass.triggerAttackRelease(note, '8n', time);
      }, [
        'C3', 'C3', null, 'C3', 'A2', 'A2', null, 'A2',
        'F2', 'F2', null, 'F2', 'G2', 'G2', null, 'G2',
      ], '4n').start(0);
      
      // Kick Drum
      new Tone.Loop((time: any) => {
        this.kick.triggerAttackRelease('C1', '8n', time);
      }, '4n').start(0);

      // Hi-hat
      new Tone.Loop((time: any) => {
        this.hihat.triggerAttackRelease('C4', '16n', time + Tone.Time('8n').toSeconds());
      }, '4n').start(0);
    }
  }

  async init() {
    if (!this.isInitialized && typeof Tone !== 'undefined') {
      await Tone.start();
      this.isInitialized = true;
      console.log('Audio context started');
    }
  }

  playBgm() {
    if (this.isInitialized && this._isBgmOn && Tone.Transport.state !== 'started') {
        Tone.Transport.start();
    }
  }

  stopBgm() {
    if (this.isInitialized && Tone.Transport.state === 'started') {
        Tone.Transport.stop();
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

  playClickSound() {
    if (this.isInitialized && this._isSfxOn) {
        this.sfxSynth.triggerAttackRelease('C5', '16n');
    }
  }

  playCorrectSound() {
    if (this.isInitialized && this._isSfxOn) {
      const now = Tone.now();
      this.sfxSynth.triggerAttackRelease('C5', '16n', now);
      this.sfxSynth.triggerAttackRelease('E5', '16n', now + 0.1);
      this.sfxSynth.triggerAttackRelease('G5', '16n', now + 0.2);
    }
  }
  
  playIncorrectSound() {
    if (this.isInitialized && this._isSfxOn) {
        this.sfxSynth.triggerAttackRelease(['C3', 'D#3'], '8n');
    }
  }

  playInvalidActionSound() {
    if (this.isInitialized && this._isSfxOn) {
        this.sfxSynth.triggerAttackRelease('F#2', '16n');
    }
  }

  playCountdownSound() {
    if (this.isInitialized && this._isSfxOn) {
        const now = Tone.now();
        this.sfxSynth.triggerAttackRelease('A4', '4n', now, 1.5);
    }
  }

  playStartSound() {
    if (this.isInitialized && this._isSfxOn) {
      const now = Tone.now();
      this.sfxSynth.triggerAttackRelease('C5', '8n', now);
      this.sfxSynth.triggerAttackRelease('E5', '8n', now + 0.05);
      this.sfxSynth.triggerAttackRelease('C6', '8n', now + 0.1);
    }
  }

  playFinishSound() {
    if (this.isInitialized && this._isSfxOn) {
      const now = Tone.now();
      this.sfxSynth.triggerAttackRelease('C6', '8n', now);
      this.sfxSynth.triggerAttackRelease('E5', '8n', now + 0.05);
      this.sfxSynth.triggerAttackRelease('C5', '8n', now + 0.1);
    }
  }
}

export const audioService = new AudioService();