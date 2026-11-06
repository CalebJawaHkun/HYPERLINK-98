import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';

const DIFFICULTIES = {
  beginner: { name: 'Beginner', rows: 9, cols: 9, mines: 10 },
  intermediate: { name: 'Intermediate', rows: 16, cols: 16, mines: 40 },
  expert: { name: 'Expert', rows: 16, cols: 30, mines: 99 },
};

const NUMBER_COLORS = [
  '',
  'text-blue-600',
  'text-green-700',
  'text-red-600',
  'text-indigo-900',
  'text-amber-900',
  'text-teal-600',
  'text-black',
  'text-gray-600',
];

function createEmptyBoard(diffKey) {
  const config = DIFFICULTIES[diffKey] || DIFFICULTIES.beginner;
  const newBoard = [];
  for (let r = 0; r < config.rows; r++) {
    const row = [];
    for (let c = 0; c < config.cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
        isDetonated: false,
      });
    }
    newBoard.push(row);
  }
  return newBoard;
}

function generateMines(startRow, startCol, currentBoard, diffKey) {
  const config = DIFFICULTIES[diffKey] || DIFFICULTIES.beginner;
  const newBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));
  let placedMines = 0;

  while (placedMines < config.mines) {
    const r = Math.floor(Math.random() * config.rows);
    const c = Math.floor(Math.random() * config.cols);

    if (Math.abs(r - startRow) <= 1 && Math.abs(c - startCol) <= 1) continue;
    if (newBoard[r][c].isMine) continue;

    newBoard[r][c].isMine = true;
    placedMines++;
  }

  for (let r = 0; r < config.rows; r++) {
    for (let c = 0; c < config.cols; c++) {
      if (newBoard[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
            if (newBoard[nr][nc].isMine) count++;
          }
        }
      }
      newBoard[r][c].neighborMines = count;
    }
  }

  return newBoard;
}

