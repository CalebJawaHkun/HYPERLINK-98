import React, { useState } from 'react';
import { soundManager } from '../utils/audio';

const DESKTOP_ITEMS = [
  { id: 'web-explorer', title: 'Web Explorer', icon: '🌐', subtitle: 'Cyber Portal' },
  { id: '80s-archives', title: '80s Net Hub', icon: '💾', subtitle: 'Telecomputing' },
  { id: 'minesweeper', title: 'Minesweeper', icon: '💣', subtitle: '90s Puzzle' },
  { id: 'irc-chat', title: 'CyberChat', icon: '💬', subtitle: 'mIRC Network' },
  { id: 'win-pulse', title: 'WinPulse 98', icon: '📻', subtitle: 'Chiptune Media' },
  { id: 'arcade', title: 'Cyber Invaders', icon: '👾', subtitle: 'Arcade Game' },
  { id: 'terminal', title: 'BBS Terminal', icon: '💻', subtitle: 'MS-DOS Shell' },
  { id: 'pixel-paint', title: 'PixelPaint', icon: '🎨', subtitle: 'Art Studio' },
  { id: 'readme', title: 'README.txt', icon: '📖', subtitle: 'Cyberspace Docs' },
  { id: 'recycle', title: 'Recycle Bin', icon: '🗑️', subtitle: 'Empty' },
];

export default function DesktopIcons({ onOpenApp }) {
  const [selectedId, setSelectedId] = useState('web-explorer');

  const handleSelect = (id) => {
    soundManager.playClick();
    setSelectedId(id);
  };

  const handleLaunch = (id) => {
    soundManager.playWindowOpen();
    if (id === '80s-archives') {
      onOpenApp('web-explorer', { url: 'http://www.hyperlink98.net/80s-telecomputing.htm' });
    } else {
      onOpenApp(id);
    }
  };

  return (
    <div className="absolute top-4 left-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3.5 z-0 pointer-events-auto select-none max-h-[85vh] overflow-y-auto">
      {DESKTOP_ITEMS.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <div
            key={item.id}
            onClick={() => handleSelect(item.id)}
            onDoubleClick={() => handleLaunch(item.id)}
            className={`w-20 p-1.5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors rounded-none group ${
              isSelected
                ? 'bg-blue-600/50 border border-dotted border-white text-white shadow-lg'
                : 'hover:bg-white/10 text-white'
            }`}
          >
            {/* 90s Pixel/Emoji Icon with drop shadow */}
            <div className="text-3xl mb-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform">
              {item.icon}
            </div>

            {/* Title */}
            <span
              className={`font-pixel text-[9px] leading-tight px-1 py-0.5 max-w-full truncate ${
                isSelected ? 'bg-[#000080] text-white' : 'text-white drop-shadow-[1px_1px_2px_#000]'
              }`}
            >
              {item.title}
            </span>

            {/* Double-click mobile helper */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLaunch(item.id);
              }}
              className="mt-1 text-[8px] bg-black/75 text-cyan-300 px-1 py-0.5 rounded md:hidden border border-cyan-500/40"
            >
              Open
            </button>
          </div>
        );
      })}
    </div>
  );
}
