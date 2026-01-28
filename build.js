const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const srcFiles = ['src/list.js', 'src/loader.js', 'src/filters.js'];
const combined = srcFiles
  .map(f => fs.readFileSync(path.resolve(__dirname, f), 'utf8'))
  .join('\n');

const minify = process.argv.includes('--minify');
const outfile = minify ? 'index.min.js' : 'index.js';

esbuild.transformSync !== undefined; // ensure esbuild is loaded

const result = esbuild.transformSync(combined, {
  minify: minify,
  target: 'es2015',
});

fs.writeFileSync(path.resolve(__dirname, outfile), result.code);
console.log(`  ${outfile}  ${(result.code.length / 1024).toFixed(1)}kb`);