export default function MinesweeperApp() {
  const [difficulty, setDifficulty] = useState('beginner');
  const [board, setBoard] = useState(() => createEmptyBoard('beginner'));
  const [gameState, setGameState] = useState('idle'); // idle, playing, won, lost
  const [minesLeft, setMinesLeft] = useState(10);
  const [timer, setTimer] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [bestTimes, setBestTimes] = useState(() => {
    try {
      const saved = localStorage.getItem('hyperlink98_mines_best');
      return saved ? JSON.parse(saved) : { beginner: 999, intermediate: 999, expert: 999 };
    } catch {
      return { beginner: 999, intermediate: 999, expert: 999 };
    }
  });

  const timerRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((prev) => Math.min(999, prev + 1));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleDifficultyChange = (diffKey) => {
    setDifficulty(diffKey);
    setBoard(createEmptyBoard(diffKey));
    setGameState('idle');
    setMinesLeft(DIFFICULTIES[diffKey].mines);
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleReset = () => {
    setBoard(createEmptyBoard(difficulty));
    setGameState('idle');
    setMinesLeft(DIFFICULTIES[difficulty].mines);
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Reveal cell with recursive flood-fill
  const revealCell = (r, c) => {
    if (gameState === 'won' || gameState === 'lost') return;

    let activeBoard = board;
    if (gameState === 'idle') {
      activeBoard = generateMines(r, c, board, difficulty);
      setGameState('playing');
    }

    const cell = activeBoard[r][c];
    if (cell.isRevealed || cell.isFlagged) return;

    soundManager.playTileReveal();
    const newBoard = activeBoard.map((row) => row.map((item) => ({ ...item })));

    // Detonated mine
    if (cell.isMine) {
      soundManager.playExplosion();
      newBoard[r][c].isDetonated = true;
      newBoard.forEach((row) => {
        row.forEach((item) => {
          if (item.isMine) item.isRevealed = true;
        });
      });
      setBoard(newBoard);
      setGameState('lost');
      return;
    }

    // Flood fill
    const floodFill = (row, col) => {
      if (row < 0 || row >= DIFFICULTIES[difficulty].rows || col < 0 || col >= DIFFICULTIES[difficulty].cols) return;
      const target = newBoard[row][col];
      if (target.isRevealed || target.isFlagged || target.isMine) return;

      target.isRevealed = true;
      if (target.neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            floodFill(row + dr, col + dc);
          }
        }
      }
    };

    floodFill(r, c);

    // Check victory
    let unrevealedSafeCells = 0;
    newBoard.forEach((row) => {
      row.forEach((item) => {
        if (!item.isMine && !item.isRevealed) unrevealedSafeCells++;
      });
    });

    if (unrevealedSafeCells === 0) {
      soundManager.playVictoryFanfare();
      setGameState('won');
      setMinesLeft(0);
      newBoard.forEach((row) => {
        row.forEach((item) => {
          if (item.isMine) item.isFlagged = true;
        });
      });
      if (timer < bestTimes[difficulty]) {
        const updated = { ...bestTimes, [difficulty]: timer };
        setBestTimes(updated);
        try {
          localStorage.setItem('hyperlink98_mines_best', JSON.stringify(updated));
        } catch {}
      }
    }

    setBoard(newBoard);
  };

  // Toggle Flag
  const toggleFlag = (e, r, c) => {
    e?.preventDefault?.();
    if (gameState === 'won' || gameState === 'lost') return;

    const cell = board[r][c];
    if (cell.isRevealed) return;

    soundManager.playFlag();
    const newBoard = board.map((row) => row.map((item) => ({ ...item })));
    const target = newBoard[r][c];
    target.isFlagged = !target.isFlagged;

    setMinesLeft((prev) => (target.isFlagged ? prev - 1 : prev + 1));
    setBoard(newBoard);
  };

  const handleCellClick = (r, c) => {
    if (flagMode) {
      toggleFlag(null, r, c);
    } else {
      revealCell(r, c);
    }
  };

  const getSmiley = () => {
    if (gameState === 'won') return '😎';
    if (gameState === 'lost') return '😵';
    if (isPressing) return '😮';
    return '🙂';
  };

  return (
    <div className="flex flex-col h-full bg-[var(--window-bg)] text-[var(--text-main)] p-2 select-none overflow-auto font-sans">
      {/* Top Menu Bar */}
      <div className="bevel-raised px-2 py-1 bg-[var(--btn-face)] mb-2 flex items-center justify-between text-xs font-bold shrink-0">
        <div className="flex items-center gap-2">
          <span>Difficulty:</span>
          {Object.keys(DIFFICULTIES).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                soundManager.playClick();
                handleDifficultyChange(k);
              }}
              className={`bevel-button px-2 py-0.5 capitalize text-[11px] ${
                difficulty === k ? 'active bg-blue-700 text-white font-bold' : ''
              }`}
            >
              {DIFFICULTIES[k].name}
            </button>
          ))}
        </div>

        {/* Mobile flag toggle helper */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setFlagMode(!flagMode);
          }}
          className={`bevel-button px-2 py-0.5 text-[11px] flex items-center gap-1 font-bold ${
            flagMode ? 'bg-amber-500 text-black active' : 'bg-gray-300'
          }`}
          title="Toggle Flagging Mode (Mobile Friendly)"
        >
          <span>🚩</span>
          <span>{flagMode ? 'Flag Mode ON' : 'Dig Mode'}</span>
        </button>
      </div>

      {/* Minesweeper Main Chassis Frame */}
      <div className="bevel-raised p-3 bg-[var(--btn-face)] flex flex-col items-center mx-auto my-auto max-w-full">
        {/* Score & Smiley Header Display */}
        <div className="bevel-sunken w-full p-2 bg-[#c0c0c0] mb-3 flex items-center justify-between">
          {/* Mine Counter LED */}
          <div className="led-counter text-2xl font-mono font-black w-14 text-center">
            {String(Math.max(-99, Math.min(999, minesLeft))).padStart(3, '0')}
          </div>

          {/* Smiley Reset Button */}
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              handleReset();
            }}
            onMouseDown={() => setIsPressing(true)}
            onMouseUp={() => setIsPressing(false)}
            onMouseLeave={() => setIsPressing(false)}
            className="bevel-button w-9 h-9 flex items-center justify-center text-xl bg-[#c0c0c0]"
            title="Reset Game"
          >
            {getSmiley()}
          </button>

          {/* Elapsed Timer LED */}
          <div className="led-counter text-2xl font-mono font-black w-14 text-center">
            {String(timer).padStart(3, '0')}
          </div>
        </div>

        {/* The Mines Grid */}
        <div
          className="bevel-sunken p-1 bg-[#808080] overflow-auto max-w-full max-h-[60vh]"
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
        >
          <div
            className="grid gap-[1px] bg-[#808080]"
            style={{
              gridTemplateColumns: `repeat(${DIFFICULTIES[difficulty].cols}, minmax(0, 1fr))`,
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isDetonated = cell.isDetonated;
                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    onContextMenu={(e) => toggleFlag(e, r, c)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs font-bold leading-none select-none font-pixel ${
                      cell.isRevealed
                        ? isDetonated
                          ? 'bg-red-600 text-white border border-gray-900'
                          : 'bg-[#c0c0c0] border border-gray-400'
                        : 'bevel-button bg-[#c0c0c0] active:translate-none'
                    }`}
                  >
                    {cell.isRevealed ? (
                      cell.isMine ? (
                        '💣'
                      ) : cell.neighborMines > 0 ? (
                        <span className={NUMBER_COLORS[cell.neighborMines]}>
                          {cell.neighborMines}
                        </span>
                      ) : null
                    ) : cell.isFlagged ? (
                      '🚩'
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer best record */}
        <div className="mt-2 text-[10px] text-gray-700 font-mono text-center">
          Best Time ({difficulty}):{' '}
          <span className="font-bold text-blue-900">
            {bestTimes[difficulty] < 999 ? `${bestTimes[difficulty]}s` : 'None'}
          </span>
        </div>
      </div>
    </div>
  );
}
