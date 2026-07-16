/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Upload, Image as ImageIcon, Sliders, Type, Layers, CheckCircle } from 'lucide-react';

interface ToolProps {
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

// ==========================================
// 1. COLOR PALETTE & PICKER
// ==========================================
export function ColorPickerTool({ language }: ToolProps) {
  const [hex, setHex] = useState('#6366f1');
  const [scheme, setScheme] = useState<string[]>([]);
  const { copied, copy } = useCopy();

  const generateScheme = (baseHex: string) => {
    // Generate simple analogous & monochromatic variants
    const cleaned = baseHex.replace('#', '');
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);

    const rgbToHex = (red: number, green: number, blue: number) => {
      const clamp = (val: number) => Math.min(255, Math.max(0, Math.round(val)));
      return '#' + [clamp(red), clamp(green), clamp(blue)].map(x => {
        const hexVal = x.toString(16);
        return hexVal.length === 1 ? '0' + hexVal : hexVal;
      }).join('');
    };

    setScheme([
      baseHex,
      rgbToHex(r * 0.8, g * 0.8, b * 0.8), // Dark shade
      rgbToHex(r * 1.2, g * 1.2, b * 1.2), // Light tint
      rgbToHex(r, g * 0.7, b * 1.1),       // Cool shade
      rgbToHex(r * 1.1, g * 1.1, b * 0.7), // Warm shade
    ]);
  };

