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
