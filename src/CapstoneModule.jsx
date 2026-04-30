import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const problemStatements = [
  {
    id: 1,
    title: 'E-commerce / Marketplace',
    themeColor: '#ff2d55',
    description: 'Build a polished commerce experience for a local brand with browsing, checkout, and seller flows.',
    requirements: [
      'Product catalog with search and filtering',
      'Cart and checkout system',
      'User profiles and order history',
      'Image uploads for products or sellers',
      'Payment integration through custom actions',
    ],
  },
  {
    id: 2,
    title: 'Social Media / Feed App',
    themeColor: '#5856d6',
    description: 'Create a visual social app for creators, foodies, or niche communities with strong interaction loops.',
    requirements: [
      'Post creation with media upload',
      'Like/comment system and dynamic feed',
      'User profiles and notifications',
      'Hero or media transition animations',
    ],
  },
  {
    id: 3,
    title: 'Task / Habit Tracker',
    themeColor: '#ff9500',
    description: 'Design a productivity system that helps users manage routines, deadlines, and progress.',
    requirements: [
      'Categories and due dates with reminders',
      'File attachments and progress analytics',
      'Theme or dark mode toggle',
      'Custom interactions for task completion',
    ],
  },
  {
    id: 4,
    title: 'Quiz / Learning App',
    themeColor: '#4cd964',
    description: 'Build an educational app that combines learning content, assessments, and achievement systems.',
    requirements: [
      'Multiple-choice quizzes and score tracking',
      'Media-rich questions with images or video',
      'Leaderboard and certificate generation',
      'Clear feedback animations for answers',
    ],
  },
  {
    id: 5,
    title: 'Fitness / Meal Planner',
    themeColor: '#5ac8fa',
    description: 'Ship a wellness app for workout logging, meal tracking, and progress reporting.',
    requirements: [
      'Workout or exercise library with media',
      'Meal logging with image upload',
      'Progress charts or analytics',
      'Custom logic for calorie or plan calculations',
    ],
  },
  {
    id: 6,
    title: 'Your Own Awesome Idea',
    themeColor: '#ffcc00',
    description: 'Propose an original product at the same level of complexity and get it approved by your instructor.',
    requirements: [
      'Must use at least 80% of the course modules',
      'Full backend integration',
      'Responsive UI',
      'Published web or app-store ready output',
    ],
  },
]

const corePillars = [
  { title: 'Authentication', detail: 'Real user flows, guarded screens, and session-aware UI.', accent: '#5ac8fa' },
  { title: 'Backend', detail: 'Firestore, Supabase, or another real data layer with structured models.', accent: '#00f5d4' },
  { title: 'State & Logic', detail: 'Meaningful app logic, actions, and user-driven state changes.', accent: '#ff9500' },
  { title: 'Custom Capability', detail: 'Custom code, custom functions, or external API logic.', accent: '#ff2d55' },
  { title: 'Polish', detail: 'Animations, media handling, responsive design, and production-level UI.', accent: '#7b2ff7' },
  { title: 'Release Flow', detail: 'Branching discipline, testing, export, and final deployment.', accent: '#ffcc00' },
]

const timelinePhases = [
  {
    step: '01',
    title: 'Frame the Product',
    desc: 'Lock the user flow, data model, and design system before you build heavily.',
  },
  {
    step: '02',
    title: 'Build the Core',
    desc: 'Implement auth, screens, backend, media, and the main interaction loop.',
  },
  {
    step: '03',
    title: 'Polish and Ship',
    desc: 'Stress test edge cases, improve motion and UI quality, then deploy and document.',
  },
]

const resourceLinks = [
  { name: 'FlutterFlow Sample Apps', url: 'https://github.com/FlutterFlow/sample-apps', accent: '#4cd964' },
  { name: 'FlutterFlow E-commerce Reference', url: 'https://github.com/TBR-Group/flutterflow_ecommerce', accent: '#ff2d55' },
  { name: 'Quiz Creation Reference', url: 'https://github.com/extrawest/quiz_creation', accent: '#5ac8fa' },
]

const bonusChallenges = [
  { title: 'AI Layer', desc: 'Add a smart workflow using OpenAI or Gemini through custom actions.', accent: '#ff9500' },
  { title: 'Real-Time Sync', desc: 'Use listeners so multiple users see updates live.', accent: '#00f5d4' },
  { title: 'Launch Surface', desc: 'Connect a custom domain or store-ready release path.', accent: '#7b2ff7' },
  { title: 'Monetization', desc: 'Add subscriptions, payments, or ad logic where it makes sense.', accent: '#ff2d55' },
]

