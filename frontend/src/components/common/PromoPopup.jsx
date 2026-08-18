// File: ./frontend/src/components/common/PromoPopup.jsx
// Shows automatically on every page load / refresh (no session memory)

import React, { useState, useEffect } from 'react';
import './PromoPopup.css';

const MOBILE_POSTER = 'https://i.postimg.cc/6ppGvfvd/Rakhi-Poster-1.webp';
const DESKTOP_POSTER = 'https://i.postimg.cc/g226ZHZy/Rakhi-Poster-2.webp';

const PromoPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    // Small delay so it doesn't feel jarring on first paint
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div className="promo-popup-overlay" onClick={handleClose}>
      <div className="promo-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="promo-popup-close" onClick={handleClose} aria-label="Close">
          ✕
        </button>
        <img
          src={isMobile ? MOBILE_POSTER : DESKTOP_POSTER}
          alt="Rakhi Sale Offer"
          className="promo-popup-image"
        />
      </div>
    </div>
  );
};

export default PromoPopup;