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
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[var(--theme-bg-primary)] transition-colors">
        <div className="flex flex-col items-center max-w-sm text-center p-8 rounded-2xl border border-[var(--theme-border-secondary)]/60 bg-[var(--theme-bg-secondary)]/40 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-[var(--theme-bg-accent)]/10 text-[var(--theme-text-link)] flex items-center justify-center mb-4">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[var(--theme-text-primary)] mb-1">
            等待载入 PDF 文档
          </h3>
          <p className="text-xs text-[var(--theme-text-secondary)] leading-relaxed mb-4">
            将 PDF 文件拖放到窗口中，或在左侧面板中点击上传按钮
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] text-[var(--theme-text-tertiary)] bg-[var(--theme-bg-tertiary)]/70 px-3 py-1 rounded-md font-mono border border-[var(--theme-border-secondary)]/40">
            支持标准 PDF 格式
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--theme-bg-primary)] transition-colors duration-200">
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
