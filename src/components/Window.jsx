import React, { useState, useRef, useEffect } from 'react';
import { soundManager } from '../utils/audio';

export default function Window({
  _id,
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
  minHeight = 220,
  zIndex = 10,
}) {
  const [pos, setPos] = useState(defaultPos);
  const [size, setSize] = useState(defaultSize);
  const [isMaximized, setIsMaximized] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [isDragging, setIsDragging] = useState(false);
  const [resizingDir, setResizingDir] = useState(null);

  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0, initialW: 0, initialH: 0 });
  const windowRef = useRef(null);

  // Dragging handlers
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

  // Start Resizing
  const handleResizeStart = (e, dir) => {
    e.stopPropagation();
    e.preventDefault();
    onFocus?.();
    if (isMaximized) return;

    setResizingDir(dir);
    resizeRef.current = {
      startX: e.clientX || (e.touches && e.touches[0].clientX) || 0,
      startY: e.clientY || (e.touches && e.touches[0].clientY) || 0,
      initialX: pos.x,
      initialY: pos.y,
      initialW: size.width,
      initialH: size.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      if (isDragging) {
        const deltaX = clientX - dragRef.current.startX;
        const deltaY = clientY - dragRef.current.startY;
        const maxX = Math.max(0, window.innerWidth - 80);
        const maxY = Math.max(0, window.innerHeight - 60);

        setPos({
          x: Math.min(maxX, Math.max(0, dragRef.current.initialX + deltaX)),
          y: Math.min(maxY, Math.max(0, dragRef.current.initialY + deltaY)),
        });
      }

      if (resizingDir) {
        const deltaX = clientX - resizeRef.current.startX;
        const deltaY = clientY - resizeRef.current.startY;
        let newX = resizeRef.current.initialX;
        let newY = resizeRef.current.initialY;
        let newW = resizeRef.current.initialW;
        let newH = resizeRef.current.initialH;

        if (resizingDir.includes('e')) {
          newW = Math.max(minWidth, Math.min(window.innerWidth - newX - 10, resizeRef.current.initialW + deltaX));
        }
        if (resizingDir.includes('s')) {
          newH = Math.max(minHeight, Math.min(window.innerHeight - newY - 45, resizeRef.current.initialH + deltaY));
        }
        if (resizingDir.includes('w')) {
          const potentialW = resizeRef.current.initialW - deltaX;
          if (potentialW >= minWidth) {
            newW = potentialW;
            newX = Math.max(0, resizeRef.current.initialX + deltaX);
          }
        }
        if (resizingDir.includes('n')) {
          const potentialH = resizeRef.current.initialH - deltaY;
          if (potentialH >= minHeight) {
            newH = potentialH;
            newY = Math.max(0, resizeRef.current.initialY + deltaY);
          }
        }

        setPos({ x: newX, y: newY });
        setSize({ width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setResizingDir(null);
    };

    if (isDragging || resizingDir) {
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
  }, [isDragging, resizingDir, minWidth, minHeight]);

  if (!isOpen || isMinimized) return null;

  const style = isMaximized
    ? {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 40px)',
        zIndex,
      }
    : {
        position: 'fixed',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${Math.min(size.width, window.innerWidth - 10)}px`,
        height: `${Math.min(size.height, window.innerHeight - 60)}px`,
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
        isActive ? 'ring-1 ring-cyan-400/40 shadow-[0_8px_30px_rgba(0,0,0,0.6)]' : 'opacity-95'
      }`}
    >
      {/* 90s OS Window Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        onDoubleClick={() => {
          soundManager.playClick();
          setIsMaximized(!isMaximized);
        }}
        style={{
          background: isActive ? 'var(--titlebar-active)' : 'var(--titlebar-inactive)',
          color: isActive ? 'var(--titlebar-active-text)' : 'var(--titlebar-inactive-text)',
        }}
        className="flex items-center justify-between px-2 py-1 select-none cursor-move text-xs font-bold tracking-wide shrink-0"
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
      <div className="flex-1 overflow-auto bg-[var(--window-bg)] text-[var(--text-main)] p-2 flex flex-col relative">
        {children}
      </div>

      {/* 8-Direction Resizing Handles (Hidden when maximized) */}
      {!isMaximized && (
        <>
          <div
            onMouseDown={(e) => handleResizeStart(e, 'n')}
            onTouchStart={(e) => handleResizeStart(e, 'n')}
            className="absolute top-0 left-2 right-2 h-1.5 cursor-ns-resize z-20"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 's')}
            onTouchStart={(e) => handleResizeStart(e, 's')}
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-ns-resize z-20"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            onTouchStart={(e) => handleResizeStart(e, 'w')}
            className="absolute top-2 bottom-2 left-0 w-1.5 cursor-ew-resize z-20"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            onTouchStart={(e) => handleResizeStart(e, 'e')}
            className="absolute top-2 bottom-2 right-0 w-1.5 cursor-ew-resize z-20"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            onTouchStart={(e) => handleResizeStart(e, 'nw')}
            className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-20"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            onTouchStart={(e) => handleResizeStart(e, 'ne')}
            className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-20"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            onTouchStart={(e) => handleResizeStart(e, 'sw')}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-20"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            onTouchStart={(e) => handleResizeStart(e, 'se')}
            className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-20"
          />
        </>
      )}
    </div>
  );
}
