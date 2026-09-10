import React, { useState } from 'react';
import { soundManager } from '../utils/audio';

const DESKTOP_ITEMS = [
  { id: 'web-explorer', title: 'Web Explorer', icon: '🌐', subtitle: 'Cyber Portal' },
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
    onOpenApp(id);
  };

  return (
    <div className="absolute top-4 left-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 z-0 pointer-events-auto select-none">
      {DESKTOP_ITEMS.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <div
            key={item.id}
            onClick={() => handleSelect(item.id)}
            onDoubleClick={() => handleLaunch(item.id)}
            className={`w-20 p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-colors rounded-none group ${
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
              className={`font-pixel text-[10px] leading-tight px-1 py-0.5 max-w-full truncate ${
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
              className="mt-1 text-[9px] bg-black/75 text-cyan-300 px-1 py-0.5 rounded md:hidden border border-cyan-500/40"
            >
              Open
            </button>
          </div>
        );
      })}
    </div>
  );
}
