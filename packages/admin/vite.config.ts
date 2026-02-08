import { defineConfig } from 'vite';

export default defineConfig({
  base: '/admin/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 7080,
    proxy: {
      '/api': 'http://localhost:7075',
      '/ws': {
        target: 'ws://localhost:7075',
        ws: true,
      },
    },
  },
});
