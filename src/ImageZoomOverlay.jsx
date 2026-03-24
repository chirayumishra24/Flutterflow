import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageZoomOverlay() {
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    const handleImageClick = (e) => {
      if (e.target.tagName === 'IMG' && !e.target.closest('.lightbox-overlay')) {
        setZoomedImage(e.target.src);
      }
    };
    document.addEventListener('click', handleImageClick);
    return () => document.removeEventListener('click', handleImageClick);
  }, []);

  return (
    <AnimatePresence>
      {zoomedImage && (
        <motion.div 
          className="lightbox-overlay"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={() => setZoomedImage(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 999999, 
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: '2rem'
          }}
        >
          <motion.img 
            src={zoomedImage} 
            alt="Zoomed Content" 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              maxWidth: '100%', maxHeight: '100%', 
              objectFit: 'contain', borderRadius: '12px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          />
          <button 
            onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
            style={{
              position: 'absolute', top: '2rem', right: '2rem',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: 'white', width: '40px', height: '40px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.5rem',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
