"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, X } from "lucide-react";

interface EventCard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  outerUrl: string;
  innerUrl: string;
  reviewerName: string;
  rating: number;
  transcript: string;
}

const events: EventCard[] = [
  {
    id: 1,
    title: "CATERING EXPERIENCE",
    subtitle: "EXECUTIVE LUNCH & DINNER",
    description: "Delightful culinary experiences customized for corporate gatherings, team lunches, and annual dinners.",
    outerUrl: "/events/catering-event.jpg",
    innerUrl: "/events/catering-event-inner.jpg",
    reviewerName: "Aditya Roy",
    rating: 5,
    transcript: "The corporate catering services were outstanding. From live counters to a premium multi-cuisine buffet, the food quality and service standard exceeded everyone's expectations."
  },
  {
    id: 2,
    title: "ANNUAL DAY CELEBRATION",
    subtitle: "CONCORDE GROUP",
    description: "Sleek and grand annual celebrations honoring employee achievements and milestone successes.",
    outerUrl: "/events/concorde-annual-celebration-2026.jpg",
    innerUrl: "/events/concorde-annual-celebration-2026-inner.jpg",
    reviewerName: "Siddharth Verma",
    rating: 5,
    transcript: "A magnificent celebration for our annual day in 2026. The stage design, lighting, sound system, and theme execution were top-notch. Our entire team had an unforgettable night!"
  },
  {
    id: 3,
    title: "ADVENTURE & TEAM BUILDING",
    subtitle: "DELLA ADVENTURE RESORT",
    description: "Dynamic outbound team-building program packed with adventure sports, leadership training, and outdoor fun.",
    outerUrl: "/events/della-adventure-training-academy-event-2.JPG",
    innerUrl: "/events/della-adventure-training-academy-event-inner.JPG",
    reviewerName: "Neha Sen",
    rating: 5,
    transcript: "The adventure-themed corporate outbound training at Della Adventure Academy was structured perfectly. High-energy activities, professional trainers, and excellent team building coordination."
  },
  {
    id: 4,
    title: "OFFICE INAUGURATION",
    subtitle: "GUIDEPOINT NEW OFFICE",
    description: "Premium corporate launch events and ribbon-cutting ceremonies welcoming new workspaces.",
    outerUrl: "/events/guide-point-office-inauguration.jpg",
    innerUrl: "/events/guide-point-office-inaugaration-inner.jpg",
    reviewerName: "Rajesh Kulkarni",
    rating: 5,
    transcript: "We inaugurated our new workspace with a beautifully coordinated corporate ceremony. The ribbon-cutting, decor, sound, and VIP hosting were handled with extreme professionalism."
  },
  {
    id: 5,
    title: "MANGO FESTIVAL CARNIVAL",
    subtitle: "CDSL",
    description: "A delightful themed office fun day celebrating summers with activities, curated snacks, and live music.",
    outerUrl: "/events/mango-festival-thumbnail.jpg",
    innerUrl: "/events/mango-festival-inner.mp4",
    reviewerName: "Aarav Mehra",
    rating: 5,
    transcript: "An amazing, unique summer-themed carnival for the office! Our employees and their families had a blast with mango tastings, activities, and music."
  },
  {
    id: 6,
    title: "UNIFIED ANNUAL DAY",
    subtitle: "UNIFIED DIGITAL",
    description: "High-octane corporate annual outings with live band performances, reward distribution, and premium banquets.",
    outerUrl: "/events/unified-annual-day-2.png",
    innerUrl: "/events/unifiedf-annual-day-inner.mp4",
    reviewerName: "Pooja Hegde",
    rating: 5,
    transcript: "A spectacular annual event with a great mix of fun, corporate recognition, and excellent dining. BMCP managed everything from the DJ to the venue coordination seamlessly."
  }
];

const COPIES = 4;
const duplicatedEvents = Array.from({ length: COPIES }).flatMap(() => events);

