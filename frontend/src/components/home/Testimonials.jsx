import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Fashion Enthusiast',
      avatar: 'P',
      rating: 5,
      text: 'Absolutely love the quality of ethnic wear from Corporate Pehnawa! The fabrics are premium and the designs are stunning. Perfect fit and timely delivery. Highly recommended!',
    },
    {
      id: 2,
      name: 'Anjali Verma',
      role: 'Working Professional',
      avatar: 'A',
      rating: 5,
      text: 'Ordered traditional outfits for our office festival. The bulk order process was smooth and the pricing was very competitive. The team was super helpful throughout!',
    },
    {
      id: 3,
      name: 'Sneha Reddy',
      role: 'Boutique Owner',
      avatar: 'S',
      rating: 5,
      text: 'Corporate Pehnawa has become my go-to place for ethnic wear. The collection is diverse, quality is consistent, and customer service is excellent. Very satisfied with every purchase!',
    },
    {
      id: 4,
      name: 'Kavya Patel',
      role: 'Event Planner',
      avatar: 'K',
      rating: 5,
      text: 'Bought multiple ethnic outfits for a wedding event. The craftsmanship is amazing and all the pieces looked absolutely gorgeous. Best place for traditional Indian wear!',
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="section-titlee">What Our Girls Say</h2>
          <p className="section-subtitle">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="quote-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="currentColor"
                >
                  <path d="M10 16.5c0-3.866 3.134-7 7-7h1.5a1.5 1.5 0 000-3H17c-5.523 0-10 4.477-10 10v11a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5v-9a1.5 1.5 0 00-1.5-1.5h-7.5v-.5zm17 0c0-3.866 3.134-7 7-7h1.5a1.5 1.5 0 000-3H34c-5.523 0-10 4.477-10 10v11a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5v-9a1.5 1.5 0 00-1.5-1.5h-7.5v-.5z" />
                </svg>
              </div>

              <p className="testimonial-text">{testimonial.text}</p>

              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;