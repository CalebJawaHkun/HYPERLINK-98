import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';

const CHANNELS = [
  { id: 'cyberspace', name: '#cyberspace', topic: 'Welcome to the global Web 1.0 backbone! Be respectful & share 56k bandwidth.' },
  { id: 'retro-dev', name: '#retro-dev', topic: 'HTML 3.2, JavaScript 1.2, CGI-BIN Perl scripting & Netscape 4.0 quirks.' },
  { id: 'area51', name: '#area51', topic: 'The Truth is Out There. UFO sightings, Majestic 12 & Y2K bug containment.' },
  { id: 'warez98', name: '#warez98', topic: 'MOD trackers, MIDI files, ANSI art & BBS exchange.' },
];

const INITIAL_BOTS = [
  { nick: 'SysOp', role: 'op', icon: '👑', status: 'away' },
  { nick: 'AcidBurn', role: 'voice', icon: '⚡', status: 'online' },
  { nick: 'ZeroCool', role: 'voice', icon: '🕶️', status: 'online' },
  { nick: 'PixelQueen', role: 'user', icon: '🎨', status: 'online' },
  { nick: 'CrashOverride', role: 'user', icon: '💾', status: 'online' },
  { nick: 'CerealKiller', role: 'user', icon: '🛹', status: 'online' },
  { nick: 'Morpheus', role: 'user', icon: '💊', status: 'online' },
];

const BOT_QUOTES = [
  { channel: 'cyberspace', bot: 'AcidBurn', text: "Just got my 56k USRobotics modem installed! Downloading a 3MB MP3 in only 12 minutes!" },
  { channel: 'cyberspace', bot: 'ZeroCool', text: "Hack the planet! Did anyone see the new Matrix movie trailer?" },
  { channel: 'cyberspace', bot: 'PixelQueen', text: "I just finished a 16-color pixel banner for my GeoCities homepage!" },
  { channel: 'retro-dev', bot: 'SysOp', text: "Remember to wrap your tables in <table border=0 cellpadding=0 cellspacing=0> for pixel-perfect layouts." },
  { channel: 'retro-dev', bot: 'CrashOverride', text: "CSS is nice, but pure nested <table> and animated <marquee> is where true art lives." },
  { channel: 'area51', bot: 'Morpheus', text: "You take the blue pill—the story ends. You take the red pill—you stay in Wonderland." },
  { channel: 'area51', bot: 'CerealKiller', text: "They're listening through the dial-up modem speaker squeal! I have proof on floppy disk #4." },
  { channel: 'warez98', bot: 'ZeroCool', text: "DJ Modulator just dropped a sick new 4-channel XM chiptune tracker module!" },
];

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "There are only 10 types of people in the world: those who understand binary, and those who don't.",
  "Why did the Web 1.0 developer go broke? Because he used up all his cache!",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'"
];

const FORTUNES = [
  "\"The Information Superhighway is paved with 56k dreams.\" — CyberSage '98",
  "\"Never underestimate the bandwidth of a station wagon full of floppy disks.\" — Net BBS",
  "\"Y2K is coming. Stockpile your batteries and backup your HTML files!\""
];

