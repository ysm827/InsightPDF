import React, { useState } from 'react';
import type { CustomApiConfig } from '@/services/storageService';
import Toggle from './Toggle';
import { Key, Globe, Eye, EyeOff } from 'lucide-react';

interface CustomApiConfigSectionProps {
  config: CustomApiConfig;
  onChange: (config: CustomApiConfig) => void;
}

const CustomApiConfigSection: React.FC<CustomApiConfigSectionProps> = ({ config, onChange }) => {
  const [showKey, setShowKey] = useState(false);

  const handleConfigChange = (key: keyof CustomApiConfig, value: boolean | string) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">自定义 API / 代理</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">使用自己的 Gemini API Key 或中转 Base URL</span>
        </div>
        <Toggle
          checked={config.enabled}
          onChange={() => handleConfigChange('enabled', !config.enabled)}
          label="切换自定义 API"
        />
      </div>

      {config.enabled && (
        <div className="space-y-3.5 pt-3 bg-gray-50/80 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 animate-slide-up">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>API 密钥 (API Key)</span>
              <span className="text-[10px] text-gray-400">仅保存在本地浏览器</span>
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type={showKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-white dark:bg-gray-800 border border-gray-300/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all dark:text-gray-100 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(prev => !prev)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title={showKey ? '隐藏密钥' : '显示密钥'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
              <span>自定义 Base URL (可选)</span>
              <span className="text-[10px] text-gray-400">支持中转代理</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={config.baseUrl}
                onChange={(e) => handleConfigChange('baseUrl', e.target.value)}
                placeholder="https://generativelanguage.googleapis.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-gray-800 border border-gray-300/80 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none transition-all dark:text-gray-100 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomApiConfigSection;

