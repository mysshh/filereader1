import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { ColorPaletteEntry } from '../types';

export const ColorPalette: React.FC<{ colors: ColorPaletteEntry[] }> = ({ colors }) => {
  const [copied, setCopied] = useState<number | null>(null);

  if (!colors?.length) return null;

  const copy = async (hex: string, i: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(i);
      setTimeout(() => setCopied(null), 1400);
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-3">
      <p className="label-track text-gold/70">Dominant Colors</p>

      {/* Gradient bar */}
      <div className="flex h-8 overflow-hidden" style={{ borderRadius: 2 }}>
        {colors.map((c, i) => (
          <div
            key={i}
            className="transition-all duration-300 hover:flex-grow cursor-pointer"
            style={{ background: c.hex, flex: c.percentage || 1 }}
            onClick={() => copy(c.hex, i)}
            title={c.hex}
          />
        ))}
      </div>

      {/* Swatches */}
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color, i) => (
          <div key={i} className="group cursor-pointer" onClick={() => copy(color.hex, i)}>
            <div
              className="w-full h-10 transition-transform duration-150 group-hover:scale-[1.04] flex items-center justify-center"
              style={{
                background: color.hex,
                borderRadius: 2,
                boxShadow: `0 4px 12px ${color.hex}40`,
              }}
            >
              {copied === i && <Check className="w-4 h-4 text-white/80" strokeWidth={2.5} />}
            </div>
            <p className="text-[10px] font-mono text-cream/50 text-center mt-1">
              {color.hex.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ColorBar: React.FC<{ colors: ColorPaletteEntry[] }> = ({ colors }) => {
  if (!colors?.length) return null;
  return (
    <div className="flex gap-1">
      {colors.slice(0, 5).map((c, i) => (
        <div
          key={i}
          className="w-3.5 h-3.5 rounded-full transition-transform hover:scale-110"
          style={{ background: c.hex }}
          title={c.hex}
        />
      ))}
    </div>
  );
};
