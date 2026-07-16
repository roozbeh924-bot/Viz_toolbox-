/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Braces, Regex, Binary, KeyRound, FileText, ArrowLeftRight, Lock, CaseSensitive,
  Table2, Columns2, Link2, Cpu, CodeXml, Palette, Sparkles, Eye, FileCode,
  Image, Minimize2, Type, Layers, Calculator, FileEdit, CheckSquare, Timer,
  Hash, HelpCircle, Clipboard, Scale, Coins, Heart, TrendingUp,
  Percent, Receipt, Globe, Clock, CalendarDays, CalendarRange, Hourglass,
  Calendar, CalendarCheck, CloudSun, BookOpen, Newspaper, Search, Flag,
  PartyPopper, Quote, Network, MapPin, Droplet, Globe2, QrCode, Barcode,
  Volume2, Shield, Settings, Sliders, ChevronRight, ArrowLeft, Home, Command,
  AlertCircle, Info, RefreshCw, X, MessageSquare, ExternalLink, Languages, Music, Download, Gamepad
} from 'lucide-react';
import CommandCenter from './components/CommandCenter';
import { motion, AnimatePresence } from 'motion/react';
import { TOOLS_LIST } from './data/tools';
import { Tool, ToolCategory } from './types';

// --- Tool imports ---
import {
  JsonFormatter, RegexTester, UuidGenerator, PasswordGenerator, MarkdownEditor,
  Base64Converter, HashGenerator, CaseConverter, CsvViewer, TextCompare,
  UrlEncoder, BinaryConverter, HtmlEntityConverter
} from './components/tools/DevTools';

import {
  ColorPickerTool, GradientGeneratorTool, ContrastCheckerTool, SvgViewerTool,
  ImageConverterTool, ImageCompressorTool, FontPreviewerTool, ShadowGeneratorTool
} from './components/tools/DesignTools';

import {
  CalculatorTool, NotesTool, TasksTool, TimerTool, StopwatchTool,
  TextCounterTool, RandomGeneratorTool, ClipboardTool
} from './components/tools/UtilityTools';

import {
  UnitConverterTool, CurrencyConverterTool, BmiCalculatorTool, LoanCalculatorTool,
  FuelEstimatorTool, BaseMathTool, PercentageTool, TipCalculatorTool
} from './components/tools/MathTools';

import {
  WorldClockTool, TimezoneConverterTool, AgeCalculatorTool as DateAgeCalculatorTool,
  DateDiffTool, CountdownTool, CalendarGridTool, LeapYearTool
} from './components/tools/DateTools';

import {
  WeatherApiTool, DictionaryApiTool, NewsApiTool, WikipediaApiTool,
  CountryApiTool, HolidayApiTool, QuoteApiTool, PublicIpApiTool,
  GeocodingApiTool, ColorInfoApiTool, UrlMetadataApiTool, TimezoneApiTool,
  QrGeneratorTool, BarcodeGeneratorTool, MorseCodeTool, SubnetCalculatorTool
} from './components/tools/APIsTools';

import {
  SongFinderTool, AiTranslatorTool, CalorieAdvisorTool
} from './components/tools/AITools';

import GameTools from './components/tools/GameTools';

