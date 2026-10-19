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
});
