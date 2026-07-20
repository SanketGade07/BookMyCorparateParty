"use client";

import React from "react";
import EventsCarousel from "./EventsCarousel";

const EventsSection: React.FC = () => {
  return (
    <section id="events-section" className="events-section">
      {/* Inline styles backup */}
      <style dangerouslySetInnerHTML={{__html: `
        .events-section {
          position: relative !important;
          padding-top: 60px !important;
          padding-bottom: 0px !important;
          background-color: #ffffff !important;
          color: #1a1a1a !important;
          width: 100% !important;
          box-sizing: border-box !important;
          border-top: 1px solid #e5e7eb !important;
        }
        .events-header {
          text-align: center !important;
          margin-bottom: 40px !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
          max-width: 1325px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .events-title {
          font-size: clamp(28px, 4vw, 38px) !important;
          font-weight: 800 !important;
          color: #1a1a1a !important;
          font-family: var(--font-playfair), serif !important;
          margin: 0 0 12px 0 !important;
          text-transform: uppercase !important;
          letter-spacing: -0.5px !important;
          line-height: 1.15 !important;
        }
        .events-subtitle {
          font-size: 14px !important;
          color: #6b7280 !important;
          margin: 0 !important;
          line-height: 1.5 !important;
          font-family: var(--font-dm-sans), sans-serif !important;
        }
        @media (max-width: 768px) {
          .events-section {
            padding-top: 40px !important;
            padding-bottom: 10px !important;
          }
          .events-title {
            font-size: 26px !important;
          }
        }
      `}} />

      <div className="w-full">
        {/* Voices of Celebration Header */}
        <div className="events-header">
          <h2 className="events-title">
            Memorable <span style={{ color: "#80281F" }}>Celebrations</span>
          </h2>
          <p className="events-subtitle">
            Take a look at some of the recent corporate outings and office celebrations managed by us
          </p>
        </div>

        {/* Review Videos Section */}
        <div style={{ marginBottom: 0 }}>
          <EventsCarousel />
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
