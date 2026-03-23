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
                Text Fields, Radio Buttons, and Checkboxes automatically emit their current evaluation. No need to map `onChange` functions—just read directly from `Widget State -> [your_widget_name]`.
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
