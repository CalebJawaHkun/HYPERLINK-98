import React, { useState, useEffect } from 'react';

/**
 * BaudStreamText
 * Simulates vintage telecomputing baud-rate teletype streaming
 * At 1200 baud, data arrives at ~120 characters per second.
 */
export default function BaudStreamText({
  text,
  baudMode = 'instant', // 'instant' or '1200baud'
  speedMs = 8,
  className = ''
}) {
  const [streamIndex, setStreamIndex] = useState(0);
  const [skipRequested, setSkipRequested] = useState(false);

  useEffect(() => {
    if (baudMode !== '1200baud' || skipRequested) return;

    const interval = setInterval(() => {
      setStreamIndex((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          return text.length;
        }
        return Math.min(prev + 2, text.length);
      });
    }, speedMs);

    return () => clearInterval(interval);
  }, [text, baudMode, speedMs, skipRequested]);

  const displayedText =
    baudMode === 'instant' || skipRequested ? text : text.slice(0, streamIndex);
  const isStreaming =
    baudMode === '1200baud' && !skipRequested && streamIndex < text.length;

  return (
    <div className={`relative ${className}`}>
      <span>{displayedText}</span>
      {isStreaming && (
        <span className="terminal-cursor" aria-hidden="true" />
      )}
      {isStreaming && (
        <button
          type="button"
          onClick={() => setSkipRequested(true)}
          className="ml-2 text-[10px] bg-yellow-400 text-black px-1.5 py-0.2 rounded font-pixel hover:bg-yellow-300 transition-colors uppercase"
          title="Skip terminal streaming"
        >
          ⚡ Turbo
        </button>
      )}
    </div>
  );
}
