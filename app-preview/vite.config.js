import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// One self-contained HTML file, so the preview can be opened from a single link.
export default defineConfig({
  plugins: [viteSingleFile()],
  server: { fs: { allow: ['..'] } },
  build: { outDir: 'dist', assetsInlineLimit: 100000000, cssCodeSplit: false },
});
