import React from 'react';
import {
  Image, FileText, Music, Video, X,
  Loader2, CheckCircle, AlertCircle, MapPin,
} from 'lucide-react';
import { FileItem, FileType } from '../types';
import { formatFileSize } from '../utils/fileUtils';

interface FileCardProps {
  fileItem: FileItem;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

const TYPE_ICON: Record<FileType, React.ReactNode> = {
  image:   <Image   className="w-4 h-4" />,
  pdf:     <FileText className="w-4 h-4" />,
  audio:   <Music   className="w-4 h-4" />,
  video:   <Video   className="w-4 h-4" />,
  unknown: <FileText className="w-4 h-4" />,
};

export const FileCard: React.FC<FileCardProps> = ({ fileItem, isSelected, onSelect, onRemove }) => {
  const hasGPS   = fileItem.metadata.latitude !== undefined;
  const camera   = fileItem.metadata.model || fileItem.metadata.make;
  const duration = fileItem.metadata.duration;
  const pages    = fileItem.metadata.pageCount;

  const statusNode = (() => {
    switch (fileItem.status) {
      case 'processing': return <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />;
      case 'complete':   return <CheckCircle className="w-3.5 h-3.5 text-gold/70" />;
      case 'error':      return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
      default:           return null;
    }
  })();

  return (
    <div
      className={`group relative flex gap-3 p-3 cursor-pointer transition-all duration-200 border-b border-white/5
        ${isSelected
          ? 'bg-white/[0.04] border-l-2 border-l-gold'
          : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'
        }`}
      onClick={onSelect}
    >
      {/* Remove */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-2 right-2 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-cream/30 hover:text-cream/70"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Thumbnail */}
      <div className="flex-shrink-0 relative w-14 h-14 bg-ink-800 overflow-hidden">
        {fileItem.preview ? (
          <img src={fileItem.preview} alt={fileItem.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gold/40">
            {TYPE_ICON[fileItem.type]}
          </div>
        )}
        {fileItem.status === 'processing' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-gold" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <p className="text-xs text-cream/80 font-medium truncate pr-5 leading-snug">
            {fileItem.name}
          </p>
          {statusNode}
        </div>
        <p className="text-[10px] text-cream/35 mt-0.5 tracking-wide">
          {formatFileSize(fileItem.size)}
        </p>

        {fileItem.status === 'complete' && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {camera && (
              <span className="text-[9px] tracking-widest text-gold/70 border border-gold/20 px-1.5 py-0.5">
                {camera}
              </span>
            )}
            {hasGPS && (
              <span className="text-[9px] tracking-widest text-cream/50 border border-white/10 px-1.5 py-0.5 flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" /> GPS
              </span>
            )}
            {duration && (
              <span className="text-[9px] tracking-widest text-cream/50 border border-white/10 px-1.5 py-0.5">
                {duration}
              </span>
            )}
            {pages && (
              <span className="text-[9px] tracking-widest text-cream/50 border border-white/10 px-1.5 py-0.5">
                {pages}p
              </span>
            )}
          </div>
        )}

        {fileItem.status === 'processing' && (
          <div className="progress-track mt-2">
            <div className="progress-fill" style={{ width: `${fileItem.progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
};
