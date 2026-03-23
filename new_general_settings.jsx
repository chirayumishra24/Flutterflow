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
