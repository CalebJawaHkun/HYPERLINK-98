import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';
import { THEMES } from '../utils/themes';

export default function Taskbar({
  windows,
  activeWindowId,
  onToggleWindow,
  onOpenWindow,
  theme,
  setTheme,
  crtEnabled,
  setCrtEnabled,
  soundMuted,
  setSoundMuted,
  onTriggerShutdown,
}) {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const [txBlink, setTxBlink] = useState(false);
  const startMenuRef = useRef(null);

  // Live System Tray Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Flashing Modem Lights
  useEffect(() => {
    const modemTimer = setInterval(() => {
      setTxBlink((prev) => !prev);
    }, 700);
    return () => clearInterval(modemTimer);
  }, []);

  // Click outside to close Start Menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (startMenuRef.current && !startMenuRef.current.contains(e.target)) {
        setStartMenuOpen(false);
      }
    };
    if (startMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [startMenuOpen]);

  const handleStartToggle = () => {
    soundManager.playClick();
    setStartMenuOpen(!startMenuOpen);
  };

  const handleAppLaunch = (appId) => {
    soundManager.playClick();
    setStartMenuOpen(false);
    onOpenWindow(appId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bevel-raised bg-[var(--btn-face)] z-50 flex items-center justify-between px-1.5 select-none text-xs">
      {/* Left: Start Button & Active Windows */}
      <div className="flex items-center gap-1.5 h-full py-0.5 overflow-x-auto">
        {/* Start Button */}
        <div className="relative shrink-0" ref={startMenuRef}>
          <button
            type="button"
            onClick={handleStartToggle}
            className={`bevel-button h-8 px-2.5 flex items-center gap-1.5 font-bold text-xs tracking-wider ${
              startMenuOpen ? 'active' : ''
            }`}
          >
            <span className="text-base">🪟</span>
            <span className="font-pixel text-[11px] text-black">Start</span>
          </button>

          {/* Start Menu Dropdown */}
          {startMenuOpen && (
            <div className="absolute bottom-10 left-0 w-64 bevel-raised bg-[var(--btn-face)] text-[var(--text-main)] shadow-2xl z-50 flex">
              {/* Left Side Banner */}
              <div className="w-8 bg-gradient-to-t from-[#000080] via-[#1084d0] to-[#000040] flex items-end justify-center pb-3 text-white font-bold tracking-widest">
                <span
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  className="font-pixel text-[11px] text-cyan-200"
                >
                  HYPERLINK '98
                </span>
              </div>

              {/* Menu List */}
              <div className="flex-1 py-1.5 px-1 flex flex-col gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleAppLaunch('web-explorer')}
                  className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-left rounded-none w-full"
                >
                  <span className="text-lg">🌐</span>
                  <div>
                    <div className="font-bold">Web Explorer '98</div>
                    <div className="text-[10px] opacity-75">Cyberspace Portal & Webring</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAppLaunch('win-pulse')}
                  className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-left rounded-none w-full"
                >
                  <span className="text-lg">📻</span>
                  <div>
                    <div className="font-bold">WinPulse '98 Media</div>
                    <div className="text-[10px] opacity-75">Chiptune & Visualizer</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAppLaunch('arcade')}
                  className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-left rounded-none w-full"
                >
                  <span className="text-lg">👾</span>
                  <div>
                    <div className="font-bold">Cyber Invaders Arcade</div>
                    <div className="text-[10px] opacity-75">8-Bit Space Minigame</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAppLaunch('terminal')}
                  className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-left rounded-none w-full"
                >
                  <span className="text-lg">💻</span>
                  <div>
                    <div className="font-bold">BBS Cyber-Terminal</div>
                    <div className="text-[10px] opacity-75">VT100 MS-DOS Shell</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAppLaunch('pixel-paint')}
                  className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-left rounded-none w-full"
                >
                  <span className="text-lg">🎨</span>
                  <div>
                    <div className="font-bold">PixelPaint '98</div>
                    <div className="text-[10px] opacity-75">Retro Canvas Studio</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAppLaunch('readme')}
                  className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-[#000080] hover:text-white text-left rounded-none w-full"
                >
                  <span className="text-lg">📖</span>
                  <div>
                    <div className="font-bold">Cyberspace Guide</div>
                    <div className="text-[10px] opacity-75">README.TXT</div>
                  </div>
                </button>

                <div className="h-[1px] bg-gray-400 my-1 mx-1"></div>

                <button
                  type="button"
                  onClick={() => {
                    setStartMenuOpen(false);
                    onTriggerShutdown();
                  }}
                  className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-red-700 hover:text-white text-left rounded-none w-full font-bold"
                >
                  <span className="text-lg">🔌</span>
                  <span>Shut Down Cyberspace...</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="w-[2px] h-6 bg-gray-400 mx-1 shrink-0"></div>

        {/* Window Tabs in Taskbar */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50vw]">
          {windows.map((win) => {
            const isCurrentActive = win.isOpen && !win.isMinimized && activeWindowId === win.id;
            return (
              <button
                key={win.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onToggleWindow(win.id);
                }}
                className={`bevel-button h-8 px-2 min-w-[110px] max-w-[160px] truncate flex items-center gap-1.5 text-xs ${
                  isCurrentActive ? 'active font-bold' : 'opacity-85'
                }`}
                title={win.title}
              >
                <span>{win.icon}</span>
                <span className="truncate">{win.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: System Tray */}
      <div className="flex items-center gap-2 shrink-0 bevel-sunken px-2 py-1 h-7">
        {/* Theme Picker Dropdown */}
        <div className="flex items-center gap-1">
          <label htmlFor="theme-select" className="text-[11px] hidden sm:inline opacity-80">
            Theme:
          </label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => {
              soundManager.playClick();
              setTheme(e.target.value);
            }}
            className="text-[11px] bg-[var(--btn-face)] text-[var(--text-main)] border border-gray-500 px-1 py-0.5 cursor-pointer outline-none"
          >
            {THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.icon} {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* CRT Scanline Toggle */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setCrtEnabled(!crtEnabled);
          }}
          className={`px-1.5 py-0.5 text-[10px] font-pixel border ${
            crtEnabled
              ? 'bg-green-700 text-white border-green-400'
              : 'bg-gray-700 text-gray-400 border-gray-600'
          }`}
          title="Toggle CRT Screen Scanlines"
        >
          CRT
        </button>

        {/* Master Sound FX Toggle */}
        <button
          type="button"
          onClick={() => {
            const isMuted = soundManager.toggleMute();
            setSoundMuted(isMuted);
          }}
          className="text-sm cursor-pointer hover:scale-110 transition-transform"
          title={soundMuted ? 'Unmute Audio & Chiptunes' : 'Mute Audio'}
        >
          {soundMuted ? '🔇' : '🔊'}
        </button>

        {/* 56k Modem Blinkers */}
        <div className="flex items-center gap-1 text-[9px] font-mono font-bold">
          <span className="hidden md:inline">56K</span>
          <span
            className={`w-2 h-2 rounded-full ${
              txBlink ? 'bg-green-400 shadow-[0_0_5px_#22c55e]' : 'bg-green-950'
            }`}
            title="Modem TX Indicator"
          />
          <span
            className={`w-2 h-2 rounded-full ${
              !txBlink ? 'bg-amber-400 shadow-[0_0_5px_#f59e0b]' : 'bg-amber-950'
            }`}
            title="Modem RX Indicator"
          />
        </div>

        {/* Digital Clock */}
        <div className="font-mono font-bold text-xs pl-1 tracking-wider">{time || '12:00:00'}</div>
      </div>
    </div>
  );
}
