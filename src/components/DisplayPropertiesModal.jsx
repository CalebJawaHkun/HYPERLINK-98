import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { THEMES } from '../utils/themes';

export const WALLPAPERS = [
  { id: 'default', name: 'Default (Theme Color)', bg: 'var(--bg-desktop)', pattern: 'var(--desktop-pattern)' },
  { id: 'teal-solid', name: 'Windows Classic Teal', bg: '#008080', pattern: 'radial-gradient(#006666 15%, transparent 16%)' },
  { id: 'cyber-grid', name: 'GeoCities Neon Grid', bg: '#08091a', pattern: 'linear-gradient(to right, rgba(255, 0, 127, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 255, 0.15) 1px, transparent 1px)' },
  { id: 'starfield', name: 'Deep Space Starfield', bg: '#030308', pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 20% 30%, rgba(0,255,255,0.8) 1.5px, transparent 1.5px)' },
  { id: 'matrix-rain', name: 'Matrix Phosphor Dark', bg: '#010903', pattern: 'radial-gradient(#005511 20%, transparent 20%)' },
  { id: 'sunset-neon', name: "Synthwave Sunset '98", bg: 'linear-gradient(180deg, #1b053a 0%, #4a0e4e 50%, #8b0068 85%, #ff7700 100%)', pattern: 'none' },
];

