import { useState, useCallback } from 'react';
import { Image, Trash2, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CompressionOptions } from './components/CompressionOptions';
import { DropZone } from './components/DropZone';
import { ImageList } from './components/ImageList';
import { LanguageSelector } from './components/LanguageSelector';
import { useImageQueue } from './hooks/useImageQueue';
import { DEFAULT_QUALITY_SETTINGS } from './utils/formatDefaults';
import type { ImageFile, OutputType, CompressionOptions as CompressionOptionsType } from './types';

export function App() {
  const { t } = useTranslation();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [outputType, setOutputType] = useState<OutputType>('webp');
  const [options, setOptions] = useState<CompressionOptionsType>({
    quality: DEFAULT_QUALITY_SETTINGS.webp,
  });

  const { addToQueue } = useImageQueue(options, outputType, setImages);

  const handleOutputTypeChange = useCallback((type: OutputType) => {
    setOutputType(type);
    if (type !== 'png') {
      setOptions({ quality: DEFAULT_QUALITY_SETTINGS[type] });
    }
  }, []);

  const handleFilesDrop = useCallback((newImages: ImageFile[]) => {
    // First add all images to state
    setImages((prev) => [...prev, ...newImages]);
    
    // Use requestAnimationFrame to wait for render to complete
    requestAnimationFrame(() => {
      // Then add to queue after UI has updated
      newImages.forEach(image => addToQueue(image.id));
    });
  }, [addToQueue]);

  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find(img => img.id === id);
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    images.forEach(image => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });
    setImages([]);
  }, [images]);

  const handleDownloadAll = useCallback(async () => {
    const completedImages = images.filter((img) => img.status === "complete");

    for (const image of completedImages) {
      if (image.blob && image.outputType) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(image.blob);
        link.download = `${image.file.name.split(".")[0]}.${image.outputType}`;
        link.click();
        URL.revokeObjectURL(link.href);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }, [images]);

  const completedImages = images.filter(img => img.status === 'complete').length;

  return (
    <div className="min-h-screen">
      <div className="page-container">
        <div className="header-container">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center shadow-md">
              <Image className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              {t('appTitle')}
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
            {t('appDescription')}
          </p>
          <div className="flex justify-center">
            <LanguageSelector />
          </div>
        </div>

        <div className="space-y-8">
          <div className="card p-6">
            <CompressionOptions
              options={options}
              outputType={outputType}
              onOptionsChange={setOptions}
              onOutputTypeChange={handleOutputTypeChange}
            />
          </div>

          <DropZone onFilesDrop={handleFilesDrop} />

          {completedImages > 0 && (
            <div className="flex justify-center">
              <button 
                onClick={handleDownloadAll}
                className="btn-primary"
              >
                <Download className="w-5 h-5" />
                {t('downloadAll')} ({completedImages})
              </button>
            </div>
          )}

          <ImageList 
            images={images} 
            onRemove={handleRemoveImage} 
          />

          {images.length > 0 && (
            <button
              onClick={handleClearAll}
              className="btn-primary bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 w-full"
            >
              <Trash2 className="w-5 h-5" />
              {t('clearAll')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
