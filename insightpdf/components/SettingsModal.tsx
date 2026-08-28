import React from 'react';
import { storage } from '@/services/storageService';
import { APP_CONFIG } from '@/constants';
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="设置"
        className="glass-card bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200/80 dark:border-gray-800 flex flex-col max-h-[88vh] animate-zoom-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">应用设置</h2>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">配置主题与 API 连接方式</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭设置"
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">外观主题</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">切换浅色或深色界面模式</span>
            </div>
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-2xs active:scale-95"
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">浅色模式</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">深色模式</span>
                </>
              )}
            </button>
          </div>

          {/* Files API Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">使用 Gemini Files API</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded-md">推荐</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">大文档与复杂多页 PDF 更稳定</span>
            </div>
            <Toggle
              checked={useFilesApi}
              onChange={onToggleFilesApi}
              label="切换 Files API"
            />
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* Custom API Config */}
          <CustomApiSection />

          <hr className="border-gray-100 dark:border-gray-800" />

          {/* About / Github */}
          <AboutGitHubSection />

          <div className="flex justify-center pt-1">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">
              InsightPDF v{APP_CONFIG.VERSION} • Powered by Gemini 3
            </p>
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
