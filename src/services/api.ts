/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Simple in-memory or localStorage cache wrapper
const API_CACHE_KEY_PREFIX = 'viz_api_cache_';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export async function fetchWithCache<T>(
  url: string,
  cacheTtlMs: number = 600000, // Default 10 minutes
  timeoutMs: number = 10000
): Promise<T> {
  const cacheKey = `${API_CACHE_KEY_PREFIX}${btoa(url).replace(/=/g, '')}`;

  // Check storage cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const item: CacheItem<T> = JSON.parse(cached);
      if (Date.now() - item.timestamp < cacheTtlMs) {
        return item.data;
      }
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }

  // Abort controller for timeout
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Save cache
    try {
      const cacheItem: CacheItem<T> = { data, timestamp: Date.now() };
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (e) {
      console.warn('Cache write error:', e);
    }

    return data;
  } catch (error: any) {
    clearTimeout(id);
    // Offline / Network error fallback
    const cachedFallback = localStorage.getItem(cacheKey);
    if (cachedFallback) {
      console.warn('Network failed. Falling back to stale cache:', error);
      return JSON.parse(cachedFallback).data;
    }
    throw error;
  }
}

// --- Specific API Wrappers ---

export interface WeatherData {
  latitude: number;
  longitude: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}

export interface CurrencyData {
  base_code: string;
  rates: Record<string, number>;
  time_last_update_utc: string;
}

export interface NewsArticle {
  title: string;
  source: string;
  link: string;
  pubDate: string;
}

export interface NewsFeed {
  news: {
    business: NewsArticle[];
    technology: NewsArticle[];
    sports: NewsArticle[];
    world: NewsArticle[];
  };
}

