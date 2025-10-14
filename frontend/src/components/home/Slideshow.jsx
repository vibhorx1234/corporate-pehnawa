import React from 'react';
import { Link } from 'react-router-dom';
import './Slideshow.css';
import videoSrc from '../../assets/videos/hero-video.mp4';

const Slideshow = () => {
  const videoUrl = videoSrc;

  return (
    <div className="slideshow">
      <div className="slideshow-container">
        <div className="slide active video-slide">
          {/* Main landscape video */}
          <video
            className="video-background"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className="slide-overlay"></div>
          <div className="slide-content">
            <h1 className="slide-title">Elevate Your Professional Style</h1>
            <p className="slide-subtitle">Premium corporate fashion for the modern professional</p>
            <Link to="/collections" className="btn btn-primary btn-lg">
              Shop Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slideshow;