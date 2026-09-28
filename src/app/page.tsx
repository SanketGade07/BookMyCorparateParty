"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useGeoLocation from "../hooks/useGeoLocation";
import dynamic from "next/dynamic";

// const ReviewsSection = dynamic(() => import("../components/ReviewsSection"), { ssr: false });
const EventsSection = dynamic(() => import("../components/EventsSection"), { ssr: false });
const InstagramWidget = dynamic(() => import("../components/InstagramWidget"), { ssr: false });
const CompanyLogoSlider = dynamic(() => import("../components/CompanyLogoSlider"), { ssr: false });
const DeliverSlider = dynamic(() => import("../components/DeliverSlider"), { ssr: false });

const R = "#80281F";
const D = "#1A1A1A";
const L = "#FDF0EF";
const G = "#6B7280";
const B = "#E5E7EB";
const WA = "https://wa.me/917304672801";

function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, style: { opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.6s ease, transform 0.6s ease" } };
}

const Sec = ({ children, bg = "transparent", id, style }: { children: React.ReactNode; bg?: string; id?: string, style?: any }) => {
  const f = useFadeIn();
  return (
    <section ref={f.ref as React.RefObject<HTMLElement>} id={id} className="section-pad" style={{ ...f.style, background: bg, padding: "32px clamp(100px, 8vw, 200px)", ...style }}>
      <div style={{ width: "100%" }}>{children}</div>
    </section>
  );
};

