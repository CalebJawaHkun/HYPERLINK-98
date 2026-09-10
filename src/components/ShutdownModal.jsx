import React, { useState } from 'react';
import { soundManager } from '../utils/audio';

export default function ShutdownModal({ isOpen, onClose }) {
  const [isOff, setIsOff] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    soundManager.playErrorDing();
    setIsOff(true);
  };

  const handleReboot = () => {
    soundManager.playWindowOpen();
    setIsOff(false);
    onClose();
  };

  if (isOff) {
    return (
      <div className="fixed inset-0 bg-black z-[99999] flex flex-col items-center justify-center text-center p-6 select-none">
        <div className="font-pixel text-amber-500 text-xl sm:text-3xl leading-relaxed mb-6 tracking-widest text-shadow-[0_0_12px_#f59e0b]">
          IT IS NOW SAFE TO TURN OFF<br />YOUR COMPUTER.
        </div>
        <p className="text-gray-400 font-mono text-xs mb-8">
          All cyberspace sockets closed. 56k modem disconnected.
        </p>
        <button
          type="button"
          onClick={handleReboot}
          className="bevel-button px-6 py-2.5 font-pixel text-xs bg-emerald-700 text-white hover:bg-emerald-600 font-bold"
        >
          ⚡ REBOOT CYBERSPACE OS
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 select-none">
      <div className="bevel-raised bg-[var(--window-bg)] w-full max-w-sm p-1 shadow-2xl">
        {/* Title bar */}
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 flex items-center justify-between font-bold text-xs">
          <div className="flex items-center gap-1.5 font-pixel text-[10px]">
            <span>🔌</span> Shut Down Cyberspace
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bevel-button w-4 h-4 text-black text-[10px] flex items-center justify-center font-bold bg-[#c0c0c0]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💻</span>
            <div>
              <div className="font-bold text-sm">What would you like to do?</div>
              <div className="opacity-75 text-[11px]">Select an option to shut down session.</div>
            </div>
          </div>

          <div className="space-y-1.5 bevel-sunken p-2 bg-white/10">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="shutdown-opt" defaultChecked className="accent-blue-600" />
              <span>Shut down the cyberspace session</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="shutdown-opt" className="accent-blue-600" />
              <span>Restart in MS-DOS mode</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-400">
            <button
              type="button"
              onClick={handleConfirm}
              className="bevel-button px-4 py-1 font-bold text-xs bg-red-700 text-white hover:bg-red-600"
            >
              OK
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bevel-button px-4 py-1 font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
