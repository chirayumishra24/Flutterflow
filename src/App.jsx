import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import './App.css'

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
      document.querySelectorAll('a, button, .bento-card, .step-media').forEach(el => {
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

function ChapterProgress() {
  const { scrollYProgress } = useScroll();
  const path = window.location.pathname;
  const activeChapter = path.includes('/2-1') ? 4 : path.includes('/1-3') ? 3 : path.includes('/1-2') ? 2 : 1;
  const colors = ['var(--color-neon-cyan)', 'var(--color-neon-pink)', '#f59e0b', '#00f5d4'];
  const activeColor = colors[activeChapter - 1];

  const chapters = [
    { id: '1-1', label: '1-1' },
    { id: '1-2', label: '1-2' },
    { id: '1-3', label: '1-3' },
    { id: '2-1', label: '2-1' },
  ];

  return (
    <div className="chapter-progress-wrapper" style={{
      position: 'fixed',
      right: '24px',
      top: '50%',
      transform: 'translateY(-50%)',
      height: '33.33vh',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 9998
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', alignItems: 'flex-end' }}>
        {chapters.map((ch, i) => (
          <Link key={ch.id} to={`/${ch.id}`} style={{
            textDecoration: 'none',
            color: activeChapter === i + 1 ? colors[i] : 'rgba(255,255,255,0.3)',
            fontWeight: 'bold', fontSize: '0.8rem', transition: '0.3s',
          }}>{ch.label}</Link>
        ))}
      </div>

      <div style={{
        position: 'relative',
        height: '100%',
        width: '4px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <motion.div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: activeColor,
            scaleY: scrollYProgress,
            transformOrigin: 'bottom',
            boxShadow: `0 0 15px ${activeColor}`,
            height: '100%'
          }}
        />
      </div>
    </div>
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
      <ChapterProgress />

      <Routes>
        <Route path="/" element={<Navigate to="/1-1" replace />} />
        <Route path="/1-1" element={<Chapter1_1 />} />
        <Route path="/1-2" element={<Chapter1_2 />} />
        <Route path="/1-3" element={<Chapter1_3 />} />
        <Route path="/2-1" element={<Chapter2_1 />} />
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
    { title: 'Projects', desc: 'Displays all the projects you have created in FlutterFlow. Use the overflow menu to rename, duplicate, delete, leave the project, add tags, and open the project in a new browser tab.', note: 'When you duplicate a project containing the Firebase setup, you must delete the config files in your duplicated project and initiate a new Firebase setup for your project.', color: '#4361ee', spanClass: 'md:col-span-2' },
    { title: 'Dark/Light mode', desc: 'Choose between a light and dark color scheme for the builder.', color: '#f59e0b', spanClass: 'md:col-span-1', image: '/dashboard/dark_light_mode.png' },
    { title: 'Search & Filter', desc: 'Search for projects or filter them based on their privacy settings (private, shared by you, shared with you).', color: '#00f5d4', spanClass: 'md:col-span-1', image: '/dashboard/search_filter.png' },
    { title: 'Tag Project', desc: 'Create and add a tag to projects, providing a quick and organized way to classify and identify them based on characteristics, purpose, or status.', color: '#7b2ff7', spanClass: 'md:col-span-2', image: '/dashboard/tag_project.png' },
    { title: 'Create New', desc: 'Use the + Create New button to start a completely new project from scratch or using templates.', color: '#ff2d55', spanClass: 'md:col-span-1', image: '/dashboard/create_new.png' },
    { title: 'Notifications Center', desc: 'Simplifies how you manage comments and invites across various projects. Centralizes all communications. Tap a comment to jump directly to the relevant section.', color: '#00e676', spanClass: 'md:col-span-2', image: '/dashboard/notifications.png' },
    { title: 'My Organization', desc: 'Share custom code, assets, design systems, and APIs between your team users and across multiple projects seamlessly.', color: '#f59e0b', spanClass: 'md:col-span-2', image: '/dashboard/organization.png' },
    { title: 'Marketplace & Resources', desc: 'Access pre-built components and templates. Find valuable links and video tutorials that can help you build apps more efficiently.', color: '#4361ee', spanClass: 'md:col-span-1', image: '/dashboard/marketplace.png' },
    { title: 'Community', desc: 'Redirects to the Community Forum to share amazing ideas, ask questions, and troubleshoot issues with other FlutterFlow builders.', color: '#ff2d55', spanClass: 'md:col-span-3', image: '/dashboard/community.png' },
  ];

  const adminFeatures = [
    { id: 'forum', title: 'Community Forum', desc: 'The community forum requires an account, which we auto-create when you click on the "Community" tab. To add a password, go to forum settings and click \'Forget Password.\' Ensure that you have added a name to your FlutterFlow profile. The same name will be used for the community forum profile.', icon: '💬', color: '#7b2ff7' },
    { id: 'url', title: 'URL Access (Enterprise Only)', desc: 'You can view and copy URLs that need to be whitelisted for FlutterFlow to function correctly in enterprise environments with restricted internet access.', icon: '🌐', color: '#ff2d55', image: 'https://login.skillizee.io/s/articles/69b10c7ceb63f46810cf7a99/images/image-20260311120237-2.png' },
    { id: 'account', title: 'Account Settings', desc: 'Look at your account information, upload a profile picture, reset your password, see your referrals, or delete account.', icon: '👤', color: '#00f5d4' },
    { id: 'plan', title: 'Plan info & Billing', desc: 'See information about the current plan and eventually upgrade to access additional features.', icon: '💳', color: '#f59e0b' },
    { id: 'logout', title: 'Sign Out', desc: 'Safely log out from your FlutterFlow account.', icon: '🚪', color: '#4361ee' },
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
            When you log in to FlutterFlow, the first thing you'll encounter is the Dashboard. It serves as a central hub for managing your projects, including creating new ones, searching, deleting, and duplicating projects. Additionally, the Dashboard lets you choose your preferred theme — dark or light — for a more comfortable viewing experience. The Dashboard provides convenient access to organizational resources, facilitating seamless collaboration among team members.
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
             <img src="https://login.skillizee.io/s/articles/69b10c7ceb63f46810cf7a99/images/image-20260311120237-1.png" alt="FlutterFlow Dashboard interface" style={{ width: '100%', display: 'block' }} />
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
                        <img src={f.image} alt={f.title} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
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
