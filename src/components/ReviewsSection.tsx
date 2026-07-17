"use client";

import React from "react";
import ReviewVideo from "./ReviewVideo";

const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews-section" className="reviews-section">
      {/* Inline styles backup */}
      <style dangerouslySetInnerHTML={{__html: `
        .reviews-section {
          position: relative !important;
          padding-top: 60px !important;
          padding-bottom: 0px !important;
          background-color: #ffffff !important;
          color: #1a1a1a !important;
          width: 100% !important;
          box-sizing: border-box !important;
          border-top: 1px solid #e5e7eb !important;
        }
        .reviews-header {
          text-align: center !important;
          margin-bottom: 40px !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
          max-width: 1325px !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .reviews-title {
          font-size: clamp(28px, 4vw, 38px) !important;
          font-weight: 800 !important;
          color: #1a1a1a !important;
          font-family: var(--font-playfair), serif !important;
          margin: 0 0 12px 0 !important;
          text-transform: uppercase !important;
          letter-spacing: -0.5px !important;
          line-height: 1.15 !important;
        }
        .reviews-subtitle {
          font-size: 14px !important;
          color: #6b7280 !important;
          margin: 0 !important;
          line-height: 1.5 !important;
          font-family: var(--font-dm-sans), sans-serif !important;
        }
        @media (max-width: 768px) {
          .reviews-section {
            padding-top: 40px !important;
            padding-bottom: 10px !important;
          }
          .reviews-title {
            font-size: 26px !important;
          }
        }
      `}} />

      <div className="w-full">
        {/* Voices of Celebration Header */}
        <div className="reviews-header">
          <h2 className="reviews-title">
            Voices of <span style={{ color: "#80281F" }}>Celebration</span>
          </h2>
          <p className="reviews-subtitle">
            Hear from HR leaders and corporate heads who planned their team celebrations with us
          </p>
        </div>

        {/* Review Videos Section */}
        <div style={{ marginBottom: 0 }}>
          <ReviewVideo />
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
