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
      className="absolute inset-0 z-[100] bg-indigo-950/40 backdrop-blur-md p-6 flex items-center justify-center transition-all animate-fade-in"
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex flex-col items-center p-12 glass-card bg-white/95 dark:bg-gray-900/95 border-2 border-dashed border-indigo-500 rounded-3xl shadow-2xl animate-zoom-in max-w-md text-center ring-8 ring-indigo-500/10">
        <div className="w-20 h-20 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 ring-4 ring-indigo-500/20 shadow-md animate-bounce-subtle">
          <Upload className="w-10 h-10" strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">释放以载入 PDF</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          Gemini 3 将自动解析文档并开启视觉定位问答
        </p>
      </div>
    </div>
  );
};

export default DragDropOverlay;