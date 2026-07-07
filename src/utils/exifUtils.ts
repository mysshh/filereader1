import EXIF from 'exif-js';
import { ExtractedMetadata, GPSCoordinates } from '../types';
import {
  getBaseMetadata,
  calculateAspectRatio,
  convertDMSToDD,
  extractColorPalette,
  formatGPS,
} from './fileUtils';

// Extract EXIF data from image
export const extractImageMetadata = async (
  file: File,
  previewUrl: string
): Promise<ExtractedMetadata> => {
  const base = getBaseMetadata(file);
  let metadata: ExtractedMetadata = { ...base };

  return new Promise((resolve) => {
    const img = new Image();

    img.onload = async () => {
      // Basic image properties
      metadata.width = img.naturalWidth;
      metadata.height = img.naturalHeight;
      metadata.megapixels = ((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(1) + ' MP';
      metadata.aspectRatio = calculateAspectRatio(img.naturalWidth, img.naturalHeight);

      // Extract color palette
      if (previewUrl) {
        try {
          metadata.colorPalette = await extractColorPalette(previewUrl, 8);
        } catch {
          // Color extraction failed, continue without it
        }
      }

      // Extract EXIF data
      try {
        EXIF.getData(img as unknown as string, function () {
          const allData = EXIF.getAllTags(this as unknown as string);

          metadata.raw = allData;
          metadata.allTags = Object.keys(allData);

          // Camera info
          metadata.make = EXIF.getTag(this as unknown as string, 'Make') || undefined;
          metadata.model = EXIF.getTag(this as unknown as string, 'Model') || undefined;
          metadata.lens = EXIF.getTag(this as unknown as string, 'LensModel') as string | undefined;

          // Exposure settings
          const focalLength = EXIF.getTag(this as unknown as string, 'FocalLength');
          if (focalLength) {
            metadata.focalLength = typeof focalLength === 'number'
              ? `${focalLength}mm`
              : `${focalLength}`;
          }

          const fNumber = EXIF.getTag(this as unknown as string, 'FNumber');
          if (fNumber) {
            metadata.aperture = typeof fNumber === 'number'
              ? `f/${fNumber.toFixed(1)}`
              : `f/${fNumber}`;
          }

          const iso = EXIF.getTag(this as unknown as string, 'ISOSpeedRatings');
          metadata.iso = typeof iso === 'number' ? iso : undefined;

          const shutterSpeed = EXIF.getTag(this as unknown as string, 'ExposureTime');
          if (shutterSpeed) {
            metadata.shutterSpeed = typeof shutterSpeed === 'number'
              ? formatShutterSpeed(shutterSpeed)
              : String(shutterSpeed);
          }

          metadata.software = EXIF.getTag(this as unknown as string, 'Software') as string | undefined;

          const flash = EXIF.getTag(this as unknown as string, 'Flash');
          if (flash !== undefined) {
            metadata.flash = formatFlash(flash);
          }

          metadata.orientation = EXIF.getTag(this as unknown as string, 'Orientation') as number | undefined;

          metadata.colorSpace = EXIF.getTag(this as unknown as string, 'ColorSpace') as string | undefined;

          // Dates
          const dateTimeOriginal = EXIF.getTag(this as unknown as string, 'DateTimeOriginal');
          if (dateTimeOriginal) {
            metadata.captureDate = formatDate(dateTimeOriginal as string);
          }

          const modifyDate = EXIF.getTag(this as unknown as string, 'DateTime');
          if (modifyDate) {
            metadata.modifyDate = formatDate(modifyDate as string);
          }

          // GPS
          const gpsData = extractGPSFromExif(this as unknown as string);
          if (gpsData) {
            metadata.latitude = gpsData.latitude;
            metadata.longitude = gpsData.longitude;
            metadata.altitude = gpsData.altitude;
            metadata.gpsCoordinates = formatGPS(gpsData.latitude, gpsData.longitude);
          }

          // Bit depth
          metadata.bitDepth = EXIF.getTag(this as unknown as string, 'BitsPerSample') as number | undefined;

          resolve(metadata);
        });
      } catch (error) {
        // EXIF extraction failed, return what we have
        resolve(metadata);
      }
    };

    img.onerror = () => resolve(metadata);
    img.src = previewUrl;
  });
};

// Extract GPS from EXIF tags
const extractGPSFromExif = (img: unknown): GPSCoordinates | null => {
  try {
    // @ts-expect-error - EXIF types are not accurate
    const gpsLatitude = EXIF.getTag(img, 'GPSLatitude');
    // @ts-expect-error - EXIF types are not accurate
    const gpsLatitudeRef = EXIF.getTag(img, 'GPSLatitudeRef') as string;
    // @ts-expect-error - EXIF types are not accurate
    const gpsLongitude = EXIF.getTag(img, 'GPSLongitude');
    // @ts-expect-error - EXIF types are not accurate
    const gpsLongitudeRef = EXIF.getTag(img, 'GPSLongitudeRef') as string;
    // @ts-expect-error - EXIF types are not accurate
    const gpsAltitude = EXIF.getTag(img, 'GPSAltitude') as number;
    // @ts-expect-error - EXIF types are not accurate
    const gpsAltitudeRef = EXIF.getTag(img, 'GPSAltitudeRef') as number;

    if (!gpsLatitude || !gpsLongitude) return null;

    const latitude = Array.isArray(gpsLatitude)
      ? convertDMSToDD(gpsLatitude[0], gpsLatitude[1], gpsLatitude[2], gpsLatitudeRef || 'N')
      : typeof gpsLatitude === 'number'
      ? gpsLatitudeRef === 'S' ? -gpsLatitude : gpsLatitude
      : 0;

    const longitude = Array.isArray(gpsLongitude)
      ? convertDMSToDD(gpsLongitude[0], gpsLongitude[1], gpsLongitude[2], gpsLongitudeRef || 'E')
      : typeof gpsLongitude === 'number'
      ? gpsLongitudeRef === 'W' ? -gpsLongitude : gpsLongitude
      : 0;

    const altitude = typeof gpsAltitude === 'number'
      ? (gpsAltitudeRef === 1 ? -gpsAltitude : gpsAltitude)
      : undefined;

    return { latitude, longitude, altitude };
  } catch {
    return null;
  }
};

// Format shutter speed
const formatShutterSpeed = (seconds: number): string => {
  if (seconds >= 1) {
    return `${seconds}s`;
  }
  const denom = Math.round(1 / seconds);
  return `1/${denom}s`;
};

// Format flash info
const formatFlash = (flash: number): string => {
  const modes = [
    'No Flash',
    'Flash fired',
    'Flash fired, return not detected',
    'Flash fired, return detected',
    'Flash did not fire',
    'Flash fired',
    'Flash fired, red-eye reduction',
    'Flash fired, red-eye, return detected',
  ];
  return modes[flash] || `Flash mode ${flash}`;
};

// Format EXIF date
const formatDate = (dateStr: string): string => {
  // EXIF format: "YYYY:MM:DD HH:mm:ss"
  try {
    const parts = dateStr.split(' ');
    const datePart = parts[0].replace(/:/g, '-');
    return `${datePart} ${parts[1] || ''}`.trim();
  } catch {
    return dateStr;
  }
};
