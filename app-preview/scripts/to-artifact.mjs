// Turn the single-file Vite build into a page body the Artifact tool can publish:
// keep the title, styles and the inline module script, drop the html/head/body wrapper.
import { readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const styles = [...html.matchAll(/<style[^>]*>[\s\S]*?<\/style>/g)].map((m) => m[0]);
const scripts = [...html.matchAll(/<script type="module"[^>]*>[\s\S]*?<\/script>/g)].map((m) => m[0]);
if (!scripts.length) throw new Error('No inline module script found in dist/index.html');

const page = [
  '<title>모두돌봄 미리보기</title>',
  ...styles,
  '<div id="root"></div>',
  ...scripts,
].join('\n');

writeFileSync(new URL('../dist/artifact.html', import.meta.url), page);
console.log(`dist/artifact.html: ${(page.length / 1024).toFixed(0)} KB`);
