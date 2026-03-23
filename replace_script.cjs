const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'src/App.jsx');
const newComponentPath = path.join(process.cwd(), 'new_design_system.jsx');

const appJsx = fs.readFileSync(appPath, 'utf8');
const replacement = fs.readFileSync(newComponentPath, 'utf8');

const lines = appJsx.split('\n');
const startIdx = lines.findIndex(l => l.startsWith('function PageDesignSystem() {'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.startsWith('function PageStateManagement() {'));

if (startIdx !== -1 && endIdx !== -1) {
  const newLines = lines.slice(0, startIdx).concat([replacement]).concat(lines.slice(endIdx));
  fs.writeFileSync(appPath, newLines.join('\n'));
  console.log('Replaced from line ' + startIdx + ' to ' + endIdx);
} else {
  console.log('Could not find boundaries.', startIdx, endIdx);
}
