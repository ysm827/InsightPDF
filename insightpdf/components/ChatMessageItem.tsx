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
    <div className={`flex items-start gap-2.5 animate-fade-in ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
        isAI
          ? 'bg-[var(--theme-bg-accent)]/10 text-[var(--theme-text-link)]'
          : 'bg-[var(--theme-bg-tertiary)] text-[var(--theme-text-secondary)]'
      }`}>
        {isAI ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
      </div>

      {/* Message Bubble & Content */}
      <div className={`flex flex-col max-w-[85%] ${isAI ? 'items-start w-full' : 'items-end'}`}>
        <div
          className={`text-sm leading-relaxed relative group transition-all ${
            isAI
              ? 'w-full text-[var(--theme-text-primary)] pr-8 py-0.5'
              : 'px-4 py-3 rounded-2xl bg-[var(--theme-bg-user-message)] text-[var(--theme-bg-user-message-text)] border border-[var(--theme-border-secondary)]/40 shadow-2xs whitespace-pre-wrap'
          }`}
        >
          {/* Copy Button */}
          <button
            onClick={() => copyToClipboard(msg.text)}
            className={`absolute top-0 right-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100 text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-tertiary)]`}
            title="复制文本"
            aria-label="复制文本"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
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
            className="mt-2.5 rounded-xl border border-[var(--theme-border-secondary)]/70 bg-[var(--theme-bg-primary)] hover:border-[var(--theme-border-focus)] hover:bg-[var(--theme-bg-tertiary)]/30 p-3 shadow-2xs transition-all text-left group w-full max-w-[340px] active:scale-[0.98]"
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-xs font-semibold text-[var(--theme-text-primary)] flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--theme-text-link)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--theme-text-link)]"></span>
                </span>
                <MapPin className="w-3.5 h-3.5 text-[var(--theme-text-link)]" />
                第 {msg.locationData.pageNumber} 页答案定位
              </span>
              <span className="text-[11px] font-medium text-[var(--theme-text-link)] flex items-center gap-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                定位 <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            {msg.locationData.snippet && (
              <div className="text-xs text-[var(--theme-text-secondary)] line-clamp-2 border-l-2 border-[var(--theme-border-focus)]/50 pl-2 mt-1 italic">
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

