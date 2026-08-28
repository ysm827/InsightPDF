import React from 'react';
import { storage } from '../services/storageService';
import Toggle from './Toggle';
import CustomApiConfigSection from './CustomApiConfigSection';
import AboutGitHubSection from './AboutGitHubSection';
import { Settings, X, Moon, Sun } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  useFilesApi: boolean;
  onToggleFilesApi: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
  theme,
  onToggleTheme,
  useFilesApi,
  onToggleFilesApi
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="设置"
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 flex flex-col max-h-[85vh] animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">设置</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭设置"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">外观主题</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">切换深色或浅色模式</span>
            </div>
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">浅色</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">深色</span>
                </>
              )}
            </button>
          </div>

          {/* Files API Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">使用 Files API</span>
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">推荐</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">上传大文件时更稳定，适合长文档</span>
            </div>
            <Toggle
              checked={useFilesApi}
              onChange={onToggleFilesApi}
              label="切换 Files API"
            />
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          {/* Custom API Config */}
          <CustomApiSection />

          <hr className="border-gray-100 dark:border-gray-700" />

          {/* About / Github */}
          <AboutGitHubSection />

          <div className="flex justify-center pt-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">Version 1.1.0 • Made with Gemini</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Loads the custom API config from storage once and persists every change.
 */
const CustomApiSection: React.FC = () => {
  const [config, setConfig] = React.useState(storage.getCustomConfig);

  const update = (next: typeof config) => {
    setConfig(next);
    storage.saveCustomConfig(next);
  };

  return <CustomApiConfigSection config={config} onChange={update} />;
};

export default SettingsModal;
