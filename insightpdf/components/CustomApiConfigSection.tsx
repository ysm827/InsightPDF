import React from 'react';
import type { CustomApiConfig } from '../services/storageService';
import Toggle from './Toggle';
import { Key, Globe } from 'lucide-react';

interface CustomApiConfigSectionProps {
  config: CustomApiConfig;
  onChange: (config: CustomApiConfig) => void;
}

const CustomApiConfigSection: React.FC<CustomApiConfigSectionProps> = ({ config, onChange }) => {
  const handleConfigChange = (key: keyof CustomApiConfig, value: boolean | string) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">自定义 API</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">使用自己的 Gemini API Key</span>
        </div>
        <Toggle
          checked={config.enabled}
          onChange={() => handleConfigChange('enabled', !config.enabled)}
          label="切换自定义 API"
        />
      </div>

      {config.enabled && (
        <div className="space-y-3 pt-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 animate-fade-in">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">API 密钥 (API Key)</label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={config.apiKey}
                onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                placeholder="sk-..."
                className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-gray-100"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Base URL (例如 .../v1beta)</label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={config.baseUrl}
                onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
                placeholder="https://generativelanguage.googleapis.com/v1beta"
                className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomApiConfigSection;
