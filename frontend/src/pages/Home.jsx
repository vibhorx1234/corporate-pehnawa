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
          <h2 className="section-titlee text-center">Why Choose Corporate Pehnawa</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="feature-title">Premium Quality</h3>
              <p className="feature-description">
                Handpicked fabrics and meticulous craftsmanship ensure long-lasting quality
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Fast Delivery</h3>
              <p className="feature-description">
                Quick processing and reliable shipping to get your order to you on time
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="feature-title">Custom Tailoring</h3>
              <p className="feature-description">
                Get the perfect fit with our custom measurement and tailoring services
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
                Our dedicated customer service team is always ready to assist you
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;