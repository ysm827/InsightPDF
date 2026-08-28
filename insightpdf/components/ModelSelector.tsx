import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, ChevronDown, Check, Sparkles } from 'lucide-react';

export interface ModelOption {
  id: string;
  name: string;
  badge?: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  { 
    id: 'gemini-3.7-flash', 
    name: '3.7 Flash', 
    badge: '极速推荐',
    description: '前沿极速多模态与精准定位',
    icon: Sparkles 
  },
  { 
    id: 'gemini-3.1-pro', 
    name: '3.1 Pro', 
    badge: '深度推理',
    description: '旗舰级深度分析与复杂推理',
    icon: BrainCircuit 
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) ?? AVAILABLE_MODELS[0];
  const ActiveIcon = activeModel.icon;

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="h-8 px-2.5 rounded-lg border border-[var(--theme-border-secondary)]/60 bg-[var(--theme-bg-primary)] hover:bg-[var(--theme-bg-tertiary)]/70 text-xs font-semibold text-[var(--theme-text-primary)] transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
        title="选择 AI 模型"
      >
        <ActiveIcon className="w-3.5 h-3.5 text-[var(--theme-text-link)]" />
        <span>{activeModel.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--theme-text-tertiary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-1.5 w-60 rounded-xl border border-[var(--theme-border-secondary)] bg-[var(--theme-bg-primary)] shadow-xl p-1.5 z-50 animate-zoom-in overflow-hidden"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-wider">
            Gemini 3 系列
          </div>

          <div className="space-y-1 mt-1">
            {AVAILABLE_MODELS.map((model) => {
              const Icon = model.icon;
              const isActive = selectedModel === model.id;
              return (
                <button
                  key={model.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    onModelSelect(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-[var(--theme-bg-accent)]/12 text-[var(--theme-text-primary)] font-semibold'
                      : 'text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-tertiary)]/70 hover:text-[var(--theme-text-primary)]'
                  }`}
                >
                  <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                    isActive
                      ? 'bg-[var(--theme-bg-accent)] text-white shadow-2xs'
                      : 'bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-secondary)]'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold">{model.name}</span>
                      {model.badge && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                          model.badge === '极速推荐'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--theme-text-tertiary)] line-clamp-1 mt-0.5">
                      {model.description}
                    </p>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-[var(--theme-text-link)] shrink-0 mt-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;



