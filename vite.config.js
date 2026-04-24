import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for Valent Trust demo.
// No TypeScript. No path aliases. Single-page React 18 app.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  preview: {
    port: 4173,
  },
});
