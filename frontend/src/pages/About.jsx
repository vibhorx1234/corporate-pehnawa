import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { scrollToTop } from '../utils/helpers';
import './About.css';

const About = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  // Replace these URLs with your actual image URLs
  const heroImageUrl = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop';
  const ownerImageUrl = 'https://i.postimg.cc/76CyN0KM/radhika.jpg?w=400&h=500&fit=crop';

  return (
    <div className="about-page">
      {/* Hero Section */}
      {/* <section className="about-hero" style={{ backgroundImage: `url(${heroImageUrl})` }}>
        <div className="hero-overlay"></div>
        <div className="container">
          <h1 className="about-title">About Corporate Pehnawa</h1>
          <p className="about-subtitle">
            Corporate Pehnawa began with a simple thought — workwear shouldn't feel like a uniform.
          </p>
        </div>
      </section> */}

      {/* Story Section */}
      <section className="about-section story-section">
        <div className="container">
          <h2 className="story-main-title">Our Story</h2>
          <div className="story-layout">
            <div className="story-image-side">
              <img 
                src={ownerImageUrl}
                alt="Radhika - Founder of Corporate Pehnawa" 
                className="owner-image"
              />
            </div>
            <div className="story-text-side">
              <p>
                Hi, I'm Radhika, a 21-year-old who once worked a typical 9–5 job and realised how limited corporate wear could be. The clothes looked formal, but they didn't feel like us — no comfort, no expression, no joy. I wanted to change that.
              </p>
              <p>
                With no background in fashion or design, I started learning everything from scratch — from fabrics and stitching to fits and finishes. Out of that journey, Corporate Pehnawa was born: a homegrown brand inspired by modern workwear, comfort, and the everyday beauty of Jaipur.
              </p>
              <p>
                Every piece we create is designed to be simple, versatile, and timeless — clothes you can wear from presentations to celebrations, feeling confident and comfortable all day long.
              </p>
              <p>
                Corporate Pehnawa isn't just a brand; it's a dream stitched with purpose, passion, and a love for minimal design.
              </p>
              <p>
                Thank you for being part of our story.
              </p>
              <p>
                With all my thread and soul,<br />
                Radhika
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      {/* <section className="about-section mission-section">
        <div className="container">
          <div className="section-content">
            <h2>Our Mission</h2>
            <p>
              To provide high-quality, affordable, and stylish corporate wear that empowers 
              professionals to look and feel their best. We believe that great clothing should 
              be accessible to everyone, and we work tirelessly to ensure our products meet 
              the highest standards of quality and design.
            </p>
          </div>
        </div>
      </section> */}

      {/* Values Section */}
      {/* <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3>Quality First</h3>
              <p>We never compromise on the quality of our fabrics and craftsmanship</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3>Customer Centric</h3>
              <p>Your satisfaction and comfort are our top priorities</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3>Innovation</h3>
              <p>Constantly evolving our designs to match modern trends</p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Sustainability</h3>
              <p>Committed to environmentally responsible practices</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <h2>Grab your Pehnawa now!</h2>
          <p>Explore our collections and find the perfect outfit for every occasion</p>
          <div className="cta-buttons">
            <Link to="/collections" className="btn btn-primary btn-lg">
              View Collections
            </Link>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;