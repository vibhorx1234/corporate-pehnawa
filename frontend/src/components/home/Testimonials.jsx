
import React from 'react';
import './Testimonials.css';

// ------------------------------------------------------------------
// 1. ADD / EDIT TESTIMONIALS HERE
// ------------------------------------------------------------------
const testimonials = [
  {
    id: 1,
    name: 'Amelie',
    location: 'Bangkok',
    avatar: 'A',
    image: 'https://i.postimg.cc/jjHvDqcT/amelie.webp',
    text: 'I am delighted with my new tops. They’re lovely, really practical and comfortable! 🥰 Thank you for all your hard work, and I wish you every success in your business 🤗🤗',
  },
  {
    id: 2,
    name: 'Ishita',
    location: 'Jaipur',
    avatar: 'I',
    image: 'https://i.postimg.cc/4NXKNw0F/Ishita.webp',
    text: 'Absolutely loved my experience with Corporate Pehnawa! 💗 The designs are so unique, stylish, and refreshing, making everyday outfits feel a little more special. I love how the pieces bring a fun twist to everyday wear while still being comfortable and easy to style. Ended up ordering multiple pieces, and I’m so happy to support a homegrown brand that puts so much love into what it creates. Definitely a lovely addition to my wardrobe!',
  },
  {
    id: 3,
    name: 'Pooja',
    location: 'Bangalore',
    avatar: 'P',
    image: 'https://i.postimg.cc/LsKN4gt5/Pooja.webp',
    text: 'The shirt fits so well and is soo cute! I absolutely love the fabric and the colour, and even my mom loved it! ❤️ The best part is that the print is on both sides of the fabric, unlike many fabrics that have a plain inner side. Such a thoughtful detail! Overall, I’m in love with the fit, quality, and all the little details. 🥹❤️✨',
  },
  {
    id: 4,
    name: 'Sanjana',
    location: 'Mumbai',
    avatar: 'S',
    image: 'https://i.postimg.cc/bvxLZYg8/sanjana.webp',
    text: 'Absolutely loved this top! ❤️ The fit is perfect, and the design is so classy and elegant. The quality is amazing, and it looks even better when worn. Definitely coming back for more! ✨',
  },
  {
    id: 5,
    name: 'Shruti',
    location: 'Jaipur',
    avatar: 'S',
    image: 'https://i.postimg.cc/PqWKCfyd/shruti.webp',
    text: 'Loved my experience with Corporate Pehnawa! ❤️ The designs are so unique, the quality is great, and the pieces are super comfortable to wear. I love how effortlessly they add a stylish touch to everyday outfits. Definitely worth trying! ✨🎀',
  },
  {
    id: 6,
    name: 'Srijani',
    location: 'Kolkata',
    avatar: 'S',
    image: 'https://i.postimg.cc/jjHvDqcx/srijani.webp',
    text: 'The designs are so pretty, quirky, and unique, making them perfect for adding a fun twist to any outfit. They look so chic and stylish, and I love how effortlessly they elevate a simple look. Such a refreshing take on everyday fashion! ✨💗',
  },
  {
    id: 7,
    name: 'Supriya',
    location: 'Bangalore',
    avatar: 'S',
    image: 'https://i.postimg.cc/q7sQNBwM/supriya.webp',
    text: 'The fit is so comfortable and flattering, and the adjustable detailing makes it easy to customise according to my preference. I love how it fits just right while still feeling effortless to wear. The design is unique, the quality is lovely, and it’s such a stylish addition to my wardrobe! ✨🎀',
  },
  {
    id: 8,
    name: 'Girisha',
    location: 'Jaipur',
    avatar: 'G',
    image: 'https://i.postimg.cc/QMG0NKQV/Girisha.webp',
    text: 'I was a little unsure about the fit initially, but I absolutely loved how it turned out! ❤️ The adjustable detailing makes such a difference, allowing the piece to fit comfortably and beautifully. The design is so unique and stylish, and I love how easy it is to dress up or down.',
  },
  {
    id: 9,
    name: 'Priyal',
    location: 'Kota',
    avatar: 'P',
    image: 'https://i.postimg.cc/5tBpX9gV/priyal.webp',
    text: "I'm in love with the shirts. I was having a shitty few days, so I thought of dressing up today and I don't think I could have found a better shirt. Thank you for this one ❤️❤️",
  },
  {
    id: 10,
    name: 'Pratishtha',
    location: 'Jaipur',
    avatar: 'P',
    rating: 5,
    image: 'https://i.postimg.cc/m2Tc2Vnc/pratishtha.webp',
    text: 'I am just in awe with the beautiful collection and All the best! I want to buy more. So awaited for more new collection ❤',
  },
  {
    id: 11,
    name: 'Gaural',
    location: 'Shimla',
    avatar: 'G',
    rating: 5,
    image: 'https://i.postimg.cc/c4dK4Tzv/gaural.webp',
    text: 'I loved the print and the colors. And the fabric felt so smooth and comfortable on my skin. My friends were also so excited to see this unique piece! Keep it coming, team Corporate Pehnawa! 💙',
  },
  {
    id: 12,
    name: 'Rashi',
    location: 'Gurugram',
    avatar: 'R',
    rating: 5,
    image: 'https://i.postimg.cc/g2Trsp2s/rashi.webp',
    text: "I ordered a printed waistcoat from Corporate Pehnawa, and I'm absolutely thrilled with it! 💫 The design is stunning, the fabric feels premium, and the stitching is flawless. It fits perfectly and adds such an elegant touch to my outfit. I've received so many compliments every time I've worn it!",
  },
  {
    id: 13,
    name: 'Amisha',
    location: 'Bangalore',
    avatar: 'A',
    rating: 5,
    image: 'https://i.postimg.cc/pVfhH3s5/Amisha.webp',
    text: "Heyy beautiful!🌻 I tried out the pehnawa and absolutely fell in love with it! It was a perfect fit🫶🏻 Very light and comfortable and the pockets are a dream come true...very handy! I will share the photos soon♥ Thank youu so much... I'm really looking forward to adding more to my wardrobe!",
  },
];

