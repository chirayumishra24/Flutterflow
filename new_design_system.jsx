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
