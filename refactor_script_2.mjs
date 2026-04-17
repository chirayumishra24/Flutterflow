import fs from 'fs';

const APP_JSX_PATH = './src/App.jsx';

let content = fs.readFileSync(APP_JSX_PATH, 'utf-8');

const gridRegex1 = /style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'([^']+)',?\s*([^\}]+)?\s*\}\}/g;
content = content.replace(gridRegex1, (match, gridVal, rest) => {
  if (gridVal.includes('auto-fit') || gridVal.includes('auto-fill') || gridVal.startsWith('42px ') || gridVal.startsWith('30px ') || gridVal.startsWith('82px ') || gridVal.startsWith('52px ')) {
    return match;
  }
  if (rest) {
    return `className="responsive-grid" style={{ ${rest} }}`;
  }
  return `className="responsive-grid"`;
});

const gridRegex2 = /style=\{\{\s*gridTemplateColumns:\s*'([^']+)',?\s*([^\}]+)?\s*\}\}/g;
content = content.replace(gridRegex2, (match, gridVal, rest) => {
  if (gridVal.includes('auto-fit') || gridVal.includes('auto-fill') || gridVal.startsWith('42px ') || gridVal.startsWith('30px ') || gridVal.startsWith('82px ') || gridVal.startsWith('52px ')) {
    return match;
  }
  if (rest) {
    return `style={{ ${rest} }} className="responsive-grid"`;
  }
  return `className="responsive-grid"`;
});

fs.writeFileSync(APP_JSX_PATH, content, 'utf-8');
console.log("Responsive grids applied to App.jsx");
