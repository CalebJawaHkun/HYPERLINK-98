import React from 'react';

export default function ReadmeApp() {
  return (
    <div className="flex flex-col h-full bg-white text-black p-4 font-mono text-xs select-text overflow-y-auto leading-relaxed shadow-inner">
      <div className="border-b-2 border-black pb-2 mb-3">
        <h2 className="font-bold text-base font-pixel">README.TXT — HYPERLINK '98 CYBER OS (v1.0.0)</h2>
        <div className="text-[11px] text-gray-600">Release: v1.0.0 &bull; Architecture: React 19 + Tailwind CSS + Web Audio</div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-sm text-blue-900 mb-1">📼 ABOUT THIS PROJECT</h3>
          <p>
            Welcome to HYPERLINK '98 v1.0! This interactive desktop OS and web portal is a high-fidelity tribute to the raw creative spirit of the 1990s Information Superhighway, fused with modern 2026 performance, responsive micro-animations, and procedural audio synthesis.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-sm text-blue-900 mb-1">🕹️ INCLUDED CYBER APPLICATIONS</h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Web Explorer '98:</strong> Multi-page cyberspace browser (<code className="bg-gray-200 px-1">welcome.htm</code>, <code className="bg-gray-200 px-1">area51/vault99.htm</code>, <code className="bg-gray-200 px-1">napster98/search</code>, <code className="bg-gray-200 px-1">altavista98.com</code>) with bookmarks, visitor counter, poll, guestbook, and "View HTML Source" Notepad modal.</li>
            <li><strong>Minesweeper '98:</strong> Authentic puzzle game with Beginner, Intermediate, and Expert difficulties, 7-segment LED counters, reactive smiley face, and flags.</li>
            <li><strong>mIRC '98 CyberChat:</strong> Simulated multi-channel IRC client (<code className="bg-gray-200 px-1">#cyberspace</code>, <code className="bg-gray-200 px-1">#retro-dev</code>, <code className="bg-gray-200 px-1">#area51</code>, <code className="bg-gray-200 px-1">#warez98</code>) with active bots and commands (<code className="bg-gray-200 px-1">!joke</code>, <code className="bg-gray-200 px-1">!fortune</code>, <code className="bg-gray-200 px-1">!calc</code>, <code className="bg-gray-200 px-1">/slap</code>).</li>
            <li><strong>WinPulse '98 Pro:</strong> 5-track chiptune player + interactive 16-step beat tracker sequencer with 3 visualizer modes (LED EQ, Oscilloscope, 3D Starfield).</li>
            <li><strong>Cyber Invaders:</strong> 8-bit space arcade shooter minigame with score & lives tracking.</li>
            <li><strong>BBS Cyber-Terminal:</strong> Interactive MS-DOS / VT100 prompt with commands like <code className="bg-gray-200 px-1">dialup</code>, <code className="bg-gray-200 px-1">matrix</code>, <code className="bg-gray-200 px-1">sysinfo</code>, and <code className="bg-gray-200 px-1">fortune</code>.</li>
            <li><strong>PixelPaint '98:</strong> 16-color retro canvas drawing tool with PNG download.</li>
            <li><strong>Desktop Context Menu & Properties:</strong> Right-click desktop for Display Properties, custom wallpaper patterns, window cascading, and horizontal tiling.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-blue-900 mb-1">🎨 CUSTOM THEMES & CRT SCANLINES</h3>
          <p>
            Switch between 4 handcrafted vintage palettes:
            <em> Windows 95 Classic</em>, <em>Cyber Geocities Neon</em>, <em>Mac OS Platinum</em>, and <em>Phosphor Green Matrix</em>.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-sm text-blue-900 mb-1">🔊 PROCEDURAL SOUND SYNTHESIS</h3>
          <p>
            All sound effects, chiptunes, and tracker rhythms are synthesized in real-time with the browser's Web Audio API without external audio files.
          </p>
        </div>

        <div className="border-t border-gray-300 pt-3 text-center text-[11px] text-gray-500 font-pixel">
          *** END OF TRANSMISSION &bull; HYPERLINK '98 v1.0.0 ***
        </div>
      </div>
    </div>
  );
}
