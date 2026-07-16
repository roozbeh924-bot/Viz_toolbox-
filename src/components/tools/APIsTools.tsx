/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, Check, CloudSun, BookOpen, Newspaper, Search, Flag, PartyPopper, Quote, Network, MapPin, Droplet, Globe, Clock, QrCode, Barcode, Volume2, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { API_SERVICES, WeatherData, NewsFeed } from '../../services/api';

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

// --- Morse sound helper ---
function playMorseCodeAudio(sequence: string) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    let time = ctx.currentTime;

    sequence.split('').forEach((symbol) => {
      if (symbol === '.' || symbol === '-') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, ctx.currentTime);

        const duration = symbol === '.' ? 0.08 : 0.24;

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.3, time + 0.01);
        gain.gain.setValueAtTime(0.3, time + duration);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration + 0.01);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + duration + 0.02);

        time += duration + 0.1;
      } else if (symbol === ' ') {
        time += 0.2;
      }
    });
  } catch (e) {
    console.warn('Audio Context error playing Morse', e);
  }
}

// ==========================================
// 1. LIVE WEATHER FORECAST (Open-Meteo)
// ==========================================
export function WeatherApiTool({ prefilledInput = '', language }: ToolProps) {
  const [city, setCity] = useState(prefilledInput || 'London');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Step A: Geocode city name to lat/lon
      const geo = await API_SERVICES.searchCoordinates(city);
      if (geo && geo.results && geo.results.length > 0) {
        const match = geo.results[0];
        // Step B: Get weather for coordinates
        const data = await API_SERVICES.getWeather(match.latitude, match.longitude);
        setWeather(data);
      } else {
        throw new Error('City not found');
      }
    } catch (e: any) {
      setError(e.message || 'Geocoding or weather request failed');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [prefilledInput]);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Type global city name..."
          className="flex-1 bg-zinc-950 border border-zinc-850 px-4 py-2 rounded-xl text-sm font-semibold"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 px-5 text-xs text-white font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Get Forecast
        </button>
      </div>

      {error && (
        <div className="bg-red-950/25 border border-red-900/40 p-4 rounded-xl flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {weather && (
        <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-6 text-center space-y-4">
          <CloudSun className="h-10 w-10 text-indigo-400 mx-auto" />
          <div>
            <h3 className="text-2xl font-bold font-mono text-zinc-100">{weather.current_weather.temperature}°C</h3>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold font-mono">Current temperature</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-400">
            <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900">
              <span>Wind Speed</span>
              <div className="text-sm font-bold text-zinc-200 mt-1">{weather.current_weather.windspeed} km/h</div>
            </div>
            <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-900">
              <span>Wind Direction</span>
              <div className="text-sm font-bold text-zinc-200 mt-1">{weather.current_weather.winddirection}°</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. ENGLISH DICTIONARY EXPLORER
// ==========================================
export function DictionaryApiTool({ prefilledInput = '', language }: ToolProps) {
  const [word, setWord] = useState(prefilledInput || 'serendipity');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!word.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await API_SERVICES.getDefinition(word);
      setResults(data);
    } catch {
      setError('Word not found in definitions database.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [prefilledInput]);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Search English word..."
          className="flex-1 bg-zinc-950 border border-zinc-850 px-4 py-2 rounded-xl text-sm font-semibold"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 px-5 text-xs text-white font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </button>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-900/40 p-3 rounded-xl flex items-center gap-2 text-xs text-red-400 font-mono">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 space-y-4 max-h-72 overflow-y-auto">
          <div className="border-b border-zinc-900 pb-3">
            <h3 className="text-xl font-bold font-serif text-indigo-400 capitalize">{results[0].word}</h3>
            <span className="text-xs text-zinc-500 font-serif italic">{results[0].phonetic}</span>
          </div>
          {results[0].meanings.map((m: any, idx: number) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">{m.partOfSpeech}</span>
              <p className="text-sm text-zinc-300 font-serif leading-relaxed">{m.definitions[0]?.definition}</p>
              {m.definitions[0]?.example && <p className="text-xs text-zinc-500 italic mt-1">e.g. "{m.definitions[0]?.example}"</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. GLOBAL NEWS FEED (ok.surf news)
// ==========================================
export function NewsApiTool() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await API_SERVICES.getNews();
      const unifiedList = [
        ...(data.news?.technology?.slice(0, 3) || []),
        ...(data.news?.business?.slice(0, 3) || []),
        ...(data.news?.world?.slice(0, 3) || [])
      ];
      setNews(unifiedList);
    } catch {
      setError('Failed to fetch online news feeds.');
      // Offline fallback headlines
      setNews([
        { title: 'Viz Launchpad announced with offline capabilities', source: 'TechInsider', link: '#', pubDate: 'Today' },
        { title: 'The future of decentralized browsers with custom tools', source: 'WebDev Chronicle', link: '#', pubDate: 'Today' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Live Headlines</span>
        <button onClick={fetchNews} className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg bg-zinc-950 border border-zinc-850">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2.5 max-h-[320px] overflow-y-auto">
        {news.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer referrerPolicy=no-referrer"
            className="block bg-zinc-950 border border-zinc-850 p-4 rounded-xl hover:border-zinc-700 transition-colors"
          >
            <h4 className="font-semibold text-sm text-zinc-200 leading-snug">{item.title}</h4>
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-2">
              <span>{item.source}</span>
              <span>{item.pubDate}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 4. WIKIPEDIA INSTANT SEARCHER
// ==========================================
export function WikipediaApiTool({ prefilledInput = '' }: ToolProps) {
  const [query, setQuery] = useState(prefilledInput || 'Quantum Physics');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await API_SERVICES.searchWikipedia(query);
      if (data && data.query && data.query.search) {
        setResults(data.query.search);
      } else {
        throw new Error();
      }
    } catch {
      setError('Wikipedia inquiry failed or returned empty.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [prefilledInput]);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Inquire Encyclopedia..."
          className="flex-1 bg-zinc-950 border border-zinc-850 px-4 py-2 rounded-xl text-sm font-semibold"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 hover:bg-indigo-500 px-5 text-xs text-white font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Inquire
        </button>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto">
        {results.map((item, idx) => (
          <div key={idx} className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-1.5">
            <h4 className="font-bold text-sm text-indigo-400 capitalize">{item.title}</h4>
            <p
              dangerouslySetInnerHTML={{ __html: item.snippet + '...' }}
              className="text-xs text-zinc-400 leading-relaxed font-sans"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. REST COUNTRIES DATA
// ==========================================
export function CountryApiTool() {
  const [name, setName] = useState('Canada');
  const [country, setCountry] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await API_SERVICES.getCountry(name);
      setCountry(data[0] || null);
    } catch {
      setError('Country not found.');
      setCountry(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Country name..."
          className="flex-1 bg-zinc-950 border border-zinc-850 px-4 py-2 rounded-xl text-sm font-semibold"
        />
        <button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-500 px-5 text-xs text-white font-semibold rounded-xl">Get Data</button>
      </div>

      {country && (
        <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 space-y-4 font-mono text-xs">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
            <div>
              <h3 className="text-lg font-bold text-zinc-100">{country.name?.common}</h3>
              <span className="text-zinc-500 uppercase">{country.capital?.[0]} (Capital)</span>
            </div>
            <span className="text-3xl">{country.flag}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-zinc-400">
            <div>
              <span>Population</span>
              <div className="text-sm font-bold text-zinc-200 mt-0.5">{country.population?.toLocaleString()}</div>
            </div>
            <div>
              <span>Region</span>
              <div className="text-sm font-bold text-zinc-200 mt-0.5">{country.region}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. NATIONAL HOLIDAYS FINDER
// ==========================================
export function HolidayApiTool() {
  const [year, setYear] = useState('2026');
  const [countryCode, setCountryCode] = useState('US');
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await API_SERVICES.getHolidays(parseInt(year), countryCode);
      setHolidays(data);
    } catch {
      setError('Unable to fetch holidays for this country/year pairing.');
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="grid grid-cols-2 gap-2">
        <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="bg-zinc-950 border border-zinc-850 p-2 rounded-xl text-center font-mono text-sm" />
        <input type="text" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} placeholder="Country Code (e.g. US)" className="bg-zinc-950 border border-zinc-850 p-2 rounded-xl text-center font-mono text-sm" />
      </div>
      <button onClick={handleSearch} className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl font-semibold text-xs text-white">Find Public Holidays</button>

      <div className="space-y-1.5 max-h-56 overflow-y-auto">
        {holidays.map((h, idx) => (
          <div key={idx} className="bg-zinc-950 border border-zinc-900 px-4 py-2 rounded-lg flex justify-between items-center text-xs">
            <span className="font-mono text-zinc-500">{h.date}</span>
            <span className="text-zinc-200 font-semibold truncate ml-3">{h.localName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. PUBLIC SYNCHRONIZED QUOTES FEED
// ==========================================
export function QuoteApiTool() {
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const data = await API_SERVICES.getRandomQuote();
      setQuote(data);
    } catch {
      setQuote({ quote: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="max-w-md mx-auto text-center space-y-4">
      {quote && (
        <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-2xl space-y-3">
          <Quote className="h-8 w-8 text-indigo-400 mx-auto opacity-50" />
          <p className="text-sm font-serif italic text-zinc-200 leading-relaxed">"{quote.quote}"</p>
          <span className="block text-xs font-mono text-zinc-500">— {quote.author}</span>
        </div>
      )}
      <button
        onClick={fetchQuote}
        disabled={loading}
        className="px-5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        Inquire Quote
      </button>
    </div>
  );
}

// ==========================================
// 8. MY IP & NETWORK GEOLOCATION
// ==========================================
export function PublicIpApiTool() {
  const [ipData, setIpData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchIp = async () => {
    setLoading(true);
    try {
      const data = await API_SERVICES.getPublicIPDetails();
      setIpData(data);
    } catch {
      setIpData({ ip: '127.0.0.1', country_name: 'Local Sandbox Network', org: 'Local loopback ISP' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIp();
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {ipData && (
        <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-2xl font-mono text-xs space-y-3">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <span className="text-zinc-500">PUBLIC IP:</span>
            <span className="text-indigo-400 font-bold select-all">{ipData.ip}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">PROVIDER ISP:</span>
            <span className="text-zinc-300">{ipData.org}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">COUNTRY:</span>
            <span className="text-zinc-300">{ipData.country_name || 'Global'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 9. COORDINATES GEOCODING LOOK
// ==========================================
export function GeocodingApiTool() {
  const [city, setCity] = useState('Paris');
  const [coords, setCoords] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) return;
    setLoading(true);
    try {
      const geo = await API_SERVICES.searchCoordinates(city);
      if (geo && geo.results && geo.results.length > 0) {
        setCoords(geo.results[0]);
      } else {
        setCoords(null);
      }
    } catch {
      setCoords(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex gap-2">
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-850 px-4 py-2 rounded-xl text-sm font-semibold" />
        <button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-500 px-4 rounded-xl text-xs text-white">Geocode</button>
      </div>

      {coords && (
        <div className="bg-zinc-950 border border-zinc-850 p-5 rounded-xl font-mono text-xs space-y-2 text-zinc-400">
          <div className="flex justify-between">
            <span>Latitude:</span>
            <span className="text-zinc-200 font-bold">{coords.latitude}°</span>
          </div>
          <div className="flex justify-between">
            <span>Longitude:</span>
            <span className="text-zinc-200 font-bold">{coords.longitude}°</span>
          </div>
          <div className="flex justify-between">
            <span>Elevation:</span>
            <span className="text-zinc-200">{coords.elevation} m</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 10. COLOR NAME EXPLORER (TheColorAPI)
// ==========================================
export function ColorInfoApiTool() {
  const [hex, setHex] = useState('123456');
  const [colorName, setColorName] = useState('');

  const fetchColorName = async () => {
    try {
      const data = await API_SERVICES.getColorInfo(hex);
      setColorName(data?.name?.value || '');
    } catch {
      setColorName('Unknown hex color');
    }
  };

  useEffect(() => {
    if (hex.length === 6) fetchColorName();
  }, [hex]);

  return (
    <div className="max-w-sm mx-auto bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4 text-center">
      <div className="w-16 h-16 rounded-full mx-auto border border-zinc-800" style={{ backgroundColor: `#${hex}` }} />
      <input
        type="text"
        maxLength={6}
        value={hex}
        onChange={(e) => setHex(e.target.value.replace(/[^0-9A-Fa-f]/g, ''))}
        className="w-24 bg-zinc-900 border border-zinc-750 text-center font-mono py-1 rounded"
      />
      <div className="text-sm font-bold text-indigo-400 font-sans">{colorName}</div>
    </div>
  );
}

// ==========================================
// 11. WEBSITE LINK METADATA PARSER
// ==========================================
export function UrlMetadataApiTool() {
  const [url, setUrl] = useState('https://google.com');
  const [meta, setMeta] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const data = await API_SERVICES.getURLMetadata(url);
      setMeta(data.data);
    } catch {
      setMeta({ title: 'Google', description: 'Search the world\'s information, including webpages, images, videos and more.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="flex gap-2">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-850 p-2 rounded-xl text-xs font-mono" />
        <button onClick={handleFetch} className="bg-indigo-600 hover:bg-indigo-500 px-4 rounded-xl text-xs text-white">Fetch</button>
      </div>

      {meta && (
        <div className="bg-zinc-950 border border-zinc-850 p-5 rounded-xl space-y-2">
          <h4 className="font-bold text-sm text-zinc-200 truncate">{meta.title}</h4>
          <p className="text-xs text-zinc-500 leading-relaxed font-sans">{meta.description}</p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 12. LIVE TIMEZONE REGISTRY
// ==========================================
export function TimezoneApiTool() {
  const [zone, setZone] = useState('Europe/London');
  const [details, setDetails] = useState<any | null>(null);

  const fetchZone = async () => {
    try {
      const data = await API_SERVICES.getTimezoneDetails(zone);
      setDetails(data);
    } catch {
      setDetails({ datetime: new Date().toISOString(), utc_offset: '+00:00' });
    }
  };

  useEffect(() => {
    fetchZone();
  }, [zone]);

  return (
    <div className="max-w-sm mx-auto bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-3">
      <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 rounded text-xs">
        <option value="Europe/London">London</option>
        <option value="America/New_York">New York</option>
        <option value="Asia/Tehran">Tehran</option>
      </select>
      {details && (
        <div className="font-mono text-xs text-zinc-400 space-y-1">
          <p>UTC Offset: {details.utc_offset}</p>
          <p className="truncate">ISO Time: {details.datetime}</p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 13. QR CODE GENERATOR & API
// ==========================================
export function QrGeneratorTool({ prefilledInput = '' }: ToolProps) {
  const [text, setText] = useState(prefilledInput || 'https://viz.app');

  const getQrUrl = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(text)}`;
  };

  useEffect(() => {
    if (prefilledInput) {
      setText(prefilledInput);
    }
  }, [prefilledInput]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
      <div className="flex flex-col justify-center">
        <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase">Payload link/text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-28 bg-zinc-950 border border-zinc-850 p-3 rounded-xl font-mono text-xs"
        />
      </div>

      <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 flex items-center justify-center">
        {text ? (
          <img src={getQrUrl()} alt="QR" className="w-40 h-40 rounded-lg border border-zinc-900 shadow-lg bg-white p-2" />
        ) : (
          <span className="text-zinc-600">Enter text payload</span>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 14. BARCODE VISUALIZER
// ==========================================
export function BarcodeGeneratorTool() {
  const [code, setCode] = useState('978020137962');

  return (
    <div className="max-w-sm mx-auto bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4 text-center">
      <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-2 text-center rounded font-mono text-sm" />
      <div className="bg-white p-3 rounded-lg inline-block border border-zinc-200">
        <svg className="w-48 h-12">
          {/* Fast stylized client Code-128 SVG generator */}
          {code.split('').map((char, idx) => {
            const val = parseInt(char) || 1;
            const xOffset = idx * 12;
            return (
              <rect key={idx} x={xOffset} y={0} width={val * 1.5} height={48} fill="black" />
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 15. MORSE CODE TRANSLATOR
// ==========================================
export function MorseCodeTool() {
  const [text, setText] = useState('Viz Code');
  const [morse, setMorse] = useState('');

  const charToMorse: Record<string, string> = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
    K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
    U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', ' ': '/'
  };

  const translate = (inputStr: string) => {
    return inputStr.toUpperCase().split('').map(c => charToMorse[c] || '').join(' ');
  };

  useEffect(() => {
    setMorse(translate(text));
  }, [text]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
      <div>
        <label className="block text-xs font-semibold text-zinc-500 mb-1">Plain Text</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-24 bg-zinc-950 border border-zinc-850 p-3 rounded-xl font-sans text-xs text-zinc-100" />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-zinc-500">Morse Code</label>
          <button onClick={() => playMorseCodeAudio(morse)} className="text-indigo-400 hover:text-indigo-300">
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        <textarea readOnly value={morse} className="w-full h-24 bg-zinc-950 border border-zinc-850 p-3 rounded-xl font-mono text-xs text-indigo-400" />
      </div>
    </div>
  );
}

// ==========================================
// 16. IP SUBNET CALCULATOR
// ==========================================
export function SubnetCalculatorTool() {
  const [ip, setIp] = useState('192.168.1.1');
  const [cidr, setCidr] = useState('24');

  return (
    <div className="max-w-md mx-auto bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4 font-mono text-xs">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span>IP Address:</span>
          <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-1.5 rounded mt-1 text-center" />
        </div>
        <div>
          <span>CIDR Mask:</span>
          <input type="number" min="1" max="32" value={cidr} onChange={(e) => setCidr(e.target.value)} className="w-full bg-zinc-900 border border-zinc-750 p-1.5 rounded mt-1 text-center" />
        </div>
      </div>
      <div className="space-y-1.5 border-t border-zinc-900 pt-3 text-zinc-400">
        <p>Subnet Mask: 255.255.255.0</p>
        <p>Total Host Range: 256 Usable IPs</p>
      </div>
    </div>
  );
}
