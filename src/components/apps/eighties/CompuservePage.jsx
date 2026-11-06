import React, { useState, useEffect } from 'react';
import { soundManager } from '../../../utils/audio';
import BaudStreamText from './BaudStreamText';

const INITIAL_CB_MESSAGES = [
  { id: 1, handle: 'StarRider', time: '21:04', text: 'Greetings to Channel 1 from Columbus, Ohio! Anyone testing the new Bell 212A 1200 baud lines tonight?' },
  { id: 2, handle: 'Wizard_80', time: '21:06', text: 'Hey StarRider! Yes, typing at 120 chars/sec is like flying into the future compared to 300 baud!' },
  { id: 3, handle: 'CyberDyne_SysOp', time: '21:08', text: 'Reminder: prime connect is $6.00/hour. Keep your messages snappy to save on phone toll charges!' },
  { id: 4, handle: 'PixelBaud_CA', time: '21:09', text: 'Just downloaded a BASIC game from SIG-Games. The future of telecomputing is incredible.' },
];

const WEATHER_REPORTS = {
  NYC: { city: 'NEW YORK CITY', temp: '68 F / 20 C', condition: 'CLEAR & MILD', baro: '30.12 in', wind: 'NW at 8 MPH', ascii: '  \\   /  \n   .-.   \n― (   ) ―\n   `-’   \n  /   \\  ' },
  SFO: { city: 'SAN FRANCISCO', temp: '57 F / 14 C', condition: 'COASTAL FOG & BREEZE', baro: '29.98 in', wind: 'W at 16 MPH', ascii: ' _ - _ -_\n  _ - _  \n_ - _ - _' },
  CHI: { city: 'CHICAGO', temp: '62 F / 17 C', condition: 'PARTLY CLOUDY', baro: '30.04 in', wind: 'NE at 12 MPH', ascii: '   .--.  \n .-(    ).\n(___.__)__)' },
  LON: { city: 'LONDON (UK)', temp: '54 F / 12 C', condition: 'LIGHT RAIN & DRIZZLE', baro: '29.85 in', wind: 'SW at 10 MPH', ascii: '   .--.  \n .-(    ).\n(___.__)__)\n ` ` ` ` ' },
  TYO: { city: 'TOKYO', temp: '72 F / 22 C', condition: 'WARM & HUMID', baro: '30.10 in', wind: 'S at 6 MPH', ascii: '  \\   /  \n   .-.   \n― (   ) ―\n   `-’   ' }
};

const NEWS_WIRES = [
  {
    id: 'pc81',
    date: 'AUGUST 12, 1981',
    headline: 'IBM INTRODUCES PERSONAL COMPUTER (MODEL 5150)',
    body: 'NEW YORK (UPI) -- International Business Machines Corp. today announced its entry into the microcomputer market with the IBM 5150. Featuring an Intel 8088 microprocessor, 16 kilobytes of memory, and Microsoft MS-DOS, prices start at $1,565.'
  },
  {
    id: 'columbia81',
    date: 'APRIL 14, 1981',
    headline: 'SPACE SHUTTLE COLUMBIA COMPLETES MAIDEN FLIGHT',
    body: 'EDWARDS AFB, CALIF. (UPI) -- The Space Shuttle Columbia glided to a smooth landing today on the dry lake bed at Edwards Air Force Base, concluding the STS-1 mission and opening the era of reusable orbital spaceflight.'
  },
  {
    id: 'pacman80',
    date: 'OCTOBER 10, 1980',
    headline: 'PAC-MAN ARCADE PHENOMENON SWEEPS THE NATION',
    body: 'CHICAGO (UPI) -- Midway Games reports that Japanese arcade phenomenon "Pac-Man", designed by Toru Iwatani at Namco, has generated record-breaking coin drop across malls, convenience stores, and dedicated arcades nationwide.'
  },
  {
    id: 'c64_82',
    date: 'AUGUST 1982',
    headline: 'COMMODORE INTRODUCES COMMODORE 64 WITH 64KB RAM',
    body: 'WEST CHESTER, PA (UPI) -- Commodore Business Machines has launched the Commodore 64 for $595. Powered by the 6510 CPU and the revolutionary MOS 6581 SID sound synthesizer chip, analysts predict massive consumer adoption.'
  }
];