export const API_SERVICES = {
  // 1. Weather API (Open-Meteo with wttr.in and 7timer fallback, making it 3+ federated APIs)
  getWeather: async (lat: number, lon: number): Promise<WeatherData> => {
    const urlMain = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    const urlBackupWttr = `https://wttr.in/${lat},${lon}?format=j1`;
    const urlBackup7Timer = `https://www.7timer.info/bin/astro.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json`;

    try {
      // API 1: Try main (Open-Meteo) with 5-second timeout
      return await fetchWithCache<WeatherData>(urlMain, 900000, 5000);
    } catch (e) {
      console.warn('Weather primary API failed, trying API 2 (wttr.in):', e);
      try {
        // API 2: Try wttr.in
        const wttrData = await fetchWithCache<any>(urlBackupWttr, 900000, 5000);
        if (wttrData && wttrData.current_condition && wttrData.current_condition[0]) {
          const current = wttrData.current_condition[0];
          const tempMax = wttrData.weather?.[0]?.maxtempC ? [parseFloat(wttrData.weather[0].maxtempC)] : [25];
          const tempMin = wttrData.weather?.[0]?.mintempC ? [parseFloat(wttrData.weather[0].mintempC)] : [15];
          
          return {
            latitude: lat,
            longitude: lon,
            current_weather: {
              temperature: parseFloat(current.temp_C || '0'),
              windspeed: parseFloat(current.windspeedKmph || '0'),
              winddirection: parseFloat(current.winddirDegree || '0'),
              weathercode: 0, // Fallback dummy code
              time: new Date().toISOString()
            },
            daily: {
              time: [new Date().toISOString().split('T')[0]],
              temperature_2m_max: tempMax,
              temperature_2m_min: tempMin,
              weathercode: [0]
            }
          };
        }
        throw new Error('wttr.in parsed response empty');
      } catch (wttrErr) {
        console.warn('Weather API 2 failed, trying API 3 (7timer):', wttrErr);
        try {
          // API 3: Try 7timer
          const timerData = await fetchWithCache<any>(urlBackup7Timer, 900000, 5000);
          if (timerData && timerData.dataseries && timerData.dataseries[0]) {
            const current = timerData.dataseries[0];
            return {
              latitude: lat,
              longitude: lon,
              current_weather: {
                temperature: parseFloat(current.temp2m || '18'),
                windspeed: parseFloat(current.wind10m?.speed || '10'),
                winddirection: 180, // Default direction
                weathercode: 0,
                time: new Date().toISOString()
              },
              daily: {
                time: [new Date().toISOString().split('T')[0]],
                temperature_2m_max: [parseFloat(current.temp2m || '22')],
                temperature_2m_min: [parseFloat(current.temp2m || '12')],
                weathercode: [0]
              }
            };
          }
          throw new Error('7timer parsed response empty');
        } catch (timerErr) {
          console.error('All 3 weather APIs failed:', timerErr);
          throw timerErr;
        }
      }
    }
  },

  // 2. Currency Rates (ExchangeRate-API with ExchangeRate API v4 fallback)
  getCurrencyRates: async (): Promise<CurrencyData> => {
    const urlMain = 'https://open.er-api.com/v6/latest/USD';
    const urlBackup = 'https://api.exchangerate-api.com/v4/latest/USD';
    try {
      return await fetchWithCache<CurrencyData>(urlMain, 3600000, 4000);
    } catch (e) {
      console.warn('Currency primary API failed, trying backup:', e);
      try {
        const backupData = await fetchWithCache<any>(urlBackup, 3600000, 4000);
        return {
          base_code: 'USD',
          rates: backupData.rates || {},
          time_last_update_utc: backupData.time_last_update_utc || new Date().toUTCString()
        };
      } catch (backupErr) {
        console.error('All currency APIs failed:', backupErr);
        throw backupErr;
      }
    }
  },

  // 3. Translation (MyMemory with Google Translate API fallback)
  translateText: async (text: string, from: string, to: string): Promise<{ translatedText: string }> => {
    const encoded = encodeURIComponent(text);
    const urlMain = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=${from}|${to}`;
    const urlBackup = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encoded}`;
    
    try {
      // Try MyMemory primary translation (quick 4s timeout)
      const data = await fetchWithCache<any>(urlMain, 86400000, 4000);
      if (data && data.responseData && data.responseData.translatedText) {
        return { translatedText: data.responseData.translatedText };
      }
      throw new Error('MyMemory empty response');
    } catch (e) {
      console.warn('Translation primary API failed, trying Google Translate proxy:', e);
      try {
        const raw = await fetchWithCache<any[]>(urlBackup, 86400000, 4000);
        if (raw && raw[0]) {
          const translatedText = raw[0].map((item: any) => item[0]).join('');
          return { translatedText };
        }
        throw new Error('Google Translate empty response');
      } catch (backupErr) {
        console.error('All translation APIs failed:', backupErr);
        throw backupErr;
      }
    }
  },

  // 4. Dictionary API (Free Dictionary API, Wiktionary and Wikipedia fallbacks - 3+ APIs)
  getDefinition: async (word: string): Promise<any[]> => {
    const urlMain = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const urlBackupWiktionary = `https://en.wiktionary.org/w/api.php?action=query&titles=${encodeURIComponent(word)}&prop=extracts&explaintext&format=json&origin=*`;
    const urlBackupWikipedia = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(word)}&format=json&origin=*`;

    try {
      // API 1: Try DictionaryAPI.dev
      return await fetchWithCache<any[]>(urlMain, 86400000, 4000);
    } catch (e) {
      console.warn('Dictionary primary API failed, trying API 2 (Wiktionary):', e);
      try {
        // API 2: Try Wiktionary
        const wiktionaryData = await fetchWithCache<any>(urlBackupWiktionary, 86400000, 4000);
        const pages = wiktionaryData?.query?.pages;
        if (pages) {
          const pageId = Object.keys(pages)[0];
          const extract = pages[pageId]?.extract;
          if (extract) {
            return [{
              word: word,
              meanings: [{
                partOfSpeech: 'definition (Wiktionary Extract)',
                definitions: [{ definition: extract.split('\n')[0] || extract, example: '' }]
              }]
            }];
          }
        }
        throw new Error('Wiktionary extract empty');
      } catch (wikiErr) {
        console.warn('Dictionary API 2 failed, trying API 3 (Wikipedia):', wikiErr);
        try {
          // API 3: Try Wikipedia
          const wikiData = await fetchWithCache<any>(urlBackupWikipedia, 86400000, 4000);
          const pages = wikiData?.query?.pages;
          if (pages) {
            const pageId = Object.keys(pages)[0];
            const extract = pages[pageId]?.extract;
            if (extract) {
              return [{
                word: word,
                meanings: [{
                  partOfSpeech: 'noun (Wikipedia Summary)',
                  definitions: [{ definition: extract, example: '' }]
                }]
              }];
            }
          }
          throw new Error('Wikipedia extract empty');
        } catch (finalErr) {
          console.error('All 3 dictionary APIs failed:', finalErr);
          throw finalErr;
        }
      }
    }
  },

  // 5. Wikipedia Search
  searchWikipedia: async (query: string): Promise<any> => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    return fetchWithCache<any>(url, 3600000); // 1 hour cache
  },

  // 6. News API (ok.surf news proxy - highly robust and free)
  getNews: async (): Promise<NewsFeed> => {
    const url = 'https://ok.surf/api/v1/cors/news-feed';
    return fetchWithCache<NewsFeed>(url, 1800000); // 30 mins cache
  },

  // 7. REST Countries
  getCountry: async (name: string): Promise<any[]> => {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}`;
    return fetchWithCache<any[]>(url, 86400000); // 1 day cache
  },

  // 8. Holidays (Nager.Date)
  getHolidays: async (year: number, countryCode: string): Promise<any[]> => {
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
    return fetchWithCache<any[]>(url, 604800000); // 1 week cache
  },

  // 9. Quote of the day (DummyJSON quotes with curated fallback)
  getRandomQuote: async (): Promise<any> => {
    const urlMain = 'https://dummyjson.com/quotes/random';
    try {
      return await fetchWithCache<any>(urlMain, 60000, 3000);
    } catch (e) {
      console.warn('Quotes API failed, using curated backup quote:', e);
      const fallbackQuotes = [
        { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
        { quote: "Do not wait to strike till the iron is hot; but make it hot by striking.", author: "William Butler Yeats" },
        { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { quote: "The best way to predict your future is to create it.", author: "Abraham Lincoln" }
      ];
      const selected = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      return { id: 0, quote: selected.quote, author: selected.author };
    }
  },

  // 10. Public IP details
  getPublicIPDetails: async (): Promise<any> => {
    const url = 'https://ipapi.co/json/';
    return fetchWithCache<any>(url, 1800000); // 30 minutes cache
  },

  // 11. Geocoding (Open-Meteo search)
  searchCoordinates: async (city: string): Promise<any> => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`;
    return fetchWithCache<any>(url, 86400000); // 1 day cache
  },

  // 12. Color Name & Scheme (TheColorAPI)
  getColorInfo: async (hex: string): Promise<any> => {
    const cleanHex = hex.replace('#', '');
    const url = `https://www.thecolorapi.com/id?hex=${cleanHex}`;
    return fetchWithCache<any>(url, 604800000); // 1 week cache
  },

  // 13. URL Metadata Scraper (Microlink API)
  getURLMetadata: async (targetUrl: string): Promise<any> => {
    const url = `https://api.microlink.io?url=${encodeURIComponent(targetUrl)}`;
    return fetchWithCache<any>(url, 86400000); // 1 day cache
  },

  // 14. Timezone Info (WorldTimeAPI)
  getTimezoneDetails: async (zone: string): Promise<any> => {
    const url = `https://worldtimeapi.org/api/timezone/${zone}`;
    return fetchWithCache<any>(url, 1800000); // 30 minutes cache
  }
};