export default function App() {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [prefilledInput, setPrefilledInput] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'fa'>('en');
  const [accent, setAccent] = useState<'indigo' | 'emerald' | 'rose' | 'amber' | 'purple'>('indigo');
  const [categoryTab, setCategoryTab] = useState<string>('all');
  const [dashboardSearch, setDashboardSearch] = useState<string>('');
  const [commandCenterOpen, setCommandCenterOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Home Quick Scratchpad Sync
  const [scratchpadText, setScratchpadText] = useState(() => {
    try {
      const saved = localStorage.getItem('viz_home_scratchpad');
      return saved || '';
    } catch { return ''; }
  });

  // World Clock ticking on Home
  const [clockTick, setClockTick] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setClockTick(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('viz_home_scratchpad', scratchpadText);
    // Auto-save scratchpad text into notesDraft database also if typed
    if (scratchpadText.trim()) {
      try {
        const savedNotes = localStorage.getItem('viz_notes_store');
        const notes = savedNotes ? JSON.parse(savedNotes) : [];
        const homeNoteIdx = notes.findIndex((n: any) => n.id === 'home-scratchpad');
        if (homeNoteIdx > -1) {
          notes[homeNoteIdx].content = scratchpadText;
          notes[homeNoteIdx].updatedAt = new Date().toLocaleTimeString();
        } else {
          notes.push({
            id: 'home-scratchpad',
            title: language === 'en' ? '🏠 Home Scratchpad' : '🏠 چرکنویس اصلی',
            content: scratchpadText,
            updatedAt: new Date().toLocaleTimeString()
          });
        }
        localStorage.setItem('viz_notes_store', JSON.stringify(notes));
      } catch (e) {
        console.warn(e);
      }
    }
  }, [scratchpadText]);

  // Sync scratchpad if notes changed
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('viz_notes_store');
      if (savedNotes) {
        const notes = JSON.parse(savedNotes);
        const homeNote = notes.find((n: any) => n.id === 'home-scratchpad');
        if (homeNote && homeNote.content !== scratchpadText) {
          setScratchpadText(homeNote.content);
        }
      }
    } catch {}
  }, [activeToolId]);

  // Global Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandCenterOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (!commandCenterOpen) {
          if (activeToolId !== null) {
            handleCloseTool();
          } else {
            setSettingsOpen(false);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandCenterOpen, activeToolId]);

  // Popstate history listener for device back button handling
  useEffect(() => {
    if (window.history.state === null) {
      window.history.replaceState({ toolId: null }, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state && 'toolId' in state) {
        setActiveToolId(state.toolId);
      } else {
        setActiveToolId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleCloseTool = () => {
    if (window.history.state && window.history.state.toolId !== null) {
      window.history.back();
    } else {
      setActiveToolId(null);
    }
  };

  // Categories definitions
  const categoriesList = [
    { id: 'all', name_en: 'All Tools', name_fa: 'همه ابزارها', icon: Layers },
    { id: 'games', name_en: 'Arcade Arena', name_fa: 'شهربازی تفننی', icon: Gamepad },
    { id: 'utility', name_en: 'Everyday Tools', name_fa: 'ابزارهای کاربردی روزمره', icon: Calculator },
    { id: 'math', name_en: 'Math & Calculations', name_fa: 'ریاضی و محاسبات کاربردی', icon: TrendingUp },
    { id: 'date', name_en: 'Time & Calendars', name_fa: 'زمان، ساعت و تقویم', icon: CalendarRange },
    { id: 'api', name_en: 'Live Weather & Info', name_fa: 'هواشناسی و اطلاعات زنده', icon: Globe },
    { id: 'design', name_en: 'Colors & Graphics', name_fa: 'رنگ‌ها و گرافیک ساده', icon: Palette },
    { id: 'dev', name_en: 'Developer Specialties', name_fa: 'ابزارهای تخصصی برنامه‌نویسی', icon: CodeXml }
  ];

  const getAccentColorClass = (type: 'text' | 'bg' | 'border' | 'focus-border' | 'ring' | 'button-hover') => {
    const palette = {
      indigo: {
        text: 'text-indigo-400',
        bg: 'bg-indigo-600',
        border: 'border-indigo-500/30',
        'focus-border': 'focus:border-indigo-500',
        ring: 'ring-indigo-500',
        'button-hover': 'hover:bg-indigo-500'
      },
      emerald: {
        text: 'text-emerald-400',
        bg: 'bg-emerald-600',
        border: 'border-emerald-500/30',
        'focus-border': 'focus:border-emerald-500',
        ring: 'ring-emerald-500',
        'button-hover': 'hover:bg-emerald-500'
      },
      rose: {
        text: 'text-rose-400',
        bg: 'bg-rose-600',
        border: 'border-rose-500/30',
        'focus-border': 'focus:border-rose-500',
        ring: 'ring-rose-500',
        'button-hover': 'hover:bg-rose-500'
      },
      amber: {
        text: 'text-amber-400',
        bg: 'bg-amber-600',
        border: 'border-amber-500/30',
        'focus-border': 'focus:border-amber-500',
        ring: 'ring-amber-500',
        'button-hover': 'hover:bg-amber-500'
      },
      purple: {
        text: 'text-purple-400',
        bg: 'bg-purple-600',
        border: 'border-purple-500/30',
        'focus-border': 'focus:border-purple-500',
        ring: 'ring-purple-500',
        'button-hover': 'hover:bg-purple-500'
      }
    };
    return palette[accent][type];
  };

  const handleSelectTool = (id: string, prefill: string = '') => {
    setActiveToolId(id);
    setPrefilledInput(prefill);
    window.history.pushState({ toolId: id }, '');
  };

  // Filter tools for dashboard list
  const filteredTools = TOOLS_LIST.filter((tool) => {
    if (tool.category === 'settings') return false;
    const matchesCategory = categoryTab === 'all' || tool.category === categoryTab;
    const matchesSearch = !dashboardSearch.trim() ||
      tool.name.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
      tool.description.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
      tool.commands.some((cmd) => cmd.toLowerCase().includes(dashboardSearch.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const activeTool = TOOLS_LIST.find((t) => t.id === activeToolId);
  const isRTL = language === 'fa';

  const renderToolComponent = (id: string) => {
    switch (id) {
      // Premium AI Consumer Tools
      case 'song-finder': return <SongFinderTool language={language} />;
      case 'ai-translator': return <AiTranslatorTool language={language} />;
      case 'calorie-advisor': return <CalorieAdvisorTool language={language} />;

      // Dev Tools
      case 'json-formatter': return <JsonFormatter prefilledInput={prefilledInput} language={language} />;
      case 'regex-tester': return <RegexTester language={language} />;
      case 'uuid-generator': return <UuidGenerator language={language} />;
      case 'password-generator': return <PasswordGenerator language={language} />;
      case 'markdown-editor': return <MarkdownEditor language={language} />;
      case 'base64-converter': return <Base64Converter prefilledInput={prefilledInput} language={language} />;
      case 'hash-generator': return <HashGenerator prefilledInput={prefilledInput} language={language} />;
      case 'case-converter': return <CaseConverter language={language} />;
      case 'csv-viewer': return <CsvViewer language={language} />;
      case 'text-compare': return <TextCompare language={language} />;
      case 'url-encoder': return <UrlEncoder language={language} />;
      case 'binary-converter': return <BinaryConverter language={language} />;
      case 'html-entity': return <HtmlEntityConverter language={language} />;

      // Design Tools
      case 'color-picker': return <ColorPickerTool language={language} />;
      case 'gradient-generator': return <GradientGeneratorTool language={language} />;
      case 'contrast-checker': return <ContrastCheckerTool language={language} />;
      case 'svg-previewer': return <SvgViewerTool language={language} />;
      case 'image-converter': return <ImageConverterTool language={language} />;
      case 'image-compressor': return <ImageCompressorTool language={language} />;
      case 'font-previewer': return <FontPreviewerTool language={language} />;
      case 'shadow-generator': return <ShadowGeneratorTool language={language} />;

      // Utility Tools
      case 'calculator': return <CalculatorTool prefilledInput={prefilledInput} language={language} />;
      case 'notes': return <NotesTool language={language} />;
      case 'tasks': return <TasksTool language={language} />;
      case 'timer': return <TimerTool language={language} />;
      case 'stopwatch': return <StopwatchTool language={language} />;
      case 'text-counter': return <TextCounterTool language={language} />;
      case 'random-generator': return <RandomGeneratorTool language={language} />;
      case 'clipboard-manager': return <ClipboardTool language={language} />;

      // Math Tools
      case 'unit-converter': return <UnitConverterTool language={language} />;
      case 'currency-converter': return <CurrencyConverterTool language={language} />;
      case 'bmi-calculator': return <BmiCalculatorTool language={language} />;
      case 'loan-calculator': return <LoanCalculatorTool language={language} />;
      case 'fuel-consumption': return <FuelEstimatorTool language={language} />;
      case 'binary-math': return <BaseMathTool language={language} />;
      case 'percentage-calculator': return <PercentageTool language={language} />;
      case 'tip-calculator': return <TipCalculatorTool language={language} />;

      // Date Tools
      case 'world-clock': return <WorldClockTool language={language} />;
      case 'timezone-converter': return <TimezoneConverterTool language={language} />;
      case 'age-calculator': return <DateAgeCalculatorTool language={language} />;
      case 'date-diff': return <DateDiffTool language={language} />;
      case 'countdown': return <CountdownTool language={language} />;
      case 'calendar': return <CalendarGridTool language={language} />;
      case 'leap-year': return <LeapYearTool language={language} />;

      // API Tools
      case 'api-weather': return <WeatherApiTool prefilledInput={prefilledInput} language={language} />;
      case 'api-dictionary': return <DictionaryApiTool prefilledInput={prefilledInput} language={language} />;
      case 'api-news': return <NewsApiTool />;
      case 'api-wikipedia': return <WikipediaApiTool prefilledInput={prefilledInput} language={language} />;
      case 'api-country': return <CountryApiTool />;
      case 'api-holiday': return <HolidayApiTool />;
      case 'api-quote': return <QuoteApiTool />;
      case 'api-public-ip': return <PublicIpApiTool />;
      case 'api-geocoding': return <GeocodingApiTool />;
      case 'api-color-info': return <ColorInfoApiTool />;
      case 'api-url-metadata': return <UrlMetadataApiTool />;
      case 'api-timezone': return <TimezoneApiTool />;
      case 'qr-generator': return <QrGeneratorTool prefilledInput={prefilledInput} language={language} />;
      case 'barcode-generator': return <BarcodeGeneratorTool />;
      case 'morse-code': return <MorseCodeTool />;
      case 'ip-subnet': return <SubnetCalculatorTool />;
      case 'game-arena': return <GameTools language={language} />;

      default:
        return (
          <div className="text-zinc-500 text-center py-16 font-mono text-sm">
            This tool is undergoing high-performance calibration.
          </div>
        );
    }
  };

  const getGreeting = () => {
    const hrs = clockTick.getHours();
    if (language === 'fa') {
      if (hrs < 12) return 'صبح بخیر، کاوشگر';
      if (hrs < 18) return 'روز خوش، کاوشگر';
      return 'شب بخیر، کاوشگر';
    }
    if (hrs < 12) return 'Good morning, Explorer.';
    if (hrs < 18) return 'Good afternoon, Explorer.';
    return 'Good evening, Explorer.';
  };

  const getToolIcon = (iconName: string) => {
    // Dynamically retrieve lucide icon or fallback to default Terminal/Sliders
    const iconsMap: Record<string, any> = {
      Braces, Regex, Binary, KeyRound, FileText, ArrowLeftRight, Lock, CaseSensitive,
      Table2, Columns2, Link2, Cpu, CodeXml, Palette, Sparkles, Eye, FileCode,
      Image, Minimize2, Type, Layers, Calculator, FileEdit, CheckSquare, Timer,
      Hash, HelpCircle, Clipboard, Scale, Coins, Heart, TrendingUp,
      Percent, Receipt, Globe, Clock, CalendarDays, CalendarRange, Hourglass,
      Calendar, CalendarCheck, CloudSun, BookOpen, Newspaper, Search, Flag,
      PartyPopper, Quote, Network, MapPin, Droplet, Globe2, QrCode, Barcode,
      Volume2, Shield, Languages, Music
    };
    return iconsMap[iconName] || Sliders;
  };

  return (
    <div
      className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Premium Ambient Cosmic Spotlights */}
      <div className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/3 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* 1. TOP HEADER NAVIGATION RAIL */}
      <header className="sticky top-0 z-40 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveToolId(null)}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <div className={`rounded-xl p-1.5 ${getAccentColorClass('bg')} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-105`}>
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl font-mono tracking-wider bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              VIZ
            </span>
          </div>

          {activeToolId && (
            <button
              onClick={() => setActiveToolId(null)}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 rounded-lg transition-colors ml-2"
            >
              {isRTL ? <ArrowRightIcon className="h-3 w-3" /> : <ArrowLeft className="h-3.5 w-3.5" />}
              <span>{language === 'en' ? 'Back to Dashboard' : 'بازگشت به پیشخوان'}</span>
            </button>
          )}
        </div>

        {/* Dynamic global search button triggers CommandCenter */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
          <button
            onClick={() => setCommandCenterOpen(true)}
            className="w-full bg-zinc-900/60 border border-zinc-850 hover:border-zinc-750 px-4 py-2 rounded-xl text-left text-zinc-400 flex items-center justify-between transition-all shadow-inner text-xs"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-zinc-500" />
              <span>
                {language === 'en'
                  ? 'Inquire 50+ tools, execute instant weather, math calculations...'
                  : 'جستجو در ۵۰+ ابزار، اجرای فوری آب‌وهوا، محاسبات ریاضی...'}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-500 bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 rounded">
              <span className="text-[9px]">⌘</span>K
            </div>
          </button>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Language Toggle */}
          <button
            onClick={() => setLanguage((prev) => (prev === 'en' ? 'fa' : 'en'))}
            className="text-xs font-semibold font-mono border border-zinc-850 hover:border-zinc-700 px-3 py-1.5 rounded-xl bg-zinc-900/40 text-zinc-300 transition-colors cursor-pointer"
          >
            {language === 'en' ? 'FA' : 'EN'}
          </button>

          {/* Quick Settings Icon */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 border border-zinc-850 hover:border-zinc-700 rounded-xl bg-zinc-900/40 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. CORE CONTAINER WRAPPER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {!activeToolId ? (
          /* ==========================================
             A. PREMIUM BENTO DASHBOARD (NO ACTIVE TOOL)
             ========================================== */
          <div className="space-y-6">
            {/* Header greeting card with dynamic Clock and quick details */}
            <div className="bg-zinc-900/40 border border-zinc-850/60 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-2xl backdrop-blur-md">
              <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-850 ${getAccentColorClass('text')}`}>
                    VIZ SUPER APP
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>50+ ACTIVE PIPELINES</span>
                  </div>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">
                  {getGreeting()}
                </h1>
                <p className="text-sm text-zinc-400 max-w-lg leading-relaxed">
                  {language === 'en'
                    ? 'Welcome to the consolidated mission control applet. Access utilities, run instant commands via ⌘K, or write secure local drafts.'
                    : 'به پنل یکپارچه ابزارهای دیجیتال خوش آمدید. با ⌘K به ابزارها دسترسی پیدا کنید، دستور اجرا کنید، یا چرکنویس محلی خود را توسعه دهید.'}
                </p>
              </div>

              {/* Dynamic tick clock box */}
              <div className="bg-zinc-950/60 border border-zinc-850 p-4 rounded-2xl flex flex-col items-center justify-center font-mono text-center w-full md:w-auto min-w-44 shadow-lg">
                <Clock className={`h-5 w-5 mb-1.5 ${getAccentColorClass('text')}`} />
                <span className="text-xl font-bold tracking-wider text-zinc-200">
                  {clockTick.toLocaleTimeString('en-US', { hour12: false })}
                </span>
                <span className="text-[9px] text-zinc-500 uppercase font-semibold mt-1">
                  {clockTick.toLocaleDateString(language === 'en' ? 'en-US' : 'fa-IR', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* BENTO QUICK-WIDGETS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Widget 1: Live Interactive Clock widget */}
              <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between h-48 relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      {language === 'en' ? 'Zone Watch' : 'ساعت جهانی'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Quick atomic sync</p>
                  </div>
                  <Globe className="h-4 w-4 text-zinc-500" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs my-1">
                  <div className="bg-zinc-950/80 p-1.5 rounded-lg border border-zinc-900">
                    <div className="text-[10px] text-zinc-500">NYC</div>
                    <div className="font-bold text-zinc-300 mt-0.5">
                      {clockTick.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false })}
                    </div>
                  </div>
                  <div className="bg-zinc-950/80 p-1.5 rounded-lg border border-zinc-900">
                    <div className="text-[10px] text-zinc-500">LON</div>
                    <div className="font-bold text-zinc-300 mt-0.5">
                      {clockTick.toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: false })}
                    </div>
                  </div>
                  <div className="bg-zinc-950/80 p-1.5 rounded-lg border border-zinc-900">
                    <div className="text-[10px] text-zinc-500">THR</div>
                    <div className="font-bold text-zinc-300 mt-0.5">
                      {clockTick.toLocaleTimeString('en-US', { timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', hour12: false })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleSelectTool('world-clock')}
                  className={`w-full text-center text-[10px] font-bold ${getAccentColorClass('text')} hover:underline flex items-center justify-center gap-1 cursor-pointer`}
                >
                  <span>{language === 'en' ? 'Open World Clock' : 'نمایش ساعت جهانی'}</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Widget 2: Sync scratchpad widget */}
              <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between h-48 relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      {language === 'en' ? 'Quick Draft' : 'پیش‌نویس سریع'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Stored inside Notes db</p>
                  </div>
                  <FileEdit className="h-4 w-4 text-zinc-500" />
                </div>
                <textarea
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  placeholder={language === 'en' ? 'Write thoughts down instantly...' : 'افکار خود را اینجا چرکنویس کنید...'}
                  className="w-full flex-1 bg-zinc-950/40 border border-zinc-900 rounded-lg p-2 text-xs text-zinc-200 resize-none outline-none focus:border-zinc-800 my-2 font-sans"
                />
                <button
                  onClick={() => handleSelectTool('notes')}
                  className={`w-full text-center text-[10px] font-bold ${getAccentColorClass('text')} hover:underline flex items-center justify-center gap-1 cursor-pointer`}
                >
                  <span>{language === 'en' ? 'Open Full Scratchpad' : 'نمایش یادداشت‌های کامل'}</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Widget 3: Live Inspirational Quote or Quick Tasks */}
              <div className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-5 flex flex-col justify-between h-48 relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      {language === 'en' ? 'Axiom of the Day' : 'اندیشه روز'}
                    </h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Wisdom generator</p>
                  </div>
                  <Quote className="h-4 w-4 text-zinc-500" />
                </div>
                <p className="text-xs text-zinc-400 italic leading-relaxed my-2 line-clamp-3 font-serif">
                  "Simplicity is the final achievement. After one has played a vast quantity of notes, it is simplicity that emerges as the crowning reward."
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-zinc-500 font-mono">— Frédéric Chopin</span>
                  <button
                    onClick={() => handleSelectTool('api-quote')}
                    className={`text-[10px] font-bold ${getAccentColorClass('text')} hover:underline flex items-center gap-1 cursor-pointer`}
                  >
                    <span>{language === 'en' ? 'Explore Quotes' : 'جستجوی گفتاوردهای بیشتر'}</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* DIRECTORY SECTION CONTROLS (CATEGORY SELECTOR + LIVE SEARCH BAR) */}
            <div className="space-y-4 border-t border-zinc-900 pt-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-zinc-200">
                  {language === 'en' ? 'Inquire Utility Catalog' : 'کاتالوگ ابزارهای کاربردی'}
                </h2>

                {/* Dashboard Inline Search filter */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={dashboardSearch}
                    onChange={(e) => setDashboardSearch(e.target.value)}
                    placeholder={language === 'en' ? 'Filter catalog...' : 'فیلتر فهرست ابزارها...'}
                    className="w-full bg-zinc-900 border border-zinc-850 px-3 pl-9 py-1.5 rounded-xl text-xs text-zinc-200 outline-none focus:border-zinc-700"
                  />
                  {dashboardSearch && (
                    <button
                      onClick={() => setDashboardSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-zinc-800 rounded-md"
                    >
                      <X className="h-3 w-3 text-zinc-500" />
                    </button>
                  )}
                </div>
              </div>

              {/* Horizontal scrollable categories tab bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-900/40">
                {categoriesList.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = categoryTab === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryTab(cat.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                        isSelected
                          ? `${getAccentColorClass('bg')} text-white border-transparent shadow-lg`
                          : 'bg-zinc-900/50 border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{language === 'en' ? cat.name_en : cat.name_fa}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMPREHENSIVE TOOLS CARDS GRID */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-12"
              layout
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.015
                  }
                }
              }}
            >
              {filteredTools.length === 0 ? (
                <div className="col-span-full py-16 text-center text-zinc-500">
                  <Search className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
                  <p className="text-sm font-semibold">
                    {language === 'en' ? 'No utility fits that criteria.' : 'هیچ ابزاری با این فیلتر پیدا نشد.'}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {language === 'en' ? 'Try searching different terms or commands.' : 'سعی کنید عبارات دیگری را فیلتر کنید.'}
                  </p>
                </div>
              ) : (
                filteredTools.map((tool) => {
                  const ToolIcon = getToolIcon(tool.icon);
                  
                  // Dynamic custom glowing colors mapping
                  const borderGlow = accent === 'indigo' ? 'rgba(99, 102, 241, 0.35)' :
                                     accent === 'emerald' ? 'rgba(16, 185, 129, 0.35)' :
                                     accent === 'rose' ? 'rgba(244, 63, 94, 0.35)' :
                                     accent === 'amber' ? 'rgba(245, 158, 11, 0.35)' :
                                     'rgba(168, 85, 247, 0.35)';

                  const shadowGlow = accent === 'indigo' ? '0 12px 24px -10px rgba(99, 102, 241, 0.22)' :
                                     accent === 'emerald' ? '0 12px 24px -10px rgba(16, 185, 129, 0.22)' :
                                     accent === 'rose' ? '0 12px 24px -10px rgba(244, 63, 94, 0.22)' :
                                     accent === 'amber' ? '0 12px 24px -10px rgba(245, 158, 11, 0.22)' :
                                     '0 12px 24px -10px rgba(168, 85, 247, 0.22)';

                  return (
                    <motion.div
                      key={tool.id}
                      layout
                      variants={{
                        hidden: { y: 15, opacity: 0 },
                        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 350, damping: 28 } }
                      }}
                      whileHover={{ 
                        scale: 1.025, 
                        y: -5,
                        borderColor: borderGlow,
                        boxShadow: shadowGlow
                      }}
                      onClick={() => handleSelectTool(tool.id)}
                      className="bg-zinc-950/70 border border-zinc-850 p-4.5 rounded-2xl flex flex-col justify-between cursor-pointer transition-colors group relative select-none backdrop-blur-md"
                    >
                      <div className="space-y-3.5">
                        <div className="flex justify-between items-start">
                          <div className={`p-2 rounded-xl bg-zinc-900 border border-zinc-850 text-indigo-400 transition-colors group-hover:border-zinc-700/60`}>
                            <ToolIcon className="h-4.5 w-4.5 text-zinc-300 group-hover:text-indigo-400 transition-colors" />
                          </div>
                          <span className="text-[9px] font-bold uppercase font-mono tracking-wider text-zinc-500 px-2 py-0.5 rounded bg-zinc-900/60 border border-zinc-850">
                            {tool.category}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">
                            {isRTL && tool.name_fa ? tool.name_fa : tool.name}
                          </h4>
                          <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
                            {isRTL && tool.description_fa ? tool.description_fa : tool.description}
                          </p>
                        </div>
                      </div>

                      {/* Card commands tags */}
                      <div className="flex flex-wrap gap-1.5 mt-4 border-t border-zinc-900/40 pt-3">
                        {tool.commands.slice(0, 2).map((cmd) => (
                          <span
                            key={cmd}
                            className="text-[9px] text-zinc-500 bg-zinc-950 border border-zinc-900/80 px-1.5 py-0.5 rounded font-mono"
                          >
                            {cmd}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          </div>
        ) : (
          /* ==========================================
             B. ACTIVE TOOL WINDOW VIEW (LOADED IN CARD)
             ========================================== */
          <div className="space-y-4">
            {/* Tool top header control bar */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseTool}
                  className="p-1.5 border border-zinc-850 bg-zinc-900/60 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
                </button>
                <div>
                  <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-1.5">
                    {isRTL && activeTool?.name_fa ? activeTool?.name_fa : activeTool?.name}
                  </h2>
                  <p className="text-xs text-zinc-500 leading-snug">
                    {isRTL && activeTool?.description_fa ? activeTool?.description_fa : activeTool?.description}
                  </p>
                </div>
              </div>

              {/* Action tags */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-2 py-1 rounded-md border border-zinc-850 capitalize font-bold">
                  {activeTool?.category} Category
                </span>
                <button
                  onClick={() => setCommandCenterOpen(true)}
                  className="p-1.5 border border-zinc-850 hover:border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white rounded-lg transition-colors"
                  title="Search CMD+K"
                >
                  <Command className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CORE TOOL CONTAINER */}
            <div className="bg-zinc-900/30 border border-zinc-850/60 p-6 md:p-8 rounded-3xl min-h-[420px] flex flex-col justify-start relative overflow-hidden shadow-2xl backdrop-blur-md">
              {renderToolComponent(activeToolId)}
            </div>
          </div>
        )}
      </main>

      {/* 3. COMMAND CENTER DIALOG MODAL (CMD + K) */}
      <CommandCenter
        isOpen={commandCenterOpen}
        onClose={() => setCommandCenterOpen(false)}
        onSelectTool={handleSelectTool}
        language={language}
      />

      {/* 4. PREMIUM SETTINGS PANEL MODAL */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="w-full max-w-md bg-zinc-900/95 border border-zinc-800 rounded-3xl p-6 relative shadow-2xl text-left"
            dir="ltr" // Settings uses simple universal ltr for clarity
            onClick={(e) => e.stopPropagation()}
          >
            {/* Settings Header */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-zinc-100">VIZ Calibration</h3>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Customizer fields */}
            <div className="space-y-4">
              {/* Language toggle option */}
              <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                <div>
                  <span className="text-xs font-bold text-zinc-300 uppercase block">Local Language</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">Toggle Persian/English translation</span>
                </div>
                <div className="flex gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded ${language === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('fa')}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded ${language === 'fa' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Farsi
                  </button>
                </div>
              </div>

              {/* Accent Color Selection */}
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 space-y-2">
                <div>
                  <span className="text-xs font-bold text-zinc-300 uppercase block">Accent Theme</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">Choose dynamic UI accent color</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  {(['indigo', 'emerald', 'rose', 'amber', 'purple'] as const).map((col) => {
                    const bgColors: Record<string, string> = {
                      indigo: 'bg-indigo-500',
                      emerald: 'bg-emerald-500',
                      rose: 'bg-rose-500',
                      amber: 'bg-amber-500',
                      purple: 'bg-purple-500'
                    };
                    return (
                      <button
                        key={col}
                        onClick={() => setAccent(col)}
                        className={`w-7 h-7 rounded-full ${bgColors[col]} border-2 transition-all flex items-center justify-center cursor-pointer ${
                          accent === col ? 'border-white scale-110 shadow-lg' : 'border-zinc-900 hover:scale-105'
                        }`}
                        title={col}
                      >
                        {accent === col && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shortuct references */}
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-850 font-mono text-[10px] text-zinc-500 space-y-2">
                <span className="block text-zinc-400 font-bold uppercase">Mission Shortcuts</span>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span>Open CommandCenter:</span>
                  <span>Cmd/Ctrl + K</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span>Return Home / Close Panel:</span>
                  <span>ESC</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Framework:</span>
                  <span>TypeScript 5.8 & React 19</span>
                </div>
              </div>

              {/* STUNNING STANDALONE OFFLINE FILE DOWNLOAD SECTION */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-zinc-950 via-zinc-950 to-indigo-950/20 relative overflow-hidden group space-y-3.5 shadow-2xl">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 mt-0.5 shadow-inner">
                    <Download className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-indigo-300 uppercase block tracking-wider font-mono">
                      {language === 'en' ? 'Standalone Offline Application' : 'دانلود تک‌فایل آفلاین گوشی'}
                    </span>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      {language === 'en'
                        ? 'Download this entire 50+ tool dashboard as a single HTML file. Open it directly on your Android/iOS phone browser to use completely offline with maximum speed!'
                        : 'کل این مجموعه ابزار را به صورت یک فایل تکی HTML دانلود کنید. می‌توانید آن را روی گوشی اندروید یا آیفون خود بریزید و بدون اینترنت، مستقیماً در مرورگر با سرعت فوق‌العاده بالا اجرا کنید!'}
                    </p>
                  </div>
                </div>
                
                <a
                  href="/api/download"
                  download="viz_toolbox.html"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/30 border border-indigo-500 hover:shadow-indigo-500/30 cursor-pointer text-center select-none"
                >
                  <Download className="h-3.5 w-3.5 animate-bounce" />
                  <span>{language === 'en' ? 'GET STANDALONE FILE (.HTML)' : 'دانلود مستقیم فایل HTML'}</span>
                </a>
              </div>
            </div>

            {/* Calibration Footer info */}
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-5 border-t border-zinc-850 pt-3">
              <span>VIZ SYSTEM STABLE</span>
              <span>100% OFFLINE-READY</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. MINIMALIST FOOTER */}
      <footer className="py-6 border-t border-zinc-900 text-center font-mono text-xs text-zinc-600 bg-zinc-950/20">
        <p>© 2026 VIZ Super App. Crafted with full-stack modular performance.</p>
      </footer>
    </div>
  );
}

// Simple Arrow / Chevron replacement helpers for flawless rendering
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}
