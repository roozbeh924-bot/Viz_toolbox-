/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Terminal, Command, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tool } from '../types';
import { TOOLS_LIST } from '../data/tools';

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string, prefilledInput?: string) => void;
  language: 'en' | 'fa';
}

export default function CommandCenter({ isOpen, onClose, onSelectTool, language }: CommandCenterProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle global key binds (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length + Math.min(1, smartCommand ? 1 : 0)));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + Math.max(1, filteredTools.length + Math.min(1, smartCommand ? 1 : 0))) % Math.max(1, filteredTools.length + Math.min(1, smartCommand ? 1 : 0)));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleSelectCurrent();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Smart command parser
  const getSmartCommand = () => {
    if (!query.trim()) return null;
    const lower = query.toLowerCase().trim();

    // Weather
    if (lower.startsWith('weather ') || lower.startsWith('هوا ')) {
      const city = query.slice(lower.startsWith('weather ') ? 8 : 4).trim();
      return {
        id: 'api-weather',
        name: language === 'en' ? `Get Weather for "${city}"` : `دریافت آب‌وهوای «${city}»`,
        param: city,
        icon: 'CloudSun'
      };
    }
    // QR Code
    if (lower.startsWith('qr ') || lower.startsWith('کیوار ')) {
      const text = query.slice(lower.startsWith('qr ') ? 3 : 6).trim();
      return {
        id: 'qr-generator',
        name: language === 'en' ? `Generate QR for "${text}"` : `تولید کیو‌آر برای «${text}»`,
        param: text,
        icon: 'QrCode'
      };
    }
    // Translation
    if (lower.startsWith('translate ') || lower.startsWith('tr ') || lower.startsWith('ترجمه ')) {
      const prefixLength = lower.startsWith('translate ') ? 10 : lower.startsWith('tr ') ? 3 : 6;
      const text = query.slice(prefixLength).trim();
      return {
        id: 'api-dictionary',
        name: language === 'en' ? `Translate/Define "${text}"` : `ترجمه/تعریف واژه «${text}»`,
        param: text,
        icon: 'BookOpen'
      };
    }
    // Calculator
    const mathRegex = /^[\d+\-*/().\s]+$/;
    if (mathRegex.test(lower) && (lower.includes('+') || lower.includes('-') || lower.includes('*') || lower.includes('/'))) {
      return {
        id: 'calculator',
        name: language === 'en' ? `Calculate "${query.trim()}"` : `محاسبه ریاضی «${query.trim()}»`,
        param: query.trim(),
        icon: 'Calculator'
      };
    }
    // Base64
    if (lower.startsWith('base64 ') || lower.startsWith('بیس۶۴ ')) {
      const text = query.slice(lower.startsWith('base64 ') ? 7 : 6).trim();
      return {
        id: 'base64-converter',
        name: language === 'en' ? `Base64 Encode "${text}"` : `کدگذاری بیس۶۴ «${text}»`,
        param: text,
        icon: 'ArrowLeftRight'
      };
    }
    // Hash
    if (lower.startsWith('hash ') || lower.startsWith('هش ')) {
      const text = query.slice(lower.startsWith('hash ') ? 5 : 3).trim();
      return {
        id: 'hash-generator',
        name: language === 'en' ? `Generate Hash for "${text}"` : `تولید هش برای «${text}»`,
        param: text,
        icon: 'Lock'
      };
    }

    return null;
  };

  const smartCommand = getSmartCommand();

  // Search filter
  const filteredTools = TOOLS_LIST.filter((tool) => {
    if (!query.trim()) return tool.category !== 'settings'; // default list
    const q = query.toLowerCase();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.commands.some((cmd) => cmd.toLowerCase().includes(q))
    );
  });

  const handleSelectCurrent = () => {
    if (smartCommand && selectedIndex === 0) {
      onSelectTool(smartCommand.id, smartCommand.param);
      onClose();
    } else {
      const toolIdx = smartCommand ? selectedIndex - 1 : selectedIndex;
      const selectedTool = filteredTools[toolIdx];
      if (selectedTool) {
        onSelectTool(selectedTool.id);
        onClose();
      }
    }
  };

  // Close when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isRTL = language === 'fa';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[10vh] p-4 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95 shadow-2xl backdrop-blur-md"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header Input */}
          <div className="flex items-center border-b border-zinc-800 px-4 py-3">
            <Search className="h-5 w-5 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder={
                language === 'en'
                  ? 'Type a command or search tools (e.g. "weather London" or "5 * 12")...'
                  : 'یک دستور بنویسید یا ابزارها را جستجو کنید (مثلا "هوا تهران" یا "۵ * ۱۲")...'
              }
              className="flex-1 bg-transparent px-3 py-1 text-base text-zinc-100 placeholder-zinc-500 outline-none"
            />
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-zinc-800 text-zinc-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2" ref={containerRef}>
            {/* Smart Command Block */}
            {smartCommand && (
              <div className="mb-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-indigo-400 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  {language === 'en' ? 'Viz Instant Action' : 'عملیات فوری Viz'}
                </div>
                <button
                  onClick={() => {
                    onSelectTool(smartCommand.id, smartCommand.param);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${
                    selectedIndex === 0
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'hover:bg-zinc-800/60 text-zinc-300'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center gap-3">
                    <Terminal className="h-5 w-5 text-indigo-400" />
                    <div>
                      <div className="font-medium text-sm">{smartCommand.name}</div>
                      <div className={`text-xs ${selectedIndex === 0 ? 'text-indigo-200' : 'text-zinc-500'}`}>
                        {language === 'en' ? 'Press Enter to execute now' : 'کلید اینتر را برای اجرای فوری بفشارید'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-60" />
                </button>
              </div>
            )}

            {/* Standard Tools Search Results */}
            <div>
              {filteredTools.length > 0 && (
                <div className="px-3 py-1.5 text-xs font-semibold text-zinc-500">
                  {language === 'en' ? 'Available Command Utilities' : 'ابزارهای کمکی در دسترس'}
                </div>
              )}

              {filteredTools.length === 0 && !smartCommand && (
                <div className="py-12 text-center text-zinc-500">
                  <Command className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
                  <p className="text-sm">
                    {language === 'en' ? 'No matching utility found.' : 'هیچ ابزار مطابقی پیدا نشد.'}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">
                    {language === 'en'
                      ? 'Try searching "json", "calculator", "weather" or "password".'
                      : 'جستجوی "جی‌سان"، "ماشین‌حساب"، "آب و هوا" یا "پسورد" را امتحان کنید.'}
                  </p>
                </div>
              )}

              {filteredTools.map((tool, index) => {
                const globalIndex = smartCommand ? index + 1 : index;
                const isSelected = selectedIndex === globalIndex;

                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 my-0.5 text-left transition-all ${
                      isSelected
                        ? 'bg-zinc-800 text-white'
                        : 'hover:bg-zinc-800/30 text-zinc-300'
                    }`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-1.5 ${isSelected ? 'bg-zinc-700' : 'bg-zinc-800'}`}>
                        <div className="text-indigo-400 h-4.5 w-4.5 flex items-center justify-center">
                          <Terminal className="h-4.5 w-4.5" />
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm text-zinc-100">
                          {isRTL && tool.name_fa ? tool.name_fa : tool.name}
                        </div>
                        <div className="text-xs text-zinc-500 truncate max-w-md">
                          {isRTL && tool.description_fa ? tool.description_fa : tool.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-600 font-mono px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800/40">
                      {tool.category.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Shortcuts */}
          <div className="flex justify-between items-center bg-zinc-950 px-4 py-2 text-xs text-zinc-500 border-t border-zinc-800/60 font-mono">
            <div className="flex items-center gap-2">
              <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 border border-zinc-700 text-[10px]">↑↓</kbd>
              <span>{language === 'en' ? 'Navigate' : 'ناوبری'}</span>
              <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 border border-zinc-700 text-[10px] ml-2">Enter</kbd>
              <span>{language === 'en' ? 'Execute' : 'اجرا'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>VIZ COMMANDS</span>
              <Command className="h-3.5 w-3.5" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
