import React, { useState, useEffect, useRef } from 'react';
import { soundManager } from '../../utils/audio';

export default function CyberInvaders() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(1250);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const canvasRef = useRef(null);
  const gameStateRef = useRef({
    player: { x: 220, y: 320, width: 28, height: 16, speed: 6 },
    lasers: [],
    alienLasers: [],
    aliens: [],
    alienDirection: 1,
    alienSpeed: 0.8,
    keys: { left: false, right: false, space: false },
    lastShot: 0
  });

  const initAliens = () => {
    const aliens = [];
    const rows = 3;
    const cols = 7;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        aliens.push({
          x: 40 + c * 50,
          y: 35 + r * 35,
          width: 24,
          height: 18,
          alive: true,
          points: (3 - r) * 100,
          type: r === 0 ? '👾' : r === 1 ? '🛸' : '🐙'
        });
      }
    }
    return aliens;
  };

  const startGame = () => {
    soundManager.playClick();
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setIsStarted(true);

    gameStateRef.current = {
      player: { x: 220, y: 320, width: 28, height: 16, speed: 6 },
      lasers: [],
      alienLasers: [],
      aliens: initAliens(),
      alienDirection: 1,
      alienSpeed: 0.9,
      keys: { left: false, right: false, space: false },
      lastShot: 0
    };
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) gameStateRef.current.keys.left = true;
      if (['ArrowRight', 'KeyD'].includes(e.code)) gameStateRef.current.keys.right = true;
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        gameStateRef.current.keys.space = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) gameStateRef.current.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) gameStateRef.current.keys.right = false;
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) gameStateRef.current.keys.space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const loop = (timestamp) => {
      // Clear screen
      ctx.fillStyle = '#050712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 25; i++) {
        const sx = (i * 37 + (timestamp * 0.05)) % canvas.width;
        const sy = (i * 59) % canvas.height;
        ctx.fillRect(sx, sy, 2, 2);
      }

      if (isStarted && !gameOver && !gameWon) {
        const state = gameStateRef.current;

        // Player Move
        if (state.keys.left && state.player.x > 10) {
          state.player.x -= state.player.speed;
        }
        if (state.keys.right && state.player.x < canvas.width - state.player.width - 10) {
          state.player.x += state.player.speed;
        }

        // Player Shoot
        if (state.keys.space && timestamp - state.lastShot > 240) {
          state.lasers.push({
            x: state.player.x + state.player.width / 2 - 2,
            y: state.player.y - 4,
            width: 4,
            height: 10,
            speed: 7
          });
          soundManager.playLaser();
          state.lastShot = timestamp;
        }

        // Update Lasers
        state.lasers.forEach(l => l.y -= l.speed);
        state.lasers = state.lasers.filter(l => l.y > 0);

        // Update Aliens
        let edgeHit = false;
        let activeAliens = 0;

        state.aliens.forEach(alien => {
          if (!alien.alive) return;
          activeAliens++;
          alien.x += state.alienDirection * state.alienSpeed;

          if (alien.x < 10 || alien.x > canvas.width - alien.width - 10) {
            edgeHit = true;
          }

          // Random alien shoots laser
          if (Math.random() < 0.006) {
            state.alienLasers.push({
              x: alien.x + alien.width / 2,
              y: alien.y + alien.height,
              width: 3,
              height: 8,
              speed: 4
            });
          }
        });

        if (edgeHit) {
          state.alienDirection *= -1;
          state.aliens.forEach(alien => {
            alien.y += 12;
            if (alien.y + alien.height >= state.player.y && alien.alive) {
              setGameOver(true);
            }
          });
        }

        if (activeAliens === 0) {
          setGameWon(true);
        }

        // Update Alien Lasers & Collisions with Player
        state.alienLasers.forEach(al => al.y += al.speed);
        state.alienLasers = state.alienLasers.filter(al => al.y < canvas.height);

        state.alienLasers.forEach((al, index) => {
          if (
            al.x < state.player.x + state.player.width &&
            al.x + al.width > state.player.x &&
            al.y < state.player.y + state.player.height &&
            al.y + al.height > state.player.y
          ) {
            soundManager.playExplosion();
            state.alienLasers.splice(index, 1);
            setLives(l => {
              const remaining = l - 1;
              if (remaining <= 0) {
                setGameOver(true);
              }
              return remaining;
            });
          }
        });

        // Player Laser collisions with Aliens
        state.lasers.forEach((l, lIdx) => {
          state.aliens.forEach(alien => {
            if (
              alien.alive &&
              l.x < alien.x + alien.width &&
              l.x + l.width > alien.x &&
              l.y < alien.y + alien.height &&
              l.y + l.height > alien.y
            ) {
              alien.alive = false;
              state.lasers.splice(lIdx, 1);
              soundManager.playExplosion();
              setScore(s => {
                const newScore = s + alien.points;
                if (newScore > highScore) setHighScore(newScore);
                return newScore;
              });
            }
          });
        });

        // DRAW ALIENS
        state.aliens.forEach(alien => {
          if (!alien.alive) return;
          ctx.font = '16px sans-serif';
          ctx.fillText(alien.type, alien.x, alien.y + 14);
        });

        // DRAW PLAYER LASERS
        ctx.fillStyle = '#00ffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 6;
        state.lasers.forEach(l => {
          ctx.fillRect(l.x, l.y, l.width, l.height);
        });

        // DRAW ALIEN LASERS
        ctx.fillStyle = '#ff007f';
        ctx.shadowColor = '#ff007f';
        ctx.shadowBlur = 6;
        state.alienLasers.forEach(al => {
          ctx.fillRect(al.x, al.y, al.width, al.height);
        });
        ctx.shadowBlur = 0;

        // DRAW PLAYER SHIP
        ctx.fillStyle = '#39ff14';
        ctx.fillRect(state.player.x, state.player.y + 8, state.player.width, 8);
        ctx.fillRect(state.player.x + 8, state.player.y + 2, 12, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(state.player.x + 12, state.player.y, 4, 4);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isStarted, gameOver, gameWon, highScore]);

  return (
    <div className="flex flex-col h-full bg-[#070914] text-white p-2 font-mono select-none overflow-y-auto">
      {/* Top Arcade Header */}
      <div className="bevel-raised p-2 bg-[#181a2e] mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-xs text-yellow-300">CYBER INVADERS '98</span>
          <span className="font-pixel text-[10px] text-cyan-400">SCORE: {score}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-pixel text-[10px] text-pink-400">HI: {highScore}</span>
          <div className="flex gap-1 text-xs">
            {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
              <span key={i}>❤️</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas Screen */}
      <div className="relative bevel-sunken bg-black flex-1 flex items-center justify-center p-1 min-h-[350px]">
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          className="w-full max-w-[480px] h-auto bg-black block border border-cyan-900 shadow-inner"
        />

        {/* Start / Game Over / Victory Overlay */}
        {(!isStarted || gameOver || gameWon) && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center z-10">
            {gameOver ? (
              <>
                <div className="font-pixel text-xl text-red-500 mb-2 animate-bounce">
                  GAME OVER
                </div>
                <div className="text-xs text-gray-300 mb-4">
                  Final Score: <span className="text-yellow-400 font-bold">{score}</span>
                </div>
              </>
            ) : gameWon ? (
              <>
                <div className="font-pixel text-xl text-emerald-400 mb-2 animate-pulse">
                  MISSION ACCOMPLISHED!
                </div>
                <div className="text-xs text-gray-300 mb-4">
                  Cyberspace is safe! Final Score: <span className="text-yellow-400 font-bold">{score}</span>
                </div>
              </>
            ) : (
              <>
                <div className="font-pixel text-xl text-gold-chrome mb-2">
                  CYBER INVADERS '98
                </div>
                <p className="text-xs text-cyan-300 max-w-xs mb-4">
                  Defend the early web from descending alien bugs! Use Arrow Keys to move & Spacebar to fire.
                </p>
              </>
            )}

            <button
              type="button"
              onClick={startGame}
              className="bevel-button px-5 py-2 font-pixel text-xs bg-lime-600 text-black hover:bg-lime-500 font-black shadow-lg"
            >
              {isStarted ? '🔁 PLAY AGAIN' : '▶️ INSERT COIN / START'}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch Controls */}
      <div className="flex sm:hidden justify-between items-center gap-2 mt-2 pt-1 border-t border-gray-800">
        <div className="flex gap-2">
          <button
            type="button"
            onMouseDown={() => { gameStateRef.current.keys.left = true; }}
            onMouseUp={() => { gameStateRef.current.keys.left = false; }}
            onTouchStart={() => { gameStateRef.current.keys.left = true; }}
            onTouchEnd={() => { gameStateRef.current.keys.left = false; }}
            className="bevel-button px-4 py-2 font-bold bg-gray-800 text-white"
          >
            ◀ LEFT
          </button>
          <button
            type="button"
            onMouseDown={() => { gameStateRef.current.keys.right = true; }}
            onMouseUp={() => { gameStateRef.current.keys.right = false; }}
            onTouchStart={() => { gameStateRef.current.keys.right = true; }}
            onTouchEnd={() => { gameStateRef.current.keys.right = false; }}
            className="bevel-button px-4 py-2 font-bold bg-gray-800 text-white"
          >
            RIGHT ▶
          </button>
        </div>
        <button
          type="button"
          onMouseDown={() => { gameStateRef.current.keys.space = true; }}
          onMouseUp={() => { gameStateRef.current.keys.space = false; }}
          onTouchStart={() => { gameStateRef.current.keys.space = true; }}
          onTouchEnd={() => { gameStateRef.current.keys.space = false; }}
          className="bevel-button px-6 py-2 font-pixel text-xs bg-red-600 text-white"
        >
          FIRE 🔥
        </button>
      </div>
    </div>
  );
}
