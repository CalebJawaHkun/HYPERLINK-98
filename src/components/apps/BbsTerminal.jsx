import React, { useState, useRef, useEffect } from 'react';
import { soundManager } from '../../utils/audio';

const FORTUNES = [
  "\"The Information Superhighway is paved with 56k dreams.\" — CyberSage, 1998",
  "\"Never underestimate the bandwidth of a station wagon full of floppy disks.\" — BBS Wisdom",
  "\"It's 1998. Have you backed up your GeoCities website today?\"",
  "\"There are 10 types of people in the world: those who understand binary, and those who don't.\"",
  "\"All your base are belong to us.\""
];

export default function BbsTerminal({ onThemeChange }) {
  const [inputVal, setInputVal] = useState('');
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [history, setHistory] = useState([
    { type: 'system', text: 'HYPERLINK BBS & MS-DOS v7.10 (C) 1998 CyberSoft Inc.' },
    { type: 'system', text: 'Memory: 64MB SDRAM OK. SoundBlaster 16 Detected at IRQ 7, DMA 1.' },
    { type: 'system', text: 'Type "help" for a list of available cyber commands.' },
    { type: 'system', text: '---------------------------------------------------------' }
  ]);

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    const cmd = inputVal.trim();
    if (!cmd) return;

    soundManager.playClick();
    const newHistory = [...history, { type: 'user', text: `C:\\CYBERSPACE> ${cmd}` }];
    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      newHistory.push({
        type: 'output',
        text: `AVAILABLE COMMANDS:
  help       - Display this list of terminal commands
  sysinfo    - Print system hardware and OS specs
  dialup     - Connect to 56k modem gateway (plays audio FX)
  matrix     - Toggle green digital rain mode
  fortune    - Print a random 1990s web fortune
  theme      - Change theme (e.g. "theme win95", "theme geocities", "theme macos", "theme matrix")
  secret     - Cyberspace hidden easter egg
  clear      - Clear terminal screen`
      });
    } else if (lower === 'sysinfo' || lower === 'neofetch') {
      newHistory.push({
        type: 'output',
        text: `       ___       OS: HyperLink OS 98 (Build 1998.4)
      /   \\      Host: Pentium II @ 450 MHz MMX
     /  _  \\     RAM: 64 MB PC-100 SDRAM
    /  / \\  \\    GPU: 3Dfx Voodoo2 12MB PCI
   /  /__ \\  \\   Audio: SoundBlaster 16 AWE64
  /   ___   \\  Modem: USRobotics 56k V.90 FaxModem
 /___/   \\___\\ Resolution: 1024x768 @ 85Hz Sync`
      });
    } else if (lower === 'dialup') {
      soundManager.playDialup();
      newHistory.push({
        type: 'output',
        text: `ATDT 1-800-CYBERSPACE...
CONNECT 56000/V.90/LAPM/COMPRESSION: ON
CARRIER DETECTED. Welcome to the Global Backbone Gateway!`
      });
    } else if (lower === 'matrix') {
      setIsMatrixMode(!isMatrixMode);
      newHistory.push({
        type: 'output',
        text: isMatrixMode ? 'Matrix Rain mode disabled.' : 'Entering the Matrix... Wake up, Neo.'
      });
    } else if (lower === 'fortune') {
      const f = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      newHistory.push({ type: 'output', text: f });
    } else if (lower.startsWith('theme')) {
      const parts = lower.split(' ');
      if (parts[1]) {
        onThemeChange?.(parts[1]);
        newHistory.push({ type: 'output', text: `Switched theme to: ${parts[1]}` });
      } else {
        newHistory.push({ type: 'output', text: 'Usage: theme <win95 | geocities | macos | matrix>' });
      }
    } else if (lower === 'secret') {
      newHistory.push({
        type: 'output',
        text: '💾 [EASTER EGG]: Up, Up, Down, Down, Left, Right, Left, Right, B, A! You unlocked infinite cyber bandwidth!'
      });
    } else if (lower === 'clear' || lower === 'cls') {
      setHistory([]);
      setInputVal('');
      return;
    } else {
      soundManager.playErrorDing();
      newHistory.push({
        type: 'error',
        text: `Bad command or file name: "${cmd}". Type "help" for valid commands.`
      });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-col h-full bg-[#030d06] text-[#33ff66] p-3 font-vt text-base select-text overflow-y-auto cursor-text shadow-inner"
    >
      {/* Terminal History */}
      <div className="flex-1 space-y-1">
        {history.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap leading-relaxed ${
              line.type === 'user'
                ? 'text-yellow-300 font-bold'
                : line.type === 'error'
                ? 'text-red-400'
                : 'text-[#33ff66]'
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Prompt */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#005511] shrink-0 text-lg">
        <span className="text-yellow-300 font-bold shrink-0">C:\CYBERSPACE&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent text-[#33ff66] outline-none font-vt text-lg caret-emerald-400"
          autoFocus
        />
      </div>
    </div>
  );
}
