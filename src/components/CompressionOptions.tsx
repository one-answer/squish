import { useTranslation } from 'react-i18next';
import type { OutputType, CompressionOptions } from '../types';

interface CompressionOptionsProps {
  options: CompressionOptions;
  outputType: OutputType;
  onOptionsChange: (options: CompressionOptions) => void;
  onOutputTypeChange: (type: OutputType) => void;
}

export function CompressionOptions({
  options,
  outputType,
  onOptionsChange,
  onOutputTypeChange,
}: CompressionOptionsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('compressionOptions.outputFormat')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(['avif', 'jpeg', 'jxl', 'png', 'webp'] as const).map((format) => (
            <button
              key={format}
              className={`format-button ${
                outputType === format
                  ? 'format-button-active'
                  : 'format-button-inactive'
              }`}
              onClick={() => onOutputTypeChange(format)}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      {outputType !== 'png' && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              {t('compressionOptions.quality')}
            </label>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-teal-500 text-white px-3 py-1 rounded-full">
              {options.quality}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={options.quality}
            onChange={(e) =>
              onOptionsChange({ quality: Number(e.target.value) })
            }
            className="input-range"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">1%</span>
            <span className="text-xs text-gray-500">50%</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>
      )}
    </div>
  );
}