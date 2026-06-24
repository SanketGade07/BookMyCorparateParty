"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

const WA = "https://wa.me/917304672801";
const R = "#80281F";

function ThankYouContent() {
  const params = useSearchParams();
  const isChat = params.get("chat") === "1";

  useEffect(() => {
    // Fire Google Ads conversion for every lead (both form and WhatsApp)
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-17399689995/wQ54CMLrsqAcEIvm6OhA",
        value: 1.0,
        currency: "INR",
      });
    }

    // Trigger PDF download automatically when user lands on Thank You page
    const link = document.createElement("a");
    link.href = "/api/download-pdf";
    link.download = "bookmycorporateparty.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  useEffect(() => {
    if (isChat) {
      // Delay redirection to WhatsApp to allow the download to start
      const timer = setTimeout(() => {
        window.location.href = WA;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isChat]);

  return (
    <main style={{ minHeight: "100vh", background: "#FDF0EF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "var(--font-dm-sans), sans-serif" }}>
      {/* Checkmark */}
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: R, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 800, color: R, margin: "0 0 12px", textAlign: "center" }}>
        Thank You!
      </h1>

      <p style={{ fontSize: 16, color: "#4B5563", maxWidth: 420, textAlign: "center", margin: "0 0 8px", lineHeight: 1.6 }}>
        {isChat
          ? "We've received your details. Redirecting you to WhatsApp now…"
          : "Your enquiry has been submitted. Our team will reach out with curated venue options within 30 minutes."}
      </p>

      <p style={{ fontSize: 14, color: "#6B7280", maxWidth: 420, textAlign: "center", margin: "8px 0 0", lineHeight: 1.5 }}>
        Your corporate party brochure is downloading automatically.{" "}
        <a
          href="/api/download-pdf"
          download="bookmycorporateparty.pdf"
          style={{ color: R, textDecoration: "underline", fontWeight: 700 }}
        >
          Click here
        </a>{" "}
        if it did not start.
      </p>

      {/* WhatsApp button — always visible */}
      <a
        href={WA}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          marginTop: 28,
          background: R,
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
          padding: "14px 28px",
          borderRadius: 50,
          textDecoration: "none",
          boxShadow: "0 4px 14px rgba(128, 40, 31, 0.25)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(128, 40, 31, 0.35)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(128, 40, 31, 0.25)"; }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.22-1.57A11.94 11.94 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zM12 22c-1.85 0-3.66-.5-5.24-1.44l-.37-.22-3.69.93.98-3.59-.24-.38A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.66 0 5.16 1.04 7.04 2.92A9.93 9.93 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.47-7.4c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.59-.49-.51-.68-.52H6.9c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/></svg>
        {isChat ? "Open WhatsApp" : "Chat with us on WhatsApp"}
      </a>

      <Link
        href="/"
        style={{ marginTop: 16, fontSize: 14, color: R, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid ${R}`, paddingBottom: 2 }}
      >
        ← Back to Home
      </Link>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense>
      <ThankYouContent />
    </Suspense>
  );
}
