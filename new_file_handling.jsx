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
