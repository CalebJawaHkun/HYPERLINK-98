import React, { useState, useEffect, useCallback } from 'react';
import { soundManager } from '../../utils/audio';

import TelecomputingHub from './eighties/TelecomputingHub';
import CompuservePage from './eighties/CompuservePage';
import QLinkPage from './eighties/QLinkPage';
import TheWellPage from './eighties/TheWellPage';
import CernPage from './eighties/CernPage';

const WEBRING_SITES = [
  { name: 'Silicon Alley BBS', url: 'http://silicon.alley.bbs/index.html', category: 'Hacker Culture', owner: 'CyberKnight' },
  { name: 'NeoTokyo Geocities / Area51', url: 'http://www.geocities.com/area51/vault99.htm', category: 'Sci-Fi & UFOs', owner: 'Rei_Ayanami_98' },
  { name: 'Napster MP3 Underground', url: 'http://www.napster98.net/search', category: 'MP3 Audio', owner: 'Shawn_Fanning_98' },
  { name: 'AltaVista Cyberspace Search', url: 'http://www.altavista98.com/web', category: 'Search Engine', owner: 'DEC_Labs' },
  { name: '1980s Telecomputing Archives', url: 'http://www.hyperlink98.net/80s-telecomputing.htm', category: '80s Time Machine', owner: 'SysOp_80' },
  { name: 'CompuServe (CIS 1980)', url: 'http://www.compuserve.com/cis', category: 'Online Service', owner: 'CompuServe_Inc' },
  { name: 'Quantum Link C64 (1985)', url: 'http://qlink.c64.net/portal', category: 'Commodore 64', owner: 'Quantum_Services' },
  { name: 'The WELL Sausalito (1985)', url: 'http://thewell.org/conferences', category: 'Whole Earth BBS', owner: 'Stewart_Brand' },
  { name: 'info.cern.ch (Original W3 1989)', url: 'http://info.cern.ch/hypertext/WWW/TheProject.html', category: 'First Website', owner: 'Tim_Berners_Lee' }
];

const NAPSTER_TRACKS = [
  { id: 1, title: "Cyberspace Drift '98.mp3", artist: "DJ Modulator", size: "3.2 MB", bitrate: "128 kbps", speed: "56k (4 mins)" },
  { id: 2, title: "Neon Highway 56k.mp3", artist: "Silicon Dreams", size: "4.1 MB", bitrate: "128 kbps", speed: "56k (5 mins)" },
  { id: 3, title: "Geocities Under Midnight.mp3", artist: "Pixel Master 99", size: "2.8 MB", bitrate: "112 kbps", speed: "56k (3 mins)" },
  { id: 4, title: "Silicon Alley BBS.mp3", artist: "ModArchive Pro", size: "3.5 MB", bitrate: "128 kbps", speed: "56k (4 mins)" },
  { id: 5, title: "Cyberpunk Neon Drive.mp3", artist: "Kavinsky 98", size: "4.8 MB", bitrate: "160 kbps", speed: "56k (6 mins)" },
  { id: 6, title: "Commodore 64 SID Symphony 1985.mp3", artist: "Rob Hubbard Tribute", size: "3.9 MB", bitrate: "128 kbps", speed: "1200 Baud (8 mins)" },
];

