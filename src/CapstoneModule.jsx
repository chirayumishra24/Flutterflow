import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const GlassCard = ({ children, delay = 0, style = {} }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay, duration: 0.5 }}
    style={{ 
      background: 'rgba(255,255,255,0.03)', 
      border: '1px solid rgba(255,255,255,0.05)', 
      borderRadius: '24px', 
      padding: '2rem', 
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
    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay, duration: 0.5 }}
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
    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#b0b0cc', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '0.8rem' }}
  >
    <span style={{ color, marginTop: '2px', fontSize: '1.2rem', fontWeight: 'bold' }}>{icon}</span>
    <span>{children}</span>
  </motion.li>
);

export default function CapstoneModule() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  const [ffLink, setFfLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [playStoreLink, setPlayStoreLink] = useState('');
  const [demoLink, setDemoLink] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const spinWheel = () => {
    if (spinning || submitted) return;
    setSpinning(true);
    setSelectedTopic(null);
    
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
      document.getElementById('wheel-result')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 4500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ffLink.trim() && githubLink.trim() && demoLink.trim()) setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#0f0f13', minHeight: '100vh', color: '#fff', fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>
      
      {/* Hero Header */}
      <div style={{ position: 'relative', padding: '6rem 2rem 4rem', textAlign: 'center', background: 'linear-gradient(180deg, rgba(123, 47, 247, 0.1) 0%, rgba(15, 15, 19, 1) 100%)' }}>
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(123,47,247,0.15) 0%, rgba(0,0,0,0) 70%)', zIndex: 0 }} />
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'inline-block', padding: '0.6rem 1.5rem', background: 'rgba(255, 45, 85, 0.1)', color: '#ff2d55', borderRadius: '50px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem', border: '1px solid rgba(255,45,85,0.3)', boxShadow: '0 0 20px rgba(255,45,85,0.2)' }}>
            Final Challenge
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: '1.1', background: 'linear-gradient(135deg, #fff, #a0a0c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Capstone Project <br/>
            <span style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, background: 'linear-gradient(135deg, #ff2d55, #7b2ff7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Build, Deploy & Showcase Your App</span>
          </h1>
          <p style={{ color: '#b0b0cc', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
            Congratulations on reaching the end of the course! This Final Capstone Project is your opportunity to apply everything you've learned. The goal is to build a complete, production-ready mobile app that demonstrates real-world no-code development skills.
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 6rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        
        {/* Objective Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <GlassCard delay={0.1} style={{ borderTop: '4px solid #5ac8fa' }}>
            <SectionTitle icon="🎯" color="#5ac8fa">Capstone Objective</SectionTitle>
            <p style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Build a fully functional app that includes:</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <ListItem color="#5ac8fa"><strong>User Authentication</strong> (Email/Phone + Social login)</ListItem>
              <ListItem color="#5ac8fa"><strong>Backend Integration</strong> (Firebase or Supabase for data & storage)</ListItem>
              <ListItem color="#5ac8fa"><strong>State Management & Media</strong> (Upload, display, download files)</ListItem>
              <ListItem color="#5ac8fa"><strong>Custom Code/Functions</strong> (at least 2–3 reusable functions or actions)</ListItem>
              <ListItem color="#5ac8fa"><strong>Animations</strong> (Widget, Implicit, Hero, or Page Transitions)</ListItem>
              <ListItem color="#5ac8fa"><strong>Responsive UI</strong> with proper theming and design system</ListItem>
              <ListItem color="#5ac8fa"><strong>Testing & Branching workflow</strong> (use branches for features)</ListItem>
              <ListItem color="#5ac8fa"><strong>Deployment</strong> to Google Play Store</ListItem>
            </ul>
            <div style={{ marginTop: '2.5rem', padding: '1.2rem', background: 'rgba(90, 200, 250, 0.1)', borderRadius: '12px', color: '#5ac8fa', fontWeight: 600, display: 'inline-block', border: '1px solid rgba(90, 200, 250, 0.2)' }}>
              ⏱️ Project Duration Suggestion: 2–4 weeks
            </div>
          </GlassCard>

          <GlassCard delay={0.2} style={{ borderTop: '4px solid #ffcc00' }}>
            <SectionTitle icon="📋" color="#ffcc00">Checklist & Phases</SectionTitle>
            <p style={{ color: '#b0b0cc', marginBottom: '1.5rem' }}>Use this step-by-step checklist to guide your build:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#ffcc00' }}>Phase 1</span> Planning & Setup (Mod 1-2)</h4>
                <ul style={{ listStyle: 'none', padding: 0, paddingLeft: '1rem' }}>
                  <ListItem color="#ffcc00" icon="▸">Define app name, description, user flows</ListItem>
                  <ListItem color="#ffcc00" icon="▸">Set up Design System & Theme</ListItem>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#ffcc00' }}>Phase 2</span> Core Features (Mod 3)</h4>
                <ul style={{ listStyle: 'none', padding: 0, paddingLeft: '1rem' }}>
                  <ListItem color="#ffcc00" icon="▸">Auth, State Management, Lists & Navigation</ListItem>
                  <ListItem color="#ffcc00" icon="▸">File Handling, Custom Code & Animations</ListItem>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#ffcc00' }}>Phase 3</span> Testing & Collab (Mod 4)</h4>
                <ul style={{ listStyle: 'none', padding: 0, paddingLeft: '1rem' }}>
                  <ListItem color="#ffcc00" icon="▸">Branching workflow & clear commits</ListItem>
                  <ListItem color="#ffcc00" icon="▸">Automated/Manual multi-device testing</ListItem>
                </ul>
              </div>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#ffcc00' }}>Phase 4</span> Export & Deploy (Mod 5)</h4>
                <ul style={{ listStyle: 'none', padding: 0, paddingLeft: '1rem' }}>
                  <ListItem color="#ffcc00" icon="▸">Export code to GitHub</ListItem>
                  <ListItem color="#ffcc00" icon="▸">Deploy to Google Play Store</ListItem>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Ideas & Wheel Section */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <SectionTitle icon="💡" color="#ff2d55" delay={0.3} style={{ justifyContent: 'center' }}>Suggested Project Ideas</SectionTitle>
          <p style={{ color: '#b0b0cc', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
            Choose an idea that excites you from the options below, propose your own, or spin the wheel if you want a random challenge!
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Ideas List */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { title: "E-commerce / Marketplace 🛒", desc: "Product catalog, Cart & Checkout, User profile, Payment integration." },
              { title: "Social Media / Feed App 📸", desc: "Post creation, Like/Comment system, Real-time feed, Notifications." },
              { title: "Task / Habit Tracker 🎯", desc: "Categories, Due dates, File attachments, Analytics, Custom animations." },
              { title: "Quiz / Learning App 📚", desc: "Quizzes, Score tracking, Leaderboards, Certificate generation." },
              { title: "Fitness / Meal Planner 💪", desc: "Workout library, Meal logging, Progress tracking, Calorie calc." },
              { title: "Your Own Idea 🚀", desc: "Must incorporate at least 80% of the course modules. Get it approved!" }
            ].map((idea, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + idx * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px', borderLeft: '4px solid #ff2d55', transition: 'transform 0.2s', cursor: 'default' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateX(10px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}
              >
                <h4 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>{idea.title}</h4>
                <p style={{ color: '#b0b0cc', fontSize: '0.95rem', margin: 0 }}>{idea.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Wheel */}
          <GlassCard delay={0.4} style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 2rem', borderTop: '4px solid #7b2ff7' }}>
            <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>Can't decide? Let fate choose!</h3>
            
            <div style={{ position: 'relative', width: '300px', height: '300px', marginBottom: '2.5rem' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderTop: '30px solid #fff', zIndex: 10, filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.8))' }} />
              
              <motion.div
                style={{ width: '100%', height: '100%', borderRadius: '50%', border: '6px solid #2a2a35', overflow: 'hidden', position: 'relative', boxShadow: '0 0 40px rgba(123,47,247,0.3), inset 0 0 20px rgba(0,0,0,0.8)' }}
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
            
            <button 
              onClick={spinWheel} 
              disabled={spinning}
              style={{
                padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 800, borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '1px',
                border: 'none', background: 'linear-gradient(135deg, #7b2ff7, #ff2d55)', color: '#fff', cursor: spinning ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 20px rgba(123, 47, 247, 0.4)', transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', opacity: spinning ? 0.6 : 1
              }}
              onMouseOver={e => { if(!spinning) e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {spinning ? 'Spinning...' : 'Spin the Wheel!'}
            </button>

            <AnimatePresence>
              {selectedTopic && !spinning && (
                <motion.div id="wheel-result" initial={{ opacity: 0, y: 20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} style={{ marginTop: '2.5rem', width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: `1px solid ${selectedTopic.themeColor}50` }}>
                  <h4 style={{ color: selectedTopic.themeColor, fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{selectedTopic.title}</h4>
                  <p style={{ color: '#e0e0e0', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.5' }}>{selectedTopic.description}</p>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {selectedTopic.requirements.map((req, idx) => (
                      <li key={idx} style={{ color: '#b0b0cc', fontSize: '0.9rem', marginBottom: '6px', display: 'flex', gap: '8px' }}>
                        <span style={{ color: selectedTopic.themeColor }}>▸</span> {req}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>

        {/* References & Bonus */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <GlassCard delay={0.2} style={{ borderTop: '4px solid #4cd964' }}>
            <SectionTitle icon="🔗" color="#4cd964">References & Starters</SectionTitle>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <ListItem color="#4cd964" icon="▸">
                <div>
                  <strong>Official FlutterFlow Sample Apps</strong>
                  <br/><a href="https://github.com/FlutterFlow/sample-apps" target="_blank" rel="noreferrer" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '0.9rem' }}>github.com/FlutterFlow/sample-apps</a>
                </div>
              </ListItem>
              <ListItem color="#4cd964" icon="▸">
                <div>
                  <strong>E-commerce Example</strong>
                  <br/><a href="https://github.com/TBR-Group-software/flutterflow_ecommerce_app" target="_blank" rel="noreferrer" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '0.9rem' }}>flutterflow_ecommerce_app</a>
                </div>
              </ListItem>
              <ListItem color="#4cd964" icon="▸">
                <div>
                  <strong>Quiz Creation App</strong>
                  <br/><a href="https://github.com/extrawest/flutterflow_quiz_creation_app" target="_blank" rel="noreferrer" style={{ color: '#a0a0c0', textDecoration: 'none', fontSize: '0.9rem' }}>flutterflow_quiz_creation_app</a>
                </div>
              </ListItem>
            </ul>
          </GlassCard>

          <GlassCard delay={0.3} style={{ borderTop: '4px solid #ff9500' }}>
            <SectionTitle icon="🔥" color="#ff9500">Bonus Challenges</SectionTitle>
            <p style={{ color: '#b0b0cc', marginBottom: '1.2rem', fontSize: '0.95rem' }}>Want extra credit? Try adding these advanced features:</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <ListItem color="#ff9500" icon="▸">Integrate AI (Gemini via custom action)</ListItem>
              <ListItem color="#ff9500" icon="▸">Add Real-time features (Firestore listeners)</ListItem>
              <ListItem color="#ff9500" icon="▸">Implement Offline Support</ListItem>
              <ListItem color="#ff9500" icon="▸">Publish to Play Store + Web with custom domain</ListItem>
              <ListItem color="#ff9500" icon="▸">Add Monetization (In-app purchases or Ads)</ListItem>
            </ul>
          </GlassCard>
        </div>

        {/* Submission Form Section */}
        <GlassCard delay={0.4} style={{ border: '1px solid rgba(123, 47, 247, 0.4)', background: 'rgba(123, 47, 247, 0.05)', marginTop: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <SectionTitle icon="🚀" color="#b28dff" style={{ justifyContent: 'center' }}>Submit Your Project</SectionTitle>
            <p style={{ color: '#b0b0cc', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
              Finalized your build? Publish your project, push code to GitHub, record a quick demo video, and submit everything below!
            </p>
          </div>

          {!submitted ? (
             <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               
               <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #b28dff' }}>
                 <h4 style={{ color: '#fff', marginBottom: '0.8rem', fontSize: '1.1rem' }}>📝 Documentation Requirement</h4>
                 <p style={{ color: '#b0b0cc', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>You must include a short <strong>README.md</strong> in your GitHub repo detailing your App description, Tech stack, Challenges faced & how you solved them, and your live Play Store listing link.</p>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   <label style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>FlutterFlow Project Link (Public) *</label>
                   <input required type="url" value={ffLink} onChange={e=>setFfLink(e.target.value)} placeholder="https://app.flutterflow.io/project/..." style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} onFocus={e=>e.target.style.borderColor='#7b2ff7'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   <label style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>GitHub Repo Link *</label>
                   <input required type="url" value={githubLink} onChange={e=>setGithubLink(e.target.value)} placeholder="https://github.com/..." style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} onFocus={e=>e.target.style.borderColor='#7b2ff7'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   <label style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>Play Store / Internal Track Link</label>
                   <input type="url" value={playStoreLink} onChange={e=>setPlayStoreLink(e.target.value)} placeholder="https://play.google.com/..." style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} onFocus={e=>e.target.style.borderColor='#7b2ff7'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                   <label style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>Demo Video / Screenshots *</label>
                   <input required type="url" value={demoLink} onChange={e=>setDemoLink(e.target.value)} placeholder="https://loom.com/..." style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} onFocus={e=>e.target.style.borderColor='#7b2ff7'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
                 </div>
               </div>

               <button type="submit" style={{ marginTop: '1rem', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg, #7b2ff7, #ff2d55)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(123, 47, 247, 0.4)', transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                 Submit Capstone Project
               </button>
             </form>
          ) : (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem', background: 'linear-gradient(135deg, rgba(76, 217, 100, 0.2), rgba(52, 199, 89, 0.1))', borderRadius: '24px', border: '1px solid rgba(76, 217, 100, 0.3)', boxShadow: '0 20px 40px rgba(76, 217, 100, 0.1)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Project Submitted!</h3>
              <p style={{ color: '#b0b0cc', fontSize: '1.1rem', lineHeight: '1.6' }}>
                You’ve gone from zero to deploying a real app. We can’t wait to see what you’ve built! Your links have been securely recorded.
              </p>
            </motion.div>
          )}
        </GlassCard>

        <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: '#8c8cae', fontSize: '1rem', margin: 0 }}>
             <strong>Final Tips:</strong> Start small and iterate. Test thoroughly. Document your process. Share in the community. Good luck — go ship it! 🚀
          </p>
        </div>

      </div>
    </div>
  );
}
