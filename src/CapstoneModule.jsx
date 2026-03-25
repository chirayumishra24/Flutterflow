import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const problemStatements = [
  {
    id: 1,
    title: "E-Commerce Storefront",
    themeColor: "#ff2d55",
    description: "Build a sleek e-commerce shopping app for a local clothing brand.",
    requirements: [
      "Product listing page with a staggered grid layout.",
      "Product details page with an image carousel and 'Add to Cart' functionality.",
      "A persistent shopping cart state using App State variables.",
      "A simulated checkout flow with at least 2 pages."
    ]
  },
  {
    id: 2,
    title: "Task Tracking Dashboard",
    themeColor: "#5856d6",
    description: "Create a productivity app for students to track assignments.",
    requirements: [
      "User authentication flow (Login/Signup visual screens, auth not strictly required).",
      "A dashboard that lists tasks divided into 'To-Do', 'In Progress', and 'Completed'.",
      "Swipe-to-delete functionality on the task lists.",
      "A form to add new tasks with a visual date picker."
    ]
  },
  {
    id: 3,
    title: "Social Media Feed",
    themeColor: "#ff9500",
    description: "Design a photo-sharing application feed tailored for foodies.",
    requirements: [
      "A main infinite-scroll feed consisting of photo cards.",
      "A working 'Like' button on photos featuring a micro-animation.",
      "A user profile page displaying a grid of uploaded photos.",
      "A floating action button (FAB) that opens an 'Upload Photo' bottom sheet."
    ]
  },
  {
    id: 4,
    title: "Fitness & Habit Tracker",
    themeColor: "#4cd964",
    description: "A daily habit and workout tracker with visual analytics.",
    requirements: [
      "A homepage with a horizontal calendar showcasing the current week.",
      "A list of daily habits with interactive checkboxes (updating local state).",
      "A 'Progress' tab featuring a visual chart or progress ring.",
      "Sleek dark-mode glassmorphic styling."
    ]
  },
  {
    id: 5,
    title: "Event Booking App",
    themeColor: "#5ac8fa",
    description: "An app for users to browse and buy tickets to local concerts.",
    requirements: [
      "A horizontal sliding carousel of 'Featured Events'.",
      "Search and filtering dummy inputs on the top app bar.",
      "An interactive seating chart or ticket selection page.",
      "A finalized 'Ticket QR Code' page upon booking confirmation."
    ]
  },
  {
    id: 6,
    title: "Travel Companion",
    themeColor: "#ffcc00",
    description: "An interactive travel guide for exploring popular cities.",
    requirements: [
      "A beautiful hero image header that expands and collapses on scroll.",
      "A map integration or a visual map placeholder for locations.",
      "A rating and review system for places (stars UI).",
      "A 'Saved Places' bookmark list."
    ]
  }
];

