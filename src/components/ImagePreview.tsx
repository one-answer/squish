import React from 'react';
import { ProcessedImage } from '../types';

interface ImagePreviewProps {
  file: File;
  processedImage?: ProcessedImage;
  showProcessed: boolean;
}

export function ImagePreview({ file, processedImage, showProcessed }: ImagePreviewProps) {
  const originalUrl = React.useMemo(() => URL.createObjectURL(file), [file]);

  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(originalUrl);
      if (processedImage) {
        URL.revokeObjectURL(processedImage.url);
      }
    };
  }, [originalUrl, processedImage]);

  const originalSize = (file.size / 1024).toFixed(1);
  const processedSize = processedImage
    ? (processedImage.processedSize / 1024).toFixed(1)
    : '0';
  const savings = processedImage
    ? (((file.size - processedImage.processedSize) / file.size) * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={showProcessed && processedImage ? processedImage.url : originalUrl}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate mb-2">{file.name}</h3>
        <div className="text-sm text-gray-500">
          <p>Original: {originalSize}KB</p>
          {processedImage && (
            <>
              <p>Processed: {processedSize}KB</p>
              <p className="text-green-600">Saved: {savings}%</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}