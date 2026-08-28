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
    <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4 bg-gray-50/50 dark:bg-gray-950/50 relative">
      {/* 1. Empty State: No File Uploaded */}
      {!currentFile && messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-fade-in pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-inner ring-1 ring-indigo-500/20">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
            开启智能 PDF 对话
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs leading-relaxed mb-4">
            拖拽或点击右上角上传 PDF 文档，体验 Gemini 3 视觉定位问答
          </p>
          <div className="flex flex-wrap gap-2 justify-center max-w-xs">
            <span className="px-2.5 py-1 rounded-lg text-[11px] bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-300 shadow-2xs">
              📍 毫米级坐标定位
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[11px] bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-300 shadow-2xs">
              📐 LaTeX 公式解析
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[11px] bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-300 shadow-2xs">
              ⚡️ Gemini 3.7 Flash
            </span>
          </div>
        </div>
      )}

      {/* 2. File Uploaded but No Messages: Quick Suggestion Chips */}
      {currentFile && messages.length === 0 && !isLoading && (
        <div className="py-6 px-2 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              您可以尝试这样提问：
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {DEFAULT_SUGGESTIONS.map((sugg, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick && onSuggestionClick(sugg.text.slice(2).trim())}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 text-left text-xs text-gray-700 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all shadow-2xs hover:shadow-xs group active:scale-[0.99]"
              >
                <div className="p-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs ring-2 ring-indigo-500/20">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div className="bg-white dark:bg-gray-800/90 border border-gray-200/80 dark:border-gray-700/80 px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {status === AppStatus.PROCESSING_FILE ? '正在将文档同步至云端...' : 'Gemini 3 正在深入分析并定位文档...'}
            </span>
          </div>
        </div>
      )}

      {/* 5. Error Banner */}
      {status === AppStatus.ERROR && (
        <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/40 animate-slide-up flex flex-col gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span>生成回复出错</span>
          </div>
          {errorMessage && (
            <p className="text-xs text-red-600/90 dark:text-red-400/90 leading-relaxed bg-white/60 dark:bg-black/20 p-2.5 rounded-xl font-mono border border-red-200/50 dark:border-red-900/30 break-words">
              {errorMessage}
            </p>
          )}
          {canRetry ? (
            <button
              onClick={onRetry}
              className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs active:scale-95 mt-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 重新生成
            </button>
          ) : (
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              建议尝试更换模型或简化提问后重试
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;