const fieldStyle = {
  width: '100%',
  padding: '1rem 1.05rem',
  borderRadius: '16px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f7f9ff',
  outline: 'none',
}

const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => htmlEscapes[char])
}

function buildCapstoneDocument({ selectedTopic, ffLink, githubLink, playStoreLink, demoLink }) {
  const generatedOn = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <title>Capstone Submission Package</title>
  <style>
    body {
      font-family: Calibri, Arial, sans-serif;
      color: #172033;
      margin: 32px;
      line-height: 1.55;
    }
    h1, h2, h3 {
      color: #2a2f7a;
      margin-bottom: 10px;
    }
    h1 {
      font-size: 24pt;
      margin-top: 0;
    }
    h2 {
      font-size: 15pt;
      margin-top: 28px;
      border-bottom: 1px solid #d7dcf5;
      padding-bottom: 6px;
    }
    p, li {
      font-size: 11pt;
    }
    .meta {
      background: #f4f6ff;
      border: 1px solid #d7dcf5;
      padding: 14px 16px;
      border-radius: 12px;
    }
    .label {
      font-weight: 700;
      color: #4f46e5;
    }
    .shot-box {
      margin-top: 12px;
      height: 180px;
      border: 2px dashed #b9c2ea;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6c7697;
      font-style: italic;
      text-align: center;
      padding: 16px;
    }
    .note {
      background: #fff8e8;
      border-left: 4px solid #f59e0b;
      padding: 12px 14px;
      margin-top: 14px;
    }
    a {
      color: #1d4ed8;
      word-break: break-word;
    }
  </style>
</head>
<body>
  <h1>Capstone Submission Package</h1>
  <div class="meta">
    <p><span class="label">Generated on:</span> ${escapeHtml(generatedOn)}</p>
    <p><span class="label">Selected topic:</span> ${escapeHtml(selectedTopic.title)}</p>
    <p><span class="label">Project brief:</span> ${escapeHtml(selectedTopic.description)}</p>
  </div>

  <h2>Project Links</h2>
  <ul>
    <li><span class="label">FlutterFlow Project:</span> <a href="${escapeHtml(ffLink)}">${escapeHtml(ffLink)}</a></li>
    <li><span class="label">GitHub Repository:</span> <a href="${escapeHtml(githubLink)}">${escapeHtml(githubLink)}</a></li>
    <li><span class="label">Demo Video:</span> <a href="${escapeHtml(demoLink)}">${escapeHtml(demoLink)}</a></li>
    <li><span class="label">Published App Link:</span> ${
      playStoreLink.trim()
        ? `<a href="${escapeHtml(playStoreLink)}">${escapeHtml(playStoreLink)}</a>`
        : 'Not provided'
    }</li>
  </ul>

  <h2>Implementation Summary</h2>
  <p>Describe the product goal, the target user, the backend used, and the most important implementation decisions you made.</p>
  <p>Recommended sections:</p>
  <ul>
    <li>Main problem solved by the app</li>
    <li>Core user flow and screens</li>
    <li>Backend and database setup</li>
    <li>Custom logic, APIs, or advanced FlutterFlow features used</li>
    <li>Testing, deployment, and known limitations</li>
  </ul>

  <h2>Required Screenshots</h2>
  <p>Add clear screenshots of the app below before submitting this document to the LMS.</p>
  <div class="shot-box">Insert home screen screenshot here</div>
  <div class="shot-box">Insert core workflow screenshot here</div>
  <div class="shot-box">Insert backend, admin, or settings-related screenshot here</div>
  <div class="shot-box">Insert responsive/mobile or final deployed screen here</div>

  <h2>Submission Instructions</h2>
  <ol>
    <li>Open this downloaded document in Microsoft Word or a compatible editor.</li>
    <li>Add your screenshots and fill in the implementation summary.</li>
    <li>Save the completed document.</li>
    <li>Upload the final document to the LMS as your capstone submission.</li>
  </ol>

  <div class="note">
    Keep all project links public and working until the review is complete.
  </div>
</body>
</html>`
}

function downloadCapstoneDocument(payload) {
  if (typeof window === 'undefined') return

  const documentHtml = buildCapstoneDocument(payload)
  const blob = new Blob(['\ufeff', documentHtml], { type: 'application/msword' })
  const url = window.URL.createObjectURL(blob)
  const link = window.document.createElement('a')

  link.href = url
  link.download = `capstone-submission-package-topic-${payload.selectedTopic.id}.doc`
  window.document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

function SurfaceCard({ children, style = {} }) {
  return (
    <div
      style={{
        background: 'linear-gradient(155deg, rgba(13,16,33,0.95), rgba(7,23,29,0.92))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '28px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function SectionIntro({ eyebrow, title, body, accent = '#fff' }) {
  return (
    <div style={{ display: 'grid', gap: '0.85rem', maxWidth: '820px' }}>
      <span
        style={{
          width: 'max-content',
          padding: '0.45rem 0.95rem',
          borderRadius: '999px',
          background: `${accent}16`,
          border: `1px solid ${accent}40`,
          color: accent,
          fontWeight: 800,
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </span>
      <h2 style={{ margin: 0, color: '#fff', fontSize: 'clamp(2rem, 4vw, 3.3rem)', lineHeight: 1.02, fontWeight: 900 }}>
        {title}
      </h2>
      <p style={{ margin: 0, color: '#b9c4df', lineHeight: 1.75, fontSize: '1.02rem' }}>{body}</p>
    </div>
  )
}

function RequirementList({ items, accent }) {
  return (
    <div style={{ display: 'grid', gap: '0.7rem' }}>
      {items.map((item) => (
        <div
          key={item}
          style={{
            display: 'grid',
            gridTemplateColumns: '22px 1fr',
            gap: '0.8rem',
            alignItems: 'start',
            color: '#d8e0f1',
            lineHeight: 1.55,
          }}
        >
          <span style={{ color: accent, fontWeight: 900 }}>+</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}

function TopicWheel({ rotation, spinning, onSpin, selectedTopic }) {
  return (
    <SurfaceCard style={{ padding: '1.3rem' }}>
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#ffcc00', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Randomizer
            </div>
            <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 800 }}>Need a direction?</div>
          </div>
          <button
            type="button"
            onClick={onSpin}
            disabled={spinning}
            style={{
              padding: '0.9rem 1.25rem',
              borderRadius: '16px',
              border: 'none',
              cursor: spinning ? 'not-allowed' : 'pointer',
              background: spinning ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #ffcc00, #ff2d55)',
              color: spinning ? '#8ea4c8' : '#08111d',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {spinning ? 'Spinning...' : 'Spin'}
          </button>
        </div>

        <div style={{ display: 'grid', placeItems: 'center', padding: '1rem 0 0.5rem' }}>
          <div style={{ position: 'relative', width: 'min(100%, 320px)', aspectRatio: '1 / 1' }}>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '-18px',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '16px solid transparent',
                borderRight: '16px solid transparent',
                borderTop: '28px solid #f7f9ff',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
                zIndex: 3,
              }}
            />
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ duration: 4.5, type: 'tween', ease: [0.1, 0.9, 0.2, 1] }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '8px solid rgba(255,255,255,0.08)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 30px 60px rgba(0,0,0,0.28)',
                position: 'relative',
                background: '#0c1020',
              }}
            >
              <svg viewBox="0 0 380 380" width="100%" height="100%" style={{ display: 'block', transform: 'rotate(-90deg)' }}>
                {problemStatements.map((item, i) => {
                  const count = problemStatements.length
                  const angle = 360 / count
                  const radius = 190
                  const cx = 190
                  const cy = 190
                  const startAngle = (i * angle) * (Math.PI / 180)
                  const endAngle = ((i + 1) * angle) * (Math.PI / 180)
                  const x1 = cx + radius * Math.cos(startAngle)
                  const y1 = cy + radius * Math.sin(startAngle)
                  const x2 = cx + radius * Math.cos(endAngle)
                  const y2 = cy + radius * Math.sin(endAngle)
                  const midAngle = (startAngle + endAngle) / 2
                  const textRadius = radius * 0.64
                  const textX = cx + textRadius * Math.cos(midAngle)
                  const textY = cy + textRadius * Math.sin(midAngle)
                  const textRotation = midAngle * (180 / Math.PI)
                  const words = item.title.split(' ')
                  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ')
                  const line2 = words.slice(Math.ceil(words.length / 2)).join(' ')

                  return (
                    <g key={item.id}>
                      <path
                        d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                        fill={item.themeColor}
                        stroke="rgba(255,255,255,0.16)"
                        strokeWidth="2"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="#fff"
                        fontSize="16"
                        fontWeight="800"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        style={{ textShadow: '0 2px 6px rgba(0,0,0,0.85)' }}
                      >
                        <tspan x={textX} dy="-0.6em">{line1}</tspan>
                        <tspan x={textX} dy="1.2em">{line2}</tspan>
                      </text>
                    </g>
                  )
                })}
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 'calc(50% - 26px)',
                  width: '52px',
                  height: '52px',
                  borderRadius: '999px',
                  background: '#0c1020',
                  border: '4px solid #fff',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.28)',
                }}
              />
            </motion.div>
          </div>
        </div>

        <div style={{ borderRadius: '18px', padding: '1rem', background: 'rgba(255,255,255,0.04)', border: `1px solid ${selectedTopic.themeColor}40` }}>
          <div style={{ color: selectedTopic.themeColor, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Current topic
          </div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.35rem' }}>{selectedTopic.title}</div>
          <div style={{ color: '#b9c4df', lineHeight: 1.6, fontSize: '0.94rem' }}>{selectedTopic.description}</div>
        </div>
      </div>
    </SurfaceCard>
  )
}

export default function CapstoneModule() {
  const readSavedValue = (key, fallback = '') => {
    if (typeof window === 'undefined') return fallback
    return window.localStorage.getItem(key) ?? fallback
  }

  const readSavedTopic = () => {
    if (typeof window === 'undefined') return problemStatements[0]
    const savedId = Number(window.localStorage.getItem('capstone:selectedTopicId'))
    return problemStatements.find((topic) => topic.id === savedId) || problemStatements[0]
  }

  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(() => Number(readSavedValue('capstone:rotation', '0')))
  const [selectedTopic, setSelectedTopic] = useState(readSavedTopic)
  const [ffLink, setFfLink] = useState(() => readSavedValue('capstone:ffLink'))
  const [githubLink, setGithubLink] = useState(() => readSavedValue('capstone:githubLink'))
  const [playStoreLink, setPlayStoreLink] = useState(() => readSavedValue('capstone:playStoreLink'))
  const [demoLink, setDemoLink] = useState(() => readSavedValue('capstone:demoLink'))
  const [documentDownloaded, setDocumentDownloaded] = useState(() => readSavedValue('capstone:documentDownloaded', 'false') === 'true')

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('capstone:rotation', String(rotation))
  }, [rotation])

  useEffect(() => {
    if (typeof window === 'undefined' || !selectedTopic) return
    window.localStorage.setItem('capstone:selectedTopicId', String(selectedTopic.id))
  }, [selectedTopic])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('capstone:ffLink', ffLink)
    window.localStorage.setItem('capstone:githubLink', githubLink)
    window.localStorage.setItem('capstone:playStoreLink', playStoreLink)
    window.localStorage.setItem('capstone:demoLink', demoLink)
    window.localStorage.setItem('capstone:documentDownloaded', String(documentDownloaded))
  }, [ffLink, githubLink, playStoreLink, demoLink, documentDownloaded])

  const spinWheel = () => {
    if (spinning || documentDownloaded) return
    setSpinning(true)

    const winIndex = Math.floor(Math.random() * problemStatements.length)
    const segmentAngle = 360 / problemStatements.length
    const baseSpins = 360 * 6
    const targetAngle = 360 - (winIndex * segmentAngle + segmentAngle / 2)
    const offset = (Math.random() - 0.5) * (segmentAngle * 0.7)
    const finalRotation = rotation + baseSpins - (rotation % 360) + targetAngle + offset

    setRotation(finalRotation)

    setTimeout(() => {
      setSpinning(false)
      setSelectedTopic(problemStatements[winIndex])
    }, 4500)
  }

  const handleTopicSelect = (topic) => {
    if (spinning || documentDownloaded) return
    setSelectedTopic(topic)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ffLink.trim() || !githubLink.trim() || !demoLink.trim()) return

    downloadCapstoneDocument({
      selectedTopic,
      ffLink,
      githubLink,
      playStoreLink,
      demoLink,
    })

    setDocumentDownloaded(true)
  }

  const handlePrepareAnother = () => {
    setDocumentDownloaded(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        color: '#fff',
        background: 'radial-gradient(circle at 12% 8%, rgba(123,47,247,0.18), transparent 24%), radial-gradient(circle at 88% 14%, rgba(255,45,85,0.14), transparent 24%), linear-gradient(180deg, #0a0d17 0%, #08111b 50%, #071521 100%)',
        overflowX: 'hidden',
      }}
    >
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0 2rem' }}>
        <div className="wrap" style={{ display: 'grid', gap: '1.4rem' }}>
          <span
            style={{
              width: 'max-content',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              background: 'rgba(255,45,85,0.12)',
              border: '1px solid rgba(255,45,85,0.28)',
              color: '#ff7d9e',
              fontSize: '0.76rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Final Capstone Module
          </span>

          <div className="responsive-grid" style={{ gap: '1.4rem', alignItems: 'end' }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 'clamp(3rem, 7vw, 5.6rem)',
                  lineHeight: 0.94,
                  fontWeight: 950,
                  letterSpacing: '-0.05em',
                }}
              >
                Build the
                <span style={{ display: 'block', background: 'linear-gradient(135deg, #ff2d55, #7b2ff7, #00f5d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  strongest thing in your portfolio
                </span>
              </h1>
              <p style={{ margin: 0, color: '#b9c4df', fontSize: '1.08rem', lineHeight: 1.8, maxWidth: '760px' }}>
                This capstone should feel like a real shipped product, not a classroom demo. Use the course stack end-to-end: product thinking, FlutterFlow UI, backend integration, logic, polish, testing, and deployment.
              </p>
            </div>

            <SurfaceCard style={{ padding: '1.35rem' }}>
              <div style={{ display: 'grid', gap: '0.9rem' }}>
                <div style={{ color: '#ffcc00', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Delivery standard
                </div>
                <div style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900 }}>2–4 week production sprint</div>
                <div style={{ color: '#b9c4df', lineHeight: 1.7 }}>
                  Ship something you can defend technically. The final review should show clear product scope, backend reasoning, UI quality, and release readiness.
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </section>

      <section style={{ padding: '1rem 0 0' }}>
        <div className="wrap" style={{ display: 'grid', gap: '3rem' }}>
          <SectionIntro
            eyebrow="Project Brief"
            title="What your capstone must prove"
            body="The capstone is your final synthesis task. It should demonstrate that you can turn a product idea into a responsive, data-backed application with thoughtful user flows and a release-ready surface."
            accent="#5ac8fa"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem' }}>
            {corePillars.map((pillar) => (
              <SurfaceCard key={pillar.title} style={{ padding: '1.2rem', borderColor: `${pillar.accent}40`, background: `linear-gradient(160deg, ${pillar.accent}12, rgba(10,14,28,0.96))` }}>
                <div style={{ color: pillar.accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
                  Required
                </div>
                <div style={{ color: '#fff', fontSize: '1.08rem', fontWeight: 800, marginBottom: '0.45rem' }}>{pillar.title}</div>
                <div style={{ color: '#b9c4df', lineHeight: 1.6, fontSize: '0.92rem' }}>{pillar.detail}</div>
              </SurfaceCard>
            ))}
          </div>

          <div className="responsive-grid" style={{ gap: '1rem', alignItems: 'stretch' }}>
            <SurfaceCard style={{ padding: '1.35rem' }}>
              <div style={{ color: '#5ac8fa', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                Objective
              </div>
              <div style={{ color: '#fff', fontSize: '1.45rem', fontWeight: 900, marginBottom: '0.8rem' }}>Build a complete product slice</div>
              <RequirementList
                accent="#5ac8fa"
                items={[
                  'Real authentication flow',
                  'Structured backend integration',
                  'State-driven screens and actions',
                  'Custom logic or external capability',
                  'Media, motion, and responsive design',
                  'Documented deployment-ready outcome',
                ]}
              />
            </SurfaceCard>

            <SurfaceCard style={{ padding: '1.35rem' }}>
              <div style={{ color: '#ffcc00', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                Timeline
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {timelinePhases.map((phase) => (
                  <div key={phase.step} style={{ display: 'grid', gridTemplateColumns: '54px 1fr', gap: '0.9rem', alignItems: 'start' }}>
                    <div style={{ width: '54px', height: '54px', borderRadius: '18px', background: 'rgba(255,204,0,0.12)', border: '1px solid rgba(255,204,0,0.28)', display: 'grid', placeItems: 'center', color: '#ffcc00', fontWeight: 900 }}>
                      {phase.step}
                    </div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.25rem' }}>{phase.title}</div>
                      <div style={{ color: '#b9c4df', lineHeight: 1.6 }}>{phase.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 0 0' }}>
        <div className="wrap" style={{ display: 'grid', gap: '2rem' }}>
          <SectionIntro
            eyebrow="Topic Lab"
            title="Choose a problem worth shipping"
            body="You can spin for a random direction or select a topic directly. The goal is not novelty for its own sake. Pick a shape that lets you demonstrate backend reasoning, polished UI, and meaningful product logic."
            accent="#ff2d55"
          />

          <div className="responsive-grid" style={{ gap: '1.2rem', alignItems: 'stretch' }}>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {problemStatements.map((topic) => {
                const isSelected = selectedTopic.id === topic.id
                return (
                  <motion.button
                    key={topic.id}
                    type="button"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleTopicSelect(topic)}
                    style={{
                      textAlign: 'left',
                      padding: '1rem 1.05rem',
                      borderRadius: '22px',
                      cursor: spinning ? 'not-allowed' : 'pointer',
                      border: `1px solid ${isSelected ? topic.themeColor : 'rgba(255,255,255,0.08)'}`,
                      background: isSelected ? `${topic.themeColor}14` : 'rgba(255,255,255,0.03)',
                      color: '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '0.45rem', alignItems: 'start', flexWrap: 'wrap' }}>
                      <div style={{ color: topic.themeColor, fontWeight: 800, fontSize: '1rem' }}>{topic.title}</div>
                      <div style={{ padding: '0.28rem 0.55rem', borderRadius: '999px', background: `${topic.themeColor}18`, color: topic.themeColor, fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                        Topic {topic.id}
                      </div>
                    </div>
                    <div style={{ color: '#b9c4df', lineHeight: 1.58, fontSize: '0.9rem' }}>{topic.description}</div>
                  </motion.button>
                )
              })}
            </div>

            <TopicWheel rotation={rotation} spinning={spinning} onSpin={spinWheel} selectedTopic={selectedTopic} />
          </div>

          <motion.div
            key={selectedTopic.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <SurfaceCard style={{ padding: '1.4rem', borderLeft: `6px solid ${selectedTopic.themeColor}` }}>
              <div className="responsive-grid" style={{ gap: '1.2rem', alignItems: 'stretch' }}>
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                  <div style={{ color: selectedTopic.themeColor, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Selected direction
                  </div>
                  <div style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.02 }}>
                    {selectedTopic.title}
                  </div>
                  <div style={{ color: '#cfd8ee', lineHeight: 1.7, fontSize: '1rem' }}>
                    {selectedTopic.description}
                  </div>
                </div>

                <div style={{ borderRadius: '22px', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.8rem' }}>Implementation requirements</div>
                  <RequirementList items={selectedTopic.requirements} accent={selectedTopic.themeColor} />
                </div>
              </div>
            </SurfaceCard>
          </motion.div>
        </div>
      </section>

      <section style={{ padding: '4rem 0 0' }}>
        <div className="wrap" style={{ display: 'grid', gap: '2rem' }}>
          <SectionIntro
            eyebrow="Support Stack"
            title="References and stretch goals"
            body="Use references to reduce friction, but do not ship a clone. The strongest capstone submissions adapt patterns and then make deliberate product decisions of their own."
            accent="#4cd964"
          />

          <div className="responsive-grid" style={{ gap: '1rem', alignItems: 'stretch' }}>
            <SurfaceCard style={{ padding: '1.35rem' }}>
              <div style={{ color: '#4cd964', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                References
              </div>
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                {resourceLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      textDecoration: 'none',
                      borderRadius: '18px',
                      padding: '1rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'grid',
                      gap: '0.35rem',
                    }}
                  >
                    <span style={{ color: item.accent, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Open resource</span>
                    <span style={{ color: '#fff', fontWeight: 800 }}>{item.name}</span>
                    <span style={{ color: '#8ea4c8', fontSize: '0.88rem' }}>{item.url}</span>
                  </a>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard style={{ padding: '1.35rem' }}>
              <div style={{ color: '#ff9500', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                Bonus challenges
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '0.9rem' }}>
                {bonusChallenges.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      borderRadius: '20px',
                      padding: '1rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${item.accent}35`,
                    }}
                  >
                    <div style={{ color: item.accent, fontWeight: 800, marginBottom: '0.4rem' }}>{item.title}</div>
                    <div style={{ color: '#b9c4df', lineHeight: 1.58, fontSize: '0.9rem' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 0 6rem' }}>
        <div className="wrap" style={{ display: 'grid', gap: '2rem' }}>
          <SectionIntro
            eyebrow="Submission"
            title="Prepare the LMS submission document"
            body="Enter the project links, download the Word submission package, add screenshots and notes in the document, then upload that completed file to the LMS."
            accent="#7b2ff7"
          />

          <SurfaceCard style={{ padding: '1.35rem' }}>
            <div className="responsive-grid" style={{ gap: '1.2rem', alignItems: 'start' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ color: '#7b2ff7', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Review checklist
                </div>
                <RequirementList
                  accent="#7b2ff7"
                  items={[
                    'Working FlutterFlow project link',
                    'Public GitHub repository',
                    'Demo walkthrough video',
                    'Downloaded Word package with screenshots added',
                  ]}
                />

                <div style={{ padding: '1rem', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ color: '#fff', fontWeight: 800, marginBottom: '0.35rem' }}>What happens after download</div>
                  <div style={{ color: '#b9c4df', lineHeight: 1.65 }}>
                    Open the generated Word file, insert app screenshots, add your implementation summary, save the final document, and upload that file in the LMS.
                  </div>
                </div>
              </div>

              {!documentDownloaded ? (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'grid', gap: '0.45rem' }}>
                    <label style={{ color: '#dce5f8', fontWeight: 700, fontSize: '0.92rem' }}>FlutterFlow Project Link *</label>
                    <input required type="url" value={ffLink} onChange={(e) => setFfLink(e.target.value)} placeholder="https://app.flutterflow.io/..." style={fieldStyle} />
                  </div>
                  <div style={{ display: 'grid', gap: '0.45rem' }}>
                    <label style={{ color: '#dce5f8', fontWeight: 700, fontSize: '0.92rem' }}>GitHub Repository *</label>
                    <input required type="url" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} placeholder="https://github.com/you/repo" style={fieldStyle} />
                  </div>
                  <div style={{ display: 'grid', gap: '0.45rem' }}>
                    <label style={{ color: '#dce5f8', fontWeight: 700, fontSize: '0.92rem' }}>Play Store / App Link</label>
                    <input type="url" value={playStoreLink} onChange={(e) => setPlayStoreLink(e.target.value)} placeholder="Optional published link" style={fieldStyle} />
                  </div>
                  <div style={{ display: 'grid', gap: '0.45rem' }}>
                    <label style={{ color: '#dce5f8', fontWeight: 700, fontSize: '0.92rem' }}>Demo Video *</label>
                    <input required type="url" value={demoLink} onChange={(e) => setDemoLink(e.target.value)} placeholder="Loom / Drive / YouTube link" style={fieldStyle} />
                  </div>

                  <button
                    type="submit"
                    style={{
                      gridColumn: '1 / -1',
                      padding: '1rem 1.2rem',
                      borderRadius: '18px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #7b2ff7, #00f5d4)',
                      color: '#07111b',
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Download Submission Document
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    borderRadius: '28px',
                    padding: '2rem',
                    background: 'linear-gradient(145deg, rgba(76,217,100,0.14), rgba(255,255,255,0.03))',
                    border: '1px solid rgba(76,217,100,0.35)',
                    display: 'grid',
                    gap: '0.8rem',
                    textAlign: 'center',
                    placeItems: 'center',
                  }}
                >
                  <div style={{ fontSize: '4rem' }}>🏁</div>
                  <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 900 }}>Submission document downloaded</div>
                  <div style={{ color: '#d9e4f4', lineHeight: 1.7, maxWidth: '540px' }}>
                    Add screenshots of the app inside the downloaded Word file, complete your implementation summary, save it, and upload that final document to the LMS.
                  </div>
                  <button
                    type="button"
                    onClick={handlePrepareAnother}
                    style={{
                      marginTop: '0.4rem',
                      padding: '0.9rem 1.15rem',
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: 'rgba(255,255,255,0.05)',
                      color: '#f7f9ff',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Regenerate Document
                  </button>
                </motion.div>
              )}
            </div>
          </SurfaceCard>
        </div>
      </section>
    </div>
  )
}
