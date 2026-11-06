// Web Audio API procedural sound synthesizer for Scam Sleuth Adventure

class SoundEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.8;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public playFootstep() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80 + Math.random() * 20, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // AudioContext unavailable or throttled
    }
  }

  public playInteract() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Ignore
    }
  }

  public playDialogueBlip() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260 + Math.random() * 80, ctx.currentTime);

      gain.gain.setValueAtTime(0.05 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // Ignore
    }
  }

  public playClueFound() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.18 * this.volume, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  public playDecisionPrompt() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(220, ctx.currentTime);
      osc2.frequency.setValueAtTime(330, ctx.currentTime);

      gain.gain.setValueAtTime(0.12 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.42);
      osc2.stop(ctx.currentTime + 0.42);
    } catch {
      // Ignore
    }
  }

  public playSafeSuccess() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const chord = [392.0, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);

        gain.gain.setValueAtTime(0.15 * this.volume, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.7);
      });
    } catch {
      // Ignore
    }
  }

  public playUnsafeAlert() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.setValueAtTime(110, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.25 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch {
      // Ignore
    }
  }

  // Iconic GTA-style Sub-Bass Mission Start "Braam" Hit
  public playGtaMissionStart() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 1.2);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.35 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.35);
    } catch {
      // Ignore
    }
  }

  // Iconic GTA-style "MISSION PASSED" Brass Fanfare
  public playGtaMissionPassed() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      // Powerful triad chords with warm brass tones
      const notes = [
        { f: 196.0, t: 0.0, d: 0.6 },  // G3
        { f: 261.6, t: 0.0, d: 0.6 },  // C4
        { f: 329.6, t: 0.0, d: 0.6 },  // E4
        { f: 392.0, t: 0.25, d: 0.8 }, // G4
        { f: 523.3, t: 0.45, d: 1.6 }, // C5
        { f: 659.3, t: 0.45, d: 1.6 }, // E5
        { f: 783.9, t: 0.45, d: 1.8 }, // G5
        { f: 1046.5, t: 0.45, d: 2.0 }, // C6
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f, ctx.currentTime + n.t);

        gain.gain.setValueAtTime(0.12 * this.volume, ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.t + n.d);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime + n.t);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + n.t);
        osc.stop(ctx.currentTime + n.t + n.d);
      });
    } catch {
      // Ignore
    }
  }

  // GTA Radar Blip Tone
  public playGtaRadarBlip() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {
      // Ignore
    }
  }

  // GTA Menu Hover Tick Sound
  public playGtaMenuHover() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(960, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.08 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // Ignore
    }
  }

  // GTA Menu Select Confirm Punch Sound
  public playGtaMenuSelect() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.22 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // Ignore
    }
  }

  // =========================================================================
  // ATMOSPHERIC SOUNDSCAPE: ROOM TONES, FLUORESCENT HUM, DISTANT CITY RUMBLE
  // =========================================================================
  private ambientMasterGain: GainNode | null = null;
  private humOsc1: OscillatorNode | null = null;
  private humOsc2: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private roomToneNode: AudioBufferSourceNode | null = null;
  private roomToneFilter: BiquadFilterNode | null = null;
  private roomToneGain: GainNode | null = null;
  private isAmbienceActive: boolean = false;
  private ambientVolumeMultiplier: number = 0.65;

  public setAmbientVolume(vol: number) {
    this.ambientVolumeMultiplier = Math.max(0, Math.min(1, vol));
    if (this.ambientMasterGain && this.ctx) {
      this.ambientMasterGain.gain.setTargetAtTime(
        0.18 * this.volume * this.ambientVolumeMultiplier,
        this.ctx.currentTime,
        0.2
      );
    }
  }

  // Start continuous quiet atmospheric soundscape tailored to the setting
  public startAtmosphericAmbience(setting: 'apartment' | 'campus' | 'cafe' | 'office' = 'apartment') {
    if (this.isAmbienceActive) return;
    try {
      const ctx = this.initCtx();
      this.isAmbienceActive = true;

      // Master ambient bus
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.18 * this.volume * this.ambientVolumeMultiplier, ctx.currentTime + 2.0);
      master.connect(ctx.destination);
      this.ambientMasterGain = master;

      // 1. Filtered Room Tone / Air Movement (Pink/Brown noise loop)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.11;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      // Vary filter based on setting (apartment is warm/muffled, campus has fan hiss, cafe has wider air)
      const cutoff = setting === 'campus' ? 380 : setting === 'cafe' ? 440 : setting === 'office' ? 320 : 260;
      noiseFilter.frequency.setValueAtTime(cutoff, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(master);
      noiseSource.start();

      this.roomToneNode = noiseSource;
      this.roomToneFilter = noiseFilter;
      this.roomToneGain = noiseGain;

      // 2. Subtle 60Hz Electrical / Fluorescent Ballast Hum
      const humBase = setting === 'campus' ? 60 : 50; // 60Hz or 50Hz hum
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const humSubGain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(humBase, ctx.currentTime);

      // Subtle second harmonic gives realistic fluorescent ballast character
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(humBase * 2, ctx.currentTime);

      const humLevel = setting === 'campus' ? 0.07 : setting === 'office' ? 0.05 : 0.035;
      humSubGain.gain.setValueAtTime(humLevel, ctx.currentTime);

      osc1.connect(humSubGain);
      osc2.connect(humSubGain);
      humSubGain.connect(master);

      osc1.start();
      osc2.start();

      this.humOsc1 = osc1;
      this.humOsc2 = osc2;
      this.humGain = humSubGain;
    } catch {
      // AudioContext unavailable
    }
  }

  public stopAtmosphericAmbience() {
    if (!this.isAmbienceActive) return;
    try {
      if (this.ambientMasterGain && this.ctx) {
        this.ambientMasterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          this.roomToneNode?.stop();
          this.humOsc1?.stop();
          this.humOsc2?.stop();
          this.roomToneNode = null;
          this.humOsc1 = null;
          this.humOsc2 = null;
          this.ambientMasterGain = null;
          this.isAmbienceActive = false;
        }, 850);
      } else {
        this.isAmbienceActive = false;
      }
    } catch {
      this.isAmbienceActive = false;
    }
  }

  // Authentic tactile phone vibration buzz (two quick buzz-buzz pulses)
  public playTactilePhoneBuzz() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const pulses = [
        { start: now, duration: 0.085 },
        { start: now + 0.145, duration: 0.095 },
      ];

      pulses.forEach((p) => {
        const osc = ctx.createOscillator();
        const sub = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(145, p.start);

        sub.type = 'sine';
        sub.frequency.setValueAtTime(72, p.start);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(220, p.start);

        gain.gain.setValueAtTime(0.24 * this.volume, p.start);
        gain.gain.exponentialRampToValueAtTime(0.001, p.start + p.duration);

        osc.connect(filter);
        sub.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(p.start);
        sub.start(p.start);
        osc.stop(p.start + p.duration + 0.01);
        sub.stop(p.start + p.duration + 0.01);
      });
    } catch {
      // Ignore
    }
  }

  // Quiet, tense atmospheric drone for mystery reveals and high-stakes decision moments
  public playAtmosphericTensionDrone() {
    if (this.volume <= 0) return;
    try {
      const ctx = this.initCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Deep minor second dissonance for psychological suspense
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65.41, ctx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(69.30, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(320, ctx.currentTime + 1.8);
      filter.frequency.linearRampToValueAtTime(120, ctx.currentTime + 3.2);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12 * this.volume, ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 3.3);
      osc2.stop(ctx.currentTime + 3.3);
    } catch {
      // Ignore
    }
  }

  // =========================================================================
  // CHARACTER & INVESTIGATOR DIALOGUE VOICE SYNTHESIS
  // =========================================================================
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private voiceSyllableTimeouts: number[] = [];

  public stopDialogueAudio() {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.activeUtterance = null;
      this.voiceSyllableTimeouts.forEach((id) => window.clearTimeout(id));
      this.voiceSyllableTimeouts = [];
    } catch {
      // Ignore
    }
  }

  public speakDialogueAudio(speaker: string, text: string, onEnd?: () => void) {
    if (this.volume <= 0) return;
    this.stopDialogueAudio();

    const lowerSpeaker = speaker.toLowerCase();
    const isInvestigator =
      lowerSpeaker.includes('investigator') ||
      lowerSpeaker.includes('you') ||
      lowerSpeaker.includes('detective');

    // 1. Web Speech Synthesis API (Full spoken dialogue)
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const cleanText = text
          .replace(/\[Ref:.*?\]/g, '')
          .replace(/https?:\/\/\S+/g, 'link')
          .replace(/GH-[A-Z0-9-]+/g, 'Glasshouse code');

        const utterance = new SpeechSynthesisUtterance(cleanText);

        const voices = window.speechSynthesis.getVoices();
        const enVoices = voices.filter((v) => v.lang.startsWith('en'));

        if (isInvestigator) {
          // Investigator: Grounded, calm, steady detective pitch
          utterance.pitch = 0.88;
          utterance.rate = 1.0;
          if (enVoices.length > 0) {
            const maleVoice = enVoices.find((v) => /male|david|daniel|george|alex/i.test(v.name));
            if (maleVoice) utterance.voice = maleVoice;
          }
        } else {
          // Characters: Distinct pitch and pacing depending on personality
          if (lowerSpeaker.includes('alex')) {
            utterance.pitch = 1.14;
            utterance.rate = 1.08;
          } else if (lowerSpeaker.includes('maya')) {
            utterance.pitch = 1.28;
            utterance.rate = 1.12;
            const femaleVoice = enVoices.find((v) => /female|samantha|victoria|zira|karen/i.test(v.name));
            if (femaleVoice) utterance.voice = femaleVoice;
          } else if (lowerSpeaker.includes('marcus') || lowerSpeaker.includes('arthur')) {
            utterance.pitch = 0.82;
            utterance.rate = 0.98;
          } else if (lowerSpeaker.includes('elena') || lowerSpeaker.includes('dorothy')) {
            utterance.pitch = 1.22;
            utterance.rate = 1.02;
          } else {
            utterance.pitch = 1.08;
            utterance.rate = 1.05;
          }
        }

        utterance.volume = Math.max(0.2, this.volume);
        if (onEnd) {
          utterance.onend = onEnd;
          utterance.onerror = onEnd;
        }

        this.activeUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Fall through to procedural vocal formants
    }

    // 2. Procedural Vocal Formant Bursts (Audible human vocal tract resonance)
    try {
      const ctx = this.initCtx();
      const baseFreq = isInvestigator
        ? 115
        : lowerSpeaker.includes('maya')
        ? 220
        : lowerSpeaker.includes('marcus')
        ? 95
        : 175;

      const words = text.split(' ');
      const syllableCount = Math.min(8, Math.max(3, Math.floor(words.length * 0.7)));

      for (let i = 0; i < syllableCount; i++) {
        const timeoutId = window.setTimeout(() => {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = isInvestigator ? 'sawtooth' : 'triangle';
            const freqJitter = (Math.random() - 0.5) * 18;
            osc.frequency.setValueAtTime(baseFreq + freqJitter, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.88, ctx.currentTime + 0.08);

            filter.type = 'bandpass';
            filter.Q.value = 4.2;
            const formants = isInvestigator ? [450, 750, 1100] : [700, 1200, 1800];
            const chosenFormant = formants[i % formants.length];
            filter.frequency.setValueAtTime(chosenFormant, ctx.currentTime);

            gain.gain.setValueAtTime(0.08 * this.volume, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.09);
          } catch {
            // Ignore
          }
        }, i * 95);
        this.voiceSyllableTimeouts.push(timeoutId);
      }
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
