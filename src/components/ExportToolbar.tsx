import React from 'react';
import { Download, FileJson, FileSpreadsheet, FileText, Shield } from 'lucide-react';
import { FileItem } from '../types';
import { exportToJSON, exportToCSV, exportToPDF, downloadSanitizedImage } from '../utils/exportUtils';

interface ExportToolbarProps {
  fileItem: FileItem;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({ fileItem }) => {
  const canSanitize = fileItem.type === 'image';

  return (
    <div className="space-y-5">
      {/* Export */}
      <div>
        <p className="label-track text-gold/60 mb-3 flex items-center gap-2">
          <Download className="w-3 h-3" />
          Export Report
        </p>
        <div className="space-y-2">
          {[
            { icon: <FileJson className="w-3.5 h-3.5" />,        label: 'JSON',       action: () => exportToJSON(fileItem.metadata, fileItem.name) },
            { icon: <FileSpreadsheet className="w-3.5 h-3.5" />, label: 'CSV',        action: () => exportToCSV(fileItem.metadata, fileItem.name)  },
            { icon: <FileText className="w-3.5 h-3.5" />,        label: 'PDF Report', action: () => exportToPDF(fileItem)                          },
          ].map(({ icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center gap-3 px-3 py-2.5 border border-white/8 text-cream/50 text-xs
                         tracking-widest uppercase hover:border-gold/25 hover:text-cream/80 transition-all duration-200"
            >
              <span className="text-gold/50">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy */}
      {canSanitize && (
        <div className="border-t border-white/8 pt-5">
          <p className="label-track text-gold/60 mb-2 flex items-center gap-2">
            <Shield className="w-3 h-3" />
            Privacy
          </p>
          <p className="text-[10px] text-cream/30 leading-relaxed mb-3">
            Re-render image without EXIF, GPS, or metadata and download clean copy.
          </p>
          <button
            onClick={() => downloadSanitizedImage(fileItem)}
            className="btn-gold w-full"
          >
            <Shield className="w-3 h-3" />
            Strip & Download
          </button>
        </div>
      )}
    </div>
  );
};
