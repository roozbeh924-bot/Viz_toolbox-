import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, Languages, Heart, Search, RefreshCw, AlertCircle, Copy, Check, 
  Sparkles, BookOpen, Flame, Scale, HelpCircle, ArrowLeftRight, Globe, Utensils,
  Play, Pause, Volume2, Download, Disc, Layers, Link, CheckCircle2, Radio, Signal, Headphones
} from 'lucide-react';

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

const getApiUrl = (endpoint: string) => {
  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'file:' || !window.location.host) {
      return `https://ais-pre-ymutsll6q2vrnj2a4dzbw-146610196223.europe-west1.run.app${endpoint}`;
    }
  }
  return endpoint;
};

// ============================================================================
// 1. SMART AI SONG FINDER
// ============================================================================
export function SongFinderTool({ prefilledInput = '', language }: ToolProps) {
  const [query, setQuery] = useState(prefilledInput);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const { copied, copy } = useCopy();

  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentTrack(null);
    try {
      const response = await fetch(getApiUrl('/api/song-finder'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        throw new Error(language === 'en' ? 'Failed to identify song' : 'یافتن آهنگ با خطا مواجه شد');
      }
      const data = await response.json();
      setResult(data);

      // Auto-load first playable track if exists
      if (data.tracks && data.tracks.length > 0) {
        setCurrentTrack(data.tracks[0]);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prefilledInput) {
      setQuery(prefilledInput);
    }
  }, [prefilledInput]);

  // Audio element event hooks
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback blocked or failed:", err);
      });
    }
  };

  const handleTrackSelect = (track: any) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentTrack(track);
    setIsPlaying(false);
    setCurrentTime(0);
    
    // Auto-play the newly selected track
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(e => console.warn(e));
      }
    }, 100);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isRTL = language === 'fa';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Invisible HTML5 Audio Node */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.previewUrl}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onAudioEnded}
        />
      )}

      <div className="text-center space-y-1.5">
        <h3 className="text-lg font-bold text-zinc-100 flex items-center justify-center gap-2">
          <Music className="h-5 w-5 text-indigo-400 animate-pulse" />
          {isRTL ? 'موتور قدرتمند جستجو و یابنده هوشمند موزیک' : 'Advanced Federated Music Portal'}
        </h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
          {isRTL 
            ? 'متن ترانه (فارسی، انگلیسی یا فینگلیش)، نام خواننده، سبک یا داستان موزیک را بنویسید تا آن را در ۸ پایگاه بزرگ پیدا کنیم!' 
            : 'Search lyrics (English, Persian, Fingilish), hum, or story. Querying 8 global APIs simultaneously!'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isRTL ? "مثال: این همون آهنگ شادمهر عقیلیه که میگه بارون بارید..." : "e.g. Mohsen Yeganeh Behet Ghol Midam..."}
          className="flex-1 bg-zinc-950 border border-zinc-850 focus:border-indigo-500/50 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-100 focus:outline-none transition-colors shadow-inner"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>{isRTL ? 'در حال جستجو...' : 'Searching...'}</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>{isRTL ? 'جستجوی سراسری' : 'Global Scan'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="bg-zinc-950/50 border border-zinc-900/80 rounded-2xl p-8 text-center space-y-4">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-medium">
            {isRTL ? 'در حال برقراری ارتباط موازی با ۸ هاب بزرگ موسیقی...' : 'Establishing parallel pipelines to 8 global music portals...'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-zinc-500 font-mono italic max-w-md mx-auto pt-2 border-t border-zinc-900">
            <div>● Google Gemini AI</div>
            <div>● Apple iTunes</div>
            <div>● Deezer Core</div>
            <div>● Jamendo Open</div>
            <div>● Internet Archive</div>
            <div>● Last.fm Index</div>
            <div>● MusicBrainz Database</div>
            <div>● Persian Cloud</div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6 transition-all duration-300">
          {result.found ? (
            <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-6 space-y-6">
              
              {/* FEDERATED APIS HEALTH PANEL */}
              <div className="bg-zinc-900/30 border border-zinc-900 p-3.5 rounded-xl">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2 text-center">
                  {isRTL ? 'وضعیت اتصال پایگاه‌های داده موسیقی (۸ منبع همزمان)' : 'FEDERATED MULTI-API SCAN STATUS (8 ACTIVE OUTLETS)'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { key: 'gemini', label: 'Gemini Brain' },
                    { key: 'itunes', label: 'Apple iTunes' },
                    { key: 'deezer', label: 'Deezer Core' },
                    { key: 'jamendo', label: 'Jamendo Indie' },
                    { key: 'archive', label: 'Archive.org' },
                    { key: 'lastfm', label: 'Last.fm Hub' },
                    { key: 'musicbrainz', label: 'MusicBrainz' },
                    { key: 'persian_cloud', label: 'Persian Cloud' }
                  ].map((api) => {
                    const isConnected = result.activeApis?.[api.key];
                    return (
                      <div key={api.key} className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-900 px-2 py-1 rounded-lg">
                        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse' : 'bg-zinc-700'}`} />
                        <span className="text-[9px] font-mono text-zinc-400 truncate">{api.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACTIVE STREAM PLAYER COMPONENT */}
              {currentTrack && (
                <div className="bg-gradient-to-r from-indigo-950/40 to-zinc-900/60 border border-indigo-900/40 p-5 rounded-2xl space-y-4 overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className="relative group shrink-0">
                      <img 
                        src={currentTrack.artworkUrl} 
                        alt="cover" 
                        referrerPolicy="no-referrer"
                        className={`w-16 h-16 rounded-xl object-cover border border-zinc-800 shadow-md ${isPlaying ? 'animate-spin-slow' : ''}`} 
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                        <Headphones className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-indigo-900/70 border border-indigo-800/80 text-[8px] font-bold text-indigo-300 px-1.5 py-0.5 rounded uppercase tracking-wide">
                          {currentTrack.source}
                        </span>
                        <span className="bg-zinc-800 text-[8px] font-bold text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                          {currentTrack.quality} HQ
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white truncate mt-1">
                        {currentTrack.title}
                      </h4>
                      <p className="text-xs font-semibold text-zinc-400 truncate">
                        {currentTrack.artist}
                      </p>
                    </div>

                    {/* LIVE DYNAMIC AUDIO EQUALIZER */}
                    {isPlaying && (
                      <div className="flex items-end gap-0.5 h-6 shrink-0">
                        <span className="w-0.5 bg-indigo-500 animate-[bounce_0.8s_infinite]" style={{ height: '30%', animationDelay: '0.1s' }} />
                        <span className="w-0.5 bg-indigo-400 animate-[bounce_0.8s_infinite]" style={{ height: '70%', animationDelay: '0.3s' }} />
                        <span className="w-0.5 bg-indigo-500 animate-[bounce_0.8s_infinite]" style={{ height: '40%', animationDelay: '0.5s' }} />
                        <span className="w-0.5 bg-indigo-300 animate-[bounce_0.8s_infinite]" style={{ height: '90%', animationDelay: '0.2s' }} />
                        <span className="w-0.5 bg-indigo-400 animate-[bounce_0.8s_infinite]" style={{ height: '60%', animationDelay: '0.4s' }} />
                      </div>
                    )}
                  </div>

                  {/* Seek bar */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-zinc-500">{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeekChange}
                        className="flex-1 accent-indigo-500 bg-zinc-900 h-1.5 rounded-lg cursor-pointer focus:outline-none"
                      />
                      <span className="text-[10px] font-mono text-zinc-500">{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Player Controls Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-900">
                    <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePlayPause}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shrink-0"
                        >
                          {isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white" />}
                        </button>

                        {/* Volume slider */}
                        <div className="flex items-center gap-1.5 ml-1">
                          <Volume2 className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-16 h-1 accent-indigo-500 bg-zinc-900 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Simple mobile duration display */}
                      <span className="sm:hidden text-[10px] font-mono text-zinc-500">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    {/* Highly prominent download option */}
                    <a
                      href={currentTrack.downloadUrl}
                      download={`${currentTrack.title}.mp3`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-900/30 shrink-0"
                    >
                      <Download className="h-4 w-4 text-white" />
                      <span>{isRTL ? 'دانلود مستقیم این آهنگ' : 'Download This MP3'}</span>
                    </a>
                  </div>
                </div>
              )}

              {/* FEDERATED SEARCH RESULTS INDEX */}
              {result.tracks && result.tracks.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    {isRTL ? 'لیست تمام فایل‌های یافت شده در پایگاه‌های داده (کلیک برای پخش / دانلود)' : 'RESOLVED RELEASES FOUND (CLICK TO PLAY / DOWNLOAD)'}
                  </span>
                  <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                    {result.tracks.map((track: any) => {
                      const isCurrent = currentTrack?.id === track.id;
                      return (
                        <div
                          key={track.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${isCurrent ? 'bg-indigo-950/20 border-indigo-500/40' : 'bg-zinc-950 border-zinc-900/60 hover:bg-zinc-900/40 hover:border-zinc-800'}`}
                        >
                          <div 
                            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                            onClick={() => handleTrackSelect(track)}
                          >
                            <img src={track.artworkUrl} alt="" className="w-9 h-9 rounded-lg object-cover border border-zinc-900 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-zinc-100 truncate">{track.title}</div>
                              <div className="text-[10px] text-zinc-500 truncate">{track.artist}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="hidden xs:inline-block text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded-lg">
                              {track.source}
                            </span>
                            
                            {/* Individual Play/Pause Toggle */}
                            <button
                              onClick={() => handleTrackSelect(track)}
                              className="p-1.5 hover:bg-zinc-900 rounded text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer"
                              title={isRTL ? 'پخش' : 'Play'}
                            >
                              {isCurrent && isPlaying ? (
                                <Pause className="h-4 w-4 text-indigo-400" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </button>

                            {/* Direct Download Button for this file */}
                            <a
                              href={track.downloadUrl}
                              download={`${track.title}.mp3`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 hover:bg-zinc-900 rounded text-zinc-400 hover:text-indigo-400 transition-colors flex items-center justify-center cursor-pointer"
                              title={isRTL ? 'دانلود مستقیم' : 'Download'}
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Header Info with complete word-wrap protection */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-4">
                <div className="space-y-1 min-w-0 w-full sm:w-auto">
                  <h4 className="text-lg sm:text-xl font-bold text-white font-mono break-words leading-tight">
                    {isRTL && result.songTitleFa ? result.songTitleFa : result.songTitle}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-indigo-400 font-mono break-words">
                    {isRTL && result.artistNameFa ? result.artistNameFa : result.artistName}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0 w-full sm:w-auto">
                  <span className="inline-block bg-zinc-900 border border-zinc-850 text-zinc-400 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                    {result.genre || 'Music'}
                  </span>
                  <div className="text-[10px] text-zinc-500 mt-1.5 font-mono">
                    {result.releaseYear && `${result.releaseYear} • `} {result.album || ''}
                  </div>
                </div>
              </div>

              {/* Famous lyrics with overflow protection */}
              {result.famousLyrics && (
                <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl space-y-2 overflow-hidden">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    {isRTL ? 'متن معروف یا همخوانی (Chorus)' : 'Famous Lyrics / Chorus'}
                  </span>
                  <p className="text-sm text-zinc-200 italic leading-relaxed whitespace-pre-line font-serif break-words">
                    {result.famousLyrics}
                  </p>
                  {result.famousLyricsTranslation && (
                    <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-850/50 pt-2 mt-2 break-words">
                      <span className="font-semibold text-indigo-400/80 block mb-1">{isRTL ? 'ترجمه و مفهوم فارسی:' : 'Persian Meaning:'}</span>
                      {result.famousLyricsTranslation}
                    </p>
                  )}
                </div>
              )}

              {/* Story / Facts */}
              {result.songStoryOrFacts && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    {isRTL ? 'داستان و دانستنی جالب آهنگ' : 'Song Facts & Backstory'}
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-indigo-950/10 border border-indigo-950/30 p-4 rounded-xl">
                    {result.songStoryOrFacts}
                  </p>
                </div>
              )}

              {/* Similar Songs */}
              {result.similarSongs && result.similarSongs.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    {isRTL ? 'آهنگ‌های پیشنهادی مشابه' : 'Recommended Similar Tracks'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {result.similarSongs.map((song: any, i: number) => (
                      <div key={i} className="bg-zinc-900/30 border border-zinc-900 p-3 rounded-xl text-center space-y-1 hover:border-zinc-800 transition-colors">
                        <div className="font-bold text-xs text-zinc-200 truncate">
                          {isRTL && song.titleFa ? song.titleFa : song.title}
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate">
                          {isRTL && song.artistFa ? song.artistFa : song.artist}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alternatives */}
              {result.alternatives && result.alternatives.length > 0 && (
                <div className="text-[10px] text-zinc-500 flex flex-wrap items-center gap-1.5 border-t border-zinc-900/80 pt-4">
                  <span className="font-bold">{isRTL ? 'گمانه‌زنی‌های دیگر:' : 'Other possible matches:'}</span>
                  {result.alternatives.map((alt: string, idx: number) => (
                    <span key={idx} className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850 font-mono">
                      {alt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-6 text-center space-y-3">
              <HelpCircle className="h-10 w-10 text-amber-500 mx-auto" />
              <h4 className="text-sm font-bold text-zinc-200">
                {isRTL ? 'آهنگی با این مشخصات پیدا نشد' : 'No Match Found'}
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                {isRTL 
                  ? 'جزئیات بیشتری اضافه کنید (مثلاً نام خواننده، سال تقریبی انتشار، یا بخش دیگری از متن) و دوباره امتحان کنید.'
                  : 'Try adding more details like the singer, release era, or additional lyrics and search again.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. AI ADVANCED TRANSLATOR & DICTIONARY
// ============================================================================
export function AiTranslatorTool({ prefilledInput = '', language }: ToolProps) {
  const [text, setText] = useState(prefilledInput);
  const [fromLang, setFromLang] = useState('auto');
  const [toLang, setToLang] = useState('Persian');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const { copied, copy } = useCopy();

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl('/api/translate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, from: fromLang, to: toLang }),
      });
      if (!response.ok) {
        throw new Error(language === 'en' ? 'Translation failed' : 'ترجمه با خطا مواجه شد');
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    if (fromLang === 'Persian' || fromLang === 'fa') {
      setFromLang('English');
      setToLang('Persian');
    } else {
      setFromLang('Persian');
      setToLang('English');
    }
  };

  useEffect(() => {
    if (prefilledInput) {
      setText(prefilledInput);
    }
  }, [prefilledInput]);

  const isRTL = language === 'fa';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center space-y-1.5">
        <h3 className="text-lg font-bold text-zinc-100 flex items-center justify-center gap-2">
          <Languages className="h-5 w-5 text-indigo-400" />
          {isRTL ? 'مترجم و لغت‌نامه هوشمند هوش مصنوعی' : 'AI Advanced Translator & Dictionary'}
        </h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
          {isRTL 
            ? 'ترجمه فوق‌العاده روان و تحلیل واژگان همراه با اصطلاحات و تلفظ صوتی-متنی' 
            : 'Super-accurate translation with pronunciation, slang notes, and synonyms.'}
        </p>
      </div>

      {/* Control row */}
      <div className="flex items-center justify-between bg-zinc-950 p-2 rounded-xl border border-zinc-850 text-xs font-semibold text-zinc-300">
        <select 
          value={fromLang} 
          onChange={(e) => setFromLang(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg focus:outline-none text-zinc-200"
        >
          <option value="auto">{isRTL ? 'تشخیص خودکار زبان' : 'Detect Language'}</option>
          <option value="Persian">{isRTL ? 'فارسی' : 'Persian'}</option>
          <option value="English">{isRTL ? 'انگلیسی' : 'English'}</option>
        </select>

        <button 
          onClick={handleSwap}
          className="p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>

        <select 
          value={toLang} 
          onChange={(e) => setToLang(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg focus:outline-none text-zinc-200"
        >
          <option value="Persian">{isRTL ? 'فارسی' : 'Persian'}</option>
          <option value="English">{isRTL ? 'انگلیسی' : 'English'}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input box */}
        <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={isRTL ? "متن خود را برای ترجمه یا تعریف لغت بنویسید..." : "Type text to translate or define..."}
            rows={5}
            className="w-full bg-transparent border-0 resize-none text-sm text-zinc-100 focus:outline-none focus:ring-0 leading-relaxed placeholder:text-zinc-600 font-semibold"
          />
          <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
            <span className="text-[10px] text-zinc-500 font-mono">
              {text.length} chars
            </span>
            <button
              onClick={handleTranslate}
              disabled={loading || !text.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {isRTL ? 'ترجمه هوشمند' : 'Translate'}
            </button>
          </div>
        </div>

        {/* Output box */}
        <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-4 flex flex-col justify-between min-h-[160px] relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/85 rounded-2xl space-y-2">
              <RefreshCw className="h-6 w-6 text-indigo-500 animate-spin" />
              <span className="text-[10px] text-zinc-400">{isRTL ? 'در حال ترجمه تخصصی با هوش مصنوعی...' : 'AI translating...'}</span>
            </div>
          ) : null}

          {result ? (
            <div className="space-y-4">
              {/* Translation Text */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                  {isRTL ? 'ترجمه هسته' : 'Core Translation'}
                </span>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  {result.translatedText}
                </p>
              </div>

              {/* Pronunciation & Part of speech */}
              {(result.pronunciation || result.partOfSpeech) && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.pronunciation && (
                    <span className="bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-indigo-400 px-2 py-0.5 rounded font-mono">
                      🗣️ {result.pronunciation}
                    </span>
                  )}
                  {result.partOfSpeech && (
                    <span className="bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 px-2 py-0.5 rounded">
                      {result.partOfSpeech}
                    </span>
                  )}
                </div>
              )}

              {/* Synonyms */}
              {result.synonyms && result.synonyms.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                    {isRTL ? 'مترادف‌ها و هم‌معنی‌ها' : 'Synonyms / Equivalents'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.synonyms.map((syn: string, i: number) => (
                      <span key={i} className="bg-zinc-900/60 text-[10px] text-zinc-300 px-2 py-0.5 rounded border border-zinc-900">
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cultural notes */}
              {result.culturalNotes && (
                <div className="bg-indigo-950/10 border border-indigo-950/30 p-3 rounded-xl">
                  <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    {isRTL ? 'نکات عامیانه و فرهنگی' : 'Nuances & Slang Info'}
                  </span>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    {result.culturalNotes}
                  </p>
                </div>
              )}

              {/* Examples */}
              {result.examples && result.examples.length > 0 && (
                <div className="space-y-2 border-t border-zinc-900 pt-3 mt-2">
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                    {isRTL ? 'مثال‌های کاربردی' : 'Practical Examples'}
                  </span>
                  <div className="space-y-2">
                    {result.examples.map((ex: any, i: number) => (
                      <div key={i} className="bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900 space-y-1">
                        <p className="text-xs text-zinc-200 font-mono italic">{ex.original}</p>
                        <p className="text-[11px] text-zinc-400">{ex.translated}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <BookOpen className="h-8 w-8 text-zinc-700 mb-2" />
              <p className="text-xs">{isRTL ? 'نتایج ترجمه تخصصی، اصطلاحات و گرامر در این بخش نمایش داده می‌شوند.' : 'Translation results, slang, and dictionary insights will appear here.'}</p>
            </div>
          )}

          {result && (
            <div className="flex justify-end pt-2 border-t border-zinc-900 mt-4">
              <button
                onClick={() => copy(result.translatedText)}
                className="text-zinc-500 hover:text-zinc-300 text-[10px] flex items-center gap-1 hover:bg-zinc-900 px-2 py-1 rounded"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                {copied ? (isRTL ? 'کپی شد!' : 'Copied!') : (isRTL ? 'کپی ترجمه' : 'Copy translation')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. AI CALORIE & MEAL DIETITIAN
// ============================================================================
export function CalorieAdvisorTool({ language }: ToolProps) {
  const [mealDescription, setMealDescription] = useState('');
  const [userContext, setUserContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const handleAnalyze = async () => {
    if (!mealDescription.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getApiUrl('/api/calorie-advisor'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealDescription, userContext }),
      });
      if (!response.ok) {
        throw new Error(language === 'en' ? 'Failed to analyze diet' : 'آنالیز غذا با خطا مواجه شد');
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isRTL = language === 'fa';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-1.5">
        <h3 className="text-lg font-bold text-zinc-100 flex items-center justify-center gap-2">
          <Heart className="h-5 w-5 text-indigo-400" />
          {isRTL ? 'آنالیزور هوشمند غذا و کالری‌شمار' : 'AI Calorie & Meal Dietitian'}
        </h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
          {isRTL 
            ? 'تخمین میزان دقیق کالری، درشت مغذی‌ها، مزایا، معایب و تمرینات ورزشی برای سوزاندن آن با تخصص در غذاهای ایرانی!' 
            : 'Estimate calories, macros, and get customized burning workouts. Perfect for local and international dishes!'}
        </p>
      </div>

      <div className="space-y-4">
        {/* Input box */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
            {isRTL ? 'چه غذایی میل کردید؟ با جزئیات بنویسید:' : 'What did you eat? Describe your portion:'}
          </label>
          <textarea
            value={mealDescription}
            onChange={(e) => setMealDescription(e.target.value)}
            placeholder={isRTL ? "مثال: یک بشقاب باقالی پلو با گوشت بره و دو قاشق ماست و یک لیوان دوغ..." : "e.g., A plate of spaghetti carbonara and a small side salad..."}
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-850 focus:border-indigo-500/50 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-100 focus:outline-none transition-colors shadow-inner"
          />
        </div>

        {/* Advanced metadata context */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
            {isRTL ? 'هدف ورزشی یا قد و وزن شما (اختیاری):' : 'Your fitness goals or height/weight (Optional):'}
          </label>
          <input
            type="text"
            value={userContext}
            onChange={(e) => setUserContext(e.target.value)}
            placeholder={isRTL ? "مثال: وزن ۸۰ کیلوگرم، رژیم کتوژنیک برای لاغری دارم" : "e.g., Weight 80kg, trying to stay on low-carb diet"}
            className="w-full bg-zinc-950 border border-zinc-850 focus:border-indigo-500/50 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-100 focus:outline-none transition-colors shadow-inner"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !mealDescription.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>{isRTL ? 'در حال آنالیز تغذیه...' : 'Analyzing Diet...'}</span>
            </>
          ) : (
            <>
              <Flame className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>{isRTL ? 'آنالیز کالری و تناسب اندام' : 'Analyze Meal & Calories'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="bg-zinc-950/50 border border-zinc-900/80 rounded-2xl p-8 text-center space-y-3">
          <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-medium">
            {isRTL ? 'هوش مصنوعی در حال محاسبه درشت‌مغذی‌ها و جدول سلامت غذاست...' : 'AI is calculating nutritional values and dietitian scores...'}
          </p>
        </div>
      )}

      {result && !loading && (
        <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-6 space-y-6">
          {/* Header summary */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-zinc-900 pb-4 gap-4">
            <div className="text-center sm:text-left space-y-1">
              <span className="bg-indigo-950 border border-indigo-900 text-indigo-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                {isRTL ? 'غذای تشخیص داده شده' : 'Identified Meal'}
              </span>
              <h4 className="text-xl font-extrabold text-white">
                {result.mealName}
              </h4>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center bg-zinc-900/50 border border-zinc-850 p-3 rounded-2xl min-w-[100px] shadow-sm">
                <span className="text-2xl font-black text-amber-500 font-mono block">
                  {result.calories}
                </span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                  {isRTL ? 'کالری تقریبی' : 'Calories (Kcal)'}
                </span>
              </div>
              <div className="text-center bg-zinc-900/50 border border-zinc-850 p-3 rounded-2xl min-w-[100px] shadow-sm">
                <span className="text-2xl font-black text-indigo-400 font-mono block">
                  {result.healthRating}
                </span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">
                  {isRTL ? 'رتبه سلامت' : 'Health Score'}
                </span>
              </div>
            </div>
          </div>

          {/* Macro Nutrient Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-900/30 border border-zinc-900 p-3 rounded-xl text-center">
              <span className="text-xs text-zinc-500 block">{isRTL ? 'پروتئین' : 'Protein'}</span>
              <span className="font-extrabold text-sm text-zinc-200 font-mono">{result.protein}g</span>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-900 p-3 rounded-xl text-center">
              <span className="text-xs text-zinc-500 block">{isRTL ? 'کربوهیدرات' : 'Carbs'}</span>
              <span className="font-extrabold text-sm text-zinc-200 font-mono">{result.carbs}g</span>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-900 p-3 rounded-xl text-center">
              <span className="text-xs text-zinc-500 block">{isRTL ? 'چربی' : 'Fat'}</span>
              <span className="font-extrabold text-sm text-zinc-200 font-mono">{result.fat}g</span>
            </div>
          </div>

          {/* Detailed insights */}
          {result.nutritionalBreakdownFa && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                {isRTL ? 'تحلیل تخصصی تغذیه' : 'Dietitian Breakdown'}
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded-xl border border-zinc-900">
                {result.nutritionalBreakdownFa}
              </p>
            </div>
          )}

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.prosFa && (
              <div className="bg-emerald-950/5 border border-emerald-950/20 p-4 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  🟢 {isRTL ? 'نکات مثبت و مزایا' : 'Healthy Pros'}
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {result.prosFa}
                </p>
              </div>
            )}
            {result.consFa && (
              <div className="bg-rose-950/5 border border-rose-950/20 p-4 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  🔴 {isRTL ? 'نکات منفی و هشدارها' : 'Dietary Cons & Alerts'}
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {result.consFa}
                </p>
              </div>
            )}
          </div>

          {/* Healthier tips */}
          {result.healthierTipsFa && (
            <div className="bg-indigo-950/5 border border-indigo-950/20 p-4 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                💡 {isRTL ? 'توصیه‌های سالم‌سازی وعده' : 'How to Make It Healthier'}
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {result.healthierTipsFa}
              </p>
            </div>
          )}

          {/* Burn-off exercise */}
          {result.burnOffExerciseFa && (
            <div className="bg-amber-950/10 border border-amber-950/25 p-4 rounded-xl flex items-center gap-3">
              <Flame className="h-8 w-8 text-amber-500 animate-pulse shrink-0" />
              <div>
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                  {isRTL ? 'نحوه سوزاندن این کالری' : 'Recommended Burn-off Exercise'}
                </span>
                <p className="text-xs font-semibold text-zinc-200 leading-normal">
                  {result.burnOffExerciseFa}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
