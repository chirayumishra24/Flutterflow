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

function Chapter4_1() {
  return (
    <>
      <Module4_1Section />
      <ChapterActivities chapterId="4-1" />
      <FAQSection />
    </>
  )
}

function Chapter4_2() {
  return (
    <>
      <Module4_2Section />
      <ChapterActivities chapterId="4-2" />
      <FAQSection />
    </>
  )
}

function Chapter4_3() {
  return (
    <>
      <Module4_3Section />
      <ChapterActivities chapterId="4-3" />
      <FAQSection />
    </>
  )
}

function Chapter4_4() {
  return (
    <>
      <Module4_4Section />
      <FAQSection />
    </>
  )
}

export { Chapter4_1, Chapter4_2, Chapter4_3, Chapter4_4 }
