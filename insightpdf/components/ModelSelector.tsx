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
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white/90 dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-2xs hover:shadow-xs active:scale-95"
        title="选择 AI 模型"
      >
        <ActiveIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>{activeModel.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-2 w-56 glass-card bg-white/95 dark:bg-gray-900/95 border border-gray-200/80 dark:border-gray-800 rounded-2xl shadow-xl py-1.5 z-50 animate-zoom-in overflow-hidden"
        >
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Gemini 3 系列
          </div>

          <div className="p-1 space-y-1">
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
                  className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/70'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold">{model.name}</span>
                      {model.badge && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                          model.badge === '极速推荐'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                        }`}>
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-400 line-clamp-1 mt-0.5">
                      {model.description}
                    </p>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />}
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



