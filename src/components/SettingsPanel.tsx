import React from 'react';
import { ProcessingOptions } from '../types';
import { formatConfigs } from '../config/formats';

interface SettingsPanelProps {
  options: ProcessingOptions;
  onChange: (options: ProcessingOptions) => void;
}

export function SettingsPanel({ options, onChange }: SettingsPanelProps) {
  const currentFormat = formatConfigs[options.format];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name === 'format') {
      const newFormat = value as ProcessingOptions['format'];
      const formatConfig = formatConfigs[newFormat];
      onChange({
        ...options,
        format: newFormat,
        quality: formatConfig.qualityDefault,
      });
    } else {
      onChange({
        ...options,
        [name]: type === 'number' || type === 'range' ? Number(value) : value,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Format
          </label>
          <select
            name="format"
            value={options.format}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {Object.entries(formatConfigs).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Width
          </label>
          <input
            type="number"
            name="maxWidth"
            value={options.maxWidth}
            onChange={handleChange}
            min="100"
            max="8192"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quality ({currentFormat.qualityMin}-{currentFormat.qualityMax})
        </label>
        <input
          type="range"
          name="quality"
          min={currentFormat.qualityMin}
          max={currentFormat.qualityMax}
          step={currentFormat.qualityStep}
          value={options.quality}
          onChange={handleChange}
          className="w-full"
        />
        <div className="text-sm text-gray-500 mt-1">
          Current: {options.quality}
        </div>
      </div>

      {currentFormat.hasEffort && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Effort (0-6)
          </label>
          <input
            type="range"
            name="effort"
            min="0"
            max="6"
            step="1"
            value={options.effort || 2}
            onChange={handleChange}
            className="w-full"
          />
          <div className="text-sm text-gray-500 mt-1">
            Current: {options.effort || 2}
          </div>
        </div>
      )}

      {currentFormat.hasProgressive && (
        <div className="flex items-center">
          <input
            type="checkbox"
            name="progressive"
            checked={options.progressive}
            onChange={(e) =>
              onChange({ ...options, progressive: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-700">Progressive</label>
        </div>
      )}

      {currentFormat.hasLossless && (
        <div className="flex items-center">
          <input
            type="checkbox"
            name="lossless"
            checked={options.lossless}
            onChange={(e) =>
              onChange({ ...options, lossless: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-700">Lossless</label>
        </div>
      )}
    </div>
  );
}