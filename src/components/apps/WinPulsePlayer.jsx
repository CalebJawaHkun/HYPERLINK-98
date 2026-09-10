import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';

export default function WinPulsePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [activeNote, setActiveNote] = useState(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const tracks = soundManager.tracks;
  const currentTrack = tracks[currentTrackIndex];

  // Visualizer Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const numBars = 16;
    const barWidth = canvas.width / numBars;
    const heights = new Array(numBars).fill(4);
    const peaks = new Array(numBars).fill(4);

    const render = () => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < numBars; i++) {
        if (isPlaying) {
          // Dynamic bars based on playing state
          const target = Math.random() * (canvas.height - 8) + 4;
          heights[i] += (target - heights[i]) * 0.35;
        } else {
          heights[i] += (2 - heights[i]) * 0.1;
        }

        if (heights[i] > peaks[i]) {
          peaks[i] = heights[i];
        } else {
          peaks[i] = Math.max(0, peaks[i] - 0.5);
        }

        const x = i * barWidth;
        const h = heights[i];

        // Draw segmented LED bar (Green -> Yellow -> Red)
        for (let y = canvas.height - 2; y > canvas.height - h; y -= 3) {
          if (y < 8) ctx.fillStyle = '#ff2222';
          else if (y < 20) ctx.fillStyle = '#ffee00';
          else ctx.fillStyle = '#00ff44';

          ctx.fillRect(x + 1, y - 2, barWidth - 2, 2);
        }

        // Draw falling peak line
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 1, canvas.height - peaks[i] - 1, barWidth - 2, 1.5);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Handle Play / Stop
  const handlePlay = () => {
    soundManager.playClick();
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
    if (isPlaying) {
      soundManager.startMusic(nextIdx);
    }
  };

  const handlePrev = () => {
    soundManager.playClick();
    const prevIdx = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIdx);
    if (isPlaying) {
      soundManager.startMusic(prevIdx);
    }
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

  const mins = Math.floor(elapsedSecs / 60);
  const secs = elapsedSecs % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-full bg-[#1e1f29] text-white p-2 font-mono select-none overflow-y-auto">
      {/* Top Main Chassis */}
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

        {/* LED Time & Frequency Visualizer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {/* LED Timer Display */}
          <div className="bevel-sunken bg-black p-2 flex flex-col justify-center items-center">
            <span className="text-[10px] text-gray-400 uppercase font-pixel tracking-widest">
              TRACK TIME
            </span>
            <div className="led-counter text-3xl font-bold font-mono tracking-widest text-emerald-400 text-shadow-[0_0_8px_#10b981]">
              {timeFormatted}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              {isPlaying ? `FREQ: ${activeNote || 440} Hz` : 'STOPPED'}
            </div>
          </div>

          {/* Canvas Spectrum Analyzer */}
          <div className="bevel-sunken bg-black p-1 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={160}
              height={60}
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
      <div className="bevel-sunken p-2 bg-black flex-1 flex flex-col">
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
    </div>
  );
}
