import { ImagePool } from '@squoosh/lib';
import { ProcessingOptions, ProcessedImage } from '../types';
import { formatConfigs } from '../config/formats';

export async function processImage(
  file: File,
  options: ProcessingOptions
): Promise<ProcessedImage> {
  const imagePool = new ImagePool();
  
  try {
    // Convert File to ArrayBuffer
    const buffer = await file.arrayBuffer();
    
    // Load image into pool
    const image = imagePool.ingestImage(buffer);
    
    // Decode image
    await image.decoded;

    // Resize if needed
    if (options.maxWidth) {
      const { width, height } = await image.dimensions;
      if (width > options.maxWidth) {
        const scale = options.maxWidth / width;
        await image.preprocess({
          resize: {
            enabled: true,
            width: options.maxWidth,
            height: Math.round(height * scale)
          }
        });
      }
    }

    // Format-specific encoding options
    const encodeOptions: any = {};
    switch (options.format) {
      case 'mozjpeg':
        encodeOptions.mozjpeg = {
          quality: options.quality,
          progressive: options.progressive || false,
        };
        break;
      case 'webp':
        encodeOptions.webp = {
          quality: options.quality,
          lossless: options.lossless || false,
        };
        break;
      case 'avif':
        encodeOptions.avif = {
          quality: options.quality,
          lossless: options.lossless || false,
        };
        break;
      case 'oxipng':
        encodeOptions.oxipng = {
          effort: options.quality, // OxiPNG uses effort level instead of quality
        };
        break;
      case 'jxl':
        encodeOptions.jxl = {
          quality: options.quality,
          lossless: options.lossless || false,
        };
        break;
    }

    // Encode image
    await image.encode(encodeOptions);

    // Get the encoded data
    const encodedData = await image[options.format]?.binary;
    if (!encodedData) {
      throw new Error(`Failed to encode image to ${options.format} format`);
    }

    // Create blob with correct mime type
    const mimeTypes: Record<string, string> = {
      mozjpeg: 'image/jpeg',
      webp: 'image/webp',
      avif: 'image/avif',
      oxipng: 'image/png',
      jxl: 'image/jxl'
    };

    const extension = formatConfigs[options.format].extension;
    const blob = new Blob([encodedData], { type: mimeTypes[options.format] });
    const processedFile = new File([blob], `processed.${extension}`, { type: mimeTypes[options.format] });
    
    // Create preview URL
    const url = URL.createObjectURL(processedFile);

    // Cleanup
    await imagePool.close();

    return {
      file: processedFile,
      url,
      originalSize: file.size,
      processedSize: processedFile.size,
    };
  } catch (error) {
    await imagePool.close();
    console.error('Error processing image:', error);
    throw error;
  }
}
