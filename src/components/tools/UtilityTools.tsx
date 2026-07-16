/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Plus, Trash2, Edit3, Save, RefreshCw, Play, Pause, Square, AlertCircle, Sparkles } from 'lucide-react';
import { QuickNote, TaskItem } from '../../types';

interface ToolProps {
  prefilledInput?: string;
  language: 'en' | 'fa';
}

const useCopy = () => {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
};

// --- Helper Web Audio Synth for Timer Alarm ---
function playBeepTone() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // Pitch of beep (A5)
    gain.gain.setValueAtTime(0.5, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15); // Short sweet alarm beep
  } catch (e) {
    console.warn('Audio Context not allowed or supported yet', e);
  }
}

// ==========================================
// 1. SCIENTIFIC CALCULATOR
// ==========================================
export function CalculatorTool({ prefilledInput = '', language }: ToolProps) {
  const [display, setDisplay] = useState(prefilledInput || '0');
  const [history, setHistory] = useState<string[]>([]);

  const handleBtn = (val: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(val);
    } else {
      setDisplay((prev) => prev + val);
    }
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
  };

  const handleEvaluate = () => {
    try {
      // Safe client-side math evaluator using direct arithmetic tokens
      const cleanExpr = display.replace(/×/g, '*').replace(/÷/g, '/');
      const result = Function(`"use strict"; return (${cleanExpr})`)();
      if (isNaN(result) || !isFinite(result)) throw new Error('Math error');

      setHistory((prev) => [display + ' = ' + result, ...prev.slice(0, 4)]);
      setDisplay(String(result));
    } catch {
      setDisplay('Error');
    }
  };

  const handleFn = (fn: string) => {
    try {
      const num = parseFloat(display);
      if (isNaN(num)) throw new Error();
      let res = 0;
      switch (fn) {
        case 'sin': res = Math.sin(num); break;
        case 'cos': res = Math.cos(num); break;
        case 'tan': res = Math.tan(num); break;
        case 'sqrt': res = Math.sqrt(num); break;
        case 'log': res = Math.log10(num); break;
        case 'ln': res = Math.log(num); break;
        case 'sq': res = Math.pow(num, 2); break;
      }
      setDisplay(String(parseFloat(res.toFixed(8))));
    } catch {
      setDisplay('Error');
    }
  };

  useEffect(() => {
    if (prefilledInput) {
      setDisplay(prefilledInput);
    }
  }, [prefilledInput]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950 p-6 rounded-2xl border border-zinc-850 max-w-2xl mx-auto">
      <div className="md:col-span-2 space-y-4">
        {/* Screen */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-right">
          <div className="text-zinc-500 font-mono text-xs h-5 overflow-hidden">{history[0] || ''}</div>
          <div className="text-zinc-100 font-mono text-2xl font-bold tracking-wider truncate mt-1">{display}</div>
        </div>

        {/* Grid pad */}
        <div className="grid grid-cols-4 gap-2 font-mono text-sm">
          <button onClick={() => handleFn('sin')} className="bg-zinc-900 text-indigo-400 p-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-850">sin</button>
          <button onClick={() => handleFn('cos')} className="bg-zinc-900 text-indigo-400 p-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-850">cos</button>
          <button onClick={() => handleFn('tan')} className="bg-zinc-900 text-indigo-400 p-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-850">tan</button>
          <button onClick={handleBackspace} className="bg-zinc-900 text-rose-400 p-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-850">⌫</button>

          <button onClick={() => handleFn('sqrt')} className="bg-zinc-900 text-indigo-400 p-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-850">√</button>
          <button onClick={() => handleFn('sq')} className="bg-zinc-900 text-indigo-400 p-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-850">x²</button>
          <button onClick={() => handleFn('log')} className="bg-zinc-900 text-indigo-400 p-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-850">log</button>
          <button onClick={handleClear} className="bg-zinc-900 text-amber-500 p-2.5 rounded-lg border border-zinc-800 hover:bg-zinc-850 font-bold">C</button>

          {(['7', '8', '9', '/'] as const).map((char) => (
            <button key={char} onClick={() => char === '/' ? handleBtn('/') : handleBtn(char)} className={`p-3 rounded-lg border border-zinc-800 ${char === '/' ? 'bg-zinc-900 text-indigo-400' : 'bg-zinc-900/40 text-zinc-200'} hover:bg-zinc-850`}>
              {char === '/' ? '÷' : char}
            </button>
          ))}
          {(['4', '5', '6', '*'] as const).map((char) => (
            <button key={char} onClick={() => char === '*' ? handleBtn('*') : handleBtn(char)} className={`p-3 rounded-lg border border-zinc-800 ${char === '*' ? 'bg-zinc-900 text-indigo-400' : 'bg-zinc-900/40 text-zinc-200'} hover:bg-zinc-850`}>
              {char === '*' ? '×' : char}
            </button>
          ))}
          {(['1', '2', '3', '-'] as const).map((char) => (
            <button key={char} onClick={() => handleBtn(char)} className={`p-3 rounded-lg border border-zinc-800 ${char === '-' ? 'bg-zinc-900 text-indigo-400' : 'bg-zinc-900/40 text-zinc-200'} hover:bg-zinc-850`}>
              {char}
            </button>
          ))}
          {(['0', '.', '=', '+'] as const).map((char) => (
            <button
              key={char}
              onClick={() => {
                if (char === '=') handleEvaluate();
                else handleBtn(char);
              }}
              className={`p-3 rounded-lg border border-zinc-850 ${
                char === '='
                  ? 'bg-indigo-600 text-white font-bold border-indigo-500'
                  : char === '+'
                  ? 'bg-zinc-900 text-indigo-400'
                  : 'bg-zinc-900/40 text-zinc-200'
              } hover:opacity-90`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>

      {/* History panel */}
      <div className="border-l border-zinc-850 pl-4 space-y-3 hidden md:block">
        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider">Calculation Log</label>
        <div className="space-y-1 font-mono text-xs text-zinc-400 max-h-56 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-zinc-600 italic py-8 text-center">Empty log</p>
          ) : (
            history.map((h, idx) => <div key={idx} className="p-1 border-b border-zinc-900 truncate">{h}</div>)
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. STICKY NOTES & SCRATCHPAD
// ==========================================
export function NotesTool({ language }: ToolProps) {
  const [notes, setNotes] = useState<QuickNote[]>(() => {
    try {
      const saved = localStorage.getItem('viz_notes_store');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    localStorage.setItem('viz_notes_store', JSON.stringify(notes));
  }, [notes]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    if (currentId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === currentId
            ? { ...n, title: title || 'Untitled Note', content, updatedAt: new Date().toLocaleTimeString() }
            : n
        )
      );
    } else {
      const newNote: QuickNote = {
        id: Math.random().toString(36).substr(2, 9),
        title: title || 'Untitled Note',
        content,
        updatedAt: new Date().toLocaleTimeString(),
      };
      setNotes((prev) => [newNote, ...prev]);
      setCurrentId(newNote.id);
    }
  };

  const handleCreateNew = () => {
    setCurrentId(null);
    setTitle('');
    setContent('');
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (currentId === id) {
      handleCreateNew();
    }
  };

  const selectNote = (note: QuickNote) => {
    setCurrentId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar list */}
      <div className="space-y-3 border-r border-zinc-900 pr-4 md:col-span-1">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{language === 'en' ? 'My drafts' : 'چرکنویس‌ها'}</span>
          <button
            onClick={handleCreateNew}
            className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400 hover:text-indigo-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-[340px] overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-zinc-600 text-center py-12 text-xs">No notes saved yet.</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => selectNote(note)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  currentId === note.id
                    ? 'bg-zinc-900 border-indigo-600 text-white'
                    : 'bg-zinc-950/40 border-zinc-850 hover:bg-zinc-900/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-sm truncate mr-2 flex-1">{note.title}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    className="text-zinc-500 hover:text-rose-400 transition-colors p-0.5 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-zinc-500 truncate mt-1">{note.content || 'Empty note content...'}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Draft editor */}
      <div className="md:col-span-2 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={language === 'en' ? 'Note Title...' : 'عنوان یادداشت...'}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 font-semibold text-sm text-zinc-100 outline-none focus:border-indigo-500"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={language === 'en' ? 'Write something creative...' : 'اینجا بنویسید...'}
          className="w-full h-64 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 outline-none focus:border-indigo-500 resize-none font-sans"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-lg"
          >
            <Save className="h-4 w-4" />
            {language === 'en' ? 'Save Draft' : 'ذخیره چرکنویس'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. TASK CHECKLIST MANAGER
// ==========================================
export function TasksTool({ language }: ToolProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('viz_tasks_store');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('viz_tasks_store', JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = () => {
    if (!input.trim()) return;
    const newTask: TaskItem = {
      id: Math.random().toString(36).substr(2, 9),
      text: input,
      completed: false,
      createdAt: new Date().toLocaleTimeString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setInput('');
  };

  const handleToggle = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Progress Bar */}
      {tasks.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl">
          <div className="flex justify-between text-xs text-zinc-400 uppercase font-semibold mb-2">
            <span>{language === 'en' ? 'List Progress' : 'پیشرفت کارها'}</span>
            <span className="font-mono text-indigo-400">{completedCount} / {tasks.length} Completed</span>
          </div>
          <div className="w-full bg-zinc-850 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={language === 'en' ? 'Add a new mission task...' : 'کار جدیدی به اهداف امروز اضافه کنید...'}
          className="flex-1 bg-zinc-950 text-zinc-100 px-4 py-2.5 rounded-xl border border-zinc-800 outline-none focus:border-indigo-500 text-sm"
        />
        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs px-5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {language === 'en' ? 'Add' : 'افزودن'}
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-zinc-600 italic text-center py-16 text-sm">No tasks declared yet. Add your first goal above!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                task.completed
                  ? 'bg-zinc-950/20 border-zinc-900 text-zinc-500'
                  : 'bg-zinc-950 border-zinc-850 text-zinc-200 hover:border-zinc-750'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => handleToggle(task.id)}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  readOnly
                  className="rounded text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 bg-zinc-900 border-zinc-700"
                />
                <span className={`text-sm ${task.completed ? 'line-through opacity-60' : ''}`}>{task.text}</span>
              </div>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-zinc-900/40 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. PRECISION COUNTDOWN TIMER
// ==========================================
export function TimerTool({ language }: ToolProps) {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 min default
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('5');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playBeepTone();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
  };

  const handleSetPreset = (min: number) => {
    setIsRunning(false);
    setTotalSeconds(min * 60);
    setSecondsLeft(min * 60);
  };

  const handleApplyCustom = () => {
    const min = Math.max(1, parseInt(customMinutes) || 1);
    handleSetPreset(min);
  };

  const formatTime = () => {
    const hrs = Math.floor(secondsLeft / 3600);
    const mins = Math.floor((secondsLeft % 3600) / 60);
    const secs = secondsLeft % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, '0') : null,
      String(mins).padStart(2, '0'),
      String(secs).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const progressPercent = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;

  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div className="relative inline-flex items-center justify-center p-6 bg-zinc-950 rounded-full border border-zinc-800 shadow-xl h-44 w-44 mx-auto">
        {/* Dynamic circular SVG ring */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle cx="88" cy="88" r="80" className="stroke-zinc-900" strokeWidth="6" fill="transparent" />
          <circle
            cx="88"
            cy="88"
            r="80"
            className="stroke-indigo-500 transition-all duration-1000"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray="502"
            strokeDashoffset={502 - (502 * progressPercent) / 100}
          />
        </svg>
        <span className="text-3xl font-bold font-mono text-zinc-100 relative z-10">{formatTime()}</span>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={handleStartStop}
          className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-xs shadow-md transition-colors ${
            isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white flex items-center gap-2 text-xs transition-colors"
        >
          <Square className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="border-t border-zinc-900 pt-4 flex flex-wrap justify-center gap-2">
        <button onClick={() => handleSetPreset(1)} className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-xs px-3 py-1.5 rounded-lg text-zinc-400">1m</button>
        <button onClick={() => handleSetPreset(5)} className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-xs px-3 py-1.5 rounded-lg text-zinc-400">5m</button>
        <button onClick={() => handleSetPreset(15)} className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-xs px-3 py-1.5 rounded-lg text-zinc-400">15m</button>
        <button onClick={() => handleSetPreset(25)} className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-xs px-3 py-1.5 rounded-lg text-indigo-400 font-semibold border-indigo-900/40">Pomodoro (25m)</button>
      </div>

      <div className="flex gap-2 max-w-xs mx-auto pt-2">
        <input
          type="number"
          min="1"
          max="120"
          value={customMinutes}
          onChange={(e) => setCustomMinutes(e.target.value)}
          placeholder="Min..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg text-center font-mono text-xs text-zinc-100 outline-none py-2"
        />
        <button onClick={handleApplyCustom} className="bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs px-4 rounded-lg border border-zinc-800">Apply</button>
      </div>
    </div>
  );
}

// ==========================================
// 5. LAP SPLIT STOPWATCH
// ==========================================
export function StopwatchTool({ language }: ToolProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps((prev) => [time, ...prev]);
  };

  const formatStopwatch = (timeMs: number) => {
    const mins = Math.floor(timeMs / 60000);
    const secs = Math.floor((timeMs % 60000) / 1000);
    const ms = Math.floor((timeMs % 1000) / 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center font-mono text-4xl md:text-5xl font-bold tracking-widest text-zinc-100 bg-zinc-950 p-6 rounded-2xl border border-zinc-850 shadow-inner">
        {formatStopwatch(time)}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={handleStartStop}
          className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-xs shadow-md transition-colors ${
            isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        {isRunning && (
          <button
            onClick={handleLap}
            className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white flex items-center gap-2 text-xs transition-colors"
          >
            Lap Split
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white flex items-center gap-2 text-xs transition-colors"
        >
          Reset
        </button>
      </div>

      {laps.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 max-h-[180px] overflow-y-auto space-y-1.5 font-mono text-xs">
          {laps.map((lap, idx) => (
            <div key={idx} className="flex justify-between items-center py-1 border-b border-zinc-900/50">
              <span className="text-zinc-500">Lap #{laps.length - idx}</span>
              <span className="text-zinc-200 font-bold">{formatStopwatch(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. WORD & CHARACTER COUNTER
// ==========================================
export function TextCounterTool({ language }: ToolProps) {
  const [text, setText] = useState('');

  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const sentenceCount = text.trim() === '' ? 0 : text.split(/[\.\!\?]+/).filter(Boolean).length;
  const lineCount = text.split('\n').length;
  const readingTimeMins = Math.ceil(wordCount / 200); // 200 WPM default average

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste paragraphs here to analyze stats..."
        className="w-full h-44 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 text-sm focus:outline-none"
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 text-center">
          <span className="block text-[11px] font-semibold text-zinc-500 uppercase">Characters</span>
          <span className="text-xl font-bold font-mono text-zinc-100 mt-1 block">{charCount}</span>
        </div>
        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 text-center">
          <span className="block text-[11px] font-semibold text-zinc-500 uppercase">Words</span>
          <span className="text-xl font-bold font-mono text-zinc-100 mt-1 block">{wordCount}</span>
        </div>
        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 text-center">
          <span className="block text-[11px] font-semibold text-zinc-500 uppercase">Sentences</span>
          <span className="text-xl font-bold font-mono text-zinc-100 mt-1 block">{sentenceCount}</span>
        </div>
        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 text-center">
          <span className="block text-[11px] font-semibold text-zinc-500 uppercase">Lines</span>
          <span className="text-xl font-bold font-mono text-zinc-100 mt-1 block">{lineCount}</span>
        </div>
        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 text-center col-span-2 md:col-span-1">
          <span className="block text-[11px] font-semibold text-zinc-500 uppercase">Reading Time</span>
          <span className="text-sm font-bold font-mono text-indigo-400 mt-2 block">~ {readingTimeMins} min</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. RANDOM GENERATOR & PICKER
// ==========================================
export function RandomGeneratorTool({ language }: ToolProps) {
  const [minNum, setMinNum] = useState(1);
  const [maxNum, setMaxNum] = useState(100);
  const [numberResult, setNumberResult] = useState<number | null>(null);

  const [choicesStr, setChoicesStr] = useState('Roozbeh\nTesla\nCurie\nLovelace');
  const [pickResult, setPickResult] = useState('');

  const [coinResult, setCoinResult] = useState<'Heads' | 'Tails' | null>(null);

  const rollNumber = () => {
    if (minNum >= maxNum) return;
    setNumberResult(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
  };

  const pickChoice = () => {
    const list = choicesStr.split('\n').map(c => c.trim()).filter(Boolean);
    if (list.length === 0) return;
    setPickResult(list[Math.floor(Math.random() * list.length)]);
  };

  const flipCoin = () => {
    setCoinResult(null);
    setTimeout(() => {
      setCoinResult(Math.random() < 0.5 ? 'Heads' : 'Tails');
    }, 250);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Numbers */}
      <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
        <div className="space-y-3">
          <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Number Generator</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold block mb-1">MIN</span>
              <input type="number" value={minNum} onChange={(e) => setMinNum(parseInt(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-750 text-center font-mono text-sm py-1 rounded" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold block mb-1">MAX</span>
              <input type="number" value={maxNum} onChange={(e) => setMaxNum(parseInt(e.target.value) || 0)} className="w-full bg-zinc-900 border border-zinc-750 text-center font-mono text-sm py-1 rounded" />
            </div>
          </div>
          <div className="h-20 flex items-center justify-center font-mono text-2xl font-bold text-zinc-100">
            {numberResult !== null ? numberResult : <span className="text-zinc-600">...</span>}
          </div>
        </div>
        <button onClick={rollNumber} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-xs transition-colors">Generate Int</button>
      </div>

      {/* Choice picker */}
      <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
        <div className="space-y-3">
          <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">List Picker</span>
          <textarea
            value={choicesStr}
            onChange={(e) => setChoicesStr(e.target.value)}
            placeholder="Choices on each line..."
            className="w-full h-20 bg-zinc-900 border border-zinc-750 p-2 rounded text-xs font-mono outline-none"
          />
          <div className="h-10 flex items-center justify-center font-semibold text-sm text-indigo-400 truncate">
            {pickResult || <span className="text-zinc-600 italic">No Choice Picked</span>}
          </div>
        </div>
        <button onClick={pickChoice} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-xs transition-colors">Pick Random Item</button>
      </div>

      {/* Coin Flip */}
      <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
        <div className="space-y-3">
          <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Coin Flipper</span>
          <div className="h-32 flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full border border-indigo-900 flex items-center justify-center font-bold text-xs bg-indigo-600/10 text-indigo-400 transition-all ${coinResult ? 'scale-100' : 'scale-75 animate-pulse'}`}>
              {coinResult || 'Flip'}
            </div>
          </div>
        </div>
        <button onClick={flipCoin} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-xs transition-colors">Toss Coin</button>
      </div>
    </div>
  );
}

// ==========================================
// 8. CLIPBOARD HISTORIC SNIPPETS
// ==========================================
export function ClipboardTool({ language }: ToolProps) {
  const [snippets, setSnippets] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('viz_clipboard_manager_store');
      return saved ? JSON.parse(saved) : ['roozbeh.gh.a91@gmail.com', 'https://github.com/roozbeh-gh'];
    } catch { return []; }
  });
  const [input, setInput] = useState('');
  const { copied, copy } = useCopy();

  useEffect(() => {
    localStorage.setItem('viz_clipboard_manager_store', JSON.stringify(snippets));
  }, [snippets]);

  const handleAdd = () => {
    if (!input.trim()) return;
    setSnippets((prev) => [input.trim(), ...prev]);
    setInput('');
  };

  const handleDelete = (index: number) => {
    setSnippets((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or type snippets you copy often..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 text-sm text-zinc-100"
        />
        <button onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 rounded-xl">Add</button>
      </div>

      <div className="space-y-2 max-h-[260px] overflow-y-auto">
        {snippets.length === 0 ? (
          <p className="text-zinc-650 text-center py-12 text-xs">No clipboard snippets saved yet.</p>
        ) : (
          snippets.map((snip, idx) => (
            <div key={idx} className="bg-zinc-950 border border-zinc-850 px-4 py-2.5 rounded-xl flex justify-between items-center group">
              <span className="font-mono text-xs text-zinc-300 truncate mr-4 flex-1 select-all">{snip}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copy(snip)}
                  className="bg-zinc-900 text-zinc-400 hover:text-zinc-100 p-1 rounded-md border border-zinc-800"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="bg-zinc-900 text-zinc-500 hover:text-rose-400 p-1 rounded-md border border-zinc-800"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
