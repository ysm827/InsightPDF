import React from 'react';
import type { ChatMessage, LocatorResult } from '../types';
import { AppStatus } from '../types';
import { Upload, Bot, Loader2, RotateCcw } from 'lucide-react';
import ChatMessageItem from './ChatMessageItem';

interface ChatMessagesProps {
  messages: ChatMessage[];
  status: AppStatus;
  errorMessage: string | null;
  canRetry: boolean;
  currentFile: File | null;
  onRetry: () => void;
  onViewLocation: (result: LocatorResult) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  status,
  errorMessage,
  canRetry,
  currentFile,
  onRetry,
  onViewLocation
}) => {
  const isLoading =
    status === AppStatus.PROCESSING_FILE || status === AppStatus.SEARCHING;

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4 bg-gray-50 dark:bg-gray-950 relative">
      {!currentFile && messages.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 opacity-60">
          <Upload className="w-12 h-12 mb-2" />
          <p className="text-sm">上传 PDF 以开始对话</p>
        </div>
      )}

      {messages.map((msg) => (
        <ChatMessageItem
          key={msg.id}
          message={msg}
          onViewLocation={onViewLocation}
        />
      ))}

      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {status === AppStatus.PROCESSING_FILE ? '正在上传至 Gemini...' : '思考中...'}
            </span>
          </div>
        </div>
      )}

      {status === AppStatus.ERROR && (
        <div className="flex flex-col items-center justify-center gap-1.5 py-4 animate-slide-up px-4">
          <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-md border border-red-100 dark:border-red-900/30 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            生成回复出错
          </span>
          {errorMessage && (
            <div className="text-xs text-red-500 dark:text-red-400 text-center break-words w-full font-mono bg-red-50/50 dark:bg-red-900/10 p-2 rounded border border-red-100 dark:border-red-900/20">
              {errorMessage}
            </div>
          )}
          {canRetry ? (
            <button
              onClick={onRetry}
              className="mt-1 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <RotateCcw className="w-3 h-3" /> 重试
            </button>
          ) : (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              请尝试更换模型或重新发送
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
