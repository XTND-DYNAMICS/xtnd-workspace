import { build } from 'esbuild';
import { cpSync, mkdirSync, existsSync } from 'node:fs';

mkdirSync('dist/styles', { recursive: true });
mkdirSync('dist/src', { recursive: true });

cpSync('index.html', 'dist/index.html');
cpSync('src/styles/tokens.css', 'dist/styles/tokens.css');
cpSync('src/styles/theme.css', 'dist/styles/theme.css');

await build({
  entryPoints: ['src/app.ts'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/src/app.js',
  sourcemap: true,
  target: 'es2024'
});

console.log('Web client build complete -> dist/');
