import React, { useState } from 'react';
import { soundManager } from '../../../utils/audio';

const CONFERENCES = [
  {
    id: 1,
    name: 'virtual_communities',
    title: 'Virtual Communities & Electronic Culture',
    host: 'Howard Rheingold (hlr)',
    description: 'Exploring human communion, empathy, and social structures across digital computer networks.',
    posts: [
      {
        id: 101,
        author: 'Howard Rheingold (hlr)',
        date: 'Sun Oct 13 1985 14:22 PST',
        text: 'People in virtual communities use words on screens to exchange pleasantries and argue, engage in intellectual discourse, conduct commerce, make plans, brain-storm, gossip, feud, fall in love, find friends and lose them, play games and create art. We are creating a new world here in Sausalito.'
      },
      {
        id: 102,
        author: 'Cliff Stoll (cliff)',
        date: 'Mon Oct 14 1985 09:15 PST',
        text: 'The intimacy of reading someone\'s thoughts typed directly from their living room at 2 AM is unlike any print medium. It feels immediate, unguarded, and profoundly alive.'
      }
    ]
  },
  {
    id: 2,
    name: 'cyberpunk_hackers',
    title: 'Cyberpunk, Cryptography & Hackers',
    host: 'John Perry Barlow (barlow)',
    description: 'Discussions on William Gibson\'s Neuromancer, personal encryption, and liberty on the electronic frontier.',
    posts: [
      {
        id: 201,
        author: 'John Perry Barlow (barlow)',
        date: 'Wed Nov 6 1985 18:30 PST',
        text: 'Cyberspace is where you are when you\'re on the telephone. It is a world that is both everywhere and nowhere, but it is not where bodies live. We must ensure this digital realm remains free from tyrannical control.'
      },
      {
        id: 202,
        author: 'Bruce Sterling (bruces)',
        date: 'Thu Nov 7 1985 11:05 PST',
        text: 'Cyberpunk is the street finding its own uses for things. Low-life and high-tech. The microcomputer has slipped out of corporate custody and into the hands of visionaries and teenagers.'
      }
    ]
  },
  {
    id: 3,
    name: 'whole_earth_catalog',
    title: 'Whole Earth Catalog & Appropriate Tech',
    host: 'Stewart Brand (sb)',
    description: 'Tools, access to tools, planetary stewardship, and personal computing.',
    posts: [
      {
        id: 301,
        author: 'Stewart Brand (sb)',
        date: 'Tue Sep 17 1985 16:45 PST',
        text: 'Information wants to be free, because it has become so cheap to distribute, copy, and recombine. Information also wants to be expensive, because it can be so divinely valuable. That tension will not go away.'
      },
      {
        id: 302,
        author: 'Kevin Kelly (kk)',
        date: 'Wed Sep 18 1985 10:20 PST',
        text: 'A computer is a bicycle for the mind. When paired with telecommunications, it becomes a nervous system for collective consciousness.'
      }
    ]
  },
  {
    id: 4,
    name: 'grateful_dead',
    title: 'Grateful Dead Tour, Tapes & Lore',
    host: 'David Gans (dgans)',
    description: 'Setlists, cassette tape trading, Red Rocks memories, and tour reviews.',
    posts: [
      {
        id: 401,
        author: 'DeadHead_Dan',
        date: 'Sat Jul 20 1985 22:10 PST',
        text: 'Anyone have a clean soundboard cassette of the Greek Theatre Berkeley run from last month? Looking for a Maxell XL-II master tape copy!'
      },
      {
        id: 402,
        author: 'CassetteTrader_SF',
        date: 'Sun Jul 21 1985 15:40 PST',
        text: 'I have 2nd generation Dolby C tapes from the board! Send me a message via PicoSpan mail and I will mail you a cassette.'
      }
    ]
  }
];