export default function IrcChatApp() {
  const [activeChannel, setActiveChannel] = useState('cyberspace');
  const [nickname, setNickname] = useState('CyberSurfer_98');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState({
    cyberspace: [
      { id: 1, type: 'system', time: '12:00:01', text: '*** Now talking in #cyberspace' },
      { id: 2, type: 'system', time: '12:00:02', text: '*** Topic is: Welcome to the global Web 1.0 backbone! Be respectful & share 56k bandwidth.' },
      { id: 3, type: 'msg', time: '12:01:14', nick: 'SysOp', role: 'op', text: 'Welcome to HYPERLINK CyberChat. Type /help for a list of commands or !joke / !calc.' },
      { id: 4, type: 'msg', time: '12:02:30', nick: 'AcidBurn', role: 'voice', text: 'Hey everyone! The 56k gateway is screaming fast today.' },
    ],
    'retro-dev': [
      { id: 1, type: 'system', time: '12:00:01', text: '*** Now talking in #retro-dev' },
      { id: 2, type: 'msg', time: '12:05:10', nick: 'CrashOverride', role: 'user', text: 'Who here still codes HTML in Notepad? It builds character.' },
    ],
    area51: [
      { id: 1, type: 'system', time: '12:00:01', text: '*** Now talking in #area51' },
      { id: 2, type: 'msg', time: '12:04:22', nick: 'Morpheus', role: 'user', text: 'The signal is getting stronger. Check the radar in Web Explorer.' },
    ],
    warez98: [
      { id: 1, type: 'system', time: '12:00:01', text: '*** Now talking in #warez98' },
      { id: 2, type: 'msg', time: '12:06:45', nick: 'ZeroCool', role: 'voice', text: 'Check out WinPulse Player for the latest chiptune modules.' },
    ],
  });

  const chatEndRef = useRef(null);

  // Auto-scroll chat feed
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  // Periodic simulated bot banter
  useEffect(() => {
    const timer = setInterval(() => {
      // Pick random quote matching active or random channel
      const quote = BOT_QUOTES[Math.floor(Math.random() * BOT_QUOTES.length)];
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setMessages((prev) => {
        const chanMsgs = prev[quote.channel] || [];
        return {
          ...prev,
          [quote.channel]: [
            ...chanMsgs,
            {
              id: Date.now(),
              type: 'msg',
              time: now,
              nick: quote.bot,
              role: quote.bot === 'SysOp' ? 'op' : quote.bot === 'AcidBurn' || quote.bot === 'ZeroCool' ? 'voice' : 'user',
              text: quote.text,
            },
          ],
        };
      });

      if (quote.channel === activeChannel) {
        soundManager.playIrcChime();
      }
    }, 14000);

    return () => clearInterval(timer);
  }, [activeChannel]);

  const addMessageToActive = (msgObj) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setMessages((prev) => ({
      ...prev,
      [activeChannel]: [
        ...(prev[activeChannel] || []),
        { id: Date.now(), time: now, ...msgObj },
      ],
    }));
  };

  const handleSend = (e) => {
    e.preventDefault();
    const raw = inputText.trim();
    if (!raw) return;

    soundManager.playClick();
    setInputText('');

    // Command Evaluation
    if (raw.startsWith('/')) {
      const parts = raw.slice(1).split(' ');
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');

      if (cmd === 'help') {
        addMessageToActive({
          type: 'system',
          text: `AVAILABLE IRC COMMANDS:
  /nick <name>    - Change your chat handle
  /slap <user>    - Slap someone with a large trout
  /join <channel> - Switch active channel
  /clear          - Clear channel history
  !joke           - Ask bot for a 90s tech joke
  !fortune        - Receive Cyberspace fortune
  !calc <expr>    - Solve a math equation (e.g. !calc 42 * 98)`,
        });
      } else if (cmd === 'nick') {
        if (arg) {
          const old = nickname;
          setNickname(arg);
          addMessageToActive({ type: 'system', text: `*** ${old} is now known as ${arg}` });
        } else {
          addMessageToActive({ type: 'system', text: '*** Usage: /nick <new_nickname>' });
        }
      } else if (cmd === 'slap') {
        const target = arg || 'SysOp';
        addMessageToActive({ type: 'action', text: `* ${nickname} slaps ${target} around a bit with a large trout 🐟` });
      } else if (cmd === 'join') {
        const targetChan = arg.replace('#', '').toLowerCase();
        if (CHANNELS.find((c) => c.id === targetChan)) {
          setActiveChannel(targetChan);
        } else {
          addMessageToActive({ type: 'system', text: `*** Unknown channel: ${arg}. Valid channels: #cyberspace, #retro-dev, #area51, #warez98` });
        }
      } else if (cmd === 'clear') {
        setMessages((prev) => ({ ...prev, [activeChannel]: [] }));
      } else {
        addMessageToActive({ type: 'system', text: `*** Unknown command: /${cmd}. Type /help for assistance.` });
      }
      return;
    }

    // Interactive Bot triggers
    if (raw.startsWith('!joke')) {
      addMessageToActive({ type: 'msg', nick: nickname, role: 'user', text: raw });
      setTimeout(() => {
        const joke = JOKES[Math.floor(Math.random() * JOKES.length)];
        soundManager.playIrcChime();
        addMessageToActive({ type: 'msg', nick: 'SysOp', role: 'op', text: `[BOT JOKE]: ${joke}` });
      }, 500);
      return;
    }

    if (raw.startsWith('!fortune')) {
      addMessageToActive({ type: 'msg', nick: nickname, role: 'user', text: raw });
      setTimeout(() => {
        const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        soundManager.playIrcChime();
        addMessageToActive({ type: 'msg', nick: 'SysOp', role: 'op', text: `[CYBERSAGE]: ${fortune}` });
      }, 500);
      return;
    }

    if (raw.startsWith('!calc')) {
      const expr = raw.replace('!calc', '').trim();
      addMessageToActive({ type: 'msg', nick: nickname, role: 'user', text: raw });
      setTimeout(() => {
        try {
          // Safe simple math evaluation
          const sanitized = expr.replace(/[^0-9+\-*/().\s]/g, '');
          const result = Function(`"use strict"; return (${sanitized})`)();
          soundManager.playIrcChime();
          addMessageToActive({ type: 'msg', nick: 'SysOp', role: 'op', text: `[CALC]: ${expr} = ${result}` });
        } catch {
          addMessageToActive({ type: 'msg', nick: 'SysOp', role: 'op', text: `[CALC ERROR]: Could not calculate expression.` });
        }
      }, 500);
      return;
    }

    // Normal chat message
    addMessageToActive({ type: 'msg', nick: nickname, role: 'user', text: raw });
  };

  const currentChannelObj = CHANNELS.find((c) => c.id === activeChannel) || CHANNELS[0];
  const activeMessages = messages[activeChannel] || [];

  return (
    <div className="flex flex-col h-full bg-[var(--window-bg)] text-[var(--text-main)] p-2 select-none font-mono text-xs overflow-hidden">
      {/* Channel Selector Bar */}
      <div className="bevel-raised p-1.5 bg-[var(--btn-face)] mb-2 flex items-center justify-between gap-1 overflow-x-auto shrink-0">
        <div className="flex items-center gap-1">
          {CHANNELS.map((chan) => (
            <button
              key={chan.id}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setActiveChannel(chan.id);
              }}
              className={`bevel-button px-2.5 py-1 text-xs font-bold ${
                activeChannel === chan.id ? 'active bg-blue-800 text-white' : ''
              }`}
            >
              {chan.name}
            </button>
          ))}
        </div>

        {/* User Alias badge */}
        <div className="bevel-sunken px-2 py-0.5 bg-black text-cyan-300 font-bold hidden sm:flex items-center gap-1.5">
          <span>👤 Nick:</span>
          <span className="text-yellow-400">{nickname}</span>
        </div>
      </div>

      {/* Channel Topic Banner */}
      <div className="bevel-sunken bg-black text-lime-400 p-1.5 mb-2 text-[11px] truncate border border-lime-800 shrink-0">
        <span className="font-bold text-white">Topic: </span>
        {currentChannelObj.topic}
      </div>

      {/* Main Chat Grid (Chat feed + Nick list) */}
      <div className="flex-1 flex gap-2 overflow-hidden min-h-[220px]">
        {/* Messages Feed */}
        <div className="bevel-sunken flex-1 bg-black text-white p-2 overflow-y-auto space-y-1.5 select-text font-mono text-xs">
          {activeMessages.map((m) => (
            <div key={m.id} className="leading-relaxed">
              <span className="text-gray-500 text-[10px] mr-2">[{m.time}]</span>
              {m.type === 'system' && (
                <span className="text-lime-400 italic">{m.text}</span>
              )}
              {m.type === 'action' && (
                <span className="text-pink-400 font-bold">{m.text}</span>
              )}
              {m.type === 'msg' && (
                <>
                  <span
                    className={`font-bold mr-1.5 ${
                      m.role === 'op'
                        ? 'text-yellow-400'
                        : m.role === 'voice'
                        ? 'text-cyan-400'
                        : 'text-pink-300'
                    }`}
                  >
                    &lt;{m.role === 'op' ? '@' : m.role === 'voice' ? '+' : ''}{m.nick}&gt;
                  </span>
                  <span className="text-gray-100">{m.text}</span>
                </>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Active Nicks Sidebar */}
        <div className="bevel-sunken w-36 sm:w-44 bg-[#0a0c16] text-gray-200 p-2 overflow-y-auto flex flex-col shrink-0">
          <div className="font-pixel text-[9px] text-gray-400 border-b border-gray-700 pb-1 mb-1.5">
            USERS ({INITIAL_BOTS.length + 1})
          </div>

          <div className="space-y-1 flex-1">
            {/* Self */}
            <div className="flex items-center gap-1.5 text-xs text-yellow-300 font-bold bg-blue-900/60 px-1 py-0.5 rounded">
              <span>🌟</span>
              <span className="truncate">{nickname} (you)</span>
            </div>

            {/* Bots */}
            {INITIAL_BOTS.map((bot) => (
              <div
                key={bot.nick}
                className="flex items-center justify-between px-1 py-0.5 hover:bg-gray-800 text-xs"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>{bot.icon}</span>
                  <span
                    className={
                      bot.role === 'op'
                        ? 'text-yellow-400 font-bold'
                        : bot.role === 'voice'
                        ? 'text-cyan-400 font-bold'
                        : 'text-gray-300'
                    }
                  >
                    {bot.role === 'op' ? '@' : bot.role === 'voice' ? '+' : ''}{bot.nick}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Message Input Form */}
      <form onSubmit={handleSend} className="bevel-raised p-1.5 bg-[var(--btn-face)] mt-2 flex gap-1.5 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${currentChannelObj.name} or /help...`}
          className="bevel-sunken flex-1 px-2 py-1 bg-white text-black font-mono text-xs outline-none"
          autoFocus
        />
        <button
          type="submit"
          className="bevel-button px-4 py-1 font-bold text-xs bg-blue-700 text-white hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
