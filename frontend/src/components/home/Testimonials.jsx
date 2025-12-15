import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Gaural Gupta',
      role: 'Fashion Enthusiast',
      avatar: 'P',
      rating: 5,
      image: 'https://i.postimg.cc/qRW1H34g/gaural.jpg?w=400&h=400&fit=crop',
      text: 'I loved the print and the colors. And the fabric felt so smooth and comfortable on my skin. My friends were also so excited to see this unique piece! Keep it coming, team Corporate Pehnawa! 💙',
    },
    {
      id: 2,
      name: 'Amisha Ajith',
      role: 'Working Professional',
      avatar: 'A',
      rating: 5,
      image: 'https://cdn.jumpshare.com/preview/H77erTjKb0gB_8KFwcKSD5804ZpkIZsuELN-Nx-zvkZrD9k-az6_tlKmR2Toop54SOYO7dDgxJcRej8nyRY3s87hjEo0EaXf7zah27dPgZ0',
      text: 'Heyy beautiful!🌻 I tried out the pehnawa and absolutely fell in love with it! It was a perfect fit🫶🏻 Very light and comfortable and the pockets are a dream come true...very handy! I will share the photos soon♥ Thank youu so much... I\'m really looking forward to adding more to my wardrobe!',
    },
    {
      id: 3,
      name: 'Pratishtha Pabuwal',
      role: 'Boutique Owner',
      avatar: 'P',
      rating: 5,
      image: 'https://cdn.jumpshare.com/preview/5SouXumn_26H2xVDPl1mJrR9FE2jGkgCnYZ9Cz8Nb367nyuGNn0NGlVZwNDbjkvSSOYO7dDgxJcRej8nyRY3s62sgJZqw_ZYYjMo6nK8fVo',
      text: 'I am just in awe with the beautiful beautiful collection and All the best! I want to buy more. So awaited for more new collection ❤',
    },
    {
      id: 4,
      name: 'Rashi Agarwal',
      role: 'Event Planner',
      avatar: 'R',
      rating: 5,
      image: 'https://cdn.jumpshare.com/preview/dmFxXYVz1KX0Wn24kG-Q9QIsMZH1tU8Fz-PFqVzIsjCsR_PrBPvvjb-cUtetzVTISOYO7dDgxJcRej8nyRY3s95onG16D6GWKsLmV8kzcUI',
      text: 'I ordered a printed waistcoat from Corporate Pehnawa, and I\'m absolutely thrilled with it! 💫 The design is stunning, the fabric feels premium, and the stitching is flawless. It fits perfectly and adds such an elegant touch to my outfit. I\'ve received so many compliments every time I\'ve worn it!',
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="section-titlee">Pehnawa Stories</h2>
          {/* <p className="section-subtitle">
            Don't just take our word for it - hear from our satisfied customers
          </p> */}
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

              {/* Testimonial Image */}
              <div className="testimonial-image-container">
                <img 
                  src={testimonial.image} 
                  alt={`${testimonial.name}'s testimonial`}
                  className="testimonial-image"
                />
              </div>

              <p className="testimonial-text">{testimonial.text}</p>

              {/* <div className="testimonial-rating">
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
              </div> */}

              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  {/* <p className="author-role">{testimonial.role}</p> */}
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