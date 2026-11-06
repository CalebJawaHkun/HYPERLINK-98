import React, { useState, useEffect } from 'react';
import DesktopIcons from './components/DesktopIcons';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import CrtOverlay from './components/CrtOverlay';
import ShutdownModal from './components/ShutdownModal';
import ContextMenu from './components/ContextMenu';
import DisplayPropertiesModal, { WALLPAPERS } from './components/DisplayPropertiesModal';

import WebExplorer from './components/apps/WebExplorer';
import MinesweeperApp from './components/apps/MinesweeperApp';
import IrcChatApp from './components/apps/IrcChatApp';
import WinPulsePlayer from './components/apps/WinPulsePlayer';
import CyberInvaders from './components/apps/CyberInvaders';
import BbsTerminal from './components/apps/BbsTerminal';
import PixelPaint from './components/apps/PixelPaint';
import ReadmeApp from './components/apps/ReadmeApp';
import RecycleBinApp from './components/apps/RecycleBinApp';

import { soundManager } from './utils/audio';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('hyperlink98_theme') || 'win95');
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('hyperlink98_wallpaper') || 'default');
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [soundMuted, setSoundMuted] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState('web-explorer');
  const [highestZ, setHighestZ] = useState(25);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [displayPropertiesOpen, setDisplayPropertiesOpen] = useState(false);
  const [browserTargetUrl, setBrowserTargetUrl] = useState(null);

  // Desktop Context Menu State
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });

  // Window states list (HYPERLINK '98 v1.0 suite)
  const [windows, setWindows] = useState([
    {
      id: 'web-explorer',
      title: "Web Explorer '98 - [HYPERLINK '98 Cyberspace Portal]",
      icon: '🌐',
      isOpen: true,
      isMinimized: false,
      zIndex: 15,
      defaultPos: { x: 80, y: 20 },
      defaultSize: { width: 880, height: 580 },
    },
    {
      id: 'minesweeper',
      title: "Minesweeper '98",
      icon: '💣',
      isOpen: false,
      isMinimized: false,
      zIndex: 16,
      defaultPos: { x: 260, y: 70 },
      defaultSize: { width: 440, height: 490 },
    },
    {
      id: 'irc-chat',
      title: "mIRC '98 [CyberChat Network #cyberspace]",
      icon: '💬',
      isOpen: false,
      isMinimized: false,
      zIndex: 14,
      defaultPos: { x: 160, y: 50 },
      defaultSize: { width: 720, height: 480 },
    },
    {
      id: 'win-pulse',
      title: "WinPulse '98 Pro Audio Deck & Tracker",
      icon: '📻',
      isOpen: false,
      isMinimized: false,
      zIndex: 13,
      defaultPos: { x: 300, y: 40 },
      defaultSize: { width: 560, height: 470 },
    },
    {
      id: 'arcade',
      title: "Cyber Invaders Arcade '98",
      icon: '👾',
      isOpen: false,
      isMinimized: false,
      zIndex: 12,
      defaultPos: { x: 220, y: 35 },
      defaultSize: { width: 540, height: 500 },
    },
    {
      id: 'terminal',
      title: 'BBS Cyber-Terminal (VT100 MS-DOS)',
      icon: '💻',
      isOpen: false,
      isMinimized: false,
      zIndex: 11,
      defaultPos: { x: 140, y: 60 },
      defaultSize: { width: 620, height: 430 },
    },
    {
      id: 'pixel-paint',
      title: "PixelPaint '98 Studio",
      icon: '🎨',
      isOpen: false,
      isMinimized: false,
      zIndex: 10,
      defaultPos: { x: 190, y: 45 },
      defaultSize: { width: 680, height: 490 },
    },
    {
      id: 'readme',
      title: 'README.TXT - Cyberspace Manual',
      icon: '📖',
      isOpen: false,
      isMinimized: false,
      zIndex: 9,
      defaultPos: { x: 120, y: 70 },
      defaultSize: { width: 560, height: 460 },
    },
    {
      id: 'recycle',
      title: 'Recycle Bin',
      icon: '🗑️',
      isOpen: false,
      isMinimized: false,
      zIndex: 8,
      defaultPos: { x: 260, y: 110 },
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
  const openWindow = (id, params = null) => {
    soundManager.playWindowOpen();
    const nextZ = highestZ + 1;
    setHighestZ(nextZ);
    setActiveWindowId(id);
    if (id === 'web-explorer' && params?.url) {
      setBrowserTargetUrl({ url: params.url, timestamp: Date.now() });
    }
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

  // Window cascade helper
  const cascadeWindows = () => {
    let offset = 0;
    setWindows((prev) =>
      prev.map((w) => {
        if (!w.isOpen) return w;
        const pos = { x: 30 + offset * 25, y: 25 + offset * 25 };
        offset++;
        return { ...w, defaultPos: pos, isMinimized: false };
      })
    );
  };

  // Window tile horizontally helper
  const tileWindows = () => {
    const openWins = windows.filter((w) => w.isOpen && !w.isMinimized);
    if (openWins.length === 0) return;
    const tileWidth = Math.floor(window.innerWidth / openWins.length);

    let idx = 0;
    setWindows((prev) =>
      prev.map((w) => {
        if (!w.isOpen || w.isMinimized) return w;
        const currentIdx = idx++;
        return {
          ...w,
          defaultPos: { x: currentIdx * tileWidth, y: 10 },
          defaultSize: { width: tileWidth - 5, height: window.innerHeight - 60 },
        };
      })
    );
  };

  // Minimize all windows helper
  const minimizeAllWindows = () => {
    setWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })));
  };

  // Right-click desktop context menu handler
  const handleContextMenu = (e) => {
    if (e.target.closest('.bevel-raised') || e.target.closest('button') || e.target.closest('input')) {
      return;
    }
    e.preventDefault();
    soundManager.playClick();
    setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY });
  };

  const activeWpObj = WALLPAPERS.find((w) => w.id === wallpaper) || WALLPAPERS[0];

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={() => {
        if (contextMenu.isOpen) setContextMenu({ isOpen: false, x: 0, y: 0 });
      }}
      style={{
        backgroundColor: activeWpObj.bg.startsWith('var') ? undefined : activeWpObj.bg,
        backgroundImage: activeWpObj.pattern !== 'none' && !activeWpObj.pattern.startsWith('var') ? activeWpObj.pattern : undefined,
      }}
      className="relative w-screen h-screen overflow-hidden select-none bg-[var(--bg-desktop)]"
    >
      {/* CRT Scanline and Vignette Filter */}
      <CrtOverlay enabled={crtEnabled} />

      {/* Desktop Background Watermark Brand */}
      <div className="absolute right-8 bottom-16 opacity-15 pointer-events-none text-right z-0 hidden lg:block">
        <div className="font-pixel text-4xl text-white font-black tracking-widest uppercase">
          HYPERLINK '98
        </div>
        <div className="font-mono text-xs text-white tracking-widest mt-1">
          v1.0 CYBERSPACE RELEASE &bull; REACT 19
        </div>
      </div>

      {/* Desktop Shortcut Icons Grid */}
      <DesktopIcons onOpenApp={openWindow} />

      {/* 1. Web Explorer Cyberspace Portal Window */}
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
            <WebExplorer onLaunchApp={openWindow} targetUrlRequest={browserTargetUrl} />
          </Window>
        );
      })()}

      {/* 2. Cyber Minesweeper '98 Window */}
      {(() => {
        const win = windows.find((w) => w.id === 'minesweeper');
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
            <MinesweeperApp />
          </Window>
        );
      })()}

      {/* 3. mIRC '98 CyberChat Window */}
      {(() => {
        const win = windows.find((w) => w.id === 'irc-chat');
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
            <IrcChatApp />
          </Window>
        );
      })()}

      {/* 4. WinPulse '98 Pro Audio & Tracker Window */}
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

      {/* 5. Cyber Invaders Arcade Game Window */}
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

      {/* 6. BBS Cyber-Terminal MS-DOS Window */}
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

      {/* 7. PixelPaint '98 Studio Window */}
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

      {/* 8. README.TXT Manual Window */}
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

      {/* 9. Recycle Bin Window */}
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
        onOpenDisplayProperties={() => setDisplayPropertiesOpen(true)}
      />

      {/* Desktop Right-Click Context Menu */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu({ isOpen: false, x: 0, y: 0 })}
        onOpenDisplayProperties={() => setDisplayPropertiesOpen(true)}
        onCascadeWindows={cascadeWindows}
        onTileWindows={tileWindows}
        onMinimizeAll={minimizeAllWindows}
        onOpenApp={openWindow}
      />

      {/* Display Properties Settings Dialog */}
      <DisplayPropertiesModal
        isOpen={displayPropertiesOpen}
        onClose={() => setDisplayPropertiesOpen(false)}
        currentWallpaper={wallpaper}
        setWallpaper={setWallpaper}
        theme={theme}
        setTheme={setTheme}
        crtEnabled={crtEnabled}
        setCrtEnabled={setCrtEnabled}
        soundMuted={soundMuted}
        setSoundMuted={setSoundMuted}
      />

      {/* Shutdown Cyberspace Dialog Modal */}
      <ShutdownModal
        isOpen={shutdownOpen}
        onClose={() => setShutdownOpen(false)}
      />
    </div>
  );
}
