"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useGeoLocation from "../hooks/useGeoLocation";
import dynamic from "next/dynamic";

const ReviewsSection = dynamic(() => import("../components/ReviewsSection"), { ssr: false });
const InstagramWidget = dynamic(() => import("../components/InstagramWidget"), { ssr: false });
const CompanyLogoSlider = dynamic(() => import("../components/CompanyLogoSlider"), { ssr: false });

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

export default function BMCPLanding() {
  const router = useRouter();

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const isValidPhone = (p: string) => p.replace(/\D/g, '').length >= 10;

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpVerified(false);
    setOtpCode('');
  };

  const handleVerifyOtp = () => {
    if (otpCode.length >= 4) {
      setOtpVerified(true);
    }
  };

  const [formData, setFormData] = useState({
    formType: '' as FormType,
    // Villa / Resort
    checkInDate: '',
    checkOutDate: '',
    totalPax: '',
    food: '',
    pricingAccepted: false,
    // Lounge & Banquet shared
    date: '',
    noOfPeople: '',
    location: '',
    // Lounge only
    budgetOnlyFood: '',
    budgetWithDrinks: '',
    typeOfMeal: '',
    // Banquet only
    foodType: '',
    budget: '',
    // Step 2 (contact)
    name: '',
    whatsappNumber: '',
    email: '',
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
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMsg, setFormMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWaPopup, setShowWaPopup] = useState(false);
  const [waForm, setWaForm] = useState({ name: '', phone: '', event: '' });
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
    if (!f.formType || !f.name || !f.whatsappNumber || !isValidPhone(f.whatsappNumber)) return;

    partialSentRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const venueLabel = f.formType ? VENUE_LABEL[f.formType] : '';
    const uGeo = userGeoRef.current;
    const uUtm = utmDataRef.current;

    fetch('/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        isPartial: true,
        formType: f.formType,
        name: f.name,
        phone: f.whatsappNumber,
        email: f.email,
        source: f.source,
        whatsapp: true,
        event: venueLabel,
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

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid()) return;

    isSubmittedRef.current = false;
    partialSentRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setFormStep(2);

    timerRef.current = setTimeout(() => {
      sendPartialLead();
    }, 45000);
  };

  const isStep1Valid = () => {
    const f = formData;
    return !!(f.formType && f.name && f.whatsappNumber && f.email && f.source && isValidPhone(f.whatsappNumber));
  };

  const isStep2Valid = () => {
    const f = formData;
    if (!f.formType) return false;
    if (f.formType === 'villa') {
      if (!f.checkInDate || !f.checkOutDate || !f.totalPax || !f.food) return false;
      if (parseInt(f.totalPax || '0', 10) < 20) return false;
      if (!f.pricingAccepted) return false;
      return true;
    }
    if (f.formType === 'lounge' || f.formType === 'nightclub') {
      if (!(f.date && f.noOfPeople && f.location && f.budgetOnlyFood && f.budgetWithDrinks && f.typeOfMeal)) return false;
      return parseInt(f.noOfPeople || '0', 10) >= 20;
    }
    if (f.formType === 'banquet' || f.formType === 'catering') {
      if (!(f.date && f.noOfPeople && f.location && f.foodType && f.budget)) return false;
      return parseInt(f.noOfPeople || '0', 10) >= 20;
    }
    return false;
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isStep2Valid()) return;

    isSubmittedRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setFormStatus('submitting');
    setFormMsg('');
    try {
      const f = formData;
      const venueLabel = f.formType ? VENUE_LABEL[f.formType] : '';
      const cityForServer = f.formType === 'villa' ? 'Mumbai' : f.location;
      const dateForServer = f.formType === 'villa' ? f.checkInDate : f.date;

      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: f.formType,
          name: f.name,
          phone: f.whatsappNumber,
          email: f.email,
          source: f.source,
          whatsapp: true,
          // Villa
          checkInDate: f.checkInDate,
          checkOutDate: f.checkOutDate,
          totalPax: f.totalPax,
          food: f.food,
          pricingAccepted: f.pricingAccepted,
          // Lounge / Banquet
          date: f.date,
          day: dayFromDate(f.date),
          noOfPeople: f.noOfPeople,
          location: f.location,
          budgetOnlyFood: f.budgetOnlyFood,
          budgetWithDrinks: f.budgetWithDrinks,
          typeOfMeal: f.typeOfMeal,
          foodType: f.foodType,
          budget: f.budget,
          // Backwards-compat keys
          event: venueLabel,
          city: cityForServer,
          area: '',
          venueDate: dateForServer,
          userLocation: userGeo ? `${userGeo.city}, ${userGeo.region}, ${userGeo.country}` : 'Unknown',
          userPincode: userGeo ? userGeo.pincode : 'Unknown',
          userIp: userGeo ? userGeo.ip : 'Unknown',
          // UTM / ad tracking
          ...utmData,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormData({
          formType: '' as FormType,
          checkInDate: '', checkOutDate: '', totalPax: '', food: '', pricingAccepted: false,
          date: '', noOfPeople: '', location: '',
          budgetOnlyFood: '', budgetWithDrinks: '', typeOfMeal: '',
          foodType: '', budget: '',
          name: '', whatsappNumber: '', email: '', source: '',
        });
        setOtpSent(false);
        setOtpCode('');
        setOtpVerified(false);
        setFormStep(1);
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
    { name: "Lounges & Clubs", img: "/images/687e0608c0d8f.jpg", tags: ["DJ & Music", "Bar Setup"], desc: "High-energy venues with DJ, bar, and dance floor — ideal for team parties, R&R nights, and celebrations.", capacity: "30–150 guests" },
    { name: "Banquet Halls", img: "/images/69d0ec17600a2.jpg", tags: ["Large Events", "AV Setup"], desc: "Spacious halls with stage, AV, and flexible seating — perfect for annual parties and award nights.", capacity: "100–1000+ guests" },
    { name: "Fine Dine", img: "/images/6878994b943ac.jpg", tags: ["Premium", "Client Dinners"], desc: "Elegant restaurants for leadership meets, client entertainment, and intimate corporate dinners.", capacity: "20–80 guests" },
    { name: "Cafes", img: "/images/687ddcbbb03f3.jpg", tags: ["Casual", "Budget-Friendly"], desc: "Relaxed spaces for team lunches, farewell parties, and casual get-togethers with small groups.", capacity: "15–50 guests" },
    { name: "Open Lawns", img: "/images/6884fe622ce3c.jpg", tags: ["Outdoor", "Team Activities"], desc: "Open-air venues for team outings, fun days, and large events with space for games and stages.", capacity: "50–500+ guests" },
    { name: "Resorts & Villas", img: "/images/69882f2f67edd.jpeg", tags: ["Offsites", "Weekend Getaway"], desc: "Destination venues near Mumbai for offsites, leadership retreats, and team-building stays.", capacity: "20–200 guests" },
  ];

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: D, overflowX: "hidden" }}>
      <style>{`
        .hamburger-btn { display: none; }
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

          /* Comparison Table - synchronized grid on mobile */
          .table-scroll-wrap {
            overflow: hidden !important;
            border: 1px solid #E5E7EB !important;
            border-radius: 14px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.06) !important;
          }
          .table-header-row, 
          .table-data-row {
            display: grid !important;
            grid-template-columns: 1fr 1.4fr 1.1fr !important; /* Balanced for common mobile widths */
            width: 100% !important;
          }
          .table-header-row {
            font-size: 8.5px !important;
            letter-spacing: 0.3px !important;
            line-height: 1.3 !important;
          }
          .table-header-row > div {
            padding: 12px 6px !important;
            word-break: break-all !important; /* Forces header text to stay in bounds */
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
          }
          .table-header-row > div:first-child { justify-content: flex-start !important; text-align: left !important; }
          .table-data-row {
            margin-bottom: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            border-bottom: 1px solid #F0F0F0 !important;
          }
          .table-data-row:last-child { border-bottom: none !important; }
          .table-data-row > div {
            padding: 10px 6px !important;
            font-size: 10.5px !important;
            display: flex !important;
            align-items: center !important;
          }
          .table-data-row > div:nth-child(2) {
            border-left: 1px solid #F0F0F0 !important;
            border-right: 1px solid #F0F0F0 !important;
            font-weight: 700 !important;
          }
          .table-data-row > div:nth-child(3) {
            color: #6B7280 !important;
          }
          .table-data-row > div:nth-child(2) svg,
          .table-data-row > div:nth-child(3) svg {
            width: 14px !important;
            height: 14px !important;
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
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 42, height: 42, overflow: "hidden", display: "flex", alignItems: "center" }}>
              <img src="/images/logo-lg.png" alt="" style={{ height: 42, width: "auto", maxWidth: "none", objectFit: "cover", objectPosition: "left" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#000", letterSpacing: "-0.5px", fontFamily: "'DM Sans', sans-serif" }}>BOOK MY CORPORATE</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: "#000", letterSpacing: "-0.5px", fontFamily: "'DM Sans', sans-serif" }}>PARTY.COM</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex", gap: 24, marginRight: 20 }} className="nav-links">
              {[
                { name: "Why Us", href: "#why-us" },
                { name: "Venues", href: "#venues" },
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
        <div style={{ position: "absolute", top: -120, right: -80, width: 420, height: 420, background: `radial-gradient(circle, rgba(192,57,43,0.12) 0%, transparent 70%)`, borderRadius: "50%" }} />
        <div className="hero-container" style={{ width: "100%", padding: "0 clamp(100px, 8vw, 200px)", display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap", boxSizing: "border-box" }}>
          <div className="hero-text" style={{ flex: "1 1 520px", paddingTop: 8 }}>
            <Badge text="Corporate Party Platform" />
            <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(32px, 4.8vw, 54px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: "16px 0 14px" }}>
              Stop Calling 20 Venues.{" "}
              <span style={{ color: "#FF5252" }}>Book Your Corporate Party in One Click.</span>
            </h1>
            <p style={{ fontSize: 17, color: "#E0E0E0", lineHeight: 1.65, margin: "0 0 24px", maxWidth: 520 }}>
              Tell us your team size, budget, and date. Get curated venue options, packages, and pricing — without chasing a single vendor.
            </p>
            <div className="hero-badges" style={{ display: "flex", gap: 20, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
              {[
                { label: "500+ Brands", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> },
                { label: "30-Min Turnaround", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
                { label: "100% Free", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
                { label: "WhatsApp Support", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.9.9L22 4z"></path></svg> },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", color: "#E0E0E0", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                  <span style={{ color: "#FF5252", display: "flex", alignItems: "center" }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          {/* Form */}
          <div id="hero-form" className="hero-form-card" style={{ flex: "1 1 360px", background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}>
             {/* Step indicator */}
             {formStatus !== 'success' && (
               <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                 {[1, 2].map(s => (
                   <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                     <div style={{ width: 22, height: 22, borderRadius: "50%", background: formStep >= s ? R : B, color: formStep >= s ? "#fff" : G, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.3s" }}>{s}</div>
                     <span style={{ fontSize: 11, fontWeight: 600, color: formStep >= s ? D : G }}>{s === 1 ? "Your Contact" : "Venue Details"}</span>
                     {s === 1 && <div style={{ width: 28, height: 1, background: formStep === 2 ? R : B, marginLeft: 2, transition: "background 0.3s" }} />}
                   </div>
                 ))}
               </div>
             )}

            {formStatus === 'success' ? (
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <div style={{ width: 60, height: 60, background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 700, color: D }}>Request Received!</h3>
                <p style={{ fontSize: 13.5, color: G, lineHeight: 1.6, margin: "0 0 22px" }}>{formMsg}</p>
                <button onClick={() => { setFormStatus('idle'); setFormStep(1); }} style={{ background: "none", color: R, border: `1px solid ${R}`, borderRadius: 8, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Submit Another</button>
              </div>

            ) : formStep === 1 ? (
              /* ── STEP 1: Contact details + select dropdown ── */
              <form onSubmit={handleStep1}>
                <h3 style={{ margin: "0 0 2px", fontSize: 17, fontWeight: 700, color: D }}>Get Venue Options Free</h3>
                <p style={{ margin: "0 0 14px", fontSize: 12, color: G }}>Free for HR & Admin teams. Options within 30 minutes.</p>

                {/* Venue type */}
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>What u want to book? *</label>
                  <select required value={formData.formType} onChange={e => setFormData({ ...formData, formType: e.target.value as FormType })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif", background: "#fff", color: formData.formType ? D : G, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B}>
                    <option value="" disabled>Select venue type</option>
                    <option value="villa">Villa / Resort</option>
                    <option value="lounge">Lounge</option>
                    <option value="nightclub">Night Club</option>
                    <option value="banquet">Banquet</option>
                    <option value="catering">Catering</option>
                  </select>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Your Name *</label>
                  <input required type="text" placeholder="e.g. Priya Sharma" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>WhatsApp Number *</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input required type="tel" placeholder="e.g. 9876543210" value={formData.whatsappNumber} onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })} style={{ flex: 1, padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                    <button type="button" onClick={handleSendOtp} disabled={!isValidPhone(formData.whatsappNumber) || otpSent} style={{ background: (isValidPhone(formData.whatsappNumber) && !otpSent) ? R : "#aaa", color: "#fff", border: "none", borderRadius: 7, padding: "0 12px", fontSize: 11, fontWeight: 700, cursor: (isValidPhone(formData.whatsappNumber) && !otpSent) ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                      {otpSent ? "OTP Sent" : "Send OTP"}
                    </button>
                  </div>
                  {otpSent && (
                    <div style={{ marginTop: 8, display: "flex", gap: 6, alignItems: "center" }}>
                      <input type="text" maxLength={6} placeholder="Enter OTP (Optional)" value={otpCode} onChange={e => setOtpCode(e.target.value)} style={{ width: 120, padding: "8px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} />
                      <button type="button" onClick={handleVerifyOtp} disabled={otpVerified || !otpCode} style={{ background: (otpVerified || !otpCode) ? "#aaa" : "#16A34A", color: "#fff", border: "none", borderRadius: 7, padding: "8px 14px", fontSize: 11, fontWeight: 700, cursor: (otpVerified || !otpCode) ? "default" : "pointer" }}>
                        {otpVerified ? "✓ Verified" : "Verify"}
                      </button>
                      <button type="button" onClick={() => setOtpSent(false)} style={{ background: "none", border: "none", color: R, fontSize: 11, fontWeight: 600, cursor: "pointer", padding: 0 }}>Resend</button>
                    </div>
                  )}
                  {otpVerified && (
                    <span style={{ display: "block", color: "#16A34A", fontSize: 10, fontWeight: 600, marginTop: 4 }}>✓ OTP verified successfully (Mock)</span>
                  )}
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Email *</label>
                  <input required type="email" placeholder="you@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>How did you hear about us? *</label>
                  <select required value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif", background: "#fff", color: formData.source ? D : G, appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B}>
                    <option value="" disabled>Select source</option>
                    {SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <button type="submit" disabled={!isStep1Valid()} style={{ width: "100%", padding: "11px 0", background: isStep1Valid() ? R : "#aaa", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: isStep1Valid() ? "pointer" : "not-allowed", fontFamily: "var(--font-dm-sans), sans-serif", boxShadow: "0 4px 14px rgba(192,57,43,0.2)", marginTop: 4 }}>
                  NEXT →
                </button>
                <p style={{ fontSize: 10, color: "#999", textAlign: "center", margin: "6px 0 0" }}>Free service · No spam · No obligations</p>
              </form>

            ) : (
              /* ── STEP 2: Venue-specific details (+ pricing tick for Villa) ── */
              <form onSubmit={handleSubmit}>
                <h3 style={{ margin: "0 0 2px", fontSize: 17, fontWeight: 700, color: D }}>Almost there!</h3>
                <p style={{ margin: "0 0 4px", fontSize: 12, color: G }}>Please share the details of your booking.</p>

                {/* Summary pill */}
                <div style={{ background: L, border: `1px solid ${B}`, borderRadius: 8, padding: "8px 12px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 12, color: D, fontWeight: 700 }}>👤 {formData.name} ({formData.whatsappNumber})</span>
                    <span style={{ fontSize: 10, color: G }}>📍 {formData.formType ? VENUE_LABEL[formData.formType] : ''}</span>
                  </div>
                  <button type="button" onClick={() => setFormStep(1)} style={{ background: "none", border: "none", color: R, fontSize: 11, fontWeight: 700, cursor: "pointer", padding: 0 }}>Edit</button>
                </div>

                {/* ──── VILLA / RESORT ──── */}
                {formData.formType === 'villa' && (
                  <>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Check-In *</label>
                        <input required type="date" value={formData.checkInDate} onChange={e => setFormData({ ...formData, checkInDate: e.target.value })} onClick={e => (e.target as HTMLInputElement).showPicker?.()} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif", color: formData.checkInDate ? D : "#888", cursor: "pointer" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Check-Out *</label>
                        <input required type="date" value={formData.checkOutDate} onChange={e => setFormData({ ...formData, checkOutDate: e.target.value })} onClick={e => (e.target as HTMLInputElement).showPicker?.()} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif", color: formData.checkOutDate ? D : "#888", cursor: "pointer" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Total Pax (Min 20) *</label>
                      <input required type="number" min="20" placeholder="e.g. 25 (Min 20)" value={formData.totalPax} onChange={e => setFormData({ ...formData, totalPax: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                      {formData.totalPax && parseInt(formData.totalPax, 10) < 20 && (
                        <span style={{ display: "block", color: "#DC2626", fontSize: 10, fontWeight: 600, marginTop: 4 }}>⚠️ Minimum 20 pax required</span>
                      )}
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 6 }}>Food *</label>
                      <div style={{ display: "flex", gap: 6 }}>
                        {['Pure Veg', 'Veg / Non-Veg'].map(opt => {
                          const sel = formData.food === opt;
                          return (
                            <label key={opt} style={{ flex: 1, textAlign: "center", padding: "8px 4px", border: `1px solid ${sel ? R : B}`, borderRadius: 7, fontSize: 12, fontWeight: 600, color: sel ? R : D, background: sel ? L : "#fff", cursor: "pointer" }}>
                              <input type="radio" name="food" value={opt} checked={sel} onChange={e => setFormData({ ...formData, food: e.target.value })} style={{ display: "none" }} />
                              {opt}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* ──── LOUNGE / NIGHT CLUB ──── */}
                {(formData.formType === 'lounge' || formData.formType === 'nightclub') && (
                  <>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Date *</label>
                        <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} onClick={e => (e.target as HTMLInputElement).showPicker?.()} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif", color: formData.date ? D : "#888", cursor: "pointer" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Day</label>
                        <input readOnly value={dayFromDate(formData.date)} placeholder="—" style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif", background: "#F9FAFB", color: G }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>No. of People (Min 20) *</label>
                        <input required type="number" min="20" placeholder="e.g. 25 (Min 20)" value={formData.noOfPeople} onChange={e => setFormData({ ...formData, noOfPeople: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                        {formData.noOfPeople && parseInt(formData.noOfPeople, 10) < 20 && (
                          <span style={{ display: "block", color: "#DC2626", fontSize: 10, fontWeight: 600, marginTop: 4 }}>⚠️ Minimum 20 pax required</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Location *</label>
                        <input required type="text" placeholder="e.g. Andheri West" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Budget (Food) ₹ *</label>
                        <input required type="number" min="0" placeholder="1500–1800" value={formData.budgetOnlyFood} onChange={e => setFormData({ ...formData, budgetOnlyFood: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Budget (Drinks) ₹ *</label>
                        <input required type="number" min="0" placeholder="2500+" value={formData.budgetWithDrinks} onChange={e => setFormData({ ...formData, budgetWithDrinks: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 6 }}>Type of Meal *</label>
                      <div style={{ display: "flex", gap: 6 }}>
                        {['Lunch', 'Dinner'].map(opt => {
                          const sel = formData.typeOfMeal === opt;
                          return (
                            <label key={opt} style={{ flex: 1, textAlign: "center", padding: "8px 4px", border: `1px solid ${sel ? R : B}`, borderRadius: 7, fontSize: 12, fontWeight: 600, color: sel ? R : D, background: sel ? L : "#fff", cursor: "pointer" }}>
                              <input type="radio" name="meal" value={opt} checked={sel} onChange={e => setFormData({ ...formData, typeOfMeal: e.target.value })} style={{ display: "none" }} />
                              {opt}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* ──── BANQUET / CATERING ──── */}
                {(formData.formType === 'banquet' || formData.formType === 'catering') && (
                  <>
                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Date *</label>
                        <input required type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} onClick={e => (e.target as HTMLInputElement).showPicker?.()} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif", color: formData.date ? D : "#888", cursor: "pointer" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Day</label>
                        <input readOnly value={dayFromDate(formData.date)} placeholder="—" style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif", background: "#F9FAFB", color: G }} />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>No. of People (Min 20) *</label>
                        <input required type="number" min="20" placeholder="e.g. 100 (Min 20)" value={formData.noOfPeople} onChange={e => setFormData({ ...formData, noOfPeople: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                        {formData.noOfPeople && parseInt(formData.noOfPeople, 10) < 20 && (
                          <span style={{ display: "block", color: "#DC2626", fontSize: 10, fontWeight: 600, marginTop: 4 }}>⚠️ Minimum 20 pax required</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Location *</label>
                        <input required type="text" placeholder="e.g. Andheri West" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 6 }}>Food Type *</label>
                      <div style={{ display: "flex", gap: 6 }}>
                        {['Pure Veg', 'Veg / Non-Veg'].map(opt => {
                          const sel = formData.foodType === opt;
                          return (
                            <label key={opt} style={{ flex: 1, textAlign: "center", padding: "8px 4px", border: `1px solid ${sel ? R : B}`, borderRadius: 7, fontSize: 12, fontWeight: 600, color: sel ? R : D, background: sel ? L : "#fff", cursor: "pointer" }}>
                              <input type="radio" name="foodType" value={opt} checked={sel} onChange={e => setFormData({ ...formData, foodType: e.target.value })} style={{ display: "none" }} />
                              {opt}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: D, marginBottom: 4 }}>Budget ₹ *</label>
                      <input required type="number" min="0" placeholder="e.g. 80000" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${B}`, borderRadius: 7, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-dm-sans), sans-serif" }} onFocus={e => e.target.style.borderColor = R} onBlur={e => e.target.style.borderColor = B} />
                    </div>
                  </>
                )}

                {formData.formType === 'villa' && (
                  <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12, color: D, marginBottom: 12, cursor: "pointer", background: L, border: `1px solid ${B}`, borderRadius: 8, padding: "10px 12px" }}>
                    <input type="checkbox" checked={formData.pricingAccepted} onChange={e => setFormData({ ...formData, pricingAccepted: e.target.checked })} style={{ accentColor: R, marginTop: 3, flexShrink: 0 }} />
                    <span style={{ lineHeight: 1.5 }}>
                      A decent villa typically costs around <strong>₹40,000</strong> for a one-night stay for 4BHK (8 adults). Food expenses are approximately <strong>₹2,500 per person</strong> for all meals. Would you like to go ahead with this pricing?
                    </span>
                  </label>
                )}

                {formStatus === 'error' && (
                  <p style={{ fontSize: 12, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, padding: "9px 12px", margin: "0 0 10px" }}>{formMsg}</p>
                )}

                <button type="submit" disabled={formStatus === 'submitting' || !isStep2Valid()} style={{ width: "100%", padding: "11px 0", background: (formStatus === 'submitting' || !isStep2Valid()) ? "#aaa" : R, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: (formStatus === 'submitting' || !isStep2Valid()) ? "not-allowed" : "pointer", fontFamily: "var(--font-dm-sans), sans-serif", boxShadow: "0 4px 14px rgba(192,57,43,0.2)" }}>
                  {formStatus === 'submitting' ? 'Sending...' : 'GET VENUE OPTIONS FREE →'}
                </button>
                <p style={{ fontSize: 10, color: "#999", textAlign: "center", margin: "6px 0 0" }}>By clicking, you accept our <Link href="/terms" style={{ color: "#999", textDecoration: "underline" }}>Terms & Conditions</Link></p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ===== COMPANY AUTO LOGO MARQUEE SLIDER ===== */}
      <CompanyLogoSlider />

      {/* ===== 2. WHY CHOOSE US ===== */}
      <Sec bg="#FAFAFA" id="why-us">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 30, margin: "0 0 8px" }}>Why HR Teams Choose <span style={{ color: R }}>BookMyCorporateParty</span></h2>
          <p style={{ fontSize: 15, color: G, maxWidth: 480, margin: "0 auto" }}>Corporate-only. Curated. Handled end-to-end.</p>
        </div>
        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, title: "100% Corporate Focus", desc: "Not a wedding or birthday directory. Every venue on our platform is vetted specifically for office events." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>, title: "30-Minute Turnaround", desc: "Share your requirements. Get 3–5 handpicked venue options with pricing within 30 minutes." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>, title: "Negotiated Corporate Rates", desc: "We negotiate directly with venues so you get better pricing than booking on your own." },
            { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>, title: "Full Event Coordination", desc: "DJ, food, decor, branding, team-building activities — one point of contact from start to finish." },
          ].map((b, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "24px 16px", border: `1px solid ${B}`, textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ color: R, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                {b.icon}
              </div>
              <h4 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: D }}>{b.title}</h4>
              <p style={{ margin: 0, fontSize: 13, color: G, lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          ))}
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

      {/* ===== 3. VENUE CARDS ===== */}
      <Sec id="venues">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Badge text="Explore venue types" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "14px 0 8px" }}>
            Corporate Party <span style={{ color: R }}>Venue Types</span>
          </h2>
          <p style={{ fontSize: 15, color: G, maxWidth: 520, margin: "0 auto" }}>
            Choose your venue type and submit your requirements. We'll shortlist the best options with pricing for your team.
          </p>
        </div>
        <div className="venue-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22 }}>
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
      <ReviewsSection />

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

      {/* ===== 5. THE COMPARISON BOARD (WHITE) ===== */}
      <Sec bg="#fff" id="comparison-board">
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

      {/* ===== 7. COMPARISON TABLE (WHITE) ===== */}
      <Sec bg="#fff" id="comparison">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <Badge text="The Choice" />
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: 32, margin: "10px 0 0" }}>BookMyCorporateParty vs Others</h2>
        </div>
        <div className="table-scroll-wrap" style={{ width: "100%", borderRadius: 16, overflow: "hidden", border: `1px solid ${B}`, boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
          {/* Header Row */}
          <div className="table-header-row" style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1.5fr", background: D, color: "#fff", fontWeight: 800, fontSize: 13, textTransform: "uppercase", letterSpacing: "1px" }}>
            <div style={{ padding: "20px 24px" }}>Platform Focus</div>
            <div style={{ padding: "20px 24px", background: "rgba(255,255,255,0.05)", textAlign: "center", color: "#fff" }}>BookMyCorporateParty</div>
            <div style={{ padding: "20px 24px", textAlign: "center", opacity: 0.6 }}>Other Sites</div>
          </div>

          {[
            ["Audience Focus", "100% corporate events", "Weddings, birthdays, everything"],
            ["Shortlisting Speed", "Options in 30 minutes", "Browse listings yourself for days"],
            ["Venue Quality", "Handpicked & curated", "Open unverified marketplace"],
            ["Pricing Control", "Negotiated corporate rates", "Listed rack rates / call to know"],
            ["End-to-End Support", "DJ, Food, AV — all coordinated", "You coordinate with venue directly"],
            ["Last-Minute Booking", "Dedicated priority support", "No dedicated support team"],
            ["Site Inspection", "Arranged & coordinated", "Self-service only"],
          ].map(([feat, ours, theirs], i) => (
            <div key={i} className="table-data-row" style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1.5fr", background: i % 2 === 0 ? "#fff" : "#FAFAFA", borderBottom: i === 6 ? "none" : `1px solid ${B}` }}>
              <div style={{ padding: "16px 24px", fontWeight: 600, fontSize: 14, color: D, display: "flex", alignItems: "center" }}>{feat}</div>

              {/* Our Column */}
              <div style={{ padding: "16px 24px", fontSize: 14, color: D, fontWeight: 700, background: "rgba(192,57,43,0.02)", borderLeft: `1px solid ${B}`, borderRight: `1px solid ${B}`, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ color: "#16A34A", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                {ours}
              </div>

              {/* Their Column */}
              <div style={{ padding: "16px 24px", fontSize: 13.5, color: G, display: "flex", alignItems: "center", gap: 10, textAlign: "center" }}>
                <div style={{ color: "#9CA3AF", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </div>
                {theirs}
              </div>
            </div>
          ))}
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
                <img src="/images/logo-lg.png" alt="BookMyCorporateParty" style={{ height: 52, width: "auto" }} />
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

      {/* ===== FLOATING VIP CONCIERGE (WHATSAPP) ===== */}
      <button onClick={() => setShowWaPopup(true)} className="whatsapp-fab" style={{ position: "fixed", bottom: 32, right: 32, width: 64, height: 64, background: R, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 10px 30px ${R}4D`, zIndex: 1000, transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", border: "none", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15) rotate(8deg)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.414 0 .004 5.408 0 12.044c0 2.123.555 4.197 1.608 6.02L0 24l6.128-1.608a11.847 11.847 0 0 0 5.922 1.583h.005c6.637 0 12.046-5.41 12.051-12.048a11.82 11.82 0 0 0-3.526-8.528"></path></svg>
      </button>

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
