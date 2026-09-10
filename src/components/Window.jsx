import React, { useState, useRef, useEffect } from 'react';
import { soundManager } from '../utils/audio';

export default function Window({
  id,
  title,
  icon = '📁',
  children,
  isOpen,
  isMinimized,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  defaultPos = { x: 80, y: 50 },
  defaultSize = { width: 720, height: 520 },
  minWidth = 320,
  minHeight = 240,
  zIndex = 10,
}) {
  const [pos, setPos] = useState(defaultPos);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const windowRef = useRef(null);

  // Auto responsive center on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMaximized(true);
    }
  }, []);

  const handleMouseDown = (e) => {
    onFocus?.();
    if (isMaximized) return;
    if (e.target.closest('.window-control-btn')) return;

    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX || (e.touches && e.touches[0].clientX) || 0,
      startY: e.clientY || (e.touches && e.touches[0].clientY) || 0,
      initialX: pos.x,
      initialY: pos.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaX = clientX - dragRef.current.startX;
      const deltaY = clientY - dragRef.current.startY;

      const maxX = Math.max(0, window.innerWidth - 120);
      const maxY = Math.max(0, window.innerHeight - 80);

      setPos({
        x: Math.min(maxX, Math.max(0, dragRef.current.initialX + deltaX)),
        y: Math.min(maxY, Math.max(0, dragRef.current.initialY + deltaY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen || isMinimized) return null;

  const style = isMaximized
    ? {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 42px)',
        zIndex,
      }
    : {
        position: 'fixed',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${Math.min(defaultSize.width, window.innerWidth - 20)}px`,
        height: `${Math.min(defaultSize.height, window.innerHeight - 80)}px`,
        minWidth: `${minWidth}px`,
        minHeight: `${minHeight}px`,
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      style={style}
      onClick={() => onFocus?.()}
      className={`bevel-raised flex flex-col select-none transition-shadow shadow-2xl ${
        isActive ? 'ring-1 ring-cyan-400/40' : 'opacity-95'
      }`}
      style-bg="var(--window-bg)"
    >
      {/* 90s OS Window Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{
          background: isActive ? 'var(--titlebar-active)' : 'var(--titlebar-inactive)',
          color: isActive ? 'var(--titlebar-active-text)' : 'var(--titlebar-inactive-text)',
        }}
        className="flex items-center justify-between px-2 py-1 select-none cursor-move text-xs font-bold tracking-wide"
      >
        <div className="flex items-center gap-1.5 truncate pr-2">
          <span className="text-sm">{icon}</span>
          <span className="font-pixel text-[11px] truncate tracking-wider">{title}</span>
        </div>

        {/* Windows 95 Window Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            className="window-control-btn bevel-button w-5 h-5 flex items-center justify-center font-bold text-xs leading-none bg-[#c0c0c0] text-black"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playClick();
              onMinimize?.();
            }}
            title="Minimize"
          >
            _
          </button>
          <button
            type="button"
            className="window-control-btn bevel-button w-5 h-5 flex items-center justify-center font-bold text-xs leading-none bg-[#c0c0c0] text-black"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playClick();
              setIsMaximized(!isMaximized);
            }}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? '❐' : '□'}
          </button>
          <button
            type="button"
            className="window-control-btn bevel-button w-5 h-5 flex items-center justify-center font-bold text-xs leading-none bg-[#c0c0c0] text-black hover:bg-red-600 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playClick();
              onClose?.();
            }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-[var(--window-bg)] text-[var(--text-main)] p-2 flex flex-col">
        {children}
      </div>
    </div>
  );
}
