import { jsPDF } from 'jspdf';
import { FileItem, ExtractedMetadata } from '../types';
import { formatFileSize, createStrippedImage } from './fileUtils';

// Export to JSON
export const exportToJSON = (metadata: ExtractedMetadata, fileName: string): void => {
  const json = JSON.stringify(metadata, null, 2);
  downloadFile(json, `${fileName}_metadata.json`, 'application/json');
};

// Export to CSV
export const exportToCSV = (metadata: ExtractedMetadata, fileName: string): void => {
  const rows: string[][] = [
    ['Property', 'Value'],
  ];

  // Add all metadata properties
  const keys = Object.keys(metadata);
  for (const key of keys) {
    if (metadata[key as keyof ExtractedMetadata] !== undefined && metadata[key as keyof ExtractedMetadata] !== null) {
      let value = metadata[key as keyof ExtractedMetadata];

      if (typeof value === 'object' && !Array.isArray(value)) {
        value = JSON.stringify(value);
      } else if (Array.isArray(value)) {
        value = value.join(', ');
      }

      rows.push([key, String(value)]);
    }
  }

  const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadFile(csv, `${fileName}_metadata.csv`, 'text/csv');
};

// Export to PDF
export const exportToPDF = async (fileItem: FileItem): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  const { metadata } = fileItem;

  // Header
  doc.setFillColor(11, 15, 25); // Dark background
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(0, 242, 254); // Teal
  doc.setFontSize(24);
  doc.font = 'helvetica';
  doc.text('EXIF PULSE', margin, 25);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('EXIF PULSE Report', pageWidth - margin, 25, { align: 'right' });
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 35, { align: 'right' });

  y = 50;

  // File info section
  doc.setTextColor(0, 242, 254);
  doc.setFontSize(14);
  doc.text('FILE INFORMATION', margin, y);
  y += 8;

  doc.setDrawColor(0, 242, 254);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);

  const fileInfo = [
    ['File Name', fileItem.name],
    ['File Type', metadata.mimeType || 'Unknown'],
    ['File Size', formatFileSize(metadata.fileSize)],
  ];

  for (const [key, value] of fileInfo) {
    doc.setTextColor(100, 100, 100);
    doc.text(key + ':', margin, y);
    doc.setTextColor(20, 20, 20);
    doc.text(String(value), 80, y);
    y += 7;
  }

  y += 10;

  // Metadata section
  doc.setTextColor(0, 242, 254);
  doc.setFontSize(14);
  doc.text('METADATA', margin, y);
  y += 8;

  doc.setDrawColor(0, 242, 254);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Add metadata fields
  const fields = [
    ['Camera Make', metadata.make],
    ['Camera Model', metadata.model],
    ['Lens', metadata.lens],
    ['Focal Length', metadata.focalLength],
    ['Aperture', metadata.aperture],
    ['ISO', metadata.iso],
    ['Shutter Speed', metadata.shutterSpeed],
    ['Flash', metadata.flash],
    ['Orientation', metadata.orientation],
    ['Software', metadata.software],
    ['Capture Date', metadata.captureDate],
    ['Dimensions', metadata.width && metadata.height ? `${metadata.width} x ${metadata.height}` : undefined],
    ['Megapixels', metadata.megapixels],
    ['Aspect Ratio', metadata.aspectRatio],
    ['GPS Coordinates', metadata.gpsCoordinates],
    // PDF
    ['Page Count', metadata.pageCount],
    ['Title', metadata.title],
    ['Author', metadata.author],
    ['Subject', metadata.subject],
    ['Creator', metadata.creator],
    ['Producer', metadata.producer],
    ['Encrypted', metadata.encrypted !== undefined ? (metadata.encrypted ? 'Yes' : 'No') : undefined],
    // Media
    ['Duration', metadata.duration],
    ['Sample Rate', metadata.audioSampleRate ? `${metadata.audioSampleRate} Hz` : undefined],
    ['Channels', metadata.audioChannels ? `${metadata.audioChannels}` : undefined],
    ['Bitrate', metadata.bitrate ? `${metadata.bitrate} kbps` : undefined],
  ];

  for (const [key, value] of fields) {
    if (value !== undefined && value !== null) {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setTextColor(100, 100, 100);
      doc.text(String(key) + ':', margin, y);
      doc.setTextColor(20, 20, 20);
      const text = typeof value === 'string' ? value : String(value);
      doc.text(text, 80, y);
      y += 7;
    }
  }

  // GPS Map (if coordinates exist)
  if (metadata.latitude && metadata.longitude) {
    y += 10;
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(0, 242, 254);
    doc.setFontSize(14);
    doc.text('LOCATION', margin, y);
    y += 8;

    doc.setDrawColor(0, 242, 254);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setTextColor(100, 100, 100);
    doc.text('Latitude:', margin, y);
    doc.setTextColor(20, 20, 20);
    doc.text(`${metadata.latitude.toFixed(6)}°`, 80, y);
    y += 7;

    doc.setTextColor(100, 100, 100);
    doc.text('Longitude:', margin, y);
    doc.setTextColor(20, 20, 20);
    doc.text(`${metadata.longitude.toFixed(6)}°`, 80, y);
    y += 7;

    doc.setTextColor(100, 100, 100);
    doc.text('Maps URL:', margin, y);
    doc.setTextColor(30, 100, 180);
    const mapsUrl = `https://www.google.com/maps?q=${metadata.latitude},${metadata.longitude}`;
    doc.text(mapsUrl.substring(0, 70), 80, y);
  }

  // Color palette (for images)
  if (metadata.colorPalette && metadata.colorPalette.length > 0) {
    y += 10;
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(0, 242, 254);
    doc.setFontSize(14);
    doc.text('COLOR PALETTE', margin, y);
    y += 8;

    doc.setDrawColor(0, 242, 254);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    const colorWidth = 15;
    const colorsPerRow = 8;
    let x = margin;

    for (let i = 0; i < metadata.colorPalette.length; i++) {
      const color = metadata.colorPalette[i];
      const rgb = color.rgb;

      // Draw color swatch
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.roundedRect(x, y, colorWidth, colorWidth, 2, 2, 'F');

      // Draw border
      doc.setDrawColor(200, 200, 200);
      doc.roundedRect(x, y, colorWidth, colorWidth, 2, 2, 'S');

      // Draw hex below
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(7);
      doc.text(color.hex, x + colorWidth / 2, y + colorWidth + 5, { align: 'center' });

      x += colorWidth + 5;
      if ((i + 1) % colorsPerRow === 0 && i < metadata.colorPalette!.length - 1) {
        x = margin;
        y += colorWidth + 15;
      }
    }
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`${fileItem.name}_report.pdf`);
};

// Download helper
const downloadFile = (content: string, fileName: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Download sanitized image
export const downloadSanitizedImage = async (fileItem: FileItem): Promise<void> => {
  const sanitizedBlob = await createStrippedImage(fileItem.file);

  if (sanitizedBlob) {
    const url = URL.createObjectURL(sanitizedBlob);
    const link = document.createElement('a');
    link.href = url;
    const extension = fileItem.name.split('.').pop() || 'jpg';
    link.download = `sanitized_${fileItem.name.replace(/\.[^.]+$/, '')}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
