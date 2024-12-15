import { FormatConfig } from '../types';

export const formatConfigs: Record<string, FormatConfig> = {
  mozjpeg: {
    label: 'MozJPEG',
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
  },
  avif: {
    label: 'AVIF',
    qualityMin: 0,
    qualityMax: 100,
    qualityDefault: 50,
    qualityStep: 1,
    extension: 'avif',
    hasLossless: true
  },
  oxipng: {
    label: 'OxiPNG',
    qualityMin: 0,
    qualityMax: 6,
    qualityDefault: 2,
    qualityStep: 1,
    extension: 'png',
    hasLossless: true,
    isEffortBasedQuality: true
  },
  jxl: {
    label: 'JPEG XL',
    qualityMin: 0,
    qualityMax: 100,
    qualityDefault: 75,
    qualityStep: 1,
    extension: 'jxl',
    hasLossless: true
  }
};