export default function WebExplorer({ onLaunchApp, targetUrlRequest }) {
  const [url, setUrl] = useState('http://www.hyperlink98.net/welcome.htm');
  const [history, setHistory] = useState(['http://www.hyperlink98.net/welcome.htm']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [visitorCount, setVisitorCount] = useState(133742);
  const [isReloading, setIsReloading] = useState(false);
  const [webringIndex, setWebringIndex] = useState(0);
  const [viewSourceOpen, setViewSourceOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [baudMode, setBaudMode] = useState('instant'); // 'instant' or '1200baud'

  // Napster state
  const [napsterQuery, setNapsterQuery] = useState('');
  const [downloadingTrack, setDownloadingTrack] = useState(null);

  // AltaVista search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

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
      message: 'Awesome website dude!! Love the background chiptunes and the visitor counter. Added to my Netscape bookmarks!'
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

  // Navigate helper
  const navigateTo = useCallback((newUrl) => {
    soundManager.playClick();
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 400);

    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      newHistory.push(newUrl);
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
    setUrl(newUrl);
    setBookmarksOpen(false);
  }, [historyIndex]);

  // Listen to external URL requests (e.g. from Desktop Icon or Start Menu)
  useEffect(() => {
    if (targetUrlRequest?.url) {
      const timer = setTimeout(() => {
        navigateTo(targetUrlRequest.url);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [targetUrlRequest, navigateTo]);

  const handleBack = () => {
    if (historyIndex > 0) {
      soundManager.playClick();
      const prevUrl = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setUrl(prevUrl);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      soundManager.playClick();
      const nextUrl = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setUrl(nextUrl);
    }
  };

  const handleReload = () => {
    soundManager.playClick();
    setIsReloading(true);
    setTimeout(() => {
      setIsReloading(false);
    }, 500);
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

  // Napster download simulation
  const handleNapsterDownload = (track) => {
    soundManager.playDialup();
    setDownloadingTrack(track.id);
    setTimeout(() => {
      setDownloadingTrack(null);
      onLaunchApp?.('win-pulse');
    }, 1500);
  };

  // AltaVista Search execution
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    soundManager.playClick();
    const q = searchQuery.toLowerCase();
    const results = [
      { title: "HYPERLINK '98 Cyberspace Portal", url: "http://www.hyperlink98.net/welcome.htm", desc: "The premier Web 1.0 cyberspace portal, visitor counter, chiptune player, and guestbook." },
      { title: "1980s Telecomputing Archives & Time Machine", url: "http://www.hyperlink98.net/80s-telecomputing.htm", desc: "The birth of online culture: CompuServe, Q-Link, The WELL, and Tim Berners-Lee's original CERN web project." },
      { title: "CompuServe (CIS 1980)", url: "http://www.compuserve.com/cis", desc: "First commercial public CB chat, UPI wire news, ASCII weather radar, and $6.00/hr connect charge." },
      { title: "Quantum Link (Q-Link C64 1985)", url: "http://qlink.c64.net/portal", desc: "Commodore 64 telecomputing network, People Connection lobby, and 1541 floppy disk downloads." },
      { title: "The WELL Sausalito (1985)", url: "http://thewell.org/conferences", desc: "Stewart Brand's Whole Earth BBS. Discussions on virtual communities, cyberpunks, and Grateful Dead." },
      { title: "info.cern.ch (Original World Wide Web 1989-1991)", url: "http://info.cern.ch/hypertext/WWW/TheProject.html", desc: "The world's first website hosted on Tim Berners-Lee's NeXTcube at CERN." },
      { title: "Area 51 Classified UFO Archives", url: "http://www.geocities.com/area51/vault99.htm", desc: "Declassified radar logs, Roswell sightings, and alien communication frequencies." },
      { title: "Napster '98 MP3 Audio Sharing", url: "http://www.napster98.net/search", desc: "Search millions of 56k-optimized 8-bit and 16-bit chiptune MP3s." },
      { title: "Silicon Alley BBS & Hacker Hub", url: "http://silicon.alley.bbs/index.html", desc: "VT100 terminal commands, modem dialing, and 90s ASCII demoscene archives." },
    ].filter(item => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || q === '');

    setSearchResults(results);
  };

  // HTML Source Code generator for active page
  const getSourceCode = () => {
    if (url.includes('80s-telecomputing')) {
      return `<!DOCTYPE HTML SYSTEM "legacy/telecomputing.dtd">
<!-- 1980s Telecomputing Archive Hub -->
<HTML>
<HEAD>
  <TITLE>1980s Online Archives & Time Machine</TITLE>
</HEAD>
<BODY BGCOLOR="#1a0f30" TEXT="#ffd700" LINK="#00ffff">
  <H1>1980s TELECOMPUTING TIME MACHINE</H1>
  <P>Modem: Bell 212A 1200 Baud Standard</P>
  <UL>
    <LI><A HREF="http://www.compuserve.com/cis">CompuServe 1980 (GO CB)</A></LI>
    <LI><A HREF="http://qlink.c64.net/portal">Quantum Link C64 1985</A></LI>
    <LI><A HREF="http://thewell.org/conferences">The WELL Sausalito 1985</A></LI>
    <LI><A HREF="http://info.cern.ch/hypertext/WWW/TheProject.html">info.cern.ch CERN 1989</A></LI>
  </UL>
</BODY>
</HTML>`;
    }
    if (url.includes('compuserve')) {
      return `VIDEOTEX / CIS DIALUP STREAM
=============================================
COMPUSERVE INFORMATION SERVICE (CIS)
(C) 1980 COMPUSERVE INCORPORATED
CONNECT RATE: $6.00/HOUR PRIME TIME
PORT: 1200 BAUD FSK
=============================================
GO CB: CB SIMULATOR (CHANNEL 1 ACTIVE)
GO WEATHER: NATIONAL ASCII WEATHER RADAR
GO NEWS: UPI EXECUTIVE WIRE DISPATCHES
GO GAMES: HANGMAN TELECOMPUTING GAME
READY.`;
    }
    if (url.includes('qlink')) {
      return `**** COMMODORE 64 TELECOMMUNICATIONS ****
QUANTUM LINK (C) 1985 QUANTUM COMPUTER SERVICES
64K RAM SYSTEM  38911 BASIC BYTES FREE

10 PRINT "**** QUANTUM LINK C64 NETWORK ****"
20 POKE 53280,14: POKE 53281,6
30 LOAD "PEOPLE CONNECTION",8,1
40 SYS 49152
READY.
RUN`;
    }
    if (url.includes('thewell')) {
      return `The Whole Earth 'Lectronic Link
Sausalito, California - (415) 332-6106
UNIX PicoSpan v2.4

Conferences:
1. Virtual Communities (hlr)
2. Cyberpunk & Hackers (barlow)
3. Whole Earth Catalog (sb)
4. Grateful Dead (dgans)

"You own your own words."
Ok:`;
    }
    if (url.includes('info.cern.ch')) {
      return `<HEADER>
<TITLE>The World Wide Web project</TITLE>
<NEXTID N="55">
</HEADER>
<BODY>
<H1>World Wide Web</H1>The WorldWideWeb (W3) is a wide-area<A
NAME=0 HREF="WhatIs.html">
hypermedia</A> information retrieval
initiative aiming to give universal
access to a large universe of documents.<P>
Everything there is online about
W3 is linked directly or indirectly
to this document, including an <A
NAME=24 HREF="Summary.html">executive
summary</A> of the project, <A
NAME=29 HREF="Administration/Mailing/Overview.html">Mailing lists</A>
, <A
NAME=25 HREF="Policy.html">Policy</A> , November's  <A
NAME=34 HREF="News/9211.html">W3  news</A> ,
<A
NAME=41 HREF="FAQ/List.html">Frequently Asked Questions</A> .
</BODY>`;
    }
    if (url.includes('area51')) {
      return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<HTML>
<HEAD>
  <TITLE>AREA 51 // VAULT 99 // CLASSIFIED</TITLE>
  <META NAME="generator" CONTENT="Notepad.exe">
</HEAD>
<BODY BGCOLOR="#05070f" TEXT="#00ffff" LINK="#ff007f" VLINK="#39ff14">
  <CENTER>
    <H1><FONT COLOR="#ff007f">🛸 AREA 51 CLASSIFIED VAULT 99 🛸</FONT></H1>
    <P><MARQUEE>*** WARNING: MAJESTIC-12 LEVEL CLEARANCE REQUIRED ***</MARQUEE></P>
    <HR SIZE="3" COLOR="#00ffff">
    <TABLE BORDER="1" CELLPADDING="4" CELLSPACING="0">
      <TR><TD>PROJECT</TD><TD>STATUS</TD></TR>
      <TR><TD>Roswell Recovery</TD><TD>CLASSIFIED</TD></TR>
      <TR><TD>56k Quantum Link</TD><TD>ONLINE</TD></TR>
    </TABLE>
  </CENTER>
</BODY>
</HTML>`;
    }
    if (url.includes('napster')) {
      return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2//EN">
<HTML>
<HEAD>
  <TITLE>Napster '98 - MP3 Music Community</TITLE>
</HEAD>
<BODY BGCOLOR="#0c0d1c" TEXT="#ffffff" LINK="#00ffcc">
  <H2>NAPSTER '98 MP3 SEARCH</H2>
  <FORM ACTION="/search" METHOD="GET">
    <INPUT TYPE="text" NAME="q" VALUE="chiptune">
    <INPUT TYPE="submit" VALUE="Search 56k Network">
  </FORM>
</BODY>
</HTML>`;
    }
    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<HTML>
<HEAD>
  <TITLE>HYPERLINK '98 - Official Cyberspace Portal</TITLE>
  <META NAME="Author" CONTENT="Caleb Jawa Hkun">
</HEAD>
<BODY BGCOLOR="#0b0c2a" TEXT="#00ffcc" LINK="#ff007f" VLINK="#ffe600">
  <!-- 90s Cyberspace Table Layout -->
  <TABLE WIDTH="100%" BORDER="0" CELLSPACING="0" CELLPADDING="0">
    <TR>
      <TD ALIGN="CENTER">
        <H1>HYPERLINK '98</H1>
        <MARQUEE>Welcome to the 21st Century!</MARQUEE>
      </TD>
    </TR>
  </TABLE>
</BODY>
</HTML>`;
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
            onClick={handleBack}
            disabled={historyIndex <= 0}
            className={`bevel-button px-2 py-1 flex items-center gap-1 font-bold text-[11px] ${
              historyIndex <= 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>⬅️</span> Back
          </button>

          <button
            type="button"
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className={`bevel-button px-2 py-1 flex items-center gap-1 font-bold text-[11px] ${
              historyIndex >= history.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
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
            onClick={() => navigateTo('http://www.hyperlink98.net/welcome.htm')}
            className="bevel-button px-2 py-1 flex items-center gap-1 font-bold text-[11px]"
          >
            <span>🏠</span> Home
          </button>

          {/* Bookmarks Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { soundManager.playClick(); setBookmarksOpen(!bookmarksOpen); }}
              className="bevel-button px-2 py-1 flex items-center gap-1 font-bold text-[11px] bg-blue-900 text-white"
            >
              <span>📑</span> Bookmarks ▾
            </button>

            {bookmarksOpen && (
              <div className="absolute top-7 left-0 w-60 bevel-raised bg-[var(--btn-face)] z-50 p-1 shadow-2xl flex flex-col gap-0.5 text-xs">
                <div className="px-2 py-1 font-pixel text-[9px] text-gray-500 border-b border-gray-400">
                  NETSCAPE BOOKMARKS
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('http://www.hyperlink98.net/welcome.htm')}
                  className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
                >
                  🌐 HYPERLINK '98 Portal
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('http://www.geocities.com/area51/vault99.htm')}
                  className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
                >
                  🛸 GeoCities Area 51 Vault
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('http://www.napster98.net/search')}
                  className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
                >
                  🎧 Napster '98 MP3 Search
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('http://www.altavista98.com/web')}
                  className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
                >
                  🔍 AltaVista Search Engine
                </button>
                <div className="px-2 py-1 font-pixel text-[9px] text-yellow-500 border-t border-b border-gray-400 mt-1 bg-black/10">
                  💾 1980s TELECOMPUTING ARCHIVES
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('http://www.hyperlink98.net/80s-telecomputing.htm')}
                  className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white font-bold text-amber-900"
                >
                  💾 80s Time Machine Hub
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('http://www.compuserve.com/cis')}
                  className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
                >
                  🌐 CompuServe (CIS 1980)
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('http://qlink.c64.net/portal')}
                  className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
                >
                  🕹️ Quantum Link C64 (1985)
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('http://thewell.org/conferences')}
                  className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
                >
                  🌲 The WELL Sausalito (1985)
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('http://info.cern.ch/hypertext/WWW/TheProject.html')}
                  className="px-2 py-1 text-left hover:bg-[#000080] hover:text-white"
                >
                  ⚛️ info.cern.ch (Original W3)
                </button>
              </div>
            )}
          </div>

          {/* View Source Notepad button */}
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setViewSourceOpen(true); }}
            className="bevel-button px-2 py-1 flex items-center gap-1 font-bold text-[11px]"
            title="View HTML Source Code in Notepad"
          >
            <span>📄</span> View Source
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigateTo(url);
              }}
              className="w-full bg-transparent outline-none text-blue-900 font-bold"
            />
          </div>
          <button
            type="button"
            onClick={() => navigateTo(url)}
            className="bevel-button px-3 py-1 font-bold text-[11px]"
          >
            Go!
          </button>
        </div>

        {/* 1980s Vintage Telecomputing Quick-Bar */}
        <div className="bevel-sunken p-1.5 bg-[#171326] flex flex-wrap items-center gap-1.5 text-xs border border-amber-500/40">
          <div className="flex items-center gap-1 text-[10px] font-pixel text-yellow-300 pr-1.5 border-r border-amber-600/40 shrink-0">
            <span>💾</span>
            <span className="hidden sm:inline">1980s ARCHIVES:</span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('http://www.hyperlink98.net/80s-telecomputing.htm')}
            className={`bevel-button px-2 py-0.5 text-[10px] font-bold font-pixel flex items-center gap-1 ${
              url.includes('80s-telecomputing') ? 'active bg-amber-600 text-white' : 'bg-amber-950 text-yellow-300 hover:bg-amber-900'
            }`}
            title="Open 1980s Telecomputing Archives Time Machine"
          >
            <span>💾</span> 80s Hub
          </button>

          <button
            type="button"
            onClick={() => navigateTo('http://www.compuserve.com/cis')}
            className={`bevel-button px-2 py-0.5 text-[10px] font-bold font-pixel flex items-center gap-1 ${
              url.includes('compuserve') ? 'active bg-blue-700 text-white' : 'bg-blue-950 text-cyan-300 hover:bg-blue-900'
            }`}
            title="Connect to CompuServe (1980)"
          >
            <span>🌐</span> CompuServe 1980
          </button>

          <button
            type="button"
            onClick={() => navigateTo('http://qlink.c64.net/portal')}
            className={`bevel-button px-2 py-0.5 text-[10px] font-bold font-pixel flex items-center gap-1 ${
              url.includes('qlink') ? 'active bg-indigo-700 text-white' : 'bg-indigo-950 text-yellow-300 hover:bg-indigo-900'
            }`}
            title="Boot Quantum Link C64 (1985)"
          >
            <span>🕹️</span> Q-Link C64 1985
          </button>

          <button
            type="button"
            onClick={() => navigateTo('http://thewell.org/conferences')}
            className={`bevel-button px-2 py-0.5 text-[10px] font-bold font-pixel flex items-center gap-1 ${
              url.includes('thewell') ? 'active bg-emerald-700 text-white' : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
            }`}
            title="Dial into The WELL Sausalito BBS (1985)"
          >
            <span>🌲</span> The WELL 1985
          </button>

          <button
            type="button"
            onClick={() => navigateTo('http://info.cern.ch/hypertext/WWW/TheProject.html')}
            className={`bevel-button px-2 py-0.5 text-[10px] font-bold font-pixel flex items-center gap-1 ${
              url.includes('info.cern.ch') ? 'active bg-purple-700 text-white' : 'bg-purple-950 text-purple-300 hover:bg-purple-900'
            }`}
            title="View Original World Wide Web at CERN (1989-1991)"
          >
            <span>⚛️</span> info.cern.ch 1989
          </button>

          {/* 1200 Baud Coupler Sound Trigger */}
          <button
            type="button"
            onClick={() => soundManager.play1200BaudDialup()}
            className="bevel-button px-2 py-0.5 text-[10px] font-bold bg-amber-400 text-black hover:bg-yellow-300 ml-auto flex items-center gap-1"
            title="Play Bell 212A 1200 Baud Acoustic Coupler Dialup Sound"
          >
            <span>📞</span> 1200 Baud Dial
          </button>

          {/* Baud Rate Streaming Toggle */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setBaudMode((prev) => (prev === 'instant' ? '1200baud' : 'instant'));
            }}
            className={`bevel-button px-2 py-0.5 text-[10px] font-bold flex items-center gap-1.5 ${
              baudMode === '1200baud' ? 'active bg-green-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            title="Toggle 1200 Baud Teletype Text Streaming Simulation"
          >
            <span className={`w-2 h-2 rounded-full ${baudMode === '1200baud' ? 'bg-lime-400 animate-ping' : 'bg-gray-500'}`} />
            <span>Baud: {baudMode === '1200baud' ? '1200 (Stream)' : 'Instant'}</span>
          </button>
        </div>
      </div>

      {/* Breaking Marquee Ticker */}
      <div className="bevel-sunken bg-black text-lime-400 py-1 px-2 mb-3 overflow-hidden font-mono text-xs border border-lime-800 shrink-0">
        <div className="animate-marquee font-bold">
          ⚡ 1998 CYBER NEWS: Information Superhighway traffic up 400% • Netscape Communicator 4.5 Released • Napster MP3 Sharing Network Live • Area 51 Sightings Surge • Y2K bug containment protocols in effect • Winamp 2.0 released worldwide ⚡
        </div>
      </div>

      {/* ==================== PAGE 1: WELCOME.HTM ==================== */}
      {url.includes('welcome') && (
        <div className="space-y-6 pb-6 pr-1">
          {/* Hero Banner Section */}
          <div className="bevel-raised p-4 sm:p-6 bg-gradient-to-b from-[#0b0c2a] via-[#161743] to-[#0b0c2a] text-center border-2 border-cyan-400 shadow-xl relative overflow-hidden">
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
                onClick={() => onLaunchApp?.('minesweeper')}
                className="bevel-button px-3 py-1.5 bg-blue-900 text-yellow-200 hover:bg-blue-800 font-pixel text-[10px] flex items-center gap-1.5"
              >
                <span>💣</span> Play Minesweeper
              </button>
              <button
                type="button"
                onClick={() => onLaunchApp?.('irc-chat')}
                className="bevel-button px-3 py-1.5 bg-pink-900 text-white hover:bg-pink-800 font-pixel text-[10px] flex items-center gap-1.5"
              >
                <span>💬</span> Open CyberChat IRC
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
          </div>

          {/* Cyberspace Webring Section */}
          <div className="bevel-raised p-4 bg-gradient-to-r from-blue-950/80 via-slate-900/90 to-purple-950/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-700 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪐</span>
                <div>
                  <h3 className="font-pixel text-xs text-cyan-300">CYBER-WEBRING NETWORK</h3>
                  <span className="text-[11px] opacity-75">Site #{webringIndex + 1} of {WEBRING_SITES.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setWebringIndex(prev => (prev > 0 ? prev - 1 : WEBRING_SITES.length - 1));
                  }}
                  className="bevel-button px-2.5 py-1 text-xs font-bold"
                >
                  ◀ Prev
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = WEBRING_SITES[webringIndex];
                    navigateTo(target.url);
                  }}
                  className="bevel-button px-2.5 py-1 text-xs font-bold bg-pink-700 text-white"
                >
                  🚀 Visit Site
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setWebringIndex(prev => (prev + 1) % WEBRING_SITES.length);
                  }}
                  className="bevel-button px-2.5 py-1 text-xs font-bold"
                >
                  Next ▶
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
        </div>
      )}

      {/* ==================== PAGE 2: AREA51 / VAULT99.HTM ==================== */}
      {url.includes('area51') && (
        <div className="space-y-4 pb-6 font-mono text-xs">
          <div className="bevel-raised p-4 bg-[#050811] text-[#00ffcc] border-2 border-pink-500 shadow-2xl text-center">
            <div className="text-3xl animate-bounce mb-1">🛸</div>
            <h2 className="font-pixel text-xl text-pink-500 font-black tracking-widest uppercase mb-1">
              AREA 51 // VAULT 99 // CLASSIFIED
            </h2>
            <p className="text-yellow-300 font-pixel text-[9px] mb-3">
              MAJESTIC 12 ACCESS AUTHORIZED &bull; LEVEL 5 CLEARANCE
            </p>

            <div className="bevel-sunken p-3 bg-black/80 text-left space-y-2 text-xs border border-cyan-800">
              <div className="text-pink-400 font-bold">📡 SATELLITE INTERCEPT #1998-ALPHA:</div>
              <p className="leading-relaxed text-gray-300">
                Extraterrestrial microwave signals detected pulsing at 14400 baud. The binary transmission matches early HTML 3.2 specification headers.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <span className="text-lime-400">ROSWELL UFO SECTOR: OK</span>
                <span className="text-yellow-400">RADAR FREQUENCY: 433.92 MHz</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bevel-raised p-3 bg-[#0a0c1a]">
              <div className="flex items-center gap-2 text-pink-400 font-bold mb-2">
                <span>👽</span> SIGHTING INCIDENT LOGS
              </div>
              <ul className="space-y-1.5 text-gray-300 text-[11px]">
                <li>&bull; <strong className="text-yellow-300">Nevada Test Site:</strong> Glowing saucer sighted at 03:00 AM.</li>
                <li>&bull; <strong className="text-yellow-300">Silicon Valley:</strong> Prototype 56k modem transmitting alien carrier waves.</li>
                <li>&bull; <strong className="text-yellow-300">Tokyo BBS:</strong> Unknown user "Morpheus" uploading encrypted star charts.</li>
              </ul>
            </div>

            <div className="bevel-raised p-3 bg-[#0a0c1a] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
                  <span>🚨</span> CLASSIFIED DEFENSE PROTOCOL
                </div>
                <p className="text-[11px] text-gray-300">
                  Launch the orbital laser defense simulator to protect cyberspace from extraterrestrial data corruption.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onLaunchApp?.('arcade')}
                className="bevel-button px-3 py-1.5 font-pixel text-[9px] bg-pink-700 text-white font-bold mt-2"
              >
                👾 Launch Space Defense Simulator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PAGE 3: NAPSTER98 / SEARCH ==================== */}
      {url.includes('napster') && (
        <div className="space-y-4 pb-6 font-mono text-xs">
          <div className="bevel-raised p-4 bg-[#0d0e21] text-white border-2 border-cyan-400">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🎧</span>
              <div>
                <h2 className="font-pixel text-lg text-cyan-300">NAPSTER '98 MP3 AUDIO VAULT</h2>
                <div className="text-[11px] text-gray-400">Peer-to-Peer 56k Chiptune & Module Sharing</div>
              </div>
            </div>

            {/* Search Input */}
            <div className="bevel-sunken p-2 bg-black flex gap-2">
              <input
                type="text"
                value={napsterQuery}
                onChange={(e) => setNapsterQuery(e.target.value)}
                placeholder="Search MP3 artist or song name (e.g. DJ Modulator)..."
                className="flex-1 bg-transparent text-lime-300 font-mono text-xs outline-none"
              />
              <button
                type="button"
                onClick={() => soundManager.playClick()}
                className="bevel-button px-3 py-1 bg-blue-700 text-white font-bold text-xs"
              >
                Search Network
              </button>
            </div>
          </div>

          {/* Search results */}
          <div className="bevel-raised p-3 bg-[var(--window-bg)]">
            <div className="font-pixel text-[10px] text-yellow-400 mb-2 border-b border-gray-700 pb-1">
              SHARED AUDIO FILES (56K OPTIMIZED)
            </div>

            <div className="space-y-2">
              {NAPSTER_TRACKS.filter(t => t.title.toLowerCase().includes(napsterQuery.toLowerCase()) || t.artist.toLowerCase().includes(napsterQuery.toLowerCase())).map((track) => (
                <div
                  key={track.id}
                  className="bevel-sunken p-2 bg-black text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <span>🎵</span> {track.title}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Artist: <span className="text-yellow-300">{track.artist}</span> | Size: {track.size} | Bitrate: {track.bitrate}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={downloadingTrack === track.id}
                    onClick={() => handleNapsterDownload(track)}
                    className={`bevel-button px-3 py-1 text-xs font-bold shrink-0 ${
                      downloadingTrack === track.id
                        ? 'bg-amber-500 text-black animate-pulse'
                        : 'bg-emerald-700 text-white hover:bg-emerald-600'
                    }`}
                  >
                    {downloadingTrack === track.id ? '⚡ Downloading (56k)...' : '⬇️ Download to WinPulse'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== PAGE 4: ALTAVISTA SEARCH ==================== */}
      {url.includes('altavista') && (
        <div className="space-y-4 pb-6 font-mono text-xs">
          <div className="bevel-raised p-4 bg-white text-black border-2 border-blue-800 text-center">
            <div className="font-serif text-3xl font-black text-blue-900 tracking-tight my-2">
              alta<span className="text-yellow-600">vista</span>: <span className="text-sm font-sans font-normal text-gray-600">Search the World Wide Web</span>
            </div>

            <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto my-3 flex gap-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search web pages or software..."
                className="bevel-sunken flex-1 px-2 py-1 bg-white text-black font-mono text-xs outline-none"
              />
              <button
                type="submit"
                className="bevel-button px-4 py-1 font-bold text-xs bg-blue-800 text-white"
              >
                Search
              </button>
            </form>

            <div className="text-[11px] text-gray-600">
              Indexed: <strong className="text-blue-900">4,200,000+ pages</strong> &bull; Superhighway Search Engine
            </div>
          </div>

          {/* Search results list */}
          {searchResults && (
            <div className="bevel-raised p-4 bg-white text-black space-y-3">
              <div className="text-xs font-bold text-gray-700 border-b pb-1">
                AltaVista Search Results for "{searchQuery || 'all'}": ({searchResults.length} matches)
              </div>

              {searchResults.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => navigateTo(item.url)}
                    className="text-blue-800 hover:underline font-bold text-sm text-left block"
                  >
                    {item.title}
                  </button>
                  <div className="text-green-800 text-[11px] font-mono">{item.url}</div>
                  <p className="text-gray-700 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== 80s PAGE 1: 80S TELECOMPUTING HUB ==================== */}
      {url.includes('80s-telecomputing') && (
        <TelecomputingHub onNavigate={navigateTo} />
      )}

      {/* ==================== 80s PAGE 2: COMPUSERVE (CIS 1980) ==================== */}
      {url.includes('compuserve') && (
        <CompuservePage baudMode={baudMode} />
      )}

      {/* ==================== 80s PAGE 3: QUANTUM LINK C64 (1985) ==================== */}
      {url.includes('qlink') && (
        <QLinkPage onLaunchApp={onLaunchApp} />
      )}

      {/* ==================== 80s PAGE 4: THE WELL SAUSALITO (1985) ==================== */}
      {url.includes('thewell') && (
        <TheWellPage />
      )}

      {/* ==================== 80s PAGE 5: INFO.CERN.CH (1989-1991) ==================== */}
      {url.includes('info.cern.ch') && (
        <CernPage />
      )}

      {/* View Source Notepad Modal */}
      {viewSourceOpen && (
        <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-black/60 p-4">
          <div className="bevel-raised w-full max-w-2xl bg-[var(--btn-face)] text-[var(--text-main)] shadow-2xl flex flex-col h-[420px]">
            <div className="flex items-center justify-between px-2 py-1 bg-[#000080] text-white font-bold text-xs">
              <div className="flex items-center gap-1.5">
                <span>📄</span>
                <span className="font-pixel text-[10px]">Notepad - [HTML Source: {url}]</span>
              </div>
              <button
                type="button"
                onClick={() => { soundManager.playClick(); setViewSourceOpen(false); }}
                className="bevel-button w-5 h-5 flex items-center justify-center font-bold text-xs bg-[#c0c0c0] text-black hover:bg-red-600 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 bg-white text-black p-2 font-mono text-xs overflow-auto select-text">
              <pre className="whitespace-pre-wrap">{getSourceCode()}</pre>
            </div>

            <div className="bevel-raised px-2 py-1 bg-[var(--btn-face)] flex justify-end">
              <button
                type="button"
                onClick={() => { soundManager.playClick(); setViewSourceOpen(false); }}
                className="bevel-button px-4 py-0.5 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs opacity-75 font-mono py-2 shrink-0">
        &copy; 1998-2026 HYPERLINK '98 &bull; Best viewed in 1024x768 resolution &bull; HTML 3.2 Certified
      </div>
    </div>
  );
}