export default function DisplayPropertiesModal({
  isOpen,
  onClose,
  currentWallpaper,
  setWallpaper,
  theme,
  setTheme,
  crtEnabled,
  setCrtEnabled,
  soundMuted,
  setSoundMuted,
}) {
  const [activeTab, setActiveTab] = useState('background');
  const [selectedWp, setSelectedWp] = useState(currentWallpaper || 'default');
  const [volumeVal, setVolumeVal] = useState(soundManager.volume);

  if (!isOpen) return null;

  const handleApply = () => {
    soundManager.playClick();
    setWallpaper(selectedWp);
    localStorage.setItem('hyperlink98_wallpaper', selectedWp);
  };

  const handleOk = () => {
    handleApply();
    onClose();
  };

  const activeWallpaperObj = WALLPAPERS.find(w => w.id === selectedWp) || WALLPAPERS[0];

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-black/50 p-3">
      <div className="bevel-raised w-full max-w-lg bg-[var(--btn-face)] text-[var(--text-main)] shadow-2xl flex flex-col text-xs font-sans select-none">
        {/* Title bar */}
        <div className="flex items-center justify-between px-2 py-1 bg-[var(--titlebar-active)] text-[var(--titlebar-active-text)] font-bold text-xs">
          <div className="flex items-center gap-1.5">
            <span>🖼️</span>
            <span className="font-pixel text-[11px]">Display Properties</span>
          </div>
          <button
            type="button"
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="bevel-button w-5 h-5 flex items-center justify-center font-bold text-xs bg-[#c0c0c0] text-black hover:bg-red-600 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex items-center gap-1 px-2 pt-2 border-b border-gray-400 bg-[var(--btn-face)]">
          {[
            { id: 'background', label: 'Background' },
            { id: 'themes', label: 'Themes & Audio' },
            { id: 'screensaver', label: 'Screen Saver' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { soundManager.playClick(); setActiveTab(tab.id); }}
              className={`px-3 py-1 text-xs font-bold border-t border-l border-r border-gray-600 rounded-t-sm ${
                activeTab === tab.id ? 'bg-[var(--window-bg)] -mb-[1px] pb-1.5 font-black border-b-transparent' : 'bg-gray-300 text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-3 bg-[var(--window-bg)] flex-1 min-h-[300px] flex flex-col justify-between">
          {activeTab === 'background' && (
            <div className="space-y-3">
              {/* Monitor Preview Frame */}
              <div className="flex justify-center">
                <div className="relative w-44 h-32 bg-[#222] border-4 border-[#555] rounded-t-lg shadow-inner flex items-center justify-center p-2">
                  <div
                    style={{
                      background: activeWallpaperObj.bg,
                      backgroundImage: activeWallpaperObj.pattern !== 'none' ? activeWallpaperObj.pattern : undefined,
                      backgroundSize: '12px 12px',
                    }}
                    className="w-full h-full border border-gray-700 rounded-sm shadow flex items-center justify-center overflow-hidden"
                  >
                    <div className="text-[9px] font-pixel text-white/70 text-center drop-shadow px-1">
                      HYPERLINK '98
                    </div>
                  </div>
                  {/* Monitor Stand */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-3 bg-[#444] border border-[#222] rounded-b" />
                </div>
              </div>

              {/* Wallpaper Selector List */}
              <div>
                <label className="block font-bold mb-1">Select Wallpaper Pattern:</label>
                <div className="bevel-sunken bg-white text-black p-1 h-28 overflow-y-auto font-mono text-xs">
                  {WALLPAPERS.map(wp => (
                    <div
                      key={wp.id}
                      onClick={() => { soundManager.playClick(); setSelectedWp(wp.id); }}
                      className={`px-2 py-1 cursor-pointer flex items-center justify-between ${
                        selectedWp === wp.id ? 'bg-[#000080] text-white font-bold' : 'hover:bg-gray-200'
                      }`}
                    >
                      <span>{wp.name}</span>
                      {selectedWp === wp.id && <span>✔</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'themes' && (
            <div className="space-y-4">
              {/* Theme selection */}
              <div>
                <label className="block font-bold mb-1">Color Scheme Theme:</label>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setTheme(t.id);
                        localStorage.setItem('hyperlink98_theme', t.id);
                      }}
                      className={`bevel-button p-2 text-left flex items-center gap-2 ${
                        theme === t.id ? 'active font-bold border-2 border-blue-700' : ''
                      }`}
                    >
                      <span className="text-xl">{t.icon}</span>
                      <div>
                        <div className="font-bold">{t.name}</div>
                        <div className="text-[10px] opacity-75">{t.id}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CRT Scanline Settings */}
              <div className="bevel-raised p-2.5 bg-[var(--btn-face)] flex items-center justify-between">
                <div>
                  <div className="font-bold">CRT Phosphor Scanlines</div>
                  <div className="text-[10px] opacity-75">Simulate 1990s Cathode Ray Tube display lines</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setCrtEnabled(!crtEnabled);
                  }}
                  className={`bevel-button px-3 py-1 font-bold ${
                    crtEnabled ? 'bg-emerald-700 text-white' : 'bg-gray-400 text-black'
                  }`}
                >
                  {crtEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Audio master settings */}
              <div className="bevel-raised p-2.5 bg-[var(--btn-face)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Master Procedural Audio</span>
                  <button
                    type="button"
                    onClick={() => {
                      const muted = soundManager.toggleMute();
                      setSoundMuted(muted);
                    }}
                    className="bevel-button px-3 py-1 font-bold"
                  >
                    {soundMuted ? '🔇 Unmute' : '🔊 Mute'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">Volume:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volumeVal}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolumeVal(v);
                      soundManager.setVolume(v);
                    }}
                    className="flex-1 accent-cyan-400 cursor-pointer"
                  />
                  <span className="font-mono text-xs w-8">{Math.round(volumeVal * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'screensaver' && (
            <div className="space-y-3 text-center py-4">
              <span className="text-4xl animate-bounce inline-block">🚀</span>
              <h3 className="font-pixel text-xs text-yellow-400">3D STARFIELD SCREEN SAVER</h3>
              <p className="text-xs opacity-80 max-w-sm mx-auto">
                Automatic screensaver kicks in during system idle time. You can simulate the full screen warp tunnel directly in WinPulse Studio.
              </p>
              <div className="bevel-sunken p-2 bg-black text-cyan-400 font-mono text-xs max-w-xs mx-auto">
                Idle Timeout: <span className="text-lime-400 font-bold">5 Minutes</span>
              </div>
            </div>
          )}

          {/* Action buttons footer */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-400">
            <button
              type="button"
              onClick={handleOk}
              className="bevel-button px-4 py-1 font-bold bg-[#000080] text-white hover:bg-blue-700"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => { soundManager.playClick(); onClose(); }}
              className="bevel-button px-4 py-1 font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="bevel-button px-4 py-1 font-bold"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
