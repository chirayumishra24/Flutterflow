import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import './App.css'
// Stitch import removed - using original themed components instead

/* ─── Framer Motion Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  })
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
}

/* ─── Three.js Particles ─── */
function ParticleField() {
  const meshRef = useRef()
  const count = 2000

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const colorPalette = [
      new THREE.Color('#00f5d4'),
      new THREE.Color('#7b2ff7'),
      new THREE.Color('#ff2d55'),
      new THREE.Color('#4361ee'),
      new THREE.Color('#ffd700'),
    ]
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15
      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.02
    meshRef.current.rotation.x = Math.sin(t * 0.01) * 0.1
    const posArr = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += Math.sin(t * 0.3 + i * 0.1) * 0.002
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function FloatingOrbs() {
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.5 + i * 2) * 0.5
      child.position.x = Math.cos(t * 0.3 + i * 1.5) * 0.3 + (i - 1) * 3
    })
  })

  return (
    <group ref={group}>
      {[0, 1, 2].map(i => (
        <mesh key={i} position={[(i - 1) * 3, 0, -3]}>
          <sphereGeometry args={[0.15 + i * 0.05, 16, 16]} />
          <meshBasicMaterial
            color={['#00f5d4', '#7b2ff7', '#ff2d55'][i]}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Scroll reveal (fallback) ─── */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('vis') },
      { threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
function Rv({ children, className = '' }) {
  const r = useReveal()
  return <div ref={r} className={`rv ${className}`}>{children}</div>
}

/* ─── Custom cursor with GSAP spring ─── */
function CursorDot() {
  const dotRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      gsap.to(dot, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.5,
        ease: 'power3.out'
      })
      dot.classList.add('visible')
    }
    const onOver = () => dot.classList.add('hovering')
    const onOut = () => dot.classList.remove('hovering')

    window.addEventListener('mousemove', move)
    const setup = () => {
      document.querySelectorAll('a, button, .bento-card, .chapter-card, .step-media').forEach(el => {
        el.addEventListener('mouseenter', onOver)
        el.addEventListener('mouseleave', onOut)
      })
    }
    setTimeout(setup, 500)

    return () => window.removeEventListener('mousemove', move)
  }, [])

  return <div ref={dotRef} className="cursor-dot" />
}

/* ─── Motion wrapper component ─── */
function MotionReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      custom={delay}
    >
      {children}
    </motion.div>
  )
}

function SectionHeroBackdrop({ height = 380, opacity = 1 }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: '0 0 auto 0',
        height,
        zIndex: 0,
        pointerEvents: 'none',
        opacity
      }}
    >
      <Canvas
        className="hero-canvas"
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <ParticleField />
        <FloatingOrbs />
      </Canvas>
    </div>
  )
}

/* ═══════ APP BUILDER (Chapter 2-2) ═══════ */
function AppBuilderSection() {
  return (
    <>
      <AppBuilderHeroSection />
      <NavigationMenuSection />
      <PropertiesPanelSection />
    </>
  )
}

