export type ImageFormat = 
  | 'mozjpeg'
  | 'webp'
  | 'avif'
  | 'oxipng'
  | 'jxl';

export interface ProcessingOptions {
  maxWidth: number;
  format: ImageFormat;
  quality: number;
  progressive?: boolean; // For JPEG
  lossless?: boolean; // For WebP, AVIF, JXL
  effort?: number; // For OxiPNG
}

export interface ProcessedImage {
  file: File;
  url: string;
  originalSize: number;
  processedSize: number;
}

export interface FormatConfig {
  label: string;
  qualityMin: number;
  qualityMax: number;
  qualityDefault: number;
  qualityStep: number;
  extension: string;
  hasProgressive?: boolean;
  hasLossless?: boolean;
  isEffortBasedQuality?: boolean; // For formats like OxiPNG where quality represents effort
}
