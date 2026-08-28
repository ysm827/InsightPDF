import React from 'react';
import { ChevronRight, ChevronLeft, ZoomIn, ZoomOut, Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';

interface PdfToolbarProps {
  pageNumber: number;
  numPages: number | null;
  scale: number;
  showOverlay: boolean;
  onPageChange: (offset: number) => void;
  onToggleOverlay: () => void;
  onZoom: (delta: number) => void;
  onFitToWindow?: () => void;
  onFitToWidth?: () => void;
}

const PdfToolbar: React.FC<PdfToolbarProps> = ({
  pageNumber,
  numPages,
  scale,
  showOverlay,
  onPageChange,
  onToggleOverlay,
  onZoom,
  onFitToWindow,
  onFitToWidth
}) => {
  return (
    <div className="h-12 px-4 bg-[var(--theme-bg-secondary)] border-b border-[var(--theme-border-primary)] flex items-center justify-between z-20 select-none transition-colors">
      {/* Left: Page Navigator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[var(--theme-bg-tertiary)]/60 rounded-lg p-0.5 border border-[var(--theme-border-secondary)]/50 shadow-2xs">
          <button 
            onClick={() => onPageChange(-1)} 
            disabled={pageNumber <= 1}
            aria-label="上一页"
            className="w-7 h-7 flex items-center justify-center text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-primary)] hover:text-[var(--theme-text-primary)] rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
            title="上一页"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="px-2.5 flex items-center gap-1 text-xs font-semibold text-[var(--theme-text-primary)] select-none">
            <span>{pageNumber}</span>
            <span className="text-[var(--theme-text-tertiary)] font-normal">/</span>
            <span className="text-[var(--theme-text-secondary)] font-mono">{numPages || '--'}</span>
          </div>
          <button 
            onClick={() => onPageChange(1)} 
            disabled={numPages ? pageNumber >= numPages : true}
            aria-label="下一页"
            className="w-7 h-7 flex items-center justify-center text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-primary)] hover:text-[var(--theme-text-primary)] rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
            title="下一页"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      {/* Right: Actions, Fit & Zoom */}
      <div className="flex items-center gap-1.5">
        {/* Toggle Visual Grounding Overlay */}
        <button 
          onClick={onToggleOverlay}
          aria-label={showOverlay ? '隐藏定位图层' : '显示定位图层'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            showOverlay 
              ? 'bg-[var(--theme-bg-accent)]/12 text-[var(--theme-text-link)] border border-[var(--theme-border-focus)]/30 shadow-2xs' 
              : 'text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-tertiary)]/70 hover:text-[var(--theme-text-primary)] border border-transparent'
          }`}
          title={showOverlay ? '已开启高亮定位（点击隐藏）' : '已隐藏高亮定位（点击显示）'}
        >
          {showOverlay ? (
            <>
              <Eye className="w-3.5 h-3.5 text-[var(--theme-text-link)]" />
              <span className="hidden sm:inline">高亮定位</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">隐藏定位</span>
            </>
          )}
        </button>
        
        <div className="w-px h-3.5 bg-[var(--theme-border-primary)] mx-0.5"></div>

        {/* Fit width & window */}
        {onFitToWidth && (
          <button
            onClick={onFitToWidth}
            aria-label="适应页面宽度"
            className="w-7 h-7 flex items-center justify-center hover:bg-[var(--theme-bg-tertiary)] rounded-lg text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-all active:scale-95"
            title="适应宽度"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        )}

        {onFitToWindow && (
          <button
            onClick={onFitToWindow}
            aria-label="适应整页"
            className="w-7 h-7 flex items-center justify-center hover:bg-[var(--theme-bg-tertiary)] rounded-lg text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-all active:scale-95"
            title="适应整页"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Zoom Controls (AMC Segmented Track style) */}
        <div className="flex items-center bg-[var(--theme-bg-tertiary)]/60 rounded-lg p-0.5 border border-[var(--theme-border-secondary)]/50">
          <button 
            onClick={() => onZoom(-0.1)}
            aria-label="缩小"
            className="w-7 h-7 flex items-center justify-center hover:bg-[var(--theme-bg-primary)] rounded-md text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-all active:scale-95"
            title="缩小"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={onFitToWidth}
            className="px-2 text-xs font-semibold text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors font-mono"
            title="点击重置为 100%"
          >
            {Math.round(scale * 100)}%
          </button>

          <button 
            onClick={() => onZoom(0.1)}
            aria-label="放大"
            className="w-7 h-7 flex items-center justify-center hover:bg-[var(--theme-bg-primary)] rounded-md text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-all active:scale-95"
            title="放大"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfToolbar;