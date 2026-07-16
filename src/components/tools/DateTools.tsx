/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, Check, Calendar, Clock, Globe, Hourglass, HelpCircle } from 'lucide-react';

interface ToolProps {
  language: 'en' | 'fa';
}

// ==========================================
// 1. WORLD CLOCK
// ==========================================
export function WorldClockTool({ language }: ToolProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCityTime = (timezone: string) => {
    return time.toLocaleTimeString('en-US', { timeZone: timezone, hour12: false });
  };

  const formatCityDate = (timezone: string) => {
    return time.toLocaleDateString('en-US', { timeZone: timezone, month: 'short', day: 'numeric', weekday: 'short' });
  };

  const cities = [
    { name: 'London', zone: 'Europe/London', desc: 'UTC+00:00' },
    { name: 'New York', zone: 'America/New_York', desc: 'UTC-05:00' },
    { name: 'Tokyo', zone: 'Asia/Tokyo', desc: 'UTC+09:00' },
    { name: 'Tehran', zone: 'Asia/Tehran', desc: 'UTC+03:30' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cities.map((c) => (
        <div key={c.name} className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 text-center space-y-2">
          <Globe className="h-5 w-5 text-indigo-400 mx-auto" />
          <h4 className="font-semibold text-sm text-zinc-200">{c.name}</h4>
          <div className="font-mono text-xl font-bold text-zinc-100 tracking-wider">
            {formatCityTime(c.zone)}
          </div>
          <div className="text-[10px] text-zinc-500 font-medium font-mono uppercase">
            {formatCityDate(c.zone)} • {c.desc}
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 2. TIMEZONE CONVERTER
// ==========================================
export function TimezoneConverterTool({ language }: ToolProps) {
  const [sliderHour, setSliderHour] = useState(12);

  const formatHourString = (baseHour: number, offset: number) => {
    const target = (baseHour + offset + 24) % 24;
    return `${String(target).padStart(2, '0')}:00`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Local base hour (London UTC)</span>
          <span className="font-mono text-indigo-400 font-bold text-sm">{sliderHour}:00</span>
        </div>
        <input type="range" min="0" max="23" value={sliderHour} onChange={(e) => setSliderHour(parseInt(e.target.value))} className="w-full accent-indigo-500" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'London (UTC)', offset: 0 },
          { name: 'New York (EST)', offset: -5 },
          { name: 'Tehran (IRST)', offset: 3.5 },
          { name: 'Tokyo (JST)', offset: 9 },
        ].map((loc) => (
          <div key={loc.name} className="bg-zinc-950 p-4 rounded-xl border border-zinc-855 text-center">
            <span className="text-[10px] text-zinc-500 font-semibold uppercase">{loc.name}</span>
            <div className="font-mono text-lg font-bold text-indigo-400 mt-1.5">
              {formatHourString(sliderHour, loc.offset)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 3. AGE CALCULATOR
// ==========================================
export function AgeCalculatorTool({ language }: ToolProps) {
  const [birthday, setBirthday] = useState('1995-10-15');
  const [ageStats, setAgeStats] = useState<any>(null);

  useEffect(() => {
    if (!birthday) return;
    const birthDate = new Date(birthday);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months = (months + 12) % 12;
    }

    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));

    setAgeStats({ years, months, totalDays, totalWeeks, totalHours });
  }, [birthday]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col justify-center">
        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Select Birthday</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="bg-zinc-900 border border-zinc-750 p-2.5 rounded-lg font-mono text-sm text-zinc-100 outline-none w-full"
        />
      </div>

      <div className="md:col-span-2 grid grid-cols-2 gap-3">
        {[
          { label: 'Years', val: ageStats?.years },
          { label: 'Months', val: ageStats?.months },
          { label: 'Total Weeks', val: ageStats?.totalWeeks },
          { label: 'Total Days', val: ageStats?.totalDays },
        ].map((item, idx) => (
          <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 text-center">
            <span className="text-[11px] text-zinc-500 font-bold uppercase">{item.label}</span>
            <div className="text-xl font-mono font-bold text-indigo-400 mt-1">{item.val !== undefined ? item.val : '...'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. DATE DIFFERENCE CALCULATOR
// ==========================================
export function DateDiffTool({ language }: ToolProps) {
  const [dateA, setDateA] = useState('2026-01-01');
  const [dateB, setDateB] = useState('2026-12-31');
  const [days, setDays] = useState('0');

  useEffect(() => {
    if (!dateA || !dateB) return;
    const a = new Date(dateA);
    const b = new Date(dateB);
    const diffTime = Math.abs(b.getTime() - a.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDays(String(diffDays));
  }, [dateA, dateB]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Start Date</label>
          <input type="date" value={dateA} onChange={(e) => setDateA(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg font-mono text-sm text-zinc-100" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">End Date</label>
          <input type="date" value={dateB} onChange={(e) => setDateB(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg font-mono text-sm text-zinc-100" />
        </div>
      </div>

      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col justify-center text-center md:col-span-2">
        <span className="text-xs text-zinc-500 uppercase font-semibold">Total Span Between Dates</span>
        <div className="text-4xl font-bold font-mono text-indigo-400 my-3">{days} Days</div>
        <p className="text-xs text-zinc-500 font-mono">Equivalent to {Math.floor(parseInt(days) / 7)} weeks & {Math.floor(parseInt(days) / 30)} months</p>
      </div>
    </div>
  );
}

// ==========================================
// 5. TARGET COUNTDOWN TIMER
// ==========================================
export function CountdownTool({ language }: ToolProps) {
  const [title, setTitle] = useState('New Year Eve');
  const [targetDate, setTargetDate] = useState('2026-12-31T23:59:59');
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      }
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-[11px] font-semibold text-zinc-500 uppercase mb-1">Event Name</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-xs text-zinc-100" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-zinc-500 uppercase mb-1">Target Date & Time</label>
          <input type="datetime-local" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded-lg font-mono text-xs text-zinc-100" />
        </div>
      </div>

      <div className="bg-indigo-600/10 border border-indigo-900/40 p-6 rounded-2xl text-center space-y-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-indigo-400 flex items-center justify-center gap-1">
          <Hourglass className="h-4 w-4 animate-spin-slow" />
          {title}
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Days', val: timeLeft.d },
            { label: 'Hours', val: timeLeft.h },
            { label: 'Mins', val: timeLeft.m },
            { label: 'Secs', val: timeLeft.s },
          ].map((block, idx) => (
            <div key={idx} className="bg-zinc-950 p-3 rounded-xl border border-zinc-850/60">
              <div className="text-xl md:text-2xl font-bold font-mono text-zinc-100">{String(block.val).padStart(2, '0')}</div>
              <span className="text-[9px] text-zinc-500 font-bold uppercase">{block.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. INTERACTIVE CALENDAR GRID
// ==========================================
export function CalendarGridTool({ language }: ToolProps) {
  const [currDate, setCurrDate] = useState(new Date());

  const year = currDate.getFullYear();
  const month = currDate.getMonth();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayIndex = (y: number, m: number) => {
    return new Date(y, m, 1).getDay();
  };

  const totalDays = getDaysInMonth(year, month);
  const startIdx = getFirstDayIndex(year, month);

  const daysArray = Array(startIdx).fill(null).concat(Array.from({ length: totalDays }, (_, i) => i + 1));

  const adjustMonth = (offset: number) => {
    setCurrDate(new Date(year, month + offset, 1));
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-950 p-5 rounded-2xl border border-zinc-850 space-y-4">
      <div className="flex justify-between items-center px-2">
        <button onClick={() => adjustMonth(-1)} className="text-zinc-400 hover:text-white font-mono text-sm font-bold bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">◄</button>
        <span className="font-semibold text-sm text-zinc-200">{monthNames[month]} {year}</span>
        <button onClick={() => adjustMonth(1)} className="text-zinc-400 hover:text-white font-mono text-sm font-bold bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">►</button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d} className="text-zinc-500 uppercase">{d}</span>
        ))}
        {daysArray.map((day, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg font-mono text-xs ${
              day === null
                ? 'opacity-0'
                : day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-zinc-900/40 border border-zinc-900/50 text-zinc-300 hover:bg-zinc-850'
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. LEAP YEAR CHECKER
// ==========================================
export function LeapYearTool({ language }: ToolProps) {
  const [yearVal, setYearVal] = useState('2028');
  const [isLeap, setIsLeap] = useState<boolean | null>(null);

  useEffect(() => {
    const y = parseInt(yearVal);
    if (!isNaN(y)) {
      setIsLeap((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0);
    } else {
      setIsLeap(null);
    }
  }, [yearVal]);

  return (
    <div className="max-w-sm mx-auto bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4 text-center">
      <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Leap Year Checker</span>
      <input
        type="number"
        value={yearVal}
        onChange={(e) => setYearVal(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-750 p-2.5 rounded-lg text-center font-mono text-sm text-zinc-100"
      />
      {isLeap !== null && (
        <div className={`p-4 rounded-xl font-bold font-mono text-sm ${isLeap ? 'bg-emerald-950/40 text-emerald-400' : 'bg-rose-950/40 text-rose-400'}`}>
          {yearVal} IS {isLeap ? 'A LEAP YEAR' : 'NOT A LEAP YEAR'}
        </div>
      )}
    </div>
  );
}
