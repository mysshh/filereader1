import React, { useMemo, useState } from 'react';
import {
  Camera, Settings, Calendar, Info, FileText,
  MapPin, Code, Shield, Clock, Music, Video, Search,
} from 'lucide-react';
import { ExtractedMetadata, FileType } from '../types';
import { formatFileSize } from '../utils/fileUtils';
import { GPSMap } from './GPSMap';
import { ColorPalette } from './ColorPalette';

interface MetadataPanelProps {
  metadata: ExtractedMetadata;
  fileType: FileType;
}

type TabId = 'overview' | 'technical' | 'location' | 'raw';

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ metadata, fileType }) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [search, setSearch] = useState('');

  const tabs = useMemo(() => {
    const base: { id: TabId; label: string; icon: React.ReactNode }[] = [
      { id: 'overview',  label: 'Overview',  icon: <Info className="w-3.5 h-3.5" /> },
      { id: 'technical', label: 'Technical', icon: <Settings className="w-3.5 h-3.5" /> },
    ];
    if (metadata.latitude !== undefined) {
      base.push({ id: 'location', label: 'Location', icon: <MapPin className="w-3.5 h-3.5" /> });
    }
    base.push({ id: 'raw', label: 'Raw', icon: <Code className="w-3.5 h-3.5" /> });
    return base;
  }, [metadata.latitude]);

  // All searchable entries (for Raw tab)
  const allEntries = useMemo(() => {
    return Object.entries(metadata)
      .filter(([, v]) => v !== undefined && v !== null && typeof v !== 'function')
      .map(([k, v]) => ({
        key: k,
        value: typeof v === 'object' ? JSON.stringify(v) : String(v),
      }));
  }, [metadata]);

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return allEntries;
    const s = search.toLowerCase();
    return allEntries.filter(e => e.key.toLowerCase().includes(s) || e.value.toLowerCase().includes(s));
  }, [allEntries, search]);

  // ── Overview ─────────────────────────────────────────────────────────────
  const overviewItems = useMemo(() => {
    const items: { label: string; value: string | undefined }[] = [
      { label: 'File Name', value: metadata.fileName },
      { label: 'Type',      value: metadata.mimeType },
      { label: 'Size',      value: formatFileSize(metadata.fileSize) },
    ];

    if (fileType === 'image') {
      if (metadata.make || metadata.model) items.push({ label: 'Camera', value: [metadata.make, metadata.model].filter(Boolean).join(' ') });
      if (metadata.captureDate)  items.push({ label: 'Captured',   value: metadata.captureDate });
      if (metadata.width)        items.push({ label: 'Dimensions', value: `${metadata.width} × ${metadata.height}` });
      if (metadata.megapixels)   items.push({ label: 'Resolution', value: metadata.megapixels });
      if (metadata.gpsCoordinates) items.push({ label: 'GPS', value: metadata.gpsCoordinates });
    }
    if (fileType === 'pdf') {
      if (metadata.pageCount) items.push({ label: 'Pages',    value: String(metadata.pageCount) });
      if (metadata.author)    items.push({ label: 'Author',   value: metadata.author });
      if (metadata.title)     items.push({ label: 'Title',    value: metadata.title });
      if (metadata.encrypted !== undefined) items.push({ label: 'Security', value: metadata.encrypted ? 'Password Protected' : 'Not Encrypted' });
    }
    if (fileType === 'audio' || fileType === 'video') {
      if (metadata.duration) items.push({ label: 'Duration', value: metadata.duration });
      if (fileType === 'audio' && metadata.audioSampleRate) items.push({ label: 'Sample Rate', value: `${metadata.audioSampleRate} Hz` });
      if (fileType === 'video' && metadata.width) items.push({ label: 'Resolution', value: `${metadata.width} × ${metadata.height}` });
    }

    return items.filter(i => i.value);
  }, [metadata, fileType]);

  // ── Technical sections ────────────────────────────────────────────────────
  const techSections = useMemo(() => {
    type Section = { title: string; icon: React.ReactNode; rows: { label: string; value: string | undefined }[] };
    const sections: Section[] = [];

    if (fileType === 'image') {
      sections.push({
        title: 'Camera', icon: <Camera className="w-3.5 h-3.5" />,
        rows: [
          { label: 'Make',     value: metadata.make     },
          { label: 'Model',    value: metadata.model    },
          { label: 'Lens',     value: metadata.lens     },
          { label: 'Software', value: metadata.software },
        ],
      });
      sections.push({
        title: 'Exposure', icon: <Settings className="w-3.5 h-3.5" />,
        rows: [
          { label: 'Focal Length',  value: metadata.focalLength },
          { label: 'Aperture',      value: metadata.aperture    },
          { label: 'ISO',           value: metadata.iso?.toString() },
          { label: 'Shutter Speed', value: metadata.shutterSpeed },
          { label: 'Flash',         value: metadata.flash       },
        ],
      });
      sections.push({
        title: 'Image', icon: <Info className="w-3.5 h-3.5" />,
        rows: [
          { label: 'Width',        value: metadata.width?.toString() },
          { label: 'Height',       value: metadata.height?.toString() },
          { label: 'Megapixels',   value: metadata.megapixels   },
          { label: 'Aspect Ratio', value: metadata.aspectRatio  },
          { label: 'Orientation',  value: metadata.orientation?.toString() },
          { label: 'Color Space',  value: metadata.colorSpace   },
          { label: 'Bit Depth',    value: metadata.bitDepth?.toString() },
        ],
      });
      sections.push({
        title: 'Dates', icon: <Calendar className="w-3.5 h-3.5" />,
        rows: [
          { label: 'Captured', value: metadata.captureDate },
          { label: 'Modified', value: metadata.modifyDate  },
        ],
      });
    }

    if (fileType === 'pdf') {
      sections.push({
        title: 'Document', icon: <FileText className="w-3.5 h-3.5" />,
        rows: [
          { label: 'Title',    value: metadata.title    },
          { label: 'Author',   value: metadata.author   },
          { label: 'Subject',  value: metadata.subject  },
          { label: 'Keywords', value: metadata.keywords },
          { label: 'Creator',  value: metadata.creator  },
          { label: 'Producer', value: metadata.producer },
          { label: 'Pages',    value: metadata.pageCount?.toString() },
          { label: 'Created',  value: metadata.creationDate   },
          { label: 'Modified', value: metadata.modificationDate },
        ],
      });
      sections.push({
        title: 'Security', icon: <Shield className="w-3.5 h-3.5" />,
        rows: [
          { label: 'Encrypted',  value: metadata.encrypted !== undefined ? (metadata.encrypted ? 'Yes' : 'No') : undefined },
          { label: 'Can Print',  value: metadata.permissions?.canPrint  !== undefined ? (metadata.permissions.canPrint  ? 'Yes' : 'No') : undefined },
          { label: 'Can Copy',   value: metadata.permissions?.canCopy   !== undefined ? (metadata.permissions.canCopy   ? 'Yes' : 'No') : undefined },
          { label: 'Can Modify', value: metadata.permissions?.canModify !== undefined ? (metadata.permissions.canModify ? 'Yes' : 'No') : undefined },
        ],
      });
    }

    if (fileType === 'audio' || fileType === 'video') {
      const mediaRows = [
        { label: 'Duration', value: metadata.duration },
        { label: 'Bitrate',  value: metadata.bitrate ? `${metadata.bitrate} kbps` : undefined },
      ];
      if (fileType === 'audio') {
        mediaRows.push(
          { label: 'Sample Rate', value: metadata.audioSampleRate ? `${metadata.audioSampleRate} Hz` : undefined },
          { label: 'Channels',    value: metadata.audioChannels?.toString() },
        );
      }
      if (fileType === 'video') {
        mediaRows.push(
          { label: 'Resolution',   value: metadata.width ? `${metadata.width} × ${metadata.height}` : undefined },
          { label: 'Aspect Ratio', value: metadata.aspectRatio },
        );
      }
      sections.push({
        title: fileType === 'audio' ? 'Audio' : 'Video',
        icon:  fileType === 'audio' ? <Music className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />,
        rows: mediaRows,
      });
    }

    return sections;
  }, [metadata, fileType]);

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-white/8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {overviewItems.map((item, i) => (
                <div key={i} className="p-3 bg-white/[0.03] border border-white/5 hover:border-gold/20 transition-colors duration-200">
                  <p className="text-[9px] tracking-widest text-cream/35 mb-1">{item.label}</p>
                  <p className="text-xs text-cream/80 font-medium leading-snug break-words">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Color palette */}
            {metadata.colorPalette && metadata.colorPalette.length > 0 && (
              <div className="border border-white/8 p-4">
                <ColorPalette colors={metadata.colorPalette} />
              </div>
            )}
          </>
        )}

        {/* TECHNICAL */}
        {activeTab === 'technical' && (
          <div className="space-y-4">
            {techSections.map((sec, i) => {
              const validRows = sec.rows.filter(r => r.value);
              if (!validRows.length) return null;
              return (
                <div key={i} className="border border-white/8">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.02] border-b border-white/8">
                    <span className="text-gold/70">{sec.icon}</span>
                    <p className="label-track text-cream/50">{sec.title}</p>
                  </div>
                  <div>
                    {validRows.map((row, j) => (
                      <div key={j} className="meta-row">
                        <span className="meta-key">{row.label}</span>
                        <span className="meta-value">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LOCATION */}
        {activeTab === 'location' && (
          <div className="border border-white/8 p-4">
            {metadata.latitude !== undefined && metadata.longitude !== undefined ? (
              <GPSMap
                latitude={metadata.latitude}
                longitude={metadata.longitude}
                altitude={metadata.altitude}
              />
            ) : (
              <div className="py-12 text-center">
                <MapPin className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-cream/30 text-sm">No GPS data in this file</p>
              </div>
            )}
          </div>
        )}

        {/* RAW */}
        {activeTab === 'raw' && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter metadata…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-mystic pl-9"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cream/30" />
            </div>

            <div className="border border-white/8 overflow-hidden">
              <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/8 flex items-center justify-between">
                <p className="label-track text-cream/40">Raw Metadata</p>
                <span className="text-[10px] text-cream/30">{filteredEntries.length} fields</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filteredEntries.map((entry, i) => (
                  <div key={i} className="meta-row">
                    <span className="meta-key pr-4 shrink-0">{entry.key}</span>
                    <span className="meta-value text-xs break-all max-w-[55%]">
                      {entry.value.length > 120 ? entry.value.slice(0, 120) + '…' : entry.value}
                    </span>
                  </div>
                ))}
                {!filteredEntries.length && (
                  <p className="py-8 text-center text-cream/30 text-xs">No matches</p>
                )}
              </div>
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(metadata, null, 2))}
              className="btn-ghost-gold w-full justify-center py-2.5 border border-white/8 hover:border-gold/25"
            >
              Copy JSON to Clipboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
