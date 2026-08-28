import React, { useState, useCallback, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import { SIDEBAR_CONFIG } from '@/constants';

interface ResizableSidebarProps {
  children: React.ReactNode;
  isDesktop: boolean;
}

const ResizableSidebar: React.FC<ResizableSidebarProps> = ({ children, isDesktop }) => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(SIDEBAR_CONFIG.DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = Math.max(
          SIDEBAR_CONFIG.MIN_WIDTH,
          Math.min(mouseMoveEvent.clientX, SIDEBAR_CONFIG.MAX_WIDTH)
        );
        setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      // Prevent text selection while resizing
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div className="flex h-full relative">
      {/* Sidebar Wrapper */}
      <div 
        className="flex-shrink-0 w-full md:w-auto relative flex flex-col h-full border-b md:border-b-0 md:border-r border-[var(--theme-border-primary)]"
        style={{ width: isDesktop ? sidebarWidth : '100%' }}
      >
        {children}
      </div>

      {/* Resizer Handle (Desktop Only) */}
      <div
        className="hidden md:flex w-4 -ml-2 z-50 cursor-col-resize items-center justify-center group hover:bg-transparent transition-all select-none flex-shrink-0 relative h-full"
        onMouseDown={startResizing}
      >
        {/* Visual Line area */}
        <div className="w-1 h-full flex justify-center group-hover:bg-[var(--theme-bg-accent)]/10 transition-colors">
            <div className="w-[1px] h-full bg-[var(--theme-border-primary)] group-hover:bg-[var(--theme-border-focus)] transition-colors" />
        </div>
        
        {/* Grip Icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--theme-bg-primary)] border border-[var(--theme-border-secondary)] rounded-md shadow-2xs p-0.5 pointer-events-none">
           <GripVertical className="w-3 h-3 text-[var(--theme-text-secondary)]" />
        </div>
      </div>

      {/* Overlay to catch mouse events over iframe/canvas during resizing */}
      {isResizing && (
        <div className="fixed inset-0 z-[100] cursor-col-resize bg-transparent" />
      )}
    </div>
  );
};

export default ResizableSidebar;