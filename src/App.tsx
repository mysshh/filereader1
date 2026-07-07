import React, { useState, useCallback, useRef } from 'react';
import {
  Scan, X, Layers, ZoomIn, Trash2,
  ChevronRight, Shield,
} from 'lucide-react';
import { FileItem } from './types';
import {
  generateId, detectFileType, createPreview,
} from './utils/fileUtils';
import { extractImageMetadata } from './utils/exifUtils';
import { extractPDFMetadata } from './utils/pdfUtils';
import { extractMediaMetadata } from './utils/mediaUtils';

import { LandingHero } from './components/LandingHero';
import {
  LandingFeatures,
  LandingShowcaseBand,
  LandingFormats,
  LandingPrivacyBand,
} from './components/LandingFeatures';
import { FileCard } from './components/FileCard';
import { MetadataPanel } from './components/MetadataPanel';
import { ExportToolbar } from './components/ExportToolbar';
import { DropZone } from './components/DropZone';
import { StarField } from './components/StarField';

function App() {
  const [files, setFiles]               = useState<FileItem[]>([]);
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview]           = useState<string | null>(null);
  const dashRef = useRef<HTMLDivElement>(null);

  const selected = files.find(f => f.id === selectedId) ?? null;

  // ── Process dropped/chosen files ───────────────────────────────────────────
  const processFiles = useCallback(async (newFiles: File[]) => {
    setIsProcessing(true);

    const items: FileItem[] = newFiles.map(file => ({
      id:       generateId(),
      file,
      name:     file.name,
      type:     detectFileType(file),
      size:     file.size,
      preview:  '',
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.name.split('.').pop()?.toUpperCase() ?? 'Unknown',
        mimeType: file.type || 'Unknown',
      },
      status:   'pending' as const,
      progress: 0,
    }));

    setFiles(prev => [...items, ...prev]);

    if (!selectedId && items.length > 0) {
      setSelectedId(items[0].id);
      // Scroll to dashboard
      setTimeout(() => dashRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }

    for (const item of items) {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'processing', progress: 15 } : f));

      try {
        let previewUrl = '';
        if (item.type === 'image') {
          previewUrl = await createPreview(item.file);
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, preview: previewUrl, progress: 35 } : f));
        }

        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress: 50 } : f));

        let metadata = item.metadata;
        if (item.type === 'image')                            metadata = await extractImageMetadata(item.file, previewUrl);
        else if (item.type === 'pdf')                         metadata = await extractPDFMetadata(item.file);
        else if (item.type === 'audio' || item.type === 'video') metadata = await extractMediaMetadata(item.file);

        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, metadata, status: 'complete', progress: 100 } : f));
      } catch {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error' } : f));
      }
    }

    setIsProcessing(false);
    dashRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedId]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selectedId === id) {
      const remaining = files.filter(f => f.id !== id);
      setSelectedId(remaining[0]?.id ?? null);
    }
  };

  const clearAll = () => { setFiles([]); setSelectedId(null); };

  // ── Layout helpers ─────────────────────────────────────────────────────────
  const hasDashboard = files.length > 0;

  return (
    <div className="min-h-screen bg-ink-900">

      {/* ══ GLOBAL HEADER ════════════════════════════════════════════════════ */}
      <header
        className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/[0.06]"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        {/* Top announcement bar (like the reference template) */}
        <div className="text-center py-1.5 bg-gold/10 border-b border-gold/15">
          <p className="label-track text-gold/70 text-[10px]">
            100% local & private · files never leave your device · zero data collected
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => { clearAll(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <div className="relative w-9 h-9">
              <div
                className="w-9 h-9 flex items-center justify-center border"
                style={{ borderColor: 'rgba(201,169,110,0.4)', background: 'rgba(201,169,110,0.07)' }}
              >
                <Scan className="w-4 h-4 text-gold" />
              </div>
            </div>
            <div>
              <p className="heading-display text-xl text-cream leading-none tracking-[0.2em]">
                EXIF PULSE
              </p>
              <p className="text-[9px] tracking-ultra text-cream/30 mt-0.5">
                FILE FORENSICS
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {['FEATURES', 'FORMATS', 'PRIVACY', 'HOW IT WORKS'].map(link => (
              <button key={link} className="btn-ghost-gold">
                {link}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {hasDashboard && (
              <>
                <span className="text-[10px] tracking-widest text-cream/30">
                  {files.length} file{files.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={clearAll}
                  className="btn-ghost-gold text-red-400/60 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
            <button
              onClick={() => dashRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-gold hidden sm:inline-flex"
            >
              Analyze Now
            </button>
          </div>
        </div>
      </header>

      {/* ══ LANDING HERO ═════════════════════════════════════════════════════ */}
      <div className="pt-[88px]">
        <LandingHero onFilesDropped={processFiles} />
      </div>

      {/* ══ FEATURES GRID (white section, like "SHOP OUR NEW PRODUCTS") ══════ */}
      <LandingFeatures />

      {/* ══ DARK SHOWCASE BAND (like the arched "NEW PRODUCTS" section) ══════ */}
      <LandingShowcaseBand onAnalyze={() => dashRef.current?.scrollIntoView({ behavior: 'smooth' })} />

      {/* ══ FORMATS COLLECTION GRID (like "SHOP OUR COLLECTIONS") ═══════════ */}
      <LandingFormats onAnalyze={() => dashRef.current?.scrollIntoView({ behavior: 'smooth' })} />

      {/* ══ PRIVACY / TOOLS BAND ═════════════════════════════════════════════ */}
      <LandingPrivacyBand />

      {/* ══ DASHBOARD (analysis interface) ══════════════════════════════════ */}
      <div ref={dashRef} className="relative bg-ink-900 min-h-screen border-t border-white/5">
        <StarField />

        {/* Dashboard header */}
        <div className="relative border-b border-white/8 px-6 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="label-track text-gold/60 mb-1">Analysis Dashboard</p>
              <h2 className="heading-display text-2xl text-cream">
                {hasDashboard ? `${files.filter(f => f.status === 'complete').length} of ${files.length} files analyzed` : 'Drop files to begin analysis'}
              </h2>
            </div>

            {hasDashboard && (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xl font-display font-light text-gold">{files.filter(f => f.status === 'complete').length}</p>
                  <p className="text-[9px] tracking-widest text-cream/30">Complete</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-display font-light text-cream/50">{files.filter(f => f.metadata.latitude !== undefined).length}</p>
                  <p className="text-[9px] tracking-widest text-cream/30">GPS Found</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-display font-light text-cream/50">{files.filter(f => f.type === 'image').length}</p>
                  <p className="text-[9px] tracking-widest text-cream/30">Images</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {!hasDashboard ? (
          /* Empty — show large drop zone */
          <div className="relative max-w-xl mx-auto py-20 px-6">
            <div className="border border-white/8 p-2">
              <DropZone onFilesDropped={processFiles} isProcessing={isProcessing} />
            </div>
          </div>
        ) : (
          /* Split pane dashboard */
          <div className="flex" style={{ minHeight: 'calc(100vh - 200px)' }}>

            {/* ─── LEFT: File queue ──────────────────────────────────────── */}
            <div
              className="w-72 flex-shrink-0 border-r border-white/8 flex flex-col"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              {/* Compact drop zone */}
              <div className="border-b border-white/8 p-3">
                <DropZone onFilesDropped={processFiles} isProcessing={isProcessing} compact />
              </div>

              {/* File list */}
              <div className="flex-1 overflow-y-auto">
                {files.map(file => (
                  <FileCard
                    key={file.id}
                    fileItem={file}
                    isSelected={file.id === selectedId}
                    onSelect={() => setSelectedId(file.id)}
                    onRemove={() => removeFile(file.id)}
                  />
                ))}
              </div>
            </div>

            {/* ─── CENTER: Metadata panel ────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
              {selected ? (
                <>
                  {/* File header */}
                  <div
                    className="px-5 py-4 border-b border-white/8 flex items-start gap-4"
                    style={{ background: 'rgba(0,0,0,0.2)' }}
                  >
                    {/* Thumb */}
                    {selected.preview ? (
                      <div
                        className="relative w-16 h-16 flex-shrink-0 overflow-hidden cursor-pointer group"
                        onClick={() => setPreview(selected.preview!)}
                      >
                        <img src={selected.preview} alt={selected.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-4 h-4 text-gold" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-16 h-16 flex-shrink-0 bg-ink-800 border border-white/8 flex items-center justify-center">
                        <Layers className="w-6 h-6 text-cream/20" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-base text-cream font-medium truncate">{selected.name}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[10px] tracking-widest border border-gold/30 text-gold px-2 py-0.5">
                          {selected.metadata.fileType}
                        </span>
                        <span className="text-[10px] text-cream/35">
                          {(selected.size / 1024).toFixed(1)} KB
                        </span>
                        {selected.metadata.width && (
                          <span className="text-[10px] text-cream/35">
                            {selected.metadata.width} × {selected.metadata.height}
                          </span>
                        )}
                        {selected.metadata.duration && (
                          <span className="text-[10px] text-cream/35">{selected.metadata.duration}</span>
                        )}
                        {selected.metadata.pageCount && (
                          <span className="text-[10px] text-cream/35">{selected.metadata.pageCount} pages</span>
                        )}
                      </div>
                    </div>

                    {/* File nav arrows */}
                    <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                      {files.map((f, i) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedId(f.id)}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                            f.id === selectedId ? 'bg-gold' : 'bg-white/15 hover:bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tabs + content */}
                  <div className="flex-1 overflow-hidden">
                    <MetadataPanel
                      metadata={selected.metadata}
                      fileType={selected.type}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-cream/20 text-sm tracking-widest">SELECT A FILE</p>
                </div>
              )}
            </div>

            {/* ─── RIGHT: Export sidebar ─────────────────────────────────── */}
            {selected && (
              <div
                className="w-56 flex-shrink-0 border-l border-white/8 p-5 overflow-y-auto"
                style={{ background: 'rgba(0,0,0,0.3)' }}
              >
                <ExportToolbar fileItem={selected} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer className="relative bg-ink-950 border-t border-white/5 py-12 px-6 text-center overflow-hidden">
        <StarField />
        <div className="relative">
          <p className="heading-display text-2xl text-cream/20 mb-2 tracking-widest">EXIF PULSE</p>
          <p className="text-[10px] tracking-ultra text-cream/15">
            ALL PROCESSING IS LOCAL · ZERO DATA COLLECTION · OPEN SOURCE
          </p>
          <div className="mt-6 flex items-center justify-center gap-6">
            <Shield className="w-4 h-4 text-gold/30" />
            <p className="text-[9px] text-cream/20 tracking-widest">
              © {new Date().getFullYear()} EXIF PULSE
            </p>
          </div>
        </div>
      </footer>

      {/* ══ LIGHTBOX ═════════════════════════════════════════════════════════ */}
      {preview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={() => setPreview(null)}
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-5 right-5 p-2 border border-white/15 text-cream/50 hover:text-cream hover:border-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
            style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.7)' }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default App;