const HANGMAN_WORDS = ['MODEM', 'BAUD', 'MAINFRAME', 'COUPLER', 'TERMINAL', 'FLOPPY', 'COMPUSERVE', 'VIDEOTEX', 'ACOUSTIC'];

export default function CompuservePage({ baudMode = 'instant' }) {
  const [activeSection, setActiveSection] = useState('menu'); // menu, cb, weather, news, games
  const [goInput, setGoInput] = useState('');
  const [elapsedSecs, setElapsedSecs] = useState(0);

  // CB Chat State
  const [cbMessages, setCbMessages] = useState(INITIAL_CB_MESSAGES);
  const [userHandle, setUserHandle] = useState('Guest_80');
  const [chatInput, setChatInput] = useState('');

  // Weather State
  const [selectedCity, setSelectedCity] = useState('NYC');

  // Hangman State
  const [hangmanWord, setHangmanWord] = useState(() => HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);

  // Live session timer & billing calculation ($6.00/hour prime connect charge)
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSecs((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalCharge = ((elapsedSecs / 3600) * 6.00).toFixed(2);
  const mins = Math.floor(elapsedSecs / 60);
  const secs = elapsedSecs % 60;
  const timerStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const handleGoSubmit = (e) => {
    e.preventDefault();
    soundManager.playClick();
    const cmd = goInput.trim().toUpperCase();
    setGoInput('');

    if (cmd === 'GO CB' || cmd === 'CB') setActiveSection('cb');
    else if (cmd === 'GO WEATHER' || cmd === 'WEATHER') setActiveSection('weather');
    else if (cmd === 'GO NEWS' || cmd === 'NEWS') setActiveSection('news');
    else if (cmd === 'GO GAMES' || cmd === 'GAMES' || cmd === 'HANGMAN') setActiveSection('games');
    else if (cmd === 'GO MENU' || cmd === 'GO TOP' || cmd === 'TOP' || cmd === 'MENU') setActiveSection('menu');
    else {
      soundManager.playErrorDing();
      alert(`Invalid CompuServe GO code: "${cmd}". Try: GO CB, GO WEATHER, GO NEWS, GO GAMES, or GO MENU.`);
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    soundManager.playClick();

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg = {
      id: Date.now(),
      handle: userHandle.trim() || 'Guest_80',
      time: timeStr,
      text: chatInput.trim()
    };

    setCbMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Simulated reply
    setTimeout(() => {
      const bots = [
        { handle: 'StarRider', text: `Right on, ${userHandle}! Great to see you in the CB Simulator!` },
        { handle: 'Wizard_80', text: `Copy that! Are you using a VT100 terminal or a TRS-80?` },
        { handle: 'ModemMaven', text: `Signal looks crisp over this Bell 212A line.` }
      ];
      const botPick = bots[Math.floor(Math.random() * bots.length)];
      setCbMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          handle: botPick.handle,
          time: timeStr,
          text: botPick.text
        }
      ]);
      soundManager.playIrcChime();
    }, 1200);
  };

  // Hangman guess handler
  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || wrongGuesses >= 6) return;
    soundManager.playClick();
    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (!hangmanWord.includes(letter)) {
      setWrongGuesses((prev) => prev + 1);
    }
  };

  const resetHangman = () => {
    soundManager.playClick();
    setHangmanWord(HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)]);
    setGuessedLetters([]);
    setWrongGuesses(0);
  };

  const isWordGuessed = hangmanWord.split('').every((l) => guessedLetters.includes(l));
  const isGameOver = wrongGuesses >= 6;

  return (
    <div className="space-y-4 pb-8 font-mono text-xs select-text">
      {/* CompuServe Videotex Header Chassis */}
      <div className="videotex-box p-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-yellow-300 pb-2 mb-2 gap-2">
          <div>
            <div className="font-pixel text-sm text-yellow-300 tracking-wider">
              COMPUSERVE INFORMATION SERVICE (CIS)
            </div>
            <div className="text-[10px] text-cyan-200 mt-0.5">
              (C) 1980 COMPUSERVE INCORPORATED &bull; 5000 ARLINGTON CENTRE BLVD, COLUMBUS, OH
            </div>
          </div>

          {/* Connect Meter & Billing Tracker */}
          <div className="bevel-sunken bg-black px-2.5 py-1 text-right border border-yellow-400">
            <div className="text-[10px] text-gray-400">CONNECTED: <span className="text-yellow-300 font-bold">{timerStr}</span> (1200 BAUD)</div>
            <div className="text-xs text-lime-400 font-bold">BILLING: ${totalCharge} ($6.00/HR)</div>
          </div>
        </div>

        {/* GO Navigation Prompt Bar */}
        <form onSubmit={handleGoSubmit} className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-bold text-yellow-300 text-sm">GO &gt;</span>
          <input
            type="text"
            value={goInput}
            onChange={(e) => setGoInput(e.target.value)}
            placeholder="e.g. CB, WEATHER, NEWS, GAMES, MENU"
            className="bevel-sunken px-2 py-0.5 bg-black text-lime-300 font-mono text-xs w-56 outline-none uppercase font-bold"
          />
          <button type="submit" className="bevel-button px-2 py-0.5 font-bold text-black bg-yellow-400 hover:bg-yellow-300 text-xs">
            Transmit
          </button>

          {/* Quick GO Buttons */}
          <div className="flex items-center gap-1 ml-auto text-[11px]">
            {[
              { id: 'menu', label: 'GO MENU' },
              { id: 'cb', label: 'GO CB' },
              { id: 'weather', label: 'GO WEATHER' },
              { id: 'news', label: 'GO NEWS' },
              { id: 'games', label: 'GO GAMES' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setActiveSection(btn.id);
                }}
                className={`bevel-button px-1.5 py-0.5 font-bold text-[10px] ${
                  activeSection === btn.id ? 'active bg-yellow-400 text-black' : 'bg-blue-900 text-yellow-300'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* SECTION 1: MAIN MENU (GO MENU / GO TOP) */}
      {activeSection === 'menu' && (
        <div className="bevel-raised p-4 bg-black text-green-400 border border-green-700 space-y-4">
          <div className="border-b border-green-800 pb-2">
            <h2 className="font-pixel text-xs text-yellow-300 uppercase">
              COMPUSERVE MAIN MENU & SERVICES DIRECTORY
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Select an option below or type the GO code in the prompt bar above:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              onClick={() => { soundManager.playClick(); setActiveSection('cb'); }}
              className="p-3 border border-green-600 bg-green-950/30 hover:bg-green-900/40 cursor-pointer space-y-1"
            >
              <div className="font-bold text-yellow-300 flex items-center justify-between">
                <span>1. CB SIMULATOR (CHAT)</span>
                <span className="text-[10px] bg-green-800 text-white px-1">GO CB</span>
              </div>
              <p className="text-gray-300 text-[11px]">
                The world's first multi-user public chat network. Join Channel 1 to broadcast and message fellow telecomputing enthusiasts live.
              </p>
            </div>

            <div
              onClick={() => { soundManager.playClick(); setActiveSection('weather'); }}
              className="p-3 border border-green-600 bg-green-950/30 hover:bg-green-900/40 cursor-pointer space-y-1"
            >
              <div className="font-bold text-yellow-300 flex items-center justify-between">
                <span>2. NATIONAL WEATHER RADAR</span>
                <span className="text-[10px] bg-green-800 text-white px-1">GO WEATHER</span>
              </div>
              <p className="text-gray-300 text-[11px]">
                1980s National Weather Service forecasts, barometric pressures, and ASCII radar imagery for major metropolitan airports.
              </p>
            </div>

            <div
              onClick={() => { soundManager.playClick(); setActiveSection('news'); }}
              className="p-3 border border-green-600 bg-green-950/30 hover:bg-green-900/40 cursor-pointer space-y-1"
            >
              <div className="font-bold text-yellow-300 flex items-center justify-between">
                <span>3. UPI EXECUTIVE NEWS WIRE</span>
                <span className="text-[10px] bg-green-800 text-white px-1">GO NEWS</span>
              </div>
              <p className="text-gray-300 text-[11px]">
                Direct teletype feed from United Press International. Read breaking technology, space, and world news from 1980-1985.
              </p>
            </div>

            <div
              onClick={() => { soundManager.playClick(); setActiveSection('games'); }}
              className="p-3 border border-green-600 bg-green-950/30 hover:bg-green-900/40 cursor-pointer space-y-1"
            >
              <div className="font-bold text-yellow-300 flex items-center justify-between">
                <span>4. TELECOMPUTING HANGMAN GAME</span>
                <span className="text-[10px] bg-green-800 text-white px-1">GO GAMES</span>
              </div>
              <p className="text-gray-300 text-[11px]">
                Interactive 1980s word puzzle. Guess retro telecomputing keywords before your line carrier disconnects!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CB SIMULATOR (GO CB) */}
      {activeSection === 'cb' && (
        <div className="bevel-raised p-3 bg-[#001020] text-white border-2 border-cyan-500 space-y-3">
          <div className="flex items-center justify-between border-b border-cyan-800 pb-2">
            <div>
              <div className="font-pixel text-xs text-yellow-300 flex items-center gap-2">
                <span>📡</span> COMPUSERVE CB SIMULATOR &bull; CHANNEL 1 (PUBLIC)
              </div>
              <div className="text-[10px] text-cyan-400 mt-0.5">
                Mode: Simplex &bull; Carrier: 1200 Baud FSK &bull; Status: Transmitting
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 text-[11px]">Your Handle:</span>
              <input
                type="text"
                value={userHandle}
                onChange={(e) => setUserHandle(e.target.value)}
                className="bevel-sunken px-2 py-0.5 bg-black text-yellow-300 font-bold w-28 text-xs outline-none"
              />
            </div>
          </div>

          {/* Terminal Chat Log */}
          <div className="bevel-sunken bg-black p-3 h-64 overflow-y-auto font-mono text-xs space-y-1.5 border border-cyan-900">
            {cbMessages.map((msg) => (
              <div key={msg.id} className="leading-relaxed">
                <span className="text-gray-500 text-[10px]">[{msg.time}] </span>
                <span className="text-yellow-400 font-bold">&lt;{msg.handle}&gt; </span>
                <span className="text-cyan-200">{msg.text}</span>
              </div>
            ))}
          </div>

          {/* Message Broadcast Input */}
          <form onSubmit={handleSendChat} className="flex gap-2 text-xs">
            <span className="text-lime-400 font-bold self-center">TRANSMIT:</span>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type message to broadcast to Channel 1..."
              className="bevel-sunken flex-1 px-2 py-1 bg-black text-lime-300 font-mono text-xs outline-none"
            />
            <button
              type="submit"
              className="bevel-button px-3 py-1 font-bold bg-cyan-700 text-white hover:bg-cyan-600 text-xs"
            >
              Send (Return)
            </button>
          </form>
        </div>
      )}

      {/* SECTION 3: WEATHER RADAR (GO WEATHER) */}
      {activeSection === 'weather' && (
        <div className="bevel-raised p-4 bg-black text-cyan-300 border border-cyan-600 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-cyan-800 pb-2 gap-2">
            <div>
              <div className="font-pixel text-xs text-yellow-300">
                NATIONAL WEATHER SERVICE (NWS) &bull; ASCII METEOROLOGICAL REPORTS
              </div>
              <div className="text-[10px] text-gray-400">CompuServe Aviation & Consumer Weather Division</div>
            </div>

            {/* City Selector Buttons */}
            <div className="flex flex-wrap gap-1">
              {Object.keys(WEATHER_REPORTS).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedCity(code);
                  }}
                  className={`bevel-button px-2 py-0.5 text-xs font-bold ${
                    selectedCity === code ? 'active bg-cyan-600 text-white' : 'bg-gray-800 text-cyan-300'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Current City Weather Display */}
          {(() => {
            const report = WEATHER_REPORTS[selectedCity];
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bevel-sunken p-4 bg-black/80 border border-cyan-800 space-y-2">
                  <div className="text-yellow-400 font-bold text-sm">{report.city}</div>
                  <div className="text-xl font-bold text-white">{report.temp}</div>
                  <div className="text-xs text-lime-400">SKY: {report.condition}</div>
                  <div className="text-xs text-gray-300">BAROMETER: {report.baro}</div>
                  <div className="text-xs text-gray-300">WIND VELOCITY: {report.wind}</div>
                </div>

                <div className="bevel-sunken p-4 bg-black/80 border border-cyan-800 flex flex-col justify-center items-center">
                  <div className="text-[10px] text-gray-400 mb-1">ASCII RADAR VISUAL</div>
                  <pre className="font-mono text-yellow-300 text-sm whitespace-pre leading-tight">
                    {report.ascii}
                  </pre>
                  <div className="text-[10px] text-cyan-400 mt-2">OBSERVATION STATION ID: WX-{selectedCity}-80</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SECTION 4: UPI NEWS WIRE (GO NEWS) */}
      {activeSection === 'news' && (
        <div className="bevel-raised p-4 bg-black text-yellow-300 border border-yellow-600 space-y-4">
          <div className="border-b border-yellow-700 pb-2">
            <div className="font-pixel text-xs text-yellow-400">
              UPI EXECUTIVE NEWS WIRE &bull; 1980-1985 DISPATCHES
            </div>
            <div className="text-[10px] text-gray-400">Direct Teleprinter Feed from United Press International</div>
          </div>

          <div className="space-y-3">
            {NEWS_WIRES.map((article) => (
              <div key={article.id} className="bevel-sunken p-3 bg-black/90 border border-yellow-800/60 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-cyan-400">
                  <span className="font-bold">UPI BULLETIN DISPATCH</span>
                  <span>{article.date}</span>
                </div>
                <h3 className="font-bold text-sm text-yellow-300">{article.headline}</h3>
                <BaudStreamText text={article.body} baudMode={baudMode} className="text-gray-300 text-xs leading-relaxed" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: HANGMAN MINI-GAME (GO GAMES) */}
      {activeSection === 'games' && (
        <div className="bevel-raised p-4 bg-[#0a140d] text-green-300 border-2 border-green-500 space-y-4">
          <div className="flex items-center justify-between border-b border-green-800 pb-2">
            <div className="font-pixel text-xs text-yellow-300">
              🎮 COMPUSERVE TELECOMPUTING HANGMAN (1980)
            </div>
            <button
              type="button"
              onClick={resetHangman}
              className="bevel-button px-2.5 py-1 text-xs font-bold bg-green-700 text-white"
            >
              🔄 New Word
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hangman ASCII Gallows */}
            <div className="bevel-sunken p-3 bg-black border border-green-900 flex flex-col items-center justify-center min-h-[160px]">
              <pre className="text-yellow-400 font-mono text-xs leading-tight">
{`   +---+
   |   |
   ${wrongGuesses > 0 ? 'O' : ' '}   |
  ${wrongGuesses > 2 ? '/' : ' '}${wrongGuesses > 1 ? '|' : ' '}${wrongGuesses > 3 ? '\\' : ' '}  |
  ${wrongGuesses > 4 ? '/' : ' '} ${wrongGuesses > 5 ? '\\' : ' '}  |
       |
========= `}
              </pre>
              <div className="text-[10px] text-gray-400 mt-2">
                Carrier disconnects in {6 - wrongGuesses} wrong guesses!
              </div>
            </div>

            {/* Mystery Word Display & Status */}
            <div className="flex flex-col justify-center items-center space-y-3">
              <div className="font-pixel text-xl tracking-[0.3em] text-cyan-300">
                {hangmanWord.split('').map((letter, i) => (
                  <span key={i} className="inline-block border-b-2 border-cyan-400 px-1 mx-0.5">
                    {guessedLetters.includes(letter) || isGameOver ? letter : '_'}
                  </span>
                ))}
              </div>

              {isWordGuessed && (
                <div className="font-pixel text-xs text-yellow-300 animate-bounce">
                  🎉 TRANSMISSION DECODED! YOU WON!
                </div>
              )}

              {isGameOver && (
                <div className="font-pixel text-xs text-red-400">
                  ⚠️ CARRIER LOST! The word was "{hangmanWord}".
                </div>
              )}

              {/* On-screen alphabet keyboard */}
              <div className="flex flex-wrap justify-center gap-1 max-w-xs">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((char) => {
                  const used = guessedLetters.includes(char);
                  return (
                    <button
                      key={char}
                      type="button"
                      disabled={used || isWordGuessed || isGameOver}
                      onClick={() => handleGuess(char)}
                      className={`bevel-button w-6 h-6 text-[10px] font-bold ${
                        used ? 'opacity-30 cursor-not-allowed bg-gray-800' : 'bg-green-800 text-white hover:bg-green-700'
                      }`}
                    >
                      {char}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