export default function EventsCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number | null>(null);
  const translateX = useRef(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const totalWidth = useRef(0);
  const scrollSpeed = 0.5;

  const isVideo = (url: string) => {
    return url.toLowerCase().endsWith(".mp4");
  };

  const calculateWidth = useCallback(() => {
    if (!containerRef.current) return;
    const fullScrollWidth = containerRef.current.scrollWidth;
    totalWidth.current = fullScrollWidth / COPIES;
    translateX.current = -totalWidth.current;
    containerRef.current.style.transform = `translateX(${translateX.current}px)`;
  }, []);

  const wrapTranslateX = useCallback(() => {
    if (!containerRef.current) return;
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
    if (!isPaused && !isDragging.current && containerRef.current) {
      translateX.current -= scrollSpeed;
      wrapTranslateX();
      containerRef.current.style.transform = `translateX(${translateX.current}px)`;
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, wrapTranslateX]);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    setIsPaused(true);
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    startX.current = clientX;
    scrollLeft.current = translateX.current;
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const walk = (clientX - startX.current) * 2;
    translateX.current = scrollLeft.current + walk;
    wrapTranslateX();
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(${translateX.current}px)`;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    setIsPaused(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (isHorizontalScroll) {
      e.preventDefault();
      e.stopPropagation();
      const scrollAmount = e.deltaX * 0.5;
      translateX.current -= scrollAmount;
      wrapTranslateX();
      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${translateX.current}px)`;
      }
    }
  };

  const handlePlayClick = (event: EventCard) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
  };

  useEffect(() => {
    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    return () => {
      window.removeEventListener("resize", calculateWidth);
    };
  }, [calculateWidth]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  useEffect(() => {
    const handleWheelCapture = (e: WheelEvent) => {
      if (containerRef.current && containerRef.current.contains(e.target as Node)) {
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
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .events-video-container {
          width: 100% !important;
          overflow: hidden !important;
          position: relative !important;
          margin-top: 15px !important;
          padding: 20px 0 40px 0 !important;
          box-sizing: border-box !important;
        }
        .events-video-track {
          display: flex !important;
          width: max-content !important;
          gap: 24px !important;
          will-change: transform !important;
          box-sizing: border-box !important;
        }
        .event-card-item {
          flex-shrink: 0 !important;
          position: relative !important;
          border-radius: 20px !important;
          overflow: hidden !important;
          height: 480px !important;
          width: 350px !important;
          margin-left: 8px !important;
          margin-right: 8px !important;
          margin-top: 10px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          box-sizing: border-box !important;
          background-color: #1a1a1a !important;
        }
        .event-card-item:hover {
          transform: translateY(-10px) !important;
          box-shadow: 0 20px 35px rgba(128, 40, 31, 0.25) !important;
        }
        .event-card-image {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          transition: transform 0.3s ease !important;
        }
        .event-card-overlay {
          position: absolute !important;
          top: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          left: 0 !important;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.2) 100%) !important;
          z-index: 5 !important;
        }
        .play-button-circle {
          position: absolute !important;
          top: 35% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          width: 64px !important;
          height: 64px !important;
          background-color: rgba(255, 255, 255, 0.25) !important;
          backdrop-filter: blur(4px) !important;
          -webkit-backdrop-filter: blur(4px) !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #ffffff !important;
          border: none !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          z-index: 15 !important;
        }
        .event-card-item:hover .play-button-circle {
          transform: translate(-50%, -50%) scale(1.1) !important;
          background-color: rgba(128, 40, 31, 0.85) !important;
        }
        .play-icon-svg {
          width: 24px !important;
          height: 24px !important;
          fill: #ffffff !important;
          color: #ffffff !important;
        }
        .image-icon-svg {
          width: 24px !important;
          height: 24px !important;
          color: #ffffff !important;
        }
        .text-card-overlay {
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          padding: 24px !important;
          color: #ffffff !important;
          z-index: 10 !important;
          box-sizing: border-box !important;
          text-align: left !important;
        }
        .rating-stars {
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          margin-bottom: 12px !important;
        }
        .star-icon-small {
          width: 16px !important;
          height: 16px !important;
          color: #fbbf24 !important;
          fill: #fbbf24 !important;
        }
        .reviewer-card-name {
          font-weight: 700 !important;
          font-size: 1.125rem !important;
          margin: 0 0 4px 0 !important;
          color: #ffffff !important;
          font-family: var(--font-dm-sans), Arial, sans-serif !important;
        }
        .reviewer-card-title {
          font-size: 0.85rem !important;
          color: #FFD700 !important;
          font-weight: 600 !important;
          margin: 0 0 12px 0 !important;
          letter-spacing: 0.5px !important;
          text-transform: uppercase !important;
          font-family: var(--font-dm-sans), Arial, sans-serif !important;
        }
        .transcript-preview {
          font-size: 0.875rem !important;
          line-height: 1.5 !important;
          color: #e5e7eb !important;
          margin: 0 !important;
          opacity: 0.95 !important;
          font-family: var(--font-dm-sans), Arial, sans-serif !important;
          display: -webkit-box !important;
          -webkit-line-clamp: 3 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
        }
        .card-hover-overlay {
          position: absolute !important;
          top: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          left: 0 !important;
          background-color: rgba(26, 26, 26, 0.96) !important;
          padding: 32px 24px !important;
          opacity: 0 !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          z-index: 25 !important;
          text-align: center !important;
          box-sizing: border-box !important;
        }
        .event-card-item:hover .card-hover-overlay {
          opacity: 1 !important;
        }
        .hover-transcript {
          font-size: 0.875rem !important;
          line-height: 1.6 !important;
          color: #e5e7eb !important;
          margin: 0 0 20px 0 !important;
          font-family: var(--font-dm-sans), Arial, sans-serif !important;
          display: -webkit-box !important;
          -webkit-line-clamp: 4 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
        }
        .hover-watch-btn {
          background-color: #80281F !important;
          color: #ffffff !important;
          padding: 10px 28px !important;
          border-radius: 9999px !important;
          font-size: 0.875rem !important;
          font-weight: 700 !important;
          border: none !important;
          cursor: pointer !important;
          transition: background-color 0.2s ease !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }
        .hover-watch-btn:hover {
          background-color: #6b2018 !important;
        }

        /* Modal classes */
        .modal-overlay {
          position: fixed !important;
          top: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          left: 0 !important;
          background-color: rgba(0, 0, 0, 0.85) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          z-index: 99999 !important;
          padding: 16px !important;
        }
        .modal-body-container {
          position: relative !important;
          max-width: 1024px !important;
          width: 100% !important;
          background-color: #ffffff !important;
          border-radius: 20px !important;
          overflow: hidden !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        .modal-close-btn {
          position: absolute !important;
          top: 16px !important;
          right: 16px !important;
          width: 40px !important;
          height: 40px !important;
          background-color: rgba(0, 0, 0, 0.4) !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #ffffff !important;
          border: none !important;
          cursor: pointer !important;
          z-index: 100 !important;
          transition: background-color 0.2s ease !important;
        }
        .modal-close-btn:hover {
          background-color: rgba(0, 0, 0, 0.6) !important;
        }
        .modal-grid-layout {
          display: grid !important;
          grid-template-columns: 1fr !important;
        }
        @media (min-width: 1024px) {
          .modal-grid-layout {
            grid-template-columns: 2fr 1fr !important;
          }
        }
        .modal-video-wrapper {
          background-color: #000000 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .modal-video-player {
          width: 100% !important;
          height: auto !important;
          max-height: 80vh !important;
          display: block !important;
        }
        .modal-image-wrapper {
          background-color: #000000 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .modal-image-player {
          width: 100% !important;
          height: auto !important;
          max-height: 80vh !important;
          display: block !important;
          object-fit: contain !important;
        }
        .modal-sidebar-content {
          padding: 24px !important;
          background-color: #f9fafb !important;
          display: flex !important;
          flex-direction: column !important;
          font-family: var(--font-dm-sans), Arial, sans-serif !important;
          max-height: 80vh !important;
          overflow-y: auto !important;
          box-sizing: border-box !important;
          text-align: left !important;
        }
        .modal-rating-row {
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
          margin-bottom: 16px !important;
        }
        .modal-star-svg {
          width: 20px !important;
          height: 20px !important;
          color: #fbbf24 !important;
          fill: #fbbf24 !important;
        }
        .modal-reviewer-name {
          font-size: 1.25rem !important;
          font-weight: 800 !important;
          color: #111827 !important;
          margin: 0 0 4px 0 !important;
          font-family: var(--font-dm-sans), Arial, sans-serif !important;
        }
        .modal-reviewer-title {
          font-size: 0.95rem !important;
          color: #80281F !important;
          font-weight: 700 !important;
          margin: 0 0 4px 0 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          font-family: var(--font-dm-sans), Arial, sans-serif !important;
        }
        .modal-reviewer-sub {
          font-size: 0.85rem !important;
          color: #4b5563 !important;
          margin: 0 0 16px 0 !important;
          font-family: var(--font-dm-sans), Arial, sans-serif !important;
        }
        .modal-transcript-heading {
          font-size: 0.95rem !important;
          font-weight: 700 !important;
          color: #111827 !important;
          margin: 16px 0 8px 0 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }
        .modal-transcript-box {
          background-color: #ffffff !important;
          padding: 16px !important;
          border-radius: 12px !important;
          border: 1px solid #e5e7eb !important;
          margin-bottom: 24px !important;
        }
        .modal-transcript-text {
          font-size: 0.875rem !important;
          line-height: 1.6 !important;
          color: #374151 !important;
          margin: 0 !important;
          font-style: italic !important;
        }
        .modal-cta-btn {
          width: 100% !important;
          background-color: #80281F !important;
          color: #ffffff !important;
          padding: 12px 24px !important;
          border-radius: 9999px !important;
          font-size: 0.95rem !important;
          font-weight: 700 !important;
          border: none !important;
          cursor: pointer !important;
          transition: background-color 0.2s ease !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }
        .modal-cta-btn:hover {
          background-color: #6b2018 !important;
        }
        
        /* Mobile fixes */
        @media (max-width: 640px) {
          .event-card-item {
            height: 380px !important;
            width: 270px !important;
          }
          .play-button-circle {
            width: 48px !important;
            height: 48px !important;
          }
          .play-icon-svg {
            width: 18px !important;
            height: 18px !important;
          }
          .text-card-overlay {
            padding: 16px !important;
          }
          .reviewer-card-name {
            font-size: 1rem !important;
          }
          .reviewer-card-title {
            font-size: 0.8rem !important;
            margin-bottom: 8px !important;
          }
          .transcript-preview {
            font-size: 0.8rem !important;
          }
        }
      `}} />

      <div className="events-video-container">
        {/* Scrolling Video Container */}
        <div
          style={{ overflow: "visible", position: "relative" }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onWheel={handleWheel}
        >
          <div 
            ref={containerRef}
            className="events-video-track"
          >
            {duplicatedEvents.map((event, index) => {
              const eventId = `${index}-${event.id}`;
              
              return (
                <div
                  key={eventId}
                  className="event-card-item"
                  data-card="true"
                  draggable={false}
                  onClick={() => handlePlayClick(event)}
                >
                  {/* Thumbnail Background (OUTSIDE) */}
                  <img
                    src={event.outerUrl}
                    alt={`${event.reviewerName} event thumbnail`}
                    className="event-card-image"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      transition: 'transform 0.3s ease'
                    }}
                    draggable={false}
                  />
                  
                  {/* Overlay */}
                  <div className="event-card-overlay" />
                  
                  {/* Play Button (Only for videos) */}
                  {isVideo(event.innerUrl) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayClick(event);
                      }}
                      className="play-button-circle"
                    >
                      <Play className="play-icon-svg" />
                    </button>
                  )}

                  {/* Text Review Overlay */}
                  <div className="text-card-overlay">
                    {/* Rating Stars */}
                    <div className="rating-stars">
                      {[...Array(event.rating)].map((_, i) => (
                        <svg key={i} className="star-icon-small" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Event Title and Subtitle */}
                    <div>
                      <h4 className="reviewer-card-name">{event.title}</h4>
                      <p className="reviewer-card-title">{event.subtitle}</p>
                    </div>

                    {/* Transcript Preview */}
                    <div>
                      <p className="transcript-preview">
                        &quot;{event.transcript}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Hover State - Brief Preview */}
                  <div className="card-hover-overlay">
                    <div className="rating-stars" style={{ justifyContent: "center" }}>
                      {[...Array(event.rating)].map((_, i) => (
                        <svg key={i} className="star-icon-small" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <h4 className="reviewer-card-name" style={{ marginBottom: 4 }}>{event.title}</h4>
                    <p className="reviewer-card-title" style={{ color: "#FFD700" }}>{event.subtitle}</p>
                    <p className="hover-transcript">
                      &quot;{event.transcript.length > 80 ? event.transcript.substring(0, 80) + '...' : event.transcript}&quot;
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayClick(event);
                      }}
                      className="hover-watch-btn"
                    >
                      {isVideo(event.innerUrl) ? "Watch Full Video" : "View Event Details"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-body-container">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="modal-close-btn"
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
            
            <div className="modal-grid-layout">
              {/* Media Content (INSIDE) */}
              {isVideo(selectedEvent.innerUrl) ? (
                <div className="modal-video-wrapper">
                  <video
                    ref={modalVideoRef}
                    className="modal-video-player"
                    controls
                    autoPlay
                    playsInline
                    preload="metadata"
                    onLoadedData={() => {
                      if (modalVideoRef.current) {
                        modalVideoRef.current.muted = false;
                        modalVideoRef.current.play().catch(() => {
                          console.log('Autoplay prevented by browser');
                        });
                      }
                    }}
                  >
                    <source src={selectedEvent.innerUrl} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <div className="modal-image-wrapper">
                  <img
                    src={selectedEvent.innerUrl}
                    alt={selectedEvent.title}
                    className="modal-image-player"
                  />
                </div>
              )}
              
              {/* Event Details Sidebar */}
              <div className="modal-sidebar-content">
                <div style={{ flex: 1 }}>
                  {/* Rating */}
                  <div className="modal-rating-row">
                    {[...Array(selectedEvent.rating)].map((_, i) => (
                      <svg key={i} className="modal-star-svg" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  {/* Event Info */}
                  <div>
                    <h3 className="modal-reviewer-name">{selectedEvent.title}</h3>
                    <p className="modal-reviewer-title">{selectedEvent.subtitle}</p>
                  </div>
                  
                  {/* Event Details Description */}
                  <div>
                    <h4 className="modal-transcript-heading">Event Details</h4>
                    <div className="modal-transcript-box">
                      <p className="modal-transcript-text" style={{ fontStyle: "normal", marginBottom: 12 }}>
                        {selectedEvent.description}
                      </p>
                      <p className="modal-transcript-text">
                        &quot;{selectedEvent.transcript}&quot;
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Call to Action Button */}
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e5e7eb", flexShrink: 0 }}>
                  <button 
                    onClick={() => {
                      handleCloseModal();
                      window.open("https://wa.me/917304672801", "_blank");
                    }}
                    className="modal-cta-btn"
                  >
                    Book Your Celebration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
