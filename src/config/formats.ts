import { FormatConfig } from '../types';

export const formatConfigs: Record<string, FormatConfig> = {
  mozjpeg: {
    label: 'JPEG',
    qualityMin: 0,
    qualityMax: 100,
    qualityDefault: 75,
    qualityStep: 1,
    extension: 'jpg',
    hasProgressive: true
  },
  webp: {
    label: 'WebP',
    qualityMin: 0,
    qualityMax: 100,
    qualityDefault: 75,
    qualityStep: 1,
    extension: 'webp',
    hasLossless: true
  }
};