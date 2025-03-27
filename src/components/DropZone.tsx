import { useCallback, useState } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ImageFile } from '../types';

interface DropZoneProps {
  onFilesDrop: (files: ImageFile[]) => void;
}

export function DropZone({ onFilesDrop }: DropZoneProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files)
      .filter(file => file.type.startsWith('image/') || file.name.toLowerCase().endsWith('jxl'))
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        status: 'pending' as const,
        originalSize: file.size,
      }));
    onFilesDrop(files);
  }, [onFilesDrop]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
      .filter(file => file.type.startsWith('image/') || file.name.toLowerCase().endsWith('jxl'))
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        status: 'pending' as const,
        originalSize: file.size,
      }));
    onFilesDrop(files);
    e.target.value = '';
  }, [onFilesDrop]);

  return (
    <div
      className={`dropzone ${isDragging ? 'dropzone-active border-teal-400' : 'border-gray-300 hover:border-blue-400'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        multiple
        accept="image/*,.jxl"
        onChange={handleFileInput}
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer flex flex-col items-center gap-6"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 flex items-center justify-center">
          <Upload className="w-10 h-10 text-teal-500" />
        </div>
        <div>
          <p className="text-xl font-medium text-gray-800 mb-2">
            {t('dropzone.title')}
          </p>
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <ImageIcon className="w-4 h-4" />
            {t('dropzone.acceptedFormats')}
          </p>
        </div>
      </label>
    </div>
  );
}