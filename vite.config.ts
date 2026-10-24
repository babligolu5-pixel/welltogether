import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['firebase', '@firebase/app', '@firebase/firestore'],
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore/lite'],
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
});
