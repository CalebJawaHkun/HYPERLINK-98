import React, { useState } from 'react';
import { soundManager } from '../../../utils/audio';

const C64_CHAT_MESSAGES = [
  { id: 1, user: 'C64_GURU', text: 'LOAD "*",8,1 IS ALL YOU NEED FOR COMPLETE ENLIGHTENMENT.' },
  { id: 2, user: 'DISK_SWAPPER_85', text: 'JUST REALIGNED MY 1541 FLOPPY DRIVE! READY TO TRADE DEMO DISKS.' },
  { id: 3, user: 'SID_SYNTH_FAN', text: 'THE MOS 6581 3-VOICE ANALOG FILTER SOUNDS INCREDIBLE OVER 1200 BAUD!' },
  { id: 4, user: 'COMMODORE_VIC', text: 'HELLO FROM CHICAGO! Q-LINK PEOPLE CONNECTION IS SO MUCH BETTER THAN LOCAL BBS.' },
];

const C64_SOFTWARE = [
  {
    id: 'giana',
    title: 'THE GREAT GIANA SISTERS',
    year: '1987',
    publisher: 'RAINBOW ARTS / CHRIS HUELSBECK',
    size: '170 KB (1541 DISK)',
    desc: 'Legendary C64 platformer celebrated for Chris Huelsbeck\'s iconic SID chiptune soundtrack.'
  },
  {
    id: 'mule',
    title: 'M.U.L.E.',
    year: '1983',
    publisher: 'ELECTRONIC ARTS / DAN BUNTE',
    size: '170 KB (1541 DISK)',
    desc: 'Seminal 4-player multiplayer economic strategy game on Planet Irata. Winner of Computer Game of the Year.'
  },
  {
    id: 'geos',
    title: 'GEOS GRAPHIC OS 2.0',
    year: '1986',
    publisher: 'BERKELEY SOFTWORKS',
    size: '340 KB (2 DISKS)',
    desc: 'Full GUI operating system for C64 featuring geoWrite, geoPaint, and mouse pointing support.'
  },
  {
    id: 'sidtracker',
    title: 'SID TRACKER SYNTH V1.2',
    year: '1985',
    publisher: 'QUANTUM LABS',
    size: '85 KB (PROGRAM FILE)',
    desc: 'Direct register programming tool for the MOS 6581 sound synthesizer chip with ADSR controls.'
  }
];

