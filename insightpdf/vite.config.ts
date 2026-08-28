import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), tailwindcss()],
    define: {
      // Expose GEMINI_API_KEY (and its VITE_ prefixed alias) to the client bundle.
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(
        env.VITE_GEMINI_API_KEY ?? env.GEMINI_API_KEY
      ),
    },
    build: {
      // pdfjs-dist ships a large worker; raise the warning threshold to keep builds clean
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // Split heavy vendors into cacheable chunks
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-pdf': ['react-pdf', 'pdfjs-dist'],
            'vendor-ai': ['@google/genai'],
            'vendor-markdown': ['react-markdown', 'remark-math', 'rehype-katex', 'katex'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
