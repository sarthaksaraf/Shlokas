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
      '/api': 'http://localhost:3001'
    },
    hmr: {
      clientPort: 443
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
});

