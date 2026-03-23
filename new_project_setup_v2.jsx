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
