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

function extractMainContent(html) {
  // Extract body content
  let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  // Sandbox the layout by converting layout 'fixed' positioning to 'absolute'.
  content = content.replace(/(?<!-)\bfixed\b/g, 'absolute');
  
  // Make height constraints relative to container
  content = content.replace(/\bh-screen\b/g, 'h-full min-h-[800px]');
  content = content.replace(/\bmin-h-screen\b/g, 'min-h-[800px]');

  return content;
}

function extractCustomCSS(html) {
  const styles = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    styles.push(match[1]);
  }
  return styles.join('\n');
}

function convertHtmlToJsx(html) {
  let content = html;

  // Replace class= with className=
  content = content.replace(/\bclass=/g, 'className=');
  content = content.replace(/\bfor=/g, 'htmlFor=');
  content = content.replace(/\btabindex=/g, 'tabIndex=');

  // Replace inline style strings with JSX style objects
  content = content.replace(/style="([^"]*)"/g, (match, p1) => {
    const rules = p1.split(';').filter(r => r.trim());
    const parts = [];
    rules.forEach(r => {
      const colonIdx = r.indexOf(':');
      if (colonIdx === -1) return;
      let key = r.substring(0, colonIdx).trim();
      let val = r.substring(colonIdx + 1).trim();
      key = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      parts.push(`${key}: \`${val}\``);
    });
    return `style={{${parts.join(', ')}}}`;
  });

  const voidTags = ['img', 'input', 'br', 'hr', 'source', 'track', 'embed', 'col', 'meta', 'link'];
  voidTags.forEach(tag => {
    const regex = new RegExp(`<${tag}\\b([^>]*?)(?<!/)>(?!\\s*</${tag})`, 'gi');
    content = content.replace(regex, `<${tag}$1 />`);
  });

  const svgSelfClosedTags = ['line', 'circle', 'rect', 'path', 'polygon', 'polyline', 'ellipse', 'use'];
  svgSelfClosedTags.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*?)\\s*/></${tag}>`, 'gi');
    content = content.replace(regex, `<${tag}$1 />`);
  });

  svgSelfClosedTags.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*?)\\s*/>\\s*(<[^/])`, 'gi');
    content = content.replace(regex, `<${tag}$1>$2`);
  });

  const svgAttrMap = {
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'clip-rule': 'clipRule',
    'fill-rule': 'fillRule',
    'stroke-miterlimit': 'strokeMiterlimit',
    'fill-opacity': 'fillOpacity',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset',
    'stop-color': 'stopColor',
    'stop-opacity': 'stopOpacity',
    'clip-path': 'clipPath',
    'font-size': 'fontSize',
    'font-family': 'fontFamily',
    'text-anchor': 'textAnchor',
    'dominant-baseline': 'dominantBaseline',
    'repeatcount': 'repeatCount',
    'viewbox': 'viewBox',
  };
  Object.entries(svgAttrMap).forEach(([from, to]) => {
    const regex = new RegExp(`\\b${from}=`, 'g');
    content = content.replace(regex, `${to}=`);
  });

  content = content.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

  content = content.replace(/<pre([^>]*)>([\s\S]*?)<\/pre>/g, (match, attrs, inner) => {
    if (inner.includes('"auth"') || inner.includes('"theme"')) {
      const escaped = inner.replace(/`/g, '\\`');
      return `<pre${attrs}>{\`${escaped}\`}</pre>`;
    }
    return match;
  });

  // Hardcoded fixes for known JSX unclosed literal braces in the specific code snippet
  content = content.replace(
    'init_kinetic_buffer(stream_id) {<br/>',
    'init_kinetic_buffer(stream_id) {"{"}<br/>'
  );
  content = content.replace(
    ".pipe({ format: <span className=\"text-tertiary-fixed\">'GL_BUFFER'</span> });<br/>\n                            }<br/>",
    ".pipe({\"{\"} format: <span className=\"text-tertiary-fixed\">'GL_BUFFER'</span> {\"}\"});<br/>\n                            {\"}\"}<br/>"
  );

  return content;
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
  let allCSS = '';
  // Inject the required tailwind components
  let finalContent = `import React from 'react';\nimport './Module3Stitch.css';\n\n`;

  for (let i = 0; i < urls.length; i++) {
    console.log("Downloading", componentNames[i]);
    const html = await download(urls[i]);
    
    const css = extractCustomCSS(html);
    if (css) allCSS += `\n/* === ${componentNames[i]} === */\n${css}\n`;

    console.log("Converting", componentNames[i]);
    const mainContent = extractMainContent(html);
    let jsx = convertHtmlToJsx(mainContent);
    
    // Hardcode fixes for specific known JSX compilation errors in the payload
    jsx = jsx.replace(/<line stroke="rgba\(0, 240, 255, 0.2\)" strokeWidth="1" x1="50%" x2="30%" y1="50%" y2="35%" \/><\/line>/g, '<line stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" x1="50%" x2="30%" y1="50%" y2="35%"></line>');
    jsx = jsx.replace(/<line stroke="rgba\(0, 240, 255, 0.2\)" strokeWidth="1" x1="50%" x2="70%" y1="50%" y2="35%" \/><\/line>/g, '<line stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" x1="50%" x2="70%" y1="50%" y2="35%"></line>');
    jsx = jsx.replace(/<line stroke="rgba\(0, 240, 255, 0.2\)" strokeWidth="1" x1="50%" x2="50%" y1="50%" y2="70%" \/><\/line>/g, '<line stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" x1="50%" x2="50%" y1="50%" y2="70%"></line>');
    jsx = jsx.replace(/<circle fill="#00dbe9" r="3" \/>/g, '<circle fill="#00dbe9" r="3">');

    finalContent += `export function ${componentNames[i]}() {
  return (
    <div className="stitch-page relative w-full h-[800px] overflow-hidden overflow-y-auto rounded-xl border border-outline-variant/30 shadow-2xl bg-[#0e0e0e]" style={{ isolation: 'isolate' }}>
      ${jsx}
    </div>
  );
}\n\n`;
  }

  fs.writeFileSync('./src/Module3Redesign.jsx', finalContent);
  console.log("Written components to src/Module3Redesign.jsx");

  // Write Tailwind Theme Directives AND Scoped CSS
  const scopedCSS = `
@theme {
  --color-primary: #00dbe9;
  --color-primary-container: #004f55;
  --color-secondary: #cf5cff;
  --color-secondary-container: #610094;
  --color-tertiary: #ff8a00;
  --color-tertiary-container: #7a2d00;
  --color-surface: #131313;
  --color-surface-container-lowest: #0e0e0e;
  --color-surface-container-low: #1c1b1b;
  --color-surface-container: #2a2a29;
  --color-surface-container-high: #353534;
  --color-surface-container-highest: #414040;
  --color-error: #ff5449;
  --color-error-container: #93000a;
  --color-outline: #8dfaf0;
  --color-outline-variant: #3b494b;
  --color-background: #131313;
  --color-on-primary: #00363a;
  --color-on-primary-container: #aff0f8;
  --color-on-secondary: #4d0078;
  --color-on-secondary-container: #f0b0ff;
  --color-on-tertiary: #481500;
  --color-on-tertiary-container: #ffd0b7;
  --color-on-surface: #e5e2e1;
  --color-on-surface-variant: #bfc8ca;
  --color-on-error: #690005;
  --color-on-background: #e5e2e1;
}

.stitch-page {
  color: #e5e2e1;
  font-family: 'Manrope', sans-serif;
  background-color: var(--color-background);
}
.stitch-page * {
  box-sizing: border-box;
}
.stitch-page .font-headline, .stitch-page h1, .stitch-page h2, .stitch-page h3, .stitch-page h4 {
  font-family: 'Epilogue', sans-serif;
}
.stitch-page .font-body { font-family: 'Manrope', sans-serif; }
.stitch-page .font-label { font-family: 'Space Grotesk', 'Manrope', sans-serif; }
.stitch-page .glass-panel {
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.stitch-page .glass-card {
  background: rgba(26, 26, 26, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
}
.stitch-page .glow-node {
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
}
.stitch-page .neon-glow-primary {
  box-shadow: 0 0 30px rgba(199, 153, 255, 0.15);
}
.stitch-page .timeline-gradient {
  background: linear-gradient(to bottom, rgba(0,240,255,0.4), rgba(207,92,255,0.4), rgba(0,240,255,0.2));
}
.stitch-page .grid-bg {
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
.stitch-page .bg-noir-gradient {
  background: linear-gradient(135deg, #c799ff, #bc87fe);
}

/* Material Icons fixes */
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
}

${allCSS}`;

  fs.writeFileSync('./src/Module3Stitch.css', scopedCSS);
  console.log("Written CSS to src/Module3Stitch.css");
}

run().catch(console.error);
