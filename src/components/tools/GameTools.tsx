/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, RefreshCw, Trophy, ChevronRight, ChevronLeft, Volume2, VolumeX, Flame, Zap, Award, Smile } from 'lucide-react';

interface GameProps {
  language: 'en' | 'fa';
}

// Simple synthesizer for game audio (sound effects) using Web Audio API
const playSound = (type: 'merge' | 'score' | 'gameover' | 'click' | 'win') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    switch (type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
        break;
      }
      case 'merge': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        break;
      }
      case 'score': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        break;
      }
      case 'win': {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.08, now + idx * 0.1);
          gain.gain.linearRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.25);
        });
        break;
      }
      case 'gameover': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        break;
      }
    }
  } catch (e) {
    // AudioContext blocked or not supported
  }
};

// ==========================================
// GAME 1: MEMORY MATRIX
// ==========================================
export function MemoryMatrixGame({ language }: GameProps) {
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3); // 3x3 initially
  const [activeTiles, setActiveTiles] = useState<number[]>([]);
  const [showPattern, setShowPattern] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [status, setStatus] = useState<'idle' | 'showing' | 'playing' | 'fail' | 'win'>('idle');
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('game_mem_high') || '1'); } catch { return 1; }
  });

  const generatePattern = (currentLevel: number) => {
    // Determine grid size based on level
    let size = 3;
    if (currentLevel > 3) size = 4;
    if (currentLevel > 7) size = 5;
    if (currentLevel > 12) size = 6;
    setGridSize(size);

    const totalCells = size * size;
    // Highlight cells count: increases with level
    const tilesCount = 3 + Math.floor(currentLevel / 1.8);
    const pattern: number[] = [];

    while (pattern.length < Math.min(tilesCount, totalCells - 2)) {
      const idx = Math.floor(Math.random() * totalCells);
      if (!pattern.includes(idx)) {
        pattern.push(idx);
      }
    }

    setActiveTiles(pattern);
    setSelectedTiles([]);
    setStatus('showing');
    setShowPattern(true);
    playSound('click');

    // Display pattern for some time
    const showTime = Math.max(1200 - currentLevel * 50, 700);
    setTimeout(() => {
      setShowPattern(false);
      setStatus('playing');
    }, showTime);
  };

  const handleTileClick = (index: number) => {
    if (status !== 'playing') return;

    if (activeTiles.includes(index)) {
      if (selectedTiles.includes(index)) return; // already clicked

      const updated = [...selectedTiles, index];
      setSelectedTiles(updated);
      playSound('click');

      // Check if all correct tiles are revealed
      if (updated.length === activeTiles.length) {
        setStatus('win');
        playSound('score');
        const nextLvl = level + 1;
        setLevel(nextLvl);
        if (nextLvl > highScore) {
          setHighScore(nextLvl);
          localStorage.setItem('game_mem_high', nextLvl.toString());
        }
        setTimeout(() => {
          generatePattern(nextLvl);
        }, 1200);
      }
    } else {
      // Wrong tile clicked
      setStatus('fail');
      playSound('gameover');
    }
  };

  const startGame = () => {
    setLevel(1);
    generatePattern(1);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
      <div className="flex justify-between items-center w-full bg-zinc-950 p-4 rounded-2xl border border-zinc-850">
        <div className="text-center">
          <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
            {language === 'en' ? 'LEVEL' : 'مرحله'}
          </p>
          <p className="text-2xl font-black text-indigo-400 font-mono">{level}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
            {language === 'en' ? 'HIGH SCORE' : 'بهترین رکورد'}
          </p>
          <p className="text-2xl font-black text-amber-400 font-mono flex items-center gap-1 justify-center">
            <Trophy className="h-4.5 w-4.5 text-amber-400" />
            <span>{highScore}</span>
          </p>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h3 className="font-bold text-sm text-zinc-200">
          {status === 'idle' && (language === 'en' ? 'Test your photographic memory!' : 'حافظه تصویری خود را تست کنید!')}
          {status === 'showing' && (language === 'en' ? 'Memorize the glowing tiles...' : 'کاشی‌های درخشان را به ذهن بسپارید...')}
          {status === 'playing' && (language === 'en' ? 'Re-create the pattern!' : 'کاشی‌های ذخیره شده را کلیک کنید!')}
          {status === 'win' && (language === 'en' ? 'Incredible! Level Complete!' : 'آفرین! مرحله بعدی...')}
          {status === 'fail' && (language === 'en' ? 'Oops! Game Over.' : 'اشتباه بود! باختید.')}
        </h3>
        <p className="text-[11px] text-zinc-500">
          {language === 'en'
            ? 'Watch the grid glow, then click those exact squares.'
            : 'کاشی‌های درخشان را به یاد بسپارید و پس از ناپدید شدن، رویشان کلیک کنید.'}
        </p>
      </div>

      {status === 'idle' ? (
        <button
          onClick={startGame}
          className="w-full max-w-xs py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/30 cursor-pointer"
        >
          <Play className="h-4 w-4" />
          <span>{language === 'en' ? 'START TRAINING' : 'شروع بازی'}</span>
        </button>
      ) : (
        <div
          className="grid gap-3 bg-zinc-950 p-4 rounded-[32px] border-2 border-zinc-900 shadow-2xl relative"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            width: '310px',
            height: '310px',
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
            const isPattern = activeTiles.includes(idx);
            const isSelected = selectedTiles.includes(idx);
            let cellStyle = "bg-zinc-900 border border-zinc-850 hover:bg-zinc-850/60";

            if (showPattern && isPattern) {
              cellStyle = "bg-indigo-500 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.65)]";
            } else if (isSelected) {
              cellStyle = "bg-indigo-600 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]";
            } else if (status === 'fail' && isPattern) {
              cellStyle = "bg-emerald-950/60 border-emerald-500/50 text-emerald-400";
            }

            return (
              <button
                key={idx}
                onClick={() => handleTileClick(idx)}
                disabled={status !== 'playing'}
                className={`rounded-xl transition-all duration-250 cursor-pointer ${cellStyle} ${
                  status === 'fail' && !isPattern ? 'opacity-45' : ''
                }`}
              />
            );
          })}

          {status === 'fail' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-4 space-y-4">
              <span className="text-sm font-bold text-red-400">
                {language === 'en' ? 'FAILED AT LEVEL' : 'باخت در مرحله'} {level}
              </span>
              <button
                onClick={startGame}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold rounded-lg border border-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{language === 'en' ? 'TRY AGAIN' : 'تلاش دوباره'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// GAME 2: NEON SNAKE
// ==========================================
export function NeonSnakeGame({ language }: GameProps) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('game_snake_high') || '0'); } catch { return 0; }
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 1, y: 0 });
  const dirRef = useRef({ x: 1, y: 0 });

  const CELL_SIZE = 19; // Bigger blocks
  const GRID_SIZE = 22; // Larger grid area

  const snakeRef = useRef<{ x: number; y: number }[]>([
    { x: 11, y: 11 },
    { x: 10, y: 11 },
    { x: 9, y: 11 },
  ]);
  const foodRef = useRef<{ x: number; y: number }>({ x: 5, y: 5 });

  const generateFood = () => {
    let x, y;
    while (true) {
      x = Math.floor(Math.random() * GRID_SIZE);
      y = Math.floor(Math.random() * GRID_SIZE);
      if (!snakeRef.current.some((segment) => segment.x === x && segment.y === y)) {
        break;
      }
    }
    foodRef.current = { x, y };
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!isPlaying || gameOver) return;
    const current = dirRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (current.y === 0) { setDir({ x: 0, y: -1 }); dirRef.current = { x: 0, y: -1 }; }
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (current.y === 0) { setDir({ x: 0, y: 1 }); dirRef.current = { x: 0, y: 1 }; }
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (current.x === 0) { setDir({ x: -1, y: 0 }); dirRef.current = { x: -1, y: 0 }; }
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (current.x === 0) { setDir({ x: 1, y: 0 }); dirRef.current = { x: 1, y: 0 }; }
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let intervalId: any;

    const gameLoop = () => {
      // 1. Move Snake
      const head = { ...snakeRef.current[0] };
      head.x += dirRef.current.x;
      head.y += dirRef.current.y;

      // Wall Collisions (Wrap around for smooth action)
      if (head.x < 0) head.x = GRID_SIZE - 1;
      if (head.x >= GRID_SIZE) head.x = 0;
      if (head.y < 0) head.y = GRID_SIZE - 1;
      if (head.y >= GRID_SIZE) head.y = 0;

      // Self Collision
      if (snakeRef.current.some((seg) => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        playSound('gameover');
        setIsPlaying(false);
        return;
      }

      // Add new head
      snakeRef.current.unshift(head);

      // Check if ate food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore((prev) => {
          const next = prev + 10;
          if (next > highScore) {
            setHighScore(next);
            localStorage.setItem('game_snake_high', next.toString());
          }
          return next;
        });
        playSound('score');
        generateFood();
      } else {
        // Remove tail
        snakeRef.current.pop();
      }

      // Draw Everything
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid helper lines (beautiful cyberpunk sub-lines)
      ctx.strokeStyle = '#0f0f1c';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(canvas.width, i * CELL_SIZE);
        ctx.stroke();
      }

      // Draw neon pulsing food
      const pulseRadius = CELL_SIZE / 2.5 + Math.sin(Date.now() / 100) * 1;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#f43f5e';
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * CELL_SIZE + CELL_SIZE / 2,
        foodRef.current.y * CELL_SIZE + CELL_SIZE / 2,
        Math.max(4, pulseRadius),
        0,
        2 * Math.PI
      );
      ctx.fill();

      // Draw neon snake segments
      ctx.shadowColor = '#6366f1';
      snakeRef.current.forEach((seg, index) => {
        const isHead = index === 0;
        ctx.shadowBlur = isHead ? 20 : 8;
        ctx.fillStyle = isHead ? '#818cf8' : '#4f46e5';
        
        ctx.beginPath();
        ctx.roundRect(
          seg.x * CELL_SIZE + 1.5,
          seg.y * CELL_SIZE + 1.5,
          CELL_SIZE - 3,
          CELL_SIZE - 3,
          isHead ? 6 : 4
        );
        ctx.fill();

        // Render cute snake glowing eyes on the head!
        if (isHead) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          const eyeSize = 3;
          const eyeOffset = 4;
          
          if (dirRef.current.x !== 0) { // Moving Left/Right
            const eyeX = seg.x * CELL_SIZE + (dirRef.current.x > 0 ? CELL_SIZE - 6 : 4);
            ctx.fillRect(eyeX, seg.y * CELL_SIZE + 4, eyeSize, eyeSize);
            ctx.fillRect(eyeX, seg.y * CELL_SIZE + CELL_SIZE - 7, eyeSize, eyeSize);
          } else { // Moving Up/Down
            const eyeY = seg.y * CELL_SIZE + (dirRef.current.y > 0 ? CELL_SIZE - 6 : 4);
            ctx.fillRect(seg.x * CELL_SIZE + 4, eyeY, eyeSize, eyeSize);
            ctx.fillRect(seg.x * CELL_SIZE + CELL_SIZE - 7, eyeY, eyeSize, eyeSize);
          }
        }
      });

      // Clear shadow properties
      ctx.shadowBlur = 0;
    };

    intervalId = setInterval(gameLoop, 100); // slightly faster & smoother frame rate
    return () => clearInterval(intervalId);
  }, [isPlaying, gameOver, highScore]);

  const startGame = () => {
    snakeRef.current = [
      { x: 11, y: 11 },
      { x: 10, y: 11 },
      { x: 9, y: 11 },
    ];
    dirRef.current = { x: 1, y: 0 };
    setDir({ x: 1, y: 0 });
    setScore(0);
    generateFood();
    setGameOver(false);
    setIsPlaying(true);
    playSound('click');
  };

  const setVirtualDir = (x: number, y: number) => {
    if (!isPlaying || gameOver) return;
    const current = dirRef.current;
    if (x !== 0 && current.x === 0) {
      setDir({ x, y });
      dirRef.current = { x, y };
      playSound('click');
    } else if (y !== 0 && current.y === 0) {
      setDir({ x, y });
      dirRef.current = { x, y };
      playSound('click');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 max-w-md mx-auto">
      <div className="flex justify-between items-center w-full bg-zinc-950 p-3.5 rounded-2xl border border-zinc-850">
        <div className="text-center">
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">{language === 'en' ? 'SCORE' : 'امتیاز'}</span>
          <p className="text-xl font-black text-indigo-400 font-mono">{score}</p>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">{language === 'en' ? 'TOP RECORD' : 'رکورد برتر'}</span>
          <p className="text-xl font-black text-amber-400 font-mono">{highScore}</p>
        </div>
      </div>

      <div className="relative border-4 border-zinc-900 bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="block"
        />

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-100">
              {gameOver ? (language === 'en' ? '🔴 SQUASHED!' : '🔴 باختید!') : (language === 'en' ? '🟢 Ready to Roll?' : '🟢 آماده بازی؟')}
            </h3>
            <p className="text-[11px] text-zinc-500 leading-normal max-w-[200px]">
              {language === 'en' ? 'Steer snake to collect points without hitting yourself!' : 'بدون برخورد به بدنتان سیب‌ها را جمع کنید!'}
            </p>
            <button
              onClick={startGame}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-950/40 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{gameOver ? (language === 'en' ? 'REPLAY' : 'شروع مجدد') : (language === 'en' ? 'PLAY NOW' : 'شروع بازی')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Touch virtual controllers for mobile users */}
      <div className="w-full max-w-[220px] grid grid-cols-3 gap-2.5 text-zinc-400">
        <div />
        <button
          onClick={() => setVirtualDir(0, -1)}
          className="p-3.5 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 rounded-xl border border-zinc-850 flex justify-center cursor-pointer font-bold text-sm"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => setVirtualDir(-1, 0)}
          className="p-3.5 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 rounded-xl border border-zinc-850 flex justify-center cursor-pointer font-bold text-sm"
        >
          ◀
        </button>
        <button
          onClick={() => setVirtualDir(0, 1)}
          className="p-3.5 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 rounded-xl border border-zinc-850 flex justify-center cursor-pointer font-bold text-sm"
        >
          ▼
        </button>
        <button
          onClick={() => setVirtualDir(1, 0)}
          className="p-3.5 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 rounded-xl border border-zinc-850 flex justify-center cursor-pointer font-bold text-sm"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

// ==========================================
// GAME 3: 2048 FUSION
// ==========================================
export function Game2048({ language }: GameProps) {
  const [board, setBoard] = useState<number[]>(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('game_2048_high') || '0'); } catch { return 0; }
  });
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const initGame = () => {
    let newBoard = Array(16).fill(0);
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setHasWon(false);
    playSound('click');
  };

  const addRandomTile = (currentBoard: number[]) => {
    const emptyIndices = currentBoard
      .map((val, idx) => (val === 0 ? idx : -1))
      .filter((idx) => idx !== -1);
    
    if (emptyIndices.length === 0) return currentBoard;
    const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const value = Math.random() < 0.9 ? 2 : 4;
    const copy = [...currentBoard];
    copy[randomIdx] = value;
    return copy;
  };

  const rotateLeft = (flatBoard: number[]) => {
    const next = Array(16).fill(0);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        next[r * 4 + c] = flatBoard[c * 4 + (3 - r)];
      }
    }
    return next;
  };

  const slideRowLeft = (row: number[], scoreAcc: { val: number }) => {
    // 1. Filter out zeros
    let filtered = row.filter((val) => val !== 0);
    const result: number[] = [];
    
    // 2. Merge adjacent equal values
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const mergedVal = filtered[i] * 2;
        result.push(mergedVal);
        scoreAcc.val += mergedVal;
        i++; // skip next segment
      } else {
        result.push(filtered[i]);
      }
    }

    // Fill the rest with zeros
    while (result.length < 4) {
      result.push(0);
    }
    return result;
  };

  const slideLeft = (currentBoard: number[], scoreAcc: { val: number }) => {
    const next = [...currentBoard];
    for (let r = 0; r < 4; r++) {
      const row = [next[r * 4], next[r * 4 + 1], next[r * 4 + 2], next[r * 4 + 3]];
      const processed = slideRowLeft(row, scoreAcc);
      next[r * 4] = processed[0];
      next[r * 4 + 1] = processed[1];
      next[r * 4 + 2] = processed[2];
      next[r * 4 + 3] = processed[3];
    }
    return next;
  };

  const move = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;
    let scoreAcc = { val: 0 };
    let current = [...board];
    let rotated = [...board];

    // Determine rotations needed
    if (direction === 'left') {
      rotated = slideLeft(current, scoreAcc);
    } else if (direction === 'down') {
      // Rotate 1 time left, slide left, rotate 3 times left (or equivalent)
      current = rotateLeft(current);
      current = rotateLeft(current);
      current = rotateLeft(current);
      current = slideLeft(current, scoreAcc);
      current = rotateLeft(current);
      rotated = current;
    } else if (direction === 'right') {
      current = rotateLeft(current);
      current = rotateLeft(current);
      current = slideLeft(current, scoreAcc);
      current = rotateLeft(current);
      current = rotateLeft(current);
      rotated = current;
    } else if (direction === 'up') {
      current = rotateLeft(current);
      current = slideLeft(current, scoreAcc);
      current = rotateLeft(current);
      current = rotateLeft(current);
      current = rotateLeft(current);
      rotated = current;
    }

    // If board changed, add new tile
    const changed = JSON.stringify(board) !== JSON.stringify(rotated);
    if (changed) {
      const nextBoard = addRandomTile(rotated);
      setBoard(nextBoard);
      
      const newScore = score + scoreAcc.val;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('game_2048_high', newScore.toString());
      }

      if (scoreAcc.val > 0) {
        playSound('merge');
      } else {
        playSound('click');
      }

      // Check win condition (if 2048 is hit)
      if (nextBoard.includes(2048) && !hasWon) {
        setHasWon(true);
        playSound('win');
      }

      // Check lose condition
      if (isGameOver(nextBoard)) {
        setGameOver(true);
        playSound('gameover');
      }
    }
  };

  const isGameOver = (currentBoard: number[]) => {
    if (currentBoard.includes(0)) return false;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = currentBoard[r * 4 + c];
        // Check down neighbor
        if (r < 3 && val === currentBoard[(r + 1) * 4 + c]) return false;
        // Check right neighbor
        if (c < 3 && val === currentBoard[r * 4 + (c + 1)]) return false;
      }
    }
    return true;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) move('left');
    else if (['ArrowRight', 'd', 'D'].includes(e.key)) move('right');
    else if (['ArrowUp', 'w', 'W'].includes(e.key)) move('up');
    else if (['ArrowDown', 's', 'S'].includes(e.key)) move('down');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver]);

  useEffect(() => {
    initGame();
  }, []);

  const getTileColor = (val: number) => {
    switch (val) {
      case 2: return 'bg-zinc-900 text-zinc-100 border-zinc-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]';
      case 4: return 'bg-zinc-850 text-zinc-100 border-zinc-750 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]';
      case 8: return 'bg-indigo-950/60 text-indigo-200 border-indigo-900/40 shadow-[0_0_10px_rgba(99,102,241,0.15)]';
      case 16: return 'bg-indigo-900/50 text-indigo-100 border-indigo-800/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]';
      case 32: return 'bg-violet-950/60 text-violet-200 border-violet-900/40 shadow-[0_0_15px_rgba(139,92,246,0.2)]';
      case 64: return 'bg-violet-900/50 text-violet-100 border-violet-800/50 shadow-[0_0_18px_rgba(139,92,246,0.3)]';
      case 128: return 'bg-fuchsia-950/60 text-fuchsia-200 border-fuchsia-900/40 shadow-[0_0_20px_rgba(217,70,239,0.25)]';
      case 256: return 'bg-fuchsia-900/50 text-fuchsia-100 border-fuchsia-800/50 shadow-[0_0_22px_rgba(217,70,239,0.35)]';
      case 512: return 'bg-pink-950/60 text-pink-200 border-pink-900/50 shadow-[0_0_25px_rgba(236,72,153,0.3)]';
      case 1024: return 'bg-pink-900/50 text-pink-100 border-pink-800/50 shadow-[0_0_28px_rgba(236,72,153,0.4)]';
      case 2048: return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.6)] animate-pulse';
      default: return 'bg-zinc-950/60 border-zinc-900/80 text-zinc-700';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 max-w-md mx-auto">
      <div className="flex justify-between items-center w-full bg-zinc-950 p-3.5 rounded-2xl border border-zinc-850">
        <div className="text-center">
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">{language === 'en' ? 'SCORE' : 'امتیاز'}</span>
          <p className="text-xl font-black text-indigo-400 font-mono">{score}</p>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">{language === 'en' ? 'BEST' : 'بیشترین'}</span>
          <p className="text-xl font-black text-amber-400 font-mono">{highScore}</p>
        </div>
      </div>

      <div className="relative p-4 bg-zinc-950 rounded-[32px] border-2 border-zinc-900 shadow-2xl">
        {/* Expanded 2048 Board */}
        <div className="grid grid-cols-4 gap-3 w-[310px] h-[310px]">
          {board.map((tile, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center font-mono font-extrabold text-xl rounded-2xl border transition-all duration-150 ${getTileColor(tile)}`}
            >
              {tile > 0 ? tile : ''}
            </div>
          ))}
        </div>

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-[32px] flex flex-col items-center justify-center p-4 text-center space-y-4">
            <h3 className="font-extrabold text-sm text-red-400">
              {language === 'en' ? 'NO MORE MOVES!' : 'حرکت دیگری نمانده!'}
            </h3>
            <button
              onClick={initGame}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'TRY AGAIN' : 'تلاش دوباره'}</span>
            </button>
          </div>
        )}

        {hasWon && (
          <div className="absolute inset-0 bg-indigo-950/95 backdrop-blur-sm rounded-[32px] flex flex-col items-center justify-center p-4 text-center space-y-4">
            <Award className="h-10 w-10 text-amber-400 animate-bounce" />
            <h3 className="font-extrabold text-base text-yellow-300">
              {language === 'en' ? 'YOU MERGED 2048!' : 'شما به کاشی ۲۰۴۸ رسیدید!'}
            </h3>
            <button
              onClick={() => setHasWon(false)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              {language === 'en' ? 'CONTINUE' : 'ادامه بازی'}
            </button>
          </div>
        )}
      </div>

      {/* D-PAD controls for mobile navigation */}
      <div className="w-full max-w-[200px] grid grid-cols-3 gap-2 text-zinc-400">
        <div />
        <button
          onClick={() => move('up')}
          className="p-3 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 rounded-xl border border-zinc-850 flex justify-center cursor-pointer font-bold"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => move('left')}
          className="p-3 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 rounded-xl border border-zinc-850 flex justify-center cursor-pointer font-bold"
        >
          ◀
        </button>
        <button
          onClick={() => move('down')}
          className="p-3 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 rounded-xl border border-zinc-850 flex justify-center cursor-pointer font-bold"
        >
          ▼
        </button>
        <button
          onClick={() => move('right')}
          className="p-3 bg-zinc-900 hover:bg-zinc-850 active:bg-zinc-800 rounded-xl border border-zinc-850 flex justify-center cursor-pointer font-bold"
        >
          ▶
        </button>
      </div>
    </div>
  );
}

// ==========================================
// GAME 4: QUANTUM TIC-TAC-TOE AI
// ==========================================
export function TicTacToeGame({ language }: GameProps) {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'impossible'>('impossible');
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diag
  ];

  const checkWinner = (grid: string[]) => {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
        return { win: grid[a], line: lines[i] };
      }
    }
    return null;
  };

  const minimax = (grid: string[], depth: number, isMax: boolean): number => {
    const check = checkWinner(grid);
    if (check) {
      return check.win === 'O' ? 10 - depth : depth - 10;
    }
    if (!grid.includes('')) return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (grid[i] === '') {
          grid[i] = 'O';
          best = Math.max(best, minimax(grid, depth + 1, false));
          grid[i] = '';
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (grid[i] === '') {
          grid[i] = 'X';
          best = Math.min(best, minimax(grid, depth + 1, true));
          grid[i] = '';
        }
      }
      return best;
    }
  };

  const getBestMove = (grid: string[]) => {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (grid[i] === '') {
        grid[i] = 'O'; // AI is O
        const moveVal = minimax(grid, 0, false);
        grid[i] = '';
        if (moveVal > bestVal) {
          bestVal = moveVal;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const handleCellClick = (idx: number) => {
    if (board[idx] !== '' || winner || !isPlayerTurn) return;

    playSound('click');
    const copy = [...board];
    copy[idx] = 'X'; // Player is X
    setBoard(copy);

    const check = checkWinner(copy);
    if (check) {
      setWinner('X');
      setWinningLine(check.line);
      playSound('win');
      return;
    }

    if (!copy.includes('')) {
      setWinner('draw');
      playSound('gameover');
      return;
    }

    // AI's turn
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    if (isPlayerTurn || winner) return;

    const timer = setTimeout(() => {
      const copy = [...board];
      let aiMove = -1;

      if (difficulty === 'easy') {
        const empties = copy.map((v, i) => v === '' ? i : -1).filter(i => i !== -1);
        aiMove = empties[Math.floor(Math.random() * empties.length)];
      } else {
        aiMove = getBestMove(copy);
      }

      if (aiMove !== -1) {
        copy[aiMove] = 'O';
        setBoard(copy);
        playSound('click');

        const check = checkWinner(copy);
        if (check) {
          setWinner('O');
          setWinningLine(check.line);
          playSound('gameover');
        } else if (!copy.includes('')) {
          setWinner('draw');
          playSound('gameover');
        }
      }
      setIsPlayerTurn(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [isPlayerTurn]);

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setWinner(null);
    setWinningLine(null);
    setIsPlayerTurn(true);
    playSound('click');
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 max-w-md mx-auto select-none">
      <div className="flex items-center justify-between w-full bg-zinc-950 p-2.5 rounded-2xl border border-zinc-850 text-xs">
        <span className="text-zinc-400 font-bold">{language === 'en' ? 'AI LEVEL' : 'هوش مصنوعی'}</span>
        <div className="flex bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
          <button
            onClick={() => setDifficulty('easy')}
            className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${difficulty === 'easy' ? 'bg-zinc-800 text-indigo-400 border border-zinc-750' : 'text-zinc-500'}`}
          >
            {language === 'en' ? 'Easy' : 'آسان'}
          </button>
          <button
            onClick={() => setDifficulty('impossible')}
            className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${difficulty === 'impossible' ? 'bg-zinc-800 text-indigo-400 border border-zinc-750' : 'text-zinc-500'}`}
          >
            {language === 'en' ? 'Unbeatable' : 'غیرممکن'}
          </button>
        </div>
      </div>

      {/* Expanded TicTacToe Board */}
      <div className="grid grid-cols-3 gap-3 bg-zinc-950 p-4 rounded-[32px] border-2 border-zinc-900 w-[290px] h-[290px] relative overflow-hidden">
        {board.map((cell, idx) => {
          const isWinning = winningLine?.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              className={`flex items-center justify-center text-3xl font-black font-mono rounded-2xl border cursor-pointer transition-all ${
                isWinning
                  ? cell === 'X'
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                    : 'bg-rose-950 border-rose-500 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                  : cell === 'X'
                    ? 'bg-zinc-900 border-zinc-800 text-indigo-400 font-mono shadow-[0_0_8px_rgba(99,102,241,0.1)]'
                    : cell === 'O'
                      ? 'bg-zinc-900 border-zinc-800 text-rose-400 font-mono shadow-[0_0_8px_rgba(244,63,94,0.1)]'
                      : 'bg-zinc-900/40 border-zinc-850 hover:bg-zinc-900'
              }`}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <div className="text-center space-y-3.5">
        <p className="text-xs text-zinc-400 font-bold">
          {winner === 'X' && (language === 'en' ? '🎉 YOU DEFEATED THE QUANTUM AI!' : '🎉 شما برنده شدید!')}
          {winner === 'O' && (language === 'en' ? '🤖 THE QUANTUM AI WIN!' : '🤖 هوش مصنوعی برنده شد!')}
          {winner === 'draw' && (language === 'en' ? '🤝 REMARKABLE DRAW!' : '🤝 مساوی بی عیب و نقص')}
          {!winner && isPlayerTurn && (language === 'en' ? 'Your turn (X)' : 'نوبت شماست (X)')}
          {!winner && !isPlayerTurn && (language === 'en' ? 'AI calculating...' : 'کامپیوتر در حال محاسبه...')}
        </p>

        <button
          onClick={resetGame}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-xs font-bold rounded-xl border border-zinc-850 flex items-center gap-1.5 mx-auto transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{language === 'en' ? 'RESET BOARD' : 'شروع مجدد'}</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// GAME 5: SPRINT SPEED TYPER
// ==========================================
export function SpeedTyperGame({ language }: GameProps) {
  const words_en = [
    "constant variable = 42;",
    "console.log('Premium App');",
    "interface UserProfile { id: string; }",
    "const [state, setState] = useState(null);",
    "export default function App() { return <div />; }",
    "import { motion } from 'motion/react';",
    "const query = await fetch('/api/tools');",
    "const sum = numbers.reduce((acc, curr) => acc + curr, 0);"
  ];

  const words_fa = [
    "ثابت‌ها تغییر نمی‌کنند.",
    "هوش مصنوعی آینده وب است.",
    "کدهای زیبا همیشه خوانا هستند.",
    "توسعه‌دهندگان خلاق ارزش‌آفرینند.",
    "رابط کاربری مینیمال و کاربرپسند",
    "یک فنجان قهوه داغ و شروع برنامه‌نویسی",
    "سادگی غایت کمال و زیبایی است."
  ];

  const targetWords = language === 'en' ? words_en : words_fa;

  const [currentWord, setCurrentWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [totalChars, setTotalChars] = useState(0);

  const initGame = () => {
    setCurrentWord(targetWords[Math.floor(Math.random() * targetWords.length)]);
    setInputValue('');
    setScore(0);
    setTimeLeft(30);
    setWpm(0);
    setTotalChars(0);
    setIsPlaying(true);
    playSound('click');
  };

  useEffect(() => {
    if (!isPlaying || timeLeft === 0) {
      if (timeLeft === 0 && isPlaying) {
        setIsPlaying(false);
        playSound('gameover');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Calculate WPM in real-time
  useEffect(() => {
    if (!isPlaying) return;
    const elapsedMinutes = (30 - timeLeft) / 60;
    if (elapsedMinutes > 0) {
      const calculatedWpm = Math.round((totalChars / 5) / elapsedMinutes);
      setWpm(calculatedWpm);
    }
  }, [totalChars, timeLeft, isPlaying]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val === currentWord) {
      playSound('score');
      setScore((prev) => prev + 10);
      setTotalChars((prev) => prev + currentWord.length);
      setInputValue('');
      setCurrentWord(targetWords[Math.floor(Math.random() * targetWords.length)]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto select-none">
      <div className="flex justify-between items-center w-full bg-zinc-950 p-4 rounded-2xl border border-zinc-850">
        <div className="text-center">
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">{language === 'en' ? 'TIME' : 'زمان'}</span>
          <p className={`text-xl font-black font-mono ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-zinc-200'}`}>{timeLeft}s</p>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">{language === 'en' ? 'WPM SPEED' : 'کلمات در دقیقه'}</span>
          <p className="text-xl font-black text-emerald-400 font-mono">{wpm}</p>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">{language === 'en' ? 'SCORE' : 'امتیاز'}</span>
          <p className="text-xl font-black text-indigo-400 font-mono">{score}</p>
        </div>
      </div>

      {!isPlaying ? (
        <div className="text-center space-y-4">
          <h3 className="font-extrabold text-sm text-zinc-200">
            {timeLeft === 0 ? (language === 'en' ? '⏱ SPRINT FINISHED!' : '⏱ زمان به پایان رسید!') : (language === 'en' ? '⌨ Typing Sprint' : '⌨ تایپ فوق‌سریع')}
          </h3>
          {timeLeft === 0 && (
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl max-w-xs mx-auto">
              <p className="text-[11px] text-zinc-400">
                {language === 'en' ? 'You achieved:' : 'نتایج شما:'} <span className="text-emerald-400 font-bold font-mono">{wpm} WPM</span>
              </p>
            </div>
          )}
          <button
            onClick={initGame}
            className="w-full max-w-xs py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Play className="h-4 w-4" />
            <span>{timeLeft === 0 ? (language === 'en' ? 'RETRY SPRINT' : 'شروع مجدد') : (language === 'en' ? 'START SPRINT' : 'شروع چالش')}</span>
          </button>
        </div>
      ) : (
        <div className="w-full space-y-4 max-w-md">
          {/* Cyberpunk Terminal Window Frame */}
          <div className="bg-zinc-950 rounded-2xl border-2 border-zinc-900 shadow-2xl overflow-hidden">
            <div className="bg-zinc-900/60 px-4 py-2.5 border-b border-zinc-850 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-[9px] text-zinc-500 tracking-wider">SPEED_TEST.SH</span>
            </div>
            <div className="p-6 text-center min-h-[100px] flex items-center justify-center">
              <p className="font-mono text-sm md:text-base font-semibold text-indigo-300 select-none leading-relaxed tracking-wide">
                {currentWord}
              </p>
            </div>
          </div>

          <input
            type="text"
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
            placeholder={language === 'en' ? 'Type the exact segment here...' : 'متن بالا را با دقت و سرعت اینجا بنویسید...'}
            className="w-full bg-zinc-950 border-2 border-zinc-900 rounded-2xl px-5 py-4 text-xs text-zinc-100 outline-none focus:border-indigo-500 font-mono text-center shadow-2xl transition-all"
          />
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN GAMES PORT CONTAINER SWITCH
// ==========================================
export default function GameTools({ language }: GameProps) {
  const [activeGameId, setActiveGameId] = useState<'mem' | 'snake' | '2048' | 'ttt' | 'type'>('mem');

  const games = [
    { id: 'mem', name_en: 'Memory Matrix', name_fa: 'کاشی‌های حافظه', icon: Smile },
    { id: 'snake', name_en: 'Neon Snake', name_fa: 'مار نئونی', icon: Zap },
    { id: '2048', name_en: '2048 Fusion', name_fa: 'ادغام کاشی ۲۰۴۸', icon: Flame },
    { id: 'ttt', name_en: 'Quantum Tic-Tac-Toe', name_fa: 'دوز نئونی کامپیوتری', icon: Trophy },
    { id: 'type', name_en: 'Sprint Speed Typer', name_fa: 'سرعت تایپ برنامه‌نویسی', icon: Award }
  ];

  return (
    <div className="space-y-6">
      {/* Game navigation switch tabs */}
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none border-b border-zinc-900">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => { setActiveGameId(g.id as any); playSound('click'); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap border cursor-pointer transition-all ${
              activeGameId === g.id
                ? 'bg-indigo-600 border-transparent text-white shadow-lg shadow-indigo-950/40'
                : 'bg-zinc-950/60 border-zinc-850 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>{language === 'en' ? g.name_en : g.name_fa}</span>
          </button>
        ))}
      </div>

      {/* Render active game */}
      <div className="py-2">
        {activeGameId === 'mem' && <MemoryMatrixGame language={language} />}
        {activeGameId === 'snake' && <NeonSnakeGame language={language} />}
        {activeGameId === '2048' && <Game2048 language={language} />}
        {activeGameId === 'ttt' && <TicTacToeGame language={language} />}
        {activeGameId === 'type' && <SpeedTyperGame language={language} />}
      </div>
    </div>
  );
}