export default function QLinkPage({ onLaunchApp }) {
  const [activeTab, setActiveTab] = useState('chat'); // chat, software, specs
  const [chatMessages, setChatMessages] = useState(C64_CHAT_MESSAGES);
  const [userHandle, setUserHandle] = useState('USER_64');
  const [chatInput, setChatInput] = useState('');
  const [loadingDisk, setLoadingDisk] = useState(null);
  const [loadStatus, setLoadStatus] = useState('');

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    soundManager.playSidArp();

    const newMsg = {
      id: Date.now(),
      user: (userHandle.trim() || 'USER_64').toUpperCase(),
      text: chatInput.trim().toUpperCase()
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Simulated C64 user response
    setTimeout(() => {
      const replies = [
        'AFFIRMATIVE! Q-LINK NETWORK TRAFFIC IS HIGH TONIGHT.',
        'RUNNING BASIC 2.0 ON A 1702 COLOR MONITOR.',
        'DID YOU HEAR QUANTUM SERVICES IS EXPANDING NATIONWIDE?'
      ];
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          user: 'SYSOP_C64',
          text: replies[Math.floor(Math.random() * replies.length)]
        }
      ]);
      soundManager.playSidArp();
    }, 1100);
  };

  const handleDownloadDisk = (sw) => {
    soundManager.playFloppyDrive();
    setLoadingDisk(sw.id);
    setLoadStatus('SEARCHING FOR ' + sw.title.slice(0, 10) + ' ...');

    setTimeout(() => {
      setLoadStatus('LOADING ...');
    }, 900);

    setTimeout(() => {
      soundManager.playSidArp();
      setLoadStatus('READY. RUN (DISK LOADED)');
      setTimeout(() => {
        setLoadingDisk(null);
        setLoadStatus('');
      }, 1500);
    }, 2200);
  };

  const handlePlaySidMusic = () => {
    soundManager.playSidArp();
    if (onLaunchApp) {
      onLaunchApp('win-pulse');
    }
  };

  return (
    <div className="c64-frame p-3 sm:p-5 select-text font-pixel text-xs min-h-[460px]">
      <div className="c64-inner p-3 sm:p-4 space-y-4">
        {/* Authentic C64 Header Banner */}
        <div className="text-center space-y-1 border-b-2 border-[#8488e0] pb-3">
          <div className="text-xs sm:text-sm text-[#8488e0] font-black tracking-widest">
            **** COMMODORE 64 TELECOMMUNICATIONS NETWORK ****
          </div>
          <div className="text-[10px] text-yellow-300">
            QUANTUM LINK (C) 1985 QUANTUM COMPUTER SERVICES INC.
          </div>
          <div className="text-[9px] text-[#a0a4ff]">
            64K RAM SYSTEM &bull; 38911 BASIC BYTES FREE &bull; 1200 BAUD CONNECTED
          </div>
          <div className="text-[10px] text-emerald-300 pt-1">
            READY. <span className="c64-cursor" aria-hidden="true" />
          </div>
        </div>

        {/* C64 Mode Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setActiveTab('chat'); }}
            className={`px-3 py-1 text-[10px] font-bold border-2 transition-colors ${
              activeTab === 'chat'
                ? 'bg-[#8488e0] text-[#4044b4] border-white'
                : 'bg-[#292c7d] text-[#8488e0] border-[#8488e0] hover:bg-[#35399c]'
            }`}
          >
            [ 1. PEOPLE CONNECTION ]
          </button>

          <button
            type="button"
            onClick={() => { soundManager.playClick(); setActiveTab('software'); }}
            className={`px-3 py-1 text-[10px] font-bold border-2 transition-colors ${
              activeTab === 'software'
                ? 'bg-[#8488e0] text-[#4044b4] border-white'
                : 'bg-[#292c7d] text-[#8488e0] border-[#8488e0] hover:bg-[#35399c]'
            }`}
          >
            [ 2. COMMODORE SOFTWARE ]
          </button>

          <button
            type="button"
            onClick={() => { soundManager.playClick(); setActiveTab('specs'); }}
            className={`px-3 py-1 text-[10px] font-bold border-2 transition-colors ${
              activeTab === 'specs'
                ? 'bg-[#8488e0] text-[#4044b4] border-white'
                : 'bg-[#292c7d] text-[#8488e0] border-[#8488e0] hover:bg-[#35399c]'
            }`}
          >
            [ 3. HARDWARE ARCHITECTURE ]
          </button>

          <button
            type="button"
            onClick={handlePlaySidMusic}
            className="px-3 py-1 text-[10px] font-bold border-2 bg-pink-900 text-yellow-300 border-yellow-400 hover:bg-pink-800"
            title="Open WinPulse and play C64 SID Symphony chiptune"
          >
            [ 📻 PLAY SID TRACK IN WINPULSE ]
          </button>
        </div>

        {/* TAB 1: PEOPLE CONNECTION CHAT */}
        {activeTab === 'chat' && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-[#8488e0]/60 pb-1 text-[10px]">
              <span className="text-yellow-300">ROOM: COMMODORE LOBBY 01</span>
              <div className="flex items-center gap-1.5">
                <span>HANDLE:</span>
                <input
                  type="text"
                  value={userHandle}
                  onChange={(e) => setUserHandle(e.target.value)}
                  className="bg-[#292c7d] text-yellow-300 px-1 py-0.5 outline-none uppercase text-[10px] w-24 border border-[#8488e0]"
                />
              </div>
            </div>

            {/* Chat Messages */}
            <div className="bg-[#2a2d7d] p-3 border-2 border-[#8488e0] h-60 overflow-y-auto space-y-2 text-[10px]">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="leading-relaxed">
                  <span className="text-yellow-300 font-bold">&lt;{msg.user}&gt; </span>
                  <span className="text-white">{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <span className="self-center text-yellow-300 text-[10px]">INPUT:</span>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="TYPE C64 MESSAGE..."
                className="flex-1 bg-[#2a2d7d] text-white p-1.5 text-[10px] uppercase outline-none border border-[#8488e0]"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-[#8488e0] text-[#4044b4] font-bold text-[10px] hover:bg-white"
              >
                RETURN
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: COMMODORE SOFTWARE LIBRARY */}
        {activeTab === 'software' && (
          <div className="space-y-3 pt-2">
            <div className="text-[10px] text-yellow-300 border-b border-[#8488e0]/60 pb-1">
              COMMODORE DISK IMAGES (.D64) &bull; 1541 DRIVE DOWNLOAD SIMULATOR
            </div>

            {loadingDisk && (
              <div className="p-3 bg-black text-yellow-300 border-2 border-yellow-400 text-center animate-pulse text-xs">
                <div>[ 1541 FLOPPY DRIVE ACTIVE ]</div>
                <div className="text-white mt-1">{loadStatus}</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {C64_SOFTWARE.map((sw) => (
                <div
                  key={sw.id}
                  className="p-3 bg-[#2a2d7d] border-2 border-[#8488e0] space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-yellow-300 font-bold text-[11px]">{sw.title}</div>
                    <div className="text-[9px] text-[#a0a4ff] mt-0.5">
                      {sw.year} &bull; {sw.publisher}
                    </div>
                    <p className="text-white text-[9px] leading-relaxed mt-1.5">
                      {sw.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#8488e0]/40 flex items-center justify-between">
                    <span className="text-[9px] text-yellow-300">{sw.size}</span>
                    <button
                      type="button"
                      disabled={loadingDisk === sw.id}
                      onClick={() => handleDownloadDisk(sw)}
                      className="px-2 py-1 bg-[#8488e0] text-[#4044b4] hover:bg-white text-[9px] font-bold"
                    >
                      {loadingDisk === sw.id ? 'LOADING...' : 'LOAD "*,8,1"'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HARDWARE SPECS */}
        {activeTab === 'specs' && (
          <div className="p-3 bg-[#2a2d7d] border-2 border-[#8488e0] space-y-3 text-[10px] leading-relaxed">
            <div className="text-yellow-300 font-bold text-xs border-b border-[#8488e0]/60 pb-1">
              COMMODORE 64 SYSTEM HARDWARE SPECIFICATIONS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white">
              <div>
                <strong className="text-yellow-300">&bull; CPU:</strong> MOS 6510 running at 1.023 MHz (NTSC) / 0.985 MHz (PAL).
              </div>
              <div>
                <strong className="text-yellow-300">&bull; MEMORY:</strong> 64 KB RAM + 20 KB ROM (BASIC V2.0 and KERNAL).
              </div>
              <div>
                <strong className="text-yellow-300">&bull; GRAPHICS:</strong> MOS 6567/6569 VIC-II, 320x200 high-res, 16 fixed colors, 8 hardware sprites.
              </div>
              <div>
                <strong className="text-yellow-300">&bull; AUDIO:</strong> MOS 6581 SID (Sound Interface Device), 3 independent voices, 4 waveforms, multi-mode analog filter.
              </div>
              <div>
                <strong className="text-yellow-300">&bull; STORAGE:</strong> Commodore 1541 5.25" Single-Sided Floppy Drive (170 KB capacity).
              </div>
              <div>
                <strong className="text-yellow-300">&bull; MODEM:</strong> Commodore 1660 / 1670 1200 Baud Cartridge Modem.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
