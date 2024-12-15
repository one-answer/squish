import React, { useState, useCallback } from 'react';
import { Upload, Settings, Image as ImageIcon, Download } from 'lucide-react';
import { ProcessingOptions, ProcessedImage } from '../types';
import { ImagePreview } from './ImagePreview';
import { SettingsPanel } from './SettingsPanel';
import { processImage } from '../utils/imageProcessing';
import { formatConfigs } from '../config/formats';

export function ImageProcessor() {
  const [images, setImages] = useState<File[]>([]);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState<ProcessingOptions>({
    maxWidth: 1920,
    quality: formatConfigs.mozjpeg.qualityDefault,
    format: 'mozjpeg',
  });

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
      setProcessedImages([]); // Clear processed images when new files are selected
    }
  }, []);

  const processImages = useCallback(async () => {
    setIsProcessing(true);
    try {
      const processed = await Promise.all(
        images.map(file => processImage(file, options))
      );
      setProcessedImages(processed);
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [images, options]);

  const downloadAll = useCallback(() => {
    processedImages.forEach((image) => {
      const extension = formatConfigs[options.format].extension;
      const fileName = image.file.name.replace(/\.[^/.]+$/, '') + '.' + extension;
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `optimized-${fileName}`;
      link.click();
    });
  }, [processedImages, options.format]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Squish</h1>
          <p className="text-gray-600">Batch Image Optimization Made Simple</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center w-full">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 text-gray-500 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100">
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm">Drop images here or click to select</span>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </div>

        {images.length > 0 && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <Settings className="w-5 h-5 mr-2" />
                <h2 className="text-lg font-semibold">Processing Options</h2>
              </div>
              <SettingsPanel options={options} onChange={setOptions} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {images.map((file, index) => (
                <ImagePreview
                  key={file.name + index}
                  file={file}
                  processedImage={processedImages[index]}
                  showProcessed={processedImages.length > 0}
                />
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={processImages}
                disabled={isProcessing}
                className={`px-6 py-2 rounded-lg flex items-center ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Process Images'}
              </button>
              {processedImages.length > 0 && (
                <button
                  onClick={downloadAll}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </button>
              )}
            </div>
          </>
        )}

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Inspired by{' '}
            <a
              href="https://github.com/GoogleChromeLabs/squoosh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Squoosh
            </a>{' '}
            for single-file processing capabilities
          </p>
        </footer>
      </div>
    </div>
  );
}