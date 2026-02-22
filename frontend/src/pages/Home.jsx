import React, { useEffect } from 'react';
import Slideshow from '../components/home/Slideshow';
import CollectionThumbnails from '../components/home/CollectionThumbnails';
import FeaturedProducts from '../components/home/FeaturedProducts';
import TrendingReels from '../components/home/TrendingReels';
import Testimonials from '../components/home/Testimonials';
import { scrollToTop } from '../utils/helpers';
import './Home.css';

const Home = () => {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Slideshow */}
      <Slideshow />

      {/* Collections Section */}
      <CollectionThumbnails />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Trending Reels Section */}
      <TrendingReels />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Call to Action Section */}
      {/* <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Need Bulk Orders?</h2>
            <p className="cta-text">
              Get custom quotes for corporate orders and bulk purchases. 
              We offer competitive pricing and flexible customization options.
            </p>
            <a href="/bulk-enquiry" className="btn btn-primary btn-lg">
              Request Bulk Enquiry
            </a>
          </div>
        </div>
      </section> */}

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-titlee text-center">Pehnawa Perks</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="feature-title">100% Cotton</h3>
              <p className="feature-description">
                Our waistcoats are made from soft, breathable 100% cotton with lining, so you feel as good as you look.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Affordability</h3>
              <p className="feature-description">
                Stylish pieces at prices that fit every budget without compromising on the quality.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Size Inclusive</h3>
              <p className="feature-description">
                A perfect fit for everyone! We offer a 1-inch margin on both sides and custom sizing at no extra charge.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-description">
                Got questions? We're just a message away, anytime—through email or WhatsApp!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;