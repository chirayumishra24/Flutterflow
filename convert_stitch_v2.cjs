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

  // Remove ALL <nav> elements (top nav, side nav, bottom nav)
  content = content.replace(/<nav[\s\S]*?<\/nav>/gi, '');

  // Remove ALL <header> elements (top app bars)
  content = content.replace(/<header[\s\S]*?<\/header>/gi, '');

  // Remove ALL <aside> elements (sidebars)
  content = content.replace(/<aside[\s\S]*?<\/aside>/gi, '');

  // Remove ALL <footer> elements
  content = content.replace(/<footer[\s\S]*?<\/footer>/gi, '');

  // Remove fixed floating action buttons
  content = content.replace(/<button[^>]*fixed[^>]*>[\s\S]*?<\/button>/gi, '');

  // Extract <main> content if it exists, otherwise use what's left
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    content = mainMatch[1];
  }

  return content;
}

function extractTailwindConfig(html) {
  // Extract custom tailwind config colors for inline style injection
  const configMatch = html.match(/<script[^>]*id="tailwind-config"[^>]*>([\s\S]*?)<\/script>/i);
  if (!configMatch) return null;
  try {
    const jsCode = configMatch[1];
    const colorsMatch = jsCode.match(/colors:\s*(\{[\s\S]*?\})\s*,?\s*fontFamily/);
    if (colorsMatch) return colorsMatch[1];
  } catch(e) {}
  return null;
}

function extractCustomCSS(html) {
  // Extract any <style> blocks from the HTML
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

  // Replace for= with htmlFor=
  content = content.replace(/\bfor=/g, 'htmlFor=');

  // Replace tabindex= with tabIndex=
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
      // CamelCase the key
      key = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      // Escape any single quotes in values by using template literals
      parts.push(`${key}: \`${val}\``);
    });
    return `style={{${parts.join(', ')}}}`;
  });

  // Fix self-closing void tags that have both /> and </tag>
  const voidTags = ['img', 'input', 'br', 'hr', 'source', 'track', 'embed', 'col', 'meta', 'link'];
  voidTags.forEach(tag => {
    // Fix <tag ... /> (already self-closed, good)
    // Fix <tag ...> (not self-closed, needs />)
    const regex = new RegExp(`<${tag}\\b([^>]*?)(?<!/)>(?!\\s*</${tag})`, 'gi');
    content = content.replace(regex, `<${tag}$1 />`);
  });

  // Fix SVG elements that were self-closed AND have closing tags: <line ... /></line>
  const svgSelfClosedTags = ['line', 'circle', 'rect', 'path', 'polygon', 'polyline', 'ellipse', 'use'];
  svgSelfClosedTags.forEach(tag => {
    // Pattern: <tag ... /></tag>  ->  <tag ... />
    const regex = new RegExp(`<${tag}([^>]*?)\\s*/></${tag}>`, 'gi');
    content = content.replace(regex, `<${tag}$1 />`);
  });

  // Fix SVG elements that have children (like <circle> with <animateMotion>)
  // These should NOT be self-closed
  svgSelfClosedTags.forEach(tag => {
    // If <tag ... /> is immediately followed by content before </tag>, fix it
    const regex = new RegExp(`<${tag}([^>]*?)\\s*/>\\s*(<[^/])`, 'gi');
    content = content.replace(regex, `<${tag}$1>$2`);
  });

  // Replace SVG attributes with camelCase
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

  // Replace HTML comments with JSX comments
  content = content.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

  // Escape literal curly braces inside text content (not in attributes or JSX expressions)
  // This is tricky - we need to find { and } that are inside text nodes
  // A simpler approach: find <pre> or <code> blocks with literal JSON and wrap in template literals
  content = content.replace(/<pre([^>]*)>([\s\S]*?)<\/pre>/g, (match, attrs, inner) => {
    // If inner contains literal { that isn't a JSX expression
    if (inner.includes('"auth"') || inner.includes('"theme"') || inner.match(/^\s*\{[^{]/)) {
      // Wrap the content in a template literal
      const escaped = inner.replace(/`/g, '\\`');
      return `<pre${attrs}>{\`${escaped}\`}</pre>`;
    }
    return match;
  });

  // Fix remaining literal { } in text content that JSX would interpret
  // Look for patterns like: >text { more text< 
  // But be careful not to break JSX expressions

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

const pageTitles = [
  "List of Projects",
  "What Is a Project?",
  "How to Create a Project",
  "Run and Test Modes",
  "General Settings",
  "Project Setup",
  "Design System",
  "State Management",
  "File Handling & Advanced"
];

async function run() {
  let allCSS = '';
  let finalContent = `import React from 'react';\n\n`;

  for (let i = 0; i < urls.length; i++) {
    console.log("Downloading", componentNames[i]);
    const html = await download(urls[i]);
    
    // Extract custom CSS
    const css = extractCustomCSS(html);
    if (css) allCSS += `\n/* === ${componentNames[i]} === */\n${css}\n`;

    console.log("Converting", componentNames[i]);
    
    // Extract ONLY the main content (strip nav, header, aside, footer)
    const mainContent = extractMainContent(html);
    const jsx = convertHtmlToJsx(mainContent);
    
    // Wrap in component with proper container styling
    finalContent += `export function ${componentNames[i]}() {
  return (
    <div className="stitch-page" style={{ position: 'relative', padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        ${jsx}
      </div>
    </div>
  );
}\n\n`;
  }

  fs.writeFileSync('./src/Module3Redesign.jsx', finalContent);
  console.log("Written components to src/Module3Redesign.jsx");

  // Write scoped CSS
  if (allCSS) {
    // Scope all CSS under .stitch-page
    const scopedCSS = `.stitch-page {
  color: #e5e2e1;
  font-family: 'Manrope', sans-serif;
}
.stitch-page * {
  box-sizing: border-box;
}
.stitch-page h1, .stitch-page h2, .stitch-page h3, .stitch-page h4 {
  font-family: 'Epilogue', sans-serif;
}
.stitch-page .font-headline { font-family: 'Epilogue', sans-serif; }
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
${allCSS}`;
    fs.writeFileSync('./src/Module3Stitch.css', scopedCSS);
    console.log("Written CSS to src/Module3Stitch.css");
  }
}

run().catch(console.error);
