import React from 'react';
import type { ChatMessage, LocatorResult } from '../types';
import { MapPin, Bot, User, Check, Copy } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatMessageItemProps {
  message: ChatMessage;
  onViewLocation: (result: LocatorResult) => void;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message: msg, onViewLocation }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
        {msg.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-3 rounded-2xl text-sm leading-relaxed relative group ${
            msg.role === 'user'
              ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md whitespace-pre-wrap pr-10'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-tl-sm shadow-sm pr-10'
          }`}
        >
          <button
            onClick={() => copyToClipboard(msg.text)}
            className={`absolute top-2 right-2 p-1.5 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 ${
              msg.role === 'user'
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="复制消息"
            aria-label="复制消息"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {msg.role === 'ai' ? (
            <MarkdownRenderer content={msg.text} />
          ) : (
            msg.text
          )}
        </div>

        {/* Location Card if AI found something */}
        {msg.role === 'ai' && msg.locationData?.pageNumber && (
          <button
            onClick={() => onViewLocation(msg.locationData!)}
            className="mt-2 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all text-left group w-full max-w-[280px]"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 uppercase tracking-wider">
                <MapPin className="w-3 h-3" /> 发现于第 {msg.locationData.pageNumber} 页
              </span>
              <span className="text-xs text-indigo-400 dark:text-indigo-500 group-hover:translate-x-1 transition-transform">查看 &rarr;</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic truncate border-l-2 border-indigo-100 dark:border-indigo-800 pl-2">
              "{msg.locationData.snippet}"
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;
