import React, { useState, useRef, useEffect } from 'react';
import { soundManager } from '../../utils/audio';

const PALETTE = [
  '#000000', '#ffffff', '#7f7f7f', '#c3c3c3',
  '#880015', '#b97a57', '#ed1c24', '#ffaec9',
  '#ff7f27', '#ffc90e', '#fff200', '#efe4b0',
  '#22b14c', '#b5e61d', '#00a2e8', '#99d9ea',
  '#3f48cc', '#7092be', '#a349a4', '#c8bfe7'
];

export default function PixelPaint() {
  const [color, setColor] = useState('#ed1c24');
  const [tool, setTool] = useState('pen'); // pen, brush, spray, eraser
  const [size, setSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDraw = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const x = Math.floor((clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((clientY - rect.top) * (canvas.height / rect.height));

    if (tool === 'eraser') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - size * 2, y - size * 2, size * 4, size * 4);
    } else if (tool === 'spray') {
      ctx.fillStyle = color;
      for (let i = 0; i < 15; i++) {
        const offsetX = (Math.random() - 0.5) * size * 4;
        const offsetY = (Math.random() - 0.5) * size * 4;
        ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
      }
    } else if (tool === 'brush') {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Pen pixel block
      ctx.fillStyle = color;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  };

  const handleClear = () => {
    soundManager.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    soundManager.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `pixel-art-98-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-[var(--window-bg)] text-[var(--text-main)] p-2 font-mono select-none overflow-y-auto">
      {/* Paint Toolbar */}
      <div className="bevel-raised p-2 bg-[var(--btn-face)] mb-2 flex flex-wrap items-center justify-between gap-2">
        {/* Tools Selection */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setTool('pen'); }}
            className={`bevel-button px-2 py-1 text-xs font-bold ${tool === 'pen' ? 'active bg-blue-600 text-white' : ''}`}
            title="Pixel Pen"
          >
            ✏️ Pen
          </button>
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setTool('brush'); }}
            className={`bevel-button px-2 py-1 text-xs font-bold ${tool === 'brush' ? 'active bg-blue-600 text-white' : ''}`}
            title="Round Brush"
          >
            🖌️ Brush
          </button>
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setTool('spray'); }}
            className={`bevel-button px-2 py-1 text-xs font-bold ${tool === 'spray' ? 'active bg-blue-600 text-white' : ''}`}
            title="Spray Can"
          >
            💨 Spray
          </button>
          <button
            type="button"
            onClick={() => { soundManager.playClick(); setTool('eraser'); }}
            className={`bevel-button px-2 py-1 text-xs font-bold ${tool === 'eraser' ? 'active bg-blue-600 text-white' : ''}`}
            title="Eraser"
          >
            🧹 Eraser
          </button>
        </div>

        {/* Brush Size */}
        <div className="flex items-center gap-1 text-xs">
          <span className="font-bold text-[11px]">Size:</span>
          {[2, 4, 8, 14].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { soundManager.playClick(); setSize(s); }}
              className={`bevel-button w-6 h-6 flex items-center justify-center text-xs font-bold ${
                size === s ? 'active bg-blue-600 text-white' : ''
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Clear and Save */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleClear}
            className="bevel-button px-2.5 py-1 text-xs font-bold hover:bg-red-700 hover:text-white"
          >
            🗑️ Clear
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="bevel-button px-2.5 py-1 text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-600"
          >
            💾 Save PNG
          </button>
        </div>
      </div>

      {/* Main Drawing Area */}
      <div className="flex-1 flex flex-col sm:flex-row gap-2">
        {/* 16-Color Palette Grid */}
        <div className="bevel-raised p-1.5 bg-[var(--btn-face)] flex sm:flex-col flex-wrap gap-1 items-center justify-center shrink-0">
          <div className="text-[9px] font-pixel mb-1 hidden sm:block text-center">COLORS</div>
          <div className="grid grid-cols-10 sm:grid-cols-2 gap-1">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { soundManager.playClick(); setColor(c); }}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 bevel-button border ${
                  color === c ? 'ring-2 ring-blue-500 scale-110 z-10' : ''
                }`}
                title={c}
              />
            ))}
          </div>

          {/* Current Color Indicator */}
          <div className="mt-2 text-center hidden sm:block">
            <div className="text-[9px] font-bold opacity-75">CURRENT</div>
            <div
              style={{ backgroundColor: color }}
              className="w-7 h-7 bevel-sunken mx-auto mt-0.5"
            />
          </div>
        </div>

        {/* Canvas container */}
        <div className="bevel-sunken flex-1 bg-white flex items-center justify-center p-1 overflow-auto">
          <canvas
            ref={canvasRef}
            width={520}
            height={360}
            onMouseDown={startDraw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onMouseMove={draw}
            onTouchStart={startDraw}
            onTouchEnd={stopDraw}
            onTouchMove={draw}
            className="max-w-full h-auto bg-white cursor-crosshair shadow"
          />
        </div>
      </div>
    </div>
  );
}
