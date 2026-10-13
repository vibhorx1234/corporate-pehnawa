import React, { useEffect, useRef, useState } from 'react';
import './TrendingReels.css';

/* ------------------------------------------------------------------
   1. ADD YOUR SHORTS HERE – just push as many video IDs as you like
------------------------------------------------------------------- */
const shorts = [
  { id: 1, videoId: '2z5UZYk0Mi0' },
  { id: 2, videoId: 'uRlQwsgcBUo' },
  { id: 3, videoId: 'CZSVU2XAH5U' },
  { id: 4, videoId: 'u-mjoWV6ocs' },
  { id: 5, videoId: 'GfFvIp6pUqk' },
  { id: 6, videoId: 'iT4ilv9GL98' },
];

/* ------------------------------------------------------------------
   2. SPEED CONTROL
   Seconds each reel takes to pass by.
   Lower number = faster, higher number = slower.
   (Can also be overridden per-use: <TrendingReels secondsPerReel={6} />)
------------------------------------------------------------------- */
const DEFAULT_SECONDS_PER_REEL = 4;

/* Minimum cards in one loop so the track is always wider than the screen,
   even if you only have 2-3 shorts. */
const MIN_ITEMS_PER_LOOP = 8;

/* Single reel card.
   The video (muted + autoplay) is only mounted while the card is visible
   inside the carousel AND the section is on screen. Off-screen cards just
   show the thumbnail, so only a handful of videos ever play at once. */
const ReelCard = ({ short, carouselRef, sectionVisible }) => {
  const cardRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    const root = carouselRef.current;
    if (!el || !root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root, threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [carouselRef]);

  const shouldPlay = inView && sectionVisible;

  return (
    <div className="reel-item">
      <div className="reel-wrapper" ref={cardRef}>
        {/* thumbnail stays underneath as a poster while the video loads */}
        <img
          className="reel-thumb"
          src={`https://i.ytimg.com/vi/${short.videoId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          draggable="false"
        />

        {shouldPlay && (
          <iframe
            className="reel-video"
            src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&mute=1&loop=1&playlist=${short.videoId}&controls=1&playsinline=1&modestbranding=1&rel=0`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={`YouTube Short ${short.id}`}
          />
        )}
      </div>
    </div>
  );
};

const TrendingReels = ({ secondsPerReel = DEFAULT_SECONDS_PER_REEL }) => {
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const [sectionVisible, setSectionVisible] = useState(false);

  // Start playing when the section scrolls into view, stop when it leaves
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Repeat the list until one loop is long enough to cover wide screens
  const repeatCount = Math.max(1, Math.ceil(MIN_ITEMS_PER_LOOP / shorts.length));
  const loop = Array.from({ length: repeatCount }, () => shorts).flat();

  // Two identical loops => animating by -50% gives a seamless infinite scroll
  const track = [...loop, ...loop];

  const duration = loop.length * secondsPerReel;

  return (
    <section className="trending-reels-section" ref={sectionRef}>
      <div className="container">
        <div className="trending-reels-header">
          <h2 className="section-titlee">Talk of the Town</h2>
        </div>
      </div>

      <div className="reels-carousel" ref={carouselRef}>
        <div
          className="reels-track"
          style={{ '--reels-duration': `${duration}s` }}
        >
          {track.map((short, index) => (
            <ReelCard
              key={`${index}-${short.videoId}`}
              short={short}
              carouselRef={carouselRef}
              sectionVisible={sectionVisible}
            />
          ))}
        </div>
      </div>

      <div className="container">
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