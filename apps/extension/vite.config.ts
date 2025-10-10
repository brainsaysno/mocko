import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync } from 'fs';

const isBackground = process.env.BUILD_TARGET === 'background';
const isContent = process.env.BUILD_TARGET === 'content';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        copyFileSync(
          resolve(__dirname, 'manifest.json'),
          resolve(__dirname, '../../dist/apps/extension/manifest.json')
        );
      },
    },
  ],
  build: {
    outDir: '../../dist/apps/extension',
    emptyOutDir: !isBackground && !isContent,
    minify: 'terser',
    rollupOptions: {
      input: isBackground
        ? { background: resolve(__dirname, 'src/background.ts') }
        : isContent
        ? { content: resolve(__dirname, 'src/content.ts') }
        : { popup: resolve(__dirname, 'popup.html') },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        format: isContent ? 'iife' : 'es',
        inlineDynamicImports: isBackground || isContent,
      },
    },
  },
});
