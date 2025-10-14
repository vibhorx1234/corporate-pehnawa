import React, { useEffect, useRef } from 'react';
import './TrendingReels.css';

const TrendingReels = () => {
  const videoRefs = useRef([]);

  const shorts = [
    {
      id: 1,
      videoId: 'lo8yRVTOdrE',
    },
    {
      id: 2,
      videoId: 'sQssF7nz-m0',
    },
    {
      id: 3,
      videoId: 't7tVaY_MQ5Y', // Random YouTube short
    }
  ];

  useEffect(() => {
    const observers = [];

    videoRefs.current.forEach((iframe, index) => {
      if (!iframe) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Add autoplay parameter when video comes into view
            const videoId = shorts[index].videoId;
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0`;
          } else {
            // Stop video when out of view
            const videoId = shorts[index].videoId;
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0`;
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(iframe);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer, index) => {
        if (videoRefs.current[index]) {
          observer.disconnect();
        }
      });
    };
  }, []);

  return (
    <section className="trending-reels-section">
      <div className="container">
        <div className="trending-reels-header">
          <h2 className="section-titlee">See What's Trending</h2>
          <p className="section-subtitle">
            Watch our latest videos and stay connected with our community
          </p>
        </div>

        <div className="trending-reels-grid">
          {shorts.map((short, index) => (
            <div key={short.id} className="reel-wrapper">
              <iframe
                ref={(el) => (videoRefs.current[index] = el)}
                src={`https://www.youtube.com/embed/${short.videoId}?autoplay=0&mute=1&loop=1&playlist=${short.videoId}&controls=1&modestbranding=1&rel=0`}
                className="reel-video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={`YouTube Short ${short.id}`}
              />
            </div>
          ))}
        </div>

        <div className="trending-reels-cta">
          <a
            href="https://www.instagram.com/corporatepehnawa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            Follow @corporatepehnawa
          </a>
        </div>
      </div>
    </section>
  );
};

export default TrendingReels;