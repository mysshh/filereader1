import React, { useState, useRef } from 'react';
import { Upload, Scan, ChevronDown, Shield } from 'lucide-react';
import { StarField, ConstellationSVG } from './StarField';

interface LandingHeroProps {
  onFilesDropped: (files: File[]) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onFilesDropped }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (active) {
      setIsDragActive(true);
    } else if (!dropRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) onFilesDropped(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onFilesDropped(files);
    e.target.value = '';
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-ink-900">
      {/* Star field background */}
      <StarField dense />

      {/* Side constellations */}
      <div className="absolute left-0 top-0 w-48 h-full pointer-events-none opacity-30 hidden lg:block">
        <ConstellationSVG side="left" />
      </div>
      <div className="absolute right-0 top-0 w-48 h-full pointer-events-none opacity-30 hidden lg:block">
        <ConstellationSVG side="right" />
      </div>

      {/* Radial glow behind content */}
      <div
        className="absolute inset-x-0 top-0 h-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(201,169,110,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Horizontal scan line (decorative) */}
      <div
        className="absolute inset-x-0 h-px pointer-events-none"
        style={{
          top: '60%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.15) 30%, rgba(201,169,110,0.15) 70%, transparent 100%)',
        }}
      />

      {/* Hero content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">

        {/* Eyebrow label */}
        <p className="label-track mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          Advanced File Forensics
        </p>

        {/* Main title */}
        <h1
          className="heading-display text-5xl sm:text-7xl lg:text-8xl text-cream mb-3 leading-none animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          EXIF
        </h1>
        <h1
          className="heading-display text-5xl sm:text-7xl lg:text-8xl text-gold-gradient mb-6 leading-none animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          PULSE
        </h1>

        {/* Ornament */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="h-px w-16 bg-gold/30" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(201,169,110,0.7)">
            <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" />
          </svg>
          <div className="h-px w-16 bg-gold/30" />
        </div>

        {/* Subtitle */}
        <p
          className="label-track text-cream/50 mb-12 animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          Reveal every secret hidden in your files
        </p>

        {/* Drop zone */}
        <div
          ref={dropRef}
          className={`drop-mystic relative w-full max-w-lg mx-auto p-10 flex flex-col items-center justify-center animate-fade-up`}
          style={{
            animationDelay: '0.55s',
            minHeight: 220,
            borderColor: isDragActive || isHover ? 'rgba(201,169,110,0.5)' : undefined,
            boxShadow: isDragActive ? '0 0 40px rgba(201,169,110,0.2), inset 0 0 40px rgba(201,169,110,0.05)' : undefined,
          }}
          onDragEnter={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={handleDrop}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={() => inputRef.current?.click()}
        >
          {/* Corner decorations */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <span
              key={i}
              className={`absolute ${pos} w-4 h-4 transition-colors duration-300`}
              style={{
                borderTop: i < 2 ? `2px solid ${isDragActive || isHover ? 'rgba(201,169,110,0.6)' : 'rgba(255,255,255,0.15)'}` : 'none',
                borderBottom: i >= 2 ? `2px solid ${isDragActive || isHover ? 'rgba(201,169,110,0.6)' : 'rgba(255,255,255,0.15)'}` : 'none',
                borderLeft: i % 2 === 0 ? `2px solid ${isDragActive || isHover ? 'rgba(201,169,110,0.6)' : 'rgba(255,255,255,0.15)'}` : 'none',
                borderRight: i % 2 !== 0 ? `2px solid ${isDragActive || isHover ? 'rgba(201,169,110,0.6)' : 'rgba(255,255,255,0.15)'}` : 'none',
              }}
            />
          ))}

          {/* Scan overlay when dragging */}
          {isDragActive && (
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              <div
                className="absolute left-0 right-0 h-24"
                style={{
                  background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.15), transparent)',
                  animation: 'scanLine 1.5s ease-in-out infinite',
                }}
              />
            </div>
          )}

          <div
            className={`mb-5 transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}
          >
            <div
              className="w-16 h-16 border rounded-full flex items-center justify-center"
              style={{
                borderColor: isDragActive || isHover ? 'rgba(201,169,110,0.5)' : 'rgba(255,255,255,0.1)',
                background: isDragActive || isHover ? 'rgba(201,169,110,0.08)' : 'transparent',
                boxShadow: isDragActive ? '0 0 20px rgba(201,169,110,0.2)' : 'none',
              }}
            >
              {isDragActive
                ? <Scan className="w-7 h-7 text-gold animate-pulse" />
                : <Upload className="w-7 h-7 text-cream/40" />
              }
            </div>
          </div>

          <p className={`text-sm font-sans font-medium mb-2 transition-colors duration-300 ${isDragActive ? 'text-gold' : 'text-cream/60'}`}>
            {isDragActive ? 'Release to begin analysis' : 'Drop files here to begin'}
          </p>
          <p className="text-xs text-cream/30 tracking-wider">
            Images · PDFs · Audio · Video
          </p>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {['JPG', 'PNG', 'HEIC', 'PDF', 'MP3', 'MP4', 'WAV', 'MOV'].map(f => (
              <span
                key={f}
                className="text-[10px] tracking-widest px-2.5 py-1 border border-white/8 text-cream/35"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Browse button */}
        <button
          onClick={() => inputRef.current?.click()}
          className="btn-gold mt-6 animate-fade-in"
          style={{ animationDelay: '0.65s' }}
        >
          <Upload className="w-3 h-3" />
          Browse Files
        </button>

        {/* Privacy notice */}
        <p className="mt-6 flex items-center gap-2 text-[11px] text-cream/30 tracking-widest animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <Shield className="w-3 h-3 text-gold/50" />
          100% LOCAL & PRIVATE — FILES NEVER LEAVE YOUR DEVICE
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="relative flex justify-center pb-8 animate-float">
        <ChevronDown className="w-5 h-5 text-gold/30" />
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,.pdf,audio/*,video/*"
      />
    </div>
  );
};
