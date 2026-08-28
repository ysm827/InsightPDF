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
    <div className="px-4 py-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 flex items-center justify-between shadow-2xs z-20 transition-colors">
      {/* Left: Page Navigator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-gray-100/90 dark:bg-gray-800/90 rounded-xl p-1 border border-gray-200/50 dark:border-gray-700/50 shadow-2xs">
          <button 
            onClick={() => onPageChange(-1)} 
            disabled={pageNumber <= 1}
            aria-label="上一页"
            className="p-1 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
            title="上一页"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-200 select-none">
            <span>{pageNumber}</span>
            <span className="text-gray-400 dark:text-gray-500 font-normal">/</span>
            <span className="text-gray-500 dark:text-gray-400 font-mono">{numPages || '--'}</span>
          </div>
          <button 
            onClick={() => onPageChange(1)} 
            disabled={numPages ? pageNumber >= numPages : true}
            aria-label="下一页"
            className="p-1 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
            title="下一页"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Right: Actions, Fit & Zoom */}
      <div className="flex items-center gap-1.5">
        {/* Toggle Visual Grounding Overlay */}
        <button 
          onClick={onToggleOverlay}
          aria-label={showOverlay ? '隐藏定位图层' : '显示定位图层'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            showOverlay 
              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-2xs' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
          }`}
          title={showOverlay ? '已开启高亮定位（点击隐藏）' : '已隐藏高亮定位（点击显示）'}
        >
          {showOverlay ? (
            <>
              <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">高亮定位</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">隐藏定位</span>
            </>
          )}
        </button>
        
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-1"></div>

        {/* Fit width & window */}
        {onFitToWidth && (
          <button
            onClick={onFitToWidth}
            aria-label="适应页面宽度"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all active:scale-95"
            title="适应宽度"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        )}

        {onFitToWindow && (
          <button
            onClick={onFitToWindow}
            aria-label="适应整页"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all active:scale-95"
            title="适应整页"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center bg-gray-100/90 dark:bg-gray-800/90 rounded-xl p-1 border border-gray-200/50 dark:border-gray-700/50">
          <button 
            onClick={() => onZoom(-0.1)}
            aria-label="缩小"
            className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-all active:scale-95"
            title="缩小"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <button
            onClick={onFitToWidth}
            className="px-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-mono"
            title="点击重置为 100%"
          >
            {Math.round(scale * 100)}%
          </button>

          <button 
            onClick={() => onZoom(0.1)}
            aria-label="放大"
            className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 transition-all active:scale-95"
            title="放大"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfToolbar;