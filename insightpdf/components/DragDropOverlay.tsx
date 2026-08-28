import React from 'react';
import { Upload } from 'lucide-react';

interface DragDropOverlayProps {
  isDragging: boolean;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const DragDropOverlay: React.FC<DragDropOverlayProps> = ({ isDragging, onDragLeave, onDragOver, onDrop }) => {
  if (!isDragging) return null;

  return (
    <div 
      className="absolute inset-0 z-[100] bg-black/50 backdrop-blur-sm p-6 flex items-center justify-center transition-all animate-fade-in select-none"
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center p-10 bg-[var(--theme-bg-primary)] border-2 border-dashed border-[var(--theme-border-focus)] rounded-2xl shadow-2xl animate-zoom-in max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--theme-bg-accent)]/10 text-[var(--theme-text-link)] flex items-center justify-center mb-4 shadow-sm">
          <Upload className="w-8 h-8" strokeWidth={2} />
        </div>
        <h2 className="text-xl font-bold text-[var(--theme-text-primary)]">释放以载入 PDF</h2>
        <p className="text-[var(--theme-text-secondary)] mt-1.5 text-xs sm:text-sm">
          Gemini 3 将自动解析文档并开启视觉定位问答
        </p>
      </div>
    </div>
  );
};

export default DragDropOverlay;