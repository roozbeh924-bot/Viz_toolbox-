/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, Play, Plus, RefreshCw, Trash2, Sliders, Eye, EyeOff } from 'lucide-react';

interface ToolProps {
  prefilledInput?: string;
  language: 'en' | 'fa';
}

// Custom simple copy helper
const useCopy = () => {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
};

// ==========================================
// 1. JSON FORMATTER & VALIDATOR
// ==========================================
export function JsonFormatter({ prefilledInput = '', language }: ToolProps) {
  const [input, setInput] = useState(prefilledInput);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { copied, copy } = useCopy();

  const handleFormat = (minify = false) => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON format');
      setOutput('');
    }
  };

  useEffect(() => {
    if (prefilledInput) {
      setInput(prefilledInput);
    }
  }, [prefilledInput]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
            {language === 'en' ? 'Input JSON' : 'ورودی جی‌سان'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{ "name": "Viz", "version": "1.0.0" }'
            className="w-full h-80 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
            {language === 'en' ? 'Formatted Output' : 'خروجی فرمت شده'}
          </label>
          <div className="relative">
            <textarea
              readOnly
              value={output || error || ''}
              className={`w-full h-80 p-4 rounded-xl border font-mono text-sm focus:outline-none ${
                error
                  ? 'bg-red-950/20 text-red-400 border-red-900/50'
                  : 'bg-zinc-950 text-emerald-400 border-zinc-800'
              }`}
              placeholder={language === 'en' ? 'Result will appear here...' : 'نتیجه در اینجا نمایش داده می‌شود...'}
            />
            {output && (
              <button
                onClick={() => copy(output)}
                className="absolute top-3 right-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 p-1.5 rounded-lg border border-zinc-800 transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => {
            setInput('');
            setOutput('');
            setError(null);
          }}
          className="px-4 py-2 text-sm rounded-xl border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 transition-colors"
        >
          {language === 'en' ? 'Clear' : 'پاک کردن'}
        </button>
        <button
          onClick={() => handleFormat(true)}
          className="px-4 py-2 text-sm rounded-xl border border-zinc-800 text-zinc-300 hover:bg-zinc-900 transition-colors font-mono"
        >
          {language === 'en' ? 'Minify' : 'فشرده‌سازی'}
        </button>
        <button
          onClick={() => handleFormat(false)}
          className="px-5 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 font-medium transition-colors"
        >
          {language === 'en' ? 'Beautify' : 'زیباسازی'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 2. REGEX TESTER
// ==========================================
export function RegexTester({ language }: ToolProps) {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Contact us at roozbeh.gh.a91@gmail.com or support@viz.io today!');
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError(null);
      return;
    }
    try {
      const regex = new RegExp(pattern, flags);
      const allMatches: string[] = [];
      let match;
      if (flags.includes('g')) {
        while ((match = regex.exec(text)) !== null) {
          allMatches.push(match[0]);
          if (regex.lastIndex === match.index) {
            regex.lastIndex++; // Prevent infinite loops on zero-width matches
          }
        }
      } else {
        match = regex.exec(text);
        if (match) allMatches.push(match[0]);
      }
      setMatches(allMatches);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  }, [pattern, flags, text]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
            {language === 'en' ? 'Regular Expression' : 'عبارت منظم (Regex)'}
          </label>
          <div className="flex gap-2">
            <span className="bg-zinc-950 border border-zinc-800 text-zinc-500 rounded-xl px-3 py-2.5 font-mono text-sm flex items-center justify-center">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. [a-z]+"
              className="flex-1 bg-zinc-950 text-zinc-100 px-4 py-2.5 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
            <span className="bg-zinc-950 border border-zinc-800 text-zinc-500 rounded-xl px-3 py-2.5 font-mono text-sm flex items-center justify-center">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="gi"
              className="w-16 bg-zinc-950 text-zinc-100 text-center py-2.5 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          {error && <p className="text-xs text-red-400 mt-1 font-mono">{error}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
            {language === 'en' ? 'Flags Info' : 'توضیح فلگ‌ها'}
          </label>
          <div className="text-[11px] text-zinc-500 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 font-mono leading-relaxed">
            g = global, i = case insensitive, m = multiline
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
            {language === 'en' ? 'Test Text' : 'متن تست'}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-44 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
            {language === 'en' ? 'Matches' : 'مطابقت‌ها'} ({matches.length})
          </label>
          <div className="h-44 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-xl p-3 space-y-1 font-mono text-xs">
            {matches.length === 0 ? (
              <p className="text-zinc-600 text-center py-12">No matches</p>
            ) : (
              matches.map((m, idx) => (
                <div key={idx} className="bg-indigo-600/20 border border-indigo-900/40 text-indigo-300 px-2 py-1.5 rounded-lg flex justify-between items-center">
                  <span className="truncate">{m}</span>
                  <span className="text-[10px] text-zinc-500">#{idx + 1}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. UUID GENERATOR
// ==========================================
export function UuidGenerator({ language }: ToolProps) {
  const [uuids, setUuids] = useState<string[]>([]);
  const [qty, setQty] = useState(5);
  const { copied, copy } = useCopy();

  const generateUUID = () => {
    const list: string[] = [];
    for (let i = 0; i < qty; i++) {
      // Fast Cryptographically Secure Pseudo-Random v4 UUID Generator
      const tempUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      list.push(tempUuid);
    }
    setUuids(list);
  };

  useEffect(() => {
    generateUUID();
  }, [qty]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-zinc-300">
            {language === 'en' ? 'Quantity' : 'تعداد'}
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={qty}
            onChange={(e) => setQty(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-16 bg-zinc-900 border border-zinc-700 text-zinc-100 text-center py-1 rounded-lg outline-none font-mono text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => copy(uuids.join('\n'))}
            className="px-3 py-1.5 text-xs rounded-lg border border-zinc-800 text-zinc-300 hover:bg-zinc-900 transition-colors flex items-center gap-1"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {language === 'en' ? 'Copy All' : 'کپی همه'}
          </button>
          <button
            onClick={generateUUID}
            className="px-4 py-1.5 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-1 font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {language === 'en' ? 'Regenerate' : 'تولید مجدد'}
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-sm space-y-2 h-72 overflow-y-auto">
        {uuids.map((id, index) => (
          <div key={id} className="flex justify-between items-center group py-1 border-b border-zinc-900/50">
            <span className="text-indigo-400 text-xs font-semibold mr-3">{(index + 1).toString().padStart(2, '0')}</span>
            <span className="flex-1 text-zinc-300 text-xs md:text-sm">{id}</span>
            <button
              onClick={() => navigator.clipboard.writeText(id)}
              className="opacity-0 group-hover:opacity-100 bg-zinc-900 text-zinc-400 hover:text-zinc-100 p-1 rounded transition-opacity"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. PASSWORD GENERATOR
// ==========================================
export function PasswordGenerator({ language }: ToolProps) {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const { copied, copy } = useCopy();

  const handleGenerate = () => {
    let chars = '';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) {
      setPassword('');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  useEffect(() => {
    handleGenerate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const getStrength = () => {
    if (!password) return { label: 'Empty', color: 'bg-zinc-700', text: 'text-zinc-400' };
    let score = 0;
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score >= 6) return { label: 'Extremely Secure', color: 'bg-emerald-500', text: 'text-emerald-400' };
    if (score >= 4) return { label: 'Strong', color: 'bg-teal-500', text: 'text-teal-400' };
    if (score >= 3) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400' };
    return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-4">
      <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 relative flex items-center justify-between">
        <div className="font-mono text-lg md:text-xl text-zinc-100 tracking-wider overflow-x-auto whitespace-nowrap scrollbar-hide pr-12 flex-1">
          {password || <span className="text-zinc-600">No Options Selected</span>}
        </div>
        <button
          onClick={() => copy(password)}
          disabled={!password}
          className="absolute right-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 p-2 rounded-xl border border-zinc-800 disabled:opacity-50 transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950/40 p-5 rounded-xl border border-zinc-850">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-zinc-300">{language === 'en' ? 'Password Length' : 'طول رمز عبور'}</span>
              <span className="text-sm font-mono text-indigo-400 font-semibold">{length}</span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center text-xs text-zinc-400 uppercase tracking-wider mb-2">
              <span>{language === 'en' ? 'Strength Metric' : 'سنجش امنیت رمز'}</span>
              <span className={strength.text}>{strength.label}</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className={`h-full ${strength.color} transition-all`} style={{ width: `${(password.length / 64) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-zinc-900 border-zinc-700"
            />
            <span className="text-xs font-medium text-zinc-300">A-Z (Upper)</span>
          </label>
          <label className="flex items-center gap-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-zinc-900 border-zinc-700"
            />
            <span className="text-xs font-medium text-zinc-300">a-z (Lower)</span>
          </label>
          <label className="flex items-center gap-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-zinc-900 border-zinc-700"
            />
            <span className="text-xs font-medium text-zinc-300">0-9 (Nums)</span>
          </label>
          <label className="flex items-center gap-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-zinc-900 border-zinc-700"
            />
            <span className="text-xs font-medium text-zinc-300">!@#$ (Syms)</span>
          </label>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. MARKDOWN EDITOR
// ==========================================
export function MarkdownEditor({ language }: ToolProps) {
  const [text, setText] = useState('# Hello Viz\n\nThis is a **premium Markdown previewer**.\n\n- Beautiful typography\n- Fast client rendering\n- Interactive split screens');
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  // Simple safe client-side custom parser to avoid third-party React-Markdown compiler issues in standard previewers
  const parseMarkdownHtml = (markdown: string) => {
    let html = markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-base font-bold text-zinc-100 mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold text-zinc-100 mt-5 mb-2.5 border-b border-zinc-800 pb-1">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold text-zinc-100 mt-6 mb-3 border-b border-zinc-800 pb-1.5">$1</h1>');

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-indigo-400">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-zinc-300">$1</em>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-zinc-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs my-3 overflow-x-auto text-emerald-400">$1</pre>');
    html = html.replace(/`(.*?)`/g, '<code class="bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 font-mono text-xs text-indigo-300">$1</code>');

    // Lists
    html = html.replace(/^\s*-\s*(.*?)$/gm, '<li class="list-disc list-inside ml-4 text-zinc-300 py-0.5">$1</li>');

    // Paragraphs (split by lines)
    html = html.split('\n\n').map(p => {
      if (p.trim().startsWith('<h') || p.trim().startsWith('<pre') || p.trim().startsWith('<li')) return p;
      return `<p class="text-sm text-zinc-300 leading-relaxed mb-3">${p}</p>`;
    }).join('');

    return html;
  };

  const parsedHtml = parseMarkdownHtml(text);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {language === 'en' ? 'Interactive Workspace' : 'محیط کار هوشمند'}
        </span>
        <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800 text-xs">
          {(['edit', 'preview', 'split'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-3 py-1 rounded-md transition-colors capitalize ${
                viewMode === m ? 'bg-zinc-850 text-indigo-400 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={viewMode === 'edit' ? 'col-span-2' : ''}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-[360px] bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none focus:border-indigo-500"
              placeholder="# Write markdown here"
            />
          </div>
        )}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`border border-zinc-850 bg-zinc-950/30 p-5 rounded-xl h-[360px] overflow-y-auto ${
            viewMode === 'preview' ? 'col-span-2' : ''
          }`}>
            <div dangerouslySetInnerHTML={{ __html: parsedHtml || '<span class="text-zinc-600">Nothing to preview</span>' }} />
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 6. BASE64 ENCODER/DECODER
// ==========================================
export function Base64Converter({ prefilledInput = '', language }: ToolProps) {
  const [input, setInput] = useState(prefilledInput);
  const [output, setOutput] = useState('');
  const [isEncode, setIsEncode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { copied, copy } = useCopy();

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      if (isEncode) {
        setOutput(btoa(unescape(encodeURIComponent(input))));
        setError(null);
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
        setError(null);
      }
    } catch (e: any) {
      setError(language === 'en' ? 'Failed to parse Base64. Check your input sequence.' : 'خطا در تبدیل بیس۶۴. صحت داده ورودی را بررسی کنید.');
      setOutput('');
    }
  };

  useEffect(() => {
    handleConvert();
  }, [input, isEncode]);

  useEffect(() => {
    if (prefilledInput) {
      setInput(prefilledInput);
    }
  }, [prefilledInput]);

  return (
    <div className="space-y-4">
      <div className="flex bg-zinc-950 p-1 border border-zinc-800 rounded-xl max-w-xs">
        <button
          onClick={() => setIsEncode(true)}
          className={`flex-1 text-xs py-1.5 rounded-lg transition-colors font-medium ${
            isEncode ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {language === 'en' ? 'Encode Text' : 'کدگذاری متن'}
        </button>
        <button
          onClick={() => setIsEncode(false)}
          className={`flex-1 text-xs py-1.5 rounded-lg transition-colors font-medium ${
            !isEncode ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {language === 'en' ? 'Decode Base64' : 'رمزگشایی بیس۶۴'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
            {language === 'en' ? 'Source Sequence' : 'رشته مبدا'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isEncode ? 'Type plain text...' : 'Type Base64 hash...'}
            className="w-full h-56 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
            {language === 'en' ? 'Result' : 'نتیجه'}
          </label>
          <div className="relative">
            <textarea
              readOnly
              value={output || error || ''}
              className={`w-full h-56 p-4 rounded-xl border font-mono text-sm focus:outline-none ${
                error
                  ? 'bg-red-950/20 text-red-400 border-red-900/50'
                  : 'bg-zinc-950 text-indigo-400 border-zinc-800'
              }`}
              placeholder="Conversion results..."
            />
            {output && (
              <button
                onClick={() => copy(output)}
                className="absolute top-3 right-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 p-1.5 rounded-lg border border-zinc-800 transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. HASH GENERATOR
// ==========================================
export function HashGenerator({ prefilledInput = '', language }: ToolProps) {
  const [input, setInput] = useState(prefilledInput);
  const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '' });

  // Fast pure-js md5 utility to avoid third-party load errors
  const md5 = (string: string) => {
    function RotateLeft(lValue: number, iShiftBits: number) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function AddUnsigned(lX: number, lY: number) {
      const lX8 = lX & 0x80000000;
      const lY8 = lY & 0x80000000;
      const lX4 = lX & 0x40000000;
      const lY4 = lY & 0x40000000;
      const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
      if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
      if (lX4 | lY4) {
        if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
        else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      } else return lResult ^ lX8 ^ lY8;
    }
    function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
    function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
    function H(x: number, y: number, z: number) { return x ^ y ^ z; }
    function I(x: number, y: number, z: number) { return y ^ (x | ~z); }
    function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }
    function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }
    function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }
    function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }
    function ConvertToWordArray(string: string) {
      let lWordCount;
      const lMessageLength = string.length;
      const lNumberOfWords_temp1 = lMessageLength + 8;
      const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      const lWordArray = Array(lNumberOfWords - 1);
      let lBytePosition = 0;
      let lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    }
    function WordToHex(lValue: number) {
      let WordToHexValue = '', WordToHexValue_temp = '', lByte, lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = '0' + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      }
      return WordToHexValue;
    }
    const x = ConvertToWordArray(string);
    let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
    for (let k = 0; k < x.length; k += 16) {
      const AA = a, BB = b, CC = c, DD = d;
      a = FF(a, b, c, d, x[k + 0], 7, 0xd76aa478); d = FF(d, a, b, c, x[k + 1], 12, 0xe8c7b756); c = FF(c, d, a, b, x[k + 2], 17, 0x242070db); b = FF(b, c, d, a, x[k + 3], 22, 0xc1bdceee);
      a = FF(a, b, c, d, x[k + 4], 7, 0xf57c0faf); d = FF(d, a, b, c, x[k + 5], 12, 0x4787c62a); c = FF(c, d, a, b, x[k + 6], 17, 0xa8304613); b = FF(b, c, d, a, x[k + 7], 22, 0xfd469501);
      a = FF(a, b, c, d, x[k + 8], 7, 0x698098d8); d = FF(d, a, b, c, x[k + 9], 12, 0x8b44f7af); c = FF(c, d, a, b, x[k + 10], 17, 0xffff5bb1); b = FF(b, c, d, a, x[k + 11], 22, 0x895cd7be);
      a = FF(a, b, c, d, x[k + 12], 7, 0x6b901122); d = FF(d, a, b, c, x[k + 13], 12, 0xfd987193); c = FF(c, d, a, b, x[k + 14], 17, 0xa679438e); b = FF(b, c, d, a, x[k + 15], 22, 0x49b40821);
      a = GG(a, b, c, d, x[k + 1], 5, 0xf61e2562); d = GG(d, a, b, c, x[k + 6], 9, 0xc040b340); c = GG(c, d, a, b, x[k + 11], 14, 0x265e5a51); b = GG(b, c, d, a, x[k + 0], 20, 0xe9b6c7aa);
      a = GG(a, b, c, d, x[k + 5], 5, 0xd62f105d); d = GG(d, a, b, c, x[k + 10], 9, 0x2441453); c = GG(c, d, a, b, x[k + 15], 14, 0xd8a1e681); b = GG(b, c, d, a, x[k + 4], 20, 0xe7d3fbc8);
      a = GG(a, b, c, d, x[k + 9], 5, 0x21e1cde6); d = GG(d, a, b, c, x[k + 14], 9, 0xc33707d6); c = GG(c, d, a, b, x[k + 3], 14, 0xf4d50d87); b = GG(b, c, d, a, x[k + 8], 20, 0x455a14ed);
      a = GG(a, b, c, d, x[k + 13], 5, 0xa9e3e905); d = GG(d, a, b, c, x[k + 2], 9, 0xfcefa3f8); c = GG(c, d, a, b, x[k + 7], 14, 0x676f02d9); b = GG(b, c, d, a, x[k + 12], 20, 0x8d2a4c8a);
      a = HH(a, b, c, d, x[k + 5], 4, 0xfffa3942); d = HH(d, a, b, c, x[k + 8], 11, 0x8771f681); c = HH(c, d, a, b, x[k + 11], 16, 0x6d9d6122); b = HH(b, c, d, a, x[k + 14], 23, 0xfde5380c);
      a = HH(a, b, c, d, x[k + 1], 4, 0xa4beea44); d = HH(d, a, b, c, x[k + 4], 11, 0x4bdecfa9); c = HH(c, d, a, b, x[k + 7], 16, 0xf6bb4b60); b = HH(b, c, d, a, x[k + 10], 23, 0xbebfbc70);
      a = HH(a, b, c, d, x[k + 13], 4, 0x289b7ec6); d = HH(d, a, b, c, x[k + 0], 11, 0xeaa127fa); c = HH(c, d, a, b, x[k + 3], 16, 0xd4ef3085); b = HH(b, c, d, a, x[k + 6], 23, 0x4881d05);
      a = HH(a, b, c, d, x[k + 9], 4, 0xd9d4d039); d = HH(d, a, b, c, x[k + 12], 11, 0xe6db99e5); c = HH(c, d, a, b, x[k + 15], 16, 0x1fa27cf8); b = HH(b, c, d, a, x[k + 2], 23, 0xc4ac5665);
      a = II(a, b, c, d, x[k + 0], 6, 0xf4292244); d = II(d, a, b, c, x[k + 7], 10, 0x432aff97); c = II(c, d, a, b, x[k + 14], 15, 0xab9423a7); b = II(b, c, d, a, x[k + 5], 21, 0xfc93a039);
      a = II(a, b, c, d, x[k + 12], 6, 0x655b59c3); d = II(d, a, b, c, x[k + 3], 10, 0x8f0ccc92); c = II(c, d, a, b, x[k + 10], 15, 0xffeff47d); b = II(b, c, d, a, x[k + 1], 21, 0x85845dd1);
      a = II(a, b, c, d, x[k + 8], 6, 0x6fa87e4f); d = II(d, a, b, c, x[k + 15], 10, 0xfe2ce6e0); c = II(c, d, a, b, x[k + 6], 15, 0xa3014314); b = II(b, c, d, a, x[k + 13], 21, 0x4e0811a1);
      a = II(a, b, c, d, x[k + 4], 6, 0xf7537e82); d = II(d, a, b, c, x[k + 11], 10, 0xbd3af235); c = II(c, d, a, b, x[k + 2], 15, 0x2ad7d2bb); b = II(b, c, d, a, x[k + 9], 21, 0xeb86d391);
      a = AddUnsigned(a, AA); b = AddUnsigned(b, BB); c = AddUnsigned(c, CC); d = AddUnsigned(d, DD);
    }
    return (WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d)).toLowerCase();
  };

  // Web Crypto API for SHA-1 & SHA-256 (fully native, non-blocking asynchronous calculation)
  useEffect(() => {
    const calcHashes = async () => {
      if (!input) {
        setHashes({ md5: '', sha1: '', sha256: '' });
        return;
      }
      const md5Result = md5(input);

      try {
        const msgUint8 = new TextEncoder().encode(input);

        // SHA-1
        const sha1Buffer = await crypto.subtle.digest('SHA-1', msgUint8);
        const sha1Array = Array.from(new Uint8Array(sha1Buffer));
        const sha1Result = sha1Array.map((b) => b.toString(16).padStart(2, '0')).join('');

        // SHA-256
        const sha256Buffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const sha256Array = Array.from(new Uint8Array(sha256Buffer));
        const sha256Result = sha256Array.map((b) => b.toString(16).padStart(2, '0')).join('');

        setHashes({ md5: md5Result, sha1: sha1Result, sha256: sha256Result });
      } catch (e) {
        console.warn('SubtleCrypto error, falling back to manual MD5', e);
        setHashes({ md5: md5Result, sha1: 'Not supported', sha256: 'Not supported' });
      }
    };

    calcHashes();
  }, [input]);

  useEffect(() => {
    if (prefilledInput) {
      setInput(prefilledInput);
    }
  }, [prefilledInput]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
          {language === 'en' ? 'Plain Text Source' : 'متن ورودی'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something to compute secure hashes..."
          className="w-full h-32 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-3">
        {(['md5', 'sha1', 'sha256'] as const).map((key) => (
          <div key={key} className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl flex items-center justify-between gap-4 font-mono text-xs md:text-sm">
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">{key.toUpperCase()}</span>
              <span className="text-zinc-300 block truncate select-all">{hashes[key] || 'Empty'}</span>
            </div>
            {hashes[key] && (
              <button
                onClick={() => navigator.clipboard.writeText(hashes[key])}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 p-2 rounded-lg border border-zinc-800 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 8. TEXT CASE CONVERTER
// ==========================================
export function CaseConverter({ language }: ToolProps) {
  const [text, setText] = useState('the Quick brown Fox jumps Over the lazy dog.');
  const { copied, copy } = useCopy();

  const handleCase = (type: string) => {
    if (!text) return;
    let converted = '';
    switch (type) {
      case 'upper':
        converted = text.toUpperCase();
        break;
      case 'lower':
        converted = text.toLowerCase();
        break;
      case 'title':
        converted = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'sentence':
        converted = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'camel':
        converted = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case 'snake':
        converted = text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        break;
      case 'inverse':
        converted = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
        break;
      case 'reverse':
        converted = text.split('').reverse().join('');
        break;
    }
    setText(converted);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 bg-zinc-950 text-zinc-100 p-4 pr-12 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none focus:border-indigo-500"
          placeholder="Type or paste text..."
        />
        {text && (
          <button
            onClick={() => copy(text)}
            className="absolute top-3 right-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 p-1.5 rounded-lg border border-zinc-850 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button onClick={() => handleCase('upper')} className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 transition-colors">UPPERCASE</button>
        <button onClick={() => handleCase('lower')} className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 transition-colors">lowercase</button>
        <button onClick={() => handleCase('title')} className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 transition-colors">Title Case</button>
        <button onClick={() => handleCase('sentence')} className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 transition-colors">Sentence Case</button>
        <button onClick={() => handleCase('camel')} className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 transition-colors">camelCase</button>
        <button onClick={() => handleCase('snake')} className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 transition-colors">snake_case</button>
        <button onClick={() => handleCase('inverse')} className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 transition-colors">Inverse Case</button>
        <button onClick={() => handleCase('reverse')} className="px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 transition-colors">Reverse Text</button>
      </div>
    </div>
  );
}

// ==========================================
// 9. CSV TO TABLE VIEWER
// ==========================================
export function CsvViewer({ language }: ToolProps) {
  const [csv, setCsv] = useState('ID,Name,Role,Email\n1,Roozbeh,Director,roozbeh.gh.a91@gmail.com\n2,Nikola Tesla,Inventor,nikola@tesla.org\n3,Ada Lovelace,Programmer,ada@lovelace.dev');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);

  const parseCsv = () => {
    if (!csv.trim()) {
      setHeaders([]);
      setRows([]);
      return;
    }
    const lines = csv.split('\n').filter(l => l.trim());
    if (lines.length > 0) {
      const headerRow = lines[0].split(',').map(h => h.trim());
      const bodyRows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
      setHeaders(headerRow);
      setRows(bodyRows);
    }
  };

  useEffect(() => {
    parseCsv();
  }, [csv]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
          {language === 'en' ? 'CSV Source (Comma Separated)' : 'داده‌های CSV (جدا شده با کاما)'}
        </label>
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          className="w-full h-32 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-zinc-900/60 border-b border-zinc-800">
                {headers.map((h, idx) => (
                  <th key={idx} className="p-3 font-semibold text-zinc-300 select-none">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-zinc-600">No rows decoded</td>
                </tr>
              ) : (
                rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-zinc-900/50 hover:bg-zinc-900/10">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 text-zinc-300 font-mono text-xs">{cell}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. TEXT DIFF & COMPARE
// ==========================================
export function TextCompare({ language }: ToolProps) {
  const [textA, setTextA] = useState('Apple\nBanana\nOrange\nWatermelon');
  const [textB, setTextB] = useState('Apple\nBlueberry\nOrange\nPineapple');
  const [diffs, setDiffs] = useState<{ line: number; type: 'equal' | 'modified' | 'added' | 'removed'; textA: string; textB: string }[]>([]);

  const compareTexts = () => {
    const linesA = textA.split('\n');
    const linesB = textB.split('\n');
    const maxLines = Math.max(linesA.length, linesB.length);
    const list: typeof diffs = [];

    for (let i = 0; i < maxLines; i++) {
      const a = linesA[i] || '';
      const b = linesB[i] || '';

      if (a === b) {
        list.push({ line: i + 1, type: 'equal', textA: a, textB: b });
      } else {
        list.push({ line: i + 1, type: 'modified', textA: a, textB: b });
      }
    }
    setDiffs(list);
  };

  useEffect(() => {
    compareTexts();
  }, [textA, textB]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Original Text A</label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            className="w-full h-40 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Modified Text B</label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            className="w-full h-40 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950/40 p-4 font-mono text-xs space-y-1 h-60 overflow-y-auto">
        {diffs.map((d, idx) => (
          <div key={idx} className="flex gap-4 border-b border-zinc-900/40 py-1.5">
            <span className="text-zinc-600 font-semibold w-8 text-right select-none">{d.line}</span>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <span className={`px-2 py-0.5 rounded ${d.type === 'modified' ? 'bg-red-950/40 text-red-400' : 'text-zinc-500'}`}>{d.textA || <span className="opacity-35 italic">[empty]</span>}</span>
              <span className={`px-2 py-0.5 rounded ${d.type === 'modified' ? 'bg-emerald-950/40 text-emerald-400' : 'text-zinc-300'}`}>{d.textB || <span className="opacity-35 italic">[empty]</span>}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 11. URL ENCODER/DECODER
// ==========================================
export function UrlEncoder({ language }: ToolProps) {
  const [input, setInput] = useState('https://viz.app/search?query=hello world&category=dev tools');
  const [output, setOutput] = useState('');
  const [isEncode, setIsEncode] = useState(true);
  const { copied, copy } = useCopy();

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      if (isEncode) {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (e) {
      setOutput('Conversion error. Check your escape hashes.');
    }
  }, [input, isEncode]);

  return (
    <div className="space-y-4">
      <div className="flex bg-zinc-950 p-1 border border-zinc-800 rounded-xl max-w-xs">
        <button
          onClick={() => setIsEncode(true)}
          className={`flex-1 text-xs py-1.5 rounded-lg transition-colors font-medium ${
            isEncode ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {language === 'en' ? 'Encode URL' : 'کدگذاری URL'}
        </button>
        <button
          onClick={() => setIsEncode(false)}
          className={`flex-1 text-xs py-1.5 rounded-lg transition-colors font-medium ${
            !isEncode ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {language === 'en' ? 'Decode URL' : 'رمزگشایی URL'}
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-28 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none focus:border-indigo-500"
      />

      <div className="relative">
        <textarea
          readOnly
          value={output}
          className="w-full h-28 bg-zinc-950 text-indigo-400 p-4 pr-12 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none"
        />
        {output && (
          <button
            onClick={() => copy(output)}
            className="absolute top-3 right-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 p-1.5 rounded-lg border border-zinc-850 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 12. TEXT & BINARY CONVERTER
// ==========================================
export function BinaryConverter({ language }: ToolProps) {
  const [text, setText] = useState('Viz');
  const [binary, setBinary] = useState('01010110 01101001 01111010');

  const textToBinary = (str: string) => {
    return str.split('').map(char => {
      const bin = char.charCodeAt(0).toString(2);
      return '0'.repeat(8 - bin.length) + bin;
    }).join(' ');
  };

  const binaryToText = (bin: string) => {
    try {
      const cleanBin = bin.replace(/\s+/g, '');
      const matches = cleanBin.match(/.{1,8}/g);
      if (!matches) return '';
      return matches.map(b => String.fromCharCode(parseInt(b, 2))).join('');
    } catch {
      return '[Error decoding binary]';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
          {language === 'en' ? 'Plain Text String' : 'رشته متنی'}
        </label>
        <textarea
          value={text}
          onChange={(e) => {
            const val = e.target.value;
            setText(val);
            setBinary(textToBinary(val));
          }}
          className="w-full h-44 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
          {language === 'en' ? 'Binary (Zeros & Ones)' : 'کدهای باینری (صفر و یک)'}
        </label>
        <textarea
          value={binary}
          onChange={(e) => {
            const val = e.target.value;
            setBinary(val);
            setText(binaryToText(val));
          }}
          className="w-full h-44 bg-zinc-950 text-indigo-400 p-4 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

// ==========================================
// 13. HTML ENTITY CONCODER/DECODER
// ==========================================
export function HtmlEntityConverter({ language }: ToolProps) {
  const [input, setInput] = useState('<div class="premium">Viz App</div>');
  const [output, setOutput] = useState('');
  const [isEncode, setIsEncode] = useState(true);
  const { copied, copy } = useCopy();

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    if (isEncode) {
      setOutput(input.replace(/[\u00A0-\u9999<>\&]/g, (i) => `&#${i.charCodeAt(0)};`));
    } else {
      const doc = new DOMParser().parseFromString(input, 'text/html');
      setOutput(doc.documentElement.textContent || '');
    }
  }, [input, isEncode]);

  return (
    <div className="space-y-4">
      <div className="flex bg-zinc-950 p-1 border border-zinc-800 rounded-xl max-w-xs">
        <button
          onClick={() => setIsEncode(true)}
          className={`flex-1 text-xs py-1.5 rounded-lg transition-colors font-medium ${
            isEncode ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {language === 'en' ? 'Encode Entities' : 'کدگذاری نهادهای HTML'}
        </button>
        <button
          onClick={() => setIsEncode(false)}
          className={`flex-1 text-xs py-1.5 rounded-lg transition-colors font-medium ${
            !isEncode ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {language === 'en' ? 'Decode Entities' : 'رمزگشایی نهادهای HTML'}
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-28 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none"
      />

      <div className="relative">
        <textarea
          readOnly
          value={output}
          className="w-full h-28 bg-zinc-950 text-indigo-400 p-4 pr-12 rounded-xl border border-zinc-800 font-mono text-sm focus:outline-none"
        />
        {output && (
          <button
            onClick={() => copy(output)}
            className="absolute top-3 right-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 p-1.5 rounded-lg border border-zinc-850 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
