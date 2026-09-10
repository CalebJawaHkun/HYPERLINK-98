import React, { useState, useEffect } from 'react';
import DesktopIcons from './components/DesktopIcons';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import CrtOverlay from './components/CrtOverlay';
import ShutdownModal from './components/ShutdownModal';

import WebExplorer from './components/apps/WebExplorer';
import WinPulsePlayer from './components/apps/WinPulsePlayer';
import CyberInvaders from './components/apps/CyberInvaders';
import BbsTerminal from './components/apps/BbsTerminal';
import PixelPaint from './components/apps/PixelPaint';
import ReadmeApp from './components/apps/ReadmeApp';
import RecycleBinApp from './components/apps/RecycleBinApp';

import { soundManager } from './utils/audio';

export default function App() {
  const [theme, setTheme] = useState('win95');
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [soundMuted, setSoundMuted] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState('web-explorer');
  const [highestZ, setHighestZ] = useState(20);
  const [shutdownOpen, setShutdownOpen] = useState(false);

  // Window states list
  const [windows, setWindows] = useState([
    {
      id: 'web-explorer',
      title: "Web Explorer '98 - [HYPERLINK '98 Cyberspace Portal]",
      icon: '🌐',
      isOpen: true,
      isMinimized: false,
      zIndex: 15,
      defaultPos: { x: 90, y: 25 },
      defaultSize: { width: 880, height: 600 },
    },
    {
      id: 'win-pulse',
      title: "WinPulse '98 Audio Deck",
      icon: '📻',
      isOpen: false,
      isMinimized: false,
      zIndex: 12,
      defaultPos: { x: 320, y: 60 },
      defaultSize: { width: 500, height: 440 },
    },
    {
      id: 'arcade',
      title: "Cyber Invaders Arcade '98",
      icon: '👾',
      isOpen: false,
      isMinimized: false,
      zIndex: 13,
      defaultPos: { x: 260, y: 40 },
      defaultSize: { width: 540, height: 500 },
    },
    {
      id: 'terminal',
      title: 'BBS Cyber-Terminal (VT100 MS-DOS)',
      icon: '💻',
      isOpen: false,
      isMinimized: false,
      zIndex: 11,
      defaultPos: { x: 180, y: 70 },
      defaultSize: { width: 620, height: 420 },
    },
    {
      id: 'pixel-paint',
      title: "PixelPaint '98 Studio",
      icon: '🎨',
      isOpen: false,
      isMinimized: false,
      zIndex: 10,
      defaultPos: { x: 220, y: 50 },
      defaultSize: { width: 680, height: 490 },
    },
    {
      id: 'readme',
      title: 'README.TXT - Cyberspace Manual',
      icon: '📖',
      isOpen: false,
      isMinimized: false,
      zIndex: 9,
      defaultPos: { x: 150, y: 80 },
      defaultSize: { width: 560, height: 460 },
    },
    {
      id: 'recycle',
      title: 'Recycle Bin',
      icon: '🗑️',
      isOpen: false,
      isMinimized: false,
      zIndex: 8,
      defaultPos: { x: 280, y: 120 },
      defaultSize: { width: 520, height: 380 },
    },
  ]);

  // Sync theme to body tag
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Focus and raise window
  const focusWindow = (id) => {
    setActiveWindowId(id);
    const nextZ = highestZ + 1;
    setHighestZ(nextZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w))
    );
  };

  // Open / Launch window
  const openWindow = (id) => {
    soundManager.playWindowOpen();
    const nextZ = highestZ + 1;
    setHighestZ(nextZ);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ }
          : w
      )
    );
  };

  // Close window
  const closeWindow = (id) => {
    soundManager.playClick();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
  };

  // Minimize window
  const minimizeWindow = (id) => {
    soundManager.playClick();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  // Toggle window from Taskbar
  const toggleWindow = (id) => {
    const target = windows.find((w) => w.id === id);
    if (!target) return;

    if (!target.isOpen) {
      openWindow(id);
    } else if (target.isMinimized) {
      focusWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[var(--bg-desktop)]">
      {/* CRT Scanline and Vignette Filter */}
      <CrtOverlay enabled={crtEnabled} />

      {/* Desktop Background Watermark Brand */}
      <div className="absolute right-8 bottom-16 opacity-15 pointer-events-none text-right z-0 hidden lg:block">
        <div className="font-pixel text-4xl text-white font-black tracking-widest uppercase">
          HYPERLINK '98
        </div>
        <div className="font-mono text-xs text-white tracking-widest mt-1">
          CYBERSPACE EDITION &bull; REACT 19
        </div>
      </div>

      {/* Desktop Shortcut Icons Grid */}
      <DesktopIcons onOpenApp={openWindow} />

      {/* 1. Main Web Explorer Cyberspace Portal Window */}
      {(() => {
        const win = windows.find((w) => w.id === 'web-explorer');
        return (
          <Window
            id={win.id}
            title={win.title}
            icon={win.icon}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            isActive={activeWindowId === win.id}
            zIndex={win.zIndex}
            defaultPos={win.defaultPos}
            defaultSize={win.defaultSize}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          >
            <WebExplorer onLaunchApp={openWindow} />
          </Window>
        );
      })()}

      {/* 2. WinPulse '98 Chiptune Media Player Window */}
      {(() => {
        const win = windows.find((w) => w.id === 'win-pulse');
        return (
          <Window
            id={win.id}
            title={win.title}
            icon={win.icon}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            isActive={activeWindowId === win.id}
            zIndex={win.zIndex}
            defaultPos={win.defaultPos}
            defaultSize={win.defaultSize}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          >
            <WinPulsePlayer />
          </Window>
        );
      })()}

      {/* 3. Cyber Invaders Arcade Game Window */}
      {(() => {
        const win = windows.find((w) => w.id === 'arcade');
        return (
          <Window
            id={win.id}
            title={win.title}
            icon={win.icon}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            isActive={activeWindowId === win.id}
            zIndex={win.zIndex}
            defaultPos={win.defaultPos}
            defaultSize={win.defaultSize}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          >
            <CyberInvaders />
          </Window>
        );
      })()}

      {/* 4. BBS Cyber-Terminal MS-DOS Window */}
      {(() => {
        const win = windows.find((w) => w.id === 'terminal');
        return (
          <Window
            id={win.id}
            title={win.title}
            icon={win.icon}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            isActive={activeWindowId === win.id}
            zIndex={win.zIndex}
            defaultPos={win.defaultPos}
            defaultSize={win.defaultSize}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          >
            <BbsTerminal onThemeChange={(newTheme) => setTheme(newTheme)} />
          </Window>
        );
      })()}

      {/* 5. PixelPaint '98 Studio Window */}
      {(() => {
        const win = windows.find((w) => w.id === 'pixel-paint');
        return (
          <Window
            id={win.id}
            title={win.title}
            icon={win.icon}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            isActive={activeWindowId === win.id}
            zIndex={win.zIndex}
            defaultPos={win.defaultPos}
            defaultSize={win.defaultSize}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          >
            <PixelPaint />
          </Window>
        );
      })()}

      {/* 6. README.TXT Manual Window */}
      {(() => {
        const win = windows.find((w) => w.id === 'readme');
        return (
          <Window
            id={win.id}
            title={win.title}
            icon={win.icon}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            isActive={activeWindowId === win.id}
            zIndex={win.zIndex}
            defaultPos={win.defaultPos}
            defaultSize={win.defaultSize}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          >
            <ReadmeApp />
          </Window>
        );
      })()}

      {/* 7. Recycle Bin Window */}
      {(() => {
        const win = windows.find((w) => w.id === 'recycle');
        return (
          <Window
            id={win.id}
            title={win.title}
            icon={win.icon}
            isOpen={win.isOpen}
            isMinimized={win.isMinimized}
            isActive={activeWindowId === win.id}
            zIndex={win.zIndex}
            defaultPos={win.defaultPos}
            defaultSize={win.defaultSize}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
          >
            <RecycleBinApp />
          </Window>
        );
      })()}

      {/* 90s OS Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onToggleWindow={toggleWindow}
        onOpenWindow={openWindow}
        theme={theme}
        setTheme={setTheme}
        crtEnabled={crtEnabled}
        setCrtEnabled={setCrtEnabled}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
        onTriggerShutdown={() => setShutdownOpen(true)}
      />

      {/* Shutdown Cyberspace Dialog Modal */}
      <ShutdownModal
        isOpen={shutdownOpen}
        onClose={() => setShutdownOpen(false)}
      />
    </div>
  );
}
