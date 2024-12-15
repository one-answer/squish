import imageCompression from 'browser-image-compression';
import { ProcessingOptions, ProcessedImage } from '../types';
import { formatConfigs } from '../config/formats';

export async function processImage(
  file: File,
  options: ProcessingOptions
): Promise<ProcessedImage> {
  // Base compression options
  const compressionOptions: any = {
    maxWidthOrHeight: options.maxWidth,
    useWebWorker: true,
  };

  // Format-specific settings
  switch (options.format) {
    case 'mozjpeg':
      compressionOptions.maxSizeMB = 0;
      compressionOptions.quality = options.quality / 100;
      break;
    case 'webp':
      compressionOptions.maxSizeMB = 0;
      compressionOptions.quality = options.quality / 100;
      break;
    case 'avif':
      // AVIF not directly supported, fallback to WebP
      compressionOptions.maxSizeMB = 0;
      compressionOptions.quality = options.quality / 100;
      break;
    case 'oxipng':
      // PNG optimization
      compressionOptions.maxSizeMB = 0;
      compressionOptions.quality = 1; // Always use maximum quality for PNG
      break;
    case 'jxl':
      // JXL not supported, fallback to WebP
      compressionOptions.maxSizeMB = 0;
      compressionOptions.quality = options.quality / 100;
      break;
  }

  try {
    const compressedFile = await imageCompression(file, compressionOptions);
    
    // Create object URL for preview
    const url = URL.createObjectURL(compressedFile);

    return {
      file: compressedFile,
      url,
      originalSize: file.size,
      processedSize: compressedFile.size,
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}