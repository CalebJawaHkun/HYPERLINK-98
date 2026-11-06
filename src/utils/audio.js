// Procedural Web Audio FX & Chiptune Synthesizer Engine (v1.0 Pro)

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.analyzer = null;
    this.muted = false;
    this.volume = 0.5;
    this.currentTrack = null;
    this.isPlayingMusic = false;
    this.musicTimer = null;
    this.trackIndex = 0;
    this.trackerTimer = null;
    this.isTrackerPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.analyzer = this.ctx.createAnalyser();
        this.analyzer.fftSize = 64;
        this.analyzer.smoothingTimeConstant = 0.8;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getAnalyzerData() {
    if (!this.analyzer) return { freq: new Uint8Array(32), time: new Uint8Array(32) };
    const freq = new Uint8Array(this.analyzer.frequencyBinCount);
    const time = new Uint8Array(this.analyzer.fftSize);
    this.analyzer.getByteFrequencyData(freq);
    this.analyzer.getByteTimeDomainData(time);
    return { freq, time };
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      if (this.isPlayingMusic) this.stopMusic();
      if (this.isTrackerPlaying) this.stopCustomTracker();
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
      if (this.analyzer) gain.connect(this.analyzer);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch {}
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
      if (this.analyzer) gain.connect(this.analyzer);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // RETRO 95 ERROR / CHORD DING
  playErrorDing() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [349.23, 440.0, 523.25]; // F4, A4, C5 chord
      freqs.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.1 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        if (this.analyzer) gain.connect(this.analyzer);

        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch {}
  }

  // DIALUP 56K MODEM HANDSHAKE BURST
  playDialup() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
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
          if (this.analyzer) gain.connect(this.analyzer);
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
      if (this.analyzer) gain.connect(this.analyzer);

      osc.start(burstStart);
      osc.stop(burstStart + 1.45);
    } catch {}
  }

  // 1980s 1200 BAUD ACOUSTIC COUPLER MODEM HANDSHAKE (Bell 212A FSK)
  play1200BaudDialup() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Rotary dial pulse clicks (10 clicks)
      for (let i = 0; i < 7; i++) {
        const t = now + i * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, t);
        gain.gain.setValueAtTime(0.09 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.03);
      }

      // Bell 212A 2225Hz Answering tone
      const carrierStart = now + 0.65;
      const carrierOsc = this.ctx.createOscillator();
      const carrierGain = this.ctx.createGain();
      carrierOsc.type = 'sine';
      carrierOsc.frequency.setValueAtTime(2225, carrierStart);
      carrierGain.gain.setValueAtTime(0.14 * this.volume, carrierStart);
      carrierGain.gain.setValueAtTime(0.14 * this.volume, carrierStart + 0.5);
      carrierGain.gain.exponentialRampToValueAtTime(0.001, carrierStart + 0.6);
      carrierOsc.connect(carrierGain);
      carrierGain.connect(this.ctx.destination);
      if (this.analyzer) carrierGain.connect(this.analyzer);
      carrierOsc.start(carrierStart);
      carrierOsc.stop(carrierStart + 0.65);

      // 1200 Baud Phase Shift FSK Warble
      const fskStart = carrierStart + 0.62;
      const fskOsc = this.ctx.createOscillator();
      const fskGain = this.ctx.createGain();
      fskOsc.type = 'triangle';
      fskOsc.frequency.setValueAtTime(1200, fskStart);
      fskOsc.frequency.setValueAtTime(2400, fskStart + 0.15);
      fskOsc.frequency.setValueAtTime(1200, fskStart + 0.3);
      fskOsc.frequency.setValueAtTime(2400, fskStart + 0.45);
      fskOsc.frequency.setValueAtTime(1800, fskStart + 0.6);

      fskGain.gain.setValueAtTime(0.12 * this.volume, fskStart);
      fskGain.gain.linearRampToValueAtTime(0.08 * this.volume, fskStart + 0.6);
      fskGain.gain.exponentialRampToValueAtTime(0.001, fskStart + 0.85);

      fskOsc.connect(fskGain);
      fskGain.connect(this.ctx.destination);
      if (this.analyzer) fskGain.connect(this.analyzer);
      fskOsc.start(fskStart);
      fskOsc.stop(fskStart + 0.9);
    } catch {}
  }

  // COMMODORE 64 SID CHIP FAST ARPEGGIO EFFECT
  playSidArp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const sidNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      const noteDuration = 0.04;

      sidNotes.forEach((freq, idx) => {
        const t = now + idx * noteDuration;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.12 * this.volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + noteDuration * 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        if (this.analyzer) gain.connect(this.analyzer);

        osc.start(t);
        osc.stop(t + noteDuration);
      });
    } catch {}
  }

  // 1980s 5.25" FLOPPY DRIVE STEPPER MOTOR SEEK & CHURN
  playFloppyDrive() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Head seek steps
      for (let i = 0; i < 8; i++) {
        const stepTime = now + i * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(380 + (i % 2) * 120, stepTime);
        gain.gain.setValueAtTime(0.08 * this.volume, stepTime);
        gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.03);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(stepTime);
        osc.stop(stepTime + 0.035);
      }
    } catch {}
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
      if (this.analyzer) gain.connect(this.analyzer);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
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
      if (this.analyzer) gain.connect(this.analyzer);

      noise.start(now);
    } catch {}
  }

  // MINESWEEPER FLAG SOUND
  playFlag() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(780, now + 0.04);

      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // MINESWEEPER TILE REVEAL
  playTileReveal() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      gain.gain.setValueAtTime(0.08 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // MINESWEEPER VICTORY FANFARE
  playVictoryFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.1;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12 * this.volume, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + (idx === notes.length - 1 ? 0.6 : 0.18));

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        if (this.analyzer) gain.connect(this.analyzer);
        osc.start(start);
        osc.stop(start + (idx === notes.length - 1 ? 0.65 : 0.2));
      });
    } catch {}
  }

  // IRC NOTIFICATION CHIME
  playIrcChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1760, now + 0.06);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      if (this.analyzer) gain.connect(this.analyzer);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {}
  }

  // 16-STEP BEAT TRACKER SYNTHESIS
  playTrackerKick(now = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const t = now || this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.15);

    gain.gain.setValueAtTime(0.3 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    if (this.analyzer) gain.connect(this.analyzer);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  playTrackerSnare(now = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const t = now || this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    if (this.analyzer) gain.connect(this.analyzer);
    noise.start(t);
  }

  playTrackerHihat(now = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const t = now || this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(7000, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    if (this.analyzer) gain.connect(this.analyzer);
    noise.start(t);
  }

  playTrackerLead(freq, duration = 0.18, now = null) {
    if (this.muted || !freq) return;
    this.init();
    if (!this.ctx) return;
    const t = now || this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.12 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    if (this.analyzer) gain.connect(this.analyzer);
    osc.start(t);
    osc.stop(t + duration + 0.01);
  }

  playTrackerBass(freq, duration = 0.22, now = null) {
    if (this.muted || !freq) return;
    this.init();
    if (!this.ctx) return;
    const t = now || this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.16 * this.volume, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    if (this.analyzer) gain.connect(this.analyzer);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  // CUSTOM TRACKER SEQUENCER ENGINE
  startCustomTracker(pattern, bpm = 125, onStep = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.stopCustomTracker();
    this.isTrackerPlaying = true;
    let step = 0;
    const stepDuration = 60 / bpm / 4; // 16th notes

    this.trackerTimer = setInterval(() => {
      if (!this.isTrackerPlaying || this.muted || !this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const s = step % 16;

        if (pattern.kick && pattern.kick[s]) this.playTrackerKick(now);
        if (pattern.snare && pattern.snare[s]) this.playTrackerSnare(now);
        if (pattern.hihat && pattern.hihat[s]) this.playTrackerHihat(now);
        if (pattern.bass && pattern.bass[s]) this.playTrackerBass(pattern.bass[s], stepDuration * 1.5, now);
        if (pattern.lead && pattern.lead[s]) this.playTrackerLead(pattern.lead[s], stepDuration * 0.9, now);

        if (onStep) onStep(s);
        step++;
      } catch {}
    }, stepDuration * 1000);
  }

  stopCustomTracker() {
    this.isTrackerPlaying = false;
    if (this.trackerTimer) {
      clearInterval(this.trackerTimer);
      this.trackerTimer = null;
    }
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
    },
    {
      title: "Silicon Alley BBS",
      artist: "ModArchive Pro",
      bpm: 140,
      notes: [
        523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 587.33, 698.46,
        880.0, 1174.66, 880.0, 698.46, 440.0, 523.25, 659.25, 880.0
      ],
      bass: [65.41, 65.41, 73.42, 73.42, 55.0, 55.0, 65.41, 65.41]
    },
    {
      title: "Cyberpunk Neon Drive",
      artist: "Kavinsky 98",
      bpm: 124,
      notes: [
        220.0, 261.63, 329.63, 440.0, 329.63, 261.63, 196.0, 246.94,
        293.66, 392.0, 293.66, 246.94, 174.61, 220.0, 261.63, 349.23
      ],
      bass: [55.0, 55.0, 49.0, 49.0, 43.65, 43.65, 55.0, 55.0]
    },
    {
      title: "Commodore 64 SID Symphony 1985",
      artist: "Rob Hubbard Tribute",
      bpm: 132,
      notes: [
        523.25, 659.25, 783.99, 1046.50, 783.99, 659.25,
        587.33, 698.46, 880.00, 1174.66, 880.00, 698.46,
        659.25, 783.99, 987.77, 1318.51, 987.77, 783.99,
        523.25, 659.25, 783.99, 1046.50, 1318.51, 1046.50
      ],
      bass: [65.41, 130.81, 65.41, 130.81, 73.42, 146.83, 82.41, 164.81]
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
        if (this.analyzer) gainLead.connect(this.analyzer);
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
          if (this.analyzer) gainBass.connect(this.analyzer);
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
          if (this.analyzer) noiseGain.connect(this.analyzer);
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
      } catch {}
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
