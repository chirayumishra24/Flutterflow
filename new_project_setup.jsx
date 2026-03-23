function PageProjectSetup() {
  const [openFaq, setOpenFaq] = useState('misalign')

  const permissionModes = [
    {
      id: 'messages',
      title: 'Permission Messages',
      kicker: 'Consent copy',
      accent: '#ffd700',
      desc: 'Replace the default permission text with clear, human language so users understand why access is needed.',
      steps: [
        'Settings & Integrations → Project Setup → Permissions.',
        'Customize the permission message for each permission. For permissions not added yet, turn on the toggle and enter the message.',
      ],
      image: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316145025-6.png',
      caption: 'Permission message editor inside Project Setup.',
      callout: { tone: 'info', title: 'iOS-only custom copy', body: 'Android does not display this custom message, so the text configured here appears only on iOS devices.' }
    },
    {
      id: 'custom',
      title: 'Custom Permissions',
      kicker: 'Manual extension',
      accent: '#00f5d4',
      desc: 'If a custom widget or action needs a permission that is not listed, you can define it manually for Android and iOS.',
      steps: [
        'Settings & Integrations → Project Setup → Permissions.',
        'Click + Add Permission.',
        'Enter iOS Permission key (e.g., NSMicrophoneUsageDescription) and Android name (e.g., RECORD_AUDIO).',
        'Enter the Permission Message.',
      ],
      image: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316145025-5.png',
      caption: 'Permissions panel where new permissions are added and reviewed.',
    },
    {
      id: 'request',
      title: 'Request Permission Action',
      kicker: 'Runtime flow',
      accent: '#ff2d55',
      desc: 'Request permission at the right moment, then branch the action flow based on whether access was granted or rejected.',
      steps: [
        'Select Widget → Actions → Open Action Flow Editor.',
        'Add Request Permissions action (under Alerts/Notifications).',
        'Set Permission Type and add conditional branch for true/false outcome.',
      ],
      image: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316145025-7.png',
      caption: 'Use conditional branches to handle granted and denied outcomes cleanly.',
    }
  ]

  const platformSettings = [
    {
      title: 'Android',
      subtitle: 'Advanced Android Settings',
      accent: '#00f5d4',
      desc: 'Tune SDK targets and Kotlin compatibility when your Android build needs stricter version control.',
      chips: ['Kotlin', 'Min SDK', 'Compile SDK', 'Target SDK'],
    },
    {
      title: 'iOS',
      subtitle: 'Advanced iOS Settings',
      accent: '#ffd700',
      desc: 'Set the lowest supported iOS version and decide whether the project should support iPad layouts.',
      chips: ['Minimum iOS', 'iPad support'],
    },
    {
      title: 'Web',
      subtitle: 'Advanced Web Settings',
      accent: '#a67cff',
      desc: 'Use web-specific rendering options when you need faster load times or stronger canvas performance.',
      chips: ['CanvasKit', 'Original engine init'],
    },
  ]

  const walkthroughStages = [
    {
      id: 'create',
      label: 'Create',
      accent: '#ffd700',
      title: 'Compose the walkthrough',
      desc: 'Build the tour, anchor each step to a real widget, then control overlay, focus shape, and content placement.',
      steps: [
        'Settings and Integrations → General → Walkthroughs → Create New.',
        'Choose widget to highlight, add content, set overlay color and alignment.',
        'Preview and save.',
      ],
      image: 'https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316145025-8.png',
      links: [
        { label: 'Overview Demo', href: 'https://www.loom.com/embed/cc0e2560855d4e988a6b881ca1b63377?sid=8f959be3-b08a-4043-a3df-bea460297b2a' }
      ]
    },
    {
      id: 'start',
      label: 'Start',
      accent: '#00f5d4',
      title: 'Launch the walkthrough',
      desc: 'Attach the walkthrough to On Page Load or another event so it appears at the right point in the user journey.',
      steps: [
        'Open page → Actions → On Page Load.',
        'Add Walkthrough → Start Walkthrough action.',
      ],
      links: [
        { label: 'Start Walkthrough Demo', href: 'https://www.loom.com/embed/13ff22ea7a624d54b3874256fac88b9c?sid=91ed6db7-8e16-4464-a133-b532846eaa36' }
      ]
    },
    {
      id: 'callbacks',
      label: 'React',
      accent: '#ff2d55',
      title: 'Handle skip and completion',
      desc: 'Use callbacks to save onboarding state, trigger analytics, or route users differently after the tour ends.',
      steps: [
        'Open page → Actions.',
        'Select On Walkthrough Complete or On Walkthrough Skip to branch logic.',
      ],
      links: [
        { label: 'Callback Actions Demo', href: 'https://www.loom.com/embed/53546557a01d4e65864f997467cea6ad?sid=f8f999ae-97cc-4a96-9b8a-7736a6561907' },
      ]
    }
  ]

  const faqItems = [
    {
      id: 'misalign',
      question: 'How do I fix a walkthrough that highlights the wrong spot?',
      answer: (
        <>
          <p style={{ color: '#c8c8e0', lineHeight: 1.75, marginBottom: '0.9rem' }}>
            This usually happens when a widget animation and the walkthrough start at the same time. The walkthrough captures the widget before the animation finishes.
          </p>
          <p style={{ color: '#c8c8e0', lineHeight: 1.75, marginBottom: '1rem' }}>
            Fix it by adding a Wait action before starting the walkthrough. The delay should be equal to or greater than the animation duration.
          </p>
          <div className="step-media" style={{ marginTop: '0.2rem' }}>
            <img src="https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316145025-9.png" alt="Walkthrough misalignment example" />
          </div>
        </>
      )
    },
    {
      id: 'scroll',
      question: 'My widget is on a scrollable page and will not highlight. What should I do?',
      answer: (
        <p style={{ color: '#c8c8e0', lineHeight: 1.75, margin: 0 }}>
          Widgets that are off-screen and require scrolling may not be highlighted correctly. Move the target widget so it is visible without scrolling when the walkthrough starts. 
        </p>
      )
    }
  ]

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <MotionReveal>
        <span className="chip" style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}>
          Module 3 — Chapter 3.1 · Page 6
        </span>
        <h1 className="sec-title">Project Setup Redesigned</h1>
        <p className="sec-desc">
          Setting up a project in FlutterFlow ensures your app is prepared to provide a robust, user-friendly experience across platforms and regions.
        </p>
      </MotionReveal>

      {/* Permissions Section */}
      <div style={{ marginTop: '4rem' }}>
        <MotionReveal>
          <div style={{
            borderRadius: '30px',
            padding: '2.5rem',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(180deg, rgba(18,20,40,0.95) 0%, rgba(8,10,22,0.98) 100%)',
            marginBottom: '3rem',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '1.2rem' }}>Permission flows should feel intentional.</h2>
            <p style={{ color: '#c8c8e0', lineHeight: 1.8, fontSize: '1.05rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
              In your app, you must get explicit consent before using private information like location, microphone, photos, or camera input.
            </p>
            <div className="step-media" style={{ borderRadius: '24px', maxWidth: '800px', margin: '0 auto' }}>
              <img src="https://login.skillizee.io/s/articles/69b7ca9595ffd50821a3fdcd/images/image-20260316145025-5.png" alt="Permissions settings in FlutterFlow" />
            </div>
          </div>
        </MotionReveal>

        <div style={{ display: 'grid', gap: '3rem' }}>
          {permissionModes.map((mode, i) => (
            <MotionReveal key={mode.id} delay={i * 0.1}>
              <HoloCard style={{ padding: 0, overflow: 'hidden' }}>
                <div className="chapter-split" style={{ alignItems: 'center', gap: 0, margin: 0, flexDirection: i % 2 !== 0 ? 'row-reverse' : 'row' }}>
                  <div style={{ padding: '2.5rem', flex: 1 }}>
                    <div style={{ color: mode.accent, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.8rem' }}>
                      {mode.kicker}
                    </div>
                    <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '1rem' }}>{mode.title}</h3>
                    <p style={{ color: '#d3d9ea', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.05rem' }}>{mode.desc}</p>
                    <StepsList steps={mode.steps} dense />
                    {mode.callout && (
                      <div style={{ marginTop: '1.5rem' }}>
                        <CalloutCard tone={mode.callout.tone} title={mode.callout.title}>{mode.callout.body}</CalloutCard>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.15)' }}>
                    <img src={mode.image} alt={mode.title} style={{ width: '100%', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} />
                    <p style={{ color: '#aeb7cf', fontSize: '0.9rem', marginTop: '1rem', textAlign: 'center' }}>{mode.caption}</p>
                  </div>
                </div>
              </HoloCard>
            </MotionReveal>
          ))}
        </div>
      </div>

      {/* Platform Tuning Section */}
      <div style={{ marginTop: '6rem' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Platform Tuning</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto' }}>
              Use this section to switch between platform-specific advanced settings, and enable desktop targets when your release scope expands beyond mobile.
            </p>
          </div>
        </MotionReveal>
        <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {platformSettings.map((platform, i) => (
            <MotionReveal key={platform.title} delay={i * 0.1}>
              <TiltCard accent={platform.accent} style={{ height: '100%' }}>
                <h3 style={{ color: platform.accent, fontSize: '1.4rem', marginBottom: '0.5rem' }}>{platform.title}</h3>
                <div style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>{platform.subtitle}</div>
                <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{platform.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {platform.chips.map(chip => (
                    <span key={chip} style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: `${platform.accent}20`, border: `1px solid ${platform.accent}40`, color: '#fff', fontSize: '0.8rem' }}>
                      {chip}
                    </span>
                  ))}
                </div>
              </TiltCard>
            </MotionReveal>
          ))}
        </div>
      </div>

      {/* Walkthrough Studio Section */}
      <div style={{ marginTop: '6rem' }}>
        <MotionReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Walkthrough Studio</h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '800px', margin: '0 auto' }}>
              Walkthroughs act like product tours. Use them to spotlight important UI and onboard users the first time they land in your app.
            </p>
          </div>
        </MotionReveal>
        <div className="chapter-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {walkthroughStages.map((stage, i) => (
            <MotionReveal key={stage.id} delay={i * 0.1}>
              <NeonCard accent={stage.accent} style={{ height: '100%', background: `linear-gradient(160deg, rgba(20,20,35,0.9), rgba(10,10,20,0.95))` }}>
                <div style={{ color: stage.accent, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.8rem' }}>
                  Stage {i + 1}: {stage.label}
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.8rem' }}>{stage.title}</h3>
                <p style={{ color: '#c8c8e0', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{stage.desc}</p>
                <StepsList steps={stage.steps} dense />
                {stage.image && (
                  <div style={{ marginTop: '1.5rem', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${stage.accent}40` }}>
                    <img src={stage.image} alt={stage.title} style={{ width: '100%', display: 'block' }} />
                  </div>
                )}
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {stage.links?.map(link => (
                    <a key={link.href} href={link.href} className="arrow-link" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem' }}>
                      {link.label} <span>→</span>
                    </a>
                  ))}
                </div>
              </NeonCard>
            </MotionReveal>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ marginTop: '5rem' }}>
        <MotionReveal>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '2rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {faqItems.map((faq) => {
              const expanded = openFaq === faq.id
              return (
                <div key={faq.id} style={{ borderRadius: '22px', border: `1px solid ${expanded ? 'rgba(255,215,0,0.28)' : 'rgba(255,255,255,0.08)'}`, background: expanded ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
                  <button onClick={() => setOpenFaq(expanded ? null : faq.id)} style={{ width: '100%', textAlign: 'left', padding: '1.25rem 1.5rem', border: 0, background: 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{faq.question}</span>
                    <span style={{ color: '#ffd700', fontSize: '1.4rem' }}>{expanded ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                        <div style={{ padding: '0 1.5rem 1.5rem' }}>{faq.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </MotionReveal>
      </div>
    </div>
  )
}
