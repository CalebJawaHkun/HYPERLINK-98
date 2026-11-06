import React, { useState } from 'react';
import { soundManager } from '../../../utils/audio';

const MODEM_BENCHMARKS = [
  { name: '300 Baud (1980 Acoustic Coupler)', speedBps: 30, color: 'text-red-400' },
  { name: '1200 Baud (1984 Bell 212A)', speedBps: 120, color: 'text-amber-400' },
  { name: '2400 Baud (1987 V.22bis)', speedBps: 240, color: 'text-yellow-300' },
  { name: '56K V.90 (1998 Web 1.0)', speedBps: 5600, color: 'text-cyan-400' },
  { name: 'Gigabit Broadband (2026)', speedBps: 125000000, color: 'text-emerald-400' },
];

export default function TelecomputingHub({ onNavigate }) {
  const [selectedFileSizeKb, setSelectedFileSizeKb] = useState(1024); // 1 MB default
  const [isPlayingDialup, setIsPlayingDialup] = useState(false);

  const handleDialSound = () => {
    setIsPlayingDialup(true);
    soundManager.play1200BaudDialup();
    setTimeout(() => setIsPlayingDialup(false), 2200);
  };

  const calculateTime = (speedBps, fileSizeKb) => {
    const totalBytes = fileSizeKb * 1024;
    const seconds = totalBytes / speedBps;
    if (seconds < 1) return '< 0.01 sec (Instant)';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`;
    return `${(seconds / 3600).toFixed(1)} hours`;
  };

  return (
    <div className="space-y-6 pb-8 font-mono text-xs select-text">
      {/* 80s Retro Banner */}
      <div className="bevel-raised p-4 sm:p-6 bg-gradient-to-b from-[#1a0f30] via-[#2d124d] to-[#0d071c] text-white border-2 border-amber-400/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-amber-400/20 text-yellow-300 border border-yellow-400/40 text-[10px] font-pixel mb-2 uppercase">
              <span>💾</span> HISTORICAL TELECOMPUTING ARCHIVES (1980 - 1989)
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl text-amber-300 uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              THE 1980s ONLINE TIME MACHINE
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Explore the dawn of telecomputing before the modern World Wide Web. Experience real historical services recreated with authentic protocols, ANSI/PETSCII graphics, and 1200-baud acoustic coupler acoustics.
            </p>
          </div>

          <div className="bevel-sunken p-3 bg-black/70 flex flex-col items-center gap-2 shrink-0 border border-amber-500/40">
            <div className="text-2xl animate-pulse">📞</div>
            <button
              type="button"
              onClick={handleDialSound}
              disabled={isPlayingDialup}
              className={`bevel-button px-3 py-1.5 font-pixel text-[10px] font-bold ${
                isPlayingDialup ? 'bg-amber-500 text-black animate-pulse' : 'bg-amber-600 text-white hover:bg-amber-500'
              }`}
            >
              {isPlayingDialup ? '📡 Dialing 1200 Baud...' : '🔊 Play 1200 Baud Dialup'}
            </button>
            <span className="text-[9px] text-gray-400">Bell 212A FSK Carrier Sound</span>
          </div>
        </div>
      </div>

      {/* 4 Featured Historical Services Cards Grid */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-700 pb-1 mb-3">
          <div className="font-pixel text-xs text-yellow-400 uppercase tracking-wider flex items-center gap-2">
            <span>🕹️</span> HISTORICAL 1980s ONLINE SERVICES (CLICK TO DIAL IN)
          </div>
          <span className="text-[10px] text-gray-400">4 Authentic Recreations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. CompuServe (1980) */}
          <div className="bevel-raised p-4 bg-[#0a0f29] text-white border-2 border-blue-500 flex flex-col justify-between hover:border-yellow-400 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-sm text-yellow-300">COMPUSERVE (CIS)</span>
                <span className="px-1.5 py-0.5 bg-blue-900 text-cyan-300 text-[10px] font-bold">EST. 1980</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed mb-3">
                The premier consumer telecomputing service. Features the world's first commercial real-time public chat (<code className="text-yellow-400">GO CB</code>), live UPI news wire, ASCII weather radar, and hourly billing meter ($6.00/hr connect rate).
              </p>
              <div className="bg-black/60 p-2 bevel-sunken text-[11px] text-cyan-300 font-mono mb-3 space-y-0.5">
                <div>&bull; <strong>GO Codes:</strong> GO CB, GO WEATHER, GO NEWS, GO GAMES</div>
                <div>&bull; <strong>Interface:</strong> Videotex Menus & ASCII Terminal</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('http://www.compuserve.com/cis')}
              className="bevel-button w-full py-1.5 bg-blue-700 text-white hover:bg-blue-600 font-pixel text-[10px] font-bold flex items-center justify-center gap-2"
            >
              <span>🌐</span> CONNECT TO COMPUSERVE (1980) &rarr;
            </button>
          </div>

          {/* 2. Quantum Link C64 (1985) */}
          <div className="bevel-raised p-4 bg-[#141842] text-white border-2 border-indigo-400 flex flex-col justify-between hover:border-yellow-400 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-sm text-cyan-300">QUANTUM LINK (Q-LINK)</span>
                <span className="px-1.5 py-0.5 bg-indigo-900 text-yellow-300 text-[10px] font-bold">EST. 1985</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed mb-3">
                Built exclusively for the Commodore 64 and 128 by Quantum Computer Services (which later rebranded to AOL!). Features authentic C64 blue styling, PETSCII banners, People Connection chat, and floppy disk downloads.
              </p>
              <div className="bg-[#4044b4] p-2 text-[11px] text-[#8488e0] font-pixel mb-3 border border-indigo-300/40">
                <div>**** COMMODORE 64 TELECOMMUNICATIONS ****</div>
                <div className="text-[9px] text-yellow-300 mt-1">38911 BASIC BYTES FREE &bull; 6502 CPU &bull; SID AUDIO</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('http://qlink.c64.net/portal')}
              className="bevel-button w-full py-1.5 bg-indigo-700 text-white hover:bg-indigo-600 font-pixel text-[10px] font-bold flex items-center justify-center gap-2"
            >
              <span>🕹️</span> BOOT QUANTUM LINK C64 (1985) &rarr;
            </button>
          </div>

          {/* 3. The WELL (1985) */}
          <div className="bevel-raised p-4 bg-[#101f14] text-white border-2 border-emerald-500 flex flex-col justify-between hover:border-yellow-400 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-sm text-emerald-300">THE WELL (WHOLE EARTH)</span>
                <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] font-bold">EST. 1985</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed mb-3">
                The Whole Earth 'Lectronic Link founded in Sausalito by Stewart Brand. Legendary gathering place of hackers, cyberpunks, deadheads, and writers. Pioneer of online community culture ("You Own Your Own Words").
              </p>
              <div className="bg-black/60 p-2 bevel-sunken text-[11px] text-emerald-400 font-mono mb-3 space-y-0.5">
                <div>&bull; <strong>Conferences:</strong> Virtual Communities, Cyberpunk, Whole Earth, Grateful Dead</div>
                <div>&bull; <strong>System:</strong> UNIX PicoSpan / Picoconf Dialup</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('http://thewell.org/conferences')}
              className="bevel-button w-full py-1.5 bg-emerald-700 text-white hover:bg-emerald-600 font-pixel text-[10px] font-bold flex items-center justify-center gap-2"
            >
              <span>🌲</span> DIAL SAUSALITO WELL BBS (1985) &rarr;
            </button>
          </div>

          {/* 4. info.cern.ch (1989-1991) */}
          <div className="bevel-raised p-4 bg-[#1f1f23] text-white border-2 border-purple-400 flex flex-col justify-between hover:border-yellow-400 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-sm text-purple-300">info.cern.ch (ORIGINAL W3)</span>
                <span className="px-1.5 py-0.5 bg-purple-950 text-cyan-300 text-[10px] font-bold">EST. 1989-91</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed mb-3">
                The very first website in human history, hosted on Tim Berners-Lee's NeXT computer at CERN, Geneva. View the original hypertext proposal, the CERN server directory, and the birth of HTML and green hyperlinks.
              </p>
              <div className="bg-white p-2 text-[11px] text-black font-serif mb-3 border border-gray-400">
                <div className="font-bold">WorldWideWeb: Executive Summary</div>
                <div className="text-[10px] text-gray-700 font-sans mt-0.5">
                  "The WorldWideWeb (W3) is a wide-area hypermedia information retrieval initiative..."
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('http://info.cern.ch/hypertext/WWW/TheProject.html')}
              className="bevel-button w-full py-1.5 bg-purple-800 text-white hover:bg-purple-700 font-pixel text-[10px] font-bold flex items-center justify-center gap-2"
            >
              <span>⚛️</span> VIEW ORIGINAL CERN WEB (1989) &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Modem Speed Calculator Benchmark */}
      <div className="bevel-raised p-4 bg-[var(--window-bg)] text-[var(--text-main)]">
        <div className="flex items-center justify-between border-b border-gray-400/50 pb-2 mb-3">
          <div className="font-pixel text-xs text-yellow-500 uppercase flex items-center gap-2">
            <span>⚡</span> VINTAGE MODEM SPEED BENCHMARK (1980 vs TODAY)
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-gray-500">File Size:</span>
            {[100, 500, 1024, 5120].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedFileSizeKb(size)}
                className={`bevel-button px-2 py-0.5 text-[10px] font-bold ${
                  selectedFileSizeKb === size ? 'active bg-blue-700 text-white' : ''
                }`}
              >
                {size >= 1024 ? `${size / 1024} MB` : `${size} KB`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-400 bg-black/10">
                <th className="p-2">Connection Type</th>
                <th className="p-2">Speed (Baud / Bps)</th>
                <th className="p-2">Download Time ({selectedFileSizeKb >= 1024 ? `${selectedFileSizeKb / 1024} MB` : `${selectedFileSizeKb} KB`})</th>
                <th className="p-2">Era Context</th>
              </tr>
            </thead>
            <tbody>
              {MODEM_BENCHMARKS.map((modem, idx) => (
                <tr key={idx} className="border-b border-gray-300/30 hover:bg-black/5 font-mono">
                  <td className="p-2 font-bold">{modem.name}</td>
                  <td className="p-2">{modem.speedBps.toLocaleString()} bytes/sec</td>
                  <td className={`p-2 font-bold ${modem.color}`}>
                    {calculateTime(modem.speedBps, selectedFileSizeKb)}
                  </td>
                  <td className="p-2 text-gray-500 text-[11px]">
                    {idx === 0 && 'Early acoustic coupler telephone cradle'}
                    {idx === 1 && 'Bell 212A standard for CompuServe & BBS'}
                    {idx === 2 && 'High-speed telecomputing milestone'}
                    {idx === 3 && 'Peak dialup speed of Web 1.0 era'}
                    {idx === 4 && 'Modern ultra-fast fiber optics'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Facts & Lore Ticker */}
      <div className="bevel-sunken p-3 bg-black/85 text-yellow-300 space-y-2 border border-yellow-600/40">
        <div className="font-pixel text-[10px] text-cyan-400 flex items-center gap-1.5">
          <span>📜</span> DID YOU KNOW? TELECOMPUTING TRIVIA (1980-1989):
        </div>
        <ul className="space-y-1 text-xs text-gray-300 font-mono list-disc list-inside">
          <li><strong>The CB Simulator (1980):</strong> Created by Alexander "Sandy" Trevor at CompuServe, inspired by citizen band radio slang like "Handle" and "Channels".</li>
          <li><strong>From Q-Link to AOL:</strong> Quantum Link founders Steve Case and Jim Kimsey renamed their company to America Online in October 1989.</li>
          <li><strong>Minitel Phenomenon:</strong> By 1986, France had distributed free Minitel videotex terminals to millions of households, generating billions in telecomputing commerce a decade before the web.</li>
          <li><strong>The NeXT Server:</strong> Tim Berners-Lee wrote the first web server (httpd) and the first web browser/editor (WorldWideWeb) on a NeXTcube in autumn 1990.</li>
        </ul>
      </div>
    </div>
  );
}
