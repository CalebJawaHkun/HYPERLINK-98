import React from 'react';
import { soundManager } from '../../utils/audio';

export default function ReadmeApp() {
  return (
    <div className="flex flex-col h-full bg-white text-black p-4 font-mono text-xs select-text overflow-y-auto leading-relaxed shadow-inner">
      <div className="border-b-2 border-black pb-2 mb-3">
        <h2 className="font-bold text-base font-pixel">README.TXT — HYPERLINK '98 CYBER PORTAL</h2>
        <div className="text-[11px] text-gray-600">Release: v1.998.10 &bull; Architecture: React 19 + Tailwind CSS</div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-sm text-blue-900 mb-1">📼 ABOUT THIS PROJECT</h3>
          <p>
            Welcome to HYPERLINK '98! This interactive desktop OS and web portal is a high-fidelity tribute to the raw creative spirit of the 1990s Information Superhighway, fused with modern 2026 performance and fluid design.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-sm text-blue-900 mb-1">🕹️ INCLUDED CYBER APPLICATIONS</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Web Explorer '98:</strong> The main Web 1.0 portal featuring active marquee, visitor counter, webring navigator, guestbook, and poll.</li>
            <li><strong>WinPulse '98 Player:</strong> Procedural chiptune multi-track synth with animated real-time spectrum visualizer.</li>
            <li><strong>Cyber Invaders:</strong> 8-bit space arcade shooter minigame with score & lives tracking.</li>
            <li><strong>BBS Cyber-Terminal:</strong> Interactive MS-DOS / VT100 prompt with commands like <code className="bg-gray-200 px-1 font-bold">dialup</code>, <code className="bg-gray-200 px-1 font-bold">matrix</code>, <code className="bg-gray-200 px-1 font-bold">sysinfo</code>, and <code className="bg-gray-200 px-1 font-bold">fortune</code>.</li>
            <li><strong>PixelPaint '98:</strong> 16-color retro canvas drawing tool with PNG download.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-blue-900 mb-1">🎨 CUSTOM THEMES & CRT SCANLINES</h3>
          <p>
            Use the bottom system tray dropdown to switch between 4 handcrafted vintage palettes:
            <em> Windows 95 Classic</em>, <em>Cyber Geocities Neon</em>, <em>Mac OS Platinum</em>, and <em>Phosphor Green Matrix</em>.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-sm text-blue-900 mb-1">🔊 PROCEDURAL SOUND SYNTHESIS</h3>
          <p>
            All sound effects and chiptune audio are synthesized purely in real-time with the Web Audio API without relying on external media files. You can toggle audio anytime via the bottom taskbar speaker icon.
          </p>
        </div>

        <div className="border-t border-gray-300 pt-3 text-center text-[11px] text-gray-500 font-pixel">
          *** END OF TRANSMISSION ***
        </div>
      </div>
    </div>
  );
}