export default function TheWellPage() {
  const [selectedConfId, setSelectedConfId] = useState(1);
  const [conferences, setConferences] = useState(CONFERENCES);
  const [authorName, setAuthorName] = useState('visitor');
  const [replyText, setReplyText] = useState('');
  const [picoCmd, setPicoCmd] = useState('');

  const currentConf = conferences.find((c) => c.id === selectedConfId) || conferences[0];

  const handlePostReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    soundManager.playClick();

    const now = new Date();
    const dateStr = now.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' PST';

    const newPost = {
      id: Date.now(),
      author: authorName.trim() || 'visitor',
      date: dateStr,
      text: replyText.trim()
    };

    setConferences((prev) =>
      prev.map((c) => (c.id === selectedConfId ? { ...c, posts: [...c.posts, newPost] } : c))
    );
    setReplyText('');
  };

  const handlePicoSubmit = (e) => {
    e.preventDefault();
    soundManager.playClick();
    const cmd = picoCmd.trim().toLowerCase();
    setPicoCmd('');

    if (cmd === 'cf 1' || cmd === '1') setSelectedConfId(1);
    else if (cmd === 'cf 2' || cmd === '2') setSelectedConfId(2);
    else if (cmd === 'cf 3' || cmd === '3') setSelectedConfId(3);
    else if (cmd === 'cf 4' || cmd === '4') setSelectedConfId(4);
    else {
      alert('PicoSpan Commands:\ncf 1: Virtual Communities\ncf 2: Cyberpunk & Hackers\ncf 3: Whole Earth\ncf 4: Grateful Dead');
    }
  };

  return (
    <div className="space-y-4 pb-8 font-mono text-xs select-text">
      {/* The WELL Header Banner */}
      <div className="bevel-raised p-4 bg-[#0a180f] text-emerald-300 border-2 border-emerald-500 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-emerald-700 pb-2 mb-2 gap-2">
          <div>
            <h1 className="font-pixel text-sm text-yellow-300">
              THE WHOLE EARTH 'LECTRONIC LINK (THE WELL)
            </h1>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              Sausalito, California &bull; (415) 332-6106 &bull; UNIX PicoSpan v2.4
            </div>
          </div>
          <div className="px-2 py-1 bg-emerald-950 text-yellow-300 border border-emerald-600 text-[10px] font-bold">
            "You Own Your Own Words"
          </div>
        </div>

        {/* PicoSpan Prompt Bar */}
        <form onSubmit={handlePicoSubmit} className="flex items-center gap-2 text-xs">
          <span className="text-yellow-300 font-bold">Ok:</span>
          <input
            type="text"
            value={picoCmd}
            onChange={(e) => setPicoCmd(e.target.value)}
            placeholder="cf 1, cf 2, cf 3, cf 4..."
            className="bevel-sunken px-2 py-0.5 bg-black text-emerald-400 font-mono text-xs w-48 outline-none"
          />
          <button type="submit" className="bevel-button px-2 py-0.5 text-xs bg-emerald-700 text-white font-bold">
            Execute
          </button>
          <span className="text-[10px] text-gray-400 ml-auto hidden sm:inline">
            Type "cf &lt;1-4&gt;" to switch conferences
          </span>
        </form>
      </div>

      {/* Conference Navigator Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {conferences.map((conf) => (
          <button
            key={conf.id}
            type="button"
            onClick={() => {
              soundManager.playClick();
              setSelectedConfId(conf.id);
            }}
            className={`bevel-button px-3 py-1.5 text-left text-xs font-bold ${
              selectedConfId === conf.id
                ? 'active bg-emerald-800 text-yellow-300'
                : 'bg-gray-800 text-emerald-400 hover:bg-gray-700'
            }`}
          >
            <div>{conf.id}. {conf.name}</div>
            <div className="text-[9px] opacity-75 font-normal">Host: {conf.host}</div>
          </button>
        ))}
      </div>

      {/* Active Conference Discussion Board */}
      <div className="bevel-raised p-4 bg-black text-emerald-300 border border-emerald-600 space-y-4">
        <div className="border-b border-emerald-800 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-xs text-yellow-300">{currentConf.title}</h2>
            <span className="text-[10px] text-gray-400">Host: {currentConf.host}</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{currentConf.description}</p>
        </div>

        {/* Discussion Postings */}
        <div className="space-y-3">
          {currentConf.posts.map((post) => (
            <div key={post.id} className="bevel-sunken p-3 bg-[#051108] border border-emerald-900 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] border-b border-emerald-950 pb-1 text-yellow-400">
                <span className="font-bold">&gt; {post.author}</span>
                <span className="text-gray-400">{post.date}</span>
              </div>
              <p className="text-gray-200 text-xs leading-relaxed">{post.text}</p>
            </div>
          ))}
        </div>

        {/* Add Message Form */}
        <form onSubmit={handlePostReply} className="bevel-sunken p-3 bg-black border border-emerald-800 space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-yellow-300 font-bold">Your Handle:</span>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="bevel-sunken px-2 py-0.5 bg-black text-emerald-400 text-xs w-36 outline-none"
            />
          </div>

          <div>
            <textarea
              required
              rows="3"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Write response to conference "${currentConf.name}" (You own your own words)...`}
              className="bevel-sunken w-full p-2 bg-black text-emerald-300 font-mono text-xs outline-none"
            />
          </div>

          <button
            type="submit"
            className="bevel-button px-4 py-1 text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-600"
          >
            Post to PicoSpan Conference &crarr;
          </button>
        </form>
      </div>
    </div>
  );
}
