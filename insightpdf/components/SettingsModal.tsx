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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="设置"
        className="rounded-2xl border border-[var(--theme-border-primary)] bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] animate-zoom-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-secondary)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--theme-bg-accent)]/10 text-[var(--theme-text-link)] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--theme-text-primary)]">应用设置</h2>
              <p className="text-[11px] text-[var(--theme-text-tertiary)]">配置主题偏好与 Gemini API 连接</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭设置"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-tertiary)] hover:text-[var(--theme-text-primary)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Theme Toggle (AMC Segmented Track style) */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[var(--theme-text-primary)]">外观主题</span>
              <span className="text-xs text-[var(--theme-text-secondary)]">切换浅色（Pearl）或深色（Onyx）界面模式</span>
            </div>
            <button
              onClick={onToggleTheme}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--theme-border-secondary)]/70 bg-[var(--theme-bg-tertiary)]/60 hover:bg-[var(--theme-bg-tertiary)] transition-all text-xs font-semibold text-[var(--theme-text-primary)] shadow-2xs active:scale-95"
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>浅色模式</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>深色模式</span>
                </>
              )}
            </button>
          </div>

          {/* Files API Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[var(--theme-text-primary)]">使用 Gemini Files API</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">推荐</span>
              </div>
              <span className="text-xs text-[var(--theme-text-secondary)] mt-0.5">大文档与复杂多页 PDF 更稳定</span>
            </div>
            <Toggle
              checked={useFilesApi}
              onChange={onToggleFilesApi}
              label="切换 Files API"
            />
          </div>

          <hr className="border-[var(--theme-border-primary)]" />

          {/* Custom API Config */}
          <CustomApiSection />

          <hr className="border-[var(--theme-border-primary)]" />

          {/* About / Github */}
          <AboutGitHubSection />

          <div className="flex justify-center pt-1">
            <p className="text-[11px] text-[var(--theme-text-tertiary)] font-mono">
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