  useEffect(() => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      generateScheme(hex);
    }
  }, [hex]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950 p-6 rounded-xl border border-zinc-800">
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className="w-32 h-32 rounded-2xl shadow-xl transition-all duration-300 border border-zinc-800"
            style={{ backgroundColor: hex }}
          />
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              placeholder="#FFFFFF"
              className="bg-zinc-900 text-zinc-100 font-mono text-center font-bold px-4 py-2 rounded-xl border border-zinc-700 outline-none w-32 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {language === 'en' ? 'Generated Color Scheme' : 'پالت رنگی تولید شده'}
          </label>
          <div className="grid grid-cols-5 gap-2 h-16 rounded-xl overflow-hidden border border-zinc-800">
            {scheme.map((c, idx) => (
              <button
                key={idx}
                onClick={() => copy(c)}
                className="h-full relative group transition-transform hover:scale-105"
                style={{ backgroundColor: c }}
                title={language === 'en' ? 'Click to Copy' : 'برای کپی کلیک کنید'}
              >
                <span className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-mono text-white font-bold transition-opacity">
                  COPY
                </span>
              </button>
            ))}
          </div>

          <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-zinc-400">
              <span>HEX:</span>
              <span className="text-zinc-100 select-all font-semibold">{hex}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>RGB:</span>
              <span className="text-zinc-100 select-all">
                {(() => {
                  const cleaned = hex.replace('#', '');
                  if (cleaned.length !== 6) return '...';
                  const r = parseInt(cleaned.substring(0, 2), 16);
                  const g = parseInt(cleaned.substring(2, 4), 16);
                  const b = parseInt(cleaned.substring(4, 6), 16);
                  return `rgb(${r}, ${g}, ${b})`;
                })()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. CSS GRADIENT DESIGNER
// ==========================================
export function GradientGeneratorTool({ language }: ToolProps) {
  const [color1, setColor1] = useState('#818cf8');
  const [color2, setColor2] = useState('#c084fc');
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const { copied, copy } = useCopy();

  const getGradientString = () => {
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    }
    return `radial-gradient(circle, ${color1}, ${color2})`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950 p-6 rounded-xl border border-zinc-800">
        <div
          className="h-48 rounded-2xl border border-zinc-800 shadow-inner flex items-center justify-center transition-all duration-300"
          style={{ background: getGradientString() }}
        >
          <span className="bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800/50 text-xs font-mono text-zinc-300 font-semibold shadow-lg">
            Viz Canvas
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setType('linear')}
              className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                type === 'linear' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-100'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => setType('radial')}
              className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                type === 'radial' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-100'
              }`}
            >
              Radial
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1.5">Color A</label>
              <div className="flex items-center gap-2">
                <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-24 bg-zinc-900 text-zinc-100 font-mono text-xs p-1.5 rounded border border-zinc-700 text-center" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1.5">Color B</label>
              <div className="flex items-center gap-2">
                <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-24 bg-zinc-900 text-zinc-100 font-mono text-xs p-1.5 rounded border border-zinc-700 text-center" />
              </div>
            </div>
          </div>

          {type === 'linear' && (
            <div>
              <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-400 mb-1">
                <span>ANGLE</span>
                <span>{angle}°</span>
              </div>
              <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full accent-indigo-500" />
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          readOnly
          value={`background: ${getGradientString()};`}
          className="w-full p-4 pr-12 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-indigo-400 focus:outline-none h-16 resize-none"
        />
        <button
          onClick={() => copy(`background: ${getGradientString()};`)}
          className="absolute top-3.5 right-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 p-1.5 rounded-lg border border-zinc-850 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. CONTRAST RATIO CHECKER
// ==========================================
export function ContrastCheckerTool({ language }: ToolProps) {
  const [textCol, setTextCol] = useState('#ffffff');
  const [bgCol, setBgCol] = useState('#4f46e5');
  const [ratio, setRatio] = useState(1);

  const checkContrast = () => {
    const hexToRgb = (hex: string) => {
      const cleaned = hex.replace('#', '');
      const r = parseInt(cleaned.substring(0, 2), 16) / 255;
      const g = parseInt(cleaned.substring(2, 4), 16) / 255;
      const b = parseInt(cleaned.substring(4, 6), 16) / 255;

      const calc = (c: number) => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      return [calc(r), calc(g), calc(b)];
    };

    const getLuminance = (rgb: number[]) => {
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };

    const rgb1 = hexToRgb(textCol);
    const rgb2 = hexToRgb(bgCol);

    const l1 = getLuminance(rgb1);
    const l2 = getLuminance(rgb2);

    const brighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    setRatio((brighter + 0.05) / (darker + 0.05));
  };

  useEffect(() => {
    if (/^#[0-9A-F]{6}$/i.test(textCol) && /^#[0-9A-F]{6}$/i.test(bgCol)) {
      checkContrast();
    }
  }, [textCol, bgCol]);

  const passesAA = ratio >= 4.5;
  const passesAAA = ratio >= 7;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950 p-6 rounded-xl border border-zinc-800">
        <div
          className="h-44 rounded-2xl border border-zinc-800 shadow-inner flex flex-col items-center justify-center p-6 transition-all duration-300 text-center"
          style={{ backgroundColor: bgCol, color: textCol }}
        >
          <span className="text-lg font-bold">Contrast Sample</span>
          <span className="text-xs opacity-75 mt-1">This is small sample text to verify reading legibility.</span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={textCol} onChange={(e) => setTextCol(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                <input type="text" value={textCol} onChange={(e) => setTextCol(e.target.value)} className="w-24 bg-zinc-900 text-zinc-100 font-mono text-xs p-1.5 rounded border border-zinc-700 text-center" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1">Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgCol} onChange={(e) => setBgCol(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                <input type="text" value={bgCol} onChange={(e) => setBgCol(e.target.value)} className="w-24 bg-zinc-900 text-zinc-100 font-mono text-xs p-1.5 rounded border border-zinc-700 text-center" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-500 uppercase font-semibold">Contrast Ratio</span>
              <div className="text-2xl font-bold font-mono text-zinc-100 mt-1">{ratio.toFixed(2)} : 1</div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${passesAA ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="text-zinc-300">WCAG AA ({passesAA ? 'Pass' : 'Fail'})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${passesAAA ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="text-zinc-300">WCAG AAA ({passesAAA ? 'Pass' : 'Fail'})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. SVG VIEWER & OPTIMIZER
// ==========================================
export function SvgViewerTool({ language }: ToolProps) {
  const [svgCode, setSvgCode] = useState('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>');
  const [scale, setScale] = useState(1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Paste Raw SVG Code</label>
          <textarea
            value={svgCode}
            onChange={(e) => setSvgCode(e.target.value)}
            className="w-full h-56 bg-zinc-950 text-zinc-100 p-4 rounded-xl border border-zinc-800 font-mono text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Vector Canvas</label>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>Zoom:</span>
              <input type="range" min="0.5" max="3" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-20" />
              <span className="font-mono w-8">{Math.round(scale * 100)}%</span>
            </div>
          </div>
          <div className="h-56 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center overflow-auto p-4">
            <div
              style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
              dangerouslySetInnerHTML={{ __html: svgCode }}
              className="text-indigo-400 max-w-full max-h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. IMAGE FORMAT CONVERTER
// ==========================================
export function ImageConverterTool({ language }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
      setConvertedUrl(null);
    }
  };

  const handleConvert = () => {
    if (!preview || !canvasRef.current) return;
    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const mimeType = `image/${targetFormat}`;
        const url = canvas.toDataURL(mimeType);
        setConvertedUrl(url);
      }
    };
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-2 border-dashed border-zinc-800 bg-zinc-950/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          {preview ? (
            <div className="space-y-4">
              <img src={preview} className="max-h-36 rounded-lg border border-zinc-800 object-contain mx-auto" />
              <p className="text-xs text-zinc-500 font-mono truncate max-w-xs">{file?.name}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="mx-auto h-8 w-8 text-zinc-600" />
              <label className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-300 text-xs px-4 py-2 rounded-lg cursor-pointer">
                Select Photo
                <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
              </label>
            </div>
          )}
        </div>

        <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Target Format</label>
            <div className="flex gap-2">
              {(['png', 'jpeg', 'webp'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setTargetFormat(format)}
                  className={`flex-1 text-xs py-1.5 rounded-lg border uppercase font-mono font-semibold transition-colors ${
                    targetFormat === format ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-100'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              onClick={handleConvert}
              disabled={!preview}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-xl text-sm disabled:opacity-50 transition-colors"
            >
              Convert Now
            </button>
          </div>
        </div>
      </div>

      {convertedUrl && (
        <div className="bg-zinc-950/40 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="text-xs text-zinc-400">Conversion finished. Download ready!</span>
          </div>
          <a
            href={convertedUrl}
            download={`converted_${Date.now()}.${targetFormat}`}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 text-xs px-4 py-2 border border-zinc-800 rounded-lg font-semibold"
          >
            Download file
          </a>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// ==========================================
// 6. IMAGE COMPRESSOR
// ==========================================
export function ImageCompressorTool({ language }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setOriginalSize(selected.size);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
      setDownloadUrl(null);
      setCompressedSize(0);
    }
  };

  const handleCompress = () => {
    if (!preview || !canvasRef.current) return;
    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            setDownloadUrl(URL.createObjectURL(blob));
          }
        }, 'image/jpeg', quality);
      }
    };
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-2 border-dashed border-zinc-800 bg-zinc-950/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          {preview ? (
            <div className="space-y-4">
              <img src={preview} className="max-h-36 rounded-lg border border-zinc-800 object-contain mx-auto" />
              <div className="text-[11px] font-mono text-zinc-500 space-y-1">
                <p>Original Size: {formatSize(originalSize)}</p>
                {compressedSize > 0 && <p className="text-emerald-400 font-semibold">Compressed Size: {formatSize(compressedSize)}</p>}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="mx-auto h-8 w-8 text-zinc-600" />
              <label className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-300 text-xs px-4 py-2 rounded-lg cursor-pointer">
                Select Photo
                <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
              </label>
            </div>
          )}
        </div>

        <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-zinc-400 mb-1">
              <span className="uppercase">Compression Ratio</span>
              <span className="font-mono text-indigo-400 font-bold">{Math.round(quality * 100)}%</span>
            </div>
            <input type="range" min="0.1" max="1.0" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              onClick={handleCompress}
              disabled={!preview}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-xl text-sm disabled:opacity-50 transition-colors"
            >
              Compress Photo
            </button>
          </div>
        </div>
      </div>

      {downloadUrl && (
        <div className="bg-zinc-950/40 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <span className="text-xs text-zinc-400">Compression complete! Saving {Math.round((1 - compressedSize / originalSize) * 100)}% space.</span>
          </div>
          <a
            href={downloadUrl}
            download={`compressed_${Date.now()}.jpg`}
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 text-xs px-4 py-2 border border-zinc-800 rounded-lg font-semibold"
          >
            Download Compressed Jpeg
          </a>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

// ==========================================
// 7. FONT STYLE TESTER
// ==========================================
export function FontPreviewerTool({ language }: ToolProps) {
  const [text, setText] = useState('Viz is an ultra-fast modular toolkit designed for designers.');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('sans');

  return (
    <div className="space-y-4">
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1.5">Family</label>
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full bg-zinc-900 text-zinc-200 border border-zinc-750 text-xs p-1.5 rounded outline-none">
            <option value="sans">Inter (Sans-Serif)</option>
            <option value="mono">JetBrains Mono</option>
            <option value="serif">System Serif</option>
          </select>
        </div>
        <div>
          <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-400 mb-1">
            <span>FONT SIZE</span>
            <span>{fontSize}px</span>
          </div>
          <input type="range" min="12" max="72" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-indigo-500" />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-zinc-400 uppercase mb-1.5">Custom Text</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-zinc-900 text-zinc-100 text-xs p-1.5 rounded border border-zinc-750 focus:outline-none" />
        </div>
      </div>

      <div className="p-6 border border-zinc-850 bg-zinc-950/35 rounded-xl min-h-[140px] flex items-center justify-center text-center">
        <p
          style={{ fontSize: `${fontSize}px` }}
          className={`text-zinc-100 ${fontFamily === 'mono' ? 'font-mono' : fontFamily === 'serif' ? 'font-serif' : 'font-sans'}`}
        >
          {text || 'Type some text to preview'}
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 8. CSS BOX SHADOW DESIGNER
// ==========================================
export function ShadowGeneratorTool({ language }: ToolProps) {
  const [blur, setBlur] = useState(16);
  const [spread, setSpread] = useState(0);
  const [x, setX] = useState(4);
  const [y, setY] = useState(8);
  const [opacity, setOpacity] = useState(30);
  const { copied, copy } = useCopy();

  const getShadowCss = () => {
    return `${x}px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity / 100})`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-950 p-6 rounded-xl border border-zinc-800">
        <div className="h-44 bg-zinc-900 rounded-2xl border border-zinc-850 flex items-center justify-center p-6 transition-all duration-300">
          <div
            className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center text-xs font-bold text-white shadow-lg transition-all"
            style={{ boxShadow: getShadowCss() }}
          >
            Object
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between font-semibold text-zinc-400 mb-1">
              <span>Blur Radius</span>
              <span>{blur}px</span>
            </div>
            <input type="range" min="0" max="64" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full accent-indigo-500" />
          </div>
          <div>
            <div className="flex justify-between font-semibold text-zinc-400 mb-1">
              <span>Spread Radius</span>
              <span>{spread}px</span>
            </div>
            <input type="range" min="-20" max="40" value={spread} onChange={(e) => setSpread(parseInt(e.target.value))} className="w-full accent-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between font-semibold text-zinc-400 mb-1">
                <span>Offset X</span>
                <span>{x}px</span>
              </div>
              <input type="range" min="-30" max="30" value={x} onChange={(e) => setX(parseInt(e.target.value))} className="w-full accent-indigo-500" />
            </div>
            <div>
              <div className="flex justify-between font-semibold text-zinc-400 mb-1">
                <span>Offset Y</span>
                <span>{y}px</span>
              </div>
              <input type="range" min="-30" max="30" value={y} onChange={(e) => setY(parseInt(e.target.value))} className="w-full accent-indigo-500" />
            </div>
          </div>
          <div>
            <div className="flex justify-between font-semibold text-zinc-400 mb-1">
              <span>Shadow Opacity</span>
              <span>{opacity}%</span>
            </div>
            <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        </div>
      </div>

      <div className="relative">
        <textarea
          readOnly
          value={`box-shadow: ${getShadowCss()};`}
          className="w-full p-4 pr-12 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-indigo-400 focus:outline-none h-16 resize-none"
        />
        <button
          onClick={() => copy(`box-shadow: ${getShadowCss()};`)}
          className="absolute top-3.5 right-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 p-1.5 rounded-lg border border-zinc-850 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
