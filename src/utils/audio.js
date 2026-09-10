// Procedural Web Audio FX & Chiptune Synthesizer Engine

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.volume = 0.5;
    this.currentTrack = null;
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.trackIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.isPlayingMusic) {
      this.stopMusic();
    }
    return this.muted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  // SNAPPY 90s MOUSE CLICK
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.12 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {
      // Audio context might be restricted
    }
  }

  // WINDOW OPEN / POP SOUND
  playWindowOpen() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // RETRO 95 ERROR / CHORD DING
  playErrorDing() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [349.23, 440.0, 523.25]; // F4, A4, C5 chord
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.1 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch (e) {}
  }

  // DIALUP 56K MODEM HANDSHAKE BURST
  playDialup() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // Dial tones (DTMF tones)
      const dtmfFreqs = [
        [697, 1209], [770, 1336], [852, 1477], [941, 1336], [697, 1477]
      ];

      dtmfFreqs.forEach((pair, i) => {
        const startTime = now + i * 0.12;
        pair.forEach(freq => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.12 * this.volume, startTime);
          gain.gain.setValueAtTime(0.001, startTime + 0.09);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.1);
        });
      });

      // Noise Burst & Negotiate Squeal
      const burstStart = now + 0.65;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2100, burstStart);
      osc.frequency.linearRampToValueAtTime(1400, burstStart + 0.4);
      osc.frequency.linearRampToValueAtTime(2800, burstStart + 0.8);
      osc.frequency.linearRampToValueAtTime(980, burstStart + 1.2);

      gain.gain.setValueAtTime(0.18 * this.volume, burstStart);
      gain.gain.linearRampToValueAtTime(0.08 * this.volume, burstStart + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, burstStart + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(burstStart);
      osc.stop(burstStart + 1.45);
    } catch (e) {}
  }

  // ARCADE LASER SOUND
  playLaser() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  // ARCADE EXPLOSION NOISE
  playExplosion() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.2);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
    } catch (e) {}
  }

  // PROCEDURAL 90s CHIPTUNE PLAYLIST
  tracks = [
    {
      title: "Cyberspace Drift '98",
      artist: "DJ Modulator",
      bpm: 128,
      notes: [
        261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 349.23,
        440.0, 587.33, 440.0, 349.23, 329.63, 392.0, 493.88, 659.25,
        587.33, 493.88, 392.0, 329.63, 261.63, 329.63, 392.0, 523.25
      ],
      bass: [130.81, 130.81, 146.83, 146.83, 164.81, 164.81, 130.81, 130.81]
    },
    {
      title: "Neon Highway 56k",
      artist: "Silicon Dreams",
      bpm: 135,
      notes: [
        440.0, 523.25, 659.25, 523.25, 783.99, 659.25, 523.25, 440.0,
        349.23, 440.0, 523.25, 440.0, 659.25, 523.25, 440.0, 349.23,
        392.0, 493.88, 587.33, 493.88, 698.46, 587.33, 493.88, 392.0
      ],
      bass: [110.0, 110.0, 87.31, 87.31, 98.0, 98.0, 110.0, 110.0]
    },
    {
      title: "Geocities Under Midnight",
      artist: "Pixel Master 99",
      bpm: 120,
      notes: [
        329.63, 392.0, 440.0, 493.88, 587.33, 493.88, 440.0, 392.0,
        349.23, 440.0, 523.25, 587.33, 659.25, 587.33, 523.25, 440.0,
        293.66, 349.23, 440.0, 493.88, 523.25, 493.88, 440.0, 349.23
      ],
      bass: [82.41, 82.41, 87.31, 87.31, 73.42, 73.42, 82.41, 82.41]
    }
  ];

  startMusic(trackIdx = 0, onStepCallback = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.stopMusic();
    this.isPlayingMusic = true;
    this.trackIndex = trackIdx % this.tracks.length;
    const track = this.tracks[this.trackIndex];

    let noteStep = 0;
    let bassStep = 0;
    const stepDuration = 60 / track.bpm / 2; // 16th notes

    this.musicTimer = setInterval(() => {
      if (!this.isPlayingMusic || this.muted || !this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        
        // Lead melody chiptune pulse
        const leadFreq = track.notes[noteStep % track.notes.length];
        const oscLead = this.ctx.createOscillator();
        const gainLead = this.ctx.createGain();
        oscLead.type = 'square';
        oscLead.frequency.setValueAtTime(leadFreq, now);

        gainLead.gain.setValueAtTime(0.07 * this.volume, now);
        gainLead.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.85);

        oscLead.connect(gainLead);
        gainLead.connect(this.ctx.destination);
        oscLead.start(now);
        oscLead.stop(now + stepDuration);

        // Bassline triangle
        if (noteStep % 2 === 0) {
          const bassFreq = track.bass[bassStep % track.bass.length];
          const oscBass = this.ctx.createOscillator();
          const gainBass = this.ctx.createGain();
          oscBass.type = 'triangle';
          oscBass.frequency.setValueAtTime(bassFreq, now);

          gainBass.gain.setValueAtTime(0.12 * this.volume, now);
          gainBass.gain.exponentialRampToValueAtTime(0.01, now + stepDuration * 1.8);

          oscBass.connect(gainBass);
          gainBass.connect(this.ctx.destination);
          oscBass.start(now);
          oscBass.stop(now + stepDuration * 2);
          bassStep++;
        }

        // 8-bit Noise Hi-Hat & Snare
        if (noteStep % 2 === 1) {
          const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime((noteStep % 4 === 2 ? 0.08 : 0.03) * this.volume, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          noise.connect(noiseGain);
          noiseGain.connect(this.ctx.destination);
          noise.start(now);
        }

        if (onStepCallback) {
          onStepCallback({
            step: noteStep,
            note: leadFreq,
            track: track
          });
        }

        noteStep++;
      } catch (e) {}
    }, stepDuration * 1000);
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  getCurrentTrack() {
    return this.tracks[this.trackIndex];
  }
}

export const soundManager = new SoundSystem();
