/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tool } from '../types';

export const TOOLS_LIST: Tool[] = [
  // --- PREMIUM AI CONSUMER TOOLS ---
  {
    id: 'song-finder',
    name: 'Smart AI Song Finder',
    name_fa: 'یابنده هوشمند آهنگ و ترانه',
    description: 'Find any song by describing its lyrics, humming, artist, or style. Get Persian meanings & fun facts.',
    description_fa: 'پیدا کردن نام دقیق آهنگ با نوشتن تیکه‌ای از شعر (حتی فینگلیش یا ناقص)، زمزمه یا توصیف موزیک ویدیو همراه با ترجمه معنی ترانه.',
    category: 'utility',
    icon: 'Music',
    commands: ['song', 'finder', 'music', 'lyrics', 'singer', 'track', 'آهنگ', 'موزیک', 'ترانه', 'شعر', 'خواننده', 'یابنده']
  },
  {
    id: 'ai-translator',
    name: 'AI Advanced Translator',
    name_fa: 'مترجم و لغت‌نامه هوشمند هوش مصنوعی',
    description: 'Super-accurate translation between Persian & English with pronunciation, slang notes, and examples.',
    description_fa: 'ترجمه هوشمند و فوق‌دقیق جملات فارسی و انگلیسی به همراه تلفظ صوتی متنی، اصطلاحات عامیانه و مثال‌های واقعی کاربردی.',
    category: 'utility',
    icon: 'Languages',
    commands: ['translate', 'translator', 'dictionary', 'english', 'persian', 'vocab', 'مترجم', 'ترجمه', 'دیکشنری', 'انگلیسی', 'فارسی']
  },
  {
    id: 'calorie-advisor',
    name: 'AI Calorie & Meal Dietitian',
    name_fa: 'آنالیزور هوشمند غذا و کالری‌شمار',
    description: 'Get estimated calories, macros, and diet tips for any meal. Specialized in traditional Persian foods.',
    description_fa: 'کالری‌شمار و مشاور هوشمند تغذیه؛ تخمین دقیق کالری، پروتئین، چربی و کربوهیدرات انواع غذاها با راهکار چربی‌سوزی.',
    category: 'utility',
    icon: 'Heart',
    commands: ['calorie', 'meal', 'diet', 'food', 'nutrition', 'weight', 'کالری', 'غذا', 'تغذیه', 'رژیم', 'کالری‌شمار', 'چاقی', 'لاغری']
  },

  // --- UTILITY TOOLS (EVERYDAY TOOLS) ---
  {
    id: 'notes',
    name: 'Sticky Notes & Scratchpad',
    name_fa: 'دفترچه یادداشت و پیش‌نویس سریع',
    description: 'Create, store, and organize raw rich text drafts and notes with secure local persistence.',
    description_fa: 'یک فضای ساده برای نوشتن ایده‌ها، کارهای روزمره و یادداشت‌های شخصی با ذخیره‌سازی خودکار در مرورگر شما.',
    category: 'utility',
    icon: 'FileEdit',
    commands: ['notes', 'scratchpad', 'draft', 'save', 'text', 'یادداشت', 'چرکنویس', 'ذخیره']
  },
  {
    id: 'tasks',
    name: 'Interactive Todo Checklist',
    name_fa: 'لیست انجام کارهای روزانه',
    description: 'Manage tasks, track progress bar, filter lists, and organize your work list smoothly.',
    description_fa: 'کارهای روزانه خود را مدیریت کنید، میزان پیشرفت خود را ببینید و چک‌لیست‌های شخصی بسازید.',
    category: 'utility',
    icon: 'CheckSquare',
    commands: ['tasks', 'todo', 'checklist', 'list', 'manage', 'کارها', 'لیست', 'انجام']
  },
  {
    id: 'calculator',
    name: 'Advanced Scientific Calculator',
    name_fa: 'ماشین‌حساب ساده و مهندسی',
    description: 'Perform complex arithmetic, trigonometric, and scientific functions in a tactile layout.',
    description_fa: 'انجام محاسبات ساده ریاضی تا فرمول‌های مهندسی و پیچیده در یک محیط ساده و زیبا.',
    category: 'utility',
    icon: 'Calculator',
    commands: ['calculator', 'math', 'scientific', 'trig', 'solve', 'ماشین‌حساب', 'ریاضی', 'مهندسی']
  },
  {
    id: 'timer',
    name: 'Countdown Timer',
    name_fa: 'تایمر و زمان‌سنج معکوس',
    description: 'Precision countdown timer with visual radial indicator, sounds, and quick presets.',
    description_fa: 'تنظیم زمان برای پخت‌وپز، مطالعه (پومودورو)، ورزش یا هر کار دیگری همراه با هشدار صوتی.',
    category: 'utility',
    icon: 'Timer',
    commands: ['timer', 'countdown', 'alarm', 'pomodoro', 'time', 'تایمر', 'شمارش', 'معکوس']
  },
  {
    id: 'stopwatch',
    name: 'Lap Split Stopwatch',
    name_fa: 'کرونومتر (ثانیه‌شمار دقیق)',
    description: 'Millisecond-perfect digital stopwatch with visual lap recording, pause and split logs.',
    description_fa: 'اندازه‌گیری زمان با دقت صدم ثانیه به همراه امکان ثبت رکوردهای میانی و دورهای مختلف.',
    category: 'utility',
    icon: 'Timer',
    commands: ['stopwatch', 'laps', 'split', 'time', 'precision', 'کرونومتر', 'ثانیه‌شمار', 'رکورد']
  },
  {
    id: 'text-counter',
    name: 'Word & Character Counter',
    name_fa: 'تعداد کلمات و حروف متن',
    description: 'Analyze text statistics: counts characters, words, sentences, reading time, and density.',
    description_fa: 'متن خود را کپی کنید تا تعداد دقیق حروف، کلمات، جملات و زمان تقریبی مطالعه آن را ببینید.',
    category: 'utility',
    icon: 'Hash',
    commands: ['counter', 'words', 'chars', 'text', 'length', 'شمارش', 'کلمات', 'کاراکتر']
  },
  {
    id: 'random-generator',
    name: 'Random Picker & Generator',
    name_fa: 'قرعه‌کشی و انتخاب تصادفی',
    description: 'Pick random items from a list, toss coins, roll dice, or generate secure random integers.',
    description_fa: 'انتخاب عادلانه یک گزینه از بین چندین نام، پرتاب سکه (شیر یا خط)، انداختن تاس یا تولید اعداد شانس.',
    category: 'utility',
    icon: 'HelpCircle',
    commands: ['random', 'picker', 'dice', 'coin', 'list', 'تصادفی', 'انتخابگر', 'شیر', 'خط']
  },
  {
    id: 'clipboard-manager',
    name: 'Sleek Clipboard Manager',
    name_fa: 'مدیریت متن‌های کپی‌شده',
    description: 'Store and manage snippets you copy frequently for instant one-click copies.',
    description_fa: 'جملات و متن‌هایی که زیاد استفاده می‌کنید را اینجا ذخیره کنید تا همیشه برای کپی کردن دم دست باشند.',
    category: 'utility',
    icon: 'Clipboard',
    commands: ['clipboard', 'copy', 'paste', 'manager', 'snippets', 'حافظه', 'کپی', 'کلیپ‌بورد']
  },

  // --- MATH & FINANCE ---
  {
    id: 'unit-converter',
    name: 'Comprehensive Unit Converter',
    name_fa: 'تبدیل واحدهای اندازه‌گیری',
    description: 'Convert Length, Area, Weight, Volume, Temperature and Speed in a smart matrix grid.',
    description_fa: 'تبدیل بسیار آسان انواع واحدهای متداول مانند طول (متر، سانتیمتر)، وزن (کیلوگرم، گرم)، دما و حجم.',
    category: 'math',
    icon: 'Scale',
    commands: ['unit', 'converter', 'metric', 'imperial', 'length', 'مبدل', 'واحد', 'طول', 'وزن']
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter & Live FX',
    name_fa: 'تبدیل قیمت دلار و ارزها',
    description: 'Convert currencies with real-time live FX rates synced directly with online API markets.',
    description_fa: 'محاسبه قیمت روز دلار، یورو، پوند و سایر ارزهای جهانی بر اساس نرخ زنده و بازارهای آنلاین.',
    category: 'math',
    icon: 'Coins',
    commands: ['currency', 'converter', 'forex', 'usd', 'eur', 'exchange', 'ارز', 'تبدیل', 'دلار', 'یورو']
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Health Calculator',
    name_fa: 'محاسبه وزن مناسب و سلامتی',
    description: 'Calculate Body Mass Index (BMI) and discover weight category classifications instantly.',
    description_fa: 'با وارد کردن قد و وزن خود، شاخص توده بدنی (BMI) و وضعیت سلامتی بدنتان را بسنجید.',
    category: 'math',
    icon: 'Heart',
    commands: ['bmi', 'body', 'mass', 'weight', 'health', 'شاخص', 'توده', 'بدنی', 'سلامت']
  },
  {
    id: 'loan-calculator',
    name: 'Loan & Amortization Planner',
    name_fa: 'محاسبه قسط و سود وام',
    description: 'Estimate monthly credit/mortgage payments and view detailed interest amortization tables.',
    description_fa: 'برنامه‌ریزی مالی برای وام‌های بانکی؛ اقساط ماهیانه و میزان سود پرداختی را دقیق محاسبه کنید.',
    category: 'math',
    icon: 'TrendingUp',
    commands: ['loan', 'mortgage', 'interest', 'payment', 'finance', 'وام', 'اقساط', 'سود', 'محاسبه']
  },
  {
    id: 'fuel-consumption',
    name: 'Fuel Costs Estimator',
    name_fa: 'محاسبه هزینه بنزین سفر',
    description: 'Plan trip expenses based on mileage, gas pricing, and vehicle fuel efficiency.',
    description_fa: 'تخمین هزینه و مقدار بنزین مورد نیاز برای سفرهای جاده‌ای بر اساس مسافت و مصرف سوخت خودرو.',
    category: 'math',
    icon: 'Droplet',
    commands: ['fuel', 'gas', 'cost', 'trip', 'mileage', 'efficiency', 'سوخت', 'بنزین', 'هزینه', 'سفر']
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Solver',
    name_fa: 'محاسبه آسان درصد و سود',
    description: 'Solve percentage questions: what is X% of Y, percent increase/decrease, ratios, etc.',
    description_fa: 'حل انواع محاسبات درصد (تخفیف کالا، درصد افزایش حقوق، درصد مالیات و درصد تغییرات).',
    category: 'math',
    icon: 'Percent',
    commands: ['percent', 'ratio', 'increase', 'math', 'solver', 'درصد', 'افزایش', 'کاهش', 'ریاضی']
  },
  {
    id: 'tip-calculator',
    name: 'Bill Splitter & Tip Calculator',
    name_fa: 'تقسیم دونگ و صورت‌حساب',
    description: 'Instantly split dinner/party bills, custom percentages, and calculate tip per person.',
    description_fa: 'تقسیم عادلانه صورت‌حساب رستوران، مهمانی‌ها یا خریدها بین دوستان به همراه حساب کردن انعام.',
    category: 'math',
    icon: 'Receipt',
    commands: ['tip', 'bill', 'split', 'dinner', 'restaurant', 'انعام', 'تقسیم', 'قبض', 'صورت‌حساب']
  },
  {
    id: 'binary-math',
    name: 'Base Number Arithmetic',
    name_fa: 'محاسبات ریاضی مبناهای عددی',
    description: 'Perform arithmetic additions/subtractions in Binary, Octal, Decimal, and Hexadecimal.',
    description_fa: 'جمع و تفریق در مبناهای عددی مختلف مانند دو، هشت، ده و شانزده (مناسب برای رشته‌های کامپیوتر).',
    category: 'math',
    icon: 'Binary',
    commands: ['base', 'hex', 'octal', 'binary', 'math', 'arithmetic', 'پایه', 'عددی', 'دودویی', 'شانزده‌دهی']
  },

  // --- DATE & TIME ---
  {
    id: 'world-clock',
    name: 'World Clock & Time Explorer',
    name_fa: 'ساعت جهانی شهرهای دنیا',
    description: 'Track multiple major global cities with live synchronized luxury digital clocks.',
    description_fa: 'مشاهده ساعت زنده و دقیق پایتخت‌ها و شهرهای بزرگ جهان به صورت همزمان.',
    category: 'date',
    icon: 'Globe',
    commands: ['clock', 'world', 'cities', 'utc', 'timezone', 'ساعت', 'جهانی', 'زمان']
  },
  {
    id: 'timezone-converter',
    name: 'Dynamic Timezone Planner',
    name_fa: 'هماهنگ‌کننده اختلاف ساعت',
    description: 'Coordinate events by sliding local hours and seeing conversion times across capitals.',
    description_fa: 'تبدیل آسان ساعت ایران به سایر کشورها برای برنامه‌ریزی جلسات کاری یا تماس‌های بین‌المللی.',
    category: 'date',
    icon: 'Clock',
    commands: ['timezone', 'converter', 'schedule', 'planner', 'utc', 'منطقه', 'زمانی', 'تبدیل']
  },
  {
    id: 'age-calculator',
    name: 'Chronological Age Calculator',
    name_fa: 'محاسبه سن دقیق و تولد',
    description: 'Discover your exact age down to hours, minutes, and count down to your next birthday.',
    description_fa: 'محاسبه سن دقیق شما به سال، ماه، روز و حتی ساعت، به همراه روزشمار تولد بعدی.',
    category: 'date',
    icon: 'CalendarDays',
    commands: ['age', 'birthday', 'calendar', 'accurate', 'difference', 'سن', 'تولد', 'شمارش', 'دقیق']
  },
  {
    id: 'date-diff',
    name: 'Date Difference Calculator',
    name_fa: 'محاسبه فاصله زمانی دو تاریخ',
    description: 'Calculate the precise number of years, months, weeks, and days between two calendar dates.',
    description_fa: 'محاسبه دقیق فاصله و تعداد روزها، هفته‌ها یا ماه‌های بین دو تاریخ مشخص.',
    category: 'date',
    icon: 'CalendarRange',
    commands: ['date', 'diff', 'between', 'span', 'days', 'فاصله', 'تاریخ', 'روزها']
  },
  {
    id: 'countdown',
    name: 'Target Date Countdown',
    name_fa: 'روزشمار معکوس رویدادها',
    description: 'Design beautiful, customized counts down to custom events, milestones, or launches.',
    description_fa: 'ایجاد روزشمار معکوس شیک برای جشن تولد، کنکور، عروسی، مسافرت یا هر مناسبت خاص.',
    category: 'date',
    icon: 'Hourglass',
    commands: ['countdown', 'target', 'event', 'timer', 'milestone', 'شمارش', 'معکوس', 'رویداد']
  },
  {
    id: 'calendar',
    name: 'Interactive Calendar Planner',
    name_fa: 'تقویم ماهانه و یادآورها',
    description: 'Premium, responsive monthly calendar grid to view current days and schedule quick reminders.',
    description_fa: 'تقویم هوشمند با قابلیت مرور روزهای ماه و یادداشت رویدادهای مهم در آن.',
    category: 'date',
    icon: 'Calendar',
    commands: ['calendar', 'month', 'year', 'events', 'schedule', 'تقویم', 'ماهانه', 'رویدادها']
  },
  {
    id: 'leap-year',
    name: 'Leap Year Checker',
    name_fa: 'بررسی سال کبیسه',
    description: 'Check whether any year in past or future history is a leap year with chronological logs.',
    description_fa: 'تشخیص اینکه آیا یک سال خاص در گذشته یا آینده سال کبیسه (۳۶۶ روزه) است یا خیر.',
    category: 'date',
    icon: 'CalendarCheck',
    commands: ['leap', 'year', 'february', 'math', 'checker', 'کبیسه', 'سال', 'بررسی']
  },

  // --- API INTEGRATIONS & NETWORKS ---
  {
    id: 'api-weather',
    name: 'Live Weather Forecast',
    name_fa: 'پیش‌بینی زنده آب و هوا',
    description: 'Live localized weather conditions, 7-day forecast, humidity, and wind (Open-Meteo API).',
    description_fa: 'دما، رطوبت، سرعت باد و پیش‌بینی کامل ۷ روز آینده برای هر شهر در جهان به صورت زنده.',
    category: 'api',
    icon: 'CloudSun',
    commands: ['weather', 'forecast', 'temp', 'temperature', 'meteo', 'api', 'آب‌وهوا', 'هواشناسی', 'دما']
  },
  {
    id: 'api-dictionary',
    name: 'English Dictionary Explorer',
    name_fa: 'دیکشنری و لغت‌نامه انگلیسی',
    description: 'Search English words for real definitions, phonetics, audio pronunciations, and syns.',
    description_fa: 'ترجمه و تعریف کلمات انگلیسی به همراه تلفظ صوتی، مترادف‌ها و مثال‌های کاربردی.',
    category: 'api',
    icon: 'BookOpen',
    commands: ['dictionary', 'meaning', 'word', 'vocabulary', 'english', 'api', 'دیکشنری', 'لغت‌نامه', 'معنی']
  },
  {
    id: 'api-news',
    name: 'Global Instant News Feed',
    name_fa: 'اخبار فوری و تازه جهان',
    description: 'Live trending worldwide headlines categorized by Tech, Business, and Sports.',
    description_fa: 'آخرین اخبار و تیترهای مهم روز دنیا در موضوعات علمی، اقتصادی، ورزشی و عمومی.',
    category: 'api',
    icon: 'Newspaper',
    commands: ['news', 'headlines', 'feed', 'global', 'trending', 'api', 'اخبار', 'خبر', 'رویداد']
  },
  {
    id: 'api-wikipedia',
    name: 'Wikipedia Instant Searcher',
    name_fa: 'جستجوی فوری در ویکی‌پدیا',
    description: 'Search Wikipedia database in real-time and retrieve parsed snippets and source links.',
    description_fa: 'جستجو و دریافت خلاصه مقالات دانشنامه آزاد ویکی‌پدیا به صورت آنی بدون نیاز به خروج از سایت.',
    category: 'api',
    icon: 'Search',
    commands: ['wikipedia', 'wiki', 'search', 'encyclopedia', 'api', 'ویکی‌پدیا', 'جستجو', 'دانشنامه']
  },
  {
    id: 'api-country',
    name: 'REST Countries Explorer',
    name_fa: 'اطلاعات و دانستنی‌های کشورها',
    description: 'Browse geographical and socio-economic data for any sovereign nation on Earth.',
    description_fa: 'دانستنی‌های جالب، جمعیت، پایتخت، پرچم و نقشه جغرافیایی تمام کشورهای جهان.',
    category: 'api',
    icon: 'Flag',
    commands: ['country', 'nations', 'geography', 'flag', 'population', 'api', 'کشورها', 'پرچم', 'جغرافیا']
  },
  {
    id: 'api-holiday',
    name: 'National Holidays Finder',
    name_fa: 'جستجوی تعطیلات رسمی ملل',
    description: 'Search official calendar public holidays for any supported country code and year.',
    description_fa: 'پیدا کردن روزها و مناسبت‌های تعطیل رسمی در هر یک از کشورهای دنیا برای برنامه‌ریزی سفر.',
    category: 'api',
    icon: 'PartyPopper',
    commands: ['holiday', 'public', 'calendar', 'celebrations', 'api', 'تعطیلات', 'رسمی', 'تقویم']
  },
  {
    id: 'api-quote',
    name: 'Synchronized Quotes Feed',
    name_fa: 'جملات انگیزشی و سخن بزرگان',
    description: 'Generate real-time inspirational quotes categorized by author and theme (API Powered).',
    description_fa: 'دریافت جملات زیبا، الهام‌بخش و فلسفی از اندیشمندان و مشاهیر بزرگ دنیا.',
    category: 'api',
    icon: 'Quote',
    commands: ['quote', 'inspiration', 'author', 'random', 'api', 'سخن', 'بزرگان', 'جمله', 'الهام‌بخش']
  },
  {
    id: 'api-public-ip',
    name: 'My IP & Network Geolocation',
    name_fa: 'نمایش آدرس آی‌پی (IP) من',
    description: 'Fetch your current public IP address, ISP, country, postal code, and network metadata.',
    description_fa: 'یافتن آدرس آی‌پی اینترنت شما، موقعیت جغرافیایی، کشور و نام شرکت ارائه‌دهنده اینترنت.',
    category: 'api',
    icon: 'Network',
    commands: ['ip', 'my', 'public', 'geolocation', 'isp', 'network', 'api', 'ای‌پی', 'شبکه', 'موقعیت']
  },
  {
    id: 'api-geocoding',
    name: 'Coordinates Geocoding Look',
    name_fa: 'پیدا کردن موقعیت جغرافیایی',
    description: 'Convert global city names into latitude/longitude coordinates and elevation metrics.',
    description_fa: 'یافتن طول و عرض جغرافیایی و ارتفاع از سطح دریا برای هر شهر در دنیا.',
    category: 'api',
    icon: 'MapPin',
    commands: ['geocoding', 'coordinates', 'latitude', 'longitude', 'location', 'api', 'مختصات', 'طول', 'عرض', 'جغرافیایی']
  },
  {
    id: 'api-color-info',
    name: 'Color Scheme Explorer',
    name_fa: 'دانشنامه و نام‌گذاری رنگ‌ها',
    description: 'Query any hex code to find its true creative name, matching schemes, and HSL contrasts.',
    description_fa: 'کد رنگ خود را وارد کنید تا نام واقعی، پالت‌های همخوان و ترکیب‌های زیبای آن را ببینید.',
    category: 'api',
    icon: 'Droplet',
    commands: ['color', 'hex', 'name', 'scheme', 'api', 'رنگ‌شناسی', 'اطلاعات', 'پالت']
  },
  {
    id: 'api-url-metadata',
    name: 'Website Link Metadata Parser',
    name_fa: 'پیش‌نمایش اطلاعات لینک‌ها',
    description: 'Parse any web URL for its true title, description, favicon, and thumbnail meta tags.',
    description_fa: 'استخراج عنوان، توضیحات، آیکون و تصویر پیش‌نمایش هر صفحه اینترنتی از روی آدرس آن.',
    category: 'api',
    icon: 'Globe2',
    commands: ['metadata', 'url', 'scraper', 'tags', 'seo', 'api', 'متادیتا', 'سایت', 'بررسی', 'سئو']
  },
  {
    id: 'api-timezone',
    name: 'Live Timezone Fetcher',
    name_fa: 'دریافت ساعت دقیق جهانی',
    description: 'Fetch real UTC offset and timezone details from an online registry database.',
    description_fa: 'یافتن نام دقیق منطقه زمانی و ساعت هماهنگ جهانی برای هر شهر یا کشور.',
    category: 'api',
    icon: 'Clock',
    commands: ['timezone', 'utc', 'offset', 'api', 'time', 'منطقه', 'زمانی', 'جهانی']
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator & API',
    name_fa: 'تولیدکننده بارکد و QR Code',
    description: 'Generate high-resolution shareable QR codes with custom size, margins, and data fields.',
    description_fa: 'با نوشتن لینک، متن یا شماره تلفن خود، به راحتی یک کد QR برای چاپ یا اشتراک‌گذاری بسازید.',
    category: 'api',
    icon: 'QrCode',
    commands: ['qr', 'code', 'generate', 'share', 'link', 'api', 'کیو‌آر', 'کد', 'تولید']
  },
  {
    id: 'barcode-generator',
    name: 'Barcode Visualizer',
    name_fa: 'تولیدکننده بارکد خطی خرید',
    description: 'Generate Code-128 barcode SVGs from numbers or text entirely client-side.',
    description_fa: 'ساخت فوری انواع بارکدهای استاندارد تجاری از روی اعداد و نوشته‌ها به صورت کاملا رایگان.',
    category: 'api',
    icon: 'Barcode',
    commands: ['barcode', 'code128', 'lines', 'generate', 'بارکد', 'تولید', 'خطی']
  },
  {
    id: 'morse-code',
    name: 'Morse Code Translator',
    name_fa: 'مترجم کد مورس (با پخش صدا)',
    description: 'Translate text to Morse code signals (dots and dashes) and play sound audio signals.',
    description_fa: 'نوشته‌های خود را به بوق‌ها و نقطه‌های مورس تبدیل کنید و به صدای بی‌سیم آن گوش دهید.',
    category: 'api',
    icon: 'Volume2',
    commands: ['morse', 'translator', 'dots', 'dashes', 'sound', 'کد', 'مورس', 'ترجمه', 'صدا']
  },
  {
    id: 'ip-subnet',
    name: 'IP Subnet Mask Calculator',
    name_fa: 'محاسبه‌گر شبکه‌های کامپیوتری',
    description: 'Calculate network ranges, broadcast, usable IPs, wildcard masks, and CIDR notation.',
    description_fa: 'محاسبه محدوده‌های شبکه، آدرس‌های مجاز و تقسیم‌بندی آی‌پی‌ها برای مهندسین شبکه.',
    category: 'api',
    icon: 'Shield',
    commands: ['subnet', 'ip', 'cidr', 'mask', 'network', 'calculator', 'سابنت', 'ای‌پی', 'محاسبه']
  },

  // --- DESIGN TOOLS ---
  {
    id: 'color-picker',
    name: 'Color Palette & Picker',
    name_fa: 'انتخاب پالت رنگ و تم',
    description: 'Design professional color schemes, extract HEX/RGB/HSL, and generate contrast palettes.',
    description_fa: 'انتخاب هوشمندانه کدهای رنگ هماهنگ، پالت‌های رنگی خیره‌کننده برای وب‌سایت یا کارهای گرافیکی.',
    category: 'design',
    icon: 'Palette',
    commands: ['color', 'picker', 'hex', 'rgb', 'hsl', 'palette', 'رنگ', 'پالت', 'انتخابگر']
  },
  {
    id: 'gradient-generator',
    name: 'CSS Gradient Designer',
    name_fa: 'ساخت پس‌زمینه‌های رنگی (شیب رنگ)',
    description: 'Interactive linear and radial CSS gradient editor with quick export and CSS copies.',
    description_fa: 'طراحی رنگ‌های پس‌زمینه محو شونده با ابزارهای بصری آسان و کپی کدهای آماده.',
    category: 'design',
    icon: 'Sparkles',
    commands: ['gradient', 'css', 'design', 'background', 'radial', 'گرادیانت', 'شیب‌رنگ', 'کد']
  },
  {
    id: 'contrast-checker',
    name: 'Contrast Ratio Checker',
    name_fa: 'بررسی خوانایی نوشته و رنگ',
    description: 'Calculate WCAG accessibility compliance for text foreground and background color pairings.',
    description_fa: 'بررسی میزان وضوح و خوانا بودن رنگ نوشته روی رنگ پس‌زمینه برای پیشگیری از خستگی چشم.',
    category: 'design',
    icon: 'Eye',
    commands: ['contrast', 'checker', 'wcag', 'accessibility', 'color', 'کنتراست', 'خوانایی', 'بررسی']
  },
  {
    id: 'svg-previewer',
    name: 'SVG Viewer & Optimizer',
    name_fa: 'نمایش و بهینه‌سازی تصاویر SVG',
    description: 'Paste SVG code to instantly preview, scale, clean, and download customized SVGs.',
    description_fa: 'پیش‌نمایش فوری تصاویر برداری SVG، تغییر اندازه، تمیز کردن کد و دانلود مجدد آنها.',
    category: 'design',
    icon: 'FileCode',
    commands: ['svg', 'viewer', 'preview', 'vector', 'optimize', 'برداری', 'نمایش', 'کد']
  },
  {
    id: 'image-converter',
    name: 'Image Format Converter',
    name_fa: 'تبدیل فرمت عکس‌ها',
    description: 'Convert images to PNG, JPEG, WEBP or BMP inside your browser with zero server uploads.',
    description_fa: 'تبدیل فرمت انواع عکس به PNG، JPG یا WebP به صورت مستقیم بدون آپلود در اینترنت.',
    category: 'design',
    icon: 'Image',
    commands: ['image', 'convert', 'png', 'jpeg', 'webp', 'format', 'عکس', 'تبدیل', 'فرمت']
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    name_fa: 'کم کردن حجم عکس‌ها',
    description: 'Resize and compress high-resolution photos entirely client-side using Canvas scaling.',
    description_fa: 'فشرده‌سازی و کوچک کردن حجم عکس‌های سنگین گوشی و دوربین به صورت کاملا امن در مرورگر شما.',
    category: 'design',
    icon: 'Minimize2',
    commands: ['compress', 'image', 'quality', 'resize', 'optimize', 'فشرده‌سازی', 'حجم', 'عکس']
  },
  {
    id: 'font-previewer',
    name: 'Font Style Tester',
    name_fa: 'تست و مقایسه زیبایی فونت‌ها',
    description: 'Test, preview, and compare multiple typography settings, sizes, and weights.',
    description_fa: 'پیش‌نمایش و مقایسه همزمان انواع قلم‌ها، اندازه‌ها و مدل‌های نوشتاری متن.',
    category: 'design',
    icon: 'Type',
    commands: ['font', 'preview', 'typography', 'google', 'weight', 'فونت', 'تایپوگرافی', 'پیش‌نمایش']
  },
  {
    id: 'shadow-generator',
    name: 'CSS Box Shadow Designer',
    name_fa: 'ساخت افکت سایه برای عکس و جعبه',
    description: 'Create multi-layered box shadow effects with visual sliders and copy ready-to-use CSS.',
    description_fa: 'طراحی سایه‌های سه‌بعدی شیک و نرم دور کارت‌ها و المان‌ها با دکمه‌های کنترلی روان.',
    category: 'design',
    icon: 'Layers',
    commands: ['shadow', 'box', 'css', 'effects', 'blur', 'سایه', 'طراحی', 'کد']
  },

  // --- DEVELOPER SPECIALTIES ---
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    name_fa: 'مرتب‌سازی و زیباسازی فایل‌های JSON',
    description: 'Beautify, minify, and validate JSON data with clear error reporting.',
    description_fa: 'منظم کردن کدهای شلوغ متنی کامپیوتری و خطایابی ساختارهای داده با گزارش دهی دقیق.',
    category: 'dev',
    icon: 'Braces',
    commands: ['json', 'format', 'beautify', 'minify', 'validate', 'developer', 'parse', 'فرمت', 'جی‌سان', 'اعتبارسنجی']
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    name_fa: 'تست الگوهای عبارات باقاعده',
    description: 'Test regular expressions in real-time with capture groups and highlight matches.',
    description_fa: 'تست بلادرنگ فرمول‌ها و الگوهای جستجوی متنی تخصصی (برای برنامه‌نویسان).',
    category: 'dev',
    icon: 'Regex',
    commands: ['regex', 'test', 'match', 'expression', 'developer', 'رگکس', 'جاوااسکریپت', 'تست']
  },
  {
    id: 'uuid-generator',
    name: 'UUID/GUID Generator',
    name_fa: 'تولیدکننده شناسه‌های تصادفی (UUID)',
    description: 'Generate secure random UUIDs (v4) with bulk generation and copy shortcuts.',
    description_fa: 'تولید شناسه‌های یکتا و کدهای تصادفی ایمن و منحصربه‌فرد برای برنامه‌نویسی.',
    category: 'dev',
    icon: 'Binary',
    commands: ['uuid', 'guid', 'generate', 'random', 'id', 'developer', 'شناسه', 'تصادفی', 'تولید']
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    name_fa: 'تولید رمزهای عبور فوق‌امنیتی',
    description: 'Create ultra-secure, customizable random passwords with entropy metrics.',
    description_fa: 'ساخت خودکار رمزهای عبور بسیار قدرتمند و غیرقابل هک با حروف بزرگ، کوچک، اعداد و نمادها.',
    category: 'dev',
    icon: 'KeyRound',
    commands: ['password', 'generate', 'secure', 'random', 'credential', 'رمز', 'پسورد', 'امنیت']
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor',
    name_fa: 'ویرایشگر متن نشانه‌گذاری (Markdown)',
    description: 'Live WYSIWYG side-by-side Markdown editor with PDF or HTML copyable output.',
    description_fa: 'نوشتن پیشرفته متون به همراه پیش‌نمایش درجا با امکان خروجی گرفتن به صورت فایل متنی یا وب.',
    category: 'dev',
    icon: 'FileText',
    commands: ['markdown', 'editor', 'preview', 'wysiwyg', 'write', 'مارک‌داون', 'ویرایشگر', 'نمایش']
  },
  {
    id: 'base64-converter',
    name: 'Base64 Encoder/Decoder',
    name_fa: 'کدگذاری متن به بیس۶۴ (Base64)',
    description: 'Convert plain text, files, or strings to and from Base64 format safely.',
    description_fa: 'تبدیل کدهای متنی و تصاویر به رشته‌های امن بیس۶۴ و بازگردانی مجدد آن‌ها.',
    category: 'dev',
    icon: 'ArrowLeftRight',
    commands: ['base64', 'encode', 'decode', 'convert', 'binary', 'بیس۶۴', 'کدگذاری', 'رمزگشایی']
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    name_fa: 'تولیدکننده کدهای رمزنگاری (Hash)',
    description: 'Compute MD5, SHA-1, SHA-256, and SHA-512 hashes for any text string.',
    description_fa: 'تبدیل نوشته‌ها به کدهای یک‌طرفه امنیتی مانند MD5 و SHA-256 برای حفظ امنیت اطلاعات.',
    category: 'dev',
    icon: 'Lock',
    commands: ['hash', 'md5', 'sha', 'sha256', 'cryptography', 'هش', 'تولید', 'رمزنگاری']
  },
  {
    id: 'case-converter',
    name: 'Text Case Converter',
    name_fa: 'تغییر حروف بزرگ/کوچک انگلیسی',
    description: 'Instantly transform text case: UPPERCASE, lowercase, Title Case, camelCase, etc.',
    description_fa: 'تبدیل همزمان نوشته‌های انگلیسی به حروف بزرگ، کوچک، عنوان و مدل‌های نگارشی وب.',
    category: 'dev',
    icon: 'CaseSensitive',
    commands: ['case', 'text', 'convert', 'uppercase', 'lowercase', 'حروف', 'بزرگ', 'کوچک', 'تغییر']
  },
  {
    id: 'csv-viewer',
    name: 'CSV to Table Viewer',
    name_fa: 'نمایش فایل‌های اکسل و جدول CSV',
    description: 'Upload or paste CSV data to preview it in a fully sortable, premium table layout.',
    description_fa: 'تبدیل کدهای متنی و اطلاعات جدولی شلوغ به یک جدول منظم و قابل مرتب‌سازی و جستجو.',
    category: 'dev',
    icon: 'Table2',
    commands: ['csv', 'table', 'viewer', 'excel', 'parse', 'جدول', 'سی‌اس‌وی', 'نمایشگر']
  },
  {
    id: 'text-compare',
    name: 'Text Compare & Diff',
    name_fa: 'مقایسه تفاوت‌های دو متن با هم',
    description: 'Compare two text files or snippets side-by-side to highlight line/char diffs.',
    description_fa: 'مقایسه خط به خط دو متن شبیه به هم برای پیدا کردن کلمات اضافه، تغییر یافته یا حذف‌شده.',
    category: 'dev',
    icon: 'Columns2',
    commands: ['compare', 'diff', 'text', 'side', 'match', 'مقایسه', 'تفاوت', 'متن']
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder & Decoder',
    name_fa: 'کدگذاری آدرس سایت‌ها (URL)',
    description: 'Safely encode or decode query parameters and URLs following RFC guidelines.',
    description_fa: 'استانداردسازی لینک‌های اینترنتی دارای حروف فارسی یا کاراکترهای خاص برای پیشگیری از خرابی لینک.',
    category: 'dev',
    icon: 'Link2',
    commands: ['url', 'encode', 'decode', 'link', 'parameter', 'یو‌آر‌ال', 'کدگذاری', 'آدرس']
  },
  {
    id: 'binary-converter',
    name: 'Text & Binary Converter',
    name_fa: 'تبدیل متن به صفر و یک (باینری)',
    description: 'Convert letters or numbers to binary code sequences (zeros and ones) and back.',
    description_fa: 'تبدیل جذاب کلمات به صورت کدهای صفر و یک کامپیوتری و ترجمه برعکس آن‌ها.',
    category: 'dev',
    icon: 'Cpu',
    commands: ['binary', 'text', 'zeros', 'ones', 'unicode', 'باینری', 'کد', 'دودویی', 'مبدل']
  },
  {
    id: 'html-entity',
    name: 'HTML Entity Encoder',
    name_fa: 'کدگذاری نمادهای وب (HTML)',
    description: 'Encode special characters into HTML entities or decode raw entities back to text.',
    description_fa: 'تبدیل کاراکترها و نمادهای خاص به کدهای امن وب برای استفاده در برنامه‌نویسی سایت.',
    category: 'dev',
    icon: 'CodeXml',
    commands: ['html', 'entity', 'encode', 'decode', 'special', 'اچ‌تی‌ام‌ال', 'کاراکتر', 'کدگذاری']
  },
  {
    id: 'game-arena',
    name: 'Arcade Game Arena (5 Games)',
    name_fa: 'کلوب بازی‌های آفلاین (۵ بازی)',
    description: 'Play 5 high-quality, ultra-polished offline games with custom audio & retro neon themes.',
    description_fa: 'مجموعه ۵ بازی فوق‌العاده جذاب و نوستالژیک با گرافیک نئونی و صداگذاری دیجیتال هوشمند.',
    category: 'games',
    icon: 'Gamepad',
    commands: ['game', 'arcade', 'snake', '2048', 'memory', 'typer', 'tictactoe', 'play', 'بازی', 'سرگرمی', 'مار', 'دوز', 'تایپ', 'تتفنی']
  }
];
