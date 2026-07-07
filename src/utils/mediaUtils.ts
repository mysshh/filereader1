import { ExtractedMetadata } from '../types';
import { getBaseMetadata, formatDuration } from './fileUtils';

// Extract audio/video metadata
export const extractMediaMetadata = async (file: File): Promise<ExtractedMetadata> => {
  const base = getBaseMetadata(file);
  const metadata: ExtractedMetadata = { ...base };

  const isAudio = file.type.startsWith('audio/');
  const isVideo = file.type.startsWith('video/');

  if (!isAudio && !isVideo) {
    return metadata;
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);

    if (isVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        metadata.duration = formatDuration(video.duration);
        metadata.durationSeconds = video.duration;
        metadata.width = video.videoWidth;
        metadata.height = video.videoHeight;

        if (video.videoWidth && video.videoHeight) {
          metadata.megapixels = `${video.videoWidth}x${video.videoHeight}`;
          metadata.aspectRatio = calculateVideoAspectRatio(video.videoWidth, video.videoHeight);
        }

        // Extract additional properties
        metadata.bitrate = calculateBitrate(file.size, video.duration);

        metadata.raw = {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          durationFormatted: metadata.duration,
          bitrate: metadata.bitrate,
        };

        metadata.allTags = Object.keys(metadata.raw);

        URL.revokeObjectURL(objectUrl);
        resolve(metadata);
      };

      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(metadata);
      };

      video.src = objectUrl;
    } else {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      audio.onloadedmetadata = () => {
        metadata.duration = formatDuration(audio.duration);
        metadata.durationSeconds = audio.duration;

        // Try to get audio properties (not supported by all browsers)
        try {
          const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          const reader = new FileReader();

          reader.onload = async () => {
            try {
              const arrayBuffer = reader.result as ArrayBuffer;
              const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

              metadata.audioSampleRate = audioBuffer.sampleRate;
              metadata.audioChannels = audioBuffer.numberOfChannels;

              metadata.raw = {
                duration: audio.duration,
                sampleRate: audioBuffer.sampleRate,
                channels: audioBuffer.numberOfChannels,
                bitrate: calculateBitrate(file.size, audio.duration),
              };

              metadata.allTags = Object.keys(metadata.raw);
            } catch {
              // Fallback if decode fails
              metadata.raw = {
                duration: audio.duration,
                bitrate: calculateBitrate(file.size, audio.duration),
              };
              metadata.allTags = Object.keys(metadata.raw);
            }

            URL.revokeObjectURL(objectUrl);
            resolve(metadata);
          };

          reader.onerror = () => {
            metadata.raw = { duration: audio.duration };
            metadata.allTags = Object.keys(metadata.raw);
            URL.revokeObjectURL(objectUrl);
            resolve(metadata);
          };

          // Don't read for large files - just use duration
          if (file.size > 10 * 1024 * 1024) {
            metadata.raw = { duration: audio.duration };
            metadata.allTags = Object.keys(metadata.raw);
            URL.revokeObjectURL(objectUrl);
            resolve(metadata);
          } else {
            reader.readAsArrayBuffer(file);
          }
        } catch {
          metadata.raw = { duration: audio.duration };
          metadata.allTags = Object.keys(metadata.raw);
          URL.revokeObjectURL(objectUrl);
          resolve(metadata);
        }
      };

      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(metadata);
      };

      audio.src = objectUrl;
    }
  });
};

// Calculate bitrate
const calculateBitrate = (size: number, duration: number): number => {
  if (!duration) return 0;
  return Math.round((size * 8) / duration / 1000); // kbps
};

// Calculate video aspect ratio
const calculateVideoAspectRatio = (width: number, height: number): string => {
  const ratio = width / height;

  const standardRatios: [number, string][] = [
    [21 / 9, '21:9'],
    [18 / 9, '18:9'],
    [16 / 9, '16:9'],
    [4 / 3, '4:3'],
    [3 / 2, '3:2'],
    [3 / 4, '3:4'],
    [9 / 16, '9:16'],
  ];

  for (const [ratioValue, display] of standardRatios) {
    if (Math.abs(ratio - ratioValue) < 0.01) {
      return display;
    }
  }

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(width, height);
  return `${width / d}:${height / d}`;
};
