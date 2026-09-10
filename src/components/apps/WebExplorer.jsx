import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';

const WEBRING_SITES = [
  { name: 'Silicon Alley BBS', url: 'http://silicon.alley.bbs/index.html', category: 'Hacker Culture', owner: 'CyberKnight' },
  { name: 'NeoTokyo Geocities / Area51', url: 'http://geocities.com/Area51/Vault99', category: 'Sci-Fi & Anime', owner: 'Rei_Ayanami_98' },
  { name: 'Underground Chiptune Archives', url: 'http://modarchive.net/tracker-hub', category: 'Tracker Music', owner: 'DJ_Byte' },
  { name: 'Retro Web Design Manifesto', url: 'http://w3c-revival.org/clean-html', category: 'Web Dev', owner: 'SirTim95' }
];

export default function WebExplorer({ onLaunchApp }) {
  const [url, setUrl] = useState('http://www.hyperlink98.net/welcome.htm');
  const [visitorCount, setVisitorCount] = useState(133742);
  const [isReloading, setIsReloading] = useState(false);
  const [webringIndex, setWebringIndex] = useState(0);

  // Poll state
  const [pollVotes, setPollVotes] = useState({
    netscape: 642,
    ie4: 318,
    mosaic: 142,
    lynx: 95
  });
  const [hasVoted, setHasVoted] = useState(false);

  // Guestbook state
  const [guestbookEntries, setGuestbookEntries] = useState([
    {
      id: 1,
      author: 'xX_CyberRider_99_Xx',
      avatar: '🛹',
      location: 'GeoCities / SiliconValley / 404',
      date: '10/09/1998 14:23:01',
      message: 'Awesome website dude!! Love the background music and the visitor counter. Added to my Netscape bookmarks!'
    },
    {
      id: 2,
      author: 'SailorPixel_Tokyo',
      avatar: '🌙',
      location: 'Tokyo BBS Net',
      date: '08/04/1998 09:12:44',
      message: 'Greetings from Japan! Best viewed in 1024x768. Please sign my guestbook back when you get a chance!'
    },
    {
      id: 3,
      author: 'SysAdmin_Dave',
      avatar: '🧙‍♂️',
      location: 'Underground IRC Server',
      date: '05/01/1998 23:59:59',
      message: 'The Y2K fix is being prepared. Keep the 56k modems screaming!'
    }
  ]);

  const [authorInput, setAuthorInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👾');

  const handleReload = () => {
    soundManager.playClick();
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 600);
  };

  const handleHitCounter = () => {
    soundManager.playClick();
    setVisitorCount(prev => prev + 1);
  };

  const handleVote = (browserKey) => {
    if (hasVoted) return;
    soundManager.playClick();
    setPollVotes(prev => ({
      ...prev,
      [browserKey]: prev[browserKey] + 1
    }));
    setHasVoted(true);
  };

  const handleGuestbookSubmit = (e) => {
    e.preventDefault();
    if (!authorInput.trim() || !messageInput.trim()) return;

    soundManager.playClick();
    const newEntry = {
      id: Date.now(),
      author: authorInput.trim(),
      avatar: selectedAvatar,
      location: 'Information Superhighway',
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      message: messageInput.trim()
    };

    setGuestbookEntries([newEntry, ...guestbookEntries]);
    setAuthorInput('');
    setMessageInput('');
  };

  const currentWebring = WEBRING_SITES[webringIndex];
  const totalVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col h-full bg-[var(--window-bg)] text-[var(--text-main)] overflow-y-auto">
      {/* 90s Browser Toolbar */}
      <div className="bevel-raised p-1.5 mb-2 bg-[var(--btn-face)] flex flex-col gap-1.5 shrink-0">
        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => soundManager.playClick()}
            className="bevel-button px-2 py-1 flex items-center gap-1 font-bold text-[11px]"
          >
            <span>⬅️</span> Back
          </button>
          <button
            type="button"
            onClick={() => soundManager.playClick()}
            className="bevel-button px-2 py-1 flex items-center gap-1 font-bold text-[11px]"
          >
            Forward <span>➡️</span>
          </button>
          <button
            type="button"
            onClick={handleReload}
            className="bevel-button px-2 py-1 flex items-center gap-1 font-bold text-[11px]"
          >
            <span className={isReloading ? 'animate-spin' : ''}>🔄</span> Reload
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setUrl('http://www.hyperlink98.net/welcome.htm');
            }}
            className="bevel-button px-2 py-1 flex items-center gap-1 font-bold text-[11px]"
          >
            <span>🏠</span> Home
          </button>
          <button
            type="button"
            onClick={() => soundManager.playDialup()}
            className="bevel-button px-2 py-1 flex items-center gap-1 font-bold text-[11px] bg-amber-200 text-black hover:bg-amber-300"
            title="Simulate 56k Dial-Up Modem Handshake"
          >
            <span>⚡</span> 56K Connect!
          </button>

          {/* Netscape Spinning Planet Throbber */}
          <div className="ml-auto flex items-center gap-2 bevel-sunken px-2 py-0.5 bg-black">
            <div className={`text-base ${isReloading ? 'animate-spin' : 'animate-pulse'}`}>
              🌍
            </div>
            <span className="font-pixel text-[9px] text-cyan-400 hidden sm:inline">ONLINE</span>
          </div>
        </div>

        {/* Address / Location Bar */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold shrink-0 opacity-80 text-[11px]">Location:</span>
          <div className="bevel-sunken flex-1 flex items-center px-2 py-1 bg-white text-black font-mono text-xs">
            <span className="text-gray-400 mr-1">🌐</span>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent outline-none text-blue-900 font-bold"
            />
          </div>
          <button
            type="button"
            onClick={handleReload}
            className="bevel-button px-3 py-1 font-bold text-[11px]"
          >
            Go!
          </button>
        </div>
      </div>

      {/* Breaking Marquee Ticker */}
      <div className="bevel-sunken bg-black text-lime-400 py-1 px-2 mb-3 overflow-hidden font-mono text-xs border border-lime-800">
        <div className="animate-marquee font-bold">
          ⚡ 1998 CYBER NEWS: Information Superhighway traffic up 400% • Netscape Communicator 4.5 Released • MP3 file format revolutionizes audio sharing • Y2K bug containment protocols in effect • Winamp 2.0 released worldwide • Welcome to HYPERLINK '98 Web Portal! ⚡
        </div>
      </div>

      {/* Main Page Content Body */}
      <div className="space-y-6 pb-6 pr-1">
        {/* Hero Banner Section */}
        <div className="bevel-raised p-4 sm:p-6 bg-gradient-to-b from-[#0b0c2a] via-[#161743] to-[#0b0c2a] text-center border-2 border-cyan-400 shadow-xl relative overflow-hidden">
          {/* Animated Hazard Under Construction Tape */}
          <div className="hazard-stripes text-black font-pixel text-[10px] font-black py-1 tracking-widest uppercase mb-4 shadow-md">
            ⚠️ UNDER CONSTRUCTION &bull; BEST VIEWED IN NETSCAPE 4.0 &bull; 1024x768 ⚠️
          </div>

          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-2xl animate-bounce">⭐</span>
            <span className="font-pixel text-xs text-yellow-300 tracking-widest">
              WELCOME TO THE 21ST CENTURY
            </span>
            <span className="text-2xl animate-bounce">⭐</span>
          </div>

          {/* 3D Chrome Title */}
          <h1 className="font-pixel text-2xl sm:text-4xl text-gold-chrome font-black tracking-wider my-3 uppercase">
            HYPERLINK '98
          </h1>

          <p className="text-cyan-300 text-sm sm:text-base font-bold tracking-wide max-w-2xl mx-auto mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            The Premier Cyber-Portal & Interactive Web OS for the Information Superhighway.
            Experience the golden age of Web 1.0 reimagined with modern 2026 responsiveness.
          </p>

          {/* Quick Launch Action Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 my-4">
            <button
              type="button"
              onClick={() => onLaunchApp?.('win-pulse')}
              className="bevel-button px-3 py-1.5 bg-purple-900 text-cyan-200 hover:bg-purple-800 font-pixel text-[10px] flex items-center gap-1.5"
            >
              <span>📻</span> Launch Chiptune Player
            </button>
            <button
              type="button"
              onClick={() => onLaunchApp?.('arcade')}
              className="bevel-button px-3 py-1.5 bg-emerald-900 text-lime-200 hover:bg-emerald-800 font-pixel text-[10px] flex items-center gap-1.5"
            >
              <span>👾</span> Play Space Arcade
            </button>
            <button
              type="button"
              onClick={() => onLaunchApp?.('terminal')}
              className="bevel-button px-3 py-1.5 bg-blue-900 text-yellow-200 hover:bg-blue-800 font-pixel text-[10px] flex items-center gap-1.5"
            >
              <span>💻</span> Open BBS Terminal
            </button>
          </div>

          {/* 7-Segment LED Visitor Counter */}
          <div className="inline-flex flex-col items-center gap-1 p-2 bevel-sunken bg-black/80 mt-2">
            <span className="font-pixel text-[9px] text-gray-400 uppercase tracking-widest">
              Official Cyber-Visitor Counter
            </span>
            <div className="flex items-center gap-2">
              <div className="led-counter text-xl sm:text-2xl font-mono font-bold">
                {String(visitorCount).padStart(8, '0')}
              </div>
              <button
                type="button"
                onClick={handleHitCounter}
                className="bevel-button px-2 py-1 text-[10px] font-bold bg-amber-500 text-black hover:bg-amber-400"
                title="Click to add a hit to the visitor counter!"
              >
                +1 Hit!
              </button>
            </div>
          </div>
        </div>

        {/* 90s Web Badge Wall */}
        <div className="bevel-sunken p-3 bg-black/40 flex flex-wrap items-center justify-center gap-3">
          <div className="bevel-raised px-2 py-1 bg-gradient-to-r from-blue-950 to-blue-900 text-[10px] font-pixel text-cyan-300 flex items-center gap-1 border border-cyan-500">
            <span>🌐</span> Netscape Now! 4.0
          </div>
          <div className="bevel-raised px-2 py-1 bg-gradient-to-r from-amber-950 to-amber-900 text-[10px] font-pixel text-yellow-300 flex items-center gap-1 border border-yellow-500">
            <span>💾</span> Made with Notepad
          </div>
          <div className="bevel-raised px-2 py-1 bg-gradient-to-r from-emerald-950 to-emerald-900 text-[10px] font-pixel text-lime-300 flex items-center gap-1 border border-emerald-500">
            <span>⚡</span> 100% Dial-Up Ready
          </div>
          <div className="bevel-raised px-2 py-1 bg-gradient-to-r from-pink-950 to-pink-900 text-[10px] font-pixel text-pink-300 flex items-center gap-1 border border-pink-500">
            <span>🛡️</span> Y2K Compliant
          </div>
          <div className="bevel-raised px-2 py-1 bg-gradient-to-r from-indigo-950 to-indigo-900 text-[10px] font-pixel text-indigo-300 flex items-center gap-1 border border-indigo-500">
            <span>☕</span> Powered by Java & CyberCoffee
          </div>
        </div>

        {/* 4 Feature Cards with Retro Bevels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: 56k Dial-Up */}
          <div className="bevel-raised p-4 bg-[var(--window-bg)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⚡</span>
                <h3 className="font-pixel text-xs text-yellow-400 uppercase">
                  56K Dial-Up Protocol
                </h3>
              </div>
              <p className="text-xs opacity-90 leading-relaxed mb-3">
                Remember waiting 45 seconds for a single JPEG to load line-by-line? The iconic modem handshake sound was the auditory gateway to infinite knowledge.
              </p>
            </div>
            <button
              type="button"
              onClick={() => soundManager.playDialup()}
              className="bevel-button px-3 py-1.5 text-xs font-bold w-full bg-amber-600 text-white hover:bg-amber-500 flex items-center justify-center gap-1"
            >
              <span>🔊</span> Play Dial-Up Handshake FX
            </button>
          </div>

          {/* Card 2: GeoCities & BBS */}
          <div className="bevel-raised p-4 bg-[var(--window-bg)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🏰</span>
                <h3 className="font-pixel text-xs text-cyan-400 uppercase">
                  Decentralized Webrings
                </h3>
              </div>
              <p className="text-xs opacity-90 leading-relaxed mb-3">
                Before search engine algorithms and algorithmic feeds, people discovered handcrafted passion sites through decentralized community Webrings.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-pink-400">
              Active Rings: 1,492 nodes online
            </div>
          </div>

          {/* Card 3: Chiptune & MIDI */}
          <div className="bevel-raised p-4 bg-[var(--window-bg)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🎹</span>
                <h3 className="font-pixel text-xs text-pink-400 uppercase">
                  Procedural Chiptune Audio
                </h3>
              </div>
              <p className="text-xs opacity-90 leading-relaxed mb-3">
                Embedded SoundTracker modules and MIDI soundtracks provided the high-energy soundtrack for early cyber surfers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onLaunchApp?.('win-pulse')}
              className="bevel-button px-3 py-1.5 text-xs font-bold w-full bg-purple-600 text-white hover:bg-purple-500 flex items-center justify-center gap-1"
            >
              <span>📻</span> Open WinPulse Studio
            </button>
          </div>

          {/* Card 4: CRT Physics */}
          <div className="bevel-raised p-4 bg-[var(--window-bg)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📺</span>
                <h3 className="font-pixel text-xs text-lime-400 uppercase">
                  Phosphor CRT Displays
                </h3>
              </div>
              <p className="text-xs opacity-90 leading-relaxed mb-3">
                Cathode Ray Tube monitors smoothed raw pixels with glowing phosphor scanlines and soft RGB mask triads.
              </p>
            </div>
            <div className="text-xs font-mono text-lime-400 font-bold">
              Resolution: 1024x768 @ 75Hz Sync
            </div>
          </div>
        </div>

        {/* Webring Navigator Section */}
        <div className="bevel-raised p-4 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-purple-950/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-700 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪐</span>
              <div>
                <h3 className="font-pixel text-xs text-cyan-300">CYBER-WEBRING NETWORK</h3>
                <span className="text-[11px] opacity-75">Site #{webringIndex + 1} of {WEBRING_SITES.length}</span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setWebringIndex(prev => (prev > 0 ? prev - 1 : WEBRING_SITES.length - 1));
                }}
                className="bevel-button px-2.5 py-1 text-xs font-bold"
              >
                ◀ Prev Site
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setWebringIndex(Math.floor(Math.random() * WEBRING_SITES.length));
                }}
                className="bevel-button px-2.5 py-1 text-xs font-bold bg-pink-900 text-white"
              >
                🎲 Random
              </button>
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setWebringIndex(prev => (prev + 1) % WEBRING_SITES.length);
                }}
                className="bevel-button px-2.5 py-1 text-xs font-bold"
              >
                Next Site ▶
              </button>
            </div>
          </div>

          <div className="bevel-sunken p-3 bg-black/60 font-mono text-xs">
            <div className="text-yellow-400 font-bold text-sm mb-1">{currentWebring.name}</div>
            <div className="text-cyan-400 text-[11px] mb-1">{currentWebring.url}</div>
            <div className="text-gray-400 text-[11px]">
              Category: <span className="text-pink-300">{currentWebring.category}</span> | Webmaster: <span className="text-lime-300">{currentWebring.owner}</span>
            </div>
          </div>
        </div>

        {/* 90s Browser Wars Poll */}
        <div className="bevel-raised p-4 bg-[var(--window-bg)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="font-pixel text-xs text-yellow-300">
                CYBER-POLL: Which 90s Browser ruled supreme?
              </h3>
              <span className="text-[11px] opacity-75">Total votes cast: {totalVotes.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { id: 'netscape', name: 'Netscape Navigator 4.0', votes: pollVotes.netscape, color: 'bg-cyan-500' },
              { id: 'ie4', name: 'Internet Explorer 4.0', votes: pollVotes.ie4, color: 'bg-blue-600' },
              { id: 'mosaic', name: 'NCSA Mosaic', votes: pollVotes.mosaic, color: 'bg-amber-500' },
              { id: 'lynx', name: 'Lynx (Terminal Browser)', votes: pollVotes.lynx, color: 'bg-emerald-500' },
            ].map(item => {
              const pct = Math.round((item.votes / totalVotes) * 100);
              return (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{item.name}</span>
                    <span>{item.votes} ({pct}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bevel-sunken flex-1 h-5 bg-black overflow-hidden p-0.5">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full ${item.color} transition-all duration-500`}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={hasVoted}
                      onClick={() => handleVote(item.id)}
                      className={`bevel-button px-2 py-0.5 text-[10px] font-bold shrink-0 ${
                        hasVoted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 hover:text-black'
                      }`}
                    >
                      {hasVoted ? 'Voted' : 'Vote!'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Cyberspace Guestbook */}
        <div className="bevel-raised p-4 bg-[var(--window-bg)]">
          <div className="flex items-center justify-between border-b border-gray-600 pb-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✍️</span>
              <div>
                <h3 className="font-pixel text-xs text-pink-400">
                  CYBERSPACE GUESTBOOK
                </h3>
                <span className="text-[11px] opacity-75">Leave your mark on Web 1.0 history</span>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-lime-400">
              {guestbookEntries.length} Signatures
            </span>
          </div>

          {/* Add Message Form */}
          <form onSubmit={handleGuestbookSubmit} className="bevel-sunken p-3 bg-black/40 mb-4 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold mb-1 opacity-80">Your Cyber Alias / Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NeoHacker_98"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  className="bevel-sunken w-full px-2 py-1 bg-white text-black font-mono text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-1 opacity-80">Choose Avatar:</label>
                <div className="flex gap-2">
                  {['👾', '💾', '🌙', '🧙‍♂️', '🛹', '🤖', '🛸'].map(avatar => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedAvatar(avatar);
                      }}
                      className={`bevel-button w-8 h-8 flex items-center justify-center text-sm ${
                        selectedAvatar === avatar ? 'active bg-blue-600' : ''
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1 opacity-80">Message for the Guestbook:</label>
              <textarea
                required
                rows="2"
                placeholder="Greet fellow cyberspace travellers..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="bevel-sunken w-full px-2 py-1 bg-white text-black font-mono text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              className="bevel-button px-4 py-1.5 font-pixel text-[10px] bg-pink-700 text-white hover:bg-pink-600 font-bold"
            >
              ✍️ Sign the Guestbook!
            </button>
          </form>

          {/* Existing Signatures List */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {guestbookEntries.map(entry => (
              <div key={entry.id} className="bevel-sunken p-2.5 bg-black/70 text-xs font-mono">
                <div className="flex items-center justify-between text-[11px] border-b border-gray-800 pb-1 mb-1.5 text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{entry.avatar}</span>
                    <span className="font-bold text-yellow-300">{entry.author}</span>
                    <span className="opacity-60 hidden sm:inline">({entry.location})</span>
                  </div>
                  <span className="text-[10px] opacity-60">{entry.date}</span>
                </div>
                <p className="text-cyan-200 text-xs leading-relaxed">{entry.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs opacity-75 font-mono py-2">
          &copy; 1998-2026 HYPERLINK '98 &bull; Best viewed in 1024x768 resolution &bull; HTML 3.2 Certified
        </div>
      </div>
    </div>
  );
}