export default function CapstoneModule() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [appLink, setAppLink] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const spinWheel = () => {
    if (spinning || submitted) return;
    setSpinning(true);
    setSelectedTopic(null);
    
    const winIndex = Math.floor(Math.random() * problemStatements.length);
    const segmentAngle = 360 / problemStatements.length;
    
    // We want the wheel rotation to end with the chosen slice pointing at the top arrow.
    // The top arrow is at 0 degrees.
    // Each slice occupies (i * angle) to ((i + 1) * angle).
    // The center of a slice is `i * angle + angle / 2`.
    // To align it to top, we need rotation `-(center angle)`.
    const baseSpins = 360 * 6; // Spin 6 full times
    const targetAngle = 360 - (winIndex * segmentAngle + segmentAngle / 2);
    
    const offset = (Math.random() - 0.5) * (segmentAngle * 0.7); 
    const finalRotation = rotation + baseSpins - (rotation % 360) + targetAngle + offset;

    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setSelectedTopic(problemStatements[winIndex]);
    }, 4500); // Wait for spin to stop
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (appLink.trim()) setSubmitted(true);
  };

  return (
    <section className="sec" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="wrap" style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '4rem' }}>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255, 45, 85, 0.15)', color: '#ff2d55', borderRadius: '50px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem', border: '1px solid rgba(255,45,85,0.3)' }}>
          Final Challenge
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: '1.1' }}>
          Capstone Project
        </h1>
        <p style={{ color: '#b0b0cc', fontSize: '1.2rem', lineHeight: '1.7' }}>
          It’s time to put everything you've learned into practice! 
          Below is the Project Wheel containing 6 different app briefs. 
          <strong style={{ color: '#fff' }}> Click the button to spin the wheel</strong> and receive your official assignment. Once built, submit your FlutterFlow link for a grade!
        </p>
      </motion.div>      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', width: '100%', maxWidth: '1200px' }}>
        
        {/* WHEEL CONTAINER */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1', minWidth: '320px' }}>
          
          <div style={{ position: 'relative', width: '300px', height: '300px', marginBottom: '2rem' }}>
            {/* The Top Pointer Triangle */}
            <div style={{
              position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent',
              borderTop: '30px solid #fff', zIndex: 10, filter: 'drop-shadow(0px 5px 10px rgba(0,0,0,0.8))'
            }} />
            
            {/* The Rotating Wheel */}
            <motion.div
              style={{
                width: '100%', height: '100%', borderRadius: '50%',
                border: '6px solid #2a2a35',
                overflow: 'hidden', position: 'relative',
                boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.8)'
              }}
              animate={{ rotate: rotation }}
              transition={{ duration: 4.5, type: 'tween', ease: [0.1, 0.9, 0.2, 1] }} // smooth deceleration
            >
              <svg width="100%" height="100%" viewBox="0 0 380 380" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
                {problemStatements.map((item, i) => {
                  const N = problemStatements.length;
                  const angle = 360 / N;
                  const radius = 190; // The viewbox is 380x380, so radius is 190. It auto-scales to the 300px div!
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
                      <path 
                        d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`} 
                        fill={item.themeColor} 
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                      />
                      <text 
                        x={textX} 
                        y={textY} 
                        fill="#fff" 
                        fontSize="16" 
                        fontWeight="800"
                        letterSpacing="0.5"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.9)' }}
                      >
                        <tspan x={textX} dy="-0.6em">{line1}</tspan>
                        <tspan x={textX} dy="1.2em">{line2}</tspan>
                      </text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Inner Center Circle Decorator */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '40px', height: '40px', borderRadius: '50%', background: '#1c1c24',
                border: '3px solid #fff', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff' }}/>
              </div>

            </motion.div>
          </div>
          
          <button 
            onClick={spinWheel} 
            disabled={spinning || submitted}
            style={{
              padding: '1rem 3rem', fontSize: '1.2rem', fontWeight: 800, borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '1px',
              border: 'none', background: submitted ? '#333' : 'linear-gradient(135deg, #ff2d55, #7b2ff7)',
              color: '#fff', cursor: (spinning || submitted) ? 'not-allowed' : 'pointer',
              boxShadow: submitted ? 'none' : '0 10px 20px rgba(123, 47, 247, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)', opacity: (spinning || submitted) ? 0.6 : 1
            }}
            onMouseOver={e => { if(!spinning && !submitted) e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            whileTap={{ scale: 0.95 }}
          >
            {spinning ? 'Spinning...' : submitted ? 'Project Submitted' : 'Spin the Wheel!'}
          </button>
        </div>

        {/* INFO & SUBMISSION CARD */}
        <div style={{ flex: '1', minWidth: '320px', maxWidth: '600px', display: 'flex', flexDirection: 'column' }}>
          
          <AnimatePresence mode="wait">
            {!selectedTopic && !spinning && !submitted && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '2px dashed rgba(255,255,255,0.1)', padding: '2rem', textAlign: 'center' }}
              >
                <div style={{ fontSize: '3.5rem', opacity: 0.2, marginBottom: '1rem' }}>🎯</div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Waiting for Assignment...</h3>
                <p style={{ color: '#6c6c8e', fontSize: '1rem' }}>Click the big spin button to find out what application you will be building.</p>
              </motion.div>
            )}

            {spinning && (
              <motion.div 
                key="spinning"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff2d55', animation: 'pulse 1s infinite alternate' }}>
                  Selecting your project...
                </div>
              </motion.div>
            )}

            {selectedTopic && (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '24px', border: `1px solid ${selectedTopic.themeColor}50`, boxShadow: `0 20px 50px ${selectedTopic.themeColor}15` }}
              >
                <div style={{ color: selectedTopic.themeColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                  Your Assignment
                </div>
                <h2 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: 800, marginBottom: '1rem' }}>
                  {selectedTopic.title}
                </h2>
                <p style={{ fontSize: '1rem', color: '#c8c8e0', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {selectedTopic.description}
                </p>
                
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ color: '#fff', marginBottom: '0.8rem', fontSize: '1rem' }}>Required Features:</h4>
                  <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {selectedTopic.requirements.map((req, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#a0a0c0', fontSize: '0.95rem', lineHeight: 1.5 }}>
                        <span style={{ color: selectedTopic.themeColor, marginTop: '2px' }}>✦</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Submit App Link for Grading</label>
                    <input 
                      type="url" 
                      required 
                      placeholder="https://your-generated-app.flutterflow.app"
                      value={appLink}
                      onChange={(e) => setAppLink(e.target.value)}
                      style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                      onFocus={(e) => e.target.style.borderColor = selectedTopic.themeColor}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                    <button type="submit" style={{ padding: '1rem', background: '#fff', color: '#000', fontWeight: 800, fontSize: '1rem', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s, transform 0.2s', marginTop: '0.5rem' }} onMouseOver={e=>e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={e=>e.currentTarget.style.transform = 'scale(1)'}>
                      Submit to LMS
                    </button>
                  </form>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', color: '#000', padding: '1.5rem', background: 'linear-gradient(135deg, #4cd964, #34c759)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(76, 217, 100, 0.3)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Project Submitted!</h3>
                    <p style={{ fontWeight: 500, opacity: 0.9, fontSize: '0.95rem' }}>Your app link has been securely recorded.</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </section>
  );
}
