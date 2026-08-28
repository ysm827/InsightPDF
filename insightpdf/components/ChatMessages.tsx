import React from 'react';
import type { ChatMessage, LocatorResult } from '@/types';
import { AppStatus } from '@/types';
import { Upload, Sparkles, Loader2, RotateCcw, FileSearch, HelpCircle, Layers, BarChart3, AlertCircle } from 'lucide-react';
import ChatMessageItem from './ChatMessageItem';

interface ChatMessagesProps {
  messages: ChatMessage[];
  status: AppStatus;
  errorMessage: string | null;
  canRetry: boolean;
  currentFile: File | null;
  onRetry: () => void;
  onViewLocation: (result: LocatorResult) => void;
  onSuggestionClick?: (query: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  { icon: FileSearch, text: '📑 概括本文档的核心内容与主要结论' },
  { icon: BarChart3, text: '📊 提取文档中提到的关键数据与图表' },
  { icon: HelpCircle, text: '🔍 寻找文档中提到的关键概念或方法' },
  { icon: Layers, text: '📌 列出本文档的目录结构与重点章节' },
];

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  status,
  errorMessage,
  canRetry,
  currentFile,
  onRetry,
  onViewLocation,
  onSuggestionClick
}) => {
  const isLoading =
    status === AppStatus.PROCESSING_FILE || status === AppStatus.SEARCHING;

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-5 bg-[var(--theme-bg-secondary)] relative">
      {/* 1. Empty State: No File Uploaded (AMC-WebUI Welcome style) */}
      {!currentFile && messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in pointer-events-none select-none">
          <div className="w-14 h-14 rounded-2xl bg-[var(--theme-bg-accent)]/10 text-[var(--theme-text-link)] flex items-center justify-center mb-4">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--theme-text-primary)] mb-1.5">
            开启智能 PDF 对话
          </h3>
          <p className="text-xs sm:text-sm text-[var(--theme-text-secondary)] max-w-sm leading-relaxed mb-6">
            拖拽或点击右上角上传 PDF，体验 Gemini 3 视觉定位问答与公式解析
          </p>
          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--theme-bg-tertiary)]/50 border border-[var(--theme-border-secondary)]/60 text-[var(--theme-text-secondary)] shadow-2xs">
              📍 毫米级坐标定位
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--theme-bg-tertiary)]/50 border border-[var(--theme-border-secondary)]/60 text-[var(--theme-text-secondary)] shadow-2xs">
              📐 LaTeX 公式解析
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--theme-bg-tertiary)]/50 border border-[var(--theme-border-secondary)]/60 text-[var(--theme-text-secondary)] shadow-2xs">
              ⚡️ Gemini 3.7 Flash
            </span>
          </div>
        </div>
      )}

      {/* 2. File Uploaded but No Messages: AMC-style Suggestion Chips */}
      {currentFile && messages.length === 0 && !isLoading && (
        <div className="py-4 px-1 animate-fade-in">
          <div className="flex items-center gap-1.5 mb-3 text-[var(--theme-text-secondary)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--theme-text-link)]" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              推荐探索方向
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {DEFAULT_SUGGESTIONS.map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick && onSuggestionClick(sugg.text.slice(2).trim())}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-[var(--theme-border-secondary)]/70 bg-[var(--theme-bg-tertiary)]/35 text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-tertiary)] hover:text-[var(--theme-text-primary)] hover:border-[var(--theme-border-focus)] text-xs font-medium transition-all text-left shadow-2xs group active:scale-[0.99]"
              >
                <div className="p-1 rounded-md bg-[var(--theme-bg-primary)] text-[var(--theme-text-tertiary)] group-hover:text-[var(--theme-text-link)] transition-colors shadow-2xs">
                  <sugg.icon className="w-3.5 h-3.5" />
                </div>
                <span className="flex-1 font-medium">{sugg.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Messages List */}
      {messages.map((msg) => (
        <ChatMessageItem
          key={msg.id}
          message={msg}
          onViewLocation={onViewLocation}
        />
      ))}

      {/* 4. Loading / Thinking State */}
      {isLoading && (
        <div className="flex items-start gap-3 animate-fade-in">
          <div className="w-7 h-7 rounded-lg bg-[var(--theme-bg-accent)]/10 text-[var(--theme-text-link)] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div className="bg-[var(--theme-bg-primary)] border border-[var(--theme-border-secondary)]/60 px-4 py-3 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-2.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--theme-text-link)]" />
            <span className="text-xs font-medium text-[var(--theme-text-secondary)]">
              {status === AppStatus.PROCESSING_FILE ? '正在将文档同步至云端...' : 'Gemini 3 正在深入分析并定位文档...'}
            </span>
          </div>
        </div>
      )}

      {/* 5. Error Banner */}
      {status === AppStatus.ERROR && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-slide-up flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>生成回复出错</span>
          </div>
          {errorMessage && (
            <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed bg-[var(--theme-bg-primary)] p-2.5 rounded-lg font-mono border border-red-500/15 break-words">
              {errorMessage}
            </p>
          )}
          {canRetry ? (
            <button
              onClick={onRetry}
              className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-2xs active:scale-95 mt-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 重新生成
            </button>
          ) : (
            <span className="text-[11px] text-[var(--theme-text-tertiary)]">
              建议尝试更换模型或简化提问后重试
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;

