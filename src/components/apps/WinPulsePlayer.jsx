import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';

const TRACKER_PRESETS = {
  cyberpunk: {
    name: 'Cyberpunk 1998',
    bpm: 130,
    kick:  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    bass:  [110, 0, 110, 0, 87.3, 0, 87.3, 0, 98, 0, 98, 0, 110, 0, 130.8, 0],
    lead:  [440, 0, 523.2, 0, 659.2, 0, 523.2, 0, 783.9, 0, 659.2, 0, 523.2, 0, 440, 0],
  },
  dungeon: {
    name: '8-Bit Dungeon',
    bpm: 115,
    kick:  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    hihat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    bass:  [130.8, 0, 0, 0, 146.8, 0, 0, 0, 164.8, 0, 0, 0, 130.8, 0, 0, 0],
    lead:  [261.6, 329.6, 392, 523.2, 392, 329.6, 293.6, 349.2, 440, 587.3, 440, 349.2, 329.6, 392, 493.8, 659.2],
  },
  techno: {
    name: '56k Techno Rush',
    bpm: 140,
    kick:  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    bass:  [65.4, 65.4, 65.4, 65.4, 73.4, 73.4, 73.4, 73.4, 55, 55, 55, 55, 65.4, 65.4, 65.4, 65.4],
    lead:  [523.2, 0, 659.2, 0, 783.9, 0, 1046.5, 0, 880, 0, 1174.6, 0, 880, 0, 659.2, 0],
  },
};

