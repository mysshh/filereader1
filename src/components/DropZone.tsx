import React, { useRef, useState } from 'react';
import { Upload, Scan, Shield } from 'lucide-react';

interface DropZoneProps {
  onFilesDropped: (files: File[]) => void;
  isProcessing: boolean;
  compact?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesDropped, isProcessing, compact = false }) => {
  const [isDrag, setIsDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef  = useRef<HTMLDivElement>(null);

  const onDragEnter = (e: React.DragEvent) => { e.preventDefault(); setIsDrag(true); };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!zoneRef.current?.contains(e.relatedTarget as Node)) setIsDrag(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFilesDropped(files);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFilesDropped(files);
    e.target.value = '';
  };

  return (
    <div
      ref={zoneRef}
      className={`drop-mystic flex flex-col items-center justify-center text-center transition-all duration-300
        ${compact ? 'p-5 min-h-[120px]' : 'p-8 min-h-[200px]'}
        ${isDrag ? 'shadow-gold' : ''}
      `}
      style={{
        borderColor: isDrag ? 'rgba(201,169,110,0.5)' : undefined,
        background: isDrag ? 'radial-gradient(ellipse at center, rgba(201,169,110,0.1) 0%, transparent 70%)' : undefined,
      }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      {/* Scan overlay */}
      {isDrag && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-0 right-0 h-16"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.12), transparent)',
              animation: 'scanLine 1.2s ease-in-out infinite',
            }}
          />
        </div>
      )}

      <div className={`mb-3 transition-all duration-300 ${isDrag ? 'scale-110' : ''}`}>
        <div
          className="w-10 h-10 border rounded-full flex items-center justify-center"
          style={{
            borderColor: isDrag ? 'rgba(201,169,110,0.5)' : 'rgba(255,255,255,0.1)',
            background:  isDrag ? 'rgba(201,169,110,0.08)' : 'transparent',
          }}
        >
          {isDrag
            ? <Scan   className="w-5 h-5 text-gold animate-pulse" />
            : <Upload className="w-5 h-5 text-cream/30" />
          }
        </div>
      </div>

      {!compact && (
        <p className={`text-xs font-sans mb-1 transition-colors duration-200 ${isDrag ? 'text-gold' : 'text-cream/40'}`}>
          {isDrag ? 'Release to analyze' : 'Drop files here'}
        </p>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        className="btn-ghost-gold text-[10px]"
        disabled={isProcessing}
      >
        or browse files
      </button>

      {!compact && (
        <p className="mt-3 flex items-center gap-1.5 text-[10px] text-cream/25 tracking-widest">
          <Shield className="w-3 h-3 text-gold/30" />
          100% LOCAL · PRIVATE
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={onChange}
        accept="image/*,.pdf,audio/*,video/*"
        disabled={isProcessing}
      />
    </div>
  );
};
