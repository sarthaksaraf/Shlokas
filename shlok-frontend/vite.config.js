import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
   optimizeDeps: {
    include: ['three', 'three/examples/jsm/loaders/GLTFLoader']
  },
  server: {
    allowedHosts: ['.ngrok-free.app'],
    host: '0.0.0.0',
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Remove the rewrite line
      }
    },
    hmr: {
      clientPort: 443
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
});

