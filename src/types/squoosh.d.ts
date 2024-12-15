declare module '@squoosh/lib' {
  export interface PreprocessOptions {
    resize?: {
      enabled: boolean;
      width: number;
      height: number;
    };
  }

  export interface EncodeOptions {
    mozjpeg?: {
      quality: number;
      progressive?: boolean;
    };
    webp?: {
      quality: number;
      lossless?: boolean;
    };
    avif?: {
      quality: number;
      lossless?: boolean;
    };
    oxipng?: {
      effort: number;
    };
    jxl?: {
      quality: number;
      lossless?: boolean;
    };
  }

  export interface ImageData {
    decoded: Promise<void>;
    dimensions: Promise<{ width: number; height: number }>;
    preprocess(options: PreprocessOptions): Promise<void>;
    encode(options: EncodeOptions): Promise<void>;
    mozjpeg?: { binary: Promise<Uint8Array> };
    webp?: { binary: Promise<Uint8Array> };
    avif?: { binary: Promise<Uint8Array> };
    oxipng?: { binary: Promise<Uint8Array> };
    jxl?: { binary: Promise<Uint8Array> };
  }

  export class ImagePool {
    constructor(threads?: number);
    ingestImage(buffer: ArrayBuffer): ImageData;
    close(): Promise<void>;
  }
}
