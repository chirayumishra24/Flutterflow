import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const problemStatements = [
  {
    id: 1,
    title: "E-commerce / Marketplace",
    themeColor: "#ff2d55",
    description: "Build a sleek e-commerce shopping app for a local clothing brand.",
    requirements: [
      "Product catalog with search/filter",
      "Cart & Checkout system",
      "User profile and Order history",
      "Image uploads for products/sellers",
      "Payment integration (Stripe/Razorpay via custom action)"
    ]
  },
  {
    id: 2,
    title: "Social Media / Feed App",
    themeColor: "#5856d6",
    description: "Design a photo-sharing application tailored for foodies or creatives.",
    requirements: [
      "Post creation with media upload",
      "Like/Comment system & Real-time feed",
      "User profiles and Notifications",
      "Hero animations for image views"
    ]
  },
  {
    id: 3,
    title: "Task / Habit Tracker",
    themeColor: "#ff9500",
    description: "Create an advanced productivity app for tracking goals and daily habits.",
    requirements: [
      "Categories, Due dates with reminders",
      "File attachments and Progress analytics",
      "Dark mode toggle",
      "Custom animations for task completion"
    ]
  },
  {
    id: 4,
    title: "Quiz / Learning App",
    themeColor: "#4cd964",
    description: "A visually engaging educational platform for quick modular courses.",
    requirements: [
      "Multiple-choice quizzes & Score tracking",
      "Media-rich questions (images/videos)",
      "Leaderboard & Certificate generation (PDF)",
      "Animations on correct/wrong answers"
    ]
  },
  {
    id: 5,
    title: "Fitness / Meal Planner",
    themeColor: "#5ac8fa",
    description: "An app for users to log workouts, track calories, and plan healthy meals.",
    requirements: [
      "Workout/exercise library with videos",
      "Meal logging with image upload",
      "Progress tracking via charts",
      "Custom functions for calorie calculation"
    ]
  },
  {
    id: 6,
    title: "Your Own Awesome Idea",
    themeColor: "#ffcc00",
    description: "Design and build an original app of similar complexity (approved by instructor).",
    requirements: [
      "Must incorporate at least 80% of the course modules",
      "Full backend integration",
      "Responsive UI",
      "Published to App/Play Store"
    ]
  }
];

const GlassCard = ({ children, delay = 0, style = {}, className="" }) => (
  <motion.div 
    initial={false}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.35 }}
    className={className}
    style={{ 
      background: 'rgba(255,255,255,0.03)', 
      border: '1px solid rgba(255,255,255,0.05)', 
      borderRadius: '24px', 
      padding: '2.5rem', 
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      ...style
    }}
  >
    {children}
  </motion.div>
);

const SectionTitle = ({ children, icon, color = "#fff", delay = 0, style={} }) => (
  <motion.h3 
    initial={false}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.35 }}
    style={{ 
      fontSize: '2rem', fontWeight: 800, color, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px',
      ...style
    }}
  >
    {icon && <span style={{ fontSize: '2.5rem', filter: `drop-shadow(0 0 10px ${color}80)` }}>{icon}</span>}
    {children}
  </motion.h3>
);

const ListItem = ({ children, color = "#ff2d55", icon = "✦", delay = 0 }) => (
  <motion.li 
    initial={false}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.25 }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#b0b0cc', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '0.8rem' }}
  >
    <span style={{ color, marginTop: '2px', fontSize: '1.2rem', fontWeight: 'bold' }}>{icon}</span>
    <span>{children}</span>
  </motion.li>
);