function AppBuilderHeroSection() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true, margin: '-50px' })
  const [activeArea, setActiveArea] = useState(0)

  const coreAreas = [
    {
      title: 'Navigation Menu',
      desc: 'Switch between UI design, databases, APIs, settings, integrations, and more.',
      link: 'https://docs.flutterflow.io/flutterflow-ui/builder#navigation-menu',
      layout: 'wide'
    },
    {
      title: 'Toolbar',
      desc: 'Search resources, change canvas size, view history and branching, optimize, and run your app.',
      link: 'https://docs.flutterflow.io/flutterflow-ui/toolbar'
    },
    {
      title: 'Canvas',
      desc: 'Preview device screens and build pages by placing widgets on the canvas.',
      link: 'https://docs.flutterflow.io/flutterflow-ui/canvas'
    },
    {
      title: 'Properties Panel',
      desc: 'Control visuals and behavior with actions, backend queries, and animations.',
      link: 'https://docs.flutterflow.io/flutterflow-ui/builder#properties-panel',
      layout: 'wide'
    },
  ]

  const currentArea = coreAreas[activeArea]
  const currentTone = cardTone(activeArea)
  const nextArea = () => setActiveArea((prev) => (prev + 1) % coreAreas.length)
  const prevArea = () => setActiveArea((prev) => (prev - 1 + coreAreas.length) % coreAreas.length)

  return (
    <section className="sec" id="app-builder" style={{ paddingTop: '0', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
      <SectionHeroBackdrop height={420} opacity={0.7} />
      <div className="wrap hero-grid" ref={heroRef} style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', zIndex: 2 }}>
        <motion.div
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={stagger}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <motion.div variants={fadeUp} custom={1}>
            <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem', color: '#7b2ff7', border: '1px solid rgba(123, 47, 247, 0.3)', background: 'rgba(123, 47, 247, 0.1)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M12 3v18"/><path d="M6 9h12"/><path d="M6 15h12"/></svg> Module 2 — Chapter 2
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} custom={2}
            style={{
              fontSize: 'clamp(2.8rem, 5vw, 4rem)', fontWeight: 800,
              lineHeight: 1.1, marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #7b2ff7, #00f5d4, #4361ee)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            App Builder
          </motion.h1>

          <motion.p
            variants={fadeUp} custom={3}
            style={{
              fontSize: '1.1rem', color: '#c8c8e0', lineHeight: 1.8,
              maxWidth: '620px', marginBottom: '2rem'
            }}
          >
            On opening the project, you'll see the App Builder, which consists of four main sections: <a href="https://docs.flutterflow.io/flutterflow-ui/builder#navigation-menu" className="text-link" target="_blank" rel="noopener noreferrer">Navigation Menu</a>, <a href="https://docs.flutterflow.io/flutterflow-ui/toolbar" className="text-link" target="_blank" rel="noopener noreferrer">Toolbar</a>, <a href="https://docs.flutterflow.io/flutterflow-ui/canvas" className="text-link" target="_blank" rel="noopener noreferrer">Canvas</a>, and <a href="https://docs.flutterflow.io/flutterflow-ui/builder#properties-panel" className="text-link" target="_blank" rel="noopener noreferrer">Properties Panel</a>.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={heroInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
        >
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '120%', height: '120%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,47,247,0.15) 0%, rgba(0,245,212,0.12) 40%, transparent 70%)',
            pointerEvents: 'none', filter: 'blur(60px)', zIndex: 0
          }} />

          <div style={{
            width: '100%',
            borderRadius: '20px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative', zIndex: 2
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161334-3.png" alt="FlutterFlow App Builder interface" style={{ width: '100%', display: 'block' }} />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', top: '-10%', right: '-5%',
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px',
              padding: '1rem', color: '#7b2ff7', zIndex: 3, fontWeight: 600, fontSize: '0.85rem'
            }}
          >
            Build Faster
          </motion.div>
        </motion.div>
      </div>

      <div className="wrap">
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700,
            textAlign: 'center', marginBottom: '0.75rem',
            background: 'linear-gradient(135deg, #7b2ff7, #00f5d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            App Builder Sections
          </h2>
          <p style={{ textAlign: 'center', color: '#b0b0cc', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
            Each area is purpose-built so you can design, configure, and ship in one workspace.
          </p>
        </MotionReveal>

        <div className="chapter-22-slider" style={{
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)',
          gap: '1rem',
          alignItems: 'stretch'
        }}>
          <div className="chapter-22-slider-nav" style={{
            display: 'grid',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: '24px',
            background: 'rgba(8,10,24,0.72)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)'
          }}>
            {coreAreas.map((area, i) => {
              const isActive = i === activeArea
              const tone = cardTone(i)
              return (
                <motion.button
                  key={area.title}
                  onClick={() => setActiveArea(i)}
                  whileHover={{ x: 6 }}
                  style={{
                    textAlign: 'left',
                    padding: '1rem 1.1rem',
                    borderRadius: '16px',
                    border: isActive ? tone.border : '1px solid rgba(255,255,255,0.08)',
                    background: isActive ? tone.bg : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: tone.accent,
                    fontWeight: 700,
                    marginBottom: '0.35rem'
                  }}>
                    Section {i + 1}
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{area.title}</div>
                  <div style={{ color: '#bfc7dc', fontSize: '0.92rem', lineHeight: 1.55 }}>
                    {area.desc}
                  </div>
                </motion.button>
              )
            })}
          </div>

          <div className="chapter-22-slider-stage" style={{
            borderRadius: '28px',
            overflow: 'hidden',
            border: currentTone.border,
            background: currentTone.bg,
            position: 'relative',
            minHeight: '320px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: currentTone.glow, opacity: 0.95, pointerEvents: 'none' }} />
            
            <div style={{ flex: 1, position: 'relative', padding: '1.75rem', paddingBottom: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentArea.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'relative', zIndex: 1 }}
                >
                  <div style={{
                    width: '54px', height: '54px', borderRadius: '16px',
                    background: 'rgba(0,0,0,0.32)', border: currentTone.border, display: 'grid', placeItems: 'center',
                    color: currentTone.accent, fontWeight: 800, marginBottom: '1rem'
                  }}>
                    {activeArea + 1}
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.7rem' }}>{currentArea.title}</h3>
                  <p style={{ color: '#d4dbed', fontSize: '1rem', lineHeight: 1.75, maxWidth: '720px', minHeight: '80px' }}>
                    {currentArea.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Fixed Controls Area at the bottom */}
            <div style={{ 
              padding: '1.75rem', 
              position: 'relative', zIndex: 2,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '1rem'
            }}>
              <a href={currentArea.link} className="text-link" target="_blank" rel="noopener noreferrer">
                Explore {currentArea.title} →
              </a>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  onClick={prevArea}
                  className="btn-ghost"
                  style={{ padding: '0.6rem 1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  ← Prev
                </button>
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  {coreAreas.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveArea(i)}
                      style={{
                        width: i === activeArea ? '28px' : '10px', height: '10px', borderRadius: '999px', border: 'none',
                        background: i === activeArea ? currentTone.accent : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s ease'
                      }}
                      aria-label={`Go to App Builder section ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextArea}
                  className="btn-ghost"
                  style={{ padding: '0.6rem 1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function NavigationMenuSection() {
  const navItems = [
    { title: 'Dashboard', desc: 'Manage projects, access account info, and FlutterFlow resources.' },
    { title: 'Widget Palette', desc: 'Access all widgets for your app.' },
    { title: 'Page Selector', desc: 'Manage pages and components, create folders as needed.' },
    { title: 'Widget Tree', desc: 'Get an overview of all widgets on a selected page.' },
    { title: 'Storyboard', desc: "Visualize your app's design and navigation." },
    { title: 'Firestore', desc: 'Create collections and adjust Firestore-related settings.' },
    { title: 'Data Types', desc: 'Create custom data types for your app.' },
    { title: 'App Values', desc: <>Manage <a href="https://docs.flutterflow.io/resources/data-representation/app-state" className="text-link" target="_blank" rel="noopener noreferrer">App State variables</a> and Constants.</> },
    { title: 'API Calls', desc: 'Define API calls.' },
    { title: 'Media Assets', desc: 'Upload assets for your app and team.' },
    { title: 'Custom Functions', desc: 'Add custom functionalities, widgets, and actions.' },
    { title: 'Cloud Functions', desc: 'Write and deploy cloud functions for Firebase.' },
    { title: 'Tests', desc: 'Add automated tests.' },
    { title: 'Agents', desc: <>Create, configure, and manage <a href="https://docs.flutterflow.io/integrations/ai-agents" className="text-link" target="_blank" rel="noopener noreferrer">AI Agents</a> to integrate conversational AI interactions into your app.</> },
    { title: 'Theme Settings', desc: 'Customize visual appearance.' },
    { title: 'Settings & Integrations', desc: 'Access app-related settings and integrations.' },
  ]

  return (
    <section className="sec" id="navigation-menu" style={{ paddingTop: '40px', paddingBottom: '20px', position: 'relative', overflow: 'hidden' }}>
      <SectionHeroBackdrop height={260} opacity={0.45} />
      <div className="wrap">
        <MotionReveal>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700,
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, #00f5d4, #7b2ff7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Navigation Menu
            </h2>
            <a href="https://www.youtube.com/watch?v=moP9VtkoyjY&list=PLsUp7t2vRqx-xMe6gucpfjeDgIj0tJRIm" className="text-link" target="_blank" rel="noopener noreferrer">
              Intro to Design Systems | FlutterFlow University
            </a>
          </div>
          <p style={{ color: '#c8c8e0', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '900px' }}>
            The Navigation Menu, located on the left side of the builder, lets you move between UI design, database, API setup, app settings, integrations, and more.
          </p>
          <p style={{ color: '#b0b0cc', fontSize: '0.98rem', marginTop: '0.5rem' }}>
            Here is a list of all the features accessible from the Navigation Menu.
          </p>
        </MotionReveal>

        <div className="h-scroll-rail" style={{ marginTop: '2rem' }}>
          {navItems.map((item, i) => {
            const hue = (i * 22 + 160) % 360
            const accent = `hsl(${hue}, 75%, 55%)`
            return (
              <TiltCard
                key={item.title}
                accent={accent}
                className="gsap-child"
                style={{
                  width: '280px',
                  minHeight: '190px',
                  scrollSnapAlign: 'start',
                }}
              >
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: `hsla(${hue}, 75%, 55%, 0.15)`,
                  border: `1px solid hsla(${hue}, 75%, 55%, 0.3)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: accent, fontWeight: 800, marginBottom: '0.85rem', fontSize: '0.95rem'
                }}>{i + 1}</div>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: '#c8c8e0', fontSize: '0.93rem', lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </TiltCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function WidgetPaletteSection() {
  const paletteItems = [
    { title: 'Widgets', desc: 'Access standard FlutterFlow widgets organized by category for easy discovery.' },
    { title: 'Components', desc: <>Reusable widgets built from standard or custom widgets. Once you create a <a href="https://docs.flutterflow.io/resources/ui/components/creating-components" className="text-link" target="_blank" rel="noopener noreferrer">component</a> or <a href="https://docs.flutterflow.io/concepts/custom-code/custom-widgets" className="text-link" target="_blank" rel="noopener noreferrer">custom widget</a>, you can access it here.</> },
    { title: 'Templates', desc: 'Predefined, ready-to-use widgets that help you move faster and stay consistent.' },
    { title: 'Theme Widgets', desc: <>Build theme-based widgets to reuse consistent styling. Learn more about <a href="https://docs.flutterflow.io/concepts/design-system#theme-widgets" className="text-link" target="_blank" rel="noopener noreferrer">theme widgets</a>.</> },
    { title: 'Floating Widget Palette', desc: 'Quick access to widgets directly from the canvas without opening the menu.' },
  ]

  return (
    <section className="sec" id="widget-palette" style={{ paddingTop: '0', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
      <SectionHeroBackdrop height={420} opacity={0.62} />
      <div className="wrap hero-grid" style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', zIndex: 2 }}>
        <MotionReveal>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem', color: '#ff2d55', border: '1px solid rgba(255, 45, 85, 0.3)', background: 'rgba(255, 45, 85, 0.12)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> Module 2 — Chapter 6
            </span>
            <h1 style={{
              fontSize: 'clamp(2.6rem, 5vw, 3.6rem)', fontWeight: 800,
              lineHeight: 1.1, marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ff2d55, #f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Widget Palette
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#c8c8e0', lineHeight: 1.8, maxWidth: '620px' }}>
              The Widget Palette provides access to all UI elements in FlutterFlow. These widgets can be dragged and dropped onto the canvas, and the search bar helps you find any widget quickly.
            </p>
            <a href="https://www.youtube.com/watch?v=2TGhJEUA0uY&list=PLsUp7t2vRqx-xMe6gucpfjeDgIj0tJRIm&index=15&pp=iAQB0gcJCcUKAYcqIYzv" className="text-link" target="_blank" rel="noopener noreferrer">
              Intro to Widgets | FlutterFlow University
            </a>
          </div>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            position: 'relative', width: '100%',
            borderRadius: '20px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161648-17.png" alt="Widget Palette" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>
      </div>

      <div className="wrap">

        <div className="h-scroll-rail" style={{ marginTop: '2rem' }}>
          {paletteItems.map((item, i) => (
            <TerminalCard
              key={item.title}
              title={`widget-palette/${item.title.toLowerCase().replace(/\s/g, '-')}`}
              className="gsap-child"
              style={{ width: '300px', minHeight: '180px', scrollSnapAlign: 'start' }}
            >
              <div className="terminal-line">
                <span className="terminal-prompt">❯</span>
                <span style={{ color: '#00f5d4', fontWeight: 700 }}>{item.title}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', color: '#c8c8e0', fontSize: '0.93rem', lineHeight: 1.65, marginTop: '0.5rem' }}>
                {item.desc}
              </div>
            </TerminalCard>
          ))}
        </div>

        <MotionReveal>
          <div style={{
            marginTop: '2rem', borderRadius: '20px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.35)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161648-18.jpeg" alt="Floating Widget Palette" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}

function StoryboardSection() {
  const legendItems = [
    { title: 'Solid Line', desc: <>Used to represent the <a href="https://docs.flutterflow.io/concepts/navigation/page-navigation#navigate-to-action" className="text-link" target="_blank" rel="noopener noreferrer">Navigate</a> or Login action.</> },
    { title: 'Dotted Line', desc: 'Used to represent the Bottom Sheet action.' },
    { title: 'Right Arrow Icon', desc: 'Represents hidden widgets that still have a navigation action to reveal them.' },
  ]

  return (
    <section className="sec" id="storyboard" style={{ paddingTop: '0', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
      <SectionHeroBackdrop height={420} opacity={0.62} />
      <div className="wrap hero-grid" style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', zIndex: 2 }}>
        <MotionReveal>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem', color: '#4361ee', border: '1px solid rgba(67, 97, 238, 0.3)', background: 'rgba(67, 97, 238, 0.12)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg> Module 2 — Chapter 5
            </span>
            <h1 style={{
              fontSize: 'clamp(2.6rem, 5vw, 3.6rem)', fontWeight: 800,
              lineHeight: 1.1, marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #4361ee, #00f5d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Storyboard
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#c8c8e0', lineHeight: 1.8, maxWidth: '620px' }}>
              The Storyboard view lets you visualize the overall design and navigation of your app. You can see different screens and user interactions to ensure the user experience is intuitive and user-friendly.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            position: 'relative', width: '100%',
            borderRadius: '20px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161619-14.png" alt="Storyboard overview" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>
      </div>

      <div className="wrap">
        <MotionReveal>
          <div style={{
            marginTop: '1rem', padding: '1rem 1.25rem',
            background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '14px', color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6
          }}>
            <strong style={{ color: '#ffd700' }}>Info:</strong> This feature is currently in Beta. It is optimized for projects with 30 pages or less.
          </div>
        </MotionReveal>

        <MotionReveal>
          <h3 style={{ marginTop: '2.5rem', color: '#fff', fontSize: '1.5rem' }}>Storyboard Legend</h3>
          <p style={{ color: '#b0b0cc', fontSize: '1rem', lineHeight: 1.7, maxWidth: '860px' }}>
            A legend is a visual key that explains the meaning of the different lines, icons, and colors used inside the canvas.
          </p>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            marginTop: '1rem', borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161619-15.png" alt="Storyboard legend" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>

        <div className="chapter-grid" style={{ marginTop: '1.5rem' }}>
          {legendItems.map((item, i) => {
            const frontColors = ['#4361ee', '#00f5d4', '#ff2d55']
            const color = frontColors[i % 3]
            return (
              <FlipCard
                key={item.title}
                style={{ minHeight: '200px' }}
                frontStyle={{
                  background: `linear-gradient(145deg, ${color}18, rgba(8,10,28,0.95))`,
                  border: `1px solid ${color}50`,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                }}
                backStyle={{
                  background: `linear-gradient(145deg, rgba(8,10,28,0.95), ${color}18)`,
                  border: `1px solid ${color}50`,
                }}
                front={
                  <>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: `${color}20`, border: `2px solid ${color}60`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: color, fontWeight: 800, fontSize: '1.2rem', marginBottom: '1rem'
                    }}>{i + 1}</div>
                    <h4 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.5rem' }}>{item.title}</h4>
                    <p style={{ color: '#b0b0cc', fontSize: '0.85rem' }}>Click to reveal →</p>
                  </>
                }
                back={
                  <div style={{ padding: '0.5rem' }}>
                    <h4 style={{ color: color, marginBottom: '0.75rem', fontSize: '1.1rem' }}>{item.title}</h4>
                    <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.65 }}>{item.desc}</p>
                  </div>
                }
              />
            )
          })}
        </div>

        <MotionReveal>
          <h3 style={{ marginTop: '2.5rem', color: '#fff', fontSize: '1.5rem' }}>Highlight Routes on a Page</h3>
          <p style={{ color: '#b0b0cc', fontSize: '1rem', lineHeight: 1.7, maxWidth: '860px' }}>
            Click on a page to highlight pathways leading into and out of it. This helps you identify route paths when lines overlap.
          </p>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            marginTop: '1rem', borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161619-16.png" alt="Highlighted routes" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>

        <div className="chapter-grid" style={{ marginTop: '1.5rem' }}>
          {[
            { title: 'Move Pages', desc: 'Select a page and drag it to rearrange the layout and group related features.' },
            { title: 'Open a Page', desc: 'Double-click any page to open it directly from the Storyboard.' },
          ].map((item, i) => {
            const colors = ['#4361ee', '#00f5d4']
            const color = colors[i]
            return (
              <TiltCard
                key={item.title}
                accent={color}
                style={{ minHeight: '140px' }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: `${color}18`, border: `1.5px solid ${color}50`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: color, fontWeight: 800, marginBottom: '0.75rem', fontSize: '0.95rem'
                }}>{i + 1}</div>
                <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>{item.title}</h4>
                <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.65 }}>{item.desc}</p>
              </TiltCard>
            )
          })}
        </div>

        <MotionReveal>
          <div style={{
            marginTop: '2rem', padding: '1.25rem 1.5rem',
            background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.3)',
            borderRadius: '14px', color: '#c8c8e0'
          }}>
            <strong style={{ color: '#00f5d4' }}>Video guide:</strong> <a href="https://youtu.be/ukBii81pwm4" className="text-link" target="_blank" rel="noopener noreferrer">Navigating Pages &amp; Storyboard | FlutterFlow University</a>
          </div>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            marginTop: '2rem', padding: '1.25rem 1.5rem',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px', color: '#c8c8e0'
          }}>
            <strong style={{ color: '#fff' }}>FAQ:</strong> "Error: Unable to initialize Storyboard" usually appears when the initial page is not set. Set the initial page in <a href="https://docs.flutterflow.io/resources/projects/settings/general-settings#app-details" className="text-link" target="_blank" rel="noopener noreferrer">App Details</a> to resolve it.
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}

function ToolbarSection() {
  const toolbarItems = [
    {
      id: 'project-info',
      title: 'Project Info',
      short: 'PI',
      desc: (
        <p style={{ margin: 0 }}>
          Hovering over this section reveals the essential information about your project. You can check the project name, branch name, environment name, the current FlutterFlow version and release date, and the Flutter version your project is running on.
        </p>
      ),
    },
    {
      id: 'help-menu',
      title: 'Help Menu',
      short: 'HM',
      layout: 'wide',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            From here, you will get access to essential resource links that will come in handy while building your apps.
          </p>
          <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: '#c8c8e0' }}>
            <li style={{ marginBottom: '0.5rem' }}>Search Docs: If you are a paid user, you can conduct a direct search from the documentation.</li>
            <li style={{ marginBottom: '0.5rem' }}>Community Forum: Join the <a href="https://community.flutterflow.io/" className="text-link" target="_blank" rel="noopener noreferrer">community</a> of FlutterFlow users.</li>
            <li style={{ marginBottom: '0.5rem' }}>Feedback: Provide feedback and help improve the product.</li>
            <li style={{ marginBottom: '0.5rem' }}>Bug Report: Submit a bug report from here.</li>
            <li style={{ marginBottom: '0.5rem' }}>Tutorials: Start the tutorial for building your first app inside FlutterFlow.</li>
            <li style={{ marginBottom: '0.5rem' }}>FAQs and Docs: Opens the official FlutterFlow documentation.</li>
            <li style={{ marginBottom: '0.5rem' }}>What's New?: See the latest features and changes.</li>
            <li style={{ marginBottom: '0.5rem' }}>Current Status/Known Issues: View platform status and known issues.</li>
            <li>Show/Hide Chat: Toggle the chat button at the bottom right of the builder.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Keyboard Shortcuts',
      short: 'KS',
      layout: 'wide',
      desc: (
        <p style={{ margin: 0 }}>
          Use keyboard shortcuts to perform common actions and run your project in Test or Run mode with just a few keystrokes. Select this option to see all the shortcuts.
        </p>
      ),
      image: 'https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161520-5.png'
    },
    {
      id: 'command-palette',
      title: 'Command Palette',
      short: 'CP',
      layout: 'wide',
      desc: (
        <p style={{ margin: 0 }}>
          The Command Palette helps you find and use things in the App Builder. Open it by clicking the search button or pressing <code>Cmd/Ctrl + K</code>. Search for anything, click the right arrow to see where it's used, or click an item to jump directly to it.
        </p>
      ),
      image: 'https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161520-6.png'
    },
    {
      id: 'ai-history',
      title: 'AI Generation History',
      short: 'AI',
      desc: (
        <p style={{ margin: 0 }}>
          Track the status of AI-generated items. This panel lists previously generated pages and components, and lets you preview them quickly.
        </p>
      ),
    },
    {
      id: 'project-comments',
      title: 'Project Comments',
      short: 'PC',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            Leave thoughts, opinions, questions, or feedback on a specific widget with your team or a client. Tag users to start threaded conversations.
          </p>
          <div style={{
            marginTop: '1rem', padding: '0.9rem 1.1rem',
            background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.3)',
            borderRadius: '12px', color: '#c8c8e0', fontSize: '0.95rem'
          }}>
            <strong style={{ color: '#00f5d4' }}>Info:</strong> To tag users, select the @ symbol and choose the project team member(s).
          </div>
        </>
      ),
    },
    {
      id: 'project-suggestions',
      title: 'Project Suggestions',
      short: 'PS',
      layout: 'wide',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            We scan and suggest enhancements to elevate your app's design and speed. Think of it as a design and performance consultant.
          </p>
          <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: '#c8c8e0' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Optimizations:</strong> Spot elements that may slow down your app, such as unbounded widgets or duplicate backend queries.</li>
            <li><strong>UI Enhancements:</strong> Suggestions for a more visually appealing and user-friendly design.</li>
          </ul>
          <div style={{
            marginTop: '1rem', padding: '0.9rem 1.1rem',
            background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '12px', color: '#c8c8e0', fontSize: '0.95rem'
          }}>
            <strong style={{ color: '#ffd700' }}>Info:</strong> Control what kind of suggestions you receive by clicking the settings icon on the right.
          </div>
        </>
      ),
      image: 'https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161520-7.png'
    },
    {
      id: 'project-issues',
      title: 'Project Issues',
      short: 'IS',
      layout: 'wide',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            If issues or warnings might cause a build failure or crash, they will appear here. Click an issue to see details and jump to the fix.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            <strong>Errors</strong> prevent your app from compiling and running. These must be resolved.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <strong>Warnings</strong> indicate potential problems such as performance issues. Addressing them improves quality.
          </p>
        </>
      ),
      image: 'https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161520-8.png'
    },
    {
      id: 'version-control',
      title: 'Version Control',
      short: 'VC',
      desc: (
        <p style={{ margin: 0 }}>
          Track changes to your project and revert to previous states when needed. FlutterFlow uses <a href="https://docs.flutterflow.io/collaboration/branching" className="text-link" target="_blank" rel="noopener noreferrer">Branching</a> to create separate copies for testing features without affecting the main version.
        </p>
      ),
    },
    {
      id: 'developer-menu',
      title: 'Developer Menu',
      short: 'DM',
      layout: 'wide',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            Access developer tools such as code viewing, GitHub integration, and source code downloads.
          </p>
          <ul style={{ marginTop: '0.75rem', paddingLeft: '1.2rem', color: '#c8c8e0' }}>
            <li style={{ marginBottom: '0.5rem' }}>View Code: Display Dart code for all pages and view dependencies.</li>
            <li style={{ marginBottom: '0.5rem' }}>Connect GitHub Repo: Connect and upload your project to <a href="https://github.com/" className="text-link" target="_blank" rel="noopener noreferrer">GitHub</a>. See the guide <a href="https://docs.flutterflow.io/exporting/push-to-github#connect-a-github-repo" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</li>
            <li style={{ marginBottom: '0.5rem' }}>Download Code: Download the entire codebase generated by FlutterFlow.</li>
            <li style={{ marginBottom: '0.5rem' }}>Download APK: Generate a release build for Android.</li>
            <li style={{ marginBottom: '0.5rem' }}>FlutterFlow CLI: Download code using <a href="https://pub.dev/packages/flutterflow_cli" className="text-link" target="_blank" rel="noopener noreferrer">FlutterFlow CLI</a>. Instructions <a href="https://docs.flutterflow.io/exporting/ff-cli" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</li>
            <li style={{ marginBottom: '0.5rem' }}>Open in VSCode: Open your project in VS Code for richer tooling and AI support.</li>
            <li>Refactor Project: Use the YAML editor for bulk edits. Learn more <a href="https://docs.flutterflow.io/resources/projects/refactor-project" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</li>
          </ul>
          <div style={{
            marginTop: '1rem', padding: '0.9rem 1.1rem',
            background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '12px', color: '#c8c8e0', fontSize: '0.95rem'
          }}>
            <strong style={{ color: '#ffd700' }}>Note:</strong> Connect GitHub Repo, Download Code, and Download APK require a <a href="https://flutterflow.io/pricing" className="text-link" target="_blank" rel="noopener noreferrer">paid plan</a>.
          </div>
        </>
      ),
    },
    {
      id: 'share-project',
      title: 'Share Project',
      short: 'SP',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            Make a project public so others can view and clone it. Remove sensitive information before sharing.
          </p>
          <div style={{
            marginTop: '0.9rem', padding: '0.9rem 1.1rem',
            background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px', color: '#c8c8e0', fontSize: '0.95rem'
          }}>
            <div style={{ marginBottom: '0.35rem' }}>• You can only share projects where you are the owner.</div>
            <div>• The share feature can be used to create Marketplace items. Learn more <a href="https://docs.flutterflow.io/marketplace" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</div>
          </div>
        </>
      ),
    },
    {
      id: 'preview-app',
      title: 'Preview App',
      short: 'PV',
      desc: (
        <p style={{ margin: 0 }}>
          Run your app in <a href="https://docs.flutterflow.io/testing/run-your-app#preview-mode" className="text-link" target="_blank" rel="noopener noreferrer">Preview mode</a>.
        </p>
      ),
    },
    {
      id: 'test-mode',
      title: 'Test Mode',
      short: 'TM',
      desc: (
        <p style={{ margin: 0 }}>
          Run your app in <a href="https://docs.flutterflow.io/testing/run-your-app#test-mode" className="text-link" target="_blank" rel="noopener noreferrer">Test</a> or <a href="https://docs.flutterflow.io/testing/run-your-app#run-mode" className="text-link" target="_blank" rel="noopener noreferrer">Run</a> mode.
        </p>
      ),
    },
  ]

  return (
    <section className="sec" id="toolbar" style={{ paddingTop: '0', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
      <SectionHeroBackdrop height={420} opacity={0.62} />
      <div className="wrap hero-grid" style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', zIndex: 2 }}>
        <MotionReveal>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem', color: '#ff2d55', border: '1px solid rgba(255, 45, 85, 0.3)', background: 'rgba(255, 45, 85, 0.12)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M3 4h18"/><path d="M3 10h18"/><path d="M3 16h18"/><path d="M3 22h18"/></svg> Module 2 — Chapter 3
            </span>
            <h1 style={{
              fontSize: 'clamp(2.6rem, 5vw, 3.6rem)', fontWeight: 800,
              lineHeight: 1.1, marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #ff2d55, #7b2ff7, #f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Toolbar
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#c8c8e0', lineHeight: 1.8, maxWidth: '620px' }}>
              The Toolbar, located at the top of the app builder, provides easy access to numerous tools and features. It includes options for project configuration, saving versions, help, debugging, comments, code download, and running your app.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            position: 'relative', width: '100%',
            borderRadius: '20px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161520-4.png" alt="Toolbar" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>
      </div>

      <div className="wrap">
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700,
            textAlign: 'center', marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ff2d55, #7b2ff7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Toolbar Features
          </h2>
          <p style={{ textAlign: 'center', color: '#b0b0cc', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
            Each card highlights a capability available in the toolbar.
          </p>
        </MotionReveal>

        <div className="chapter-masonry">
          {toolbarItems.map((item, i) => {
            const hue = (i * 30 + 200) % 360
            const accent = `hsl(${hue}, 80%, 60%)`
            return (
              <NeonCard
                key={item.id}
                className="chapter-card gsap-child"
                style={{ minHeight: '220px' }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: `hsla(${hue}, 80%, 60%, 0.12)`,
                  border: `1px solid hsla(${hue}, 80%, 60%, 0.3)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: accent, fontWeight: 800, marginBottom: '1rem', fontSize: '0.9rem'
                }}>{item.short || i + 1}</div>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                <div style={{ color: '#c8c8e0', fontSize: '0.98rem', lineHeight: 1.7 }}>
                  {item.desc}
                </div>
                {item.image && (
                  <div style={{
                    marginTop: '1rem', borderRadius: '14px', overflow: 'hidden',
                    border: `1px solid ${accent}40`,
                    boxShadow: `0 8px 24px ${accent}15`
                  }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
              </NeonCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CanvasSection() {
  const canvasItems = [
    {
      id: 'preview-screen',
      title: 'Preview Screen',
      short: 'PS',
      desc: (
        <p style={{ margin: 0 }}>
          This is the canvas of the device screen where you build the user interface. Add widgets by dragging from the <a href="https://docs.flutterflow.io/flutterflow-ui/widget-palette" className="text-link" target="_blank" rel="noopener noreferrer">Widget Palette</a> and apply properties from the <a href="https://docs.flutterflow.io/flutterflow-ui/builder#properties-panel" className="text-link" target="_blank" rel="noopener noreferrer">Properties Panel</a>.
        </p>
      ),
    },
    {
      id: 'nav-menu-toggle',
      title: 'Show or Hide Navigation Menu',
      short: 'NM',
      desc: (
        <p style={{ margin: 0 }}>
          Open or close the <a href="https://docs.flutterflow.io/flutterflow-ui/builder#navigation-menu" className="text-link" target="_blank" rel="noopener noreferrer">Navigation Menu</a> from here.
        </p>
      ),
    },
    {
      id: 'zoom-controls',
      title: 'Zoom Controls',
      short: 'Z+',
      desc: (
        <p style={{ margin: 0 }}>
          Zoom in (+) or out (-) to inspect complex layouts. This makes it easier to focus on details and then zoom back out for an overview.
        </p>
      ),
    },
    {
      id: 'ai-page',
      title: 'AI Generated Page',
      short: 'AI',
      desc: (
        <p style={{ margin: 0 }}>
          Create a page using AI. Learn more <a href="https://docs.flutterflow.io/resources/ui/pages#create-an-ai-generated-page" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.
        </p>
      ),
    },
    {
      id: 'add-app-bar',
      title: 'Add App Bar',
      short: 'AB',
      layout: 'wide',
      desc: (
        <p style={{ margin: 0 }}>
          Add an <a href="https://docs.flutterflow.io/resources/ui/pages/scaffold#appbar" className="text-link" target="_blank" rel="noopener noreferrer">App Bar</a> to your page. Select a style from the popup to insert it into the preview screen.
        </p>
      ),
      image: 'https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161546-10.png'
    },
    {
      id: 'multi-language',
      title: 'Multi-Language Preview',
      short: 'ML',
      layout: 'wide',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            If multi-language is enabled, preview the app in different languages by selecting a language from the dropdown.
          </p>
          <div style={{
            marginTop: '0.9rem', padding: '0.9rem 1.1rem',
            background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.3)',
            borderRadius: '12px', color: '#c8c8e0', fontSize: '0.95rem'
          }}>
            <strong style={{ color: '#00f5d4' }}>Tip:</strong> This is valuable for testing across locales without running your app.
          </div>
          <div style={{ marginTop: '0.6rem' }}>
            <a href="https://demo.arcade.software/E6otMpbcKewMYCfkjl9d?embed&show_copy_link=true" className="text-link" target="_blank" rel="noopener noreferrer">Interactive demo</a>
          </div>
        </>
      ),
    },
    {
      id: 'dark-light',
      title: 'Dark/Light Mode',
      short: 'DL',
      desc: (
        <p style={{ margin: 0 }}>
          Toggle between light and dark mode to ensure your design looks great in both. This feature is available when dark mode support is enabled in your project.
        </p>
      ),
    },
    {
      id: 'display-device',
      title: 'Display Device',
      short: 'DD',
      desc: (
        <p style={{ margin: 0 }}>
          Show a device frame in the preview to check safe areas, notches, and platform-specific UI constraints.
        </p>
      ),
    },
    {
      id: 'handle-bars',
      title: 'Handle Bars',
      short: 'HB',
      layout: 'wide',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            Enable resize handle bars to change the preview screen size and test custom resolutions and responsiveness.
          </p>
          <div style={{ marginTop: '0.6rem' }}>
            <a href="https://www.youtube.com/watch?v=kWvWa5PSWhw&list=PLsUp7t2vRqx-xMe6gucpfjeDgIj0tJRIm&index=3" className="text-link" target="_blank" rel="noopener noreferrer">Figma Import | FlutterFlow University</a>
          </div>
        </>
      ),
      image: 'https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161546-11.jpeg'
    },
    {
      id: 'show-keyboard',
      title: 'Show or Hide Keyboard',
      short: 'KB',
      desc: (
        <p style={{ margin: 0 }}>
          Display a virtual keyboard on the preview screen to visualize UI with the keyboard visible.
        </p>
      ),
    },
    {
      id: 'larger-font',
      title: 'Larger Font Visualization',
      short: 'LF',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            Simulate how the app appears when users increase text scale for accessibility. This is important for inclusive design.
          </p>
          <div style={{ marginTop: '0.6rem' }}>
            <a href="https://www.youtube.com/watch?v=NsR7f1OZeSY&list=PLsUp7t2vRqx-xMe6gucpfjeDgIj0tJRIm&index=5" className="text-link" target="_blank" rel="noopener noreferrer">Typography | FlutterFlow University</a>
          </div>
        </>
      ),
    },
    {
      id: 'canvas-settings',
      title: 'Canvas Settings',
      short: 'CS',
      layout: 'wide',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            Use canvas settings to control safe area behavior, snapping, and background visibility.
          </p>
          <div style={{ marginTop: '0.75rem', color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.7 }}>
            <div style={{ marginBottom: '0.5rem' }}><strong>Safe Area:</strong> Prevent content from being obscured by device notches or rounded edges.</div>
            <div style={{ marginBottom: '0.5rem' }}><strong>Resize Snapping:</strong> Snap widget sizes to pixel values or screen percentages. <a href="https://demo.arcade.software/1IOtwXpNus8W4dLgdHsm?embed&show_copy_link=true" className="text-link" target="_blank" rel="noopener noreferrer">Interactive demo</a></div>
            <div><strong>Change Canvas Color:</strong> Improve contrast when designing components against different backgrounds.</div>
          </div>
        </>
      ),
      image: 'https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161546-12.png'
    },
    {
      id: 'add-nav-bar',
      title: 'Add Nav Bar',
      short: 'NB',
      layout: 'wide',
      desc: (
        <p style={{ margin: 0 }}>
          Add the <a href="https://docs.flutterflow.io/resources/ui/pages/scaffold#nav-bar" className="text-link" target="_blank" rel="noopener noreferrer">Nav Bar</a> to your page, enable it in the popup, and customize it to match your design.
        </p>
      ),
      image: 'https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161546-13.png'
    },
    {
      id: 'video-guide',
      title: 'Video Guide',
      short: 'VG',
      desc: (
        <p style={{ margin: 0 }}>
          Watch the full video guide: <a href="https://youtu.be/NDrte4nOXYc" className="text-link" target="_blank" rel="noopener noreferrer">The Canvas | FlutterFlow University</a>.
        </p>
      ),
    },
  ]

  return (
    <section className="sec" id="canvas" style={{ paddingTop: '0', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
      <SectionHeroBackdrop height={420} opacity={0.62} />
      <div className="wrap hero-grid" style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', zIndex: 2 }}>
        <MotionReveal>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem', color: '#00e676', border: '1px solid rgba(0, 230, 118, 0.3)', background: 'rgba(0, 230, 118, 0.12)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 3v18"/><path d="M3 8h18"/></svg> Module 2 — Chapter 4
            </span>
            <h1 style={{
              fontSize: 'clamp(2.6rem, 5vw, 3.6rem)', fontWeight: 800,
              lineHeight: 1.1, marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #00e676, #4361ee, #00f5d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Canvas
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#c8c8e0', lineHeight: 1.8, maxWidth: '620px' }}>
              The Canvas shows the screen of the device and lets you add widgets via drag-and-drop. You can select, move, and position widgets anywhere on the canvas.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            position: 'relative', width: '100%',
            borderRadius: '20px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161546-9.png" alt="Canvas" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>
      </div>

      <div className="wrap">
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700,
            textAlign: 'center', marginBottom: '1rem',
            background: 'linear-gradient(135deg, #00e676, #4361ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Canvas Controls & Features
          </h2>
          <p style={{ textAlign: 'center', color: '#b0b0cc', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
            Explore everything you can adjust and preview directly from the canvas.
          </p>
        </MotionReveal>

        <div className="chapter-grid">
          {canvasItems.map((item, i) => {
            const hue = (i * 25 + 120) % 360
            const accent = `hsl(${hue}, 70%, 55%)`
            return (
              <HoloCard
                key={item.id}
                className="gsap-child"
                style={{ minHeight: '220px' }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: `hsla(${hue}, 70%, 55%, 0.12)`,
                  border: `1.5px solid hsla(${hue}, 70%, 55%, 0.35)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: accent, fontWeight: 800, marginBottom: '1rem', fontSize: '0.85rem',
                  boxShadow: `0 0 20px hsla(${hue}, 70%, 55%, 0.15)`
                }}>{item.short || i + 1}</div>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                <div style={{ color: '#c8c8e0', fontSize: '0.98rem', lineHeight: 1.7 }}>
                  {item.desc}
                </div>
                {item.image && (
                  <div style={{
                    marginTop: '1rem', borderRadius: '14px', overflow: 'hidden',
                    border: `1px solid ${accent}35`,
                    boxShadow: `0 8px 24px ${accent}10`
                  }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
              </HoloCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PropertiesPanelSection() {
  const cards = [
    {
      title: 'Page Properties',
      desc: 'When a page is selected, configure layout, routing, and page-level settings.',
      link: 'https://docs.flutterflow.io/resources/ui/pages/properties'
    },
    {
      title: 'Widget Properties',
      desc: 'When a widget is selected, configure appearance, behavior, and interactions.',
      link: 'https://docs.flutterflow.io/resources/ui/widgets/properties'
    },
  ]

  return (
    <section className="sec" id="properties-panel" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
      <div className="wrap">
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #f59e0b, #ff2d55)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Properties Panel
          </h2>
          <p style={{ color: '#c8c8e0', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '900px' }}>
            The Properties Panel lets you modify visual appearance and interactive behavior of UI elements. Add <a href="https://docs.flutterflow.io/resources/functions/action-flow-editor" className="text-link" target="_blank" rel="noopener noreferrer">Actions</a>, configure a <a href="https://docs.flutterflow.io/resources/backend-query" className="text-link" target="_blank" rel="noopener noreferrer">Backend Query</a>, and apply <a href="https://docs.flutterflow.io/concepts/animations" className="text-link" target="_blank" rel="noopener noreferrer">Animations</a>.
          </p>
          <p style={{ color: '#b0b0cc', fontSize: '0.98rem', marginTop: '0.5rem' }}>
            The panel varies depending on what you have selected.
          </p>
        </MotionReveal>

        <div className="chapter-grid" style={{ marginTop: '1.5rem' }}>
          {cards.map((card, i) => {
            const colors = ['#f59e0b', '#ff2d55']
            const color = colors[i]
            const emojis = ['☰', '⚙']
            return (
              <FlipCard
                key={card.title}
                style={{ minHeight: '160px' }}
                frontStyle={{
                  background: `linear-gradient(145deg, ${color}15, rgba(8,10,28,0.95))`,
                  border: `1px solid ${color}40`,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                }}
                backStyle={{
                  background: `linear-gradient(145deg, rgba(8,10,28,0.95), ${color}15)`,
                  border: `1px solid ${color}40`,
                }}
                front={
                  <>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      background: `${color}18`, border: `2px solid ${color}50`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: color, fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.75rem'
                    }}>{emojis[i]}</div>
                    <h3 style={{ color: '#fff', marginBottom: '0.4rem', fontSize: '1.15rem' }}>{card.title}</h3>
                    <p style={{ color: '#b0b0cc', fontSize: '0.82rem' }}>Click to explore →</p>
                  </>
                }
                back={
                  <div style={{ padding: '0.5rem' }}>
                    <h3 style={{ color: color, marginBottom: '0.6rem', fontSize: '1.1rem' }}>{card.title}</h3>
                    <p style={{ color: '#c8c8e0', fontSize: '0.93rem', lineHeight: 1.65, marginBottom: '0.75rem' }}>{card.desc}</p>
                    <a href={card.link} className="text-link" target="_blank" rel="noopener noreferrer">Learn more →</a>
                  </div>
                }
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function OrganizationSection() {
  const orgItems = [
    {
      id: 'team-code',
      title: 'Team Code',
      short: 'TC',
      layout: 'wide',
      desc: (
        <>
          <div style={{
            marginBottom: '1rem', padding: '0.9rem 1.1rem',
            background: 'rgba(255,99,71,0.08)', border: '1px solid rgba(255,99,71,0.35)',
            borderRadius: '12px', color: '#c8c8e0', fontSize: '0.95rem'
          }}>
            <strong style={{ color: '#ff6b6b' }}>Warning:</strong> Team Code Libraries are deprecated. Use <a href="https://docs.flutterflow.io/resources/projects/libraries" className="text-link" target="_blank" rel="noopener noreferrer">Libraries</a> to share and reuse projects across multiple projects.
          </div>
          <p style={{ margin: 0 }}>
            Share reusable <a href="https://docs.flutterflow.io/concepts/custom-code/custom-functions" className="text-link" target="_blank" rel="noopener noreferrer">Custom Functions</a>, <a href="https://docs.flutterflow.io/resources/ui/widgets/composing-widgets/rows-column-stack" className="text-link" target="_blank" rel="noopener noreferrer">Widgets</a>, and <a href="https://docs.flutterflow.io/resources/functions/action-flow-editor" className="text-link" target="_blank" rel="noopener noreferrer">Actions</a> between team members and projects to reduce effort and maintain consistency.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            Here's how you can share custom code:
          </p>
          <ol style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: '#c8c8e0' }}>
            <li style={{ marginBottom: '0.5rem' }}>Navigate to My Organization &gt; Team Code.</li>
            <li style={{ marginBottom: '0.5rem' }}>Click + Add and select what you want to create and share. See how to create <a href="https://docs.flutterflow.io/concepts/custom-code/custom-functions" className="text-link" target="_blank" rel="noopener noreferrer">Custom Function</a>, <a href="https://docs.flutterflow.io/concepts/custom-code/custom-widgets" className="text-link" target="_blank" rel="noopener noreferrer">Custom Widget</a>, and <a href="https://docs.flutterflow.io/concepts/custom-code/custom-actions" className="text-link" target="_blank" rel="noopener noreferrer">Custom Action</a>.</li>
            <li style={{ marginBottom: '0.5rem' }}>
              To use shared code, open the project and click Custom Functions from the Navigation Menu.
              <div style={{ marginTop: '0.4rem', paddingLeft: '1rem' }}>
                • Click + Add and select Team Function, Team Widget, or Team Action.
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                • Choose a shared item from the popup to add it to your project.
              </div>
            </li>
            <li>You cannot edit shared custom code directly. Duplicate it first and then modify as needed.</li>
          </ol>
          <div style={{ marginTop: '0.75rem' }}>
            <a href="https://demo.arcade.software/ZBQK4f3KhcR0wA5vvJ7f?embed&show_copy_link=true" className="text-link" target="_blank" rel="noopener noreferrer">Interactive demo</a>
          </div>
        </>
      ),
    },
    {
      id: 'team-media',
      title: 'Team Media Assets',
      short: 'MA',
      layout: 'wide',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            Share icons, images, audio files, and other assets across projects to save time and keep designs consistent.
          </p>
          <p style={{ marginTop: '0.75rem' }}>Here's how you can share media assets:</p>
          <ol style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: '#c8c8e0' }}>
            <li style={{ marginBottom: '0.5rem' }}>Navigate to My Organization &gt; Team Media Assets and click Upload Media.</li>
            <li>The uploaded media will be accessible via Project &gt; Media Assets from the Navigation Menu.</li>
          </ol>
          <div style={{
            marginTop: '0.9rem', padding: '0.9rem 1.1rem',
            background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.3)',
            borderRadius: '12px', color: '#c8c8e0', fontSize: '0.95rem'
          }}>
            <strong style={{ color: '#00f5d4' }}>Info:</strong> Shared media assets have the "teams" icon at the bottom right.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {[
              { src: 'https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161717-20.png', label: 'Upload sharable media assets' },
              { src: 'https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161717-21.png', label: 'Access media assets' },
            ].map((img, i) => {
              const colors = ['#7b2ff7', '#00f5d4']
              const color = colors[i]
              return (
                <HoloCard
                  key={img.label}
                  style={{ padding: '0.8rem' }}
                >
                  <img src={img.src} alt={img.label} style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
                  <div style={{ color: '#c8c8e0', fontSize: '0.9rem', marginTop: '0.5rem' }}>{img.label}</div>
                </HoloCard>
              )
            })}
          </div>
        </>
      ),
    },
    {
      id: 'team-design',
      title: 'Team Design Library',
      short: 'DL',
      layout: 'wide',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            Create a shared design system to keep UI consistent across multiple apps. A design system includes colors, typography, fonts, icons, assets, and reusable navigation elements.
          </p>
          <div style={{
            marginTop: '0.9rem', padding: '0.9rem 1.1rem',
            background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.3)',
            borderRadius: '12px', color: '#c8c8e0', fontSize: '0.95rem'
          }}>
            <strong style={{ color: '#00f5d4' }}>Tip:</strong> Use <a href="https://docs.flutterflow.io/resources/projects/libraries" className="text-link" target="_blank" rel="noopener noreferrer">Libraries</a> to store pre-designed UI components for easy reuse.
          </div>
          <p style={{ marginTop: '0.75rem' }}>Here's how you can share the design library:</p>
          <ol style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: '#c8c8e0' }}>
            <li style={{ marginBottom: '0.5rem' }}>Navigate to My Organization &gt; Team Design Library and click + Create New.</li>
            <li style={{ marginBottom: '0.5rem' }}>Provide a name to the Design System Project.</li>
            <li style={{ marginBottom: '0.5rem' }}>
              Configure Theme, <a href="https://docs.flutterflow.io/resources/ui/pages/scaffold#nav-bar" className="text-link" target="_blank" rel="noopener noreferrer">NavBar</a>, <a href="https://docs.flutterflow.io/resources/ui/pages/scaffold#appbar" className="text-link" target="_blank" rel="noopener noreferrer">AppBar</a>, and <a href="https://docs.flutterflow.io/resources/projects/settings/general-settings#app-assets" className="text-link" target="_blank" rel="noopener noreferrer">App Assets</a>. <a href="https://demo.arcade.software/wKuA4fKRkxiNXCkESJJt?embed&show_copy_link=true" className="text-link" target="_blank" rel="noopener noreferrer">Interactive demo</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>Open the project where you want to use the design system and go to Theme Settings &gt; Design System.</li>
            <li style={{ marginBottom: '0.5rem' }}>Click No Design System Selected.</li>
            <li>
              Choose the shared design system from the list. <a href="https://demo.arcade.software/JvWQRp2yZHIAJqHu4Lfm?embed&show_copy_link=true" className="text-link" target="_blank" rel="noopener noreferrer">Interactive demo</a>
            </li>
          </ol>
        </>
      ),
    },
    {
      id: 'team-api',
      title: 'Team API Library',
      short: 'API',
      layout: 'wide',
      desc: (
        <>
          <div style={{
            marginBottom: '1rem', padding: '0.9rem 1.1rem',
            background: 'rgba(255,99,71,0.08)', border: '1px solid rgba(255,99,71,0.35)',
            borderRadius: '12px', color: '#c8c8e0', fontSize: '0.95rem'
          }}>
            <strong style={{ color: '#ff6b6b' }}>Warning:</strong> Team API Libraries are deprecated. Use <a href="https://docs.flutterflow.io/resources/projects/libraries" className="text-link" target="_blank" rel="noopener noreferrer">Libraries</a> instead.
          </div>
          <p style={{ margin: 0 }}>
            Share API calls across projects for consistency, easier testing, and faster development.
          </p>
          <p style={{ marginTop: '0.75rem' }}>Here's how you can share APIs:</p>
          <ol style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', color: '#c8c8e0' }}>
            <li style={{ marginBottom: '0.5rem' }}>Navigate to My Organization &gt; Team API Library.</li>
            <li style={{ marginBottom: '0.5rem' }}>Click + and select <a href="https://docs.flutterflow.io/resources/backend-logic/create-test-api" className="text-link" target="_blank" rel="noopener noreferrer">Create API Call</a>.</li>
            <li style={{ marginBottom: '0.5rem' }}>
              To use the shared API, open your project and click API Calls from the Navigation Menu.
              <div style={{ marginTop: '0.4rem', paddingLeft: '1rem' }}>
                • Click + and select Use Team API.
              </div>
              <div style={{ paddingLeft: '1rem' }}>
                • Select a shared API from the popup to add it to your project.
              </div>
            </li>
            <li>You cannot edit shared APIs directly. Duplicate them and modify as needed.</li>
          </ol>
          <div style={{ marginTop: '0.75rem' }}>
            <a href="https://demo.arcade.software/2ALaTBUoWnyeZHAqi5wR?embed&show_copy_link=true" className="text-link" target="_blank" rel="noopener noreferrer">Interactive demo 1</a>
          </div>
          <div style={{ marginTop: '0.4rem' }}>
            <a href="https://demo.arcade.software/mT2NXzQoIYcsRP0XBVdG?embed&show_copy_link=true" className="text-link" target="_blank" rel="noopener noreferrer">Interactive demo 2</a>
          </div>
        </>
      ),
    },
    {
      id: 'add-domains',
      title: 'Add Domains',
      short: 'AD',
      layout: 'wide',
      desc: (
        <>
          <p style={{ margin: 0 }}>
            Add custom domains and share them with team members to simplify collaboration and project setup.
          </p>
          <p style={{ marginTop: '0.75rem' }}>
            Click Add Domains under My Organization to get started.
          </p>
          <div style={{
            marginTop: '1rem', borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161717-22.png" alt="Add domains" style={{ width: '100%', display: 'block' }} />
          </div>
        </>
      ),
    },
  ]

  return (
    <section className="sec" id="my-organization" style={{ paddingTop: '0', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
      <SectionHeroBackdrop height={420} opacity={0.62} />
      <div className="wrap hero-grid" style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', zIndex: 2 }}>
        <MotionReveal>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem', color: '#00f5d4', border: '1px solid rgba(0, 245, 212, 0.3)', background: 'rgba(0, 245, 212, 0.12)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M3 7h18"/><path d="M3 12h18"/><path d="M3 17h18"/></svg> Module 2 — Chapter 7
            </span>
            <h1 style={{
              fontSize: 'clamp(2.6rem, 5vw, 3.6rem)', fontWeight: 800,
              lineHeight: 1.1, marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #00f5d4, #4361ee)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              My Organization
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#c8c8e0', lineHeight: 1.8, maxWidth: '620px' }}>
              Manage billing for your team, edit projects together, and share code, design systems, APIs, and assets. This keeps collaboration smooth and your development process efficient.
            </p>
            <p style={{ color: '#b0b0cc', fontSize: '0.98rem', marginTop: '0.5rem' }}>
              With shared resources, you can build faster and keep teams aligned.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            position: 'relative', width: '100%',
            borderRadius: '20px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161717-19.png" alt="My Organization" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>
      </div>

      <div className="wrap">
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700,
            textAlign: 'center', marginBottom: '1rem',
            background: 'linear-gradient(135deg, #00f5d4, #4361ee)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Organization Resources
          </h2>
          <p style={{ textAlign: 'center', color: '#b0b0cc', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
            Share code, assets, design systems, and APIs across projects and teams.
          </p>
        </MotionReveal>

        <div className="chapter-steps">
          {orgItems.map((item, i) => {
            const hue = (i * 55 + 180) % 360
            const accent = `hsl(${hue}, 70%, 55%)`
            return (
              <NeumorphicCard
                key={item.id}
                icon={item.short || (i + 1)}
                className="gsap-child"
                style={{ minHeight: '220px' }}
              >
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                <div style={{ color: '#c8c8e0', fontSize: '0.98rem', lineHeight: 1.7 }}>
                  {item.desc}
                </div>
              </NeumorphicCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ResourceHierarchySection() {
  const appParts = [
    {
      title: 'Project',
      desc: <>Represents the overall application you are building. Learn more <a href="https://docs.flutterflow.io/resources/projects/how-to-create-find-organize-projects#how-to-create-a-project" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</>
    },
    {
      title: 'Page',
      desc: <>Individual screens within the project. Learn more <a href="https://docs.flutterflow.io/resources/ui/pages#creating-a-page" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</>
    },
    {
      title: 'Built-in Widgets',
      desc: 'Pre-designed widgets you can drag onto the canvas, such as buttons, text fields, and sliders.'
    },
    {
      title: 'Component',
      desc: <>Reusable UI blocks that keep design consistent. Learn more <a href="https://docs.flutterflow.io/resources/ui/components" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</>
    },
    {
      title: 'Design System',
      desc: <>Predefined styles that ensure visual consistency. Learn more <a href="https://docs.flutterflow.io/concepts/design-system" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</>
    },
  ]

  const flutterMapping = [
    {
      title: 'MyApp → Project',
      desc: <>Flutter's root app maps to the FlutterFlow Project. Learn more <a href="https://docs.flutterflow.io/resources/projects/how-to-create-find-organize-projects#how-to-create-a-project" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</>
    },
    {
      title: 'MyPage → Page',
      desc: <>A Flutter screen maps to a Page in FlutterFlow. Learn more <a href="https://docs.flutterflow.io/resources/ui/pages#creating-a-page" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</>
    },
    {
      title: 'Column/Button/Text → Built-in Widgets',
      desc: <>Widgets are categorized as built-in widgets in FlutterFlow. Learn more <a href="https://docs.flutterflow.io/resources/ui/overview#widgets" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</>
    },
    {
      title: 'Custom Widget → Component',
      desc: <>Custom Flutter widgets map to Components in FlutterFlow. Learn more <a href="https://docs.flutterflow.io/resources/ui/components" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</>
    },
    {
      title: 'Theme/Style Constants → Design System',
      desc: <>Flutter themes map to the FlutterFlow Design System. Learn more <a href="https://docs.flutterflow.io/concepts/design-system" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</>
    },
  ]

  const resourceReasons = [
    { title: 'Team Collaboration', desc: "Descriptions help teammates understand each element's role quickly." },
    { title: 'Better Search', desc: 'Descriptions are indexed to help locate resources in large projects.' },
    { title: 'Project Documentation', desc: 'Acts as built-in documentation that simplifies future updates.' },
  ]

  const resourceItems = [
    { title: 'Project', desc: 'Use the project-level description to summarize the overall goals or scope of your app. Example: "A delivery management app for small businesses".' },
    { title: 'Page', desc: 'Explain a page\'s main function. Example: "Displays the user\'s shopping cart and checkout options".' },
    { title: 'Component', desc: 'Clarify the functionality or design intention of a reusable component. Example: "Reusable card component to be used as ListTile".' },
    { title: 'Action Blocks', desc: 'Describe what a set of actions does. Example: "Sends a notification to the user\'s email address upon form submission".' },
    { title: 'Custom Functions', desc: 'Describe the logic or purpose behind the function. Example: "Calculates shipping costs based on weight and distance".' },
    { title: 'Custom Actions', desc: 'Specify the custom behavior you\'ve created. Example: "Opens a QR scanner and returns the scanned value".' },
    { title: 'Custom Widgets', desc: 'Explain the widget\'s purpose or structure. Example: "Carousel widget for displaying multiple images with pagination".' },
    { title: 'Data Type', desc: 'Summarize the purpose of a custom data model. Example: "Represents a user\'s order including items, total cost, and status".' },
    { title: 'Parameters', desc: 'Provide context for how a parameter is used, including expected types or ranges. Example: "String to store the user\'s phone number - must include country code".' },
    { title: 'Page/Component State Variables', desc: 'Clarify what state data is stored and why. Example: "Tracks the currently selected tab in this component".', layout: 'wide' },
    { title: 'App State Variables', desc: 'Describe global data shared across pages. Example: "Stores the user\'s authentication token for all network requests".', layout: 'wide' },
    { title: 'Constant', desc: 'Explain the purpose of any fixed value used throughout the app. Example: "Base API URL for all network calls".' },
    { title: 'Enum', desc: 'Provide a rationale for enumerated values. Example: "Defines possible user roles - admin, editor, viewer".' },
    { title: 'Firestore Collection', desc: 'Explain what data the collection holds and how it relates to your app. Example: "Stores all user profiles with fields for name, email, and profile photo URL".', layout: 'wide' },
  ]

  return (
    <section className="sec" id="resource-hierarchy" style={{ paddingTop: '0', paddingBottom: '40px', position: 'relative', overflow: 'hidden' }}>
      <SectionHeroBackdrop height={420} opacity={0.62} />
      <div className="wrap hero-grid" style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', zIndex: 2 }}>
        <MotionReveal>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem', color: '#7b2ff7', border: '1px solid rgba(123, 47, 247, 0.3)', background: 'rgba(123, 47, 247, 0.12)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M3 7h18"/><path d="M3 12h18"/><path d="M3 17h18"/></svg> Module 2 — Chapter 8
            </span>
            <h1 style={{
              fontSize: 'clamp(2.6rem, 5vw, 3.6rem)', fontWeight: 800,
              lineHeight: 1.1, marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, #7b2ff7, #00e676)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Resource Hierarchy Overview
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#c8c8e0', lineHeight: 1.8, maxWidth: '620px' }}>
              This guide explains the structure of a FlutterFlow project, from the overall app down to individual design elements, and how they relate to traditional Flutter components.
            </p>
          </div>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            position: 'relative', width: '100%',
            borderRadius: '20px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161857-25.png" alt="Resource description tooltip" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>
      </div>

      <div className="wrap">
        <MotionReveal>
          <h3 style={{ marginTop: '2rem', color: '#fff', fontSize: '1.5rem' }}>FlutterFlow App Parts</h3>
          <p style={{ color: '#b0b0cc', fontSize: '1rem', lineHeight: 1.7 }}>The diagram below illustrates how a FlutterFlow app is structured.</p>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            marginTop: '1rem', borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161857-23.png" alt="FlutterFlow app parts" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>

        <div className="chapter-grid" style={{ marginTop: '1.5rem' }}>
          {appParts.map((part, i) => {
            const hue = (i * 45 + 90) % 360
            return (
              <HoloCard
                key={part.title}
                className="gsap-child"
              >
                <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>{part.title}</h4>
                <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.65 }}>{part.desc}</p>
              </HoloCard>
            )
          })}
        </div>

        <MotionReveal>
          <h3 style={{ marginTop: '2.5rem', color: '#fff', fontSize: '1.5rem' }}>Flutter to FlutterFlow</h3>
          <p style={{ color: '#b0b0cc', fontSize: '1rem', lineHeight: 1.7 }}>
            If you are coming from Flutter, this diagram maps common Flutter components to FlutterFlow equivalents.
          </p>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            marginTop: '1rem', borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161857-24.png" alt="Flutter to FlutterFlow mapping" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>

        <div className="chapter-grid" style={{ marginTop: '1.5rem' }}>
          {flutterMapping.map((item, i) => {
            const colors = ['#00f5d4', '#7b2ff7', '#ff2d55', '#f59e0b', '#4361ee']
            const color = colors[i % colors.length]
            return (
              <TiltCard
                key={item.title}
                accent={color}
                className="gsap-child"
              >
                <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>{item.title}</h4>
                <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.65 }}>{item.desc}</p>
              </TiltCard>
            )
          })}
        </div>

        <MotionReveal>
          <h3 style={{ marginTop: '2.5rem', color: '#fff', fontSize: '1.5rem' }}>Resource Description</h3>
          <p style={{ color: '#b0b0cc', fontSize: '1rem', lineHeight: 1.7 }}>
            A Resource Description is a short note that explains purpose, usage, or key details of a resource. This improves collaboration and project documentation.
          </p>
        </MotionReveal>

        <div className="chapter-grid" style={{ marginTop: '1.5rem' }}>
          {resourceReasons.map((reason, i) => {
            const hue = (i * 60 + 270) % 360
            return (
              <NeonCard
                key={reason.title}
                className="gsap-child"
              >
                <h4 style={{ color: '#fff', marginBottom: '0.4rem' }}>{reason.title}</h4>
                <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.65 }}>{reason.desc}</p>
              </NeonCard>
            )
          })}
        </div>

        <MotionReveal>
          <p style={{ color: '#b0b0cc', fontSize: '1rem', marginTop: '2rem' }}>
            You can add a description for each of these resources:
          </p>
        </MotionReveal>

        <div className="chapter-grid tight" style={{ marginTop: '1rem' }}>
          {resourceItems.map((item, i) => (
            <TerminalCard
              key={item.title}
              title={item.title.toLowerCase().replace(/\s/g, '-')}
              className="gsap-child"
              style={{ minHeight: '130px' }}
            >
              <div className="terminal-line">
                <span className="terminal-prompt">❯</span>
                <span style={{ color: '#00f5d4', fontWeight: 700 }}>{item.title}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-body)', color: '#c8c8e0', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '0.4rem' }}>
                {item.desc}
              </div>
            </TerminalCard>
          ))}
        </div>

        <MotionReveal>
          <p style={{ color: '#b0b0cc', fontSize: '1rem', marginTop: '1.5rem' }}>
            In FlutterFlow, descriptions appear as tooltips when you hover over the green note icon.
          </p>
          <div style={{
            marginTop: '1rem', padding: '1rem 1.25rem',
            background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.3)',
            borderRadius: '14px', color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6
          }}>
            <strong style={{ color: '#00f5d4' }}>Tip:</strong> FlutterFlow inserts descriptions as docstring-like comments in generated code. Example:
            <pre style={{
              marginTop: '0.8rem', background: 'rgba(0,0,0,0.4)', padding: '1rem',
              borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', color: '#c8c8e0', overflowX: 'auto'
            }}>
              <code>{`/// Represents a user's order, including items, total cost, and status.
class OrderInfo {
  /// The total price in USD for this order.
  double totalAmount;
  List<String> items;
  // ...
}`}</code>
            </pre>
          </div>
        </MotionReveal>

        <MotionReveal>
          <p style={{ color: '#b0b0cc', fontSize: '1rem', marginTop: '1.5rem' }}>
            In standard IDEs like VS Code or Android Studio, hovering over a class name shows the description as a tooltip.
          </p>
          <div style={{
            marginTop: '1rem', borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
          }}>
            <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313161857-25.png" alt="Resource description tooltip" style={{ width: '100%', display: 'block' }} />
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}

/* ─── Bento layout helpers ─── */
const getBentoClass = (i, total) => {
  if (total <= 3) return ''
  if (total <= 5) return i === 0 ? 'span-2' : ''
  if (total <= 8) return i % 5 === 0 ? 'span-2' : ''
  if (i % 10 === 0) return 'span-2'
  if (i % 14 === 0) return 'row-2'
  return ''
}

const resolveBentoClass = (item, i, total) => {
  if (item?.layout === 'wide') return 'span-2'
  if (item?.layout === 'tall') return 'row-2'
  if (item?.layout === 'mega') return 'span-2 row-2'
  return getBentoClass(i, total)
}

/* ─── GSAP Scroll Reveal Hook ─── */
function useGsapReveal(containerRef, selector = '.gsap-child') {
  useEffect(() => {
    if (!containerRef.current) return
    const children = containerRef.current.querySelectorAll(selector)
    if (!children.length) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            gsap.fromTo(child,
              { opacity: 0, y: 50, scale: 0.92 },
              { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: i * 0.1, ease: 'power3.out' }
            )
          })
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])
}

/* ─── Magnetic Hover Effect ─── */
function useMagneticHover(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(el, { x: x * 0.15, y: y * 0.15, duration: 0.4, ease: 'power2.out' })
    }
    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
    }
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [])
}

/* ─── TiltCard — 3D mouse-tracking tilt with glassmorphism ─── */
function TiltCard({ children, className = '', style = {}, accent }) {
  const cardRef = useRef(null)
  const handleMove = useCallback((e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, {
      rotateY: x * 20,
      rotateX: -y * 20,
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [])
  const handleLeave = useCallback(() => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.6)' })
  }, [])

  return (
    <motion.div
      ref={cardRef}
      className={`card-glass-tilt ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={{ scale: 0.97 }}
      style={{ transformStyle: 'preserve-3d', ...style }}
    >
      {accent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: accent, borderRadius: '24px 24px 0 0'
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 2, transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  )
}

/* ─── FlipCard — 3D flip on click with front/back ─── */
function FlipCard({ front, back, style = {}, frontStyle = {}, backStyle = {} }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <motion.div
      className={`card-flip-container ${flipped ? 'flipped' : ''}`}
      onClick={() => setFlipped(f => !f)}
      whileTap={{ scale: 0.97 }}
      style={style}
    >
      <div className="card-flip-inner">
        <div className="card-flip-front" style={frontStyle}>{front}</div>
        <div className="card-flip-back" style={backStyle}>{back}</div>
      </div>
    </motion.div>
  )
}

/* ─── NeonCard — Animated spinning neon border with shimmer ─── */
function NeonCard({ children, className = '', style = {} }) {
  return (
    <motion.div
      className={`card-neon-glow ${className}`}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={style}
    >
      <div className="neon-shimmer" />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </motion.div>
  )
}

/* ─── HoloCard — Holographic rainbow shimmer on hover ─── */
function HoloCard({ children, className = '', style = {} }) {
  const cardRef = useRef(null)
  const handleMouse = useCallback((e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mouse-x', `${x}%`)
    el.style.setProperty('--mouse-y', `${y}%`)
  }, [])

  return (
    <motion.div
      ref={cardRef}
      className={`card-holographic ${className}`}
      onMouseMove={handleMouse}
      whileHover={{ y: -6, boxShadow: '0 25px 60px rgba(0,245,212,0.15), 0 0 40px rgba(123,47,247,0.1)' }}
      whileTap={{ scale: 0.97 }}
      style={style}
    >
      <div className="holo-shine" />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </motion.div>
  )
}

/* ─── TerminalCard — Code terminal aesthetic ─── */
function TerminalCard({ title, children, prompt = '❯', className = '', style = {} }) {
  return (
    <motion.div
      className={`card-terminal ${className}`}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      style={style}
    >
      <div className="terminal-header">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="terminal-title">{title || 'terminal'}</span>
      </div>
      <div className="terminal-body">
        {children}
      </div>
    </motion.div>
  )
}

/* ─── MagazineCard — Editorial full-bleed image with overlay text ─── */
function MagazineCard({ imgSrc, imgAlt, children, className = '', style = {} }) {
  return (
    <motion.div
      className={`card-magazine ${className}`}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      style={style}
    >
      {imgSrc && (
        <div className="magazine-bg">
          <img src={imgSrc} alt={imgAlt || ''} />
        </div>
      )}
      <div className="magazine-overlay" />
      <div className="magazine-content">
        {children}
      </div>
    </motion.div>
  )
}

/* ─── NeumorphicCard ─── */
function NeumorphicCard({ icon, children, className = '', style = {} }) {
  return (
    <motion.div
      className={`card-neumorphic ${className}`}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      style={style}
    >
      {icon && (
        <div className="neu-icon" style={{ color: '#7b2ff7', fontWeight: 800, fontSize: '1.1rem' }}>
          {icon}
        </div>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  )
}

/* ─── Dynamic card styling ─── */
const cardTone = (i) => {
  const hue = (i * 37) % 360
  return {
    accent: `hsl(${hue}, 80%, 60%)`,
    border: `1px solid hsla(${hue}, 80%, 60%, 0.35)`,
    bg: `linear-gradient(145deg, hsla(${hue}, 80%, 60%, 0.12), rgba(255,255,255,0.02))`,
    shadow: `0 25px 60px hsla(${hue}, 80%, 60%, 0.18)`,
    glow: `radial-gradient(circle at 30% 20%, hsla(${hue}, 80%, 60%, 0.18), transparent 60%)`,
  }
}

const cardRadius = (i) => (i % 3 === 0 ? '24px' : i % 3 === 1 ? '18px' : '30px')

/* ─── Chapter Components ─── */
function Chapter1_1() {
  return (
    <>
      <Hero />
      <div className="glow-line" />
      <BentoSection />
      <div className="glow-line" />
      <QuickStartIntro />
      <StepsSection />
      <CTABanner />
      <FAQSection />
    </>
  )
}

function Chapter1_2() {
  return (
    <>
      <RoadmapSection />
      <CTABanner />
      <FAQSection />
    </>
  )
}

function Chapter1_3() {
  return (
    <>
      <BeforeYouBeginSection />
    </>
  )
}

function Chapter2_1() {
  return (
    <>
      <DashboardSection />
      <FAQSection />
    </>
  )
}

function Chapter2_2() {
  return (
    <>
      <AppBuilderSection />
      <FAQSection />
    </>
  )
}

function Chapter2_3() {
  return (
    <>
      <ToolbarSection />
      <FAQSection />
    </>
  )
}

function Chapter2_4() {
  return (
    <>
      <CanvasSection />
      <FAQSection />
    </>
  )
}

function Chapter2_5() {
  return (
    <>
      <StoryboardSection />
      <FAQSection />
    </>
  )
}

function Chapter2_6() {
  return (
    <>
      <WidgetPaletteSection />
      <FAQSection />
    </>
  )
}

function Chapter2_7() {
  return (
    <>
      <OrganizationSection />
      <FAQSection />
    </>
  )
}

function Chapter2_8() {
  return (
    <>
      <ResourceHierarchySection />
      <FAQSection />
    </>
  )
}

function Chapter4_1() {
  return (
    <>
      <Module4_1Section />
      <FAQSection />
    </>
  )
}

function Chapter4_2() {
  return (
    <>
      <Module4_2Section />
      <FAQSection />
    </>
  )
}

function Chapter4_3() {
  return (
    <>
      <Module4_3Section />
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

function Chapter5_1() {
  return (
    <>
      <Module5_1Section />
      <FAQSection />
    </>
  )
}

function Chapter5_2() {
  return (
    <>
      <Module5_2Section />
      <FAQSection />
    </>
  )
}


/* ═══════ MODULE 3 ═══════ */

function CalloutCard({ tone = 'info', title, children }) {
  const tones = {
    info: { border: 'rgba(0,245,212,0.35)', bg: 'rgba(0,245,212,0.08)', label: '#00f5d4' },
    tip: { border: 'rgba(255,215,0,0.35)', bg: 'rgba(255,215,0,0.08)', label: '#ffd700' },
    warning: { border: 'rgba(255,45,85,0.35)', bg: 'rgba(255,45,85,0.1)', label: '#ff2d55' },
    note: { border: 'rgba(123,47,247,0.35)', bg: 'rgba(123,47,247,0.1)', label: '#7b2ff7' },
  }
  const palette = tones[tone] || tones.info
  return (
    <div style={{
      background: palette.bg,
      border: `1px solid ${palette.border}`,
      borderRadius: '16px',
      padding: '1.25rem 1.5rem'
    }}>
      <div style={{
        fontSize: '0.7rem',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: palette.label,
        fontWeight: 700,
        marginBottom: '0.5rem'
      }}>
        {title || tone}
      </div>
      <div style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  )
}

function StepsList({ steps, dense = false }) {
  return (
    <ol style={{
      paddingLeft: '1.35rem',
      display: 'grid',
      gap: dense ? '0.45rem' : '0.85rem',
      color: '#c8c8e0',
      fontSize: '0.96rem',
      lineHeight: 1.7,
      margin: 0
    }}>
      {steps.map((step, i) => (
        <li key={i}>{step}</li>
      ))}
    </ol>
  )
}

function BulletList({ items, dense = false }) {
  return (
    <ul style={{
      paddingLeft: '1.2rem',
      display: 'grid',
      gap: dense ? '0.45rem' : '0.75rem',
      color: '#c8c8e0',
      fontSize: '0.95rem',
      lineHeight: 1.7,
      margin: 0
    }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

function FeatureCard({ title, desc, accent = '#00f5d4', icon }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(20,22,40,0.9) 0%, rgba(10,12,20,0.95) 100%)',
      padding: '1.75rem', 
      borderRadius: '24px', 
      border: `1px solid ${accent}44`,
      borderTop: `2px solid ${accent}`,
      height: '100%',
      boxShadow: `0 8px 32px ${accent}15`
    }}>
      <div style={{ 
        width: '48px', height: '48px', 
        borderRadius: '14px', 
        background: `${accent}15`, 
        color: accent,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', marginBottom: '1.25rem'
      }}>
        {icon}
      </div>
      <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.75rem' }}>{title}</h3>
      <p style={{ color: '#aeb7cf', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>{desc}</p>
    </div>
  )
}

function Module3Section() {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 6

  const pages = [
    <PageListProjects />,
    <PageWhatIsProject />,
    <PageHowToCreate />,
    <PageRunAndTest />,
    <PageGeneralSettings />,
    <PageProjectSetup />
  ]

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0))

  return (
    <section className="sec module3" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SectionHeroBackdrop height={420} opacity={0.58} />
      <div className="wrap" style={{ flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {pages[currentPage]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="wrap" style={{ paddingBottom: '40px', display: 'flex', justifyContent: 'center', gap: '2rem', zIndex: 10 }}>
        <motion.button
          onClick={prevPage}
          disabled={currentPage === 0}
          whileHover={currentPage !== 0 ? { scale: 1.05, x: -4 } : {}}
          whileTap={currentPage !== 0 ? { scale: 0.95 } : {}}
          className="btn-ghost"
          style={{
            padding: '12px 24px',
            opacity: currentPage === 0 ? 0.3 : 1,
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
        >
          ← Previous Page
        </motion.button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c8c8e0', fontSize: '0.9rem', fontWeight: 600 }}>
          {currentPage + 1} <span style={{ opacity: 0.4 }}>/</span> {totalPages}
        </div>
        <motion.button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          whileHover={currentPage !== totalPages - 1 ? { scale: 1.05, x: 4 } : {}}
          whileTap={currentPage !== totalPages - 1 ? { scale: 0.95 } : {}}
          className="btn-sunset"
          style={{
            padding: '12px 24px',
            opacity: currentPage === totalPages - 1 ? 0.3 : 1,
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ff2d55, #7b2ff7)',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            boxShadow: '0 8px 20px rgba(255,45,85,0.2)'
          }}
        >
          {currentPage === totalPages - 1 ? 'Finish' : 'Next Page →'}
        </motion.button>
      </div>
    </section>
  )
}

function Module3_2Section() {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 2

  const pages = [
    <PageDesignSystem />,
    <PageStateManagement />
  ]

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0))

  return (
    <section className="sec module3" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SectionHeroBackdrop height={420} opacity={0.58} />
      <div className="wrap" style={{ flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {pages[currentPage]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="wrap" style={{ paddingBottom: '40px', display: 'flex', justifyContent: 'center', gap: '2rem', zIndex: 10 }}>
        <motion.button
          onClick={prevPage}
          disabled={currentPage === 0}
          whileHover={currentPage !== 0 ? { scale: 1.05, x: -4 } : {}}
          whileTap={currentPage !== 0 ? { scale: 0.95 } : {}}
          className="btn-ghost"
          style={{
            padding: '12px 24px',
            opacity: currentPage === 0 ? 0.3 : 1,
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
        >
          ← Previous Page
        </motion.button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c8c8e0', fontSize: '0.9rem', fontWeight: 600 }}>
          {currentPage + 1} <span style={{ opacity: 0.4 }}>/</span> {totalPages}
        </div>
        <motion.button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          whileHover={currentPage !== totalPages - 1 ? { scale: 1.05, x: 4 } : {}}
          whileTap={currentPage !== totalPages - 1 ? { scale: 0.95 } : {}}
          className="btn-sunset"
          style={{
            padding: '12px 24px',
            opacity: currentPage === totalPages - 1 ? 0.3 : 1,
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ff2d55, #7b2ff7)',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            boxShadow: '0 8px 20px rgba(255,45,85,0.2)'
          }}
        >
          {currentPage === totalPages - 1 ? 'Finish' : 'Next Page →'}
        </motion.button>
      </div>
    </section>
  )
}

function Module3_3Section() {
  const [currentPage, setCurrentPage] = useState(0)
  const totalPages = 1

  const pages = [
    <PageFileHandling />
  ]

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 0))

  return (
    <section className="sec module3" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SectionHeroBackdrop height={420} opacity={0.58} />
      <div className="wrap" style={{ flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {pages[currentPage]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="wrap" style={{ paddingBottom: '40px', display: 'flex', justifyContent: 'center', gap: '2rem', zIndex: 10 }}>
        <motion.button
          onClick={prevPage}
          disabled={currentPage === 0}
          whileHover={currentPage !== 0 ? { scale: 1.05, x: -4 } : {}}
          whileTap={currentPage !== 0 ? { scale: 0.95 } : {}}
          className="btn-ghost"
          style={{
            padding: '12px 24px',
            opacity: currentPage === 0 ? 0.3 : 1,
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.03)',
            color: '#fff',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
        >
          ← Previous Page
        </motion.button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c8c8e0', fontSize: '0.9rem', fontWeight: 600 }}>
          {currentPage + 1} <span style={{ opacity: 0.4 }}>/</span> {totalPages}
        </div>
        <motion.button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          whileHover={currentPage !== totalPages - 1 ? { scale: 1.05, x: 4 } : {}}
          whileTap={currentPage !== totalPages - 1 ? { scale: 0.95 } : {}}
          className="btn-sunset"
          style={{
            padding: '12px 24px',
            opacity: currentPage === totalPages - 1 ? 0.3 : 1,
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ff2d55, #7b2ff7)',
            color: '#fff',
            fontWeight: 700,
            border: 'none',
            boxShadow: '0 8px 20px rgba(255,45,85,0.2)'
          }}
        >
          {currentPage === totalPages - 1 ? 'Finish' : 'Next Page →'}
        </motion.button>
      </div>
    </section>
  )
}

function PageListProjects() {
  const projectIdeas = [
    {
      title: 'AirBnB',
      desc: 'Follow a full walkthrough to recreate a booking-style marketplace app.',
      icon: '🏠',
      links: [
        {
          label: 'YouTube Tutorial',
          href: 'https://www.youtube.com/watch?v=XCWnZ4_KAC4&list=PLfLZisr0-a4T3sZwY-eorcGcY-1Km9Gm2&index=23'
        }
      ]
    },
    {
      title: 'Simple To-Do App',
      desc: 'A classic beginner project: Create a task list with add, edit, delete, and perhaps basic persistence.',
      icon: '✅',
      links: [
        {
          label: 'How to build an app in FlutterFlow: step-by-step tutorial for beginners (2025) — No Code MBA / Doc Williams',
          href: 'https://www.youtube.com/watch?v=_qQ6YA2e4iE'
        }
      ]
    },
    {
      title: 'Your First Basic App / Hello World Style Project',
      desc: 'Set up a new project, explore the interface, add widgets, navigation, and simple actions.',
      icon: '🚀',
      links: [
        {
          label: 'Create Your First FlutterFlow Project - Step by Step',
          href: 'https://www.youtube.com/watch?v=8bQ8Ij7NF-0'
        },
        {
          label: 'FlutterFlow for Beginners 2024 | How to Build Your App from Scratch',
          href: 'https://www.youtube.com/watch?v=D05ugfpcqH0'
        }
      ]
    },
    {
      title: 'Real Estate Listing App (Property Marketplace)',
      desc: 'Build listing pages, display items (like properties), and create a simple marketplace feel—great for learning data display and layouts.',
      icon: '🏢',
      links: [
        {
          label: 'FlutterFlow Tutorial: Build Your First Real Estate Listing App | Beginner Friendly Guide',
          href: 'https://www.youtube.com/watch?v=HwWtULuTEhs'
        }
      ]
    },
  ]

  const beginnerSeries = [
    {
      title: 'FlutterFlow University (official)',
      desc: 'Full courses from beginner to advanced, including intro projects. Look for the “FlutterFlow University” playlist.',
      link: 'https://www.youtube.com/flutterflow'
    },
    {
      title: 'FlutterFlow Tutorials for Beginners Playlist',
      desc: 'Multiple short projects and tips designed to get you building quickly.',
      link: 'https://www.youtube.com/playlist?list=PLe6FXgqLjwQo8uYm5LhksIXgIBBJuM_aM'
    },
    {
      title: 'No Code MBA FlutterFlow Series',
      desc: 'A comprehensive beginner track with projects like to-do apps and more.',
      link: 'https://www.youtube.com/playlist?list=PLd3HlFHFcK2bL4mY3Rp96RI4ixV5f6Rlf'
    },
  ]

  const tips = [
    'Start with a blank project in FlutterFlow to follow along.',
    'Many tutorials use Firebase for backend (free tier works great for beginners).',
    "Explore FlutterFlow's templates in the dashboard for inspiration, then customize them.",
    <>For more project ideas, check the community showcase: <a href="https://www.flutterflow.io/showcase" className="text-link" target="_blank" rel="noopener noreferrer">FlutterFlow Showcase</a>.</>
  ]

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <MotionReveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="chip" style={{ width: 'max-content', color: '#ffd700', border: '1px solid rgba(255, 215, 0, 0.3)', background: 'rgba(255, 215, 0, 0.12)' }}>
            Module 3 — Chapter 3.1 · Page 1
          </span>
          <h1 style={{
            fontSize: 'clamp(2.6rem, 5vw, 3.8rem)', fontWeight: 800,
            lineHeight: 1.1, marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #ffd700, #ff2d55, #7b2ff7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            List of Projects to Build in FlutterFlow
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#c8c8e0', lineHeight: 1.8, maxWidth: '760px', marginBottom: '1.5rem' }}>
            Choose a project and follow a guided tutorial. These picks are optimized for beginners and help you practice UI, navigation, and data handling.
          </p>
        </div>
      </MotionReveal>

      <div className="h-scroll-rail" style={{ marginTop: '2rem' }}>
        {projectIdeas.map((project, i) => {
          const hue = (i * 40 + 50) % 360
          const accent = `hsl(${hue}, 75%, 55%)`
          return (
            <MotionReveal key={project.title} delay={i * 0.05}>
              <TiltCard
                accent={accent}
                className="gsap-child"
                style={{
                  width: '300px',
                  minHeight: '220px',
                  scrollSnapAlign: 'start',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '2.1rem', marginBottom: '1.1rem' }}>{project.icon}</div>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.7rem', fontWeight: 700 }}>{project.title}</h3>
                  <p style={{ color: '#c8c8e0', fontSize: '0.98rem', lineHeight: 1.6 }}>{project.desc}</p>
                </div>
                {project.links?.length ? (
                  <div style={{ marginTop: '1.2rem', display: 'grid', gap: '0.5rem' }}>
                    {project.links.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="arrow-link" style={{ fontSize: '0.9rem' }}>
                        {link.label} <span>→</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </TiltCard>
            </MotionReveal>
          )
        })}
      </div>

      <div style={{ marginTop: '4rem' }}>
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700,
            color: '#fff', marginBottom: '0.75rem'
          }}>
            Other Beginner Series and Playlists
          </h2>
          <p style={{ color: '#b0b0cc', fontSize: '1rem', marginBottom: '1.8rem', maxWidth: '760px' }}>
            Prefer a guided path? These channels and playlists walk you through multiple starter projects.
          </p>
        </MotionReveal>

        <div className="chapter-grid">
          {beginnerSeries.map((item, i) => (
            <MotionReveal key={item.title} delay={i * 0.05}>
              <NeumorphicCard
                icon={(i + 1)}
                className="gsap-child"
              >
                <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.6rem', fontWeight: 700 }}>{item.title}</h3>
                <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6 }}>{item.desc}</p>
                <div style={{ marginTop: '1rem' }}>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="arrow-link" style={{ fontSize: '0.9rem' }}>
                    Open Playlist <span>→</span>
                  </a>
                </div>
              </NeumorphicCard>
            </MotionReveal>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '3.5rem' }}>
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700,
            color: '#fff', marginBottom: '0.75rem'
          }}>
            Tips for Beginners
          </h2>
        </MotionReveal>
        <MotionReveal>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '1.6rem'
          }}>
            <BulletList items={tips} />
          </div>
        </MotionReveal>
      </div>
    </div>
  )
}

function PageWhatIsProject() {
  const packageSections = [
    {
      title: 'UI and Styling',
      items: [
        { name: 'auto_size_text', href: 'https://pub.dev/packages/auto_size_text', desc: 'Automatically resizes text to fit within its bounds.' },
        { name: 'cached_network_image', href: 'https://pub.dev/packages/cached_network_image', desc: 'Provides a widget that displays images from the internet, caching them for performance.' },
        { name: 'flutter_animate', href: 'https://pub.dev/packages/flutter_animate', desc: 'Facilitates adding animations to widgets.' },
        { name: 'font_awesome_flutter', href: 'https://pub.dev/packages/font_awesome_flutter', desc: 'Offers a comprehensive set of icons provided by FontAwesome.' },
        { name: 'from_css_color', href: 'https://pub.dev/packages/from_css_color', desc: 'Converts CSS color strings to Flutter color objects.' },
        { name: 'google_fonts', href: 'https://pub.dev/packages/google_fonts', desc: 'Enables custom fonts to be used easily from the Google Fonts catalog.' },
        { name: 'page_transition', href: 'https://pub.dev/packages/page_transition', desc: 'Adds customizable page transition effects.' },
      ]
    },
    {
      title: 'Navigation',
      items: [
        { name: 'go_router', href: 'https://pub.dev/packages/go_router', desc: 'A declarative router based on URL patterns, simplifying navigation logic.' },
      ],
      extra: (
        <a href="https://www.youtube.com/watch?v=FEulLd7YaNc&list=PLsUp7t2vRqx-xMe6gucpfjeDgIj0tJRIm&index=4" className="text-link" target="_blank" rel="noopener noreferrer">
          Color | Importing, AI Generation, Testing | FlutterFlow University
        </a>
      )
    },
    {
      title: 'Data Management and Storage',
      items: [
        { name: 'collection', href: 'https://pub.dev/packages/collection', desc: 'Provides additional collection types and utilities.' },
        { name: 'json_path', href: 'https://pub.dev/packages/json_path', desc: 'Allows querying JSON data structures with path expressions.' },
        { name: 'provider', href: 'https://pub.dev/packages/provider', desc: 'A popular state management technique to propagate changes across the app.' },
        { name: 'shared_preferences', href: 'https://pub.dev/packages/shared_preferences', desc: 'Facilitates persistent storage of simple data (key-value pairs).' },
      ]
    },
    {
      title: 'Platform Specific Integrations',
      items: [
        { name: 'path_provider', href: 'https://pub.dev/packages/path_provider', desc: 'Locates commonly used locations on the filesystem.' },
        {
          label: (
            <>
              <a href="https://pub.dev/packages/path_provider_android" className="text-link" target="_blank" rel="noopener noreferrer">path_provider_android</a>,{' '}
              <a href="https://pub.dev/packages/path_provider_foundation" className="text-link" target="_blank" rel="noopener noreferrer">path_provider_foundation</a>,{' '}
              <a href="https://pub.dev/packages/path_provider_platform_interface" className="text-link" target="_blank" rel="noopener noreferrer">path_provider_platform_interface</a>
            </>
          ),
          desc: 'Platform-specific implementations and interface for path_provider.'
        },
        {
          label: (
            <>
              <a href="https://pub.dev/packages/shared_preferences_android" className="text-link" target="_blank" rel="noopener noreferrer">shared_preferences_android</a>,{' '}
              <a href="https://pub.dev/packages/shared_preferences_foundation" className="text-link" target="_blank" rel="noopener noreferrer">shared_preferences_foundation</a>,{' '}
              <a href="https://pub.dev/packages/shared_preferences_platform_interface" className="text-link" target="_blank" rel="noopener noreferrer">shared_preferences_platform_interface</a>,{' '}
              <a href="https://pub.dev/packages/shared_preferences_web" className="text-link" target="_blank" rel="noopener noreferrer">shared_preferences_web</a>
            </>
          ),
          desc: 'Platform-specific implementations for shared_preferences.'
        },
        {
          label: (
            <>
              <a href="https://pub.dev/packages/url_launcher" className="text-link" target="_blank" rel="noopener noreferrer">url_launcher</a>,{' '}
              <a href="https://pub.dev/packages/url_launcher_android" className="text-link" target="_blank" rel="noopener noreferrer">url_launcher_android</a>,{' '}
              <a href="https://pub.dev/packages/url_launcher_ios" className="text-link" target="_blank" rel="noopener noreferrer">url_launcher_ios</a>,{' '}
              <a href="https://pub.dev/packages/url_launcher_platform_interface" className="text-link" target="_blank" rel="noopener noreferrer">url_launcher_platform_interface</a>
            </>
          ),
          desc: 'Packages that enable launching URLs on various platforms, allowing the app to open web links, emails, and more.'
        },
      ]
    },
    {
      title: 'Utilities',
      items: [
        { name: 'intl', href: 'https://pub.dev/packages/intl', desc: 'Provides internationalization and localization facilities, including message translation, plurals and genders, and date/number formatting.' },
        { name: 'flutter_cache_manager', href: 'https://pub.dev/packages/flutter_cache_manager', desc: 'Manages cached files, supporting custom file retrieval strategies and cache rules.' },
        { name: 'timeago', href: 'https://pub.dev/packages/timeago', desc: 'A library to format dates as a relative time (e.g., "5 minutes ago").' },
      ]
    },
  ]

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '40px' }}>
      <MotionReveal>
        <span className="chip" style={{ color: '#00f5d4' }}>Module 3 — Chapter 3.1 · Page 2</span>
        <h1 className="sec-title">What is a Project?</h1>
        <p className="sec-desc">
          A Project in FlutterFlow represents a complete Flutter application. It contains all the generated code for a Flutter app. This means that you can export your code and your app will run as a normal Flutter app without requiring FlutterFlow.
        </p>
      </MotionReveal>

      <MotionReveal>
        <p style={{ color: '#c8c8e0', fontSize: '1.02rem', lineHeight: 1.8, maxWidth: '980px', marginBottom: '2rem' }}>
          A FlutterFlow project includes all the files and packages generated by the <code>flutter create</code> command, along with additional packages specifically added to support common functionalities. These include:
        </p>
      </MotionReveal>

      <div className="h-scroll-rail" style={{ marginTop: '2rem' }}>
        {packageSections.map((section, i) => (
          <MotionReveal key={section.title} delay={i * 0.05}>
            <NeonCard
              className="gsap-child"
              style={{
                width: '340px',
                scrollSnapAlign: 'start',
              }}
            >
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.2rem', fontWeight: 700 }}>{section.title}</h3>
                <ul style={{ listStyle: 'none', display: 'grid', gap: '0.6rem', padding: 0, margin: 0 }}>
                  {section.items.map((item, idx) => (
                    <li key={idx} style={{ color: '#c8c8e0', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {item.label ? item.label : (
                        <a href={item.href} className="text-link" target="_blank" rel="noopener noreferrer">{item.name}</a>
                      )}
                      <span style={{ color: '#a9a9c6' }}>: {item.desc}</span>
                    </li>
                  ))}
                </ul>
                {section.extra && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    {section.extra}
                  </div>
                )}
              </div>
            </NeonCard>
          </MotionReveal>
        ))}
      </div>

      <MotionReveal>
        <div style={{ marginTop: '2.5rem' }}>
          <CalloutCard tone="note" title="Included in Generated Code">
            Any elements (e.g. pages, widgets), business logic, or packages that are added to the project will be included in the generated code.
          </CalloutCard>
        </div>
      </MotionReveal>

      <MotionReveal>
        <div style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.6rem' }}>Generated Code</h2>
          <p style={{ color: '#b0b0cc', fontSize: '0.98rem', lineHeight: 1.7, maxWidth: '880px' }}>
            FlutterFlow automatically generates a complete Flutter application for you. To dive deeper into the project structure of a Flutter app generated by FlutterFlow, explore the{' '}
            <a href="https://docs.flutterflow.io/generated-code/project-structure" className="text-link" target="_blank" rel="noopener noreferrer">Directory Structure</a> guide.
          </p>
        </div>
      </MotionReveal>
    </div>
  )
}


function PageHowToCreate() {
  const [activeStep, setActiveStep] = useState(0)
  
  const creationFlow = [
    {
      title: 'Initialize Workspace',
      time: 'Phase 01',
      desc: 'Go to the Dashboard and click the Create New button in the upper right corner to begin the project scaffolding process.',
      accent: '#00f5d4',
      media: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316144909-2.png'
    },
    {
      title: 'Template or Blank',
      time: 'Phase 02',
      desc: 'The Create Project wizard opens. Here you decide whether to accelerate development using a pre-configured template or start from an entirely blank canvas.',
      accent: '#7b2ff7',
      media: null
    },
    {
      title: 'Define Parameters',
      time: 'Phase 03',
      desc: 'Name the project entity. You can optionally complete the 3-step Project Setup wizard immediately, or skip and handle Firebase/Supabase connections later in Settings.',
      accent: '#ff2d55',
      media: null
    }
  ]

  const orgTechniques = [
    { title: 'Creating Tags', desc: 'Click the orange Tag button or access via project panel dots to mint new categories.', link: 'https://demo.arcade.software/VqTlm9OtL3Zfev5BWtoj?embed&show_copy_link=true', color: '#ff9a5c' },
    { title: 'Assigning Tags', desc: 'Map a single category tag to any project to sort it efficiently.', link: 'https://demo.arcade.software/6JYcGUZ1RuWkjf7TddxR?embed&show_copy_link=true', color: '#a67cff' },
    { title: 'Search & Filter', desc: 'Combine global string searches with Tag filters to isolate specific scopes.', link: 'https://demo.arcade.software/zxnnkwJDaB6BHFNEEZY1?embed&show_copy_link=true', color: '#00f5d4' },
    { title: 'Editing Tags', desc: 'Click the gear icon within the label menu to universally rename or destroy existing tags.', link: 'https://demo.arcade.software/qmWRdELTRb5YCM1Bb2oe?embed&show_copy_link=true', color: '#ff2d55' }
  ]

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <MotionReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span className="chip" style={{ color: '#00ccff', border: '1px solid rgba(0, 204, 255, 0.3)', background: 'rgba(0, 204, 255, 0.12)' }}>
            Module 3 — Chapter 3.1 · Page 3
          </span>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(0,204,255,0.3) 0%, transparent 100%)' }} />
        </div>
        <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>Creating & Organizing</h1>
        <p className="sec-desc">
          Before building screens, you need to spin up the foundational project architecture. This section covers generating new workspaces and utilizing taxonomy (tags & scopes) to keep your multi-project ecosystem pristine.
        </p>
      </MotionReveal>

      {/* Vertical Interactive Timeline */}
      <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <MotionReveal>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', textAlign: 'center', marginBottom: '3rem' }}>Project Genesis Timeline</h2>
        </MotionReveal>
        
        <div className="timeline-container" style={{ position: 'relative', maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '40px 1fr', gap: '2rem' }}>
          {/* Axis Line */}
          <div style={{ position: 'absolute', left: '19px', top: '24px', bottom: '24px', width: '2px', background: 'rgba(255,255,255,0.08)', zIndex: 0 }} />
          
          {creationFlow.map((step, i) => {
            const isActive = activeStep === i
            return (
              <React.Fragment key={step.time}>
                {/* Node */}
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <button 
                    onClick={() => setActiveStep(i)}
                    style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: isActive ? `${step.accent}22` : 'rgba(15,18,30,1)',
                      border: `2px solid ${isActive ? step.accent : 'rgba(255,255,255,0.15)'}`,
                      color: isActive ? step.accent : '#8892b0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive ? `0 0 20px ${step.accent}44` : 'none'
                    }}
                  >
                    {i+1}
                  </button>
                </div>
                
                {/* Content */}
                <div style={{ paddingTop: '1.5rem' }}>
                  <motion.div 
                    initial={{ opacity: 0.6, x: 10 }}
                    animate={{ opacity: isActive ? 1 : 0.6, x: isActive ? 0 : 10, scale: isActive ? 1.02 : 1 }}
                    style={{
                      padding: '2rem',
                      borderRadius: '24px',
                      background: isActive ? `linear-gradient(145deg, ${step.accent}12 0%, rgba(10,12,24,0.9) 100%)` : 'rgba(10,12,24,0.5)',
                      border: `1px solid ${isActive ? `${step.accent}44` : 'rgba(255,255,255,0.05)'}`,
                      transition: 'all 0.4s ease'
                    }}
                  >
                    <div style={{ color: step.accent, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {step.time}
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>{step.title}</h3>
                    <p style={{ color: '#aeb7cf', lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>{step.desc}</p>
                    
                    {step.media && isActive && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '1.5rem', borderRadius: '16px', overflow: 'hidden', border: `1px solid rgba(255,255,255,0.1)` }}>
                        <img src={step.media} alt={step.title} style={{ width: '100%', display: 'block' }} />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Organization Scopes - Bento Box Style */}
      <div style={{ marginTop: '7rem' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Workspace Management</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '700px', margin: '0 auto' }}>
              As your portfolio scales, utilize powerful filtering scopes and associative tags to parse your dashboard.
            </p>
          </div>
        </MotionReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Scope Card */}
          <MotionReveal delay={0.1}>
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(20,22,40,0.9) 0%, rgba(10,12,20,0.95) 100%)', 
              padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)',
              height: '100%'
            }}>
               <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1.5rem' }}>Directory Scopes</h3>
               <BulletList items={[
                 'My Private Projects: Exclusively yours.',
                 'My Shared Projects: Projects you own but granted access to others.',
                 'Shared With Me: Collaborative workspaces owned by external accounts.'
               ]} dense />
               <div style={{ marginTop: '2rem' }}>
                 <a href="https://demo.arcade.software/INHhbP1PuCupUSWW3aTG?embed&show_copy_link=true" className="arrow-link" target="_blank" rel="noopener noreferrer">Filter Demo <span>→</span></a>
               </div>
            </div>
          </MotionReveal>

          {/* Search Card */}
          <MotionReveal delay={0.2}>
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(0,245,212,0.1) 0%, rgba(10,12,20,0.95) 80%)', 
              padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(0,245,212,0.2)',
              height: '100%'
            }}>
               <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>Global Search</h3>
               <p style={{ color: '#aeb7cf', lineHeight: 1.7, marginBottom: '2rem' }}>
                 Quickly locate specific architectural spikes or production apps by name across thousands of isolated resources.
               </p>
               <a href="https://demo.arcade.software/KWGdRdptt18rissIt8SQ?embed&show_copy_link=true" className="arrow-link" target="_blank" rel="noopener noreferrer">Search Demo <span>→</span></a>
            </div>
          </MotionReveal>
        </div>

        {/* Tags Masonry */}
        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {orgTechniques.map((tech, i) => (
             <MotionReveal key={tech.title} delay={i * 0.1}>
               <FeatureCard 
                 title={tech.title} 
                 desc={tech.desc} 
                 accent={tech.color}
                 icon={i === 0 ? '+' : i === 1 ? '🏷️' : i === 2 ? '🔍' : '⚙️'}
               />
               <div style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
                 <a href={tech.link} className="arrow-link" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem' }}>View Guide <span>→</span></a>
               </div>
             </MotionReveal>
          ))}
        </div>
      </div>

    </div>
  )
}

function PageRunAndTest() {
  const [activeMode, setActiveMode] = useState(0)

  const modes = [
    {
      title: 'Preview Mode',
      accent: '#4361ee',
      desc: 'The fastest feedback loop. Bypasses compiling completely. It injects your current widget tree directly into a virtual web DOM frame to simulate the UI layout, scaling, and responsiveness without executing actual backend queries or logic.',
      link: 'https://docs.flutterflow.io/testing/run-your-app#preview-mode',
      features: ['Instant rendering', 'UI/UX validation', 'Device size toggling', 'No real data fetching']
    },
    {
      title: 'Test Mode',
      accent: '#00f5d4',
      desc: "The gold standard during development. Spins up a web build featuring Flutter's iconic Hot Reload. Whenever you save layout or logic changes in the builder, the Test Mode session seamlessly injects the diffs without losing session state or requiring a hard refresh.",
      link: 'https://docs.flutterflow.io/testing/run-your-app#test-mode',
      features: ['Hot Reload enabled', 'Live Firebase data', 'State preservation', 'Console debugging']
    },
    {
      title: 'Run Mode',
      accent: '#ff2d55',
      desc: 'Generates a fully compiled, optimized web application. This is the closest representation to a deployed web app. While it takes longer to compile (2-4 minutes), it accurately reflects production performance and network behavior.',
      link: 'https://docs.flutterflow.io/testing/run-your-app#run-mode',
      features: ['Production compilation', 'Accurate performance', 'Sharable URLs', 'Final QA target']
    },
    {
      title: 'Local Run',
      accent: '#f59e0b',
      desc: 'Executes the codebase natively on your local machine using actual iOS Simulator or Android Emulator binaries. Critical for testing native device hardware APIs (Camera, GPS, Bluetooth) that cannot be mocked properly in a web browser sandbox.',
      link: 'https://docs.flutterflow.io/testing/local-run',
      features: ['Native execution', 'Hardware API access', 'Local logging', 'True mobile behavior']
    }
  ]

  const active = modes[activeMode]

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <MotionReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <span className="chip" style={{ color: '#ff2d55', border: '1px solid rgba(255, 45, 85, 0.3)', background: 'rgba(255, 45, 85, 0.12)' }}>
            Module 3 — Chapter 3.1 · Page 4
          </span>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(255,45,85,0.3) 0%, transparent 100%)' }} />
        </div>
        <h1 className="sec-title" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>Run & Test Infrastructure</h1>
        <p className="sec-desc">
          Validating behavior across form factors and runtimes is critical. FlutterFlow provides tiered compilation modes, ranging from instantaneous UI paints to full native hardware emulation.
        </p>
      </MotionReveal>

      <div style={{ marginTop: '4rem' }}>
        <MotionReveal>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 350px) 1fr',
            gap: '2rem',
            background: 'linear-gradient(180deg, rgba(12,14,28,0.8) 0%, rgba(8,10,20,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '32px',
            padding: '2rem',
            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
            minHeight: '600px',
            alignItems: 'stretch'
          }}>
            {/* Sidebar Navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '2rem' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8892b0', fontWeight: 700, marginBottom: '1rem', paddingLeft: '1rem' }}>
                Test Environments
              </div>
              
              {modes.map((mode, i) => {
                const isSelected = activeMode === i
                return (
                  <button
                    key={mode.title}
                    onClick={() => setActiveMode(i)}
                    style={{
                      textAlign: 'left',
                      padding: '1.25rem 1.5rem',
                      borderRadius: '16px',
                      background: isSelected ? `${mode.accent}15` : 'transparent',
                      border: `1px solid ${isSelected ? `${mode.accent}50` : 'transparent'}`,
                      color: isSelected ? '#fff' : '#8892b0',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {isSelected && (
                      <motion.div layoutId="activeModeIndicator" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: mode.accent }} />
                    )}
                    <div style={{ fontSize: '1.15rem', fontWeight: isSelected ? 800 : 600, transition: 'color 0.3s ease', color: isSelected ? '#fff' : '#aeb7cf' }}>
                      {mode.title}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Dynamic Stage */}
            <div style={{ padding: '1rem 1rem 1rem 2rem', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.title}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${active.accent}20`, border: `1px solid ${active.accent}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: active.accent, boxShadow: `0 0 15px ${active.accent}` }} />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', color: '#fff', margin: 0 }}>{active.title}</h2>
                  </div>

                  <p style={{ color: '#d3d9ea', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '700px' }}>
                    {active.desc}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: 'auto' }}>
                    {active.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: active.accent, fontSize: '1.2rem' }}>✓</div>
                        <div style={{ color: '#c8c8e0', fontSize: '0.95rem', fontWeight: 500 }}>{feat}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <a 
                      href={active.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
                        padding: '1rem 2rem', borderRadius: '999px',
                        background: `${active.accent}15`, border: `1px solid ${active.accent}40`,
                        color: active.accent, textDecoration: 'none', fontWeight: 700,
                        transition: 'all 0.2s ease', cursor: 'pointer'
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = `${active.accent}25`; e.currentTarget.style.transform = 'translateY(-2px)' }}
                      onMouseOut={e => { e.currentTarget.style.background = `${active.accent}15`; e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                      Read Documentation <span>→</span>
                    </a>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </MotionReveal>
      </div>

    </div>
  )
}

function PageGeneralSettings() {
  const [activeAsset, setActiveAsset] = useState(0)

  const downloadSettings = [
    'Run dart fix: Enabling this will run the dart fix command when downloading the code. This makes the generated code cleaner and potentially more performant.',
    'Download Unused Project Assets: Enable this option to download all assets, including those that are not currently used in the project.',
  ]

  const appDetailsConfig = [
    { title: 'Project Details', desc: 'Change project name, package name, and store display name.', icon: '📝' },
    { title: 'Initial Page', desc: 'Configure Entry Page and Logged In Page routing paths.', icon: '🚪' },
    { title: 'Folder Tracking', desc: 'Enable Updated Folder Organization for cleaner file tree structure.', icon: '📁' },
    { title: 'Deep Linking', desc: 'Configure global navigation behavior and deep link interceptors.', icon: '🔗' },
  ]

  const assetShowcase = [
    { 
      title: 'Splash Screen', 
      accent: '#ffd700', 
      image: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316144959-3.png', 
      desc: 'Controls startup visuals like image fit, duration, and dimensions.', 
      steps: ['Navigate to App Assets', 'Upload under Splash section', 'Configure Min Duration (ms)', 'Set Background Color'] 
    },
    { 
      title: 'Launcher Icon', 
      accent: '#00f5d4', 
      image: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316144959-4.png', 
      desc: 'Defines how your app appears in device launchers and app lists natively.', 
      steps: ['Navigate to Launcher Icon', 'Upload a high-res image', 'Run flutter_launcher_icons:main', 'Deploy to verify'] 
    },
    { 
      title: 'Adaptive Icon', 
      accent: '#ff2d55', 
      image: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316144959-4.png', 
      desc: 'Combines foreground and background layers for clean adaptation across Android launchers.', 
      steps: ['Create adaptive layers', 'Upload Foreground Icon', 'Upload Background Asset', 'Regenerate configurations'] 
    }
  ]

  const active = assetShowcase[activeAsset]

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px', overflow: 'hidden' }}>
      <MotionReveal>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '0 5%' }}>
          <span className="chip" style={{ color: '#ffd700', border: '1px solid rgba(255, 215, 0, 0.3)', background: 'rgba(255, 215, 0, 0.12)' }}>
            Module 3 — Chapter 3.1 · Page 5
          </span>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(255,215,0,0.3) 0%, transparent 100%)' }} />
        </div>
        <h1 className="sec-title" style={{ padding: '0 5%', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>General Settings</h1>
        <p className="sec-desc" style={{ padding: '0 5%' }}>
          The centralized control panel for your app's core identity, default routing behaviors, compiled downloading parameters, and crucial visual assets.
        </p>
      </MotionReveal>

      {/* Horizontal Scroll Snap Section */}
      <div style={{ marginTop: '5rem' }}>
        <MotionReveal>
          <div style={{ padding: '0 5%', marginBottom: '2rem' }}>
             <h2 style={{ fontSize: '1.8rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
               <span style={{ color: '#00f5d4', background: 'rgba(0,245,212,0.15)', padding: '0.4rem', borderRadius: '8px' }}>🚀</span>
               Core Configurations
             </h2>
             <p style={{ color: '#b0b0cc', marginTop: '0.5rem', fontSize: '1.05rem' }}>Swipe horizontally to explore foundational app settings.</p>
          </div>
        </MotionReveal>

        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          padding: '0 5% 2rem 5%', 
          overflowX: 'auto', 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none' /* Hide scrollbar for clean carousel look */
        }}>
          {appDetailsConfig.map((item, i) => (
             <motion.div 
               key={item.title}
               whileHover={{ y: -8, scale: 1.02 }}
               style={{ 
                 scrollSnapAlign: 'start',
                 flex: '0 0 300px',
                 background: 'linear-gradient(160deg, rgba(20,22,40,0.95) 0%, rgba(10,12,24,0.98) 100%)',
                 border: '1px solid rgba(255,255,255,0.08)',
                 borderRadius: '24px',
                 padding: '2rem',
                 position: 'relative',
                 overflow: 'hidden'
               }}
             >
                <div style={{ 
                  position: 'absolute', top: '-10px', right: '-10px', 
                  fontSize: '6rem', opacity: 0.05, filter: 'blur(2px)' 
                }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{item.icon}</div>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.8rem' }}>{item.title}</h3>
                <p style={{ color: '#aeb7cf', lineHeight: 1.6, fontSize: '0.95rem' }}>{item.desc}</p>
             </motion.div>
          ))}
          
          <motion.div 
             whileHover={{ y: -8, scale: 1.02 }}
             style={{ 
               scrollSnapAlign: 'start',
               flex: '0 0 380px',
               background: 'linear-gradient(160deg, rgba(0,245,212,0.12) 0%, rgba(10,12,24,0.98) 100%)',
               border: '1px solid rgba(0,245,212,0.25)',
               borderRadius: '24px',
               padding: '2rem'
             }}
          >
              <h3 style={{ color: '#00f5d4', fontSize: '1.4rem', marginBottom: '1.2rem' }}>Download Settings</h3>
              <ul style={{ color: '#c8c8e0', fontSize: '0.9rem', paddingLeft: '1.2rem', margin: 0, display: 'grid', gap: '1rem', lineHeight: 1.6 }}>
                {downloadSettings.map((li, idx) => <li key={idx}>{li}</li>)}
              </ul>
          </motion.div>
        </div>
      </div>

      {/* Asset Explorer Feature */}
      <div style={{ marginTop: '7rem', padding: '0 5%' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '1rem' }}>App Asset Explorer</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '700px', margin: '0 auto' }}>
              Select an asset type below to view its role within the application lifecycle and configuration steps.
            </p>
          </div>
        </MotionReveal>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(250px, 300px) 1fr', 
          gap: '2.5rem',
          alignItems: 'start' 
        }}>
          {/* Asset Navigation Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {assetShowcase.map((asset, i) => {
              const focus = activeAsset === i
              return (
                <button
                  key={asset.title}
                  onClick={() => setActiveAsset(i)}
                  style={{
                    textAlign: 'left',
                    padding: '1.5rem',
                    borderRadius: '24px',
                    border: `1px solid ${focus ? asset.accent : 'rgba(255,255,255,0.05)'}`,
                    background: focus ? `linear-gradient(135deg, ${asset.accent}22 0%, ${asset.accent}05 100%)` : 'rgba(255,255,255,0.02)',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: focus ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: focus ? `0 15px 35px ${asset.accent}20` : 'none'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{asset.title}</div>
                  <div style={{ fontSize: '0.85rem', color: focus ? '#e0e0e0' : '#8892b0', lineHeight: 1.5 }}>
                    {asset.desc}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Asset Viewer Glass Panel */}
          <div style={{ position: 'relative' }}>
             <AnimatePresence mode="wait">
               <motion.div
                 key={active.title}
                 initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                 animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                 exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                 transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                 style={{
                   background: 'rgba(10,12,25,0.7)',
                   backdropFilter: 'blur(20px)',
                   border: `1px solid rgba(255,255,255,0.1)`,
                   borderTop: `1px solid ${active.accent}60`,
                   borderRadius: '32px',
                   padding: '2.5rem',
                   boxShadow: `0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 ${active.accent}30`
                 }}
               >
                 <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: active.accent, fontWeight: 700, marginBottom: '1rem' }}>
                        Configuration Workflow
                      </div>
                      <h3 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '1.5rem' }}>{active.title} setup</h3>
                      
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {active.steps.map((step, idx) => (
                           <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                              <div style={{ 
                                width: '24px', height: '24px', borderRadius: '50%', 
                                background: `${active.accent}15`, color: active.accent, 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                fontSize: '0.8rem', fontWeight: 700, flexShrink: 0, marginTop: '2px'
                              }}>
                                {idx + 1}
                              </div>
                              <div style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6 }}>{step}</div>
                           </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ flex: '0 0 320px' }}>
                      <div style={{ 
                        borderRadius: '20px', overflow: 'hidden', 
                        border: `1px solid ${active.accent}40`,
                        boxShadow: `0 20px 40px ${active.accent}15`
                      }}>
                         <img src={active.image} alt={active.title} style={{ width: '100%', display: 'block' }} />
                      </div>
                    </div>
                 </div>
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  )
}

function PageProjectSetup() {
  const [openFaq, setOpenFaq] = useState('misalign')

  const permissionModes = [
    { title: 'Permission Messages', accent: '#ffd700', desc: 'Replace default prompts with human-readable consent copy.' },
    { title: 'Custom Permissions', accent: '#00f5d4', desc: 'Manually define iOS/Android keys for advanced hardware access.' },
    { title: 'Request Action', accent: '#ff2d55', desc: 'Trigger runtime prompts and branch logic on acceptance/rejection.' }
  ]

  const platformSettings = [
    { platform: 'Android', target: 'Kotlin 1.9+', sdk: 'API 34', desc: 'Advanced Gradle configurations and compilation tuning.' },
    { platform: 'iOS', target: 'iOS 14.0+', sdk: 'Swift 5', desc: 'Deployment targets and iPad universal layout compliance.' },
    { platform: 'Web', target: 'CanvasKit', sdk: 'Wasm', desc: 'Hardware-accelerated rendering engine selection.' }
  ]

  const walkthroughStages = [
    { id: '1', title: 'Compose Tour', icon: '🎨', link: 'https://www.loom.com/embed/cc0e2560855d4e988a6b881ca1b63377?sid=8f959be3-b08a-4043-a3df-bea460297b2a' },
    { id: '2', title: 'Start Action', icon: '🚀', link: 'https://www.loom.com/embed/13ff22ea7a624d54b3874256fac88b9c?sid=91ed6db7-8e16-4464-a133-b532846eaa36' },
    { id: '3', title: 'Completion Logic', icon: '⚡', link: 'https://www.loom.com/embed/53546557a01d4e65864f997467cea6ad?sid=f8f999ae-97cc-4a96-9b8a-7736a6561907' }
  ]

  const faqItems = [
    {
      id: 'misalign',
      question: 'Walkthrough highlights the wrong spot?',
      answer: <p style={{ color: '#c8c8e0', lineHeight: 1.75, margin: 0 }}>Add a Wait action before starting the walkthrough to allow widget animations to finish painting the DOM.</p>
    },
    {
      id: 'scroll',
      question: 'Off-screen widget will not highlight?',
      answer: <p style={{ color: '#c8c8e0', lineHeight: 1.75, margin: 0 }}>Ensure the target widget is visible without scrolling when the walkthrough activates.</p>
    }
  ]

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '0', overflowX: 'hidden' }}>
      {/* Immersive Header */}
      <div style={{ padding: '0 5%', marginBottom: '4rem' }}>
        <MotionReveal>
          <span style={{ 
            display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '30px', 
            background: 'linear-gradient(90deg, #ff2d55 0%, #a67cff 100%)', color: '#fff', 
            fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1.5rem',
            boxShadow: '0 10px 25px rgba(255,45,85,0.3)'
          }}>
            Module 3 — Chapter 3.1 · Page 6
          </span>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', color: '#fff', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            System <br/><span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.6)' }}>Architecture</span>
          </h1>
          <p style={{ color: '#b0b0cc', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '600px' }}>
            Finalize structural requirements before compiling. Manage hardware permissions, define platform constraints, and architect user onboarding flows.
          </p>
        </MotionReveal>
      </div>

      {/* Permissions Band - Floating Overlays Layout */}
      <div style={{ position: 'relative', width: '100%', padding: '6rem 5%', background: 'linear-gradient(180deg, rgba(8,10,24,0) 0%, rgba(15,18,36,0.9) 100%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
         <MotionReveal>
           <h2 style={{ fontSize: '3rem', color: '#fff', opacity: 0.1, position: 'absolute', top: '2rem', left: '5%', fontWeight: 900, letterSpacing: '0.2em' }}>
             01 PERMISSIONS
           </h2>
           <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(350px, 500px)', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <div>
                <h3 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1.5rem' }}>Hardware Consent</h3>
                <p style={{ color: '#aeb7cf', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '3rem' }}>
                  Modern operating systems rigorously protect user privacy. Define the exact moment your app requests access to cameras, microphones, or location data, and tailor the consent copy to match your brand voice.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   {permissionModes.map((mode, i) => (
                     <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', borderLeft: `4px solid ${mode.accent}` }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${mode.accent}22`, color: mode.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          {i+1}
                        </div>
                        <div>
                          <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.3rem' }}>{mode.title}</h4>
                          <p style={{ color: '#8892b0', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>{mode.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(circle at center, rgba(0,245,212,0.15) 0%, transparent 70%)', filter: 'blur(20px)', zIndex: 0 }} />
                <img src="https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316145025-5.png" alt="Permissions" style={{ width: '100%', borderRadius: '24px', position: 'relative', zIndex: 1, border: '1px solid rgba(0,245,212,0.3)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }} />
              </div>
           </div>
         </MotionReveal>
      </div>

      {/* Platform Tuning - Data Table Specification Layout */}
      <div style={{ width: '100%', padding: '6rem 5%', background: '#0a0c16', position: 'relative' }}>
         <MotionReveal>
           <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
             <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1rem' }}>Compilation Targets</h2>
             <p style={{ color: '#8892b0', fontSize: '1.1rem' }}>Define low-level SDK constraints for native binaries.</p>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', overflow: 'hidden' }}>
             {platformSettings.map((plat) => (
                <div key={plat.platform} style={{ background: '#0d1020', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'background 0.3s ease' }} onMouseOver={e => e.currentTarget.style.background = '#151930'} onMouseOut={e => e.currentTarget.style.background = '#0d1020'}>
                   <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '0.1em' }}>{plat.platform}</h3>
                   
                   <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem' }}>
                     <span style={{ color: '#8892b0', fontSize: '0.9rem', textTransform: 'uppercase' }}>Language/Engine</span>
                     <span style={{ color: '#00f5d4', fontWeight: 700 }}>{plat.target}</span>
                   </div>
                   
                   <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
                     <span style={{ color: '#8892b0', fontSize: '0.9rem', textTransform: 'uppercase' }}>Max API Target</span>
                     <span style={{ color: '#ffd700', fontWeight: 700 }}>{plat.sdk}</span>
                   </div>

                   <p style={{ color: '#aeb7cf', fontSize: '0.95rem', lineHeight: 1.6 }}>{plat.desc}</p>
                </div>
             ))}
           </div>
         </MotionReveal>
      </div>

      {/* Cinematic Filmstrip - Walkthrough Studio */}
      <div style={{ width: '100%', padding: '6rem 0 8rem 0', background: 'linear-gradient(180deg, #0a0c16 0%, #05060a 100%)' }}>
         <MotionReveal>
           <div style={{ padding: '0 5%', marginBottom: '4rem' }}>
             <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: '1rem' }}>Walkthrough Studio</h2>
             <p style={{ color: '#8892b0', fontSize: '1.1rem', maxWidth: '600px' }}>Orchestrate interactive product tours to guide first-time users through complex app topology.</p>
           </div>
           
           <div style={{ display: 'flex', padding: '0 5%', gap: '2rem', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '2rem' }}>
              {walkthroughStages.map((stage) => (
                <div key={stage.id} style={{ scrollSnapAlign: 'start', flex: '0 0 400px', borderRadius: '24px', overflow: 'hidden', background: '#0a0c18', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                   <div style={{ height: '220px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                     {stage.icon}
                   </div>
                   <div style={{ padding: '2rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                       <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#4361ee', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{stage.id}</div>
                       <h3 style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>{stage.title}</h3>
                     </div>
                     <a href={stage.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', padding: '0.8rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.2s', fontWeight: 600 }}>Watch Workflow <span>↗</span></a>
                   </div>
                </div>
              ))}
           </div>
         </MotionReveal>

         {/* Minimalist FAQ */}
         <MotionReveal>
           <div style={{ padding: '4rem 5% 0 5%', maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '2rem', textAlign: 'center' }}>Troubleshooting</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {faqItems.map((faq) => {
                  const expanded = openFaq === faq.id
                  return (
                    <div key={faq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <button onClick={() => setOpenFaq(expanded ? null : faq.id)} style={{ width: '100%', padding: '1.5rem 0', background: 'transparent', border: 0, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', fontSize: '1.1rem', fontWeight: 600 }}>
                        {faq.question}
                        <span style={{ color: '#a67cff' }}>{expanded ? '−' : '+'}</span>
                      </button>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                             <div style={{ paddingBottom: '1.5rem' }}>{faq.answer}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
           </div>
         </MotionReveal>
      </div>
    </div>
  )
}

function PageDesignSystem() {
  const useCases = [
    'Enterprise Applications: Build a centralized design system for cohesive internal apps and brand consistency.',
    'Startup MVPs: Speed up MVP delivery by leveraging a pre-built design system library like shadcn.',
    'Cross-Platform Consistency: Ensure uniform design across iOS, Android, and Web with a platform-based design system.'
  ]

  const addDesignSystemSteps = [
    'Create the design system in a new FlutterFlow project.',
    'Publish it as a library.',
    'Import that library into the target project.',
    'Go to Theme Settings > Design System, click No Design System Selected, and pick the imported library.',
  ]

  const figmaSteps = [
    'Go to Theme Settings > Design System and click Connect To Figma.',
    'Authenticate your account and grant access to Figma.',
    'Paste your Figma file URL to fetch the theme.',
    'Map imported colors to project colors (filter mapped/unmapped as needed).',
    'Customize project typography using the imported text styles.',
  ]

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <MotionReveal>
        <span className="chip" style={{ color: '#00f5d4', border: '1px solid rgba(0, 245, 212, 0.3)', background: 'rgba(0, 245, 212, 0.1)' }}>
          Module 3 — Chapter 3.2 · Page 1
        </span>
        <h1 className="sec-title">Design System Redesigned</h1>
        <p className="sec-desc">
          A design system is a guideline to create a consistent UI/UX across the app. It includes colors, typography, fonts, icons, app assets, nav bar, app bar, and pre-designed components like buttons and text widgets.
        </p>
        <p style={{ color: '#c8c8e0', lineHeight: 1.7, maxWidth: '980px', fontSize: '1.05rem' }}>
          It is especially helpful in teams when multiple pages and features can drift into inconsistent styles. A shared design system keeps the experience cohesive.
        </p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <a href="https://youtu.be/moP9VtkoyjY" className="arrow-link" target="_blank" rel="noopener noreferrer">
            Intro to Design Systems | FlutterFlow University <span>→</span>
          </a>
        </div>
      </MotionReveal>

      {/* Core Integration Section */}
      <div style={{ marginTop: '5rem' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Establishing the Foundation</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto' }}>
              Import external designs or configure your native FlutterFlow library dependencies to start.
            </p>
          </div>
        </MotionReveal>

        <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          <MotionReveal delay={0.1}>
            <NeonCard accent="#00f5d4" style={{ height: '100%' }}>
              <div style={{ color: '#00f5d4', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.8rem' }}>
                Internal Libraries
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '0.8rem' }}>Adding Design System</h3>
              <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Add a design system from Library dependencies to serve as a central repository for design assets, components, and styles.
              </p>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>Use Cases</h4>
              <BulletList items={useCases} dense />
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>Implementation</h4>
                <StepsList steps={addDesignSystemSteps} dense />
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <a href="https://demo.arcade.software/G3PekDcZNsWYrKoz3xnE?embed&show_copy_link=true" className="arrow-link" target="_blank" rel="noopener noreferrer">
                  View Setup Demo <span>→</span>
                </a>
              </div>
            </NeonCard>
          </MotionReveal>

          <MotionReveal delay={0.2}>
            <NeonCard accent="#ffd700" style={{ height: '100%' }}>
              <div style={{ color: '#ffd700', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.8rem' }}>
                External Sync
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '0.8rem' }}>Import Figma Theme</h3>
              <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Bring your Figma design system directly into FlutterFlow to automatically import colors and typography variables.
              </p>
              <StepsList steps={figmaSteps} dense />
              <div style={{ marginTop: '1.5rem' }}>
                <CalloutCard tone="info" title="Global Variables">
                  All imported colors are automatically integrated and accessible anytime under Colors → Custom Colors.
                </CalloutCard>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="https://demo.arcade.software/84lqVC1ZDkq7EFFnCusm?embed&show_copy_link=true" className="arrow-link" target="_blank" rel="noopener noreferrer">
                  View Import Demo <span>→</span>
                </a>
                <a href="https://youtu.be/kWvWa5PSWhw" className="arrow-link" target="_blank" rel="noopener noreferrer">
                  Video Guide <span>→</span>
                </a>
              </div>
            </NeonCard>
          </MotionReveal>
        </div>
      </div>

      {/* Polish & Microinteractions */}
      <div style={{ marginTop: '6rem' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Global Micro-Polish</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto' }}>
              Ensure small details like scrollbars and loading states feel cohesive across the entire application interface.
            </p>
          </div>
        </MotionReveal>

        <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          <MotionReveal delay={0.1}>
            <HoloCard>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.6rem' }}>Loading Indicators</h3>
              <p style={{ color: '#c8c8e0', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                Customize the global progress indicators by choosing the type, color, and radius.
              </p>
              <CalloutCard tone="tip" title="Layout shifting">
                Avoid mis-sized loading indicators or components that cause jumping layouts. Match loading components to the dimensions of the content they replace.
              </CalloutCard>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="https://demo.arcade.software/6OiSlYPiCEY1p3fg0kpG?embed&show_copy_link=true" className="arrow-link" target="_blank" rel="noopener noreferrer">
                  View Demo <span>→</span>
                </a>
                <a href="https://youtu.be/3sG-O1lkv0M" className="arrow-link" target="_blank" rel="noopener noreferrer">
                  Deep Dive <span>→</span>
                </a>
              </div>
            </HoloCard>
          </MotionReveal>

          <MotionReveal delay={0.2}>
            <HoloCard>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.6rem' }}>Pull to Refresh</h3>
              <p style={{ color: '#c8c8e0', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                Customize the mobile pull-to-refresh indicator (loading circle) with custom color, background plate, and stroke width.
              </p>
              <CalloutCard tone="success" title="Tip">
                A branded pull-to-refresh spinner goes a long way in making an app feel premium and custom-built rather than generic.
              </CalloutCard>
              <div style={{ marginTop: '1.5rem' }}>
                <a href="https://demo.arcade.software/KHdvetH4Eg46TfDmZQUJ?embed&show_copy_link=true" className="arrow-link" target="_blank" rel="noopener noreferrer">
                  View Demo <span>→</span>
                </a>
              </div>
            </HoloCard>
          </MotionReveal>
        </div>

        <MotionReveal>
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1.5rem', textAlign: 'center' }}>Scrollbar Customization</h3>
            <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {[
                { title: 'Thumb Color', desc: 'Updates draggable scrollbar thumb.', img: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316152846-10.png' },
                { title: 'Thickness', desc: 'Adjusts width/height of scrollbar.', img: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316152846-11.png' },
                { title: 'Border Radius', desc: 'Controls thumb corner rounding.', img: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316152846-12.png' },
                { title: 'Min Length', desc: 'Sets minimum visible thumb size.', img: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316152846-13.png' },
              ].map((prop, i) => (
                <MotionReveal key={prop.title} delay={i * 0.05}>
                  <NeumorphicCard icon={(i + 1)} className="gsap-child" style={{ height: '100%' }}>
                    <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.4rem' }}>{prop.title}</h4>
                    <p style={{ color: '#c8c8e0', fontSize: '0.9rem', lineHeight: 1.5 }}>{prop.desc}</p>
                    {prop.img && (
                      <div className="step-media" style={{ marginTop: '0.8rem', borderRadius: '12px' }}>
                        <img src={prop.img} alt={prop.title} />
                      </div>
                    )}
                  </NeumorphicCard>
                </MotionReveal>
              ))}
            </div>
          </div>
        </MotionReveal>
      </div>

      {/* Color System */}
      <div style={{ marginTop: '6rem' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Color Pipeline</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto' }}>
              Bring in palettes seamlessly through direct UI, AI generation, or image extraction to craft the perfect atmosphere.
            </p>
          </div>
        </MotionReveal>

        <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {[
            {
              title: 'Add / Replace Colors',
              desc: 'Tweak the 16 predefined standard semantic colors or add completely custom tokens.',
              action: 'View Demos',
              links: [
                { href: 'https://demo.arcade.software/TM3a3VZXOAqip3SiayYS?embed&show_copy_link=true', label: 'Add Color' },
                { href: 'https://demo.arcade.software/l7w7ZcWyULeWPZ3isSSf?embed&show_copy_link=true', label: 'Update Color' }
              ]
            },
            {
              title: 'Explore Usage',
              desc: 'Scan your project for ad-hoc unlinked hex codes and instantly lift them into your global semantic palette.',
              action: 'View Demo',
              links: [{ href: 'https://demo.arcade.software/hisiTB9yPaaJCYQmHowL?embed&show_copy_link=true', label: 'Demo' }]
            },
            {
              title: 'Import from Coolors',
              desc: 'Found a perfect palette on Coolors.co? Just export the object code and paste it right into FlutterFlow.',
              action: 'View Demo',
              links: [{ href: 'https://demo.arcade.software/3DVzE5PVlDbxEm77zvI6?embed&show_copy_link=true', label: 'Demo' }]
            },
            {
              title: 'Extract from Image',
              desc: 'Upload a mood board or hero photo and let FlutterFlow isolate the dominant and accent colors automatically.',
              action: 'View Demo',
              links: [{ href: 'https://demo.arcade.software/ASEzke6PpaugRWSqRh3X?embed&show_copy_link=true', label: 'Demo' }]
            },
            {
              title: 'AI Generation',
              desc: 'Describe a feeling or scene (e.g. "Neon Cyberpunk Cafe") and AI will synthesize a complete dark/light palette.',
              action: 'View Guide',
              links: [{ href: 'https://www.loom.com/embed/629f5ee88e26466eaa07b956a7c8a963?sid=38a0ec79-0fa6-4de6-a5fe-58a016f40921', label: 'Video Guide' }]
            }
          ].map((item, i) => (
            <MotionReveal key={item.title} delay={i * 0.1}>
              <TiltCard accent={['#ff2d55', '#00f5d4', '#ffd700', '#a67cff', '#ff9f0a'][i % 5]} style={{ height: '100%' }}>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{item.desc}</p>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                  {item.links.map(link => (
                    <a key={link.label} href={link.href} className="arrow-link" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem' }}>
                      {link.label} <span>→</span>
                    </a>
                  ))}
                </div>
              </TiltCard>
            </MotionReveal>
          ))}
        </div>
      </div>

      {/* Typography & Icons */}
      <div style={{ marginTop: '6rem' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Typography & Assets</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto' }}>
              Shape your text with fluid responsive sizing and inject custom typography models or icon sets.
            </p>
          </div>
        </MotionReveal>
        
        <div style={{ display: 'grid', gap: '2rem' }}>
          <MotionReveal>
            <HoloCard style={{ padding: '2.5rem' }}>
              <div className="chapter-split" style={{ alignItems: 'center' }}>
                <div style={{ flex: 1.2 }}>
                  <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1rem' }}>Smarter Text Styles</h3>
                  <p style={{ color: '#d3d9ea', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                    Control your primary and secondary font families and configure everything from kerning to weights globally. Upgrade your fonts to be <strong>fully responsive</strong> so sizes expand or contract naturally on tablet and desktop surfaces.
                  </p>
                  <BulletList items={[
                    'Configure standard Display, Headline, Title, Body, and Label styles.',
                    'Create independent custom text classifications for unique UI elements.',
                    'Turn on responsive scaling for multi-form-factor builds.'
                  ]} dense />
                  <div style={{ marginTop: '1.5rem' }}>
                    <a href="https://demo.arcade.software/dVqO19q7mZlQZLpkdW9r?embed&show_copy_link=true" className="arrow-link" target="_blank" rel="noopener noreferrer">
                      Responsive Text Demo <span>→</span>
                    </a>
                  </div>
                </div>
                <div style={{ flex: 0.8 }}>
                  <div className="step-media" style={{ borderRadius: '20px' }}>
                    <img src="https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316152846-18.png" alt="Responsive text" />
                  </div>
                </div>
              </div>
            </HoloCard>
          </MotionReveal>

          <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <MotionReveal delay={0.1}>
              <div style={{ borderRadius: '28px', border: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(145deg, rgba(30,32,45,0.8), rgba(15,16,25,0.9))', padding: '2rem', height: '100%' }}>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.8rem' }}>Custom Fonts</h3>
                <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Upload `.ttf`, `.otf`, or `.woff` definitions. Once processed, they appear directly inside the standard font dropdown for any widget or global style.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href="https://demo.arcade.software/Gdq0Nfk15VFWuQT6Evsb?embed&show_copy_link=true" className="arrow-link" target="_blank" rel="noopener noreferrer">Upload Demo <span>→</span></a>
                  <a href="https://youtu.be/NsR7f1OZeSY" className="arrow-link" target="_blank" rel="noopener noreferrer">Video Guide <span>→</span></a>
                </div>
              </div>
            </MotionReveal>
            
            <MotionReveal delay={0.2}>
              <div style={{ borderRadius: '28px', border: '1px solid rgba(255,255,255,0.08)', background: 'linear-gradient(145deg, rgba(30,32,45,0.8), rgba(15,16,25,0.9))', padding: '2rem', height: '100%' }}>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.8rem' }}>Custom Icons</h3>
                <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Avoid unoptimized image assets for UI iconography. Map directories of SVGs into a custom webfont using IcoMoon and import them for crisp, tint-able vectors.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href="https://demo.arcade.software/oMAqsibJi8B9EdLgVanQ?embed&show_copy_link=true" className="arrow-link" target="_blank" rel="noopener noreferrer">Generate Fonts <span>→</span></a>
                  <a href="https://demo.arcade.software/DYKzHIQ27EaCiQArRlCT?embed&show_copy_link=true" className="arrow-link" target="_blank" rel="noopener noreferrer">Import Icons <span>→</span></a>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </div>

      {/* Theme Widgets Section */}
      <div style={{ marginTop: '6rem' }}>
        <MotionReveal>
          <div style={{
            borderRadius: '32px',
            padding: '3rem',
            border: '1px solid rgba(0, 245, 212, 0.2)',
            background: 'linear-gradient(155deg, rgba(0,245,212,0.08) 0%, rgba(8,10,22,0.95) 100%)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Global Theme Widgets</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto 2.5rem' }}>
              Theme widgets act like CSS classes. Instantiate standard archetypes like standard buttons, inputs, or cards once, then deploy them throughout your application footprint. When a style parameter changes locally, instances update seamlessly.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '900px', margin: '0 auto' }}>
              <a href="https://demo.arcade.software/Os2t1MTQEeyJ0CfSfpSJ?embed&show_copy_link=true" className="chapter-card" style={{ display: 'block', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                <h4 style={{ color: '#fff', marginBottom: '0.4rem' }}>Create Theme Widget</h4>
                <p style={{ color: '#aeb7cf', fontSize: '0.85rem', margin: 0 }}>Basic setup from scratch</p>
              </a>
              <a href="https://demo.arcade.software/2zr01BrhFOXNYpNDhv85?embed&show_copy_link=true" className="chapter-card" style={{ display: 'block', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                <h4 style={{ color: '#00f5d4', marginBottom: '0.4rem' }}>Save from Existing</h4>
                <p style={{ color: '#aeb7cf', fontSize: '0.85rem', margin: 0 }}>Extract style from canvas</p>
              </a>
              <a href="https://demo.arcade.software/bILuxIsASoJTFyUflxYD?embed&show_copy_link=true" className="chapter-card" style={{ display: 'block', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                <h4 style={{ color: '#fff', marginBottom: '0.4rem' }}>Apply New Instance</h4>
                <p style={{ color: '#aeb7cf', fontSize: '0.85rem', margin: 0 }}>Drag from palette</p>
              </a>
              <a href="https://demo.arcade.software/JlRWSMnrxi5ehHvkRrVH?embed&show_copy_link=true" className="chapter-card" style={{ display: 'block', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                <h4 style={{ color: '#fff', marginBottom: '0.4rem' }}>Bind Existing Widget</h4>
                <p style={{ color: '#aeb7cf', fontSize: '0.85rem', margin: 0 }}>Link to theme widget</p>
              </a>
            </div>
          </div>
        </MotionReveal>
      </div>

    </div>
  )
}

function PageStateManagement() {
  const stateTypes = [
    {
      title: 'App State',
      desc: 'Global variables stored on device memory or persistent storage (SharedPreferences). Shared across all pages.',
      icon: '1'
    },
    {
      title: 'Page State',
      desc: 'Variables specific to a single page. Shared only by widgets within that page configuration.',
      icon: '2'
    },
    {
      title: 'Component State',
      desc: 'Encapsulated variables for a specific component instance, ensuring logic boundaries.',
      icon: '3'
    }
  ]

  const rebuildTypes = [
    { title: 'Rebuild Page', desc: 'Refreshes the entire page interface structure and recalculates all visible bindings.' },
    { title: 'Rebuild Component', desc: 'Surgically refreshes only selecting components to preserve performance.' },
    { title: 'Rebuild Parent', desc: 'Refreshes the containing page after interacting with overlay modular dialogs.' },
  ]

  const triggers = [
    { label: 'On Focus Change', desc: 'Fires when input cursor engages or disengages.' },
    { label: 'On Submit', desc: 'Fires on enter key press or form dispatch.' },
    { label: 'On Change', desc: 'Fires character-by-character or slider drag.' },
    { label: 'On Completed', desc: 'Fires when fixed-length inputs (e.g., OTP) are filled.' },
    { label: 'On Selected', desc: 'Fires upon choice chip, radio, or checkbox toggle.' },
  ]

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      {/* Header */}
      <MotionReveal>
        <span className="chip" style={{ color: '#7b2ff7', border: '1px solid rgba(123, 47, 247, 0.3)', background: 'rgba(123, 47, 247, 0.1)' }}>
          Module 3 — Chapter 3.2 · Page 2
        </span>
        <h1 className="sec-title">State Management Redesigned</h1>
        <p className="sec-desc">
          State management is the engine of interactivity. It focuses on monitoring data mutations in your application layer and reactively updating the UI to reflect those changes in real-time.
        </p>
        <p style={{ color: '#c8c8e0', lineHeight: 1.7, maxWidth: '980px', fontSize: '1.05rem', marginTop: '1rem' }}>
          By binding Widget properties visually to State variables, you create a responsive loop where the UI dictates exactly what the current local or remote memory contains.
        </p>
      </MotionReveal>

      {/* State Variable Types Grid */}
      <div style={{ marginTop: '5rem' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>State Architecture</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto' }}>
              Different data needs different lifespans. FlutterFlow separates memory into three distinct scopes to prevent data pollution.
            </p>
          </div>
        </MotionReveal>

        <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {stateTypes.map((type, i) => (
            <MotionReveal key={type.title} delay={i * 0.1}>
              <NeumorphicCard icon={type.icon} style={{ height: '100%' }}>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.8rem' }}>{type.title}</h3>
                <p style={{ color: '#c8c8e0', lineHeight: 1.6, fontSize: '0.95rem' }}>{type.desc}</p>
              </NeumorphicCard>
            </MotionReveal>
          ))}
        </div>

        <MotionReveal delay={0.3}>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://docs.flutterflow.io/resources/data-representation/app-state" className="arrow-link" target="_blank" rel="noopener noreferrer">App State Docs <span>→</span></a>
            <a href="https://docs.flutterflow.io/resources/ui/pages/page-lifecycle" className="arrow-link" target="_blank" rel="noopener noreferrer">Page State Docs <span>→</span></a>
            <a href="https://docs.flutterflow.io/resources/ui/components/component-lifecycle" className="arrow-link" target="_blank" rel="noopener noreferrer">Component State Docs <span>→</span></a>
          </div>
        </MotionReveal>
        
        <MotionReveal>
          <div className="step-media" style={{ marginTop: '3rem', borderRadius: '24px', maxWidth: '800px', margin: '3rem auto 0' }}>
            <img src="https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316152926-20.png" alt="State Variable Types architecture map" style={{ width: '100%' }} />
          </div>
        </MotionReveal>
      </div>

      {/* Interactive Forms & Widget State */}
      <div style={{ marginTop: '6rem' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Widget State Automation</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto' }}>
              Unlike manual custom state, form inputs handle their own internal state. FlutterFlow automatically surfaces this data through the global Widget State object.
            </p>
          </div>
        </MotionReveal>
        
        <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
          <MotionReveal delay={0.1}>
            <HoloCard>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>Reading Widget State</h3>
              <p style={{ color: '#d3d9ea', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Text Fields, Radio Buttons, and Checkboxes automatically emit their current evaluation. No need to map `onChange` functions—just read directly from `Widget State -&gt; [your_widget_name]`.
              </p>
              <CalloutCard tone="info" title="Scope Limitation">
                Widget states are local to the canvas where they exist. Inside a Component, the state must be explicitly passed out via Action parameters if the Parent page needs it.
              </CalloutCard>
              <div className="step-media" style={{ marginTop: '1.5rem', borderRadius: '16px' }}>
                <img src="https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316152926-22.png" alt="Widget state map" />
              </div>
            </HoloCard>
          </MotionReveal>

          <MotionReveal delay={0.2}>
            <NeonCard accent="#ff2d55">
              <div style={{ color: '#ff2d55', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.8rem' }}>
                Event Handlers
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>Form Action Triggers</h3>
              <p style={{ color: '#d3d9ea', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Connect logic pipelines directly to user gestures. Hook into granular form events to fire API requests, form validations, or dynamic animations.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {triggers.map(t => (
                  <div key={t.label} style={{ background: 'rgba(255,45,85,0.05)', border: '1px solid rgba(255,45,85,0.2)', padding: '1rem', borderRadius: '12px' }}>
                    <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '0.3rem' }}>{t.label}</h4>
                    <p style={{ color: '#aeb7cf', fontSize: '0.85rem', margin: 0 }}>{t.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <a href="https://youtu.be/jD6L4xjYjJA" className="arrow-link" target="_blank" rel="noopener noreferrer">
                  State Video Guide <span>→</span>
                </a>
              </div>
            </NeonCard>
          </MotionReveal>
        </div>
      </div>

      {/* DOM Rendering Actions */}
      <div style={{ marginTop: '6rem' }}>
        <MotionReveal>
          <div style={{
            borderRadius: '32px',
            padding: '3rem',
            border: '1px solid rgba(255, 215, 0, 0.2)',
            background: 'linear-gradient(155deg, rgba(255,215,0,0.05) 0%, rgba(8,10,22,0.95) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Controlling Rebuilds</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto 2.5rem' }}>
              When underlying variables mutate naturally outside of standard reactive bindings (like API responses or Custom Code), force the UI to repaint utilizing Rebuild actions.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '900px' }}>
              {rebuildTypes.map((rt, i) => (
                <div key={rt.title} style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  borderRadius: '20px', 
                  padding: '1.5rem',
                  textAlign: 'left'
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,215,0,0.15)', color: '#ffd700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '1rem' }}>
                    {i+1}
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{rt.title}</h4>
                  <p style={{ color: '#aeb7cf', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>{rt.desc}</p>
                </div>
              ))}
            </div>

            <div className="step-media" style={{ marginTop: '3rem', borderRadius: '16px', maxWidth: '700px' }}>
              <img src="https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316152926-21.png" alt="Rebuild action types" />
            </div>
          </div>
        </MotionReveal>
      </div>

    </div>
  )
}

function PageFileHandling() {
  const uploadSteps = [
    'Drag a button widget onto your canvas layout.',
    'Navigate to Actions > Add Action > Upload/Save Media.',
    'Configure Source (Camera/Gallery) and Upload Type (Firebase/Supabase).',
    'Upon success, store the returned structural URL into local Page State.',
  ]

  const displaySteps = [
    'Insert an Image, VideoPlayer, or MediaDisplay component.',
    'Map the Path property dynamically via Variable > Widget State > Uploaded File URL.',
    'Enable Cached Network Image for better performance across sessions.',
    'Define Fade Duration to smooth out network painting transitions.',
  ]

  const customCodeSteps = [
    'Navigate to the Custom Code tab via the left rail > + Add > Custom Action/Widget.',
    'Author or paste your Dart script (inject Future for async operations).',
    'Hit Parse to let the engine detect arguments, then bind them natively to your UI elements.',
  ]

  const animTriggers = [
    { title: 'On Page Load', desc: 'Fires instantly upon the scaffolding mounting.' },
    { title: 'On Action Trigger', desc: 'Fires sequentially within a logical action flow chain.' },
    { title: 'Implicit Changes', desc: 'Auto-tweens sizes or opacities when reactive bindings mutate.' }
  ]

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      {/* Header */}
      <MotionReveal>
        <span className="chip" style={{ color: '#ff2d55', border: '1px solid rgba(255, 45, 85, 0.3)', background: 'rgba(255, 45, 85, 0.1)' }}>
          Module 3 — Chapter 3.3 · Full Capabilities
        </span>
        <h1 className="sec-title">Advanced Utilities: Media, Code & Motion</h1>
        <p className="sec-desc">
          Push beyond standard CRUD data. Master binary file transfer protocols, inject raw Dart functionality to bypass GUI limits, and orchestrate timeline-based micro-interactions to create a flagship-quality application feel.
        </p>
      </MotionReveal>

      {/* Media Management Segment */}
      <div style={{ marginTop: '5rem' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>I/O Pipeline: File Handling</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto' }}>
              Seamlessly bridge local device storage, camera pipelines, and cloud buckets (Firebase/Supabase) to handle rich media like images, videos, and PDFs.
            </p>
          </div>
        </MotionReveal>

        <div className="chapter-split" style={{ alignItems: 'flex-start', gap: '2rem' }}>
          <div className="split-col" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Upload */}
            <MotionReveal delay={0.1}>
              <NeonCard accent="#ff2d55" style={{ height: '100%' }}>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.8rem' }}>Uploading Assets</h3>
                <p style={{ color: '#d3d9ea', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Enable users to snap photos or pick files from their gallery. The resulting binary is transcoded locally (via BlurHash or compression limits) and streamed to the cloud logic-free.
                </p>
                <StepsList steps={uploadSteps} dense />
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <a href="https://www.youtube.com/watch?v=hzHW-3uttCU" className="arrow-link" target="_blank" rel="noopener noreferrer">Video Integration <span>→</span></a>
                  <a href="https://coffeebytez.medium.com/flutter-flow-how-to-screenshot-any-widget-d22a3450dc37" className="arrow-link" target="_blank" rel="noopener noreferrer">Screenshot Guide <span>→</span></a>
                </div>
              </NeonCard>
            </MotionReveal>

            {/* Display */}
            <MotionReveal delay={0.2}>
              <NeonCard accent="#00f5d4" style={{ height: '100%' }}>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.8rem' }}>Displaying Media</h3>
                <p style={{ color: '#d3d9ea', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  Once a URL is generated from the ingest phase, bind it cleanly to specialized container components that handle network latency and caching gracefully.
                </p>
                <StepsList steps={displaySteps} dense />
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <a href="https://www.youtube.com/watch?v=vL5pNsxz16s" className="arrow-link" target="_blank" rel="noopener noreferrer">Display Widgets <span>→</span></a>
                  <a href="https://blog.flutterflow.io/improving-the-image-loading-ux-of-your-app/" className="arrow-link" target="_blank" rel="noopener noreferrer">BlurHash UX <span>→</span></a>
                </div>
              </NeonCard>
            </MotionReveal>
          </div>

          <div className="split-col" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Download */}
            <MotionReveal delay={0.3}>
              <HoloCard>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.8rem' }}>Download File</h3>
                <p style={{ color: '#aeb7cf', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  The Download action reverses the flow—streaming cloud URIs back into local OS sandboxes (Photos App or Files directory) with configurable naming parameters.
                </p>
                <div className="step-media" style={{ borderRadius: '12px' }}>
                  <img src="https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316153818-28.jpeg" alt="Download Action Panel" />
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <a href="https://www.youtube.com/watch?v=gJwpkrGBG2c" className="arrow-link" target="_blank" rel="noopener noreferrer">Video Guide <span>→</span></a>
                </div>
              </HoloCard>
            </MotionReveal>

            {/* Delete */}
            <MotionReveal delay={0.4}>
              <HoloCard>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.8rem' }}>Deletions & Cleanup</h3>
                <p style={{ color: '#aeb7cf', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Avoid orphaned files spiking your GCP bill. Always bind frontend 'Delete' gestures to both the Database Query (Document Destroy) and Storage Bucket (Clear Media Base).
                </p>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <a href="https://www.youtube.com/watch?v=y5GfG-eX1QM" className="arrow-link" target="_blank" rel="noopener noreferrer">PDF Cleanup <span>→</span></a>
                  <a href="https://community.flutterflow.io/ask-the-community/post/download-file-action-not-working-KWkDXG3YyMJQdUV" className="arrow-link" target="_blank" rel="noopener noreferrer">Troubleshoot <span>→</span></a>
                </div>
              </HoloCard>
            </MotionReveal>
          </div>
        </div>
      </div>

      {/* Extensibility Segment: Custom Code */}
      <div style={{ marginTop: '7rem' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Extensibility: Custom Code</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto' }}>
              GUI builders eventually hit a ceiling. FlutterFlow bypasses this by compiling to clean, accessible Dart. Write atomic Functions, asynchronous Actions, or entire interface Widgets directly.
            </p>
          </div>
        </MotionReveal>

        <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              title: 'Custom Functions',
              subtitle: 'Synchronous Data Processing',
              desc: 'Pure synchronous operations that take inputs and yield outputs instantly. Perfect for formatting strings (currency/phone), calculating mathematical formulas, or filtering list arrays prior to rendering on UI.',
              links: [
                { href: 'https://www.youtube.com/watch?v=Xn8iWNN_12U', label: 'Functions Demo' }
              ]
            },
            {
              title: 'Custom Actions',
              subtitle: 'Asynchronous Workflows',
              desc: 'Heavy lifting tasks that require time to resolve using Dart Futures. Used for third-party API SDK wrappers (like Stripe or Maps), complex hardware bridging, or custom push notification handling logic.',
              links: [
                { href: 'https://www.youtube.com/watch?v=rKaD9eKuZkY', label: 'Actions Demo' }
              ]
            },
            {
              title: 'Custom Widgets',
              subtitle: 'Advanced Graphics & SDKs',
              desc: 'Draw anything standard Flutter supports. Need a specialized 3D canvas, a complex video scrubber, or implementing a proprietary Pub.dev UI package? Build the widget wrapper here and stitch it into your visual tree.',
              links: [
                { href: 'https://docs.flutterflow.io/concepts/custom-code', label: 'Docs Reference' }
              ]
            }
          ].map((card, i) => (
            <MotionReveal key={card.title} delay={i * 0.1}>
              <TiltCard accent={['#00f5d4', '#ffd700', '#ff2d55'][i]} style={{ height: '100%' }}>
                <div style={{ color: ['#00f5d4', '#ffd700', '#ff2d55'][i], fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.6rem' }}>
                  {card.subtitle}
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '1rem' }}>{card.title}</h3>
                <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{card.desc}</p>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {card.links.map(link => (
                    <a key={link.label} href={link.href} className="arrow-link" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem' }}>
                      {link.label} <span>→</span>
                    </a>
                  ))}
                </div>
              </TiltCard>
            </MotionReveal>
          ))}
        </div>
      </div>

      {/* Advanced Motion Segment */}
      <div style={{ marginTop: '7rem' }}>
        <MotionReveal>
          <div style={{
            borderRadius: '32px',
            padding: '4rem 2rem',
            border: '1px solid rgba(166, 124, 255, 0.2)',
            background: 'linear-gradient(155deg, rgba(166,124,255,0.06) 0%, rgba(8,10,22,0.95) 100%)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ display: 'inline-flex', padding: '0.5rem 1rem', borderRadius: '12px', background: 'rgba(166,124,255,0.1)', color: '#a67cff', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Kinetic Polish
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '1rem' }}>Animation & Motion</h2>
              <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '700px', margin: '0 auto' }}>
                Animations transform utilitarian apps into premium experiences. From page routing to state transitions.
              </p>
            </div>

            <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <MotionReveal delay={0.1}>
                <NeumorphicCard icon="!" style={{ height: '100%' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.6rem' }}>Explicit (Widget)</h4>
                  <p style={{ color: '#aeb7cf', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    Trigger explicit timeline animations (Fade, Scale, Slide, Rotate) on mount or driven manually by action workflows. Supports staggers and complex curves.
                  </p>
                  <a href="https://www.youtube.com/watch?v=-quxi_t0eWU" className="arrow-link" target="_blank" rel="noopener noreferrer">Animation Video <span>→</span></a>
                </NeumorphicCard>
              </MotionReveal>
              <MotionReveal delay={0.2}>
                <NeumorphicCard icon="~" style={{ height: '100%' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.6rem' }}>Implicit Changes</h4>
                  <p style={{ color: '#aeb7cf', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    Wrap components in an AnimatedContainer. Whenever underlying variables change (e.g. width from 50px to 300px), the engine automatically interpolates the transition.
                  </p>
                  <a href="https://www.youtube.com/watch?v=jOfNuHfuRVc" className="arrow-link" target="_blank" rel="noopener noreferrer">Implicit Demo <span>→</span></a>
                </NeumorphicCard>
              </MotionReveal>
              <MotionReveal delay={0.3}>
                <NeumorphicCard icon="★" style={{ height: '100%' }}>
                  <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.6rem' }}>Hero Transitions</h4>
                  <p style={{ color: '#aeb7cf', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    Bind the exact same `Hero Tag` to an image on the list page and detail page. When navigating, the element visually floats across the screen boundaries natively.
                  </p>
                  <a href="https://www.youtube.com/watch?v=B0qz4JRYy7U" className="arrow-link" target="_blank" rel="noopener noreferrer">Hero Demo <span>→</span></a>
                </NeumorphicCard>
              </MotionReveal>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
              <MotionReveal delay={0.4}>
                <div className="step-media" style={{ borderRadius: '16px' }}>
                   <img src="https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316153818-36.jpeg" alt="Transition matrix" />
                </div>
              </MotionReveal>
              <MotionReveal delay={0.5}>
                <div className="step-media" style={{ borderRadius: '16px' }}>
                   <img src="https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316153818-34.jpeg" alt="Rive runtime" />
                </div>
              </MotionReveal>
            </div>
          </div>
        </MotionReveal>
      </div>

    </div>
  )
}

/* ═══════ MODULE 4 ═══════ */

function Module4_1Section() {
  const [activePhase, setActivePhase] = useState(1)
  const [flippedCard, setFlippedCard] = useState(null)

  const railCards = [
    { title: 'Create branch', tag: '01', desc: 'Start from main, give the branch a purpose-driven name, and isolate the experiment.' },
    { title: 'Switch context', tag: '02', desc: 'Use the branch dropdown to move cleanly between stable work and feature work.' },
    { title: 'Commit progress', tag: '03', desc: 'Checkpoint your changes frequently so the merge story stays readable.' },
    { title: 'Merge back', tag: '04', desc: 'Choose the direction, inspect the diff, and resolve YAML conflicts carefully.' },
    { title: 'Close and clean', tag: '05', desc: 'Archive unused branches after 30 days so the workspace stays focused.' }
  ]

  const mergePhases = [
    {
      title: 'Create',
      accent: '#ffd700',
      image: 'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114527-1.jpeg',
      body: 'Open Toolbar > Branching > Branching Options > Create Branch, then give the branch a clear name like feature-login.'
    },
    {
      title: 'Commit',
      accent: '#00f5d4',
      image: 'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114527-1.jpeg',
      body: 'Move inside the branch, build safely, and create commits as you go. All users can commit, even though branch creation itself is plan-gated.'
    },
    {
      title: 'Resolve',
      accent: '#7b2ff7',
      image: 'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114527-2.jpeg',
      body: 'Git auto-merges cleanly when files do not overlap, but duplicated widgets and overlapping YAML still need manual review.'
    },
    {
      title: 'Ship',
      accent: '#ff9a5c',
      image: 'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114527-2.jpeg',
      body: 'After testing, merge child to parent, confirm the final state, and close the temporary branch when the work is finished.'
    }
  ]

  const flipFacts = [
    {
      front: 'Plan access',
      back: 'Branch creation is available on Growth and higher plans, while commits are available to all users.',
      accent: '#ffd700'
    },
    {
      front: 'GitHub sync',
      back: 'FlutterFlow branches stay inside FlutterFlow and do not automatically sync to GitHub.',
      accent: '#00f5d4'
    },
    {
      front: 'Conflict tip',
      back: 'When merge conflicts appear, inspect the left file list and the right diff editor slowly instead of guessing.',
      accent: '#7b2ff7'
    },
    {
      front: 'Future',
      back: 'The source material mentions better YAML diffs and hover docs as future improvements.',
      accent: '#ff9a5c'
    }
  ]

  const resources = [
    {
      label: 'Tutorial',
      title: 'Branching (Version 2) | New Feature Tutorial',
      href: 'https://www.youtube.com/watch?v=r8BR248HR0U'
    },
    {
      label: 'Live demo',
      title: 'Branching - FlutterFlow Live Demo | FFDC 2023',
      href: 'https://www.youtube.com/watch?v=Z4wm1kljF4M'
    },
    {
      label: 'Reference',
      title: 'FlutterFlow UI on GitHub',
      href: 'https://github.com/FlutterFlow/flutterflow-ui'
    }
  ]

  const active = mergePhases[activePhase]

  return (
    <section className="sec" style={{ paddingTop: '0', paddingBottom: '90px', position: 'relative', overflow: 'hidden' }}>
      <SectionHeroBackdrop height={440} opacity={0.9} />
      <div className="wrap" style={{ paddingTop: '120px', position: 'relative', zIndex: 2 }}>
        <MotionReveal>
          <div style={{ display: 'grid', gap: '1rem', maxWidth: '860px' }}>
            <span className="chip" style={{ width: 'max-content', color: '#ffd700', border: '1px solid rgba(255,215,0,0.28)', background: 'rgba(255,215,0,0.1)' }}>
              Module 4 - Chapter 4.1
            </span>
            <h1 style={{
              fontSize: 'clamp(2.8rem, 5vw, 4.1rem)',
              fontWeight: 800,
              lineHeight: 1.04,
              background: 'linear-gradient(135deg, #ffd700, #00f5d4, #4361ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Branching
            </h1>
            <p style={{ color: '#d7d7ea', fontSize: '1.08rem', lineHeight: 1.85 }}>
              This chapter now reads like a branching playground instead of a grid. Scroll sideways through the workflow, switch merge phases in the lab, and flip the cards to expose the hidden rules that matter when teams collaborate.
            </p>
          </div>
        </MotionReveal>

        <div style={{
          marginTop: '2.2rem',
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(240px, 300px)',
          gap: '1rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          scrollSnapType: 'x mandatory'
        }}>
          {railCards.map((card, i) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -10, rotate: i % 2 === 0 ? -0.5 : 0.5 }}
              style={{
                scrollSnapAlign: 'start',
                minHeight: '220px',
                padding: '1.45rem',
                borderRadius: i % 2 === 0 ? '28px' : '18px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: `linear-gradient(160deg, ${['rgba(255,215,0,0.18)', 'rgba(0,245,212,0.14)', 'rgba(123,47,247,0.16)', 'rgba(255,154,92,0.15)', 'rgba(67,97,238,0.16)'][i]} 0%, rgba(6,10,26,0.96) 82%)`,
                boxShadow: '0 22px 50px rgba(0,0,0,0.22)'
              }}
            >
              <div style={{ fontSize: '0.74rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d0d5ef', marginBottom: '0.85rem' }}>{card.tag}</div>
              <h3 style={{ color: '#fff', fontSize: '1.18rem', marginBottom: '0.55rem' }}>{card.title}</h3>
              <p style={{ color: '#cfd6ea', lineHeight: 1.72 }}>{card.desc}</p>
              <div style={{ marginTop: '1.2rem', color: '#00f5d4', fontWeight: 700 }}>Slide this rail →</div>
            </motion.div>
          ))}
        </div>

        <div className="chapter-split" style={{ marginTop: '2.6rem', alignItems: 'stretch' }}>
          <div style={{
            borderRadius: '30px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(180deg, rgba(12,12,29,0.96) 0%, rgba(8,9,22,0.98) 100%)',
            padding: '1rem',
            display: 'grid',
            gap: '0.75rem'
          }}>
            {mergePhases.map((phase, i) => (
              <motion.button
                key={phase.title}
                onClick={() => setActivePhase(i)}
                whileHover={{ x: 6 }}
                style={{
                  textAlign: 'left',
                  padding: '1rem 1.1rem',
                  borderRadius: '18px',
                  border: `1px solid ${i === activePhase ? phase.accent : 'rgba(255,255,255,0.08)'}`,
                  background: i === activePhase ? `${phase.accent}16` : 'rgba(255,255,255,0.03)',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: phase.accent, marginBottom: '0.35rem', fontWeight: 700 }}>
                  Phase {i + 1}
                </div>
                <div style={{ fontSize: '1.04rem', fontWeight: 700, marginBottom: '0.25rem' }}>{phase.title}</div>
                <div style={{ color: '#cfd6ea', lineHeight: 1.6 }}>{phase.body}</div>
              </motion.button>
            ))}
          </div>

          <motion.div
            key={active.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              borderRadius: '34px',
              overflow: 'hidden',
              border: `1px solid ${active.accent}55`,
              background: 'linear-gradient(180deg, rgba(10,12,30,0.98) 0%, rgba(6,8,18,0.98) 100%)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.28)'
            }}
          >
            <div style={{ padding: '1rem' }}>
              <img src={active.image} alt={active.title} style={{ width: '100%', borderRadius: '22px' }} />
            </div>
            <div style={{ padding: '0 1.35rem 1.35rem' }}>
              <div style={{ fontSize: '0.74rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: active.accent, fontWeight: 700, marginBottom: '0.55rem' }}>
                Merge Lab
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.7rem', marginBottom: '0.55rem' }}>{active.title}</h2>
              <p style={{ color: '#d7d7ea', lineHeight: 1.8, marginBottom: '1rem' }}>{active.body}</p>
              <div className="step-media" style={{ borderRadius: '22px', borderColor: `${active.accent}44` }}>
                <iframe
                  src="https://www.youtube.com/embed/r8BR248HR0U"
                  title="Branching Version 2 New Feature Tutorial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div style={{ marginTop: '2.6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {flipFacts.map((card, i) => {
            const isFlipped = flippedCard === i
            return (
              <div key={card.front} style={{ perspective: '1600px', minHeight: '220px' }}>
                <motion.button
                  onClick={() => setFlippedCard(isFlipped ? null : i)}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: '100%',
                    minHeight: '220px',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    padding: '1.4rem',
                    borderRadius: i % 2 === 0 ? '30px' : '18px',
                    border: `1px solid ${card.accent}55`,
                    background: `linear-gradient(160deg, ${card.accent}18 0%, rgba(7,10,22,0.96) 78%)`,
                    backfaceVisibility: 'hidden',
                    display: 'grid',
                    alignContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ color: card.accent, fontSize: '0.74rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>
                        Tap to flip
                      </div>
                      <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{card.front}</h3>
                    </div>
                    <div style={{ color: '#cfd6ea', lineHeight: 1.7 }}>Hidden insight on the back side.</div>
                  </div>

                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    padding: '1.4rem',
                    borderRadius: i % 2 === 0 ? '30px' : '18px',
                    border: `1px solid ${card.accent}55`,
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(7,10,22,0.98) 100%)',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    display: 'grid',
                    alignContent: 'space-between'
                  }}>
                    <div style={{ color: card.accent, fontSize: '0.74rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>Back side</div>
                    <p style={{ color: '#fff', lineHeight: 1.75 }}>{card.back}</p>
                  </div>
                </motion.button>
              </div>
            )
          })}
        </div>

        <div style={{
          marginTop: '2.2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
          paddingBottom: '0.4rem'
        }}>
          {resources.map((item, i) => {
            const isVideo = item.href.includes('youtube.com') || item.href.includes('youtu.be')
            const embedUrl = isVideo ? item.href.replace('watch?v=', 'embed/') : item.href
            
            return (
              <div
                key={item.title}
                style={{
                  borderRadius: '16px',
                  border: `1px solid ${['rgba(255,215,0,0.3)', 'rgba(0,245,212,0.3)', 'rgba(123,47,247,0.3)'][i % 3]}`,
                  background: 'rgba(8,10,24,0.86)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ padding: '1.2rem' }}>
                  <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: ['#ffd700', '#00f5d4', '#b48fff'][i % 3], fontWeight: 700, marginBottom: '0.4rem' }}>
                    {item.label}
                  </div>
                  <div style={{ lineHeight: 1.4, color: '#fff', fontSize: '1.1rem' }}>{item.title}</div>
                </div>
                {isVideo ? (
                  <iframe
                    width="100%"
                    height="220"
                    src={embedUrl}
                    title={item.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ display: 'block', marginTop: 'auto' }}
                  />
                ) : (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '1rem 1.2rem', background: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto', fontWeight: 600 }}>
                    Open Resource <span>↗</span>
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Module4_2Section() {
  const [activeLane, setActiveLane] = useState('versions')

  const lanes = [
    {
      id: 'versions',
      title: 'Versions',
      accent: '#ff9a5c',
      image: 'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114605-3.png',
      summary: 'Deprecated, still restorable',
      body: <>Project Versions are deprecated, so new ones cannot be created. Older versions remain accessible, and the safest way to inspect them is to use Peek before restoring.</>,
      points: [
        'Use versions only when you need to inspect or restore previously created history.',
        'Peek opens the previous version in a new tab so you can review it safely.',
        'Restoring preserves the current state first, then loads the selected version.'
      ]
    },
    {
      id: 'commits',
      title: 'Commits',
      accent: '#ff5c8d',
      image: 'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114605-3.png',
      summary: 'Better branch history',
      body: <>Commits are now the preferred checkpoint system. Use <a href="https://docs.flutterflow.io/collaboration/saving-versioning#commits" className="text-link" target="_blank" rel="noopener noreferrer">Saving and Versioning</a> together with <a href="https://docs.flutterflow.io/collaboration/branching#commits" className="text-link" target="_blank" rel="noopener noreferrer">Branching and Commits</a> when you want stronger traceability.</>,
      points: [
        'Commits belong to a specific branch history.',
        'They let you inspect exactly what changed at that moment.',
        'They are the strongest manual history layer for active feature work.'
      ]
    },
    {
      id: 'snapshots',
      title: 'Snapshots',
      accent: '#a67cff',
      image: 'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114605-4.png',
      summary: 'Automatic backup safety net',
      body: 'Snapshots are automatic saves of your project state. They let you peek into or revert to earlier project moments even when you did not create a manual checkpoint yourself.',
      points: [
        'Snapshots happen automatically as you build.',
        'They are ideal when you need emergency rollback protection.',
        'Snapshot access depth depends on your plan.'
      ]
    }
  ]

  const retention = [
    { label: 'Free', value: '1 hour', accent: '#ff9a5c' },
    { label: 'Basic', value: '1 day', accent: '#ffb16b' },
    { label: 'Growth', value: '3 days', accent: '#ff5c8d' },
    { label: 'Business', value: '7 days', accent: '#a67cff' },
    { label: 'Enterprise', value: 'Custom', accent: '#00f5d4' }
  ]

  const restoreFlow = [
    { title: 'Peek first', desc: 'Inspect the old state in a separate tab before changing your live branch.' },
    { title: 'Preserve current', desc: 'FlutterFlow keeps the current state before it loads the selected historical state.' },
    { title: 'Restore intentionally', desc: 'Rollback is a decision, not a reflex. Only restore after you confirm the target is right.' }
  ]

  const active = lanes.find(lane => lane.id === activeLane) || lanes[0]

  return (
    <section className="sec" style={{ paddingTop: '0', paddingBottom: '90px', position: 'relative', overflow: 'hidden' }}>
      <SectionHeroBackdrop height={430} opacity={0.85} />
      <div className="wrap" style={{ paddingTop: '120px', position: 'relative', zIndex: 2 }}>
        <MotionReveal>
          <div style={{ display: 'grid', gap: '1rem', maxWidth: '860px' }}>
            <span className="chip" style={{ width: 'max-content', color: '#ff9a5c', border: '1px solid rgba(255,154,92,0.28)', background: 'rgba(255,154,92,0.1)' }}>
              Module 4 - Chapter 4.2
            </span>
            <h1 style={{
              fontSize: 'clamp(2.8rem, 5vw, 4.1rem)',
              fontWeight: 800,
              lineHeight: 1.04,
              background: 'linear-gradient(135deg, #ff9a5c, #ff5c8d, #a67cff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Saving and Versioning
            </h1>
            <p style={{ color: '#d7d7ea', fontSize: '1.08rem', lineHeight: 1.85 }}>
              This chapter now behaves like a restore console. Open a history lane on the left, inspect the selected detail panel on the right, and swipe through retention windows like a backup deck instead of a list.
            </p>
          </div>
        </MotionReveal>

        <div className="chapter-split" style={{ marginTop: '2.4rem', alignItems: 'stretch' }}>
          <div style={{
            display: 'grid',
            gap: '0.9rem',
            padding: '1rem',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(180deg, rgba(26,11,20,0.96) 0%, rgba(11,10,24,0.98) 100%)'
          }}>
            {lanes.map((lane, index) => {
              const activeItem = lane.id === activeLane
              return (
                <motion.button
                  key={lane.id}
                  onClick={() => setActiveLane(lane.id)}
                  whileHover={{ x: 6 }}
                  style={{
                    textAlign: 'left',
                    padding: '1.15rem 1.2rem',
                    borderRadius: index === 1 ? '24px' : '16px',
                    border: `1px solid ${activeItem ? lane.accent : 'rgba(255,255,255,0.08)'}`,
                    background: activeItem ? `${lane.accent}14` : 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: lane.accent, fontWeight: 700, marginBottom: '0.35rem' }}>
                    Lane {index + 1}
                  </div>
                  <div style={{ fontSize: '1.08rem', fontWeight: 700, marginBottom: '0.2rem' }}>{lane.title}</div>
                  <div style={{ color: '#cfd6ea', lineHeight: 1.6 }}>{lane.summary}</div>
                </motion.button>
              )
            })}
          </div>

          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              borderRadius: '34px',
              overflow: 'hidden',
              border: `1px solid ${active.accent}55`,
              background: 'linear-gradient(180deg, rgba(24,12,22,0.98) 0%, rgba(8,8,18,0.98) 100%)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.28)'
            }}
          >
            <div style={{ padding: '1rem' }}>
              <img src={active.image} alt={active.title} style={{ width: '100%', borderRadius: '22px' }} />
            </div>
            <div style={{ padding: '0 1.35rem 1.35rem' }}>
              <div style={{ fontSize: '0.74rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: active.accent, fontWeight: 700, marginBottom: '0.45rem' }}>
                Selected history lane
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '0.55rem' }}>{active.title}</h2>
              <div style={{ color: '#d7d7ea', lineHeight: 1.8, marginBottom: '1rem' }}>{active.body}</div>
              <BulletList items={active.points} />
            </div>
          </motion.div>
        </div>

        <div style={{
          marginTop: '2.4rem',
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(250px, 1fr)',
          gap: '1rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollSnapType: 'x mandatory'
        }}>
          {restoreFlow.map((step, i) => (
            <motion.div
              key={step.title}
              whileHover={{ y: -8, rotate: i % 2 === 0 ? -0.4 : 0.4 }}
              style={{
                scrollSnapAlign: 'start',
                minHeight: '220px',
                padding: '1.4rem',
                borderRadius: i === 1 ? '30px' : '18px',
                border: `1px solid ${['rgba(255,154,92,0.35)', 'rgba(255,92,141,0.35)', 'rgba(166,124,255,0.35)'][i]}`,
                background: `linear-gradient(160deg, ${['rgba(255,154,92,0.17)', 'rgba(255,92,141,0.17)', 'rgba(166,124,255,0.17)'][i]} 0%, rgba(10,10,22,0.98) 80%)`
              }}
            >
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: ['#ff9a5c', '#ff5c8d', '#a67cff'][i], fontWeight: 700, marginBottom: '0.85rem' }}>
                Restore step {i + 1}
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.45rem' }}>{step.title}</h3>
              <p style={{ color: '#cfd6ea', lineHeight: 1.72 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div style={{
          marginTop: '2.4rem',
          display: 'flex',
          gap: '0.9rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {retention.map((item, i) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -6, scale: 1.02 }}
              style={{
                flex: '0 0 220px',
                padding: '1.25rem',
                borderRadius: i === 4 ? '28px' : '18px',
                border: `1px solid ${item.accent}55`,
                background: `linear-gradient(180deg, ${item.accent}20 0%, rgba(8,10,22,0.98) 88%)`
              }}
            >
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: item.accent, fontWeight: 700, marginBottom: '0.55rem' }}>
                {item.label}
              </div>
              <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.3rem' }}>{item.value}</div>
              <div style={{ color: '#cfd6ea', lineHeight: 1.65 }}>Snapshot retention access window.</div>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.5rem' }}>Related Video Guides</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', paddingBottom: '0.4rem' }}>
            {[
              { label: 'Demo', title: 'Saving and Versioning Demo', href: 'https://www.youtube.com/watch?v=Xn8iWNN_12U', accent: '#ff9a5c' },
              { label: 'Reference', title: 'Branching and Commits', href: 'https://docs.flutterflow.io/collaboration/branching#commits', accent: '#a67cff' }
            ].map((item, i) => {
              const isVideo = item.href.includes('youtube.com') || item.href.includes('youtu.be')
              const embedUrl = isVideo ? item.href.replace('watch?v=', 'embed/') : item.href

              return (
                <div
                  key={item.title}
                  style={{
                    borderRadius: '16px',
                    border: `1px solid ${item.accent}55`,
                    background: 'rgba(8,10,24,0.86)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ padding: '1.2rem' }}>
                    <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: item.accent, fontWeight: 700, marginBottom: '0.4rem' }}>
                      {item.label}
                    </div>
                    <div style={{ lineHeight: 1.4, color: '#fff', fontSize: '1.1rem' }}>{item.title}</div>
                  </div>
                  {isVideo ? (
                    <iframe
                      width="100%"
                      height="220"
                      src={embedUrl}
                      title={item.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ display: 'block', marginTop: 'auto' }}
                    />
                  ) : (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '1rem 1.2rem', background: 'rgba(255,255,255,0.05)', color: '#fff', textDecoration: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 'auto', fontWeight: 600 }}>
                      Read Documentation <span>↗</span>
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Module4_3Section() {
  const panelStyle = {
    background: 'linear-gradient(180deg, rgba(7,28,30,0.96) 0%, rgba(8,14,28,0.95) 100%)',
    border: '1px solid rgba(108,240,168,0.2)',
    borderRadius: '24px',
    boxShadow: '0 20px 46px rgba(0,0,0,0.24)'
  }

  const environments = [
    {
      title: 'Development',
      desc: 'Use this environment for feature work, backend experiments, and safe testing away from production data.',
      accent: '#6cf0a8'
    },
    {
      title: 'Staging',
      desc: 'Use staging to simulate production before launch while keeping it isolated from live users and real production traffic.',
      accent: '#00f5d4'
    },
    {
      title: 'Production',
      desc: 'Every project starts with Production by default, making it the baseline environment for deployed behavior.',
      accent: '#61a8ff'
    }
  ]

  const generatedEvents = [
    'Test and Run mode sessions',
    'Local Run',
    'Code export',
    'Deployment'
  ]

  const privateValueRules = [
    'Private environment values are not included in compiled client-side application code.',
    'Private values are not written into environment.json and do not get getters in FFDevEnvironmentValues.',
    'Today they are intended for private API calls routed through generated Cloud Functions.',
    'If a generated cloud function contains sensitive values, review those files carefully before exporting or pushing to GitHub.'
  ]

  const resourceLinks = [
    { title: 'Configuring Firebase or Supabase for each environment', href: 'https://docs.flutterflow.io/testing/dev-environments#configuring-firebase-or-supabase-for-each-environment' },
    { title: 'Environment Values docs', href: 'https://docs.flutterflow.io/testing/dev-environments#environment-values' },
    { title: 'Get Dev Environment Values in custom code', href: 'https://docs.flutterflow.io/concepts/custom-code/common-examples#get-dev-environment-values-in-custom-code' },
    { title: 'Connect an existing Firebase project manually', href: 'https://docs.flutterflow.io/integrations/firebase/connect-to-firebase#connect-an-existing-firebase-project-manually' },
    { title: 'Firestore rules', href: 'https://docs.flutterflow.io/integrations/database/cloud-firestore/firestore-rules' },
    { title: 'Creating Firestore collections', href: 'https://docs.flutterflow.io/integrations/database/cloud-firestore/creating-collections' },
    { title: 'Supabase setup', href: 'https://docs.flutterflow.io/integrations/supabase/setup' }
  ]

  const faq = [
    {
      question: 'How can you push code from one environment to another?',
      answer: 'Development Environments are primarily for backend separation. For feature promotion, use Branching: build on a branch against a dev environment, test it, merge into main, then switch to Production when it is time to go live.'
    },
    {
      question: 'Does FlutterFlow use Flutter flavors under the hood?',
      answer: 'No. FlutterFlow generates environment-specific code based on the environment selected inside FlutterFlow instead of relying on Flutter flavors.'
    },
    {
      question: 'How do you deploy apps for different environments?',
      answer: 'Use the environment dropdown in deployment settings. For mobile you can assign a different package name, and for web you can configure a different site URL.'
    }
  ]

  return (
    <section className="sec" style={{ paddingTop: '0', paddingBottom: '80px' }}>
      <div className="wrap" style={{ paddingTop: '120px' }}>
        <MotionReveal>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <span className="chip" style={{ width: 'max-content', color: '#6cf0a8', border: '1px solid rgba(108,240,168,0.28)', background: 'rgba(108,240,168,0.1)' }}>
              Module 4 - Chapter 4.3
            </span>
            <h1 style={{
              fontSize: 'clamp(2.8rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              background: 'linear-gradient(135deg, #6cf0a8, #00f5d4, #61a8ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Development Environments
            </h1>
            <p style={{ maxWidth: '900px', color: '#c8c8e0', fontSize: '1.06rem', lineHeight: 1.85 }}>
              Development Environments let one FlutterFlow project point at different backends across your lifecycle. You can keep Development, Staging, and Production isolated while generating environment-specific code for testing, export, and deployment.
            </p>
          </div>
        </MotionReveal>

        <div className="chapter-split" style={{ marginTop: '2.2rem', alignItems: 'stretch' }}>
          <div className="split-col">
            <div style={{ ...panelStyle, padding: '2rem' }}>
              <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6cf0a8', fontWeight: 700, marginBottom: '0.9rem' }}>
                Starting point
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '0.8rem' }}>
                Production exists by default
              </h2>
              <p style={{ color: '#d7d7ea', lineHeight: 1.8, marginBottom: '1rem' }}>
                Every FlutterFlow project begins with a Production environment. From there, you can add Development, Staging, or any custom environment names that match your workflow.
              </p>
              <p style={{ color: '#d7d7ea', lineHeight: 1.8 }}>
                The active environment affects generated behavior for items tied to{' '}
                <a href="https://docs.flutterflow.io/testing/dev-environments#environment-values" className="text-link" target="_blank" rel="noopener noreferrer">Environment Values</a>{' '}
                and backend configuration such as{' '}
                <a href="https://docs.flutterflow.io/testing/dev-environments#configuring-firebase-or-supabase-for-each-environment" className="text-link" target="_blank" rel="noopener noreferrer">Firebase or Supabase per environment</a>.
              </p>
            </div>
            <CalloutCard tone="note" title="Best practice">
              Development is for active work, Staging is for production-like verification, and Production is for the live app.
            </CalloutCard>
          </div>

          <div className="chapter-grid">
            {environments.map((item) => (
              <div
                key={item.title}
                style={{
                  ...panelStyle,
                  padding: '1.45rem',
                  borderColor: `${item.accent}44`,
                  background: `linear-gradient(160deg, ${item.accent}15 0%, rgba(8,13,24,0.96) 88%)`
                }}
              >
                <div style={{ fontSize: '0.76rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: item.accent, fontWeight: 700, marginBottom: '0.8rem' }}>
                  {item.title}
                </div>
                <p style={{ color: '#d7d7ea', lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="chapter-split" style={{ marginTop: '2.4rem', alignItems: 'start' }}>
          <div className="split-col">
            <div style={{ ...panelStyle, padding: '2rem' }}>
              <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00f5d4', fontWeight: 700, marginBottom: '0.9rem' }}>
                Generated code
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.65rem', marginBottom: '0.9rem' }}>
                The selected environment drives code generation
              </h2>
              <p style={{ color: '#d7d7ea', lineHeight: 1.8, marginBottom: '1rem' }}>
                FlutterFlow uses the active environment when running, exporting, or deploying your app. That includes the files that expose values through <code>environment.json</code> and the generated <code>FFDevEnvironmentValues</code> helper.
              </p>
              <BulletList items={generatedEvents} />
            </div>
            <div style={{ ...panelStyle, padding: '2rem', borderColor: 'rgba(97,168,255,0.22)' }}>
              <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#61a8ff', fontWeight: 700, marginBottom: '0.9rem' }}>
                Environment values
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.55rem', marginBottom: '0.8rem' }}>
                Example: apiUrl changes by environment
              </h2>
              <p style={{ color: '#d7d7ea', lineHeight: 1.8, marginBottom: '1rem' }}>
                In an e-commerce app, an <code>apiUrl</code> can point to different servers for Development, Staging, and Production so test orders never collide with real customer traffic. You can also access these values inside custom code using the official{' '}
                <a href="https://docs.flutterflow.io/concepts/custom-code/common-examples#get-dev-environment-values-in-custom-code" className="text-link" target="_blank" rel="noopener noreferrer">custom code examples</a>.
              </p>
              <BulletList items={[
                'environment.json stores non-private environment values defined in FlutterFlow.',
                'FFDevEnvironmentValues is the generated singleton that exposes getters for those values.'
              ]} />
            </div>
          </div>

          <div className="split-col">
            <div style={{ ...panelStyle, padding: '2rem', borderColor: 'rgba(255,45,85,0.24)' }}>
              <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ff5c8d', fontWeight: 700, marginBottom: '0.9rem' }}>
                Private environment values
              </div>
              <h2 style={{ color: '#fff', fontSize: '1.55rem', marginBottom: '0.8rem' }}>
                Sensitive values need repository discipline
              </h2>
              <p style={{ color: '#d7d7ea', lineHeight: 1.8, marginBottom: '1rem' }}>
                Private environment values stay out of compiled client code, but if they flow into generated Cloud Functions for private API calls, you still need to review what gets exported or pushed to source control.
              </p>
              <BulletList items={privateValueRules} />
            </div>

            <motion.div
              whileHover={{ y: -6, rotate: -0.25 }}
              style={{ ...panelStyle, padding: '1rem', overflow: 'hidden' }}
            >
              <img
                src="https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114634-5.png"
                alt="FlutterFlow Firebase configuration for different environments"
                style={{ width: '100%', borderRadius: '18px' }}
              />
              <div style={{ padding: '1rem 0.35rem 0.2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', marginBottom: '0.45rem' }}>Backend selection by environment</h3>
                <p style={{ color: '#cdd4e8', lineHeight: 1.7 }}>
                  Each environment needs its own backend setup before you can fully test against it.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="chapter-grid" style={{ marginTop: '2rem' }}>
          {resourceLinks.map((item, i) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...panelStyle,
                padding: '1.2rem',
                textDecoration: 'none',
                borderColor: i % 3 === 0 ? 'rgba(108,240,168,0.22)' : i % 3 === 1 ? 'rgba(0,245,212,0.22)' : 'rgba(97,168,255,0.22)'
              }}
            >
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: i % 3 === 0 ? '#6cf0a8' : i % 3 === 1 ? '#00f5d4' : '#61a8ff', fontWeight: 700, marginBottom: '0.75rem' }}>
                Resource
              </div>
              <div style={{ color: '#fff', fontWeight: 700, lineHeight: 1.55 }}>{item.title}</div>
            </a>
          ))}
        </div>

        <div className="chapter-grid" style={{ marginTop: '2rem' }}>
          {faq.map((item) => (
            <div key={item.question} style={{ ...panelStyle, padding: '1.5rem' }}>
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6cf0a8', fontWeight: 700, marginBottom: '0.75rem' }}>
                FAQ
              </div>
              <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.55rem' }}>{item.question}</h3>
              <p style={{ color: '#d7d7ea', lineHeight: 1.7 }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Module4_4Section() {
  const [currentPage, setCurrentPage] = useState(0)
  const pages = [
    <PageRunYourApp key="run-your-app" />,
    <PageLocalRun key="local-run" />
  ]

  return (
    <section className="sec" style={{ minHeight: '100vh', paddingTop: '0', paddingBottom: '40px' }}>
      <div className="wrap" style={{ flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {pages[currentPage]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="wrap" style={{ paddingBottom: '40px', display: 'flex', justifyContent: 'center', gap: '2rem', alignItems: 'center' }}>
        <motion.button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          whileHover={currentPage !== 0 ? { scale: 1.05, x: -4 } : {}}
          whileTap={currentPage !== 0 ? { scale: 0.96 } : {}}
          className="btn-ghost"
          style={{
            padding: '12px 24px',
            opacity: currentPage === 0 ? 0.35 : 1,
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            borderRadius: '12px'
          }}
        >
          ← Previous Page
        </motion.button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c8c8e0', fontSize: '0.9rem', fontWeight: 700 }}>
          {currentPage + 1} <span style={{ opacity: 0.4 }}>/</span> 2
        </div>
        <motion.button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, 1))}
          disabled={currentPage === 1}
          whileHover={currentPage !== 1 ? { scale: 1.05, x: 4 } : {}}
          whileTap={currentPage !== 1 ? { scale: 0.96 } : {}}
          className="btn-sunset"
          style={{
            padding: '12px 24px',
            opacity: currentPage === 1 ? 0.35 : 1,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #61a8ff, #86ffb7)',
            color: '#03101d',
            fontWeight: 800,
            border: 'none'
          }}
        >
          {currentPage === 1 ? 'Finish' : 'Next Page →'}
        </motion.button>
      </div>
    </section>
  )
}

function PageRunYourApp() {
  const panelStyle = {
    background: 'linear-gradient(180deg, rgba(10,16,36,0.96) 0%, rgba(6,11,24,0.96) 100%)',
    border: '1px solid rgba(97,168,255,0.2)',
    borderRadius: '24px',
    boxShadow: '0 20px 46px rgba(0,0,0,0.24)'
  }

  const modes = [
    {
      title: 'Preview Mode',
      accent: '#86ffb7',
      desc: <>Loads instantly on a virtual device and is best for quick UI checks. Read the <a href="https://docs.flutterflow.io/testing/run-your-app#preview-mode" className="text-link" target="_blank" rel="noopener noreferrer">Preview Mode docs</a>.</>
    },
    {
      title: 'Test Mode',
      accent: '#61a8ff',
      desc: <>Runs a web version of your app with <a href="https://docs.flutter.dev/tools/hot-reload" className="text-link" target="_blank" rel="noopener noreferrer">Hot Reload</a> for fast iteration. See <a href="https://docs.flutterflow.io/testing/run-your-app#test-mode" className="text-link" target="_blank" rel="noopener noreferrer">Test Mode</a>.</>
    },
    {
      title: 'Run Mode',
      accent: '#ffd166',
      desc: <>Builds a fully functional web app with live data and team share links. See <a href="https://docs.flutterflow.io/testing/run-your-app#run-mode" className="text-link" target="_blank" rel="noopener noreferrer">Run Mode</a>.</>
    },
    {
      title: 'Local Run',
      accent: '#ff7d6b',
      desc: <>Downloads code locally so you can use Hot Reload or Hot Restart on a real device. Setup details are in <a href="https://docs.flutterflow.io/testing/run-your-app#local-run" className="text-link" target="_blank" rel="noopener noreferrer">Local Run</a>.</>
    }
  ]

  const previewLimitations = [
    'Actions may not trigger correctly.',
    'Firestore data is not loaded from Firebase.',
    'Firebase auth flow cannot be tested and log in is always allowed.',
    'API calls cannot run here.',
    'RevenueCat data is not loaded and paywall actions behave as if entitlement is active.',
    'Hero animation may fail on dynamically generated widgets.',
    'Dropdown disabling and some tooltip cases do not work properly.',
    'Refresh if animation actions or clear text field actions stop responding.'
  ]

  const testSteps = [
    'Click the Test icon or press Cmd/Ctrl + I to open a test session in a new browser window.',
    'Return to the builder and make edits such as changing colors or alignment.',
    'Use Instant Reload or press Cmd/Ctrl + J in the test tab to see changes in under 10 seconds.'
  ]

  const testLimitations = [
    'Sessions expire after 30 minutes.',
    'If you see a gray broken screen, the docs recommend Cloudflare 1.1.1.1 DNS as a troubleshooting step.',
    'Cookies must be enabled.',
    'Lottie may fail when given a variable path.',
    'Copy to Clipboard is not supported in Test Mode.',
    'Shimmer, Tint animation, or custom-code assets may not render properly.',
    'Audio recording actions do not work in Test Mode.',
    'If the top progress bar lasts more than 15 seconds, refresh the page.'
  ]

  const resources = [
    { title: 'Toolbar', href: 'https://docs.flutterflow.io/flutterflow-ui/toolbar' },
    { title: 'Preview Mode', href: 'https://docs.flutterflow.io/testing/run-your-app#preview-mode' },
    { title: 'Test Mode', href: 'https://docs.flutterflow.io/testing/run-your-app#test-mode' },
    { title: 'Run Mode', href: 'https://docs.flutterflow.io/testing/run-your-app#run-mode' },
    { title: 'Local Run', href: 'https://docs.flutterflow.io/testing/run-your-app#local-run' },
    { title: 'Flutter Hot Reload docs', href: 'https://docs.flutter.dev/tools/hot-reload' },
    { title: 'Cloudflare 1.1.1.1 setup', href: 'https://developers.cloudflare.com/1.1.1.1/setup/' },
    { title: 'FlutterFlow pricing', href: 'https://flutterflow.io/pricing' },
    { title: 'Local Run setup guide', href: 'https://docs.flutterflow.io/testing/local-run' }
  ]

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '40px' }}>
      <MotionReveal>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <span className="chip" style={{ width: 'max-content', color: '#61a8ff', border: '1px solid rgba(97,168,255,0.28)', background: 'rgba(97,168,255,0.1)' }}>
            Module 4 - Chapter 4.4 · Page 1
          </span>
          <h1 style={{
            fontSize: 'clamp(2.8rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            background: 'linear-gradient(135deg, #86ffb7, #61a8ff, #ffd166)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Testing Your App
          </h1>
          <p style={{ maxWidth: '900px', color: '#c8c8e0', fontSize: '1.06rem', lineHeight: 1.85 }}>
            Running and testing is a core part of the FlutterFlow workflow. You can access Preview, Test, Run, and Local Run from the{' '}
            <a href="https://docs.flutterflow.io/flutterflow-ui/toolbar" className="text-link" target="_blank" rel="noopener noreferrer">Toolbar</a>, and each mode is optimized for a different stage of validation.
          </p>
        </div>
      </MotionReveal>

      <div className="chapter-grid" style={{ marginTop: '2rem' }}>
        {modes.map((item) => (
          <div
            key={item.title}
            style={{
              ...panelStyle,
              padding: '1.5rem',
              borderColor: `${item.accent}44`,
              background: `linear-gradient(160deg, ${item.accent}15 0%, rgba(7,12,26,0.96) 88%)`
            }}
          >
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: item.accent, fontWeight: 700, marginBottom: '0.8rem' }}>
              {item.title}
            </div>
            <p style={{ color: '#d7d7ea', lineHeight: 1.75 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="chapter-split" style={{ marginTop: '2.4rem', alignItems: 'start' }}>
        <div className="split-col">
          <div style={{ ...panelStyle, padding: '2rem', borderColor: 'rgba(134,255,183,0.22)' }}>
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#86ffb7', fontWeight: 700, marginBottom: '0.9rem' }}>
              Preview Mode
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.65rem', marginBottom: '0.8rem' }}>
              Best for instant UI checks
            </h2>
            <p style={{ color: '#d7d7ea', lineHeight: 1.8, marginBottom: '1rem' }}>
              Preview Mode loads immediately, which makes it excellent for checking navigation, layout, dark and light themes, and responsive device views. It is less useful for business logic because many runtime systems are intentionally absent.
            </p>
            <BulletList items={previewLimitations} />
          </div>
        </div>

        <div className="split-col">
          <div style={{ ...panelStyle, padding: '2rem', borderColor: 'rgba(97,168,255,0.22)' }}>
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#61a8ff', fontWeight: 700, marginBottom: '0.9rem' }}>
              Test Mode
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.65rem', marginBottom: '0.8rem' }}>
              Fast iteration with Hot Reload
            </h2>
            <StepsList steps={testSteps} />
            <div className="chapter-grid tight" style={{ marginTop: '1rem' }}>
              {[
                ['Orange', 'Building'],
                ['Green', 'Ready'],
                ['Yellow', 'Expiring Soon'],
                ['Red', 'Expired']
              ].map(([label, meaning]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '0.95rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: label.toLowerCase(), fontWeight: 800, marginBottom: '0.25rem' }}>{label}</div>
                  <div style={{ color: '#d7d7ea', lineHeight: 1.6 }}>{meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="chapter-split" style={{ marginTop: '2.4rem', alignItems: 'start' }}>
        <div className="split-col">
          <div style={{ ...panelStyle, padding: '2rem', borderColor: 'rgba(255,209,102,0.22)' }}>
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffd166', fontWeight: 700, marginBottom: '0.9rem' }}>
              Test Mode limitations
            </div>
            <p style={{ color: '#d7d7ea', lineHeight: 1.8, marginBottom: '1rem' }}>
              Test Mode is one of the fastest feedback loops in FlutterFlow, but it is still a cloud-configured web environment with web-only constraints.
            </p>
            <BulletList items={testLimitations} />
          </div>

          <motion.div
            whileHover={{ y: -6 }}
            style={{ ...panelStyle, padding: '1rem', overflow: 'hidden' }}
          >
            <img
              src="https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114722-6.png"
              alt="FlutterFlow Test Mode debug info panel"
              style={{ width: '100%', borderRadius: '18px' }}
            />
            <div style={{ padding: '1rem 0.35rem 0.2rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.45rem' }}>Debug Info panel</h3>
              <p style={{ color: '#cdd4e8', lineHeight: 1.7 }}>
                Test Mode includes a live variable inspector with search and filtering, which is extremely helpful for tracking state during debugging.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="split-col">
          <div style={{ ...panelStyle, padding: '2rem', borderColor: 'rgba(255,125,107,0.22)' }}>
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ff7d6b', fontWeight: 700, marginBottom: '0.9rem' }}>
              Run Mode
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.65rem', marginBottom: '0.8rem' }}>
              Best for functional web sharing
            </h2>
            <p style={{ color: '#d7d7ea', lineHeight: 1.8, marginBottom: '1rem' }}>
              Run Mode builds a fully functional web version of the app, usually in 2 to 4 minutes for typical projects. It is useful when you need live data and a shareable session for team members.
            </p>
            <BulletList items={[
              'Run Mode links are not public; they are restricted to project members.',
              'Sessions persist in the dropdown next to the lightning bolt icon.',
              'Run Mode does not support Hot Reload, so you need a new run to see later edits.'
            ]} />
          </div>

          <motion.div
            whileHover={{ y: -6 }}
            style={{ ...panelStyle, padding: '1rem', overflow: 'hidden' }}
          >
            <img
              src="https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114722-7.png"
              alt="FlutterFlow run mode sessions list"
              style={{ width: '100%', borderRadius: '18px' }}
            />
            <div style={{ padding: '1rem 0.35rem 0.2rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.45rem' }}>Run session history</h3>
              <p style={{ color: '#cdd4e8', lineHeight: 1.7 }}>
                Existing Run Mode sessions stay available from the session dropdown, which makes repeated team testing easier.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="chapter-grid" style={{ marginTop: '2rem' }}>
        {resources.map((item, i) => (
          <a
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...panelStyle,
              padding: '1.15rem',
              textDecoration: 'none',
              borderColor: i % 4 === 0 ? 'rgba(134,255,183,0.22)' : i % 4 === 1 ? 'rgba(97,168,255,0.22)' : i % 4 === 2 ? 'rgba(255,209,102,0.22)' : 'rgba(255,125,107,0.22)'
            }}
          >
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: i % 4 === 0 ? '#86ffb7' : i % 4 === 1 ? '#61a8ff' : i % 4 === 2 ? '#ffd166' : '#ff7d6b', fontWeight: 700, marginBottom: '0.75rem' }}>
              Link
            </div>
            <div style={{ color: '#fff', fontWeight: 700, lineHeight: 1.55 }}>{item.title}</div>
          </a>
        ))}
      </div>
    </div>
  )
}

function PageLocalRun() {
  const panelStyle = {
    background: 'linear-gradient(180deg, rgba(9,14,31,0.96) 0%, rgba(6,10,22,0.96) 100%)',
    border: '1px solid rgba(134,255,183,0.18)',
    borderRadius: '24px',
    boxShadow: '0 20px 46px rgba(0,0,0,0.24)'
  }

  const setupSteps = [
    <>Download the <a href="https://flutterflow.io/desktop" className="text-link" target="_blank" rel="noopener noreferrer">FlutterFlow Desktop App</a> and open your project.</>,
    <>From the <a href="https://docs.flutterflow.io/flutterflow-ui/toolbar" className="text-link" target="_blank" rel="noopener noreferrer">Toolbar</a>, open the Test dropdown and choose Setup Local Run.</>,
    'Download the Flutter SDK inside the wizard. On iOS, make sure Xcode and CocoaPods are already installed before continuing.',
    'Run Flutter Doctor from the wizard so FlutterFlow can validate your local setup.',
    <>Optionally configure your preferred IDE and related paths. The docs call out <a href="https://docs.flutterflow.io/testing/local-run#2-setup-flutter-sdk" className="text-link" target="_blank" rel="noopener noreferrer">Flutter SDK</a> and <a href="https://docs.flutterflow.io/testing/local-run#3-installing-ide-and-plugins" className="text-link" target="_blank" rel="noopener noreferrer">IDE setup</a> as prerequisites.</>,
    'Choose whether local exports should be formatted. Disabling formatting can speed up iteration, but formatted code is easier to inspect.',
    <>Use Get Devices, pick your emulators or physical devices, and press Test. For device setup, see <a href="https://docs.flutterflow.io/testing/local-run#setup-physical-device" className="text-link" target="_blank" rel="noopener noreferrer">physical device setup</a>.</>,
    <>Use Hot Reload or Hot Restart from the test menu after edits. FlutterFlow also references <a href="https://docs.flutter.dev/tools/hot-reload" className="text-link" target="_blank" rel="noopener noreferrer">Flutter Hot Reload</a> docs directly.</>
  ]

  const prerequisites = [
    <>Local Run and code download require <a href="https://flutterflow.io/pricing" className="text-link" target="_blank" rel="noopener noreferrer">paid plans</a>.</>,
    <>For iOS you need a Mac with Xcode. Follow the official <a href="https://docs.flutter.dev/get-started/install/macos/mobile-ios?tab=download#configure-ios-development" className="text-link" target="_blank" rel="noopener noreferrer">iOS setup instructions</a> and <a href="https://docs.flutter.dev/get-started/install/macos/mobile-ios?tab=download#configure-your-target-ios-device" className="text-link" target="_blank" rel="noopener noreferrer">target device setup</a>.</>,
    <>For Android, use the relevant setup guide for <a href="https://docs.flutter.dev/get-started/install/windows/mobile?tab=virtual" className="text-link" target="_blank" rel="noopener noreferrer">Windows</a>, <a href="https://docs.flutter.dev/get-started/install/macos/mobile-android?tab=virtual" className="text-link" target="_blank" rel="noopener noreferrer">Mac</a>, or <a href="https://docs.flutter.dev/get-started/install/linux#android-setup" className="text-link" target="_blank" rel="noopener noreferrer">Linux</a>, then complete <a href="https://docs.flutter.dev/get-started/install/macos/mobile-android?tab=virtual#configure-android-development" className="text-link" target="_blank" rel="noopener noreferrer">Android development</a> and <a href="https://docs.flutter.dev/get-started/install/macos/mobile-android?tab=virtual#configure-your-target-android-device" className="text-link" target="_blank" rel="noopener noreferrer">target device configuration</a>.</>
  ]

  const notes = [
    'Local Run uses its own isolated Flutter SDK for compatibility and consistency.',
    'Changes you make directly in the IDE do not sync back to FlutterFlow and will be overwritten on the next hot reload or restart.',
    'On Windows, the IDE executable path is typically under Program Files. On macOS, it is usually under Applications.',
    <>See <a href="https://docs.flutterflow.io/testing/local-run#access-project-code" className="text-link" target="_blank" rel="noopener noreferrer">Access Project Code</a> for the code-opening flow.</>
  ]

  const manualRunSteps = [
    <>Download code with the <a href="https://docs.flutterflow.io/exporting/ff-cli" className="text-link" target="_blank" rel="noopener noreferrer">FlutterFlow CLI</a> or Toolbar &gt; Developer Menu &gt; Download Code. The docs recommend the CLI.</>,
    <>Install a compatible SDK. FlutterFlow recommends using the SDK downloaded by Local Run, but the general Flutter installer is also available <a href="https://docs.flutter.dev/get-started/install" className="text-link" target="_blank" rel="noopener noreferrer">here</a>.</>,
    <>Install either <a href="https://code.visualstudio.com/" className="text-link" target="_blank" rel="noopener noreferrer">Visual Studio Code</a> or <a href="https://developer.android.com/studio" className="text-link" target="_blank" rel="noopener noreferrer">Android Studio</a> plus the official Flutter and Dart plugins. Setup guides: <a href="https://flutter.dev/docs/get-started/editor?tab=vscode" className="text-link" target="_blank" rel="noopener noreferrer">VS Code</a> and <a href="https://flutter.dev/docs/get-started/editor?tab=androidstudio" className="text-link" target="_blank" rel="noopener noreferrer">Android Studio</a>.</>,
    <>Run on a device by opening the project, running <code>flutter pub get</code>, then using <code>flutter run</code> or the IDE run action. The docs also break this out as <a href="https://docs.flutterflow.io/testing/local-run#1-download-code" className="text-link" target="_blank" rel="noopener noreferrer">Download Code</a>, <a href="https://docs.flutterflow.io/testing/local-run#2-setup-flutter-sdk" className="text-link" target="_blank" rel="noopener noreferrer">Setup Flutter SDK</a>, <a href="https://docs.flutterflow.io/testing/local-run#3-installing-ide-and-plugins" className="text-link" target="_blank" rel="noopener noreferrer">Installing IDE and Plugins</a>, and <a href="https://docs.flutterflow.io/testing/local-run#4-running-app-on-device" className="text-link" target="_blank" rel="noopener noreferrer">Running App on Device</a>.</>
  ]

  const resourceLinks = [
    { title: 'Local Run main guide', href: 'https://docs.flutterflow.io/testing/local-run' },
    { title: 'Using Local Run', href: 'https://docs.flutterflow.io/testing/local-run#using-local-run' },
    { title: 'Troubleshooting', href: 'https://docs.flutterflow.io/testing/local-run#troubleshooting' },
    { title: 'Setup physical device', href: 'https://docs.flutterflow.io/testing/local-run#setup-physical-device' },
    { title: 'Access project code', href: 'https://docs.flutterflow.io/testing/local-run#access-project-code' },
    { title: 'Video guide', href: 'https://youtu.be/k9NpYncXC_U' },
    { title: 'Android add-to-app', href: 'https://docs.flutter.dev/add-to-app/android/project-setup' },
    { title: 'iOS add-to-app', href: 'https://docs.flutter.dev/add-to-app/ios/project-setup' }
  ]

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '40px' }}>
      <MotionReveal>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <span className="chip" style={{ width: 'max-content', color: '#86ffb7', border: '1px solid rgba(134,255,183,0.28)', background: 'rgba(134,255,183,0.1)' }}>
            Module 4 - Chapter 4.4 · Page 2
          </span>
          <h1 style={{
            fontSize: 'clamp(2.8rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            background: 'linear-gradient(135deg, #86ffb7, #61a8ff, #ff7d6b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Local Run
          </h1>
          <p style={{ maxWidth: '920px', color: '#c8c8e0', fontSize: '1.06rem', lineHeight: 1.85 }}>
            Local Run lets you test on real devices through the FlutterFlow Desktop App, automatically downloads project code, and supports Hot Reload or Hot Restart. It is the closest loop to working like a native Flutter developer while still staying tied to FlutterFlow output.
          </p>
        </div>
      </MotionReveal>

      <div className="chapter-split" style={{ marginTop: '2.2rem', alignItems: 'stretch' }}>
        <div className="split-col">
          <div style={{ ...panelStyle, padding: '2rem' }}>
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#86ffb7', fontWeight: 700, marginBottom: '0.9rem' }}>
              Prerequisites
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.7rem', marginBottom: '0.8rem' }}>
              Prepare your machine before testing
            </h2>
            <BulletList items={prerequisites} />
          </div>
          <div style={{ ...panelStyle, padding: '1rem', overflow: 'hidden' }}>
            <img
              src="https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114837-22.png"
              alt="FlutterFlow local run setup menu"
              style={{ width: '100%', borderRadius: '18px' }}
            />
            <div style={{ padding: '1rem 0.35rem 0.2rem', color: '#cdd4e8', lineHeight: 1.7 }}>
              Start from the Test dropdown and choose Setup Local Run to begin the guided flow.
            </div>
          </div>
        </div>

        <div className="split-col">
          <div style={{ ...panelStyle, padding: '2rem', borderColor: 'rgba(97,168,255,0.22)' }}>
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#61a8ff', fontWeight: 700, marginBottom: '0.9rem' }}>
              Local Run workflow
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.65rem', marginBottom: '0.8rem' }}>
              Eight-step setup path
            </h2>
            <StepsList steps={setupSteps} />
          </div>
          <div className="chapter-grid tight">
            {[
              'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114837-23.png',
              'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114837-24.png',
              'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114837-25.png',
              'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114837-27.png'
            ].map((src, i) => (
              <div key={src} style={{ ...panelStyle, padding: '1rem', overflow: 'hidden', borderColor: i % 2 === 0 ? 'rgba(134,255,183,0.22)' : 'rgba(97,168,255,0.22)' }}>
                <img src={src} alt={`Local Run step ${i + 1}`} style={{ width: '100%', borderRadius: '16px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chapter-split" style={{ marginTop: '2.4rem', alignItems: 'start' }}>
        <div className="split-col">
          <div style={{ ...panelStyle, padding: '2rem', borderColor: 'rgba(255,209,102,0.22)' }}>
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffd166', fontWeight: 700, marginBottom: '0.9rem' }}>
              Important notes
            </div>
            <BulletList items={notes} />
          </div>
          <div className="step-media" style={{ borderRadius: '24px', border: '1px solid rgba(97,168,255,0.2)' }}>
            <iframe
              src="https://demo.arcade.software/PdTDtCPA6dmY2N4ziJ1A?embed&show_copy_link=true"
              title="Local Run device setup demo"
              allowFullScreen
            />
          </div>
        </div>

        <div className="split-col">
          <div style={{ ...panelStyle, padding: '2rem', borderColor: 'rgba(255,125,107,0.22)' }}>
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ff7d6b', fontWeight: 700, marginBottom: '0.9rem' }}>
              Physical devices
            </div>
            <p style={{ color: '#d7d7ea', lineHeight: 1.8, marginBottom: '1rem' }}>
              To test on a real device, open the project through Android Studio or Xcode from Local Run. Android requires Developer Options plus USB debugging, while iOS requires Apple ID setup, signing, and provisioning in Xcode.
            </p>
            <BulletList items={[
              <>Android device setup is covered in the official <a href="https://docs.flutter.dev/get-started/install/macos/mobile-android#configure-your-target-android-device" className="text-link" target="_blank" rel="noopener noreferrer">Android Flutter docs</a>.</>,
              <>iOS physical device setup is covered in the official <a href="https://docs.flutter.dev/get-started/install/macos/mobile-ios#configure-your-target-ios-device" className="text-link" target="_blank" rel="noopener noreferrer">iOS Flutter docs</a>.</>,
              'Use flutter devices to verify that your target hardware is recognized before running.'
            ]} />
          </div>
          <div style={{ ...panelStyle, padding: '1rem', overflow: 'hidden' }}>
            <img
              src="https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114837-28.png"
              alt="Open project in Android Studio or Xcode from Local Run"
              style={{ width: '100%', borderRadius: '18px' }}
            />
          </div>
        </div>
      </div>

      <div className="chapter-split" style={{ marginTop: '2.4rem', alignItems: 'start' }}>
        <div className="split-col">
          <div style={{ ...panelStyle, padding: '2rem' }}>
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#61a8ff', fontWeight: 700, marginBottom: '0.9rem' }}>
              Logs and console input
            </div>
            <p style={{ color: '#d7d7ea', lineHeight: 1.8, marginBottom: '1rem' }}>
              Device logs help explain runtime problems and app state. FlutterFlow also exposes console input commands so you can trigger Hot Reload with <code>r</code> or Hot Restart with <code>R</code> directly from the logs window.
            </p>
            <BulletList items={[
              'Open Logs from the test menu after the app is running.',
              'Use console input for hot reload, hot restart, or normal Flutter run commands.',
              'Errors shown in the red error box are also recorded in device logs for debugging.'
            ]} />
          </div>
          <div className="step-media" style={{ borderRadius: '24px', border: '1px solid rgba(134,255,183,0.2)' }}>
            <iframe
              src="https://demo.arcade.software/fraMoCbFDhzunNgBN852?embed&show_copy_link=true"
              title="Local Run logs and console demo"
              allowFullScreen
            />
          </div>
        </div>

        <div className="split-col">
          {[
            'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114837-29.png',
            'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114837-30.png',
            'https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114837-31.png'
          ].map((src, i) => (
            <div key={src} style={{ ...panelStyle, padding: '1rem', overflow: 'hidden', borderColor: i === 0 ? 'rgba(97,168,255,0.22)' : i === 1 ? 'rgba(255,125,107,0.22)' : 'rgba(255,209,102,0.22)' }}>
              <img src={src} alt={`Local Run utility ${i + 1}`} style={{ width: '100%', borderRadius: '18px' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="chapter-split" style={{ marginTop: '2.4rem', alignItems: 'start' }}>
        <div className="split-col">
          <div style={{ ...panelStyle, padding: '2rem', borderColor: 'rgba(97,168,255,0.22)' }}>
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#61a8ff', fontWeight: 700, marginBottom: '0.9rem' }}>
              Manual download and run
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.65rem', marginBottom: '0.8rem' }}>
              Best when you need full code control
            </h2>
            <BulletList items={manualRunSteps} />
          </div>
          <div style={{ ...panelStyle, padding: '1rem', overflow: 'hidden' }}>
            <img
              src="https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114837-32.png"
              alt="Flutter SDK path copy in Local Run"
              style={{ width: '100%', borderRadius: '18px' }}
            />
          </div>
        </div>

        <div className="split-col">
          <div style={{ ...panelStyle, padding: '1.4rem' }}>
            <div style={{ fontSize: '0.76rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#86ffb7', fontWeight: 700, marginBottom: '0.9rem' }}>
              CLI and terminal commands
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#d7d7ea', fontSize: '0.92rem', lineHeight: 1.7 }}>
              <code>{`dart pub global activate flutterflow_cli
flutterflow export-code --project <project id> --dest <output folder> --include-assets --token <token> --as-module
flutter --version
flutter downgrade <version_number>
flutter upgrade --force <version_number>
flutter pub get
flutter run
flutter devices
flutter emulators --launch <emulator_id>
flutter clean`}</code>
            </pre>
          </div>
          <div style={{ ...panelStyle, padding: '1rem', overflow: 'hidden' }}>
            <img
              src="https://login.skillizee.io/s/articles/69bb947cbba4ebf527bce93e/images/image-20260319114837-33.png"
              alt="Check FlutterFlow project version"
              style={{ width: '100%', borderRadius: '18px' }}
            />
          </div>
        </div>
      </div>

      <div className="chapter-grid" style={{ marginTop: '2rem' }}>
        {[
          ['Command not found: flutter', 'The docs recommend copying the Local Run SDK path from the wizard and adding it to your system path manually.', '#ff7d6b'],
          ['Device not showing', 'Run flutter devices, restart the simulator if needed, and use flutter emulators --launch <emulator_id> when you need to relaunch it.', '#61a8ff'],
          ['Xcode workspace warning', 'This is usually safe to ignore. Save work, reopen Xcode if needed, clean the build folder, or run flutter clean when files drift.', '#ffd166']
        ].map(([title, desc, accent]) => (
          <div key={title} style={{ ...panelStyle, padding: '1.5rem', borderColor: `${accent}44` }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: accent, fontWeight: 700, marginBottom: '0.75rem' }}>
              Troubleshooting
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>{title}</h3>
            <p style={{ color: '#d7d7ea', lineHeight: 1.7 }}>{desc}</p>
          </div>
        ))}
      </div>

      <div className="chapter-split" style={{ marginTop: '2rem', alignItems: 'start' }}>
        <div className="split-col">
          <div style={{ ...panelStyle, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#86ffb7', fontWeight: 700, marginBottom: '0.75rem' }}>
              Desktop target
            </div>
            <p style={{ color: '#d7d7ea', lineHeight: 1.75 }}>
              Desktop testing requires enabling the target platform under Settings and Integrations &gt; Project Setup &gt; Platforms. If you are targeting both mobile and desktop, the docs recommend responsive design adjustments and{' '}
              <a href="https://docs.flutterflow.io/concepts/layouts/responsive#responsive-visibility" className="text-link" target="_blank" rel="noopener noreferrer">Responsive Visibility</a>.
            </p>
          </div>
          <div style={{ ...panelStyle, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#61a8ff', fontWeight: 700, marginBottom: '0.75rem' }}>
              FAQ
            </div>
            <p style={{ color: '#d7d7ea', lineHeight: 1.75 }}>
              Yes, you can export as a Flutter module by using the CLI with <code>--as-module</code>. After export, follow the official{' '}
              <a href="https://docs.flutter.dev/add-to-app/android/project-setup" className="text-link" target="_blank" rel="noopener noreferrer">Android</a>{' '}
              and{' '}
              <a href="https://docs.flutter.dev/add-to-app/ios/project-setup" className="text-link" target="_blank" rel="noopener noreferrer">iOS</a>{' '}
              add-to-app instructions.
            </p>
          </div>
        </div>

        <div className="chapter-grid">
          {resourceLinks.map((item, i) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...panelStyle,
                padding: '1.1rem',
                textDecoration: 'none',
                borderColor: i % 4 === 0 ? 'rgba(134,255,183,0.22)' : i % 4 === 1 ? 'rgba(97,168,255,0.22)' : i % 4 === 2 ? 'rgba(255,125,107,0.22)' : 'rgba(255,209,102,0.22)'
              }}
            >
              <div style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: i % 4 === 0 ? '#86ffb7' : i % 4 === 1 ? '#61a8ff' : i % 4 === 2 ? '#ff7d6b' : '#ffd166', fontWeight: 700, marginBottom: '0.7rem' }}>
                Resource
              </div>
              <div style={{ color: '#fff', fontWeight: 700, lineHeight: 1.55 }}>{item.title}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}


/* ═══════ FLOATING WIDGETS ═══════ */
function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <motion.button 
      className="fullscreen-btn"
      onClick={toggleFullscreen}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c8c8e0',
        cursor: 'pointer'
      }}
    >
      {isFullscreen ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m13-5v3a2 2 0 0 0 2 2h3M3 16h3a2 2 0 0 1 2 2v3m13-5h-3a2 2 0 0 0-2 2v3"/></svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
      )}
    </motion.button>
  )
}

/* ═══════ MODULE 5 ═══════ */

function Module5_1Section() {
  const containerRef = useReveal()

  const relevantProjects = [
    { name: "Sample Apps", desc: "Official collection: Meal Planner (UI/state demo), e-commerce prototypes. Includes JSON exports for quick starts.", link: "https://github.com/FlutterFlow/sample-apps", module: "Modules 1-3" },
    { name: "E-commerce Mobile App", desc: "Full shop app with Firebase auth, payments, and file uploads. Android/iOS ready.", link: "https://github.com/TBR-Group-software/flutterflow_ecommerce_app", module: "Module 3" },
    { name: "Quiz Creation App", desc: "Features Firebase DB, animations, custom transitions. Great for testing workflows.", link: "https://github.com/extrawest/flutterflow_quiz_creation_app", module: "Modules 3-4" },
    { name: "Flutter Samples", desc: "Broader Flutter demos adaptable to FF; includes BLE/IoT for advanced custom code.", link: "https://github.com/flutter/samples", module: "Module 5" },
    { name: "Socket Example", desc: "Real-time chat with WebSockets; exportable to GitHub for collab.", link: "https://github.com/stepanic/flutterflow-socket-example", module: "Module 4" }
  ]

  const embeddedLinks = [
    { title: "Rive Simulations (for Animations, Module 3)", desc: "Embed Rive player for hero/page transitions. Playable demo—fork and import to FF.", link: "https://rive.app/community/3D-1551234567890", name: "Runner Boy Animation" },
    { title: "LottieFiles Demos (Module 3)", desc: "Interactive JSON previews. Upload to FF for widget tests.", link: "https://lottiefiles.com/preview/12345", name: "Star Loading Animation" },
    { title: "FF Community Playground", desc: "For testing/running, live previews of projects like fitness apps—simulate state changes.", link: "https://www.flutterflow.io/templates", name: "FlutterFlow Templates" },
    { title: "GitHub Codespaces (Module 5)", desc: "Embed quick-run links for Local Run sim (no install needed).", link: "https://github.com/codespaces", name: "Open E-commerce in Codespaces" }
  ]

  const playStoreSteps = [
    {
      title: "1. Prerequisites",
      content: "Before deploying, ensure your app is production-ready: Test on real devices via Local Run, set a non-transparent launcher icon (no alpha channels), and finalize the package name (e.g., com.yourapp.name)—it can't change later. Create a Google Play Developer account ($25 one-time fee) and verify your app complies with policies. If using Firebase, link it early for seamless auth/push notifications.",
      steps: ["Sign up at play.google.com/console.", "In FlutterFlow: Settings > App Settings > General > App Details (set package name/icon).", "Run pre-publish checks: Deployment > Pre-Publish Checks > Run All."],
      videoDesc: "Deploy to Google Play Store | FlutterFlow University (0:00-1:30)",
      videoLink: "https://www.youtube.com/watch?v=kLfcAzAHA6o",
      image: "https://login.skillizee.io/s/articles/69bcfbf7d54aea36df35001f/images/image-20260320132014-13.png"
    },
    {
      title: "2. Creating App in Console",
      content: "Start by registering your app in the console to generate a unique ID. Choose 'Free' or 'Paid' upfront—switching later requires support tickets. Enable testing tracks (Internal for betas, Closed for select users) to iterate safely without full reviews.",
      steps: ["Log in to Google Play Console > Create App.", "Enter app name, default language, and type.", "Accept declarations > Create App.", "Go to 'Set up your app' > Complete tasks (Store listing, rating, pricing)."],
      videoDesc: "FlutterFlow - Google Play Store Deployment (1:30-3:00)",
      videoLink: "https://www.youtube.com/watch?v=wKiegEoE_Iw",
      image: "https://login.skillizee.io/s/articles/69bcfbf7d54aea36df35001f/images/image-20260320132014-14.png"
    },
    {
      title: "3. Service Account & Keystore",
      content: "Service accounts automate uploads from FlutterFlow to Play Console. Generate a JSON key from Google Cloud, grant it release permissions, and upload to FF. For signing, FlutterFlow auto-generates a keystore, but upload a custom one for consistency across builds.",
      steps: ["Create Google Cloud Project > Enable Android Publisher.", "IAM & Admin > Service Accounts > Create > Add JSON key.", "Play Console > Setup > API Access > Invite with 'Release apps'.", "FF: Settings > Mobile Deployment > Google Play > Upload Credentials."],
      videoDesc: "Deploy to Google Play Store | FlutterFlow University (3:00-6:00)",
      videoLink: "https://www.youtube.com/watch?v=kLfcAzAHA6o",
      image: "https://login.skillizee.io/s/articles/69bcfbf7d54aea36df35001f/images/image-20260320132014-15.png"
    },
    {
      title: "4. Building and Deploying",
      content: "Build AAB files directly in FF—monitor status for errors. Deploy to tracks: Internal (up to 100 testers), Alpha/Beta, or Production. Auto-increment version codes; use release notes for changelogs. For betas, add testers via email groups.",
      steps: ["FF: Mobile Deployment > Set Track > Deploy to Play Store.", "Check Build Status > Download AAB (first time).", "Play Console: Internal Testing > Create Release > Upload AAB > Start Rollout.", "Promote: Internal > Production."],
      videoDesc: "Publish On Play Store - Step By Step (0:00-7:00)",
      videoLink: "https://www.youtube.com/watch?v=wXbo9uY39uA",
      image: "https://login.skillizee.io/s/articles/69bcfbf7d54aea36df35001f/images/image-20260320132014-16.jpeg"
    },
    {
      title: "5. Verifying and Monitoring",
      content: "Post-deploy, check version codes in Play Console for increments. Use pre-launch reports for automated tests. Integrate Firebase Analytics for user metrics; enable A/B testing for features. Monitor reviews and update via new deploys.",
      steps: ["Play Console > Internal Testing > Releases > Verify version.", "Add testers > Share opt-in link.", "FF Dashboard > View build history/logs."],
      videoDesc: "Google Play Store Deployment - Walkthrough (7:00-9:00)",
      videoLink: "https://www.youtube.com/watch?v=uc1XuKUVv94",
      image: "https://login.skillizee.io/s/articles/69bcfbf7d54aea36df35001f/images/image-20260320132014-17.png"
    },
    {
      title: "6. Troubleshooting Issues",
      content: "Common issues encountered during deployment and how to resolve them efficiently.",
      steps: ["Signing Errors: Mismatched keystore—re-upload and verify.", "Upload Failures: Enable 'Changes Not Sent for Review' in FF.", "Policy Violations: Fill all 'Set up your app' tasks.", "No AAB Generated: Check service account, regenerate JSON."],
      videoDesc: "Google PlayStore Deployment Tutorial (9:00-end)",
      videoLink: "https://www.youtube.com/watch?v=z3RbgbVR2fo",
      image: "https://login.skillizee.io/s/articles/69bcfbf7d54aea36df35001f/images/image-20260320132014-18.jpeg"
    }
  ]

  return (
    <section className="sec" ref={containerRef}>
      <SectionHeroBackdrop height={400} opacity={0.6} />
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        
        <MotionReveal>
          <div className="section-head">
            <h5 className="accent-text">Module 5 - Chapter 1</h5>
            <h2>Deploying on Play Store</h2>
            <p style={{ maxWidth: '800px', fontSize: '1.2rem', color: '#c8c8e0', lineHeight: 1.6 }}>
              Deploying your FlutterFlow app to the Google Play Store transforms your prototype into a live, downloadable Android experience for millions of users. 
              This process leverages one-click builds via Codemagic.
            </p>
          </div>
        </MotionReveal>

        {/* Relevant Projects Table / Grid */}
        <MotionReveal delay={0.1}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Relevant Projects</h3>
          <p style={{ color: '#a9a9c6', marginBottom: '2rem' }}>These open-source GitHub repos serve as hands-on examples. Clone them for demos or Run and Test projects.</p>
          <div className="chapter-grid">
            {relevantProjects.map((proj, i) => (
              <NeonCard key={proj.name} className="gsap-child">
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>{proj.name}</h4>
                    <span style={{ background: '#7b2ff730', color: '#b388ff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{proj.module}</span>
                  </div>
                  <p style={{ color: '#c8c8e0', fontSize: '0.92rem', lineHeight: 1.5, flex: 1 }}>{proj.desc}</p>
                  <a href={proj.link} className="arrow-link" style={{ fontSize: '0.9rem', color: '#00f5d4' }} target="_blank" rel="noopener noreferrer">
                    View GitHub Repo <span>→</span>
                  </a>
                </div>
              </NeonCard>
            ))}
          </div>
        </MotionReveal>

        {/* Embedded Links */}
        <MotionReveal delay={0.2} style={{ marginTop: '5rem' }}>
          <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Embedded Links with Simulations</h3>
          <p style={{ color: '#a9a9c6', marginBottom: '2rem', maxWidth: '800px' }}>Interactive simulation links for testing logic, animations, and flows.</p>
          <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {embeddedLinks.map((link, i) => (
              <TerminalCard key={link.title} command={`open ${link.name.replace(/\s+/g, '_').toLowerCase()}`} className="gsap-child">
                <div style={{ display: 'grid', gap: '0.6rem' }}>
                  <h4 style={{ color: '#00f5d4', fontSize: '1.05rem', margin: 0 }}>{link.title}</h4>
                  <p style={{ color: '#a9a9c6', fontSize: '0.9rem', lineHeight: 1.5 }}>{link.desc}</p>
                  <a href={link.link} target="_blank" rel="noopener noreferrer" style={{ color: '#ffd700', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                    {link.name}
                  </a>
                </div>
              </TerminalCard>
            ))}
          </div>
        </MotionReveal>

        {/* Play Store Steps Sequence */}
        <div style={{ marginTop: '6rem' }}>
          {playStoreSteps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <MotionReveal key={step.title} delay={0.1}>
                <div 
                  className="gsap-child"
                  style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                    gap: '3rem', alignItems: 'center', marginBottom: '5rem',
                    direction: isEven ? 'ltr' : 'rtl'
                  }}
                >
                  {/* Text Content */}
                  <div style={{ direction: 'ltr' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.2rem', color: '#f59e0b', background: '#f59e0b20', padding: '0.4rem 0.8rem', borderRadius: '8px' }}><i className="fas fa-play" /></span>
                      {step.title}
                    </h3>
                    {step.content && <p style={{ color: '#c8c8e0', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{step.content}</p>}
                    
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                      <h4 style={{ color: '#7b2ff7', fontSize: '1rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 700 }}>Key Action Steps</h4>
                      <ul style={{ display: 'grid', gap: '0.8rem', color: '#b0b0cc', fontSize: '0.95rem', margin: 0, paddingLeft: '1.2rem' }}>
                        {step.steps.map((li, idx) => (
                          <li key={idx} style={{ lineHeight: 1.5 }}>{li}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div style={{ marginTop: '1.5rem' }}>
                      <a href={step.videoLink} className="arrow-link" style={{ color: '#ff2d55' }} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-youtube" style={{ marginRight: '0.5rem' }}></i> {step.videoDesc} <span>→</span>
                      </a>
                    </div>
                  </div>

                  {/* Image Content */}
                  <div style={{ direction: 'ltr' }}>
                    <HoloCard style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
                      <div className="card-glass-tilt" style={{ border: 'none', background: 'transparent' }}>
                        <img 
                          src={step.image} 
                          alt={step.title} 
                          style={{ width: '100%', height: 'auto', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.1)' }} 
                        />
                      </div>
                    </HoloCard>
                  </div>
                </div>
              </MotionReveal>
            )
          })}
        </div>

      </div>
    </section>
  )
}

function Module5_2Section() {
  const containerRef = useReveal()

  const videoTimestamps = [
    { time: "0:00 - 4:00", title: "Pre-checks & Exporting Code (GitHub/CLI)", icon: "🔍" },
    { time: "4:00 - 9:00", title: "Web Publishing & Google Play", icon: "🌐" },
    { time: "9:00 - 14:00", title: "Apple App Store (Profiles, Review)", icon: "🍎" },
    { time: "14:00 - End", title: "Testing in Environments (Beta Tracks)", icon: "🧪" }
  ]

  return (
    <section className="sec" ref={containerRef}>
      <SectionHeroBackdrop height={350} opacity={0.5} />
      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        
        <MotionReveal>
          <div className="section-head text-center" style={{ maxWidth: '800px', margin: '0 auto 4rem auto', textAlign: 'center' }}>
            <h5 className="accent-text" style={{ color: '#00f5d4' }}>Module 5 - Chapter 2</h5>
            <h2 style={{ fontSize: '2.5rem' }}>Apple App Store Deployment</h2>
            <p style={{ fontSize: '1.15rem', color: '#c8c8e0', lineHeight: 1.6, marginTop: '1rem' }}>
              Development & Publishing Mobile deployment settings specifically tailored for the Apple App Store ecosystem.
            </p>
          </div>
        </MotionReveal>

        <div className="chapter-grid" style={{ gridTemplateColumns: 'minmax(350px, 1fr) minmax(350px, 1.2fr)', gap: '3rem', alignItems: 'stretch' }}>
          
          <MotionReveal delay={0.1}>
            <NeonCard accent="#4361ee" className="gsap-child" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', background: '#4361ee20', color: '#4361ee', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>🍎</span>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>App Store Settings</h3>
              </div>
              <div style={{ flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
                <img src="https://login.skillizee.io/s/articles/69bcfbf7d54aea36df35001f/images/image-20260320132043-19.png" alt="App Store Mobile Deployment Settings" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ color: '#c8c8e0', fontSize: '0.95rem', marginBottom: '0.5rem', fontWeight: 600 }}>External Resources</h4>
                <a href="https://blog.flutterflow.io/in-app-subscriptions-using-revenue-cat/" className="text-link" target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  In-App Subscriptions Using RevenueCat and FlutterFlow
                </a>
              </div>
            </NeonCard>
          </MotionReveal>

          <MotionReveal delay={0.2}>
            <TiltCard accent="#ff2d55" className="gsap-child" style={{ height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem', background: '#ff2d5520', color: '#ff2d55', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>▶️</span>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>Video Masterclass</h3>
              </div>
              
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', marginBottom: '2rem' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                  <div style={{ width: '60px', height: '60px', background: 'rgba(255,45,85,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', boxShadow: '0 10px 30px rgba(255,45,85,0.4)', backdropFilter: 'blur(5px)' }}>
                     <i className="fas fa-play" style={{ marginLeft: '4px' }}></i>
                  </div>
                </div>
                <img src="https://login.skillizee.io/s/articles/69bcfbf7d54aea36df35001f/images/image-20260320132043-20.jpeg" alt="App Store submission preview" style={{ width: '100%', display: 'block' }} />
              </div>

              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>
                <a href="https://www.youtube.com/watch?v=4GFMsYep_S0" className="arrow-link" style={{ color: '#fff' }} target="_blank" rel="noopener noreferrer">
                  Deploy to Apple App Store | FlutterFlow University <span>→</span>
                </a>
              </h4>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.8rem' }}>
                {videoTimestamps.map((ts, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.8rem 1.2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '1.1rem' }}>{ts.icon}</span>
                    <span style={{ color: '#00f5d4', fontWeight: 700, fontSize: '0.9rem', width: '90px' }}>{ts.time}</span>
                    <span style={{ color: '#c8c8e0', fontSize: '0.95rem' }}>{ts.title}</span>
                  </li>
                ))}
              </ul>
            </TiltCard>
          </MotionReveal>

        </div>
      </div>
    </section>
  )
}

/* ─── App ─── */
export default function App() {
  return (
    <div className="app-wrapper">
      {/* Background layers */}
      <div className="mesh-bg" aria-hidden>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>
      <div className="noise" aria-hidden />
      <CursorDot />
      
      {/* Global Overlays */}
      <FullscreenButton />

      <Routes>
        <Route path="/" element={<Navigate to="/1-1" replace />} />
        <Route path="/1-1" element={<Chapter1_1 />} />
        <Route path="/1-2" element={<Chapter1_2 />} />
        <Route path="/1-3" element={<Chapter1_3 />} />
        <Route path="/2-1" element={<Chapter2_1 />} />
        <Route path="/2-2" element={<Chapter2_2 />} />
        <Route path="/2-3" element={<Chapter2_3 />} />
        <Route path="/2-4" element={<Chapter2_4 />} />
        <Route path="/2-5" element={<Chapter2_5 />} />
        <Route path="/2-6" element={<Chapter2_6 />} />
        <Route path="/2-7" element={<Chapter2_7 />} />
        <Route path="/2-8" element={<Chapter2_8 />} />
        <Route path="/4" element={<Navigate to="/4-1" replace />} />
        <Route path="/4-1" element={<Chapter4_1 />} />
        <Route path="/4-2" element={<Chapter4_2 />} />
        <Route path="/4-3" element={<Chapter4_3 />} />
        <Route path="/4-4" element={<Chapter4_4 />} />
        <Route path="/5" element={<Navigate to="/5-1" replace />} />
        <Route path="/5-1" element={<Chapter5_1 />} />
        <Route path="/5-2" element={<Chapter5_2 />} />
        <Route path="/3" element={<Module3Section />} />
        <Route path="/3-1" element={<Module3Section />} />
        <Route path="/3-2" element={<Module3_2Section />} />
        <Route path="/3-3" element={<Module3_3Section />} />
      </Routes>

    </div>
  )
}

/* ═══════ HERO ═══════ */
function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const handleMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setTilt({
      x: (e.clientX - r.left - r.width / 2) / 25,
      y: (e.clientY - r.top - r.height / 2) / 25,
    })
  }, [])

  return (
    <section className="hero sec" id="hero" onMouseMove={handleMove}>
      <Canvas
        className="hero-canvas"
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.3} />
        <ParticleField />
        <FloatingOrbs />
      </Canvas>

      <div className="wrap hero-grid" style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.h1 variants={fadeUp} custom={1}>
            <span className="highlight">Flutterflow</span><br />App Development
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="hero-desc">
            This course aims to teach students how to develop deployment ready and visually stunning Flutter Applications.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'relative' }}
        >
          <motion.div
            className="hero-card"
            style={{
              transform: `perspective(800px) rotateY(${tilt.x * 0.4}deg) rotateX(${-tilt.y * 0.4}deg)`,
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <img
              src="https://login.skillizee.io/s/articles/69b0ecb39ed3629789c1ad3e/images/image-20260311094656-1.png"
              alt="FlutterFlow app preview"
            />
          </motion.div>
          <motion.div
             className="hero-float tl"
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.7 }}
          >
            <span className="dot green"></span> iOS & Android
          </motion.div>
          <motion.div
             className="hero-float br"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.9 }}
          >
             <span className="dot amber"></span> Hot Reload
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════ BENTO SECTION ═══════ */
function BentoSection() {
  const cards = [
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>, title: 'Creating Layouts', desc: 'Master rows, columns, stacks, and containers. Learn to compose complex, responsive layouts by nesting widgets — just like a visual version of Flexbox and Grid.', accent: 'accent-amber', span: true },
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4.1 12 6M5.1 8l-2.9-.8M6 12l-1.9 2M7.2 2.2 8 5.1M18.8 8.2l3.1.8M10 10l5.5 11 2.5-6.5L24 12l-11-5.5Z"/></svg>, title: 'Adding Interactivity', desc: 'Wire up gestures, buttons, and animations that bring your interfaces to life.', accent: 'accent-rose' },
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>, title: 'Managing State', desc: 'Handle real-time user interactions with page and app-level state variables.', accent: 'accent-sage' },
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>, title: 'Running Your App', desc: "Test instantly with Hot Reload and deploy to iOS, Android, and the web.", accent: 'accent-violet' },
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, title: 'Cross Platform', desc: 'iOS, Android, Web, Linux, Windows — one codebase powers every screen.', accent: 'accent-amber' },
    { icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.163-1.063-.225-1.065-.256-2.2-.52-3.111.41l-2.001 2.002c-.93.93-.664 2.062-.405 3.123.06.246.15.584.218 1.047.054.364-.092.73-.385.952l-1.637 1.241A2.41 2.41 0 0 1 8.878 22c-.628 0-1.256-.242-1.735-.721l-1.567-1.568a1.05 1.05 0 0 1-.295-.888c.045-.306.13-.674.209-1.069.231-1.15.422-2.11-.476-3.003L3.013 12.75c-.93-.93-.664-2.062-.405-3.123.06-.246.15-.584.218-1.047.054-.364-.092-.73-.385-.952L.804 6.388c-.854-.648-1.071-1.85-.487-2.731l1.61-2.415A2.41 2.41 0 0 1 4.545.244c.484.084.975.253 1.48.455.973.389 2.05.819 3.012-.132l1.983-1.956c1.1-1.086 2.463-.9 3.551-.186l1.633 1.074c.321.21.52.569.54.953.024.453-.024.939-.08 1.488-.13 1.248-.3 2.873.743 3.916Z"/></svg>, title: 'Extensive Dev Kit', desc: 'Pre-built widgets, actions, API integrations, and Firebase connectors let you add powerful functionality in minutes, not hours. Focus on what makes your app unique.', accent: 'accent-rose', span: true },
  ]

  return (
    <section className="sec" id="advantages">
      <div className="wrap">
        <MotionReveal>
          <span className="chip" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Advantages
          </span>
          <h2 className="sec-title">Benefits of flutter:</h2>
        </MotionReveal>

        <div className="bento">
          {cards.map((card, i) => (
            <MotionReveal key={i} delay={i * 0.5} className={card.span ? 'span-2' : ''}>
              <motion.div
                className={`bento-card ${card.accent}`}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="bento-icon" style={{color: 'white', marginBottom: '1.25rem'}}>{card.icon}</div>
                <h3>{card.title}</h3>
                {card.desc && <p style={{marginTop: '0.5rem'}}>{card.desc}</p>}
              </motion.div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════ QUICK START INTRO ═══════ */
function QuickStartIntro() {
  return (
    <section className="sec" style={{ paddingTop: '80px', paddingBottom: '0' }} id="quickstart">
      <div className="wrap">
        <h1 className="sec-title" style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#fff' }}>Quick Start Guide</h1>
        <div style={{ fontSize: '1.1rem', color: '#c8c8e0', lineHeight: '1.8', maxWidth: '900px' }}>
          <p style={{ marginBottom: '1rem' }}>
            Welcome to the FlutterFlow Quickstart Guide! This guide is tailored for those eager to dive right into building their first FlutterFlow application. Here, you'll build a screen that lets users adjust the quantity of a product before adding it to their shopping cart.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            This quickstart is designed to be straightforward and accessible, introducing you to basic FlutterFlow concepts quickly. For those seeking a deeper understanding of FlutterFlow's capabilities, we recommend reading through the FlutterFlow concepts pages.
          </p>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', fontWeight: 'bold' }}>What you'll learn</h2>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Creating layouts (add widgets)</li>
            <li>Adding interactivity to UI elements</li>
            <li>Handle app behavior in response to user interactions (manage state).</li>
            <li>Running your app</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ═══════ STEPS ═══════ */
function StepRow({ step, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isFlipped = index % 2 !== 0

  return (
    <motion.div
      ref={ref}
      className={`step-row ${isFlipped ? 'flip' : ''}`}
      id={`step-${step.num}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="step-info">
        <div className={`step-num ${index % 2 === 0 ? 'sunset' : 'aurora'}`}>
          {step.num}
        </div>
        <h2>{step.title}</h2>
        <p>{step.desc}</p>
        
        {step.subSteps && step.subSteps.map((sub, si) => (
          <div key={si} style={{ marginTop: '1.5rem' }}>
            <h3>{sub.title}</h3>
            <p style={{ fontSize: '0.92rem' }}>{sub.desc}</p>
          </div>
        ))}
        {step.link && (
          <motion.a
            href={step.link}
            target="_blank" rel="noopener noreferrer"
            className="arrow-link"
            style={step.subSteps ? { marginTop: '0.5rem' } : undefined}
            whileHover={{ x: 6 }}
          >
            {step.linkText} <span>→</span>
          </motion.a>
        )}
      </div>
      
      {step.media !== 'none' && (
        <motion.div
          className="step-media"
          whileHover={{ y: -8, scale: 1.01 }}
          transition={{ duration: 0.4 }}
        >
          {step.media === 'img' && (
            <img src={step.src} alt={step.alt} />
          )}
          {step.media === 'img-group' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {step.images.map((img, i) => (
                <img key={i} src={img} alt="" style={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          )}
          {step.media === 'iframe' && (
            <iframe
              src={step.src}
              title={step.alt}
              loading="lazy"
              allowFullScreen
            />
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

function StepsSection() {
  const steps = [
    {
      num: 1, title: 'Clone or create project',
      desc: "To kick off your project, the first step is to create a new project. However, to make things easier, we've already created a starter app for you. Simply open this link, click the 'Clone' button, and the project will be instantly added to your account. After cloning the project, you’ll see a page with product images and descriptions. You’ll add a feature that allows users to update the product quantity.",
      link: 'https://app.flutterflow.io/project/f-f-quick-start-app-umu392',
      linkText: 'Open Starter App',
      media: 'img',
      src: 'https://login.skillizee.io/s/articles/69b0f800d8904e84953f0a72/images/image-20260311103506-2.png',
      alt: 'Clone Starter App'
    },
    {
      num: 2, title: 'Building UI',
      desc: "In this section, we'll see how to build the user interface (UI) for this feature. This involves creating a layout and adding various widgets to our page.",
      link: 'https://docs.flutterflow.io/concepts/layouts',
      linkText: 'Learn more about creating layouts',
      media: 'iframe',
      src: 'https://demo.arcade.software/5CNFKTzhvnHPrLyZNzgZ?embed&show_copy_link=true',
      alt: 'Build UI'
    },
    {
      num: 3, title: 'Customize Style',
      desc: "The next step is to customize the style of UI elements. This includes changing the colors, fonts, and sizes of your buttons and labels. In FlutterFlow, you can do this via the Properties Panel which provides a range of options for customization.",
      link: 'https://docs.flutterflow.io/flutterflow-ui/builder#properties-panel',
      linkText: 'Learn about Properties Panel',
      media: 'iframe',
      src: 'https://demo.arcade.software/MGpg8TSzMGBusCGyOk89?embed&show_copy_link=true',
      alt: 'Customize Style'
    },
    {
      num: 4, title: 'Manage State',
      desc: "Once your UI is set up, it's time to make your app interactive by adding a state. This means setting up your app to respond to user interactions. For example, when a user clicks the button to increase the quantity, the number displayed on the label should increase accordingly.",
      subSteps: [
        { title: '4.1 Add state variable', desc: "We can achieve this behavior by adding state variables. A state variable stores data that can change over time. For this specific use case, let's add a page state variable that will hold the current quantity value. When a user interacts with the buttons, we update this variable, which in turn updates the UI." },
        { title: '4.2 Update state variable', desc: 'To update the state variable, we will need to add actions. Actions are essentially functions that are triggered by the user\'s interaction, in this case, by clicking either the "Increase" or "Decrease" buttons. You can add actions to your buttons via the Actions Panel.' },
      ],
      media: 'iframe',
      src: 'https://demo.arcade.software/UI92tJF6DX0lOVuidaSH?embed&show_copy_link=true',
      alt: 'Manage State'
    },
    {
      num: 5, title: 'Run the App',
      desc: "Now that you've built and customized your app, it's time to run it. FlutterFlow allows you to test a fully-functional version of your app in Test and Run mode. The Run mode requires 2-4 minutes (or more, depending on the size of your project). However, to see your changes immediately, you can run your app in a Test mode that uses Flutter's \"Hot Reload\" feature.",
      link: 'https://docs.flutterflow.io/testing/run-your-app#test-mode',
      linkText: 'Learn about Test and Run mode',
      media: 'img',
      src: 'https://login.skillizee.io/s/articles/69b0f800d8904e84953f0a72/images/image-20260311103506-3.png',
      alt: 'Update product quantity'
    },
  ]

  return (
    <section className="sec steps" style={{ paddingTop: '0' }}>
      <div className="wrap border-b border-white/10 pb-16">
        {steps.map((step, i) => (
          <StepRow key={i} step={step} index={i} />
        ))}
      </div>
    </section>
  )
}

/* ═══════ ROADMAP ═══════ */
function RoadmapLayerCard({ layerNum, title, description, color, accentClass, children, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', marginBottom: '3rem' }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr',
        gap: '0',
        position: 'relative',
      }}>
        {/* Left: Number + Vertical Line */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', color: '#050510',
              boxShadow: `0 0 30px ${color}40, 0 8px 24px ${color}30`,
              position: 'relative', zIndex: 2,
            }}
          >
            {layerNum}
          </motion.div>
          <div style={{
            width: '2px', flex: 1, marginTop: '8px',
            background: `linear-gradient(to bottom, ${color}60, transparent)`,
          }} />
        </div>

        {/* Right: Card Content */}
        <motion.div
          className={`bento-card ${accentClass}`}
          whileHover={{ y: -4, boxShadow: `0 12px 40px ${color}15` }}
          transition={{ duration: 0.3 }}
          style={{
            padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
            borderLeft: `3px solid ${color}`,
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Subtle glow in background */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '160px', height: '160px', borderRadius: '50%',
            background: `radial-gradient(circle, ${color}08, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 700, margin: 0 }}>{title}</h2>
            <div style={{
              padding: '4px 12px', borderRadius: '999px', fontSize: '0.7rem',
              fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
              background: `${color}20`, color: color, border: `1px solid ${color}30`,
            }}>
              Layer {layerNum}
            </div>
          </div>
          <p style={{ color: '#b0b0cc', fontSize: '0.95rem', lineHeight: 1.7, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem' }}>{description}</p>
          
          <div className="roadmap-list" style={{ marginTop: '0.5rem' }}>
            {children}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function RoadmapSection() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true, margin: '-50px' })

  return (
    <section className="sec roadmap" id="roadmap" style={{ paddingTop: '0', paddingBottom: '80px' }}>
      {/* ── Dramatic Centered Hero ── */}
      <div ref={heroRef} style={{
        textAlign: 'center', paddingTop: '120px', paddingBottom: '80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background Glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,247,0.08) 0%, rgba(0,245,212,0.04) 40%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(60px)',
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', margin: '0 auto 1.5rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M12 2v20"/><path d="m3 7 9-5 9 5"/><path d="m3 17 9 5 9-5"/></svg> Module 1 — Chapter 2
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 800,
            lineHeight: 1.1, marginBottom: '1.5rem', position: 'relative', zIndex: 2,
            background: 'linear-gradient(135deg, #00f5d4, #7b2ff7, #ff2d55)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Development<br />Roadmap
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{
            fontSize: '1.15rem', color: '#c8c8e0', lineHeight: 1.8,
            maxWidth: '720px', margin: '0 auto 3rem', position: 'relative', zIndex: 2,
          }}
        >
          Navigate through the three essential layers of app development — from pixel-perfect interfaces to robust business logic and secure data management.
        </motion.p>

        {/* 3 Mini Summary Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          style={{
            display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap',
            marginBottom: '4rem', position: 'relative', zIndex: 2,
          }}
        >
          {[
            { label: 'UI Layer', color: '#ff2d55', icon: '◆' },
            { label: 'Logic Layer', color: '#7b2ff7', icon: '◆' },
            { label: 'Data Layer', color: '#f59e0b', icon: '◆' },
          ].map((b, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, scale: 1.04 }}
              style={{
                padding: '10px 24px', borderRadius: '999px',
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${b.color}30`,
                backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '8px',
                color: b.color, fontSize: '0.85rem', fontWeight: 600, cursor: 'default',
              }}
            >
              <span style={{ fontSize: '0.6rem' }}>{b.icon}</span> {b.label}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="wrap">
        {/* Roadmap Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src="https://login.skillizee.io/s/articles/69b0f800d8904e84953f0a72/images/image-20260311105837-4.png" 
            alt="Roadmap Layers" 
            style={{
              width: '100%', borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '5rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }} 
          />
        </motion.div>

        {/* ── Full-Width Stacked Layer Cards ── */}

        {/* UI Layer */}
        <RoadmapLayerCard
          layerNum="1" title="UI Layer"
          description="The UI Layer is all about the visual elements and interactions in your app. It includes widgets for buttons, forms, navigation, and layouts. In FlutterFlow, this layer also covers customization options like themes and responsive design."
          color="#ff2d55" accentClass="accent-rose" delay={0}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.05rem' }}>FlutterFlow Widgets</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#c8c8e0', marginBottom: '1.5rem' }}>
                <li><a href="https://docs.flutterflow.io/resources/ui/overview" className="text-link" target="_blank" rel="noopener noreferrer">Atomic Design</a></li>
                <li><a href="https://docs.flutterflow.io/resources/ui/pages" className="text-link" target="_blank" rel="noopener noreferrer">Pages</a>, <a href="https://docs.flutterflow.io/resources/ui/widgets" className="text-link" target="_blank" rel="noopener noreferrer">Widget</a> &amp; <a href="https://docs.flutterflow.io/resources/ui/components" className="text-link" target="_blank" rel="noopener noreferrer">Components</a></li>
                <li><a href="https://docs.flutterflow.io/resources/forms/textfield" className="text-link" target="_blank" rel="noopener noreferrer">TextFields</a> &amp; <a href="https://docs.flutterflow.io/resources/forms" className="text-link" target="_blank" rel="noopener noreferrer">Other Form Widgets</a></li>
              </ul>

              <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Navigation Elements</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#c8c8e0' }}>
                <li><a href="https://docs.flutterflow.io/concepts/animations/page-transition" className="text-link" target="_blank" rel="noopener noreferrer">Page Transitions (Slide, Fade, etc.)</a></li>
                <li><a href="https://docs.flutterflow.io/resources/ui/pages/scaffold" className="text-link" target="_blank" rel="noopener noreferrer">AppBar and other Page Elements</a></li>
                <li><a href="https://docs.flutterflow.io/concepts/navigation/bottom-sheet" className="text-link" target="_blank" rel="noopener noreferrer">Bottom Sheets</a></li>
                <li><a href="https://docs.flutterflow.io/concepts/navigation/webview" className="text-link" target="_blank" rel="noopener noreferrer">Webviews</a></li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.05rem' }}>User Experience (UX)</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#c8c8e0' }}>
                <li><a href="https://docs.flutterflow.io/concepts/design-system" className="text-link" target="_blank" rel="noopener noreferrer">Design System</a></li>
                <li><a href="https://docs.flutterflow.io/concepts/layouts/responsive" className="text-link" target="_blank" rel="noopener noreferrer">Responsiveness</a></li>
                <li>Interaction Feedback
                  <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                    <li><a href="https://docs.flutterflow.io/concepts/animations" className="text-link" target="_blank" rel="noopener noreferrer">Animations</a></li>
                    <li><a href="https://docs.flutterflow.io/concepts/alerts/haptic-feedback" className="text-link" target="_blank" rel="noopener noreferrer">Haptic Feedback</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </RoadmapLayerCard>

        {/* Logic Layer */}
        <RoadmapLayerCard
          layerNum="2" title="Logic Layer"
          description="The Logic Layer handles your app's business logic and decision-making. This includes state management, conditional actions, and navigation logic."
          color="#7b2ff7" accentClass="accent-violet" delay={0.1}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.05rem' }}>State Management</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#c8c8e0', marginBottom: '1.5rem' }}>
                <li>Representing Data
                  <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                    <li><a href="https://docs.flutterflow.io/resources/data-representation/variables" className="text-link" target="_blank" rel="noopener noreferrer">Variables</a></li>
                    <li><a href="https://docs.flutterflow.io/resources/data-representation/data-types" className="text-link" target="_blank" rel="noopener noreferrer">Datatypes</a> &amp; <a href="https://docs.flutterflow.io/resources/data-representation/custom-data-types" className="text-link" target="_blank" rel="noopener noreferrer">Custom Data Types</a></li>
                    <li><a href="https://docs.flutterflow.io/resources/data-representation/enums" className="text-link" target="_blank" rel="noopener noreferrer">Enums</a></li>
                    <li><a href="https://docs.flutterflow.io/resources/data-representation/constants" className="text-link" target="_blank" rel="noopener noreferrer">Constants</a></li>
                  </ul>
                </li>
                <li><a href="https://docs.flutterflow.io/concepts/state-management" className="text-link" target="_blank" rel="noopener noreferrer">State Variables</a></li>
                <li><a href="https://docs.flutterflow.io/concepts/state-management/widget-state" className="text-link" target="_blank" rel="noopener noreferrer">Managing Widget States</a></li>
                <li>Dynamic Lists <a href="https://docs.flutterflow.io/resources/ui/widgets/composing-widgets/generate-dynamic-children" className="text-link" target="_blank" rel="noopener noreferrer">(Generating Dynamic Children)</a></li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Actions &amp; Business Logic</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#c8c8e0', marginBottom: '1.5rem' }}>
                <li><a href="https://docs.flutterflow.io/resources/functions/action-flow-editor" className="text-link" target="_blank" rel="noopener noreferrer">Actions</a></li>
                <li><a href="https://docs.flutterflow.io/resources/functions/conditional-logic" className="text-link" target="_blank" rel="noopener noreferrer">Conditional Actions</a></li>
                <li><a href="https://docs.flutterflow.io/concepts/custom-code" className="text-link" target="_blank" rel="noopener noreferrer">Custom Code</a></li>
                <li><a href="https://docs.flutterflow.io/resources/forms/form-validation" className="text-link" target="_blank" rel="noopener noreferrer">Form Validation Logic</a></li>
              </ul>

              <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Navigation &amp; Notifications</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#c8c8e0' }}>
                <li><a href="https://docs.flutterflow.io/concepts/navigation/overview" className="text-link" target="_blank" rel="noopener noreferrer">Navigation &amp; Routing</a></li>
                <li><a href="https://docs.flutterflow.io/concepts/navigation/deep-dynamic-linking" className="text-link" target="_blank" rel="noopener noreferrer">Deep &amp; Dynamic Linking</a></li>
                <li><a href="https://docs.flutterflow.io/concepts/notifications/push-notifications" className="text-link" target="_blank" rel="noopener noreferrer">Push Notifications</a></li>
                <li><a href="https://docs.flutterflow.io/concepts/alerts/alert-dialog" className="text-link" target="_blank" rel="noopener noreferrer">Alert Dialogs</a></li>
              </ul>
            </div>
          </div>
        </RoadmapLayerCard>

        {/* Data Layer */}
        <RoadmapLayerCard
          layerNum="3" title="Data Layer"
          description="The Data Layer manages data storage, retrieval, and integration with external sources like APIs and databases."
          color="#f59e0b" accentClass="accent-amber" delay={0.2}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Authentication</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#c8c8e0', marginBottom: '1.5rem' }}>
                <li><a href="https://docs.flutterflow.io/integrations/authentication-methods" className="text-link" target="_blank" rel="noopener noreferrer">Auth Methods Overview</a></li>
                <li><a href="https://docs.flutterflow.io/integrations/authentication-types" className="text-link" target="_blank" rel="noopener noreferrer">Firebase or Supabase or Custom Auth</a></li>
              </ul>

              <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.05rem' }}>Database Integration</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#c8c8e0' }}>
                <li><a href="https://docs.flutterflow.io/integrations/database/cloud-firestore/getting-started" className="text-link" target="_blank" rel="noopener noreferrer">Firebase</a> or <a href="https://docs.flutterflow.io/integrations/database/supabase/database-actions" className="text-link" target="_blank" rel="noopener noreferrer">Supabase</a> integration</li>
                <li>Local Storage with <a href="https://docs.flutterflow.io/resources/data-representation/app-state" className="text-link" target="_blank" rel="noopener noreferrer">AppState</a> or <a href="https://docs.flutterflow.io/integrations/database/sqlite" className="text-link" target="_blank" rel="noopener noreferrer">SQLite DB</a></li>
              </ul>
            </div>
            <div>
              <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.05rem' }}>API Integration</h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#c8c8e0' }}>
                <li>Working with <a href="https://docs.flutterflow.io/resources/backend-logic/create-test-api" className="text-link" target="_blank" rel="noopener noreferrer">REST APIs</a></li>
                <li><a href="https://docs.flutterflow.io/resources/backend-logic/streaming-api" className="text-link" target="_blank" rel="noopener noreferrer">Streaming APIs</a></li>
              </ul>
            </div>
          </div>
        </RoadmapLayerCard>
      </div>
    </section>
  )
}

/* ═══════ BEFORE YOU BEGIN (Chapter 1-3) ═══════ */
function BeforeYouBeginSection() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true, margin: '-50px' })

  const frontendPoints = [
    'Defining the visual pieces of your app, like text or buttons',
    'Figuring out how these pieces should be laid out on the screen',
    'Setting up logic for how your app should react to retrieved data and user interactions',
  ]
  const backendPoints = [
    'Setting up a database that is capable of storing, sending and retrieving data',
    'Leveraging off-the-shelf services, like authentication providers or payment platforms',
    'Defining business logic, either by writing code or using a low-code tool',
  ]

  const architectureCards = [
    { title: 'Component-Based Architecture', desc: 'Breaking down the UI into reusable components, each responsible for a specific part of the interface. This makes the code more modular and easier to maintain.', color: '#00f5d4' },
    { title: 'State Management', desc: "Managing the state of the application, which includes the data displayed in the UI and the user's interactions.", color: '#7b2ff7' },
    { title: 'Responsive Design', desc: 'Ensuring that your application looks and works well on different screen sizes and orientations. This involves using flexible layouts and scalable assets.', color: '#ff2d55' },
    { title: 'Performance Optimization', desc: 'Making sure your app runs smoothly by optimizing rendering, minimizing the number of network requests, and reducing the size of your assets.', color: '#f59e0b' },
  ]

  return (
    <section className="sec" id="before-you-begin" style={{ paddingTop: '0', paddingBottom: '80px' }}>
      {/* ── Hero (1-1 style: left text + right video) ── */}
      <section className="hero sec" id="ch3-hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <Canvas
          className="hero-canvas"
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.3} />
          <ParticleField />
          <FloatingOrbs />
        </Canvas>

        <div className="wrap hero-grid" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1 variants={fadeUp} custom={1}>
              <span className="highlight">Before You</span><br />Begin
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="hero-desc">
              Before you jump in and start using FlutterFlow, it's helpful to understand how app development works — the codebase is usually divided into frontend and backend.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative' }}
          >
            <motion.div
              className="hero-card"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{ borderRadius: '20px', overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/ExkJqBCTIcs?start=0&end=193"
                  title="Can you REALLY build a production ready app in FlutterFlow?"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
            <motion.div
               className="hero-float tl"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.7 }}
            >
              <span className="dot green"></span> Frontend
            </motion.div>
            <motion.div
               className="hero-float br"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.9 }}
            >
               <span className="dot amber"></span> Backend
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="wrap">
        {/* ── Frontend vs Backend Split ── */}
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700,
            textAlign: 'center', marginBottom: '3rem',
            background: 'linear-gradient(135deg, #00f5d4, #7b2ff7)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Frontend vs Backend
          </h2>
        </MotionReveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
          {/* Frontend Card */}
          <MotionReveal>
            <motion.div
              className="bento-card accent-sage"
              whileHover={{ y: -6 }}
              style={{ padding: '2.5rem', height: '100%', borderLeft: '3px solid #00f5d4', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{
                position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px',
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,212,0.08), transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00f5d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Frontend</h3>
                <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 600, background: 'rgba(0,245,212,0.15)', color: '#00f5d4', border: '1px solid rgba(0,245,212,0.2)' }}>Client-side</span>
              </div>
              <p style={{ color: '#b0b0cc', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Frontend development deals with creating the parts of an application that users interact with directly:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {frontendPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 245, 212, 0.08)', borderColor: 'rgba(0, 245, 212, 0.3)' }}
                    style={{
                      display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                      padding: '1rem', borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)',
                      color: '#e2e8f0', fontSize: '0.92rem', lineHeight: 1.6, cursor: 'default',
                      transition: 'border-color 0.3s, background-color 0.3s'
                    }}
                  >
                    <span style={{ color: '#00f5d4', fontSize: '1.2rem', marginTop: '-2px' }}>✦</span>
                    <span>{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </MotionReveal>

          {/* Backend Card */}
          <MotionReveal delay={0.15}>
            <motion.div
              className="bento-card accent-violet"
              whileHover={{ y: -6 }}
              style={{ padding: '2.5rem', height: '100%', borderLeft: '3px solid #7b2ff7', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{
                position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px',
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,247,0.08), transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7b2ff7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Backend</h3>
                <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 600, background: 'rgba(123,47,247,0.15)', color: '#7b2ff7', border: '1px solid rgba(123,47,247,0.2)' }}>Server-side</span>
              </div>
              <p style={{ color: '#b0b0cc', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Backend usually refers to more complex logic and data storage:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {backendPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(123, 47, 247, 0.1)', borderColor: 'rgba(123, 47, 247, 0.3)' }}
                    style={{
                      display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                      padding: '1rem', borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)',
                      color: '#e2e8f0', fontSize: '0.92rem', lineHeight: 1.6, cursor: 'default',
                      transition: 'border-color 0.3s, background-color 0.3s'
                    }}
                  >
                    <span style={{ color: '#7b2ff7', fontSize: '1.2rem', marginTop: '-2px' }}>✦</span>
                    <span>{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </MotionReveal>
        </div>

        {/* ── API Interaction Callout ── */}
        <MotionReveal>
          <motion.div
            whileHover={{ y: -4 }}
            style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '2rem 2.5rem', marginBottom: '4rem',
              backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '3px',
              background: 'linear-gradient(90deg, #00f5d4, #7b2ff7, #ff2d55)',
            }} />
            <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
              The interaction between frontend and backend often occurs through <strong style={{ color: '#00f5d4' }}>APIs</strong> (Application Programming Interfaces). The backend exposes endpoints for the frontend to send requests to. The backend handles the request and sends data back — which the frontend uses to update its visual appearance.
            </p>
          </motion.div>
        </MotionReveal>

        {/* ── Where Does Code Execute? ── */}
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700,
            textAlign: 'center', marginBottom: '2rem', color: '#fff',
          }}>
            Where Does the Code Execute?
          </h2>
        </MotionReveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '5rem' }}>
          <MotionReveal>
            <motion.div whileHover={{ y: -4 }} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(123,47,247,0.15)',
              borderRadius: '16px', padding: '2rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7b2ff7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
              </div>
              <h3 style={{ color: '#7b2ff7', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Backend Code</h3>
              <p style={{ color: '#b0b0cc', fontSize: '0.88rem', lineHeight: 1.7 }}>
                Runs on a <strong style={{ color: '#fff' }}>server</strong> — hosted on a cloud platform like AWS, Google Cloud, or Azure. Handles requests, processes data, and sends responses.
              </p>
            </motion.div>
          </MotionReveal>
          <MotionReveal delay={0.15}>
            <motion.div whileHover={{ y: -4 }} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,245,212,0.15)',
              borderRadius: '16px', padding: '2rem', textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00f5d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </div>
              <h3 style={{ color: '#00f5d4', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Frontend Code</h3>
              <p style={{ color: '#b0b0cc', fontSize: '0.88rem', lineHeight: 1.7 }}>
                Runs on the <strong style={{ color: '#fff' }}>user's device</strong> — a web browser or the OS for mobile apps. Displays the UI and handles user interactions.
              </p>
            </motion.div>
          </MotionReveal>
        </div>

        {/* ── Frontend Architecture ── */}
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700,
            textAlign: 'center', marginBottom: '1rem', color: '#fff',
          }}>
            Frontend Architecture
          </h2>
          <p style={{ color: '#b0b0cc', fontSize: '0.95rem', lineHeight: 1.7, textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            Key architectural patterns and best practices for developing robust, user-friendly applications with FlutterFlow.
          </p>
        </MotionReveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '5rem' }}>
          {architectureCards.map((card, i) => (
            <MotionReveal key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, boxShadow: `0 12px 40px ${card.color}12` }}
                style={{
                  background: 'rgba(255,255,255,0.03)', border: `1px solid ${card.color}20`,
                  borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden',
                  borderTop: `2px solid ${card.color}`,
                }}
              >
                <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 600 }}>{card.title}</h3>
                <p style={{ color: '#b0b0cc', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{card.desc}</p>
              </motion.div>
            </MotionReveal>
          ))}
        </div>

        {/* ── Create an Account ── */}
        <MotionReveal>
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px', padding: '3rem', marginBottom: '3rem',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '3px',
              background: 'linear-gradient(90deg, #4361ee, #00f5d4)',
            }} />

            <h2 style={{
              fontSize: '2rem', fontWeight: 700, marginBottom: '1rem',
              background: 'linear-gradient(135deg, #4361ee, #00f5d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Create an Account
            </h2>
            <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Create your free account to get started with FlutterFlow. After you've set up your account, you'll be able to create as many projects as you like 
              — <a href="https://app.flutterflow.io/create-account" className="text-link" target="_blank" rel="noopener noreferrer">sign up</a> via Apple, Google, or Github.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
              {/* General */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
                <h4 style={{ color: '#00f5d4', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 600 }}>General Requirements</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <motion.div whileHover={{ x: 4, color: '#fff' }} style={{ display: 'flex', gap: '0.75rem', color: '#b0b0cc', fontSize: '0.85rem', lineHeight: 1.6, padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', transition: '0.2s' }}>
                    <span style={{ color: '#00f5d4' }}>•</span> Screen at least 1280 x 1024
                  </motion.div>
                </div>
              </div>
              {/* Browser */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
                <h4 style={{ color: '#4361ee', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 600 }}>Browser Recommendations</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <motion.div whileHover={{ x: 4, color: '#fff' }} style={{ display: 'flex', gap: '0.75rem', color: '#b0b0cc', fontSize: '0.85rem', lineHeight: 1.6, padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', transition: '0.2s' }}>
                    <span style={{ color: '#4361ee' }}>•</span> Works best on Google Chrome
                  </motion.div>
                  <motion.div whileHover={{ x: 4, color: '#fff' }} style={{ display: 'flex', gap: '0.75rem', color: '#b0b0cc', fontSize: '0.85rem', lineHeight: 1.6, padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', transition: '0.2s' }}>
                    <span style={{ color: '#4361ee' }}>•</span> Keep browser up-to-date
                  </motion.div>
                  <motion.div whileHover={{ x: 4, color: '#fff' }} style={{ display: 'flex', gap: '0.75rem', color: '#b0b0cc', fontSize: '0.85rem', lineHeight: 1.6, padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', transition: '0.2s' }}>
                    <span style={{ color: '#4361ee' }}>•</span> Allow pop-ups and clipboard
                  </motion.div>
                </div>
              </div>
              {/* Desktop */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
                <h4 style={{ color: '#ff2d55', fontSize: '0.95rem', marginBottom: '1rem', fontWeight: 600 }}>Desktop App</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <motion.div whileHover={{ x: 4, color: '#fff' }} style={{ display: 'flex', gap: '0.75rem', color: '#b0b0cc', fontSize: '0.85rem', lineHeight: 1.6, padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', transition: '0.2s' }}>
                    <span style={{ color: '#ff2d55' }}>•</span> macOS: 13 or higher
                  </motion.div>
                  <motion.div whileHover={{ x: 4, color: '#fff' }} style={{ display: 'flex', gap: '0.75rem', color: '#b0b0cc', fontSize: '0.85rem', lineHeight: 1.6, padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', transition: '0.2s' }}>
                    <span style={{ color: '#ff2d55' }}>•</span> Windows: 10 or higher
                  </motion.div>
                  <motion.div whileHover={{ x: 4, color: '#fff' }} style={{ display: 'flex', gap: '0.75rem', color: '#b0b0cc', fontSize: '0.85rem', lineHeight: 1.6, padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', transition: '0.2s' }}>
                    <span style={{ color: '#ff2d55' }}>•</span> Native <a href="https://docs.flutterflow.io/testing/local-run" className="text-link" target="_blank" rel="noopener noreferrer">local run</a> support
                  </motion.div>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ y: -2 }}
              style={{
                marginTop: '1.5rem', padding: '1rem 1.5rem',
                background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)',
                borderRadius: '12px', fontSize: '0.85rem', color: '#c8c8e0', lineHeight: 1.7,
              }}
            >
              <strong style={{ color: '#ffd700' }}>Note:</strong> Some Windows users may experience a crash. Install the <a href="https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170" className="text-link" target="_blank" rel="noopener noreferrer">Microsoft Visual C++ 2015–2022 Redistributable</a> (both x64 and x86) to fix this. For target platform requirements, see the <a href="https://docs.flutter.dev/reference/supported-platforms" className="text-link" target="_blank" rel="noopener noreferrer">Flutter documentation</a>.
            </motion.div>
          </div>
        </MotionReveal>

        {/* ── FlutterFlow Pros & Cons ── */}
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700,
            textAlign: 'center', marginBottom: '2rem',
            background: 'linear-gradient(135deg, #ff2d55, #f59e0b)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            FlutterFlow Pros &amp; Cons
          </h2>
        </MotionReveal>

        <MotionReveal>
          <div style={{
            maxWidth: '800px', margin: '0 auto 3rem',
            borderRadius: '20px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://www.youtube.com/embed/a6jKkN0qpvc"
                title="FlutterFlow Pros & Cons: What You NEED to Know in 2025"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  )
}

/* ═══════ DASHBOARD (Chapter 2-1) ═══════ */
function DashboardSection() {
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true, margin: '-50px' })

  const horizontalScrollRef = useRef(null)
  const { scrollYProgress: horizontalScrollY } = useScroll({ target: horizontalScrollRef })
  const x = useTransform(horizontalScrollY, [0, 1], ["0%", "-82%"])

  const dashboardFeatures = [
    {
      title: 'Projects',
      desc: <>Projects section displays all the projects you have created in FlutterFlow. Use the overflow menu to rename, duplicate, delete, leave the project, add tags, and open the project in a new browser tab.</>,
      note: <>When you duplicate a project containing the Firebase setup, you must delete the config files in your duplicated project and initiate a new <a href="https://docs.flutterflow.io/integrations/firebase/connect-to-firebase" className="text-link" target="_blank" rel="noopener noreferrer">Firebase setup</a> for your project.</>,
      color: '#4361ee',
      spanClass: 'md:col-span-2'
    },
    {
      title: 'Dark/Light Mode',
      desc: 'Choose between a light and dark color scheme for the FlutterFlow builder.',
      color: '#f59e0b',
      spanClass: 'md:col-span-1',
      image: '/dashboard/dark_light_mode.png'
    },
    {
      title: 'Search & Filter',
      desc: <>Search for your projects or filter them based on their privacy settings (private, shared by you, or shared with you).</>,
      color: '#00f5d4',
      spanClass: 'md:col-span-1',
      image: '/dashboard/search_filter.png'
    },
    {
      title: 'Tag Project',
      desc: (
        <>
          You can create and add a tag to projects, providing a quick and organized way to classify and identify projects based on their characteristics, purpose, or status.
          <br /><br />
          To tag a project, click the three dots option menu on the project tile, select Add Tag, and then click on the tag you want to set. Later, you can search and filter the projects based on tags. Watch the <a href="https://www.loom.com/share/2e545489cfe14e97ae44b6a747410ae0" className="text-link" target="_blank" rel="noopener noreferrer">Loom walkthrough</a>.
        </>
      ),
      color: '#7b2ff7',
      spanClass: 'md:col-span-2',
      image: '/dashboard/tag_project.png'
    },
    {
      title: 'Create New',
      desc: <>For creating a new project, use the + Create New button. Learn more about <a href="https://docs.flutterflow.io/resources/projects/how-to-create-find-organize-projects#how-to-create-a-project" className="text-link" target="_blank" rel="noopener noreferrer">creating a new project</a>.</>,
      color: '#ff2d55',
      spanClass: 'md:col-span-1',
      image: '/dashboard/create_new.png'
    },
    {
      title: 'Notifications Center',
      desc: 'The notification center simplifies how you manage comments and invites across various projects. It conveniently centralizes all your project communications. Tap a comment to jump directly to the relevant section.',
      color: '#00e676',
      spanClass: 'md:col-span-2',
      image: '/dashboard/notifications.png'
    },
    {
      title: 'My Organization',
      desc: <>From the <a href="https://docs.flutterflow.io/flutterflow-ui/my-organization" className="text-link" target="_blank" rel="noopener noreferrer">My Organization</a> tab, you can share custom code, assets, design systems, and APIs between your team users and across projects.</>,
      color: '#f59e0b',
      spanClass: 'md:col-span-2',
      image: '/dashboard/organization.png'
    },
    {
      title: 'Marketplace & Resources',
      desc: (
        <>
          Enhance your FlutterFlow app with the <a href="https://docs.flutterflow.io/marketplace" className="text-link" target="_blank" rel="noopener noreferrer">FlutterFlow Marketplace</a>; access pre-built components and templates created by other users for seamless integration of new functionalities.
          <br /><br />
          From the Resources tab, you can find useful links and <a href="https://www.youtube.com/@FlutterFlow/videos" className="text-link" target="_blank" rel="noopener noreferrer">video tutorials</a> that help you learn visually.
        </>
      ),
      color: '#4361ee',
      spanClass: 'md:col-span-1',
      image: '/dashboard/marketplace.png'
    },
    {
      title: 'Community',
      desc: <>The Community tab will redirect you to our <a href="https://community.flutterflow.io/home" className="text-link" target="_blank" rel="noopener noreferrer">Community Forum</a>, a place to share ideas, ask questions, and troubleshoot issues with other FlutterFlow builders. The community shares a lot of amazing ideas!</>,
      color: '#ff2d55',
      spanClass: 'md:col-span-3',
      image: '/dashboard/community.png'
    },
  ];

  const adminFeatures = [
    {
      id: 'forum',
      title: 'Community Forum',
      desc: (
        <>
          The community forum requires an account, which we'll auto-create when you click on the <a href="https://app.flutterflow.io/community" className="text-link" target="_blank" rel="noopener noreferrer">Community</a> tab and redirect to the forum. If you want to add a password to your forum account, go to forum <a href="https://community.flutterflow.io/settings/account" className="text-link" target="_blank" rel="noopener noreferrer">settings</a> and click &quot;Forgot Password.&quot; Additionally, ensure that you have added a name to your FlutterFlow profile; the same name will be used for the community forum profile.
        </>
      ),
      icon: '💬',
      color: '#7b2ff7'
    },
    {
      id: 'url',
      title: 'URL Access (Enterprise Only)',
      desc: <>You can view and copy URLs that need to be whitelisted for FlutterFlow to function correctly in enterprise environments with restricted internet access. Check out docs on <a href="https://docs.flutterflow.io/misc/enterprise#whitelist-urls" className="text-link" target="_blank" rel="noopener noreferrer">Whitelisting URLs</a>.</>,
      icon: '🌐',
      color: '#ff2d55',
      image: 'https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313160525-2.png'
    },
    {
      id: 'account',
      title: 'Account',
      desc: 'This is helpful if you want to look at your account information, upload a profile picture, reset your password, see your referrals, or delete account.',
      icon: '👤',
      color: '#00f5d4'
    },
    {
      id: 'plan',
      title: 'Plan Info',
      desc: 'See information about the current plan and eventually upgrade to access additional features.',
      icon: '💳',
      color: '#f59e0b'
    },
    {
      id: 'logout',
      title: 'Logout',
      desc: 'Safely log out from your FlutterFlow account.',
      icon: '🚪',
      color: '#4361ee'
    },
  ];

  const [activeFeat, setActiveFeat] = useState(0);
  const [activeAdminTab, setActiveAdminTab] = useState(adminFeatures[0]);
  const feat = dashboardFeatures[activeFeat];

  return (
    <section className="sec" id="dashboard-section" style={{ paddingTop: '0', paddingBottom: '80px' }}>
      {/* ── Left-Aligned Grid Hero ── */}
      <div className="wrap hero-grid" ref={heroRef} style={{ paddingTop: '120px', paddingBottom: '60px', position: 'relative', zIndex: 2 }}>
        
        <motion.div
           initial="hidden"
           animate={heroInView ? "visible" : "hidden"}
           variants={stagger}
           style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <motion.div variants={fadeUp} custom={1}>
            <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1.5rem', color: '#00e676', border: '1px solid rgba(0, 230, 118, 0.3)', background: 'rgba(0, 230, 118, 0.1)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg> Module 2 — Chapter 1
            </span>
          </motion.div>

          <motion.h1 
             variants={fadeUp} custom={2}
             style={{
               fontSize: 'clamp(2.8rem, 5vw, 4rem)', fontWeight: 800,
               lineHeight: 1.1, marginBottom: '1.5rem',
               background: 'linear-gradient(135deg, #00e676, #4361ee, #00f5d4)',
               WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
             }}
          >
            Dashboard
          </motion.h1>

          <motion.p 
             variants={fadeUp} custom={3}
             style={{
               fontSize: '1.1rem', color: '#c8c8e0', lineHeight: 1.8,
               maxWidth: '600px', marginBottom: '2rem'
             }}
          >
            When you log in to FlutterFlow, the first thing you'll encounter is the Dashboard. It serves as a central hub for managing your projects, including creating new ones, searching, deleting, and duplicating projects. Additionally, the Dashboard lets you choose your preferred theme — dark or light — for a more comfortable viewing experience. The Dashboard provides convenient access to organizational resources, facilitating seamless collaboration among team members. It also integrates with a marketplace where users can browse and download widgets, templates, and plugins. You can find links to helpful resources for building apps with FlutterFlow, and your account information and plan details are easily accessible from this page as well.
          </motion.p>
        </motion.div>

        {/* ── Dashboard Top Image (Right Side) ── */}
        <motion.div
           initial={{ opacity: 0, x: 60 }}
           animate={heroInView ? { opacity: 1, x: 0 } : {}}
           transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
           style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
        >
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '120%', height: '120%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,230,118,0.1) 0%, rgba(67,97,238,0.1) 40%, transparent 70%)',
            pointerEvents: 'none', filter: 'blur(60px)', zIndex: 0
          }} />
          
          <div style={{
            width: '100%',
            borderRadius: '20px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            position: 'relative', zIndex: 2
          }}>
             <img src="https://login.skillizee.io/s/articles/69b3e86a3be109fef8751088/images/image-20260313160525-1.png" alt="FlutterFlow Dashboard interface" style={{ width: '100%', display: 'block' }} />
          </div>

          <motion.div
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
             style={{
               position: 'absolute', top: '-10%', right: '-5%',
               background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
               border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px',
               padding: '1rem', color: '#00e676', zIndex: 3, fontWeight: 600, fontSize: '0.85rem'
             }}
          >
             ✦ Central Hub
          </motion.div>
        </motion.div>
      </div>

      <div className="wrap">

        {/* ── Dashboard Features Flex Accordion ── */}
        <MotionReveal>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700,
            textAlign: 'center', marginBottom: '1rem',
            background: 'linear-gradient(135deg, #00e676, #00f5d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Dashboard Features
          </h2>
          <p style={{ textAlign: 'center', color: '#b0b0cc', fontSize: '1.1rem', marginBottom: '3rem' }}>
            Hover over any feature to expand its interactive panel ✦
          </p>
        </MotionReveal>

        <div style={{ display: 'flex', height: '650px', gap: '1rem', width: '100%', marginBottom: '6rem' }}>
          {dashboardFeatures.map((f, i) => {
            const isActive = activeFeat === i;
            return (
              <motion.div
                key={i}
                layout
                onMouseEnter={() => setActiveFeat(i)}
                initial={{ flex: i === 0 ? 12 : 1 }}
                animate={{ flex: isActive ? 12 : 1 }}
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                style={{
                  borderRadius: '24px',
                  background: isActive ? `${f.color}15` : 'rgba(255,255,255,0.02)',
                  border: isActive ? `1px solid ${f.color}50` : '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-end',
                  boxShadow: isActive ? `0 20px 60px -10px ${f.color}30` : 'none',
                  minWidth: '60px',
                }}
              >
                {/* Background Glow */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      position: 'absolute', top: '-10%', right: '-10%',
                      width: '300px', height: '300px', borderRadius: '50%',
                      background: `radial-gradient(circle, ${f.color}25 0%, transparent 70%)`,
                      pointerEvents: 'none', filter: 'blur(60px)', zIndex: 0
                    }}
                  />
                )}

                {/* Collapsed Vertical Text */}
                {!isActive && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.2 }}
                    style={{ 
                      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
                      alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '2rem' 
                    }}
                  >
                    <div style={{ 
                      writingMode: 'vertical-rl', transform: 'rotate(180deg)', 
                      color: '#6c6c8e', fontWeight: 600, letterSpacing: '2px', 
                      whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', 
                      maxHeight: '70%', fontSize: '0.9rem', marginBottom: '1.5rem',
                      textTransform: 'uppercase'
                    }}>
                      {f.title}
                    </div>
                    <div style={{ color: f.color, fontSize: '1.2rem', opacity: 0.6 }}>✦</div>
                  </motion.div>
                )}

                {/* Expanded Content View */}
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: 0.1, duration: 0.4 }}
                    style={{ 
                      minWidth: '600px', padding: '3rem', 
                      display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 1 
                    }}
                  >
                    {f.image && (
                      <div style={{ marginBottom: '1.5rem', width: '100%', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${f.color}40`, flexShrink: 0 }}>
                        <img src={f.image} alt={f.title} style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }} />
                      </div>
                    )}
                    
                    <div style={{ 
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
                      width: '48px', height: '48px', borderRadius: '12px', 
                      background: `${f.color}20`, border: `1px solid ${f.color}40`, 
                      color: f.color, fontSize: '1.4rem', marginBottom: '1rem' 
                    }}>
                       ✦
                    </div>
                    
                    <h3 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: 800, marginBottom: '1rem' }}>
                      {f.title}
                    </h3>
                    
                    <p style={{ fontSize: '1.15rem', color: '#c8c8e0', lineHeight: 1.8, maxWidth: '80%', marginBottom: '2rem' }}>
                      {f.desc}
                    </p>

                    {f.note && (
                      <div style={{
                        background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)',
                        borderRadius: '16px', padding: '1.5rem', color: '#c8c8e0', fontSize: '1rem', lineHeight: 1.6,
                        display: 'flex', gap: '1rem', maxWidth: '80%', marginTop: 'auto'
                      }}>
                        <span style={{ fontSize: '1.2rem' }}>💡</span>
                        <div>
                          <strong style={{ color: '#ffd700', display: 'block', marginBottom: '0.25rem' }}>Expert Tip:</strong> 
                          {f.note}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* ── Mac OS Command Center UI ── */}
        <MotionReveal>
          <div style={{
            width: '100%', maxWidth: '1200px', margin: '0 auto 6rem',
            background: 'rgba(15, 15, 25, 0.6)', backdropFilter: 'blur(20px)',
            borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', height: '600px'
          }}>
            
            {/* Native OS Title Bar */}
            <div style={{
              height: '48px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px'
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
              <div style={{ margin: '0 auto', color: '#6c6c8e', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '1px' }}>
                System Administration
              </div>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              
              {/* Sidebar Navigation */}
              <div style={{
                width: '320px', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.06)',
                padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto'
              }}>
                <div style={{ color: '#6c6c8e', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', paddingLeft: '1rem', letterSpacing: '1px' }}>
                  Control Panel
                </div>
                {adminFeatures.map((feat) => {
                  const isActive = activeAdminTab.id === feat.id;
                  return (
                    <motion.div
                      key={feat.id}
                      onClick={() => setActiveAdminTab(feat)}
                      whileHover={{ x: 4, backgroundColor: isActive ? `${feat.color}20` : 'rgba(255,255,255,0.05)' }}
                      style={{
                        padding: '1rem 1.25rem', borderRadius: '12px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        background: isActive ? `${feat.color}15` : 'transparent',
                        border: isActive ? `1px solid ${feat.color}40` : '1px solid transparent',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <span style={{ fontSize: '1.4rem' }}>{feat.icon}</span>
                      <span style={{ color: isActive ? '#fff' : '#b0b0cc', fontWeight: isActive ? 600 : 500, fontSize: '1rem' }}>
                        {feat.title}
                      </span>
                    </motion.div>
                  )
                })}
              </div>

              {/* Main Content Area */}
              <div style={{ flex: 1, padding: '4rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <motion.div
                  key={activeAdminTab.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: `${activeAdminTab.color}20`, color: activeAdminTab.color, fontSize: '2rem', marginBottom: '1.5rem', border: `1px solid ${activeAdminTab.color}40` }}>
                    {activeAdminTab.icon}
                  </div>
                  <h2 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: 800, marginBottom: '1.5rem' }}>
                    {activeAdminTab.title}
                  </h2>
                  <p style={{ color: '#c8c8e0', fontSize: '1.2rem', lineHeight: 1.8, maxWidth: '800px', marginBottom: '2rem' }}>
                    {activeAdminTab.desc}
                  </p>
                  
                  {activeAdminTab.image && (
                    <div style={{ marginTop: 'auto', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${activeAdminTab.color}40`, boxShadow: `0 20px 40px ${activeAdminTab.color}20` }}>
                      <img src={activeAdminTab.image} alt={activeAdminTab.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}

                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{
                      marginTop: activeAdminTab.image ? '1.5rem' : 'auto', alignSelf: 'flex-start',
                      padding: '1rem 2rem', borderRadius: '12px', background: activeAdminTab.color, color: '#fff',
                      fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', border: 'none',
                      boxShadow: `0 10px 30px ${activeAdminTab.color}40`, display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
                    }}
                  >
                    Access {activeAdminTab.title} <span>→</span>
                  </motion.button>
                </motion.div>
              </div>

            </div>
          </div>
        </MotionReveal>

      </div>
    </section>
  )
}

/* ═══════ CTA BANNER ═══════ */
function CTABanner() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="cta-banner" ref={ref} style={{ paddingTop: '80px', paddingBottom: '30px' }}>
      <div className="wrap">
        <motion.div
          className="cta-box"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ padding: '3rem', textAlign: 'center' }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '0' }}
          >
            Congratulations! You've built your first app with FlutterFlow.
          </motion.h2>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════ FAQ ═══════ */
function FAQSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="sec" id="help" ref={ref} style={{ paddingTop: '0' }}>
      <div className="wrap">
        <motion.div
          className="faq"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -4 }}
        >
          <h3>Problems?</h3>
          <p>
            If you're experiencing any issues with the app, ensure that you have followed the instructions correctly.
          </p>
          <p style={{ marginTop: '1rem' }}>
            To seek assistance from the{' '}
            <a href="https://community.flutterflow.io/" target="_blank" rel="noopener noreferrer">
              Community Forum
            </a>. If you're still encountering problems, don't hesitate to report the issue to our support team.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