// ------------------------------------------------------------------
// 2. SPEED CONTROL
// ------------------------------------------------------------------
const DEFAULT_SECONDS_PER_CARD = 7;
const MIN_ITEMS_PER_LOOP = 8;

const Testimonials = ({
  secondsPerCard = DEFAULT_SECONDS_PER_CARD,
}) => {
  // Repeat the list until one loop is long enough to cover wide screens
  const repeatCount = Math.max(
    1,
    Math.ceil(MIN_ITEMS_PER_LOOP / testimonials.length)
  );

  const loop = Array.from(
    { length: repeatCount },
    () => testimonials
  ).flat();

  // Two identical loops create a seamless infinite scroll
  const track = [...loop, ...loop];
  const duration = loop.length * secondsPerCard;

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="section-titlee">Pehnawa Stories</h2>
        </div>
      </div>

      <div className="testimonials-carousel">
        <div
          className="testimonials-track"
          style={{
            '--testimonials-duration': `${duration}s`,
          }}
        >
          {track.map((testimonial, index) => (
            <div
              key={`${index}-${testimonial.id}`}
              className="testimonial-item"
              aria-hidden={
                index >= loop.length ? 'true' : undefined
              }
            >
              <div className="testimonial-card">
                <div className="quote-icon">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10 16.5c0-3.866 3.134-7 7-7h1.5a1.5 1.5 0 000-3H17c-5.523 0-10 4.477-10 10v11a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5v-9a1.5 1.5 0 00-1.5-1.5h-7.5v-.5zm17 0c0-3.866 3.134-7 7-7h1.5a1.5 1.5 0 000-3H34c-5.523 0-10 4.477-10 10v11a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5v-9a1.5 1.5 0 00-1.5-1.5h-7.5v-.5z" />
                  </svg>
                </div>

                {testimonial.image && (
                  <div className="testimonial-image-container">
                    <img
                      src={testimonial.image}
                      alt={`${testimonial.name}'s testimonial`}
                      className="testimonial-image"
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                )}

                <p className="testimonial-text">
                  {testimonial.text}
                </p>

                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.avatar}
                  </div>

                  <div className="author-info">
                    <h4 className="author-name">
                      {testimonial.name}
                    </h4>

                    <p className="author-location">
                      {testimonial.location}
                    </p>
                  </div>
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