export default function CapstoneModule() {
  const readSavedValue = (key, fallback = '') => {
    if (typeof window === 'undefined') return fallback;
    return window.localStorage.getItem(key) ?? fallback;
  };

  const readSavedTopic = () => {
    if (typeof window === 'undefined') return problemStatements[0];
    const savedId = Number(window.localStorage.getItem('capstone:selectedTopicId'));
    return problemStatements.find((topic) => topic.id === savedId) || problemStatements[0];
  };

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(() => Number(readSavedValue('capstone:rotation', '0')));
  const [selectedTopic, setSelectedTopic] = useState(readSavedTopic);
  
  const [ffLink, setFfLink] = useState(() => readSavedValue('capstone:ffLink'));
  const [githubLink, setGithubLink] = useState(() => readSavedValue('capstone:githubLink'));
  const [playStoreLink, setPlayStoreLink] = useState(() => readSavedValue('capstone:playStoreLink'));
  const [demoLink, setDemoLink] = useState(() => readSavedValue('capstone:demoLink'));
  const [submitted, setSubmitted] = useState(() => readSavedValue('capstone:submitted', 'false') === 'true');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('capstone:rotation', String(rotation));
  }, [rotation]);

  useEffect(() => {
    if (typeof window === 'undefined' || !selectedTopic) return;
    window.localStorage.setItem('capstone:selectedTopicId', String(selectedTopic.id));
  }, [selectedTopic]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('capstone:ffLink', ffLink);
    window.localStorage.setItem('capstone:githubLink', githubLink);
    window.localStorage.setItem('capstone:playStoreLink', playStoreLink);
    window.localStorage.setItem('capstone:demoLink', demoLink);
    window.localStorage.setItem('capstone:submitted', String(submitted));
  }, [ffLink, githubLink, playStoreLink, demoLink, submitted]);

  const spinWheel = () => {
    if (spinning || submitted) return;
    setSpinning(true);
    
    const winIndex = Math.floor(Math.random() * problemStatements.length);
    const segmentAngle = 360 / problemStatements.length;
    const baseSpins = 360 * 6;
    const targetAngle = 360 - (winIndex * segmentAngle + segmentAngle / 2);
    const offset = (Math.random() - 0.5) * (segmentAngle * 0.7); 
    const finalRotation = rotation + baseSpins - (rotation % 360) + targetAngle + offset;

    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setSelectedTopic(problemStatements[winIndex]);
    }, 4500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ffLink.trim() && githubLink.trim() && demoLink.trim()) setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#0f0f13', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>
      
      {/* ─── FULL-WIDTH HERO ─── */}
      <div style={{ position: 'relative', width: '100%', padding: '8rem 4rem 6rem', background: 'linear-gradient(180deg, rgba(123, 47, 247, 0.15) 0%, rgba(15, 15, 19, 1) 100%)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', top: -200, right: '10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(123,47,247,0.1) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: -100, left: '5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,45,85,0.08) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }} />
        
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.6rem 1.5rem', background: 'rgba(255, 45, 85, 0.12)', color: '#ff2d55', borderRadius: '50px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2rem', border: '1px solid rgba(255,45,85,0.4)', boxShadow: '0 0 20px rgba(255,45,85,0.2)' }}>
            <span style={{ marginRight: '10px' }}>🚀</span> Final Capstone Project
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 950, marginBottom: '2rem', lineHeight: '1', letterSpacing: '-0.04em' }}>
            Build, Deploy & <br/>
            <span style={{ background: 'linear-gradient(135deg, #ff2d55 0%, #7b2ff7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Showcase Your Vision</span>
          </h1>
          <p style={{ color: '#b0b0cc', fontSize: '1.4rem', lineHeight: '1.6', maxWidth: '850px', fontWeight: 450 }}>
            The final frontier of your FlutterFlow journey. Apply everything from Modules 1–5 to create a production-ready application that represents your unique potential as a developer.
          </p>
        </motion.div>
      </div>

      {/* ─── MAIN CONTENT CONTAINER (Expansive Width) ─── */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '4rem 4rem 8rem', display: 'flex', flexDirection: 'column', gap: '6rem' }}>
        
        {/* Objective & Phases Section (Offset Layout) */}
        <div className="responsive-grid" style={{ gap: '3rem'  }}>
          
          <div style={{ gridColumn: 'span 7' }}>
            <SectionTitle icon="🎯" color="#5ac8fa" style={{ fontSize: '2.5rem' }}>Project Objective</SectionTitle>
            <p style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '2rem', fontWeight: 500, lineHeight: 1.6 }}>
              Your capstone must be a comprehensive, real-world solution. <br/>
              Ensure your application integrates these core pillars:
            </p>
            <div className="responsive-grid" style={{ gap: '1rem'  }}>
               <ListItem color="#5ac8fa">User Authentication</ListItem>
               <ListItem color="#5ac8fa">Backend (Firebase/Supabase)</ListItem>
               <ListItem color="#5ac8fa">Advanced State Mgmt</ListItem>
               <ListItem color="#5ac8fa">Custom Functions/Code</ListItem>
               <ListItem color="#5ac8fa">Immersive Animations</ListItem>
               <ListItem color="#5ac8fa">Responsive Design System</ListItem>
               <ListItem color="#5ac8fa">Git Branching Workflow</ListItem>
               <ListItem color="#5ac8fa">App Store Deployment</ListItem>
            </div>
          </div>

          <div style={{ gridColumn: 'span 5' }}>
            <GlassCard style={{ height: '100%', borderLeft: '4px solid #ffcc00', padding: '3rem' }}>
              <SectionTitle icon="⏱️" color="#ffcc00" style={{ fontSize: '1.5rem' }}>Timeline</SectionTitle>
              <h4 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>2–4 Weeks</h4>
              <p style={{ color: '#b0b0cc', lineHeight: 1.6 }}>Take your time to polish the UI, fix edge cases, and ensure the backend logic is bulletproof before the final submission.</p>
              
              <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ffcc0020', border: '1px solid #ffcc00', color: '#ffcc00', display: 'grid', placeItems: 'center', fontWeight: 900, flexShrink: 0 }}>1</div>
                    <div><p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>Planning & Setup</p><span style={{ color: '#888', fontSize: '0.85rem' }}>Define flows & design system</span></div>
                 </div>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ffcc0020', border: '1px solid #ffcc00', color: '#ffcc00', display: 'grid', placeItems: 'center', fontWeight: 900, flexShrink: 0 }}>2</div>
                    <div><p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>Core Development</p><span style={{ color: '#888', fontSize: '0.85rem' }}>Auth, Backend, Logic, Media</span></div>
                 </div>
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ffcc0020', border: '1px solid #ffcc00', color: '#ffcc00', display: 'grid', placeItems: 'center', fontWeight: 900, flexShrink: 0 }}>3</div>
                    <div><p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>Polish & Launch</p><span style={{ color: '#888', fontSize: '0.85rem' }}>Testing, Git export, Deployment</span></div>
                 </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* ─── FULL-WIDTH INTEGRATED WHEEL & IDEAS SECTION ─── */}
        <section style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', background: 'rgba(255,255,255,0.02)', padding: '6rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 4rem' }}>
            <div style={{ textAlign: 'left', marginBottom: '4rem' }}>
              <SectionTitle icon="💡" color="#ff2d55" style={{ fontSize: '3rem' }}>Suggested Ideas</SectionTitle>
              <p style={{ color: '#b0b0cc', fontSize: '1.2rem', maxWidth: '800px' }}>
                Pick a starting point that aligns with your passion. Each of these templates contains the complexity required to showcase your expertise.
              </p>
            </div>

            <div className="responsive-grid" style={{ gap: '4rem', alignItems: 'start'  }}>
               
               {/* Ideas Matrix */}
               <div className="responsive-grid" style={{ gap: '1.5rem'  }}>
                  {[
                    { title: "E-commerce System", desc: "Cart, Checkout, Stripe Payments.", color: "#ff2d55" },
                    { title: "Social Interaction", desc: "Feeds, Likes, Media Uploads.", color: "#5856d6" },
                    { title: "Productivity Engine", desc: "Habits, Reminders, Analytics.", color: "#ff9500" },
                    { title: "LMS Interface", desc: "Quizzes, Certificates, Progress.", color: "#4cd964" },
                    { title: "Health Discovery", desc: "Meal Logs, Workout Plans.", color: "#5ac8fa" },
                    { title: "Custom Vision", desc: "Bring your own unique concept.", color: "#ffcc00" }
                  ].map((idea, idx) => (
                    <motion.div key={idx} whileHover={{ y: -5, x: 5 }} transition={{ type: 'spring', stiffness: 300 }}
                      style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', borderLeft: `6px solid ${idea.color}`, backdropFilter: 'blur(5px)' }}
                    >
                      <h4 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{idea.title}</h4>
                      <p style={{ color: '#8c8cae', margin: 0, fontSize: '1rem' }}>{idea.desc}</p>
                    </motion.div>
                  ))}
               </div>

               {/* Integrated Wheel Design */}
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '4rem 2rem', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 900, marginBottom: '2.5rem', textAlign: 'center' }}>Can't decide? <br/><span style={{ color: '#7b2ff7' }}>Let fate select.</span></h3>
                  
                  <div style={{ position: 'relative', width: '300px', height: '300px', marginBottom: '3rem' }}>
                    <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderTop: '30px solid #fff', zIndex: 10, filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.8))' }} />
                    
                    <motion.div
                      style={{ width: '100%', height: '100%', borderRadius: '50%', border: '6px solid #2a2a35', overflow: 'hidden', position: 'relative', boxShadow: '0 0 50px rgba(123,47,247,0.4), inset 0 0 20px rgba(0,0,0,0.8)' }}
                      animate={{ rotate: rotation }}
                      transition={{ duration: 4.5, type: 'tween', ease: [0.1, 0.9, 0.2, 1] }}
                    >
                      <svg width="100%" height="100%" viewBox="0 0 380 380" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
                        {problemStatements.map((item, i) => {
                          const N = problemStatements.length;
                          const angle = 360 / N;
                          const radius = 190;
                          const cx = 190;
                          const cy = 190;
                          const startAngle = (i * angle) * (Math.PI / 180);
                          const endAngle = ((i + 1) * angle) * (Math.PI / 180);
                          const x1 = cx + radius * Math.cos(startAngle);
                          const y1 = cy + radius * Math.sin(startAngle);
                          const x2 = cx + radius * Math.cos(endAngle);
                          const y2 = cy + radius * Math.sin(endAngle);
                          const midAngle = (startAngle + endAngle) / 2;
                          const textRadius = radius * 0.65;
                          const textX = cx + textRadius * Math.cos(midAngle);
                          const textY = cy + textRadius * Math.sin(midAngle);
                          const textRotation = midAngle * (180 / Math.PI); 
                          const words = item.title.split(' ');
                          const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
                          const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
                          return (
                            <g key={item.id}>
                              <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`} fill={item.themeColor} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                              <text x={textX} y={textY} fill="#fff" fontSize="16" fontWeight="800" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${textRotation}, ${textX}, ${textY})`} style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.9)' }}>
                                <tspan x={textX} dy="-0.6em">{line1}</tspan>
                                <tspan x={textX} dy="1.2em">{line2}</tspan>
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', borderRadius: '50%', background: '#1c1c24', border: '3px solid #fff', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff' }}/>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.button 
                    onClick={spinWheel} 
                    disabled={spinning}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '1.2rem 4rem', fontSize: '1.3rem', fontWeight: 900, borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '2px',
                      border: 'none', background: 'linear-gradient(135deg, #7b2ff7, #ff2d55)', color: '#fff', cursor: spinning ? 'not-allowed' : 'pointer',
                      boxShadow: '0 20px 40px rgba(123, 47, 247, 0.4)', transition: 'all 0.3s'
                    }}
                  >
                    {spinning ? 'Deciding...' : 'Spin the Wheel!'}
                  </motion.button>
               </div>
            </div>
            
            {/* Wheel Spin Result (Full-Width Popover style) */}
            <div>
              {selectedTopic && (
                <motion.div initial={false} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: '4rem' }}>
                   <GlassCard style={{ borderLeft: `8px solid ${selectedTopic.themeColor}`, background: `${selectedTopic.themeColor}10` }}>
                      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                           <span style={{ color: selectedTopic.themeColor, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>{spinning ? 'Current Assignment' : 'Official Assignment'}</span>
                           <h2 style={{ fontSize: '3rem', fontWeight: 900, margin: '1rem 0' }}>{selectedTopic.title}</h2>
                           <p style={{ color: '#d0d0e0', fontSize: '1.2rem', lineHeight: 1.6 }}>{selectedTopic.description}</p>
                        </div>
                        <div style={{ flex: 1, minWidth: '300px', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                           <h4 style={{ color: '#fff', fontWeight: 900, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Engineering Requirements:</h4>
                           <ul style={{ listStyle: 'none', padding: 0 }}>
                              {selectedTopic.requirements.map((req, i) => (
                                <ListItem key={i} color={selectedTopic.themeColor} icon="✦">{req}</ListItem>
                              ))}
                           </ul>
                        </div>
                      </div>
                   </GlassCard>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* ─── REFERENCES & BONUS SECTION (Left Aligned Columns) ─── */}
        <div className="responsive-grid" style={{ gap: '4rem'  }}>
           <div style={{ gridColumn: 'span 4' }}>
              <SectionTitle icon="🔗" color="#4cd964">Resources</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                 {[
                   { name: "Sample Apps", url: "https://github.com/FlutterFlow/sample-apps", color: "#4cd964" },
                   { name: "E-commerce Template", url: "https://github.com/TBR-Group/flutterflow_ecommerce", color: "#4cd964" },
                   { name: "Quiz Creator", url: "https://github.com/extrawest/quiz_creation", color: "#4cd964" }
                 ].map((link, i) => (
                   <a key={i} href={link.url} target="_blank" rel="noreferrer" style={{ display: 'block' }}>
                      <strong style={{ display: 'block', color: '#fff', fontSize: '1.1rem', marginBottom: '0.2rem' }}>{link.name}</strong>
                      <span style={{ color: '#666', fontSize: '0.9rem' }}>View on GitHub →</span>
                   </a>
                 ))}
              </div>
           </div>

           <div style={{ gridColumn: 'span 8' }}>
              <GlassCard style={{ background: 'linear-gradient(135deg, rgba(255,149,0,0.1), transparent)', borderTop: '4px solid #ff9500' }}>
                 <SectionTitle icon="🔥" color="#ff9500">Elite Bonus Challenges</SectionTitle>
                 <div className="responsive-grid" style={{ gap: '2rem'  }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px' }}>
                       <h5 style={{ color: '#ff9500', fontWeight: 800, marginBottom: '0.5rem' }}>AI Integration</h5>
                       <p style={{ color: '#8c8cae', fontSize: '0.9rem', margin: 0 }}>Leverage Gemini or OpenAI custom actions to bring smart features.</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px' }}>
                       <h5 style={{ color: '#ff9500', fontWeight: 800, marginBottom: '0.5rem' }}>Real-time Sync</h5>
                       <p style={{ color: '#8c8cae', fontSize: '0.9rem', margin: 0 }}>Implement listeners for live updates across multiple users.</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px' }}>
                       <h5 style={{ color: '#ff9500', fontWeight: 800, marginBottom: '0.5rem' }}>Full Domain Launch</h5>
                       <p style={{ color: '#8c8cae', fontSize: '0.9rem', margin: 0 }}>Connect a custom domain and SSL to your FlutterFlow web export.</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px' }}>
                       <h5 style={{ color: '#ff9500', fontWeight: 800, marginBottom: '0.5rem' }}>Monetization</h5>
                       <p style={{ color: '#8c8cae', fontSize: '0.9rem', margin: 0 }}>Integrate Google Ads or RevenueCat for in-app subscriptions.</p>
                    </div>
                 </div>
              </GlassCard>
           </div>
        </div>

        {/* ─── SUBMISSION SUB-FOOTER ─── */}
        <GlassCard style={{ border: '2px solid #7b2ff7', background: 'radial-gradient(circle at top right, rgba(123, 47, 247, 0.1), transparent 70%)' }}>
          <div className="responsive-grid" style={{ gap: '4rem', alignItems: 'center'  }}>
            <div>
              <SectionTitle icon="⭐" color="#7b2ff7">Final Submission</SectionTitle>
              <p style={{ color: '#b0b0cc', fontSize: '1.1rem', lineHeight: 1.6 }}>Ready to showcase? Please provide the public URLs for your project. Our instructors will evaluate the tech stack, UI polish, and functional logic.</p>
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#00000030', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Required Documentation:</p>
                 <span style={{ color: '#888', fontSize: '0.85rem' }}>Must include a README.md with screenshots, tech stack, and a summary of your problem-solving approach.</span>
              </div>
            </div>

            {!submitted ? (
               <form onSubmit={handleSubmit} className="responsive-grid" style={{ gap: '1.5rem'  }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     <label style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>Project URL *</label>
                     <input required type="url" value={ffLink} onChange={e=>setFfLink(e.target.value)} placeholder="FlutterFlow Link" style={{ padding: '1.2rem', borderRadius: '16px', background: '#ffffff05', border: '1.5px solid #ffffff10', color: '#fff', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     <label style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>GitHub Repo *</label>
                     <input required type="url" value={githubLink} onChange={e=>setGithubLink(e.target.value)} placeholder="github.com/you/..." style={{ padding: '1.2rem', borderRadius: '16px', background: '#ffffff05', border: '1.5px solid #ffffff10', color: '#fff', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     <label style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>Play Store Link</label>
                     <input type="url" value={playStoreLink} onChange={e=>setPlayStoreLink(e.target.value)} placeholder="Play Store Link (Optional)" style={{ padding: '1.2rem', borderRadius: '16px', background: '#ffffff05', border: '1.5px solid #ffffff10', color: '#fff', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                     <label style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>Demo Video *</label>
                     <input required type="url" value={demoLink} onChange={e=>setDemoLink(e.target.value)} placeholder="Loom/Drive Video" style={{ padding: '1.2rem', borderRadius: '16px', background: '#ffffff05', border: '1.5px solid #ffffff10', color: '#fff', outline: 'none' }} />
                  </div>
                  <button type="submit" style={{ gridColumn: 'span 2', marginTop: '1rem', padding: '1.5rem', background: '#fff', color: '#000', fontWeight: 900, fontSize: '1.2rem', borderRadius: '16px', border: 'none', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='scale(1.01)'} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                    Initialize Final Submission
                  </button>
               </form>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: '4rem', gridColumn: '1 / 3', textAlign: 'center', background: 'rgba(76, 217, 100, 0.1)', borderRadius: '30px', border: '1.5px solid #4cd964' }}>
                 <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🏆</div>
                 <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>Mission Accomplished</h2>
                 <p style={{ color: '#c8c8e0', fontSize: '1.2rem' }}>Our team has received your application. Prepare for your final evaluation!</p>
              </motion.div>
            )}
          </div>
        </GlassCard>

        {/* Dynamic Footer Tips */}
        <div style={{ padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '100px', display: 'flex', gap: '3rem', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
           <div style={{ display: 'flex', gap: '0.5rem', color: '#ff2d55', fontWeight: 800 }}><span>01</span> Test Locally</div>
           <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333' }} />
           <div style={{ display: 'flex', gap: '0.5rem', color: '#7b2ff7', fontWeight: 800 }}><span>02</span> Iterate Design</div>
           <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333' }} />
           <div style={{ display: 'flex', gap: '0.5rem', color: '#00f5d4', fontWeight: 800 }}><span>03</span> Document Flow</div>
           <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333' }} />
           <div style={{ display: 'flex', gap: '0.5rem', color: '#ffcc00', fontWeight: 800 }}><span>04</span> Deploy & Share</div>
        </div>

      </div>
    </div>
  );
}
