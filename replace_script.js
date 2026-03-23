const fs = require('fs');
const appJsx = fs.readFileSync('src/App.jsx', 'utf8');
const replacement = fs.readFileSync('new_project_setup.jsx', 'utf8');

const lines = appJsx.split('\n');
const startIdx = lines.findIndex(l => l.startsWith('function PageProjectSetup() {'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.startsWith('function PageDesignSystem() {'));

if (startIdx !== -1 && endIdx !== -1) {
  const newLines = lines.slice(0, startIdx).concat([replacement]).concat(lines.slice(endIdx));
  fs.writeFileSync('src/App.jsx', newLines.join('\n'));
  console.log('Replaced from line ' + startIdx + ' to ' + endIdx);
} else {
  console.log('Could not find boundaries.', startIdx, endIdx);
}
