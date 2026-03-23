const fs = require('fs');
const https = require('https');

const urls = [
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2I0NGQ4NDgyZmU4YzRhNjc4MzViYjRhODJmYjI3NjMwEgsSBxCTgaX72AoYAZIBIwoKcHJvamVjdF9pZBIVQhMxNjYyNjE0NzU2NzQyNzkzMTIx&filename=&opi=96797242",
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sX2UzZTNiZThlMzkzZjQ0NzliZDQxMWVlODI0YjYyODRmEgsSBxCTgaX72AoYAZIBIwoKcHJvamVjdF9pZBIVQhMxNjYyNjE0NzU2NzQyNzkzMTIx&filename=&opi=96797242",
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzA3OTZmM2E2ZGY5NDQxM2I5OWJjYWM2YWRmOGNlMDhkEgsSBxCTgaX72AoYAZIBIwoKcHJvamVjdF9pZBIVQhMxNjYyNjE0NzU2NzQyNzkzMTIx&filename=&opi=96797242",
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAxMmYwMWY3YjdiZDQ2MzJiMDRjY2JhOGVmZWQ5ZTJlEgsSBxCTgaX72AoYAZIBIwoKcHJvamVjdF9pZBIVQhMxNjYyNjE0NzU2NzQyNzkzMTIx&filename=&opi=96797242",
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzAzYjI3YTdiNzIxZjRjODU4OTk5ZTI0NjdhMWVjZTdmEgsSBxCTgaX72AoYAZIBIwoKcHJvamVjdF9pZBIVQhMxNjYyNjE0NzU2NzQyNzkzMTIx&filename=&opi=96797242",
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzcwYmQ0MTAyMGIzNDQ3ZmE4NGI2NDM2ZGQ1NDM1OGI5EgsSBxCTgaX72AoYAZIBIwoKcHJvamVjdF9pZBIVQhMxNjYyNjE0NzU2NzQyNzkzMTIx&filename=&opi=96797242",
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzgwNTdkM2NkMzYxMjRlZTliZTQ3NDM0NjM5YTcxNjVjEgsSBxCTgaX72AoYAZIBIwoKcHJvamVjdF9pZBIVQhMxNjYyNjE0NzU2NzQyNzkzMTIx&filename=&opi=96797242",
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzhhMGRhMWU3NTQ0OTQ5NTM5NmEyZjYwMjQ4OWU3NTg5EgsSBxCTgaX72AoYAZIBIwoKcHJvamVjdF9pZBIVQhMxNjYyNjE0NzU2NzQyNzkzMTIx&filename=&opi=96797242",
  "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ7Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpaCiVodG1sXzZjZjVkNjM1YTU2ZTRiMjg5MWI5ODZhOGZjNmJkNzYzEgsSBxCTgaX72AoYAZIBIwoKcHJvamVjdF9pZBIVQhMxNjYyNjE0NzU2NzQyNzkzMTIx&filename=&opi=96797242"
];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function convertHtmlToJsx(html) {
  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : html;

  // Replace class= with className=
  bodyContent = bodyContent.replace(/class=/g, 'className=');

  // Replace inline styles (basic conversion for string styles to object)
  // This is tricky, replacing common cases or just stripping body style since we handle it in React
  // For safety, let's remove style strings or do a rudimentary conversion.
  // Actually, Stitch usually uses tailwind classes, so inline styles are rare except for CSS variables.
  // We will leave style alone and hope it's not complex, or we can replace style="..." with style={{}}
  bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, p1) => {
    const rules = p1.split(';').filter(r => r.trim());
    const obj = {};
    rules.forEach(r => {
      let [key, val] = r.split(':');
      if(key && val) {
        // CamelCase key
        key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
        obj[key] = val.trim();
      }
    });
    return `style={{${Object.entries(obj).map(([k,v]) => `${k}: \`${v}\``).join(', ')}}}`;
  });

  // Self closing tags
  const voidTags = ['img', 'input', 'br', 'hr', 'path', 'circle', 'rect', 'line', 'polygon', 'polyline', 'source', 'track', 'embed', 'col'];
  voidTags.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
    bodyContent = bodyContent.replace(regex, `<${tag}$1 />`);
  });

  // Replace SVG attributes
  const svgAttrs = [
    'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'clip-rule', 'fill-rule', 
    'stroke-miterlimit', 'fill-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stop-color', 'stop-opacity'
  ];
  svgAttrs.forEach(attr => {
    const camel = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
    const regex = new RegExp(attr + '=', 'g');
    bodyContent = bodyContent.replace(regex, camel + '=');
  });

  // Replace comments
  bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  
  // tabindex -> tabIndex
  bodyContent = bodyContent.replace(/tabindex=/g, 'tabIndex=');
  // for -> htmlFor
  bodyContent = bodyContent.replace(/for=/g, 'htmlFor=');

  return bodyContent;
}

const componentNames = [
  "PageListProjectsStitch",
  "PageWhatIsProjectStitch",
  "PageHowToCreateStitch",
  "PageRunAndTestStitch",
  "PageGeneralSettingsStitch",
  "PageProjectSetupStitch",
  "PageDesignSystemStitch",
  "PageStateManagementStitch",
  "PageFileHandlingStitch"
];

async function run() {
  let finalContent = `import React from 'react';\n\n`;

  for (let i = 0; i < urls.length; i++) {
    console.log("Downloading", componentNames[i]);
    const html = await download(urls[i]);
    console.log("Converting", componentNames[i]);
    const jsx = convertHtmlToJsx(html);
    
    // Wrap in component
    finalContent += `export function ${componentNames[i]}() {\n  return (\n    <div className="stitch-module-page">\n      ${jsx}\n    </div>\n  );\n}\n\n`;
  }

  fs.writeFileSync('./src/Module3Redesign.jsx', finalContent);
  console.log("Written successfully to src/Module3Redesign.jsx");
}

run().catch(console.error);
