import React, { useState, useEffect } from 'react';
import type { LocatorResult } from '@/types';
import PdfToolbar from './PdfToolbar';
import PdfDocumentList from './PdfDocumentList';
import { usePdfNavigation } from '@/hooks/usePdfNavigation';
import { usePdfContainer } from '@/hooks/usePdfContainer';
import { usePdfZoom } from '@/hooks/usePdfZoom';

interface PdfViewerProps {
  file: File | null;
  result: LocatorResult | null;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file, result }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);

  // Use navigation hook which owns the scroll container ref
  const {
    pageNumber,
    containerRef,
    scrollToPage,
    registerPageRef,
    setPageNumber
  } = usePdfNavigation(numPages);

  // Use modular hooks for container sizing and zooming
  const { containerWidth } = usePdfContainer(containerRef);
  const { 
    scale, 
    setScale, 
    pdfPageSize, 
    setPdfPageSize, 
    handleZoom, 
    handleFitToWindow, 
    handleFitToWidth, 
    calculateFitScale 
  } = usePdfZoom(containerRef);

  // Reset state when file changes
  useEffect(() => {
    setPdfPageSize(null);
    setScale(1.0);
  }, [file, setPdfPageSize, setScale]);

  // Auto-jump to page when result changes
  useEffect(() => {
    if (result && result.pageNumber) {
      scrollToPage(result.pageNumber);
      setShowOverlay(true); 
    }
  }, [result, scrollToPage]);

  // Handle initial page load to determine auto-fit behavior
  const handlePageLoad = (page: { originalWidth: number; originalHeight: number }) => {
    // Only auto-fit on initial load of the file
    if (!pdfPageSize) {
      setPdfPageSize({ width: page.originalWidth, height: page.originalHeight });
      
      // Smart default: 
      // If landscape (like slides), fit to window so you see the whole slide.
      // If portrait (like docs), fit to width so text is readable.
      const isLandscape = page.originalWidth > page.originalHeight;
      
      if (isLandscape) {
         const bestScale = calculateFitScale(page.originalWidth, page.originalHeight);
         setScale(bestScale);
      } else {
         setScale(1.0); // Fit Width
      }
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    const newPage = Math.max(1, Math.min(pageNumber + offset, numPages || 1));
    scrollToPage(newPage);
  };

  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-100/70 dark:bg-[#0a0e17] transition-colors">
        <div className="flex flex-col items-center max-w-sm text-center p-8 rounded-3xl border-2 border-dashed border-gray-300/80 dark:border-gray-800 bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 ring-4 ring-indigo-500/10 shadow-sm">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-1">
            等待载入 PDF 文档
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
            将 PDF 文件拖放到窗口中，或在左侧面板中点击上传按钮
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-mono">
            支持标准 PDF 格式
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-100 dark:bg-[#0b0f19] transition-colors duration-300">
      <PdfToolbar 
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        showOverlay={showOverlay}
        onPageChange={changePage}
        onToggleOverlay={() => setShowOverlay(!showOverlay)}
        onZoom={handleZoom}
        onFitToWindow={handleFitToWindow}
        onFitToWidth={handleFitToWidth}
      />

      {/* PDF Canvas - Continuous Scroll */}
      <div 
        className="flex-1 overflow-auto p-8 relative scroll-smooth" 
        ref={containerRef}
      >
        <PdfDocumentList
          file={file}
          numPages={numPages}
          containerWidth={containerWidth}
          scale={scale}
          showOverlay={showOverlay}
          activeResult={result}
          currentPage={pageNumber}
          onLoadSuccess={onDocumentLoadSuccess}
          onRegisterPageRef={registerPageRef}
          onPageLoad={handlePageLoad}
        />
      </div>
    </div>
  );
};

export default PdfViewer;
