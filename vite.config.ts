import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015'
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:55761',
        changeOrigin: true,
        secure: false
      },
      '/server/uploads': {
        target: 'http://localhost:55761',
        changeOrigin: true,
        secure: false
      },
    }
  }
});
