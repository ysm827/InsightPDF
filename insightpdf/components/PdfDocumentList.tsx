import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { LocatorResult } from '@/types';
import { PDF_CONFIG } from '@/constants';
import PdfOverlay from './PdfOverlay';

// Use the locally bundled worker (previously fetched from unpkg at runtime)
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

interface PdfDocumentListProps {
  file: File;
  numPages: number | null;
  containerWidth: number;
  scale: number;
  showOverlay: boolean;
  activeResult: LocatorResult | null;
  currentPage: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  onRegisterPageRef: (pageIndex: number, el: HTMLDivElement | null) => void;
  onPageLoad?: (page: { originalWidth: number; originalHeight: number }) => void;
}

const PdfDocumentList: React.FC<PdfDocumentListProps> = ({
  file,
  numPages,
  containerWidth,
  scale,
  showOverlay,
  activeResult,
  currentPage,
  onLoadSuccess,
  onRegisterPageRef,
  onPageLoad
}) => {
  return (
    <div className="flex flex-col gap-6 pb-20">
      <Document
        file={file}
        onLoadSuccess={onLoadSuccess}
        onLoadError={(error) => console.error('[InsightPDF] PDF render error:', error)}
        className="flex flex-col gap-6"
        loading={
          <div className="flex flex-col items-center justify-center h-96 w-full gap-3 text-indigo-600 dark:text-indigo-400">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent dark:border-indigo-400"></div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">正在解析 PDF 页面...</span>
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto my-12 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-red-200/80 dark:border-red-900/40">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">
              PDF 页面解析失败
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
              请检查该 PDF 文件是否损坏或受密码保护，也可以尝试重新上传该文件。
            </p>
          </div>
        }
      >
        {numPages && Array.from(new Array(numPages), (_, index) => {
          const pageIndex = index + 1;
          const scaledWidth = containerWidth * scale;
          
          // Optimization: Only render pages close to the current viewport
          // This dramatically improves performance during zoom by not re-rendering the whole PDF
          const shouldRender = Math.abs(pageIndex - currentPage) <= PDF_CONFIG.WINDOW_RENDER_SIZE;

          return (
            <div
              key={pageIndex}
              data-page-number={pageIndex}
              ref={(el) => onRegisterPageRef(pageIndex, el)}
              className="relative shadow-lg transition-all duration-200 ease-in-out bg-white mx-auto"
              style={{ 
                width: scaledWidth,
                minHeight: scaledWidth * 1.294 // Approximate A4 aspect ratio to maintain scroll height
              }} 
            >
              {shouldRender ? (
                <>
                  <Page 
                    key={`${pageIndex}-${scale}`} // Force re-render when scale changes (only for visible pages)
                    pageNumber={pageIndex} 
                    width={scaledWidth} 
                    className="bg-white"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    onLoadSuccess={(page) => {
                      // Report dimensions of the first page to parent for auto-fit logic
                      if (pageIndex === 1 && onPageLoad) {
                        onPageLoad({ 
                          originalWidth: page.originalWidth, 
                          originalHeight: page.originalHeight 
                        });
                      }
                    }}
                    loading={
                      <div 
                        className="bg-white animate-pulse flex items-center justify-center text-gray-400 text-sm"
                        style={{ width: scaledWidth, height: scaledWidth * 1.294 }}
                      >
                        正在加载第 {pageIndex} 页...
                      </div>
                    }
                  />
                  <PdfOverlay 
                    result={activeResult} 
                    pageNumber={pageIndex} 
                    showOverlay={showOverlay} 
                  />
                </>
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center text-gray-300 text-sm bg-white"
                  style={{ height: scaledWidth * 1.294 }}
                >
                  <span className="sr-only">第 {pageIndex} 页</span>
                </div>
              )}
            </div>
          );
        })}
      </Document>
    </div>
  );
};

export default PdfDocumentList;