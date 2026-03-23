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
