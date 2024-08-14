import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/static-apps/resource-catalogue/main/', // TODO: This will only retrieve the asset from the main branch
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'styles': path.resolve(__dirname, './src/styles'),
      'typings': path.resolve(__dirname, './src/typings'),
      'utils': path.resolve(__dirname, './src/utils'),
    }
  }
});
