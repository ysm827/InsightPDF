import React from 'react';
import type { ChatMessage, LocatorResult } from '@/types';
import { MapPin, Sparkles, User, Check, Copy, ArrowUpRight } from 'lucide-react';
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

  const isAI = msg.role === 'ai';

  return (
    <div className={`flex items-start gap-3 animate-fade-in ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ring-2 ${
        isAI
          ? 'bg-gradient-to-tr from-indigo-600 to-violet-500 text-white ring-indigo-500/20'
          : 'bg-gradient-to-tr from-gray-700 to-gray-800 text-white ring-gray-400/20'
      }`}>
        {isAI ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Bubble & Content */}
      <div className={`flex flex-col max-w-[85%] ${isAI ? 'items-start' : 'items-end'}`}>
        <div
          className={`p-3.5 rounded-2xl text-sm leading-relaxed relative group transition-all ${
            isAI
              ? 'bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700/80 rounded-tl-xs shadow-xs hover:shadow-sm pr-11'
              : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-xs shadow-sm shadow-indigo-600/20 whitespace-pre-wrap pr-11'
          }`}
        >
          {/* Copy Button */}
          <button
            onClick={() => copyToClipboard(msg.text)}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 ${
              isAI
                ? 'text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                : 'text-white/70 hover:text-white hover:bg-white/15'
            }`}
            title="复制文本"
            aria-label="复制文本"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {isAI ? (
            <MarkdownRenderer content={msg.text} />
          ) : (
            msg.text
          )}
        </div>

        {/* Location Grounding Card */}
        {isAI && msg.locationData?.pageNumber && (
          <button
            onClick={() => onViewLocation(msg.locationData!)}
            className="mt-2 bg-gradient-to-r from-indigo-50/90 to-violet-50/70 dark:from-indigo-950/40 dark:to-violet-950/20 border border-indigo-200/80 dark:border-indigo-800/50 rounded-xl p-2.5 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all text-left group w-full max-w-[320px] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600 dark:bg-indigo-400"></span>
                </span>
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                第 {msg.locationData.pageNumber} 页答案定位
              </span>
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                定位 <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            {msg.locationData.snippet && (
              <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 border-l-2 border-indigo-300 dark:border-indigo-700 pl-2 mt-1 italic font-sans">
                "{msg.locationData.snippet}"
              </div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;

