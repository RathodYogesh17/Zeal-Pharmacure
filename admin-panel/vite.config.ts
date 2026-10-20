import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Zeal Pharma Admin Panel Vite Config
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 5174,
    host: true,
  },
  preview: {
    port: 5174,
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'vendor-antd';
            }
            if (id.includes('quill')) {
              return 'vendor-quill';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@tanstack/react-query') || id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'vendor-state';
            }
          }
        },
      },
    },
  },
});
