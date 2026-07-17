"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";

const INSTAGRAM_HANDLE = "bookmycorporateparty.india";
const PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

interface InstaPost {
  img: string;
  alt: string;
  postUrl: string;
  likes: string;
  caption: string;
}

const posts: InstaPost[] = [
  {
    img: "/images/instagram/post-1.jpg",
    alt: "Premium lounge setup for corporate dinner",
    postUrl: "https://www.instagram.com/p/Da4g1-9C_Fr/",
    likes: "342",
    caption: "Exclusive lounge setup for a 100-pax corporate dinner 🍷✨"
  },
  {
    img: "/images/instagram/post-2.jpg",
    alt: "Rooftop corporate dinner party",
    postUrl: "https://www.instagram.com/p/Da3RlqtDhnq/",
    likes: "518",
    caption: "Candlelit rooftop dinner for leadership team 🌃🥂"
  },
  {
    img: "/images/instagram/post-3.jpg",
    alt: "Luxury banquet hall event",
    postUrl: "https://www.instagram.com/p/DazWpRRJunj/",
    likes: "276",
    caption: "Stunning banquet setup for annual gala night 🎊"
  },
  {
    img: "/images/instagram/post-4.jpg",
    alt: "Corporate team building outing",
    postUrl: "https://www.instagram.com/p/Das0ZZHi2u0/",
    likes: "431",
    caption: "Team outing vibes at a beach resort 🏖️💪"
  },
  {
    img: "/images/instagram/post-5.jpg",
    alt: "Open lawn corporate event",
    postUrl: "https://www.instagram.com/p/DarGk7Vi6uk/",
    likes: "389",
    caption: "Open lawn party with live music and buffet 🌿🎶"
  },
  {
    img: "/images/instagram/post-6.jpg",
    alt: "Corporate DJ night party",
    postUrl: "https://www.instagram.com/p/DaqFgHSM_mX/",
    likes: "624",
    caption: "DJ night that had 200+ employees on the floor 🎧🔥"
  },
  {
    img: "/images/instagram/post-7.jpg",
    alt: "Poolside corporate retreat",
    postUrl: "https://www.instagram.com/p/DapnmrvOL4S/",
    likes: "453",
    caption: "Poolside networking evening for senior leaders 🏊‍♂️"
  },
  {
    img: "/images/instagram/post-8.jpg",
    alt: "Corporate award ceremony",
    postUrl: "https://www.instagram.com/p/DamhaERCAyY/",
    likes: "712",
    caption: "Employee of the Year award ceremony 🏆🎉"
  },
  {
    img: "/images/instagram/post-9.jpg",
    alt: "Festive corporate celebration",
    postUrl: "https://www.instagram.com/p/DamOA0NIooe/",
    likes: "567",
    caption: "Diwali gala with custom themes and live counters 🪔✨"
  },
  {
    img: "/images/instagram/post-10.jpg",
    alt: "Café team gathering",
    postUrl: "https://www.instagram.com/p/DamMBe7oLHI/",
    likes: "198",
    caption: "Cozy café gathering for a farewell lunch 🍕☕"
  }
];

const COPIES = 3;
const duplicatedPosts = Array.from({ length: COPIES }).flatMap(() => posts);

