const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'src/App.jsx');
const newComponentPath = path.join(process.cwd(), 'new_file_handling.jsx');

const appJsx = fs.readFileSync(appPath, 'utf8');
const replacement = fs.readFileSync(newComponentPath, 'utf8');

const lines = appJsx.split('\n');
const startIdx = lines.findIndex(l => l.startsWith('function PageFileHandling() {'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.startsWith('function Module4_1Section() {'));

if (startIdx !== -1 && endIdx !== -1) {
  // Wait, is there a comment before Module4_1Section? 
  // Let's find the '/* ═══════ MODULE 4 ═══════ */' comment and use it.
  const module4start = lines.findIndex((l, i) => i > startIdx && l.includes('═══════ MODULE 4 ═══════'));
  const actualEndIdx = module4start !== -1 ? module4start : endIdx;

  const newLines = lines.slice(0, startIdx).concat([replacement]).concat(lines.slice(actualEndIdx));
  fs.writeFileSync(appPath, newLines.join('\n'));
  console.log('Replaced from line ' + startIdx + ' to ' + actualEndIdx);
} else {
  console.log('Could not find boundaries.', startIdx, endIdx);
}
