import { FileType, ExtractedMetadata, ColorPaletteEntry, PDFPermissions } from '../types';

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format duration
export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  if (ms > 0) {
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Detect file type
export const detectFileType = (file: File): FileType => {
  const mimeType = file.type.toLowerCase();
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'heic', 'heif'].includes(extension)) {
    return 'image';
  }
  if (mimeType === 'application/pdf' || extension === 'pdf') {
    return 'pdf';
  }
  if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'].includes(extension)) {
    return 'audio';
  }
  if (mimeType.startsWith('video/') || ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv'].includes(extension)) {
    return 'video';
  }
  return 'unknown';
};

// Calculate aspect ratio
export const calculateAspectRatio = (width: number, height: number): string => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;

  // Common ratios
  if (Math.abs(w / h - 16 / 9) < 0.01) return '16:9';
  if (Math.abs(w / h - 4 / 3) < 0.01) return '4:3';
  if (Math.abs(w / h - 3 / 2) < 0.01) return '3:2';
  if (Math.abs(w / h - 1) < 0.01) return '1:1';
  if (Math.abs(w / h - 21 / 9) < 0.01) return '21:9';

  return `${w}:${h}`;
};

// Convert DMS to decimal degrees
export const convertDMSToDD = (
  degrees: number,
  minutes: number,
  seconds: number,
  direction: string
): number => {
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (direction === 'S' || direction === 'W') {
    dd = dd * -1;
  }
  return dd;
};

// Format GPS coordinates for display
export const formatGPS = (lat: number, lng: number): string => {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  const latAbs = Math.abs(lat);
  const lngAbs = Math.abs(lng);
  return `${latAbs.toFixed(6)}° ${latDir}, ${lngAbs.toFixed(6)}° ${lngDir}`;
};

// Extract dominant colors from image
export const extractColorPalette = async (
  imageData: string,
  colorCount: number = 8
): Promise<ColorPaletteEntry[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve([]);
        return;
      }

      // Scale down for performance
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorMap = new Map<string, number>();

      // Sample pixels
      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue; // Skip transparent pixels

        // Quantize colors to reduce noise
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;

        const key = `${qr},${qg},${qb}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Sort by frequency
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, colorCount * 2);

      const totalPixels = sortedColors.reduce((sum, [, count]) => sum + count, 0);
      const totalSamples = Math.floor(data.length / 16);

      // Filter out similar colors and format
      const result: ColorPaletteEntry[] = [];
      const minDistance = 50;

      for (const [color, count] of sortedColors) {
        const [r, g, b] = color.split(',').map(Number);
        const hex = rgbToHex(r, g, b);

        // Check if similar to existing colors
        const isDuplicate = result.some((existing) => {
          const distance = Math.sqrt(
            Math.pow(r - existing.rgb.r, 2) +
            Math.pow(g - existing.rgb.g, 2) +
            Math.pow(b - existing.rgb.b, 2)
          );
          return distance < minDistance;
        });

        if (!isDuplicate) {
          result.push({
            hex,
            rgb: { r, g, b },
            percentage: Math.round((count / totalSamples) * 100),
            name: getColorName(hex),
          });
        }

        if (result.length >= colorCount) break;
      }

      resolve(result);
    };

    img.onerror = () => resolve([]);
    img.src = imageData;
  });
};

// RGB to HEX conversion
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
};

// Get color name (simplified)
export const getColorName = (hex: string): string => {
  const colorNames: Record<string, string> = {
    '#000000': 'Black',
    '#ffffff': 'White',
    '#ff0000': 'Red',
    '#00ff00': 'Green',
    '#0000ff': 'Blue',
    '#ffff00': 'Yellow',
    '#ff00ff': 'Magenta',
    '#00ffff': 'Cyan',
    '#808080': 'Gray',
  };
  return colorNames[hex.toLowerCase()] || hex;
};

// Create base64 preview for file
export const createPreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      resolve('');
    }
  });
};

// Create stripped image (no metadata)
export const createStrippedImage = async (file: File): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(null);
            }
          },
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          0.92
        );
      };
      img.onerror = () => resolve(null);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

// Get base metadata structure
export const getBaseMetadata = (file: File): ExtractedMetadata => ({
  fileName: file.name,
  fileSize: file.size,
  fileType: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
  mimeType: file.type || 'Unknown',
});