function Badge({ text }: { text: string }) {
  return <span style={{ display: "inline-block", background: L, color: R, fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20, letterSpacing: 0.8, textTransform: "uppercase" }}>{text}</span>;
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${B}`, cursor: "pointer", padding: "18px 0" }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: D, paddingRight: 16 }}>{q}</h4>
        <span style={{ fontSize: 22, color: R, transition: "transform 0.3s", transform: open ? "rotate(45deg)" : "none", flexShrink: 0 }}>+</span>
      </div>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height 0.4s ease, opacity 0.3s", opacity: open ? 1 : 0 }}>
        <p style={{ fontSize: 15, color: G, lineHeight: 1.7, margin: "12px 0 0", paddingRight: 40 }}>{a}</p>
      </div>
    </div>
  );
}

type Venue = { name: string; img: string; tags: string[]; desc: string; capacity: string };

function VenueCard({ v }: { v: Venue }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      overflow: "hidden",
      border: `1px solid ${B}`,
      transition: "transform 0.2s",
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
      <div style={{ height: 180, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        <img src={v.img} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
          <h4 style={{ margin: 0, color: "#fff", fontSize: 18, fontWeight: 700 }}>{v.name}</h4>
        </div>
      </div>
      <div style={{ padding: "20px 18px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", flexShrink: 0 }}>
          {v.tags.map((t, j) => (
            <span key={j} style={{ fontSize: 11, fontWeight: 600, color: R, background: L, padding: "4px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ fontSize: 10 }}>✓</span> {t}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 13.5, color: G, lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>{v.desc}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: D, fontWeight: 700, marginBottom: 20, flexShrink: 0 }}>
          <span style={{ color: "#5D5FEF", fontSize: 16 }}>👥</span>
          <span>Capacity: {v.capacity}</span>
        </div>
        <button style={{
          width: "100%", padding: "12px 0",
          background: "none", color: R,
          border: `1px solid ${R}`, borderRadius: 8,
          fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif",
          transition: "all 0.2s ease",
          flexShrink: 0
        }} onMouseEnter={e => { e.currentTarget.style.background = R; e.currentTarget.style.color = "#fff"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = R; }} onClick={() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' })}>
          Get Venue Options →
        </button>
      </div>
    </div>
  );
}

export const OCCASIONS = [
  "Annual Day / Annual Gala",
  "Diwali Party / Festival Celebration",
  "Year-End / Christmas Party",
  "Team Outing / Team Building",
  "Annual Conference / Business Summit",
  "Awards & Recognition / R&R Event",
  "Offsite / Leadership Retreat",
  "Employee Wellness & Sports Events",
  "Product Launch / Brand Events",
  "Independence Day / Republic Day Celebrations",
  "COCKTAIL PARTY",
  "TEAM LUNCH / DINNER",
] as const;

type FormType = '' | 'villa' | 'lounge' | 'banquet' | 'nightclub' | 'catering';

const VENUE_LABEL: Record<Exclude<FormType, ''>, string> = {
  villa: 'Villa / Resort',
  lounge: 'Lounge',
  banquet: 'Banquet',
  nightclub: 'Night Club',
  catering: 'Catering',
};

const SOURCE_OPTIONS = ['Google', 'Instagram', 'Facebook', 'WhatsApp', 'Friend', 'Other'];

const dayFromDate = (iso: string): string => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { weekday: 'long' });
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  if (!y || !m || !d) return dateStr;
  return `${d}-${m}-${y}`;
};

const HR_PROBLEMS = [
  {
    num: "01",
    title: "Finding the right venue",
    desc: (
      <>
        Too many options, but difficult to find one that fits the{" "}
        <strong>budget, capacity, location and event requirement</strong>.
      </>
    ),
    solution: "We shortlist 3–5 verified corporate venues matching your exact headcount, location, vibe and budget in 30 minutes.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Getting multiple quotations",
    desc: (
      <>
        HR has to contact <strong>10–20 venues/vendors</strong> just to compare packages and prices.
      </>
    ),
    solution: "1 single enquiry gets you standardized, pre-packaged quotations directly on WhatsApp to compare side-by-side.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Unclear pricing & hidden costs",
    desc: (
      <>
        Taxes, service charges, corkage, décor, AV, minimum billing and other extras can make the{" "}
        <strong>final bill very different from the initial quote</strong>.
      </>
    ),
    solution: "100% transparent, all-inclusive per-person quotes with all taxes, AV, corkage & service fees locked in upfront.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Vendor coordination",
    desc: (
      <>
        Managing the venue, caterer, DJ, décor, photographer, anchor, entertainment and other vendors separately{" "}
        <strong>becomes a headache</strong>.
      </>
    ),
    solution: "Single point of contact: venue, DJ, food, bar, décor, anchor & AV bundled together under one coordination team.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Negotiating with vendors",
    desc: (
      <>
        HR often has to <strong>negotiate prices, inclusions, upgrades and cancellation terms individually</strong>.
      </>
    ),
    solution: "We leverage our volume corporate purchasing power to secure negotiated corporate pricing & free upgrades for you.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Checking availability",
    desc: (
      <>
        A venue may look perfect online but may <strong>not actually be available</strong> for the required date and time.
      </>
    ),
    solution: "Real-time slot verification: we only present options that are confirmed available and blocked for your exact dates.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    num: "07",
    title: "Budget pressure",
    desc: (
      <>
        HR has to deliver a memorable event while staying within a fixed{" "}
        <strong>per-person or total budget</strong>.
      </>
    ),
    solution: "Budget-first customization: tailored packages designed to deliver maximum food, bar & vibe without cost overruns.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
      </svg>
    ),
  },
  {
    num: "08",
    title: "Reliability & quality concerns",
    desc: (
      <>
        It's difficult to know whether a venue/vendor will <strong>actually deliver what was promised</strong>.
      </>
    ),
    solution: "Every venue is vetted for corporate standards with SLA guarantees, verified track records & site visits arranged.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    num: "09",
    title: "Last-minute changes",
    desc: (
      <>
        Guest count, menu, timings, décor or entertainment can change, creating <strong>additional coordination</strong>.
      </>
    ),
    solution: "Dedicated on-ground coordinator manages headcount shifts, diet requests & schedule tweaks seamlessly.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
  },
  {
    num: "10",
    title: "Too much time spent on event planning",
    desc: (
      <>
        HR's core job isn't event sourcing, yet they can end up spending{" "}
        <strong>days coordinating vendors, calls, quotations and follow-ups</strong>.
      </>
    ),
    solution: "Save 40+ hours of operational hassle. We handle the entire legwork so you look like a rockstar to your leadership.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

const BMCP_SOLUTIONS = [
  {
    num: "01",
    title: "One Enquiry. Multiple Curated Options.",
    desc: "Tell us your date, location, budget and team size—we shortlist suitable venues for you.",
    tag: "Curated Shortlists",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Save Hours of Venue Hunting",
    desc: "No calling 20–30 venues, chasing responses or comparing scattered WhatsApp quotes.",
    tag: "Zero Calling Hassle",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Corporate Events Are Our Specialty",
    desc: "We focus specifically on corporate parties, team outings, annual celebrations, offsites, R&R events and business gatherings.",
    tag: "100% Corporate Events",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Handpicked & Pre-Verified Venues",
    desc: "Get access to curated lounges, restaurants, nightclubs, banquets, resorts, villas and activity venues.",
    tag: "Pre-Verified & Inspected",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "Fast Venue Shortlisting",
    desc: "Get relevant venue options and packages quickly, with our team delivering curated options within 30 minutes.",
    tag: "Options in 30 Mins",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Transparent Pricing",
    desc: "Compare packages, inclusions and pricing upfront, making internal leadership approvals effortless.",
    tag: "Upfront Cost Breakdowns",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    num: "07",
    title: "Negotiated Corporate Packages",
    desc: "We work with venues to create packages around your budget, guest count, food, beverages and entertainment requirements.",
    tag: "Negotiated Bulk Rates",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    num: "08",
    title: "One Point of Contact",
    desc: "One team coordinates with the venue instead of making HR/Admin teams manage multiple vendors and venue managers.",
    tag: "1 Dedicated SPOC",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    num: "09",
    title: "End-to-End Event Support",
    desc: "Beyond the venue: food & beverage, DJ, entertainment, décor, branding, activities and vendor coordination can all be managed.",
    tag: "Complete Event Ops",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    num: "10",
    title: "From 20 to 2,000+ Guests",
    desc: "Solutions for small team celebrations as well as large annual parties, offsites and corporate gatherings.",
    tag: "20 to 2,000+ Capacity",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    ),
  },
  {
    num: "11",
    title: "Last-Minute Booking Support",
    desc: "When the event date is approaching fast, our priority team helps identify and secure available options on tight deadlines.",
    tag: "Express SOS Availability",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    num: "12",
    title: "Local Venue Expertise",
    desc: "Get recommendations based on location, budget, event format and the experience you want—not just a generic directory listing.",
    tag: "Hyperlocal City Intel",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export default function BMCPLanding() {
  const router = useRouter();

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');

  const isValidPhone = (p: string) => p.replace(/\D/g, '').length >= 10;

  const handleSendOtp = async (): Promise<boolean> => {
    if (!isValidPhone(formData.whatsappNumber) || otpLoading) return false;
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.whatsappNumber }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpVerified(false);
        setOtpCode('');
        return true;
      } else {
        setOtpError(data.message || 'Failed to send OTP');
        return false;
      }
    } catch {
      setOtpError('Network error sending OTP');
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string): Promise<boolean> => {
    const targetOtp = typeof codeToVerify === 'string' ? codeToVerify : otpCode;
    if (!targetOtp || !targetOtp.trim() || otpVerifying) return false;
    setOtpVerifying(true);
    setOtpError('');
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.whatsappNumber, otp: targetOtp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpVerified(true);
        setOtpError('');
        return true;
      } else {
        setOtpError(data.message || 'Invalid OTP');
        return false;
      }
    } catch {
      setOtpError('Network error verifying OTP');
      return false;
    } finally {
      setOtpVerifying(false);
    }
  };

  const [formData, setFormData] = useState({
    occasion: '',
    name: '',
    email: '',
    whatsappNumber: '',
    source: '',
  });
  const [utmData, setUtmData] = useState({
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    gclid: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMsg, setFormMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWaPopup, setShowWaPopup] = useState(false);
  const [waForm, setWaForm] = useState({ name: '', phone: '', event: '' });
  const SHOW_EXPERT_CHAT = false; // Set to true when ready to display "Talk to Expert"
  const [tidioNotice, setTidioNotice] = useState(false);

  const handleOpenExpertChat = () => {
    if (typeof window !== "undefined" && (window as any).tidioChatApi) {
      (window as any).tidioChatApi.show();
      (window as any).tidioChatApi.open();
    } else {
      setTidioNotice(true);
      setTimeout(() => setTidioNotice(false), 5500);
    }
  };

  const userGeo = useGeoLocation();
  const visitorTracked = useRef(false);
  const testimonialRowRef = useRef<HTMLDivElement>(null);

  const isSubmittedRef = useRef(false);
  const partialSentRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const formDataRef = useRef(formData);
  const utmDataRef = useRef(utmData);
  const userGeoRef = useRef(userGeo);

  // Sync refs to avoid stale state in event listeners
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    utmDataRef.current = utmData;
  }, [utmData]);

  useEffect(() => {
    userGeoRef.current = userGeo;
  }, [userGeo]);

  const sendPartialLead = () => {
    if (partialSentRef.current || isSubmittedRef.current) return;
    const f = formDataRef.current;
    if (!f.name || !f.whatsappNumber || !isValidPhone(f.whatsappNumber)) return;

    partialSentRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const uGeo = userGeoRef.current;
    const uUtm = utmDataRef.current;

    fetch('/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        isPartial: true,
        occasion: f.occasion,
        name: f.name,
        phone: f.whatsappNumber,
        email: f.email,
        source: f.source || 'Website',
        whatsapp: true,
        event: f.occasion || 'Corporate Party Enquiry',
        city: 'Mumbai',
        area: '',
        venueDate: '',
        userLocation: uGeo ? `${uGeo.city}, ${uGeo.region}, ${uGeo.country}` : 'Unknown',
        userPincode: uGeo ? uGeo.pincode : 'Unknown',
        userIp: uGeo ? uGeo.ip : 'Unknown',
        ...uUtm,
      }),
    }).catch(() => {});
  };

  useEffect(() => {
    if (isValidPhone(formData.whatsappNumber) && formData.name && !isSubmittedRef.current && !partialSentRef.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        sendPartialLead();
      }, 45000);
    }
  }, [formData.whatsappNumber, formData.name]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendPartialLead();
      }
    };
    const handleBeforeUnload = () => {
      sendPartialLead();
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Capture UTM parameters from URL on mount and auto-fill Source dropdown
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const src = p.get('utm_source') || '';
    const captured = {
      utmSource:   src,
      utmMedium:   p.get('utm_medium')   || '',
      utmCampaign: p.get('utm_campaign') || '',
      utmTerm:     p.get('utm_term')     || '',
      utmContent:  p.get('utm_content')  || '',
      gclid:       p.get('gclid')        || '',
    };
    setUtmData(captured);

    // Map utm_source to the Source dropdown value
    const srcLower = src.toLowerCase();
    const mapped =
      srcLower.includes('google')    ? 'Google'    :
      srcLower.includes('instagram') ? 'Instagram' :
      srcLower.includes('facebook')  ? 'Facebook'  :
      srcLower.includes('whatsapp')  ? 'WhatsApp'  :
      srcLower.includes('friend') || srcLower.includes('referral') ? 'Friend' :
      src ? 'Other' : '';

    if (mapped) {
      setFormData(prev => ({ ...prev, source: mapped }));
    }
  }, []);

  // Passive visitor analytics — fires once when geo resolves, zero UI impact
  useEffect(() => {
    if (!userGeo || visitorTracked.current) return;
    visitorTracked.current = true;
    fetch('/api/track-visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ip: userGeo.ip,
        city: userGeo.city,
        region: userGeo.region,
        country: userGeo.country,
        pincode: userGeo.pincode,
        pageUrl: window.location.href,
        referrer: document.referrer || 'Direct',
        userAgent: navigator.userAgent,
      }),
    }).catch(() => { });
  }, [userGeo]);

  const handleWaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowWaPopup(false);
    const snapshot = { ...waForm };
    setWaForm({ name: '', phone: '', event: '' });
    fetch('/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isWaInquiry: true,
        name: snapshot.name,
        phone: snapshot.phone,
        event: snapshot.event || 'WhatsApp Inquiry',
        city: 'Mumbai',
        area: '',
        date: '',
        whatsapp: true,
        userLocation: userGeo ? `${userGeo.city}, ${userGeo.region}, ${userGeo.country}` : 'Unknown',
        userPincode: userGeo ? userGeo.pincode : 'Unknown',
        userIp: userGeo ? userGeo.ip : 'Unknown',
        ...utmData,
      }),
    }).catch(() => { });
    router.push('/thank-you?chat=1');
  };

  const isFormValid = () => {
    const f = formData;
    return !!(
      f.occasion &&
      f.name &&
      f.name.trim() &&
      f.email &&
      f.email.includes('@') &&
      f.whatsappNumber &&
      isValidPhone(f.whatsappNumber)
    );
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    if (!otpVerified) {
      if (otpSent) {
        if (!otpCode || !otpCode.trim()) {
          setOtpError('Please enter the OTP code sent to your phone.');
          return;
        }
        const verified = await handleVerifyOtp(otpCode);
        if (!verified) return;
      } else {
        setOtpError('Please verify your phone number with the OTP code.');
        await handleSendOtp();
        return;
      }
    }

    isSubmittedRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setFormStatus('submitting');
    setFormMsg('');
    try {
      const f = formData;
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: f.occasion,
          name: f.name,
          phone: f.whatsappNumber,
          email: f.email,
          source: f.source || 'Website',
          whatsapp: true,
          event: f.occasion,
          city: 'Mumbai',
          area: '',
          venueDate: '',
          userLocation: userGeo ? `${userGeo.city}, ${userGeo.region}, ${userGeo.country}` : 'Unknown',
          userPincode: userGeo ? userGeo.pincode : 'Unknown',
          userIp: userGeo ? userGeo.ip : 'Unknown',
          ...utmData,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData({
          occasion: '',
          name: '',
          whatsappNumber: '',
          email: '',
          source: '',
        });
        setOtpSent(false);
        setOtpCode('');
        setOtpVerified(false);
        router.push('/thank-you');
      } else {
        setFormStatus('error');
        setFormMsg(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormStatus('error');
      setFormMsg('Network error. Please try again or call us directly.');
    }
  };

  const venues: Venue[] = [
    { name: "Nightclubs", img: "/images/what-you-can-book/nightclubs.png", tags: ["DJ & Music", "Bar Setup"], desc: "High-energy venues with DJ, bar, and dance floor — ideal for team parties, R&R nights, and celebrations.", capacity: "30–200+ guests" },
    { name: "Water Parks", img: "/images/what-you-can-book/water-parks.png", tags: ["Outdoor Fun", "Team Outing"], desc: "Thrill-filled day outings with water slides, wave pools, and team-building activities.", capacity: "50–1000+ guests" },
    { name: "Villas", img: "/images/what-you-can-book/villas.png", tags: ["Offsites", "Weekend Getaway"], desc: "Luxury private villas and resorts for offsites, leadership retreats, and overnight stays.", capacity: "20–150 guests" },
    { name: "Banquets", img: "/images/what-you-can-book/banquets.png", tags: ["Large Events", "AV Setup"], desc: "Spacious banquet halls with stage, AV, and flexible seating — perfect for annual parties and award nights.", capacity: "100–2000+ guests" },
    { name: "Sports Bars", img: "/images/what-you-can-book/sports-bars.png", tags: ["Arcade & Games", "Bar Setup"], desc: "Interactive venues with bowling, arcade games, screens, and craft beers for casual team hangouts.", capacity: "25–150 guests" },
    { name: "Yacht", img: "/images/what-you-can-book/private-YACHT.png", tags: ["Exclusive", "Sunset Cruise"], desc: "Luxury private yacht charter for executive retreats, client entertainment, and milestone celebrations.", capacity: "20–100 guests" },
    { name: "Caterings", img: "/images/what-you-can-book/catering.png", tags: ["Live Counters", "Custom Menu"], desc: "Full-service corporate catering with multi-cuisine menus, live food stations, and bar service.", capacity: "50–2000+ guests" },
    { name: "Open Lawn", img: "/images/what-you-can-book/open-lawn.png", tags: ["Outdoor", "Large Gatherings"], desc: "Expansive open-air lawns for corporate sports days, annual galas, and mega team celebrations.", capacity: "100–2000+ guests" },
  ];

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: D, overflowX: "hidden" }}>
      <style>{`
        .hamburger-btn { display: none; }
        
        /* Smooth reveal animation for progressive form disclosure */
        @keyframes revealForm {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal-section {
          animation: revealForm 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Make entire date inputs clickable natively, and style custom calendar icon */
        input[type="date"] {
          position: relative !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23111827' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 100% !important;
          opacity: 0 !important;
          cursor: pointer !important;
          z-index: 2 !important;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 18px;
        }
        @media (max-width: 1100px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 14px !important;
          }
        }
        .hr-problems-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        @media (min-width: 1025px) {
          .hr-problems-grid > div:last-child {
            grid-column: 2;
          }
        }
        .bmcp-solutions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        .bmcp-promise-text {
          white-space: nowrap;
        }
        @media (max-width: 992px) {
          .bmcp-promise-text {
            white-space: normal !important;
          }
        }
        @media (max-width: 1024px) {
          .hr-problems-grid,
          .bmcp-solutions-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 18px !important;
          }
        }
        @media (max-width: 768px) {
          .nav-links, .nav-actions { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .section-pad { padding: 24px 16px !important; }
          .hero-section { min-height: auto !important; padding: 28px 0 36px !important; background: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/images/home_banner.png') center/cover !important; }
          .hero-container {
            padding: 0 16px !important;
            gap: 20px !important;
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .hero-text { min-width: 0 !important; flex: 1 1 100% !important; }
          .hero-form-card { flex: 1 1 100% !important; max-width: 100% !important; }
          .hero-badges { flex-wrap: wrap !important; gap: 8px !important; }
          .hero-badges > div { font-size: 11px !important; }

          /* Why Choose Us - 2 column grid */
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .features-grid > div {
            padding: 20px 16px !important;
          }

          /* HR Problems - 1 column on mobile */
          .hr-problems-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }

          /* BMCP Solutions - 1 column on mobile */
          .bmcp-solutions-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }

          .venue-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch;
            padding: 0 0 12px 0 !important; /* Removed extra padding */
            scrollbar-width: none;
            gap: 16px !important;
          }
          .venue-grid::-webkit-scrollbar { display: none; }
          .venue-grid > * {
            width: 80% !important;
            min-width: 220px !important;
            flex-shrink: 0 !important;
            scroll-snap-align: start !important;
          }

          /* Steps - zigzag grid: [1][2] / [4][3] / [5] */
          .steps-line { display: none !important; }
          .steps-container {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
            position: relative !important;
          }
          .steps-container > div {
            flex-basis: auto !important;
            max-width: none !important;
            background: #fff;
            border-radius: 14px;
            padding: 24px 16px;
            border: 1px solid #E5E7EB;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            position: relative;
          }
          /* Swap 3 and 4 for zigzag */
          .steps-container > div:nth-child(3) { order: 2 !important; }
          .steps-container > div:nth-child(4) { order: 1 !important; }
          .steps-container > div:last-child {
            grid-column: 1 / -1;
            max-width: 50%;
            margin: 0 auto;
            order: 3 !important;
          }
          /* 1→2: horizontal right */
          .steps-container > div:nth-child(1)::after {
            content: '';
            position: absolute;
            top: 38px;
            right: -16px;
            width: 16px;
            border-top: 2px dashed #D1D5DB;
            z-index: 2;
          }
          /* 2→3: vertical down (right side) */
          .steps-container > div:nth-child(2)::after {
            content: '';
            position: absolute;
            bottom: -16px;
            left: 50%;
            transform: translateX(-50%);
            height: 16px;
            border-left: 2px dashed #D1D5DB;
            z-index: 2;
          }
          /* 3→4: horizontal left (3 is on right visually) */
          .steps-container > div:nth-child(3)::after {
            content: '';
            position: absolute;
            top: 38px;
            left: -16px;
            width: 16px;
            border-top: 2px dashed #D1D5DB;
            z-index: 2;
          }
          /* 4→5: vertical down (4 is on left visually) */
          .steps-container > div:nth-child(4)::after {
            content: '';
            position: absolute;
            bottom: -16px;
            left: 50%;
            transform: translateX(-50%);
            height: 16px;
            border-left: 2px dashed #D1D5DB;
            z-index: 2;
          }

          /* Comparison Board */
          .comparison-board {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .comparison-board > div {
            padding: 28px 20px !important;
          }

          .testimonials-row {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            justify-content: flex-start !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch;
            padding: 0 0 12px 0 !important; /* Removed extra padding */
            scrollbar-width: none;
            gap: 16px !important;
          }
          .testimonials-row::-webkit-scrollbar { display: none; }
          .testimonials-row { scrollbar-width: none; -ms-overflow-style: none; }
          .testimonials-row > div {
            width: 80% !important;
            min-width: 220px !important;
            flex-shrink: 0 !important;
            scroll-snap-align: start !important;
          }

          /* Comparison Matrix - Horizontal scroll with sticky entity column on mobile */
          .matrix-scroll-hint {
            display: flex !important;
          }
          .matrix-scroll-wrap {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }

          /* CTA section */
          .cta-section {
            padding: 50px 16px !important;
          }
          .cta-section h2 {
            font-size: clamp(26px, 7vw, 34px) !important;
            line-height: 1.2 !important;
            margin-bottom: 16px !important;
          }
          .cta-section h2 br { display: none; }
          .cta-section .cta-subtitle {
            font-size: 15px !important;
            margin-bottom: 28px !important;
          }
          .cta-section .cta-subtitle br { display: none; }
          .cta-section button {
            padding: 16px 32px !important;
            font-size: 15px !important;
            border-radius: 10px !important;
            width: 100% !important;
            max-width: 340px !important;
          }
          .cta-section .cta-trust {
            flex-direction: row !important;
            gap: 20px !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
          }

          /* Navbar */
          .main-nav { padding: 10px 16px !important; }

          /* Footer */
          .footer-wrap { padding: 40px 0 24px !important; }
          .footer-inner { padding: 0 16px !important; }
          .footer-cols {
            gap: 24px !important;
            flex-direction: column !important;
          }
          .footer-cols > div { flex: 1 1 100% !important; min-width: 0 !important; }
          .footer-links-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
            flex: 1 1 100% !important;
          }
          .footer-links-row > div { flex: unset !important; }
          .footer-bottom-bar {
            flex-direction: column !important;
            text-align: center !important;
            gap: 12px !important;
            padding-top: 20px !important;
            align-items: center !important;
          }
          .footer-bottom-bar > div {
            justify-content: center !important;
            flex-wrap: wrap !important;
            gap: 16px !important;
          }
          .footer-bottom-bar > a {
            justify-content: center !important;
          }
          .whatsapp-fab {
            bottom: 20px !important;
            right: 16px !important;
            width: 52px !important;
            height: 52px !important;
          }

          /* Trusted by Leading Corporates - 2 column grid on mobile */
          .trusted-section {
            padding: 40px 16px !important;
          }
          .trusted-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .trusted-grid > div {
            padding: 14px 12px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          }
          .trusted-grid > div:nth-child(2n-1) {
            border-right: 1px solid rgba(255,255,255,0.08) !important;
          }
          .trusted-grid > div:nth-last-child(-n+2) {
            border-bottom: none !important;
          }
        }
        @keyframes mobileMenuSlide {
          from { opacity: 0; transform: translateY(-100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileMenuFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* NAV */}
      <nav className="main-nav" style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${B}`, padding: "0" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "12px clamp(20px, 6vw, 160px)", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", boxSizing: "border-box" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src="/images/bmcp-logo-img.png" alt="Book My Corporate Party" style={{ height: 42, width: "auto", objectFit: "contain" }} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex", gap: 24, marginRight: 20 }} className="nav-links">
              {[
                { name: "Why Us", href: "#why-us" },
                { name: "Venues", href: "#venues" },
                { name: "Solutions", href: "#solutions" },
                { name: "Process", href: "#how-it-works" },
                { name: "FAQ", href: "#faq" }
              ].map(link => (
                <a key={link.href} href={link.href} style={{ fontSize: 13, fontWeight: 600, color: D, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = R} onMouseLeave={e => e.currentTarget.style.color = D}>{link.name}</a>
              ))}
            </div>
            <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ color: R, display: "flex", alignItems: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <a href="tel:+919333749333" style={{ fontSize: 13.5, color: D, textDecoration: "none", fontWeight: 700, letterSpacing: "0.2px" }}>+91 9333 74 9333</a>
            </div>
            <button className="nav-actions" onClick={() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: R, color: "#fff", border: "none", borderRadius: 7, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Get Started →</button>
            <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, flexDirection: "column", gap: 5, alignItems: "center", justifyContent: "center" }}>
              <span style={{ display: "block", width: 22, height: 2, background: D, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <span style={{ display: "block", width: 22, height: 2, background: D, borderRadius: 2, transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: 22, height: 2, background: D, borderRadius: 2, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "#fff", zIndex: 150, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "mobileMenuSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 32, cursor: "pointer", color: D, fontWeight: 300 }}>✕</button>
          {[
            { name: "Why Us", href: "#why-us" },
            { name: "Venues", href: "#venues" },
            { name: "Solutions", href: "#solutions" },
            { name: "Process", href: "#how-it-works" },
            { name: "FAQ", href: "#faq" }
          ].map((link, i) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ fontSize: 28, fontWeight: 700, color: D, textDecoration: "none", padding: "24px 0", width: "80%", textAlign: "center", borderBottom: `1px solid ${B}`, animation: `mobileMenuFade 0.5s ${0.1 * (i + 1)}s both`, fontFamily: "var(--font-playfair), serif" }}>{link.name}</a>
          ))}
          <div style={{ marginTop: 48, animation: "mobileMenuFade 0.5s 0.5s both" }}>
            <button onClick={() => { setMenuOpen(false); setTimeout(() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' }), 300); }} style={{ background: R, color: "#fff", border: "none", borderRadius: 12, padding: "18px 52px", fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif" }}>Get Started →</button>
          </div>
          <a href="tel:+919333749333" style={{ marginTop: 28, fontSize: 16, color: G, textDecoration: "none", animation: "mobileMenuFade 0.5s 0.6s both", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            +91 9333 74 9333
          </a>
        </div>
      )}

      {/* ===== 1. HERO + FORM ===== */}
      <section className="hero-section" style={{
        background: `linear-gradient(RGBA(0, 0, 0, 0.4), RGBA(0, 0, 0, 0.4)), url('/images/home_banner.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        alignItems: "center",
        padding: "28px 0",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -120, right: -80, width: 420, height: 420, background: `radial-gradient(circle, rgba(192,57,43,0.12) 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
        <div className="hero-container" style={{ position: "relative", zIndex: 2, width: "100%", padding: "0 clamp(100px, 8vw, 200px)", display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap", boxSizing: "border-box" }}>
          <div className="hero-text" style={{ flex: "1 1 520px", paddingTop: 8 }}>
            <Badge text="STOP CHASING VENUES." />
            <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(32px, 4.8vw, 54px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "16px 0 14px" }}>
              Get 5 Corporate Party Quotes{" "}
              <span style={{ color: "#FF5252" }}>in 30 Minutes.</span>
            </h1>
            <p style={{ fontSize: 17, color: "#E0E0E0", lineHeight: 1.65, margin: "0 0 20px", maxWidth: 540 }}>
              Tell us your event requirement. We’ll shortlist suitable venues, packages &amp; pricing for you.
            </p>
            
            {/* Occasions List (Clean natural text, not card-like) */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 12px", margin: "0 0 16px", fontSize: 15, color: "#E2E8F0", fontWeight: 600, letterSpacing: "0.2px" }}>
              {["Annual Day", "Team Offsite", "Diwali Party", "Family Day", "R&R"].map((occ, i, arr) => (
                <span key={occ} style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                  <span>{occ}</span>
                  {i < arr.length - 1 && <span style={{ color: "#FF5252", fontSize: 13, opacity: 0.9 }}>•</span>}
                </span>
              ))}
            </div>

            {/* Stats Line (Clean natural inline text with dividers, not card-like) */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              margin: "0 0 24px",
              flexWrap: "wrap",
              color: "#fff",
              fontSize: 14.5,
              fontWeight: 700,
              letterSpacing: "0.2px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9h1M9 13h1M9 17h1"/></svg>
                <span>1000+ Venues</span>
              </div>
              <span style={{ color: "rgba(255, 255, 255, 0.4)", fontWeight: 400 }}>|</span>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span>500+ Brands</span>
              </div>
              <span style={{ color: "rgba(255, 255, 255, 0.4)", fontWeight: 400 }}>|</span>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>
                <span>One Point of Contact</span>
              </div>
            </div>

            {/* Left CTA Action */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  const formEl = document.getElementById('hero-form');
                  if (formEl) {
                    formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    const occasionEl = document.getElementById('hero-occasion') as HTMLSelectElement | null;
                    if (occasionEl) {
                      occasionEl.focus();
                      try {
                        if (typeof (occasionEl as any).showPicker === 'function') (occasionEl as any).showPicker();
                      } catch {}
                    }
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "linear-gradient(135deg, #A8201A 0%, #80281F 100%)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.22)",
                  borderRadius: 10,
                  padding: "14px 26px",
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "0.35px",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(128, 40, 31, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.25)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #C22D26 0%, #8E2319 100%)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(128, 40, 31, 0.58), inset 0 1px 0 rgba(255, 255, 255, 0.35)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #A8201A 0%, #80281F 100%)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(128, 40, 31, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.25)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>GET 5 FREE QUOTES ON WHATSAPP →</span>
              </button>
              <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.8)", fontStyle: "italic", paddingLeft: 2 }}>
                Free for HR &amp; Admin teams • Takes 60 seconds • No obligation
              </div>
            </div>
          </div>
          {/* Form */}
          <div id="hero-form" className="hero-form-card" style={{ position: "relative", zIndex: 10, flex: "1 1 360px", background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}>

            {formStatus === 'success' ? (
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <div style={{ width: 60, height: 60, background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 700, color: D }}>Request Received!</h3>
                <p style={{ fontSize: 13.5, color: G, lineHeight: 1.6, margin: "0 0 22px" }}>{formMsg || "Thank you! Our corporate party expert will reach out within 30 minutes with curated options."}</p>
                <button onClick={() => { setFormStatus('idle'); }} style={{ background: "none", color: R, border: `1px solid ${R}`, borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Submit Another</button>
              </div>
            ) : (
              <form key="hero-form" onSubmit={handleSubmit}>
                <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: D, fontFamily: "var(--font-playfair), serif" }}>
                  Get Venue Options Free
                </h3>
                <p style={{ margin: "0 0 16px", fontSize: 12, color: G }}>
                  Free for HR &amp; Admin teams. Options within 30 minutes.
                </p>

                {/* 1. What u want to book? */}
                <div style={{ marginBottom: 12 }}>
                  <label
                    htmlFor="hero-occasion"
                    onClick={() => {
                      const sel = document.getElementById('hero-occasion') as HTMLSelectElement | null;
                      if (sel) {
                        sel.focus();
                        try {
                          if (typeof (sel as any).showPicker === 'function') (sel as any).showPicker();
                        } catch {}
                      }
                    }}
                    style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4, cursor: "pointer" }}
                  >
                    What u want to book? *
                  </label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <select
                      id="hero-occasion"
                      required
                      value={formData.occasion}
                      onChange={e => setFormData({ ...formData, occasion: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "10px 36px 10px 12px",
                        border: `1px solid ${formData.occasion ? R : B}`,
                        borderRadius: 7,
                        fontSize: 13,
                        outline: "none",
                        boxSizing: "border-box",
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        background: "#fff",
                        color: formData.occasion ? D : "#9CA3AF",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                        cursor: "pointer",
                        position: "relative",
                        zIndex: 2,
                        transition: "border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = R}
                      onBlur={e => e.target.style.borderColor = formData.occasion ? R : B}
                    >
                      <option value="" disabled hidden>Select venue type</option>
                      {OCCASIONS.map((occ) => (
                        <option key={occ} value={occ} style={{ color: D }}>{occ}</option>
                      ))}
                    </select>
                    <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 3, display: "flex", alignItems: "center", color: "#6B7280" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>

                {/* 2. NAME */}
                <div style={{ marginBottom: 12 }}>
                  <label htmlFor="hero-name" style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>
                    Name *
                  </label>
                  <input
                    id="hero-name"
                    required
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: `1px solid ${B}`,
                      borderRadius: 7,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={e => e.target.style.borderColor = R}
                    onBlur={e => e.target.style.borderColor = B}
                  />
                </div>

                {/* 3. EMAIL */}
                <div style={{ marginBottom: 12 }}>
                  <label htmlFor="hero-email" style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>
                    Email *
                  </label>
                  <input
                    id="hero-email"
                    required
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: `1px solid ${B}`,
                      borderRadius: 7,
                      fontSize: 13,
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      transition: "border-color 0.2s"
                    }}
                    onFocus={e => e.target.style.borderColor = R}
                    onBlur={e => e.target.style.borderColor = B}
                  />
                </div>

                {/* 4. NUMBER (WhatsApp / Phone) */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, minHeight: 14 }}>
                    <label htmlFor="hero-phone" style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, lineHeight: "14px" }}>
                      Number *
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                    <input
                      id="hero-phone"
                      required
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.whatsappNumber}
                      onChange={e => {
                        setFormData({ ...formData, whatsappNumber: e.target.value });
                        setOtpSent(false);
                        setOtpVerified(false);
                        setOtpCode('');
                        setOtpError('');
                      }}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: 40,
                        padding: "9px 12px",
                        border: `1px solid ${B}`,
                        borderRadius: 7,
                        fontSize: 13,
                        outline: "none",
                        boxSizing: "border-box",
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = R}
                      onBlur={e => e.target.style.borderColor = B}
                    />
                    <button
                      type="button"
                      id="hero-send-otp-btn"
                      onClick={handleSendOtp}
                      disabled={!isValidPhone(formData.whatsappNumber) || otpSent || otpLoading}
                      style={{
                        width: 96,
                        minWidth: 96,
                        maxWidth: 96,
                        flexShrink: 0,
                        height: 40,
                        background: (isValidPhone(formData.whatsappNumber) && !otpSent && !otpLoading) ? R : "#F3F4F6",
                        color: (isValidPhone(formData.whatsappNumber) && !otpSent && !otpLoading) ? "#fff" : "#9CA3AF",
                        border: `1px solid ${(isValidPhone(formData.whatsappNumber) && !otpSent && !otpLoading) ? R : "#E5E7EB"}`,
                        borderRadius: 7,
                        padding: 0,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: (isValidPhone(formData.whatsappNumber) && !otpSent && !otpLoading) ? "pointer" : "not-allowed",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxSizing: "border-box"
                      }}
                    >
                      {otpLoading ? "Sending..." : otpSent ? "Sent ✓" : "Send OTP"}
                    </button>
                  </div>
                </div>

                {/* 5. OTP */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, minHeight: 14 }}>
                    <label htmlFor="hero-otp" style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, lineHeight: "14px" }}>
                      OTP *
                    </label>
                    {otpSent && !otpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        style={{
                          background: "none",
                          border: "none",
                          color: R,
                          fontSize: 10.5,
                          fontWeight: 600,
                          cursor: otpLoading ? "not-allowed" : "pointer",
                          padding: 0,
                          textDecoration: "underline",
                          lineHeight: "14px"
                        }}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                    <input
                      id="hero-otp"
                      type="text"
                      maxLength={6}
                      placeholder={otpSent ? "Enter 6-digit OTP" : "Enter number & click Send OTP"}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      disabled={otpVerified}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: 40,
                        padding: "9px 12px",
                        border: `1px solid ${otpVerified ? "#16A34A" : B}`,
                        borderRadius: 7,
                        fontSize: 13,
                        outline: "none",
                        boxSizing: "border-box",
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        background: otpVerified ? "#F0FDF4" : "#fff",
                        color: otpVerified ? "#166534" : D,
                        transition: "border-color 0.2s"
                      }}
                      onFocus={e => e.target.style.borderColor = otpVerified ? "#16A34A" : R}
                      onBlur={e => e.target.style.borderColor = otpVerified ? "#16A34A" : B}
                    />
                    <button
                      type="button"
                      id="hero-verify-otp-btn"
                      onClick={() => handleVerifyOtp()}
                      disabled={otpVerified || !otpCode || otpVerifying}
                      style={{
                        width: 96,
                        minWidth: 96,
                        maxWidth: 96,
                        flexShrink: 0,
                        height: 40,
                        background: otpVerified ? "#16A34A" : (!otpCode || otpVerifying) ? "#F3F4F6" : "#16A34A",
                        color: (otpVerified || (otpCode && !otpVerifying)) ? "#fff" : "#9CA3AF",
                        border: `1px solid ${(otpVerified || otpCode) ? "#16A34A" : "#E5E7EB"}`,
                        borderRadius: 7,
                        padding: 0,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: (otpVerified || !otpCode || otpVerifying) ? "default" : "pointer",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxSizing: "border-box"
                      }}
                    >
                      {otpVerifying ? "..." : otpVerified ? "Verified ✓" : "Verify"}
                    </button>
                  </div>
                  {otpError && (
                    <span style={{ display: "block", color: "#DC2626", fontSize: 11, fontWeight: 600, marginTop: 4 }}>{otpError}</span>
                  )}
                  {otpVerified && (
                    <span style={{ display: "block", color: "#16A34A", fontSize: 11, fontWeight: 600, marginTop: 4 }}>✓ Phone Verified</span>
                  )}
                </div>

                {formStatus === 'error' && (
                  <p style={{ fontSize: 12, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, padding: "9px 12px", margin: "0 0 10px" }}>{formMsg}</p>
                )}

                {/* 6. SUBMIT */}
                <button
                  type="submit"
                  id="hero-submit-btn"
                  disabled={formStatus === 'submitting' || !isFormValid()}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: (formStatus === 'submitting' || !isFormValid()) ? "#F3F4F6" : R,
                    color: (formStatus === 'submitting' || !isFormValid()) ? "#9CA3AF" : "#fff",
                    border: (formStatus === 'submitting' || !isFormValid()) ? "1px solid #E5E7EB" : "none",
                    borderRadius: 8,
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: (formStatus === 'submitting' || !isFormValid()) ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    boxShadow: (formStatus === 'submitting' || !isFormValid()) ? "none" : "0 4px 14px rgba(128,40,31,0.25)",
                    transition: "all 0.2s"
                  }}
                >
                  {formStatus === 'submitting' ? 'Submitting...' : 'GET 5 FREE QUOTES ON WHATSAPP →'}
                </button>
                <p style={{ fontSize: 11, color: G, fontStyle: "italic", textAlign: "center", margin: "8px 0 4px", fontWeight: 500 }}>
                  Free for HR &amp; Admin teams • Takes 60 seconds • No obligation
                </p>
                <p style={{ fontSize: 10, color: "#999", textAlign: "center", margin: "4px 0 0" }}>
                  By clicking submit, you accept our <Link href="/terms" style={{ color: "#999", textDecoration: "underline" }}>Terms &amp; Conditions</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ===== COMPANY AUTO LOGO MARQUEE SLIDER ===== */}
      <CompanyLogoSlider />

      {/* ===== 2. WHY CHOOSE US ===== */}
      <Sec bg="#FAFAFA" id="why-us">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(26px, 3.5vw, 32px)", margin: "0 0 8px" }}>Why HR and Admin Teams Choose <span style={{ color: R }}>BookMyCorporateParty.com</span></h2>
          <p style={{ fontSize: 15, color: G, maxWidth: 520, margin: "0 auto" }}>Corporate-only. Curated. Handled end-to-end.</p>
        </div>
        <div className="features-grid">
          {[
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, title: "Save Time", desc: "We do the venue research for you." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>, title: "Save Money", desc: "Access negotiated corporate packages." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>, title: "Reduce Hassle", desc: "One point of contact from enquiry to execution." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>, title: "Choose With Confidence", desc: "Curated and pre-verified venues." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>, title: "Compare Easily", desc: "Pricing, packages, capacity and inclusions in one place." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>, title: "Book Faster", desc: "Get shortlisted options quickly." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>, title: "Customize Your Event", desc: "Food, drinks, DJ, décor, activities and branding." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, title: "Handle Any Group Size", desc: "From intimate team gatherings to large corporate celebrations." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><polyline points="9 15 11 17 15 13" /></svg>, title: "Make Approvals Easier", desc: "Clear proposals and transparent pricing." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>, title: "Focus on Your Team", desc: "We handle the coordination; you enjoy the event." },
          ].map((b, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "24px 16px", border: `1px solid ${B}`, textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ color: R, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                {b.icon}
              </div>
              <h4 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: D }}>{b.title}</h4>
              <p style={{ margin: 0, fontSize: 13, color: G, lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        {/* The BMCP Proposition Text */}
        <div style={{
          marginTop: 28,
          textAlign: "center",
          padding: "0 16px"
        }}>
          <p
            className="bmcp-promise-text"
            style={{
              margin: 0,
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "clamp(14px, 1.35vw, 16px)",
              fontWeight: 500,
              color: D,
              lineHeight: 1.6,
              textAlign: "center",
              width: "100%"
            }}
          >
            You tell us the date, budget and guest count — we find the venue, negotiate the package, and coordinate the event.
          </p>
        </div>
      </Sec>

      {/* ===== PREMIUM SCROLLING TICKER ===== */}
      <div style={{ background: R, padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", position: "relative" }}>
        <style>{`
          @keyframes scrollTicker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .ticker-content { display: flex; white-space: nowrap; animation: scrollTicker 30s linear infinite; width: max-content; }
        `}</style>
        <div className="ticker-content">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 60, paddingRight: 60 }}>
              {[
                "500+ Brands Served", "30-Min Venue Matching", "Free for HR Teams",
                "DJ · Bar · AV Sorted", "Last-Minute Bookings OK", "Site Visits Arranged"
              ].map((text, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#fff" }}>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 9 }}>◆</span>
                  {text}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== WHAT WE DELIVER FOR CORPORATES ===== */}
      <Sec id="deliver" style={{ padding: "32px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 32, padding: "0 20px" }}>
          <Badge text="What We Deliver For Corporates" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "14px 0 8px" }}>
            What We Deliver For <span style={{ color: R }}>Corporates</span>
          </h2>
          <p style={{ fontSize: 15, color: G, maxWidth: 580, margin: "0 auto" }}>
            Explore how we bring corporate celebrations to life with curated venues, grand setups, and seamless execution.
          </p>
        </div>
        <DeliverSlider />
      </Sec>

      {/* ===== 3. VENUE CARDS ===== */}
      <Sec id="venues">
        <style>{`
          .venue-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 22px;
          }
          @media (max-width: 1024px) {
            .venue-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 640px) {
            .venue-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Badge text="WHAT YOU CAN BOOK?" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "14px 0 8px" }}>
            www.BookMyCorporateParty.com
          </h2>
          <p style={{ fontSize: 15, color: G, maxWidth: 520, margin: "0 auto" }}>
            From 20 to 2000+ guests
          </p>
        </div>
        <div className="venue-grid">
          {venues.map((v, i) => <VenueCard key={i} v={v} />)}
        </div>
        <p style={{ textAlign: "center", color: G, fontSize: 13, marginTop: 28, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Mumbai · Navi Mumbai · Thane · Pune · Goa · Delhi · Bangalore · Hyderabad · Chennai
        </p>
      </Sec>

      {/* ===== TRUSTED BY LEADING CORPORATES ===== */}
      {/* ===== TRUSTED BY LEADING CORPORATES (COMMENTED OUT) =====
      <section className="trusted-section" style={{ background: R, position: "relative", overflow: "hidden", padding: "60px clamp(100px, 8vw, 200px)" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.5px", lineHeight: 1.15, textTransform: "uppercase" }}>
            Trusted by Leading{" "}
            <span style={{ color: "#FFD700" }}>Corporates</span>
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0 }}>
            500+ companies across India rely on us for their team celebrations
          </p>
        </div>

        <div className="trusted-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, width: "100%" }}>
          {[
            ["We Work", "Indus Valley", "Morgan Stanley"],
            ["Hyundai", "JP Morgan", "KPMG"],
            ["Mphasis", "Naukri.com", "Hindustan Unilever"],
            ["Red Hat", "Amazon", "BNY Mellon"],
            ["JSW", "Cisco", "IBM"],
            ["Mphasis", "InfoBeans", "Cybage"],
            ["Suzlon", "Info Edge", "Guidepoint"],
            ["WNS", "Lupin", ""],
          ].map((row, ri) =>
            row.map((company, ci) =>
              company ? (
                <div key={`${ri}-${ci}`} style={{
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  borderBottom: ri < 7 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  borderRight: ci < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ flexShrink: 0 }}>
                    <path d={ci === 0 ? "M1 4L4 1L7 4L4 7Z" : ci === 1 ? "M4 0L8 4L4 8L0 4Z" : "M0 4L4 0L8 4L4 8Z"} fill="#FFD700" opacity="0.85" />
                  </svg>
                  <span style={{ color: "rgba(255,255,255,0.92)", fontSize: 14.5, fontWeight: 600, letterSpacing: "0.3px" }}>{company}</span>
                </div>
              ) : (
                <div key={`${ri}-${ci}`} style={{ padding: "16px 24px", borderRight: ci < 2 ? "1px solid rgba(255,255,255,0.08)" : "none" }} />
              )
            )
          )}
        </div>
      </section>
      */}

      {/* ===== VIDEO TESTIMONIALS ===== */}
      {/* <ReviewsSection /> */}
      <EventsSection />

      {/* ===== INSTAGRAM WIDGET ===== */}
      <InstagramWidget />

      {/* ===== 4. TESTIMONIALS — GOOGLE REVIEWS ===== */}
      <Sec bg="#F5F5F7">
        {/* Centered header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Badge text="Google Reviews" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "10px 0 12px" }}>Trusted by <span style={{ color: R }}>500+ Brands</span></h2>
          {/* Google rating summary */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: `1px solid ${B}`, borderRadius: 30, padding: "6px 16px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span style={{ fontWeight: 800, fontSize: 14, color: D }}>4.8</span>
            <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(s => <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#FBBF24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>)}</div>
            <span style={{ fontSize: 11, color: G }}>Google Reviews</span>
          </div>
        </div>

        {/* Carousel wrapper with absolute prev/next buttons */}
        <div style={{ position: "relative" }}>
          {/* Prev button */}
          <button onClick={() => testimonialRowRef.current?.scrollBy({ left: -300, behavior: 'smooth' })} style={{ position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 40, height: 40, borderRadius: "50%", border: `1px solid ${B}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: D, transition: "all 0.2s", fontSize: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} onMouseEnter={e => { e.currentTarget.style.background = R; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = R; }} onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = D; e.currentTarget.style.borderColor = B; }}>‹</button>
          {/* Next button */}
          <button onClick={() => testimonialRowRef.current?.scrollBy({ left: 300, behavior: 'smooth' })} style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 40, height: 40, borderRadius: "50%", border: `1px solid ${B}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: D, transition: "all 0.2s", fontSize: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} onMouseEnter={e => { e.currentTarget.style.background = R; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = R; }} onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = D; e.currentTarget.style.borderColor = B; }}>›</button>

          <div ref={testimonialRowRef} className="testimonials-row" style={{ display: "flex", gap: 16, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 8, scrollSnapType: "x mandatory", msOverflowStyle: "none", scrollbarWidth: "none" as const }}>
          {[
            {
              name: "Namrata Kadam", meta: "Local Guide · 13 reviews", time: "a month ago",
              img: "/images/google reviews/Namrata Kadam.png", initial: null, color: null,
              q: "I have worked with the bookmycorporateparty team for more than 5 events, and i highly recommend their services. They manage the entire coordination process and ensure seamless execution every time. Their pricing is reasonable, and the team's support allows you to focus on other priorities without worrying about event logistics.",
            },
            {
              name: "Sonali Ramaiya", meta: "Local Guide · 13 reviews", time: "a month ago",
              img: null, initial: "S", color: "#4CAF50",
              q: "We wanted to have our company's new year celebration and needed a venue around Mumbai. We not only got the right pricing and a good venue, but a lot of our requirements were taken care of by Book My Corporate Party team. We would recommend their service to all small businesses and corporates.",
            },
            {
              name: "Esha Kamble", meta: "Local Guide · 38 reviews", time: "a month ago",
              img: null, initial: "E", color: "#F44336",
              q: "They planned our corporate outing, it was really well planned and executed.",
            },
            {
              name: "Manish Shinde", meta: "5 reviews · 19 photos", time: "4 weeks ago",
              img: "/images/google reviews/manish.png", initial: null, color: null,
              q: "The entire event was beautifully curated by Book My Corporate Party.com. Sachin Jawale and his team guided us through every detail — finalizing the venue, planning the event flow, entertainment, games, and food. The atmosphere was warm and joyful, executed with professionalism and care. Highly recommended for reliable, creative, and stress-free event management.",
            },
            {
              name: "Rakshavati Poojari", meta: "4 reviews", time: "4 weeks ago",
              img: null, initial: "R", color: "#9C27B0",
              q: "We have had a wonderful experience working with Sachin and Pradeep for our corporate events. Their professionalism and seamless coordination has made our events smooth and successful, and saved a lot of our time on logistics. Highly recommend them for planning your corporate events.",
            },
          ].map((t, i) => (
            <div key={i} style={{ flex: "0 0 270px", width: 270, background: "#fff", border: `1px solid ${B}`, borderRadius: 14, padding: "14px 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: 0, scrollSnapAlign: "start" }}>
              {/* Top row: avatar + name + Google logo */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {t.img ? (
                    <img src={t.img} alt={t.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.color!, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {t.initial}
                    </div>
                  )}
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: D }}>{t.name}</p>
                    <p style={{ margin: "1px 0 0", fontSize: 10, color: G }}>{t.meta}</p>
                  </div>
                </div>
                {/* Google G */}
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </div>
              {/* Stars + time */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#FBBF24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>)}
                </div>
                <span style={{ fontSize: 11, color: G }}>{t.time}</span>
              </div>
              {/* Review text */}
              <p style={{ fontSize: 12.5, color: D, lineHeight: 1.65, margin: 0, flex: 1 }}>
                {t.q}
              </p>
            </div>
          ))}
        </div>
        </div>{/* end carousel wrapper */}
      </Sec>

      {/* ===== TOP 10 PROBLEMS HR FACES ===== */}
      <Sec bg="#FFFFFF" id="hr-problems" style={{ borderTop: `1px solid ${B}` }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Badge text="The Real HR Struggle" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(28px, 4vw, 36px)", margin: "14px 0 10px", color: D, letterSpacing: "-0.3px" }}>
            Top 10 Problems HR Faces <span style={{ color: R }}>When Planning Events</span>
          </h2>
          <p style={{ fontSize: 15, color: G, maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
            Planning corporate celebrations sounds exciting until the endless calls, unclear pricing, and vendor chaos begin. Here is what HR teams deal with — and how we eliminate each one.
          </p>
        </div>

        <div className="hr-problems-grid">
          {HR_PROBLEMS.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#fff",
                borderRadius: 14,
                border: `1px solid ${B}`,
                padding: "22px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 28px rgba(128,40,31,0.09)";
                e.currentTarget.style.borderColor = "rgba(128,40,31,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
                e.currentTarget.style.borderColor = B;
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: "0.8px",
                    color: R,
                    background: L,
                    border: "1px solid rgba(128,40,31,0.15)",
                    padding: "3px 8px",
                    borderRadius: 6,
                    textTransform: "uppercase"
                  }}>
                    PROBLEM {item.num}
                  </span>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: L,
                    color: R,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                </div>

                <h3 style={{ margin: "0 0 8px", fontSize: 16.5, fontWeight: 700, color: D, letterSpacing: "-0.2px" }}>
                  {item.title}
                </h3>
                <p style={{ margin: "0 0 14px", fontSize: 13, color: "#4B5563", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>

              {/* The BMCP Fix */}
              <div style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                padding: "10px 12px",
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginTop: "auto"
              }}>
                <div style={{ color: R, flexShrink: 0, marginTop: 1 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "#1E293B", lineHeight: 1.45, fontWeight: 500 }}>
                  <strong style={{ color: R, fontWeight: 700 }}>The BMCP Fix: </strong>
                  {item.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* ===== 5. THE COMPARISON BOARD (WHITE) ===== */}
      <Sec bg="#FAFAFA" id="comparison-board">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Badge text="The Comparison" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "10px 0 0" }}>Why HRs Prefer Our <span style={{ color: R }}>Streamlined</span> Process</h2>
        </div>

        <div className="comparison-board" style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 30 }}>
          {/* THE OLD WAY */}
          <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${B}`, padding: "40px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "#E5E7EB" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
              <div style={{ color: "#9CA3AF" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#6B7280", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>The Old Way</h3>
            </div>
            {[
              "Google 'corporate party venues' — get 50 random listings mixed with weddings and birthdays.",
              "Call each venue. Half don't pick up. Half don't do corporate events.",
              "Compare pricing on WhatsApp, Excel, and sticky notes.",
              "Spend 2–3 weeks. Boss asks for a cost breakdown. You don't have one."
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D1D5DB", marginTop: 7, flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>

          {/* THE BMCP WAY */}
          <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${B}`, padding: "40px", position: "relative", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: R }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
              <div style={{ color: R }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: D, margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>The BMCP Way</h3>
            </div>
            {[
              "Share event details — team size, budget, vibe, date.",
              "Get 3–5 handpicked venues with pricing in 30 minutes.",
              "Compare side by side. Schedule a site visit if needed.",
              "Finalize fast. We coordinate everything until your event is done."
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 20 }}>
                <div style={{ color: R, marginTop: 3, flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: D, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      {/* ===== 6. HOW IT WORKS (PEARL GRAY) ===== */}
      <Sec bg="#F5F5F7" id="how-it-works">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Badge text="HOW IT WORKS" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "10px 0 0" }}>
            From Enquiry to Event in <span style={{ color: R }}>5 Steps</span>
          </h2>
        </div>
        <div style={{ position: "relative", width: "100%" }}>
          <div className="steps-line" style={{ position: "absolute", top: 26, left: "10%", right: "10%", height: 0, borderTop: `2px dashed ${B}`, zIndex: 0 }} />
          <div className="steps-container" style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
            {[
              { t: "Share Your Details", d: "Venue type, preferred area, guest count, date, and budget. Takes 60 seconds." },
              { t: "We Shortlist the Best", d: "3–5 handpicked venues from our curated network — all vetted for corporate events." },
              { t: "Compare Packages", d: "Venue photos, capacity, inclusions, per-person pricing. Side-by-side. Site visits on request." },
              { t: "Finalize Your Venue", d: "Pick your venue. Confirm the package. Done in 30 minutes." },
              { t: "We Coordinate Until Your Event", d: "Menu, DJ, decor, branding, team activities — all handled. You just bring your team." },
            ].map((s, i) => (
              <div key={i} style={{ flex: "1 1 180px", textAlign: "center", transition: "transform 0.3s ease" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                <div style={{ width: 52, height: 52, background: R, color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, margin: "0 auto 20px", boxShadow: "0 8px 20px rgba(192,57,43,0.15)" }}>
                  {i + 1}
                </div>
                <h4 style={{ fontSize: 15.5, fontWeight: 700, margin: "0 0 10px", color: D, letterSpacing: "-0.2px" }}>{s.t}</h4>
                <p style={{ fontSize: 13, color: G, lineHeight: 1.7, margin: "0 auto", padding: "0 5px", maxWidth: 170 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      {/* ===== WHY BMCP SOLUTIONS ===== */}
      <Sec bg="#FFFFFF" id="solutions" style={{ borderTop: `1px solid ${B}`, padding: "52px clamp(20px, 4vw, 80px)" }}>
        <div style={{ textAlign: "center", marginBottom: 38 }}>
          <Badge text="WHY BMCP SOLUTIONS" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(28px, 4vw, 36px)", margin: "14px 0 10px", color: D, letterSpacing: "-0.3px" }}>
            Why BMCP Solutions <span style={{ color: R }}>Are Built for Companies</span>
          </h2>
          <p style={{ fontSize: 15, color: G, maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            Designed exclusively for HR, Admin, and Corporate teams. From fast 30-minute shortlists to negotiated packages and full coordination — here is why 500+ companies choose us.
          </p>
        </div>

        <div className="bmcp-solutions-grid">
          {BMCP_SOLUTIONS.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "#fff",
                borderRadius: 14,
                border: `1px solid ${B}`,
                padding: "24px 22px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.25s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                position: "relative"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 14px 28px rgba(128,40,31,0.09)";
                e.currentTarget.style.borderColor = "rgba(128,40,31,0.35)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
                e.currentTarget.style.borderColor = B;
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: "0.8px",
                    color: R,
                    background: L,
                    border: "1px solid rgba(128,40,31,0.15)",
                    padding: "3px 8px",
                    borderRadius: 6,
                    textTransform: "uppercase"
                  }}>
                    SOLUTION {item.num}
                  </span>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: L,
                    color: R,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                </div>

                <h3 style={{ margin: "0 0 10px", fontSize: 16.5, fontWeight: 700, color: D, letterSpacing: "-0.2px", lineHeight: 1.35 }}>
                  {item.title}
                </h3>
                <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#4B5563", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* ===== 7. COMPARISON TABLE (PERFECTED BMCP MATRIX) ===== */}
      <Sec
        bg="#FFFFFF"
        id="comparison"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "48px clamp(20px, 4vw, 80px)"
        }}
      >

        <div style={{ textAlign: "center", marginBottom: 32, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
            <Badge text="The Choice" />
          </div>

          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(28px, 4vw, 36px)", margin: "14px 0 8px", color: D, letterSpacing: "-0.3px" }}>
            BookMyCorporateParty vs Others
          </h2>
          <p style={{ fontSize: 14.5, color: G, margin: 0, fontWeight: 400 }}>
            Dedicated corporate event intelligence vs generic public listing sites
          </p>
        </div>

        {/* Swipe hint for mobile screens */}
        <div className="matrix-scroll-hint" style={{ display: "none", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, color: G, marginBottom: 12 }}>
          <span>⇄ Swipe horizontally to view all 7 comparison points</span>
        </div>

        {/* Matrix Card Container */}
        <div style={{
          width: "100%",
          borderRadius: 22,
          overflow: "hidden",
          background: "#FFFFFF",
          border: `1px solid ${B}`,
          boxShadow: "0 16px 45px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Scrollable Container */}
          <div className="matrix-scroll-wrap" style={{ width: "100%", overflowX: "auto" }}>
            <div style={{ minWidth: 1220 }}>
              {/* Header Row: Top-Left Icon + 7 Criteria Columns */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "310px repeat(7, 1fr)",
                background: "#F8FAFC",
                borderBottom: "1px solid #E2E8F0",
                alignItems: "stretch"
              }}>
                {/* Top-Left Geometric Monogram */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "18px 24px",
                  position: "sticky",
                  left: 0,
                  zIndex: 4,
                  background: "#F8FAFC"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#475569",
                    flexShrink: 0
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                      <path d="M3 9h18"></path>
                      <path d="M9 21V9"></path>
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", color: "#334155" }}>PLATFORM COMPARISON</span>
                  </div>
                </div>

                {/* 7 Column Headers */}
                {[
                  "AUDIENCE FOCUS",
                  "SHORTLISTING SPEED",
                  "VENUE QUALITY",
                  "PRICING CONTROL",
                  "END-TO-END SUPPORT",
                  "LAST-MINUTE BOOKING",
                  "SITE INSPECTION"
                ].map((crit, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                    color: "#475569",
                    padding: "16px 10px",
                    lineHeight: 1.35,
                    borderLeft: "1px solid #E2E8F0"
                  }}>
                    {crit}
                  </div>
                ))}
              </div>

              {/* ROW 1: BookMyCorporateParty (SEAMLESS PURE BRAND BROWN - NO EXTRA COLOR PATCH) */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "310px repeat(7, 1fr)",
                background: R,
                color: "#FFFFFF",
                alignItems: "stretch",
                borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                boxShadow: "0 6px 20px rgba(128, 40, 31, 0.16)",
                position: "relative"
              }}>
                {/* Left Provider Block (Seamless Background matching parent 100%) */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "24px 24px",
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                  background: R
                }}>
                  <img
                    src="/images/logo-icon.png"
                    alt="BookMyCorporateParty"
                    style={{ width: 44, height: 44, objectFit: "contain", flexShrink: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.2px" }}>
                      BookMyCorporateParty
                    </h3>
                    <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "rgba(255, 255, 255, 0.88)", lineHeight: 1.45 }}>
                      Dedicated corporate event intelligence with handpicked venues &amp; priority coordination.
                    </p>
                  </div>
                </div>

                {/* 7 Columns for BMCP */}
                {[
                  "100% corporate events",
                  "Options in 30 minutes",
                  "Handpicked & curated",
                  "Negotiated corporate rates",
                  "DJ, Food, AV — all coordinated",
                  "Dedicated priority support",
                  "Arranged & coordinated"
                ].map((val, idx) => (
                  <div key={idx} style={{
                    textAlign: "center",
                    padding: "24px 10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderLeft: "1px solid rgba(255, 255, 255, 0.15)"
                  }}>
                    {/* Circled Checkmark (Aneeverse Style) */}
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.18)",
                      border: "1.5px solid rgba(255, 255, 255, 0.85)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#FFFFFF", marginTop: 10, lineHeight: 1.35, display: "block" }}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>

              {/* ROW 2: Other Sites (COMPETITOR ROW - HIGH CONTRAST & FULLY VISIBLE) */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "310px repeat(7, 1fr)",
                background: "#FFFFFF",
                alignItems: "stretch"
              }}>
                {/* Left Provider Block (Seamless Sticky) */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "24px 24px",
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                  background: "#FFFFFF"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1E293B",
                    flexShrink: 0,
                    width: 44,
                    height: 44
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="18" rx="3"></rect>
                      <line x1="2" y1="8" x2="22" y2="8"></line>
                      <circle cx="5.5" cy="5.5" r="0.75" fill="currentColor"></circle>
                      <circle cx="8" cy="5.5" r="0.75" fill="currentColor"></circle>
                      <circle cx="10.5" cy="5.5" r="0.75" fill="currentColor"></circle>
                      <rect x="5.5" y="11.5" width="4.5" height="4.5" rx="1"></rect>
                      <line x1="13" y1="12.5" x2="18.5" y2="12.5"></line>
                      <line x1="13" y1="15" x2="17.5" y2="15"></line>
                      <line x1="5.5" y1="18.5" x2="18.5" y2="18.5"></line>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 17.5, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.2px" }}>
                      Other Sites
                    </h3>
                    <p style={{ margin: "4px 0 0", fontSize: 12, fontWeight: 500, color: "#475569", lineHeight: 1.45 }}>
                      Generic public portals catering to weddings, birthdays, and unverified listings.
                    </p>
                  </div>
                </div>

                {/* 7 Columns for Other Sites - High-Contrast Visible Badges & Crisp Text */}
                {[
                  "Weddings, birthdays, everything",
                  "Browse listings yourself for days",
                  "Open unverified marketplace",
                  "Listed rack rates / call to know",
                  "You coordinate with venue directly",
                  "No dedicated support team",
                  "Self-service only"
                ].map((val, idx) => (
                  <div key={idx} style={{
                    textAlign: "center",
                    padding: "24px 10px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderLeft: "1px solid #E2E8F0"
                  }}>
                    {/* Circled High-Contrast Cross Badge */}
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "#F1F5F9",
                      border: "2px solid #94A3B8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#334155",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                    }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1E293B", marginTop: 10, lineHeight: 1.35, display: "block" }}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Sec>

      {/* ===== 8. FAQ (PEARL GRAY) ===== */}
      <Sec id="faq" bg="#F5F5F7">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Badge text="FAQ" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 28, margin: "10px 0 0" }}>Frequently Asked Questions</h2>
        </div>
        <div style={{ width: "100%" }}>
          <FAQItem q="How fast can I finalize a corporate party venue?" a="Within 30 minutes after reviewing our shortlisted options. For last-minute bookings, we provide priority support — subject to availability." />
          <FAQItem q="What types of corporate events can I book?" a="Annual parties, team outings, R&R events, offsites, Diwali and Christmas celebrations, award nights, client dinners, product launches, startup celebrations, farewell parties, and leadership retreats." />
          <FAQItem q="Can I book for a small team of 15–20 people?" a="Absolutely. Cafes, lounges, and private dining rooms work great for smaller groups. We customize options for 20-member startups to 2,000+ employee companies." />
          <FAQItem q="Do you handle full event planning or just venue booking?" a="Both. Food and beverage, DJ, stage, branding, team-building activities, vendor coordination — all managed. One contact for everything." />
          <FAQItem q="Can I visit the venue before confirming?" a="Yes. We arrange site visits for corporate clients before finalizing. Just let us know." />
          <FAQItem q="What cities do you cover?" a="Mumbai, Pune, Navi Mumbai, Thane, Goa, Hyderabad, Bangalore, Chennai, and Delhi NCR. We're expanding continuously." />
        </div>
      </Sec>

      {/* ===== 9. FINAL CTA (DIAMOND WHITE) ===== */}
      <section className="cta-section" style={{ background: "#fff", padding: "60px clamp(100px, 8vw, 200px)", textAlign: "center", position: "relative", borderTop: `1px solid ${B}` }}>
        <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", background: L, padding: "7px 18px", borderRadius: 30, color: R, fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 26, border: `1px solid ${B}` }}>
            The Corporate Party Experts
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(34px, 5.5vw, 48px)", color: D, margin: "0 0 24px", lineHeight: 1.1, letterSpacing: "-0.5px" }}>
            Your Team Deserves a Great Party.<br />
            <span style={{ color: R }}>You Deserve an Easy Booking.</span>
          </h2>
          <p className="cta-subtitle" style={{ fontSize: 18, color: G, margin: "0 auto 40px", lineHeight: 1.7, maxWidth: 640 }}>
            One enquiry. Curated venues. Real pricing. No cold calls. <br />
            Finalize in 30 minutes.
          </p>

          <button onClick={() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: R, color: "#fff", border: "none", borderRadius: 12, padding: "20px 52px", fontSize: 18, fontWeight: 800, cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif", boxShadow: "0 12px 30px rgba(192,57,43,0.3)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
            GET VENUE OPTIONS FREE →
          </button>

          <p style={{ fontSize: 13, color: G, marginTop: 18, marginBottom: 32 }}>
            Takes 60 seconds. Free for HR & Admin teams. No obligations.
          </p>

          <div className="cta-trust" style={{ color: G, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 30, marginTop: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Trusted by 500+ companies</span>
          </div>
        </div>
      </section>

      {/* ===== 10. EXECUTIVE FOOTER (BRAND RED THEME) ===== */}
      <footer className="footer-wrap" style={{ background: R, padding: "80px 0 40px" }}>
        <div className="footer-inner" style={{ width: "100%", padding: "0 clamp(100px, 8vw, 200px)", boxSizing: "border-box" }}>
          <div className="footer-cols" style={{ display: "flex", gap: 60, flexWrap: "wrap", marginBottom: 60 }}>
            {/* Logo & About */}
            <div style={{ flex: "2 1 300px" }}>
              <div style={{ marginBottom: 24 }}>
                <Link href="/" style={{ display: "inline-block" }}>
                  <img src="/images/bmcp-logo-footer.png" alt="Book My Corporate Party" style={{ height: 48, width: "auto", objectFit: "contain" }} />
                </Link>
              </div>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, margin: "0 0 28px", maxWidth: 320 }}>
                The premier corporate party booking platform. One enquiry, 30-minute shortlisting, and zero-hassle execution for your team celebrations.
              </p>

              {/* Social Media Icons */}
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {[
                  { name: "Instagram", href: "https://www.instagram.com/bookmycorporateparty.INDIA/", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                  { name: "LinkedIn", href: "https://www.linkedin.com/company/bookmycorporateparty", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
                  { name: "Facebook", href: "https://www.facebook.com/people/Book-My-Corporate-Party/61573909689565/", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.7)", transition: "all 0.2s ease" }} onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.transform = "none"; }}>
                    {s.icon}
                  </a>
                ))}
                {/* WhatsApp — opens popup form */}
                <button onClick={() => setShowWaPopup(true)} style={{ background: "none", border: "none", padding: 0, color: "rgba(255,255,255,0.7)", cursor: "pointer", transition: "all 0.2s ease", display: "flex", alignItems: "center" }} onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.transform = "none"; }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .004 5.408 0 12.044c0 2.123.555 4.197 1.608 6.02L0 24l6.128-1.608a11.847 11.847 0 0 0 5.922 1.583h.005c6.637 0 12.046-5.41 12.051-12.048a11.82 11.82 0 0 0-3.526-8.528"></path></svg>
                </button>
              </div>
            </div>

            {/* Links Columns — flex row on desktop, 2-col grid on mobile */}
            <div className="footer-links-row" style={{ display: "flex", flex: "2 1 280px", gap: 60 }}>
              <div style={{ flex: "1 1 140px" }}>
                <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 800, marginBottom: 20, textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.9 }}>Venue Types</h4>
                {["Lounges & Clubs", "Fine Dine", "Banquets", "Cafes", "Open Lawns", "Resorts & Villas", "Catering"].map(v => (
                  <p key={v} onClick={() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' })} style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 10px", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}>{v}</p>
                ))}
              </div>

              <div style={{ flex: "1 1 140px" }}>
                <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 800, marginBottom: 20, textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.9 }}>Cities</h4>
                {["Mumbai", "Pune", "Navi Mumbai", "Thane", "Goa", "Hyderabad", "Bangalore", "Chennai", "Delhi NCR"].map(v => (
                  <p key={v} onClick={() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' })} style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: "0 0 10px", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}>{v}</p>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div style={{ flex: "1.5 1 240px" }}>
              <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 800, marginBottom: 24, textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.9 }}>Contact Us</h4>
              {[
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>, text: "+91 9333 74 9333" },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .004 5.408 0 12.044c0 2.123.555 4.197 1.608 6.02L0 24l6.128-1.608a11.847 11.847 0 0 0 5.922 1.583h.005c6.637 0 12.046-5.41 12.051-12.048a11.82 11.82 0 0 0-3.526-8.528"></path></svg>, text: "WhatsApp Support" },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>, text: "info@bookmycorporateparty.com" },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>, text: "Kamdhenu Commerz, Kharghar, Navi Mumbai" },
              ].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ color: "rgba(255,255,255,0.9)", flexShrink: 0 }}>{c.icon}</div>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13.5 }}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-bottom-bar" style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 30, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, margin: 0 }}>
              © 2025 BookMyCorporateParty.com. All rights reserved.
            </p>
            {/* Center links */}
            <div style={{ display: "flex", gap: 30 }}>
              {[
                { label: "About Us", href: null },
                { label: "Partner With Us", href: null },
                { label: "Terms", href: "/terms" },
                { label: "Privacy", href: "/privacy" },
              ].map(({ label, href }) => href ? (
                <Link key={label} href={href} style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#fff"} onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)"}>{label}</Link>
              ) : (
                <span key={label} style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}>{label}</span>
              ))}
            </div>
            {/* Right: Aneeverse credit */}
            <a href="https://www.aneeverse.com/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "rgba(255,255,255,0.6)", fontSize: 12, transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "#fff"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}>
              <span>Designed &amp; Managed by Aneeverse</span>
              <img src="/aneeverse-logo (1).svg" alt="Aneeverse" style={{ height: 20, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.7 }} />
            </a>
          </div>
        </div>
      </footer>

      {/* ===== FLOATING ACTION BUTTONS (TALK TO EXPERT + WHATSAPP) ===== */}
      <div className="floating-actions-container" style={{ position: "fixed", bottom: 28, right: 28, display: "flex", alignItems: "center", gap: 12, zIndex: 1000 }}>
        {/* Notice toast if Tidio is loading or key not configured */}
        {SHOW_EXPERT_CHAT && tidioNotice && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 14px)",
              right: 0,
              background: "#111827",
              color: "#fff",
              padding: "16px 18px",
              borderRadius: 14,
              boxShadow: "0 18px 40px rgba(0,0,0,0.38)",
              fontSize: 12.5,
              width: 300,
              zIndex: 10001,
              border: "1px solid rgba(255,255,255,0.15)",
              fontFamily: "var(--font-dm-sans), sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6, color: "#fff" }}>
                💬 Chatbot Ready to Connect
              </span>
              <button
                onClick={() => setTidioNotice(false)}
                style={{ background: "none", border: "none", color: "#9CA3AF", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1 }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: "0 0 12px", color: "#D1D5DB", lineHeight: 1.5, fontSize: 12 }}>
              Add your <strong>NEXT_PUBLIC_TIDIO_KEY</strong> in <code>.env</code> to activate live chat, or speak with our expert on WhatsApp directly!
            </p>
            <button
              onClick={() => {
                setTidioNotice(false);
                setShowWaPopup(true);
              }}
              style={{
                width: "100%",
                background: "#25D366",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "9px 14px",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
              }}
            >
              Chat on WhatsApp Instead →
            </button>
          </div>
        )}

        {/* 1. Talk to Expert (Tidio Chatbot Trigger) — Hidden for now */}
        {SHOW_EXPERT_CHAT && (
          <button
            onClick={handleOpenExpertChat}
            className="expert-fab"
            aria-label="Talk to Expert"
            title="Talk to Expert"
          >
            <div className="expert-fab-dot-wrapper">
              <div className="expert-fab-dot" />
              <div className="expert-fab-dot-pulse" />
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="fab-full-text">Talk to Expert</span>
            <span className="fab-short-text">Expert</span>
          </button>
        )}

        {/* 2. WhatsApp VIP Concierge Button */}
        <button
          onClick={() => setShowWaPopup(true)}
          className="whatsapp-fab-btn"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          style={!SHOW_EXPERT_CHAT ? { width: 64, height: 64 } : undefined}
        >
          <svg width={!SHOW_EXPERT_CHAT ? "34" : "28"} height={!SHOW_EXPERT_CHAT ? "34" : "28"} viewBox="0 0 24 24" fill="#fff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .004 5.408 0 12.044c0 2.123.555 4.197 1.608 6.02L0 24l6.128-1.608a11.847 11.847 0 0 0 5.922 1.583h.005c6.637 0 12.046-5.41 12.051-12.048a11.82 11.82 0 0 0-3.526-8.528"></path>
          </svg>
        </button>
      </div>

      {/* ===== WHATSAPP POPUP MODAL ===== */}
      {showWaPopup && (
        <div onClick={() => setShowWaPopup(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 420, boxShadow: "0 24px 60px rgba(0,0,0,0.25)", overflow: "hidden", fontFamily: "var(--font-dm-sans), sans-serif" }}>
            {/* Modal header */}
            <div style={{ background: R, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .004 5.408 0 12.044c0 2.123.555 4.197 1.608 6.02L0 24l6.128-1.608a11.847 11.847 0 0 0 5.922 1.583h.005c6.637 0 12.046-5.41 12.051-12.048a11.82 11.82 0 0 0-3.526-8.528"></path></svg>
                </div>
                <div>
                  <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 16 }}>Chat with Us on WhatsApp</p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: 12 }}>Quick venue options in 30 minutes</p>
                </div>
              </div>
              <button onClick={() => setShowWaPopup(false)} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleWaSubmit} style={{ padding: "24px 24px 20px" }}>
              <p style={{ margin: "0 0 20px", fontSize: 13.5, color: G, lineHeight: 1.6 }}>
                Share a few quick details so our team can send you the right venue options right on WhatsApp.
              </p>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 5 }}>Your Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={waForm.name}
                  onChange={e => setWaForm({ ...waForm, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 13px", border: `1px solid ${B}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }}
                  onFocus={e => e.target.style.borderColor = R}
                  onBlur={e => e.target.style.borderColor = B}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 5 }}>Phone / WhatsApp *</label>
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={waForm.phone}
                  onChange={e => setWaForm({ ...waForm, phone: e.target.value })}
                  style={{ width: "100%", padding: "10px 13px", border: `1px solid ${B}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }}
                  onFocus={e => e.target.style.borderColor = R}
                  onBlur={e => e.target.style.borderColor = B}
                />
              </div>

              <div style={{ marginBottom: 22 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 5 }}>Venue Type <span style={{ color: G, fontWeight: 400 }}>(optional)</span></label>
                <select
                  value={waForm.event}
                  onChange={e => setWaForm({ ...waForm, event: e.target.value })}
                  style={{ width: "100%", padding: "10px 13px", border: `1px solid ${B}`, borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif", background: "#fff", color: waForm.event ? D : G, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
                  onFocus={e => e.target.style.borderColor = R}
                  onBlur={e => e.target.style.borderColor = B}
                >
                  <option value="">Select venue type</option>
                  <option value="Annual Office Party">Annual Office Party</option>
                  <option value="Team Outing">Team Outing</option>
                  <option value="R&R / Reward Night">R&R / Reward Night</option>
                  <option value="Diwali / Festive Celebration">Diwali / Festive Celebration</option>
                  <option value="Christmas / New Year Party">Christmas / New Year Party</option>
                  <option value="Award Night">Award Night</option>
                  <option value="Client Entertainment">Client Entertainment</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Corporate Offsite">Corporate Offsite</option>
                  <option value="Leadership Retreat">Leadership Retreat</option>
                  <option value="Farewell Party">Farewell Party</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={() => setShowWaPopup(false)} style={{ flex: 1, padding: "12px 0", background: "#fff", color: D, border: `1px solid ${B}`, borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif" }}>
                  Cancel
                </button>
                <button type="submit" style={{ flex: 2, padding: "12px 0", background: R, color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-dm-sans), sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .004 5.408 0 12.044c0 2.123.555 4.197 1.608 6.02L0 24l6.128-1.608a11.847 11.847 0 0 0 5.922 1.583h.005c6.637 0 12.046-5.41 12.051-12.048a11.82 11.82 0 0 0-3.526-8.528"></path></svg>
                  Chat on WhatsApp
                </button>
              </div>
              <p style={{ fontSize: 10.5, color: "#bbb", textAlign: "center", margin: "12px 0 0" }}>Your details are kept private and never shared.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
