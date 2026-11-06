import React, { useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';

export default function ContextMenu({
  x,
  y,
  isOpen,
  onClose,
  onOpenDisplayProperties,
  onCascadeWindows,
  onTileWindows,
  onMinimizeAll,
  onOpenApp,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const posX = Math.min(x, window.innerWidth - 200);
  const posY = Math.min(y, window.innerHeight - 240);

  const handleAction = (cb) => {
    soundManager.playClick();
    onClose();
    cb?.();
  };

  return (
    <div
      ref={menuRef}
      style={{ left: `${posX}px`, top: `${posY}px` }}
      className="fixed z-[9990] w-52 bevel-raised bg-[var(--btn-face)] text-[var(--text-main)] shadow-2xl p-1 flex flex-col gap-0.5 text-xs font-sans select-none"
    >
      <button
        type="button"
        onClick={() => handleAction(() => onOpenApp?.('web-explorer'))}
        className="flex items-center gap-2 px-2.5 py-1 text-left hover:bg-[#000080] hover:text-white rounded-none cursor-pointer"
      >
        <span>🌐</span> Launch Web Explorer
      </button>

      <button
        type="button"
        onClick={() => handleAction(() => onOpenApp?.('minesweeper'))}
        className="flex items-center gap-2 px-2.5 py-1 text-left hover:bg-[#000080] hover:text-white rounded-none cursor-pointer"
      >
        <span>💣</span> Play Minesweeper '98
      </button>

      <button
        type="button"
        onClick={() => handleAction(() => onOpenApp?.('irc-chat'))}
        className="flex items-center gap-2 px-2.5 py-1 text-left hover:bg-[#000080] hover:text-white rounded-none cursor-pointer"
      >
        <span>💬</span> Open mIRC '98 CyberChat
      </button>

      <div className="h-[1px] bg-gray-400 my-0.5" />

      <button
        type="button"
        onClick={() => handleAction(onCascadeWindows)}
        className="flex items-center gap-2 px-2.5 py-1 text-left hover:bg-[#000080] hover:text-white rounded-none cursor-pointer"
      >
        <span>🗂️</span> Cascade Windows
      </button>

      <button
        type="button"
        onClick={() => handleAction(onTileWindows)}
        className="flex items-center gap-2 px-2.5 py-1 text-left hover:bg-[#000080] hover:text-white rounded-none cursor-pointer"
      >
        <span>📑</span> Tile Windows Horizontally
      </button>

      <button
        type="button"
        onClick={() => handleAction(onMinimizeAll)}
        className="flex items-center gap-2 px-2.5 py-1 text-left hover:bg-[#000080] hover:text-white rounded-none cursor-pointer"
      >
        <span>🧹</span> Minimize All Windows
      </button>

      <div className="h-[1px] bg-gray-400 my-0.5" />

      <button
        type="button"
        onClick={() => handleAction(onOpenDisplayProperties)}
        className="flex items-center gap-2 px-2.5 py-1 text-left hover:bg-[#000080] hover:text-white rounded-none cursor-pointer font-bold"
      >
        <span>🖼️</span> Display Properties...
      </button>

      <button
        type="button"
        onClick={() => handleAction(() => onOpenApp?.('readme'))}
        className="flex items-center gap-2 px-2.5 py-1 text-left hover:bg-[#000080] hover:text-white rounded-none cursor-pointer"
      >
        <span>ℹ️</span> About HYPERLINK '98 v1.0
      </button>
    </div>
  );
}