const InstagramWidget: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const translateX = useRef(0);
  const totalWidth = useRef(0);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const scrollSpeed = 0.6;

  const calculateWidth = useCallback(() => {
    if (!trackRef.current) return;
    const fullScrollWidth = trackRef.current.scrollWidth;
    totalWidth.current = fullScrollWidth / COPIES;
    translateX.current = -totalWidth.current;
    trackRef.current.style.transform = `translateX(${translateX.current}px)`;
  }, []);

  const wrapTranslateX = useCallback(() => {
    if (translateX.current >= 0) {
      translateX.current -= totalWidth.current;
    }
    if (translateX.current <= -totalWidth.current * (COPIES - 1)) {
      translateX.current += totalWidth.current;
    } else if (translateX.current <= -totalWidth.current) {
      while (translateX.current <= -totalWidth.current * 2) {
        translateX.current += totalWidth.current;
      }
    }
  }, []);

  const animate = useCallback(() => {
    if (!isPaused && !isDragging.current && trackRef.current) {
      translateX.current -= scrollSpeed;
      wrapTranslateX();
      trackRef.current.style.transform = `translateX(${translateX.current}px)`;
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, wrapTranslateX]);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    // Only capture primary mouse clicks
    if ('button' in e && e.button !== 0) return;
    isDragging.current = true;
    hasMoved.current = false;
    setIsPaused(true);
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    startX.current = clientX;
    scrollLeft.current = translateX.current;
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const walk = (clientX - startX.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasMoved.current = true;
    }
    translateX.current = scrollLeft.current + walk;
    wrapTranslateX();
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${translateX.current}px)`;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    setIsPaused(false);
    // Keep hasMoved true briefly so the click event checks it and prevents navigation if dragging occurred
    setTimeout(() => {
      hasMoved.current = false;
    }, 50);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (isHorizontalScroll) {
      e.preventDefault();
      e.stopPropagation();
      const scrollAmount = e.deltaX * 0.5;
      translateX.current -= scrollAmount;
      wrapTranslateX();
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${translateX.current}px)`;
      }
    }
  };

  // Separate effects to avoid reset-on-hover
  useEffect(() => {
    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    return () => window.removeEventListener("resize", calculateWidth);
  }, [calculateWidth]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  useEffect(() => {
    const handleWheelCapture = (e: WheelEvent) => {
      if (trackRef.current && trackRef.current.contains(e.target as Node)) {
        const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if (isHorizontalScroll) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    document.addEventListener('wheel', handleWheelCapture, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleWheelCapture);
    };
  }, []);

  return (
    <section id="instagram-section">
      <style dangerouslySetInnerHTML={{__html: `
        #instagram-section {
          position: relative;
          padding: 20px 0 60px 0;
          background-color: #fafafa;
          color: #1a1a1a;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          border-top: 1px solid #e5e7eb;
        }
        .insta-header {
          text-align: center;
          margin-bottom: 36px;
          padding: 0 16px;
        }
        .insta-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 20px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .insta-title {
          font-size: clamp(28px, 4vw, 38px);
          font-weight: 800;
          color: #1a1a1a;
          font-family: var(--font-playfair), serif;
          margin: 12px 0 10px 0;
          letter-spacing: -0.5px;
          line-height: 1.15;
        }
        .insta-subtitle {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .insta-scroll-area {
          overflow: hidden;
          position: relative;
          padding: 20px 0 50px 0;
        }
        .insta-track {
          display: flex;
          width: max-content;
          gap: 16px;
          will-change: transform;
        }
        .insta-post-card {
          flex-shrink: 0;
          width: 300px;
          border-radius: 16px;
          overflow: hidden;
          background: #000;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(.2,.8,.3,1);
          text-decoration: none;
          color: inherit;
          display: block;
          margin: 0 2px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.12);
        }
        .insta-post-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .insta-post-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 5;
          overflow: hidden;
        }
        .insta-post-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.4s ease, transform 0.4s ease;
        }
        .insta-post-card:hover .insta-post-img-wrap img {
          filter: brightness(0.55) blur(1.5px);
        }
        /* Bottom gradient bar — always visible */
        .insta-post-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 40px 16px 14px;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .insta-post-handle {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 600;
          color: #ffffff;
          font-family: var(--font-dm-sans), sans-serif;
          letter-spacing: 0.2px;
        }
        .insta-post-handle-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid #ffffff;
          background: linear-gradient(135deg, #f09433, #dc2743, #bc1888);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .insta-post-stats {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .insta-stat {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
          font-family: var(--font-dm-sans), sans-serif;
        }
        .insta-header-follow-pill {
          display: inline-flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          color: #1a1a1a;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
          letter-spacing: 0.3px;
          text-decoration: none;
          font-family: var(--font-dm-sans), sans-serif;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .insta-header-follow-pill:hover {
          background: linear-gradient(45deg, #f09433, #dc2743, #bc1888);
          color: #ffffff;
          border-color: transparent;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(220, 39, 67, 0.25);
        }
        /* Center overlay — appears on hover */
        .insta-hover-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
        }
        .insta-post-card:hover .insta-hover-overlay {
          background: rgba(0,0,0,0.35);
          opacity: 1;
        }
        .insta-hover-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          background: rgba(255,255,255,0.95);
          border-radius: 50px;
          font-size: 13px;
          font-weight: 700;
          color: #E1306C;
          font-family: var(--font-dm-sans), sans-serif;
          transform: translateY(10px);
          transition: transform 0.3s ease;
          backdrop-filter: blur(4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .insta-post-card:hover .insta-hover-pill {
          transform: translateY(0);
        }
        .insta-cta {
          text-align: center;
          margin-top: 32px;
          padding: 0 16px;
        }
        .insta-follow-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 36px;
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          font-family: var(--font-dm-sans), sans-serif;
          letter-spacing: 0.3px;
        }
        .insta-follow-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(220, 39, 67, 0.4);
        }
        @media (max-width: 768px) {
          #instagram-section {
            padding: 48px 0;
          }
          .insta-post-card {
            width: 250px;
          }
          .insta-title {
            font-size: 26px;
          }
        }
      `}} />

      {/* Header */}
      <div className="insta-header">
        <span className="insta-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          Instagram
        </span>
        <h2 className="insta-title">
          Follow Us on <span style={{ color: "#80281F" }}>Instagram</span>
        </h2>
        <p className="insta-subtitle">
          See the celebrations we create — from DJ nights and gala dinners to team outings and offsites
        </p>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        className="insta-scroll-area"
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onWheel={handleWheel}
      >
        <div ref={trackRef} className="insta-track">
          {duplicatedPosts.map((post, idx) => (
            <a
              key={`${idx}-${post.alt}`}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="insta-post-card"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onClick={(e) => {
                // Prevent navigation if user was dragging/scrolling manually
                if (hasMoved.current) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <div className="insta-post-img-wrap">
                <img src={post.img} alt={post.alt} loading="lazy" draggable={false} />
                {/* Bottom gradient bar with handle */}
                <div className="insta-post-bottom">
                  <div className="insta-post-handle">
                    <div className="insta-post-handle-avatar">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      </svg>
                    </div>
                    bookmycorporateparty.india
                  </div>
                </div>
                {/* Center hover overlay */}
                <div className="insta-hover-overlay">
                  <div className="insta-hover-pill">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    View Post
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramWidget;