export default function WinPulsePlayer() {
  const [activeTab, setActiveTab] = useState('player'); // player or tracker
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [activeNote, setActiveNote] = useState(null);
  const [visualizerMode, setVisualizerMode] = useState('bars'); // bars, waveform, starfield

  // Tracker state
  const [trackerPlaying, setTrackerPlaying] = useState(false);
  const [trackerStep, setTrackerStep] = useState(0);
  const [trackerBpm, setTrackerBpm] = useState(130);
  const [pattern, setPattern] = useState(TRACKER_PRESETS.cyberpunk);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const tracks = soundManager.tracks;
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Visualizer Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const numBars = 18;
    const barWidth = canvas.width / numBars;
    const heights = new Array(numBars).fill(4);
    const peaks = new Array(numBars).fill(4);

    let angle = 0;

    const render = () => {
      ctx.fillStyle = '#0a0a12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const isLive = isPlaying || trackerPlaying;
      const audioData = soundManager.getAnalyzerData();

      if (visualizerMode === 'bars') {
        // Spectrum LED Bars
        for (let i = 0; i < numBars; i++) {
          let target = 4;
          if (isLive) {
            const freqVal = audioData.freq[i] || Math.random() * 200;
            target = (freqVal / 255) * (canvas.height - 6) + 4;
          }
          heights[i] += (target - heights[i]) * 0.4;
          if (heights[i] > peaks[i]) peaks[i] = heights[i];
          else peaks[i] = Math.max(0, peaks[i] - 0.6);

          const x = i * barWidth;
          const h = heights[i];

          // Segmented LED look
          for (let y = canvas.height - 2; y > canvas.height - h; y -= 3) {
            if (y < 10) ctx.fillStyle = '#ff2222';
            else if (y < 24) ctx.fillStyle = '#ffee00';
            else ctx.fillStyle = '#00ff44';
            ctx.fillRect(x + 1, y - 2, barWidth - 2, 2);
          }

          // Peak cap line
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x + 1, canvas.height - peaks[i] - 1, barWidth - 2, 1.5);
        }
      } else if (visualizerMode === 'waveform') {
        // Oscilloscope Waveform Line
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const sliceWidth = canvas.width / 32;
        let x = 0;
        for (let i = 0; i < 32; i++) {
          const v = isLive ? (audioData.time[i] || 128) / 128.0 : 1.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (visualizerMode === 'starfield') {
        // Starfield Warp Tunnel
        angle += isLive ? 0.08 : 0.02;
        ctx.fillStyle = '#ffffff';
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < 30; i++) {
          const dist = ((i * 12 + angle * 40) % 150) + 1;
          const starAngle = i * (Math.PI / 15) + angle * 0.2;
          const sx = centerX + Math.cos(starAngle) * dist;
          const sy = centerY + Math.sin(starAngle) * dist;
          const sz = (dist / 150) * 3 + 1;

          ctx.fillStyle = i % 2 === 0 ? '#ff007f' : '#00ffff';
          ctx.fillRect(sx, sy, sz, sz);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, trackerPlaying, visualizerMode]);

  // Handle Music Playback
  const handlePlay = () => {
    soundManager.playClick();
    if (trackerPlaying) {
      soundManager.stopCustomTracker();
      setTrackerPlaying(false);
    }

    if (!isPlaying) {
      soundManager.startMusic(currentTrackIndex, (info) => {
        setActiveNote(Math.round(info.note));
      });
      setIsPlaying(true);
    } else {
      soundManager.stopMusic();
      setIsPlaying(false);
      setActiveNote(null);
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    const nextIdx = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIdx);
    if (isPlaying) soundManager.startMusic(nextIdx);
  };

  const handlePrev = () => {
    soundManager.playClick();
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIdx);
    if (isPlaying) soundManager.startMusic(prevIdx);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundManager.setVolume(val);
  };

  // Timer counter
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedSecs((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Tracker Play / Stop
  const handleToggleTracker = () => {
    soundManager.playClick();
    if (isPlaying) {
      soundManager.stopMusic();
      setIsPlaying(false);
    }

    if (!trackerPlaying) {
      soundManager.startCustomTracker(pattern, trackerBpm, (step) => {
        setTrackerStep(step);
      });
      setTrackerPlaying(true);
    } else {
      soundManager.stopCustomTracker();
      setTrackerPlaying(false);
      setTrackerStep(0);
    }
  };

  const toggleTrackerCell = (trackName, stepIndex) => {
    soundManager.playClick();
    setPattern((prev) => {
      const arr = [...prev[trackName]];
      if (trackName === 'kick' || trackName === 'snare' || trackName === 'hihat') {
        arr[stepIndex] = arr[stepIndex] ? 0 : 1;
      } else if (trackName === 'bass') {
        arr[stepIndex] = arr[stepIndex] ? 0 : 110;
      } else if (trackName === 'lead') {
        arr[stepIndex] = arr[stepIndex] ? 0 : 440;
      }
      return { ...prev, [trackName]: arr };
    });
  };

  const mins = Math.floor(elapsedSecs / 60);
  const secs = elapsedSecs % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-full bg-[#1e1f29] text-white p-2 font-mono select-none overflow-y-auto">
      {/* Top Header Mode Tabs */}
      <div className="flex items-center gap-1 mb-2 border-b border-gray-700 pb-1">
        <button
          type="button"
          onClick={() => { soundManager.playClick(); setActiveTab('player'); }}
          className={`bevel-button px-3 py-1 text-xs font-bold ${
            activeTab === 'player' ? 'active bg-blue-700 text-white' : 'bg-gray-800 text-gray-300'
          }`}
        >
          📻 WinPulse Player
        </button>
        <button
          type="button"
          onClick={() => { soundManager.playClick(); setActiveTab('tracker'); }}
          className={`bevel-button px-3 py-1 text-xs font-bold flex items-center gap-1 ${
            activeTab === 'tracker' ? 'active bg-purple-700 text-cyan-200' : 'bg-gray-800 text-gray-300'
          }`}
        >
          <span>🎹</span>
          <span>16-Step Beat Tracker</span>
        </button>
      </div>

      {activeTab === 'player' ? (
        <>
          {/* Main Player Chassis */}
          <div className="bevel-raised p-2 bg-[#2a2b3d] mb-2">
            {/* Title Bar Display */}
            <div className="bevel-sunken bg-black p-2 mb-2 flex items-center justify-between border border-cyan-500/40">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-yellow-400 font-pixel text-[10px] animate-pulse">WINPULSE</span>
                <span className="text-cyan-300 font-bold text-xs truncate">
                  {currentTrack.title} — {currentTrack.artist}
                </span>
              </div>
              <div className="text-pink-400 text-xs font-bold shrink-0 ml-2">
                {currentTrack.bpm} BPM
              </div>
            </div>

            {/* LED Time & Visualizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {/* LED Timer Display */}
              <div className="bevel-sunken bg-black p-2 flex flex-col justify-center items-center">
                <div className="flex items-center justify-between w-full text-[10px] text-gray-400 font-pixel px-1">
                  <span>TRACK TIME</span>
                  <div className="flex gap-1">
                    {['bars', 'waveform', 'starfield'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { soundManager.playClick(); setVisualizerMode(m); }}
                        className={`px-1 py-0.5 uppercase text-[8px] border ${
                          visualizerMode === m ? 'border-cyan-400 text-cyan-300 bg-blue-950' : 'border-gray-800 text-gray-500'
                        }`}
                      >
                        {m === 'bars' ? 'EQ' : m === 'waveform' ? 'OSC' : '3D'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="led-counter text-3xl font-bold font-mono tracking-widest text-emerald-400 text-shadow-[0_0_8px_#10b981] my-1">
                  {timeFormatted}
                </div>
                <div className="text-[10px] text-gray-400">
                  {isPlaying ? `FREQ: ${activeNote || 440} Hz` : 'STOPPED'}
                </div>
              </div>

              {/* Canvas Spectrum Analyzer */}
              <div className="bevel-sunken bg-black p-1 flex items-center justify-center min-h-[70px]">
                <canvas
                  ref={canvasRef}
                  width={180}
                  height={70}
                  className="w-full h-full bg-black block"
                />
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-700 pt-2">
              {/* Transport buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bevel-button px-2.5 py-1 text-xs font-bold"
                  title="Previous Track"
                >
                  ⏮️ Prev
                </button>
                <button
                  type="button"
                  onClick={handlePlay}
                  className={`bevel-button px-3 py-1 text-xs font-bold ${
                    isPlaying ? 'bg-amber-600 text-white active' : 'bg-green-700 text-white'
                  }`}
                >
                  {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    soundManager.stopMusic();
                    setIsPlaying(false);
                    setElapsedSecs(0);
                  }}
                  className="bevel-button px-2.5 py-1 text-xs font-bold"
                  title="Stop"
                >
                  ⏹️ Stop
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bevel-button px-2.5 py-1 text-xs font-bold"
                  title="Next Track"
                >
                  Next ⏭️
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-1 text-xs">
                <span>🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-cyan-400 cursor-pointer"
                />
                <span className="text-[10px] w-6">{Math.round(volume * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Track Playlist Window */}
          <div className="bevel-sunken p-2 bg-black flex-1 flex flex-col min-h-[140px]">
            <div className="text-[11px] font-bold text-gray-400 border-b border-gray-800 pb-1 mb-1.5 flex justify-between font-pixel text-[9px]">
              <span>TRACKLIST (PROCEDURAL CHIPTUNES)</span>
              <span className="text-cyan-400">{tracks.length} TRACKS</span>
            </div>

            <div className="space-y-1 flex-1 overflow-y-auto">
              {tracks.map((t, idx) => {
                const isSelected = idx === currentTrackIndex;
                return (
                  <div
                    key={t.title}
                    onClick={() => {
                      soundManager.playClick();
                      setCurrentTrackIndex(idx);
                      if (isPlaying) soundManager.startMusic(idx);
                    }}
                    className={`p-1.5 text-xs flex items-center justify-between cursor-pointer rounded-none font-mono ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-yellow-300 font-bold border border-cyan-400'
                        : 'hover:bg-gray-900 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{isSelected && isPlaying ? '🔊' : `${idx + 1}.`}</span>
                      <span>{t.title}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">{t.artist}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        /* 16-Step Beat Tracker Tab */
        <div className="flex flex-col flex-1 gap-2">
          {/* Tracker Toolbar */}
          <div className="bevel-raised p-2 bg-[#2a2b3d] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleTracker}
                className={`bevel-button px-4 py-1 text-xs font-bold font-pixel text-[10px] ${
                  trackerPlaying ? 'bg-amber-600 text-white active' : 'bg-emerald-700 text-white'
                }`}
              >
                {trackerPlaying ? '⏹️ STOP LOOP' : '▶️ PLAY BEAT'}
              </button>

              <div className="flex items-center gap-1 text-xs">
                <span>BPM:</span>
                <input
                  type="number"
                  min="80"
                  max="180"
                  value={trackerBpm}
                  onChange={(e) => setTrackerBpm(Number(e.target.value))}
                  className="w-14 bg-black text-lime-400 font-mono text-xs px-1 border border-gray-600"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[11px] opacity-75">Preset:</span>
              {Object.keys(TRACKER_PRESETS).map((pKey) => (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setPattern(TRACKER_PRESETS[pKey]);
                    setTrackerBpm(TRACKER_PRESETS[pKey].bpm);
                  }}
                  className="bevel-button px-2 py-0.5 text-[10px] capitalize"
                >
                  {TRACKER_PRESETS[pKey].name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive 16-Step Grid */}
          <div className="bevel-sunken p-2 bg-black flex-1 overflow-x-auto">
            <div className="min-w-[460px] space-y-2">
              {/* Step indicator header */}
              <div className="flex items-center gap-1 text-[9px] font-mono text-gray-500 pl-20">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 text-center font-bold ${
                      trackerStep === i && trackerPlaying ? 'text-yellow-300 scale-125' : ''
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Channels */}
              {[
                { key: 'kick', label: '💥 Kick', color: 'bg-red-600' },
                { key: 'snare', label: '🥁 Snare', color: 'bg-amber-500' },
                { key: 'hihat', label: '🎩 Hi-Hat', color: 'bg-cyan-400' },
                { key: 'bass', label: '🎸 Bass', color: 'bg-emerald-500' },
                { key: 'lead', label: '🎹 Lead', color: 'bg-purple-500' },
              ].map((channel) => (
                <div key={channel.key} className="flex items-center gap-1">
                  <div className="w-20 text-[11px] font-bold text-gray-300 truncate">
                    {channel.label}
                  </div>

                  <div className="flex-1 flex gap-1">
                    {Array.from({ length: 16 }).map((_, stepIdx) => {
                      const isActive = Boolean(pattern[channel.key]?.[stepIdx]);
                      const isCurrent = trackerStep === stepIdx && trackerPlaying;

                      return (
                        <button
                          key={stepIdx}
                          type="button"
                          onClick={() => toggleTrackerCell(channel.key, stepIdx)}
                          className={`flex-1 h-6 rounded-none bevel-button transition-colors ${
                            isActive
                              ? channel.color
                              : stepIdx % 4 === 0
                              ? 'bg-gray-800'
                              : 'bg-gray-900'
                          } ${isCurrent ? 'ring-2 ring-white z-10' : ''}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
