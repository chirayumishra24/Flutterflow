const fs = require('fs');
const path = require('path');

const appPath = path.join(process.cwd(), 'src/App.jsx');
const newComponentPath = path.join(process.cwd(), 'new_project_setup_v2.jsx');

const appJsx = fs.readFileSync(appPath, 'utf8');
const replacement = fs.readFileSync(newComponentPath, 'utf8');

const lines = appJsx.split('\n');
const startIdx = lines.findIndex(l => l.startsWith('function PageProjectSetup() {'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.startsWith('function PageDesignSystem() {'));

if (startIdx !== -1 && endIdx !== -1) {
  const newLines = lines.slice(0, startIdx).concat([replacement]).concat(lines.slice(endIdx));
  fs.writeFileSync(appPath, newLines.join('\n'));
  console.log('Replaced from line ' + startIdx + ' to ' + endIdx);
} else {
  console.log('Could not find boundaries.', startIdx, endIdx);
}
