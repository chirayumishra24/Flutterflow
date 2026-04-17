import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TerminalCard, SectionHeroBackdrop, CodeSnippet, MacWindowControls, ProcessPulse } from './ChapterActivities'
// --- Shared Variants (copied for independence) ---
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] } }) }
function useReveal() { const ref = useRef(null); useEffect(() => { const el = ref.current; if (!el) return; const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add('vis') }, { threshold: 0.12 }); io.observe(el); return () => io.disconnect() }, []); return ref }
const MotionReveal = ({ children, className = '', delay = 0 }) => { const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: '-60px' }); return <motion.div ref={ref} className={className} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={fadeUp} custom={delay}>{children}</motion.div> }

function Chapter5_1() {
  return (
    <>
      <Module5_1Section />
      <ChapterActivities chapterId="5-1" />
      <FAQSection />
    </>
  )
}

function Chapter5_2() {
  return (
    <>
      <Module5_2Section />

      <ChapterActivities chapterId="5-2" />
      <FAQSection />
    </>
  )
}

export { Chapter5_1, Chapter5_2 }
