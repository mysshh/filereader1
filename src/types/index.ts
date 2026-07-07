export type FileType = 'image' | 'pdf' | 'audio' | 'video' | 'unknown';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  type: FileType;
  size: number;
  preview?: string;
  metadata: ExtractedMetadata;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress: number;
}

export interface ExtractedMetadata {
  // Common fields
  fileName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;

  // Image EXIF
  make?: string;
  model?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  iso?: number;
  shutterSpeed?: string;
  software?: string;
  flash?: string;
  orientation?: number;
  captureDate?: string;
  modifyDate?: string;

  // GPS
  latitude?: number;
  longitude?: number;
  altitude?: number;
  gpsCoordinates?: string;

  // Image dimensions
  width?: number;
  height?: number;
  megapixels?: string;
  aspectRatio?: string;
  colorSpace?: string;
  bitDepth?: number;

  // PDF
  pdfVersion?: string;
  pageCount?: number;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  encrypted?: boolean;
  permissions?: PDFPermissions;

  // Media
  duration?: string;
  durationSeconds?: number;
  audioSampleRate?: number;
  audioChannels?: number;
  videoCodec?: string;
  audioCodec?: string;
  bitrate?: number;

  // Raw metadata
  raw?: Record<string, unknown>;
  allTags?: string[];

  // Color palette (for images)
  colorPalette?: ColorPaletteEntry[];
}

export interface PDFPermissions {
  canPrint?: boolean;
  canCopy?: boolean;
  canModify?: boolean;
  canAnnotate?: boolean;
  canFillForms?: boolean;
  canExtract?: boolean;
  canAssemble?: boolean;
  canPrintHighQuality?: boolean;
}

export interface ColorPaletteEntry {
  hex: string;
  rgb: { r: number; g: number; b: number };
  percentage: number;
  name?: string;
}

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}
