import React from 'react';
import { MapPin, ArrowDown } from 'lucide-react';
import type { LocatorResult } from '@/types';

interface PdfOverlayProps {
  result: LocatorResult | null;
  pageNumber: number;
  showOverlay: boolean;
}

const PdfOverlay: React.FC<PdfOverlayProps> = ({ result, pageNumber, showOverlay }) => {
  if (!result || !result.box2d || result.pageNumber !== pageNumber || !showOverlay) return null;

  const [ymin, xmin, ymax, xmax] = result.box2d;

  // Convert 0-1000 scale to percentages
  const top = ymin / 10;
  const left = xmin / 10;
  const height = (ymax - ymin) / 10;
  const width = (xmax - xmin) / 10;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
      {/* Glowing Bounding Box */}
      <div 
        className="absolute rounded-lg border-2 border-indigo-500 bg-indigo-500/15 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-300 ring-4 ring-indigo-500/20"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${width}%`,
          height: `${height}%`,
        }}
      >
        {/* Corner Target Accents */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-indigo-400 rounded-tl-xs" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-indigo-400 rounded-tr-xs" />
        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-indigo-400 rounded-bl-xs" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-indigo-400 rounded-br-xs" />
      </div>
      
      {/* Floating Target Pin & Badge */}
      <div 
        className="absolute flex flex-col items-center animate-bounce-subtle z-30 pointer-events-none"
        style={{
          top: `${top}%`,
          left: `${left + width / 2}%`,
          transform: 'translate(-50%, -100%) translateY(-8px)'
        }}
      >
        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-indigo-600/30 whitespace-nowrap border border-white/20">
          <MapPin className="w-3 h-3 text-amber-300" />
          <span>定位目标</span>
        </div>
        <ArrowDown className="w-5 h-5 text-indigo-600 dark:text-indigo-400 drop-shadow-md -mt-0.5" strokeWidth={3} />
      </div>
    </div>
  );
};

export default PdfOverlay;