import fs from 'fs';
import path from 'path';

const APP_JSX_PATH = './src/App.jsx';
const BUILD_CHAPTER4 = './src/Chapter4.jsx';
const BUILD_CHAPTER5 = './src/Chapter5.jsx';

function refactorAndSplit() {
  let content = fs.readFileSync(APP_JSX_PATH, 'utf-8');

  // STEP 1: Add responsiveness by replacing inline rigid grids
  console.log("Applying responsive classes to App.jsx...");
  // Convert standard inline grids to responsive grids
  const gridRegex1 = /style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'([^']+)',?\s*([^\}]+)?\s*\}\}/g;
  content = content.replace(gridRegex1, (match, gridVal, rest) => {
    // Only target those that need collapsing, skip auto-fit, auto-fill, icons etc
    if (gridVal.includes('auto-fit') || gridVal.includes('auto-fill') || gridVal.startsWith('42px ') || gridVal.startsWith('30px ') || gridVal.startsWith('82px ') || gridVal.startsWith('52px ')) {
      return match;
    }
    // Those like '1fr 1fr', 'repeat(12, 1fr)', '400px 1fr' need responsive class
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

  // Similarly for CapstoneModule and ChapterActivities
  const filesToRefactor = ['./src/CapstoneModule.jsx', './src/ChapterActivities.jsx'];
  for (const f of filesToRefactor) {
    if (fs.existsSync(f)) {
      let fileContent = fs.readFileSync(f, 'utf-8');
      fileContent = fileContent.replace(gridRegex1, (match, gridVal, rest) => {
        if (gridVal.includes('auto-fit') || gridVal.includes('auto-fill') || gridVal.startsWith('42px ') || gridVal.startsWith('46px ') || gridVal.startsWith('30px ') || gridVal.startsWith('36px ') || gridVal.startsWith('82px ') || gridVal.startsWith('52px ')) return match;
        return rest ? `className="responsive-grid" style={{ ${rest} }}` : `className="responsive-grid"`;
      });
      fileContent = fileContent.replace(gridRegex2, (match, gridVal, rest) => {
         if (gridVal.includes('auto-fit') || gridVal.includes('auto-fill') || gridVal.startsWith('42px ') || gridVal.startsWith('30px ') || gridVal.startsWith('82px ') || gridVal.startsWith('52px ')) return match;
         return rest ? `style={{ ${rest} }} className="responsive-grid"` : `className="responsive-grid"`;
      });
      fs.writeFileSync(f, fileContent, 'utf-8');
    }
  }


  // STEP 2: SPLIT APP.JSX TO RESOLVE BABEL WARNING
  console.log("Splitting Chapter4 and Chapter5 from App.jsx...");
  
  // Extract Chapter4 functions
  const chapter4Regex = /(function Chapter4_[1-4]\(\) \{(?:[^{}]*|\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\})*\n\})/g;
  let ch4Functions = [];
  let ch4Match;
  let newAppContent = content;

  // We have a problem: Regex cannot easily parse nested brackets safely for hundreds of lines.
  // Instead, let's use string splitting using 'function Chapter4_1() {' as anchors
  function extractChapterFunctions(startPrefix) {
    const lines = content.split('\n');
    let inChapter = false;
    let extractedLines = [];
    let remainingLines = [];
    let braceCount = 0;
    
    for (const line of lines) {
      if (!inChapter && line.startsWith(`function ${startPrefix}`)) {
        inChapter = true;
        braceCount = 0;
      }
      
      if (inChapter) {
        extractedLines.push(line);
        // rudimentary brace counting for identifying function end
        const openMatches = line.match(/\{/g);
        const closeMatches = line.match(/\}/g);
        if (openMatches) braceCount += openMatches.length;
        if (closeMatches) braceCount -= closeMatches.length;
        
        if (braceCount === 0 && extractedLines.length > 0) {
            inChapter = false; // end of function
        }
      } else {
        remainingLines.push(line);
      }
    }
    
    content = remainingLines.join('\n');
    return extractedLines.join('\n');
  }

  // Extract all Chapter 4 functions
  const ch4_1 = extractChapterFunctions('Chapter4_1() {');
  const ch4_2 = extractChapterFunctions('Chapter4_2() {');
  const ch4_3 = extractChapterFunctions('Chapter4_3() {');
  const ch4_4 = extractChapterFunctions('Chapter4_4() {');
  
  const ch5_1 = extractChapterFunctions('Chapter5_1() {');
  const ch5_2 = extractChapterFunctions('Chapter5_2() {');

  const imports = `import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'\nimport { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'\nimport { Canvas, useFrame } from '@react-three/fiber'\nimport * as THREE from 'three'\nimport { TerminalCard, SectionHeroBackdrop, CodeSnippet, MacWindowControls, ProcessPulse } from './ChapterActivities'\n// --- Shared Variants (copied for independence) ---\nconst stagger = { visible: { transition: { staggerChildren: 0.1 } } }\nconst fadeUp = { hidden: { opacity: 0, y: 40 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] } }) }\nfunction useReveal() { const ref = useRef(null); useEffect(() => { const el = ref.current; if (!el) return; const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add('vis') }, { threshold: 0.12 }); io.observe(el); return () => io.disconnect() }, []); return ref }\nconst MotionReveal = ({ children, className = '', delay = 0 }) => { const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: '-60px' }); return <motion.div ref={ref} className={className} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeUp} custom={delay}>{children}</motion.div> }\n`;

  if (ch4_1) {
    const file4 = imports + "\n" + ch4_1 + "\n\n" + ch4_2 + "\n\n" + ch4_3 + "\n\n" + ch4_4 + "\n\nexport { Chapter4_1, Chapter4_2, Chapter4_3, Chapter4_4 }\n";
    fs.writeFileSync(BUILD_CHAPTER4, file4, 'utf-8');
    content = "import { Chapter4_1, Chapter4_2, Chapter4_3, Chapter4_4 } from './Chapter4'\n" + content;
  }
  
  if (ch5_1) {
    const file5 = imports + "\n" + ch5_1 + "\n\n" + ch5_2 + "\n\nexport { Chapter5_1, Chapter5_2 }\n";
    fs.writeFileSync(BUILD_CHAPTER5, file5, 'utf-8');
    content = "import { Chapter5_1, Chapter5_2 } from './Chapter5'\n" + content;
  }

  // Write patched App.jsx
  fs.writeFileSync(APP_JSX_PATH, content, 'utf-8');
  console.log("Done! Split files authored. Responsive grids injected.");
}

refactorAndSplit();
