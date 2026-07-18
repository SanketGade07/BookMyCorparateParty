import React from "react";

interface LogoItem {
  name: string;
  renderLogo: () => React.ReactNode;
}

/*
const logoItems: LogoItem[] = [
  {
    name: "IBM",
    renderLogo: () => (
      <svg viewBox="0 0 100 35" className="company-logo-svg" fill="#0F62FE">
        <text x="10" y="26" fontFamily="'Arial Black', Impact, sans-serif" fontSize="24" fontWeight="900" letterSpacing="2px">IBM</text>
        // Striped overlay effect
        <line x1="0" y1="5" x2="100" y2="5" stroke="#ffffff" strokeWidth="2" />
        <line x1="0" y1="10" x2="100" y2="10" stroke="#ffffff" strokeWidth="2" />
        <line x1="0" y1="15" x2="100" y2="15" stroke="#ffffff" strokeWidth="2" />
        <line x1="0" y1="20" x2="100" y2="20" stroke="#ffffff" strokeWidth="2" />
        <line x1="0" y1="25" x2="100" y2="25" stroke="#ffffff" strokeWidth="2" />
      </svg>
    )
  },
  {
    name: "Accenture",
    renderLogo: () => (
      <svg viewBox="0 0 130 35" className="company-logo-svg">
        <text x="10" y="25" fill="#1A1A1A" fontFamily="'Montserrat', 'Helvetica Neue', sans-serif" fontSize="19" fontWeight="800" letterSpacing="-0.5px">accenture</text>
        <path d="M96 11 L102 16 L96 21" fill="none" stroke="#A100FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: "WeWork",
    renderLogo: () => (
      <svg viewBox="0 0 110 35" className="company-logo-svg" fill="#111111">
        <text x="10" y="26" fontFamily="'Georgia', serif" fontSize="23" fontWeight="900" letterSpacing="-0.5px">wework</text>
      </svg>
    )
  },
  {
    name: "Maersk",
    renderLogo: () => (
      <svg viewBox="0 0 140 35" className="company-logo-svg">
        // Maersk Star
        <rect x="12" y="8" width="18" height="18" fill="none" stroke="#40B4E5" strokeWidth="2.5" rx="2" />
        <path d="M21 12 L22.5 15.5 L26 15.5 L23 17.5 L24.5 21 L21 19 L17.5 21 L19 17.5 L16 15.5 L19.5 15.5 Z" fill="#40B4E5" />
        <text x="38" y="24" fill="#111111" fontFamily="'Arial Black', Impact, sans-serif" fontSize="16" fontWeight="900" letterSpacing="0.5px">MAERSK</text>
      </svg>
    )
  },
  {
    name: "Intuit",
    renderLogo: () => (
      <svg viewBox="0 0 110 35" className="company-logo-svg">
        <text x="10" y="25" fill="#0077C5" fontFamily="'Arial Black', Impact, sans-serif" fontSize="20" fontWeight="900" letterSpacing="-0.5px">InTUIT</text>
        <circle cx="58" cy="8" r="2.5" fill="#111111" />
        <circle cx="80" cy="8" r="2.5" fill="#111111" />
      </svg>
    )
  },
  {
    name: "JSW",
    renderLogo: () => (
      <svg viewBox="0 0 100 35" className="company-logo-svg">
        <path d="M12 25 C12 28, 20 28, 22 23 C23 20, 24 12, 28 8" fill="none" stroke="#005A9C" strokeWidth="3" strokeLinecap="round" />
        <text x="32" y="24" fill="#E31B23" fontFamily="'Arial Black', sans-serif" fontSize="21" fontWeight="900" fontStyle="italic">JSW</text>
      </svg>
    )
  },
  {
    name: "Guidepoint",
    renderLogo: () => (
      <svg viewBox="0 0 140 35" className="company-logo-svg">
        <text x="10" y="24" fill="#1A1A1A" fontFamily="'DM Sans', Arial, sans-serif" fontSize="18" fontWeight="800" letterSpacing="-0.2px">Guidepoint</text>
        <circle cx="106" cy="22" r="3" fill="#FFC72C" />
      </svg>
    )
  },
  {
    name: "BNI",
    renderLogo: () => (
      <svg viewBox="0 0 90 35" className="company-logo-svg">
        <text x="10" y="26" fill="#8A1538" fontFamily="'Georgia', serif" fontSize="25" fontWeight="900" fontStyle="italic">BNI</text>
        <line x1="50" y1="12" x2="65" y2="12" stroke="#8A1538" strokeWidth="2" />
        <line x1="50" y1="20" x2="65" y2="20" stroke="#8A1538" strokeWidth="2" />
      </svg>
    )
  },
  {
    name: "codvo.ai",
    renderLogo: () => (
      <svg viewBox="0 0 120 35" className="company-logo-svg">
        <circle cx="16" cy="18" r="4" fill="none" stroke="#4F46E5" strokeWidth="2.5" />
        <path d="M16 10 L22 14 L22 22 L16 26 L10 22 L10 14 Z" fill="none" stroke="#4F46E5" strokeWidth="1.5" />
        <text x="32" y="23" fill="#111111" fontFamily="'Courier New', Courier, monospace" fontSize="17" fontWeight="900">codvo.ai</text>
      </svg>
    )
  },
  {
    name: "WTW",
    renderLogo: () => (
      <svg viewBox="0 0 100 35" className="company-logo-svg" fill="#582C83">
        <text x="10" y="25" fontFamily="'Montserrat', 'Arial Black', sans-serif" fontSize="23" fontWeight="900" letterSpacing="-1px">wtw</text>
      </svg>
    )
  },
  {
    name: "CDSL",
    renderLogo: () => (
      <svg viewBox="0 0 110 35" className="company-logo-svg">
        <path d="M10 18 A8 8 0 1 1 26 18 A8 8 0 1 1 10 18" fill="none" stroke="#00529C" strokeWidth="2" />
        <circle cx="18" cy="18" r="2.5" fill="#FFC72C" />
        <line x1="14" y1="14" x2="22" y2="22" stroke="#00529C" strokeWidth="1.5" />
        <text x="36" y="24" fill="#00529C" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="850">CDSL</text>
      </svg>
    )
  },
  {
    name: "RXO",
    renderLogo: () => (
      <svg viewBox="0 0 90 35" className="company-logo-svg" fill="#111111">
        <text x="10" y="25" fontFamily="'Arial Black', Impact, sans-serif" fontSize="22" fontWeight="900" letterSpacing="0.5px">RXO</text>
        <circle cx="58" cy="10" r="2" fill="#FF5500" />
      </svg>
    )
  },
  {
    name: "Hafele",
    renderLogo: () => (
      <svg viewBox="0 0 120 35" className="company-logo-svg" fill="#E2001A">
        <text x="10" y="24" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" letterSpacing="0.8px">HÄFELE</text>
      </svg>
    )
  },
  {
    name: "Suryoday",
    renderLogo: () => (
      <svg viewBox="0 0 130 35" className="company-logo-svg">
        <path d="M10 24 A8 8 0 0 1 26 24" fill="none" stroke="#FF7A00" strokeWidth="3" strokeLinecap="round" />
        <text x="32" y="23" fill="#0033A0" fontFamily="'DM Sans', sans-serif" fontSize="15" fontWeight="800">SURYODAY</text>
      </svg>
    )
  },
  {
    name: "Concorde",
    renderLogo: () => (
      <svg viewBox="0 0 130 35" className="company-logo-svg">
        <path d="M10 22 Q 20 8, 30 22" fill="none" stroke="#00A4E4" strokeWidth="2" />
        <text x="36" y="23" fill="#0033A0" fontFamily="'Arial', sans-serif" fontSize="16" fontWeight="700" letterSpacing="0.5px">CONCORDE</text>
      </svg>
    )
  },
  {
    name: "neo",
    renderLogo: () => (
      <svg viewBox="0 0 90 35" className="company-logo-svg">
        <rect x="8" y="7" width="36" height="22" rx="6" fill="none" stroke="#6366F1" strokeWidth="2" />
        <text x="15" y="22" fill="#6366F1" fontFamily="sans-serif" fontSize="12" fontWeight="800">neo</text>
        <text x="50" y="23" fill="#111111" fontFamily="'DM Sans', sans-serif" fontSize="14" fontWeight="800">Do Good.</text>
      </svg>
    )
  },
  {
    name: "Pramukh",
    renderLogo: () => (
      <svg viewBox="0 0 130 35" className="company-logo-svg">
        <rect x="10" y="10" width="14" height="14" fill="none" stroke="#0D9488" strokeWidth="2" />
        <line x1="10" y1="17" x2="24" y2="17" stroke="#0D9488" strokeWidth="1.5" />
        <text x="32" y="22" fill="#111111" fontFamily="sans-serif" fontSize="14" fontWeight="800" letterSpacing="0.5px">PRAMUKH</text>
      </svg>
    )
  },
  {
    name: "Synergy",
    renderLogo: () => (
      <svg viewBox="0 0 130 35" className="company-logo-svg">
        <circle cx="18" cy="17" r="7" fill="none" stroke="#0057B8" strokeWidth="2" />
        <circle cx="18" cy="17" r="3" fill="#FFD700" />
        <text x="32" y="23" fill="#0057B8" fontFamily="sans-serif" fontSize="14" fontWeight="800" letterSpacing="0.2px">SYNERGY</text>
      </svg>
    )
  },
  {
    name: "SeedGlobal",
    renderLogo: () => (
      <svg viewBox="0 0 140 35" className="company-logo-svg">
        <path d="M10 12 L18 8 L26 12 L18 16 Z" fill="#FF6B00" />
        <path d="M13 14.5 L13 20 C13 22, 23 22, 23 20 L23 14.5" fill="none" stroke="#111111" strokeWidth="1.5" />
        <text x="34" y="22" fill="#111111" fontFamily="sans-serif" fontSize="13" fontWeight="800">SEED Global</text>
      </svg>
    )
  },
  {
    name: "Unified",
    renderLogo: () => (
      <svg viewBox="0 0 120 35" className="company-logo-svg">
        <circle cx="16" cy="18" r="6" fill="none" stroke="#0891B2" strokeWidth="2" />
        <path d="M16 8 C22 18, 10 18, 16 28" fill="none" stroke="#0891B2" strokeWidth="1.5" />
        <text x="29" y="23" fill="#111111" fontFamily="sans-serif" fontSize="14" fontWeight="900" letterSpacing="0.5px">UNIFIED</text>
      </svg>
    )
  },
  {
    name: "ArConnect",
    renderLogo: () => (
      <svg viewBox="0 0 130 35" className="company-logo-svg">
        <circle cx="16" cy="18" r="6" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="3 2" />
        <text x="28" y="23" fill="#111111" fontFamily="sans-serif" fontSize="14" fontWeight="900">ArConnect</text>
      </svg>
    )
  }
];
*/

const logoItems: LogoItem[] = [
  {
    name: "BNI",
    renderLogo: () => (
      <img src="/images/logos/new/BNI_logo.png" alt="BNI" className="company-logo-img" />
    )
  },
  {
    name: "CDSL",
    renderLogo: () => (
      <img src="/images/logos/new/CDSL Logo.png" alt="CDSL" className="company-logo-img" />
    )
  },
  {
    name: "IBM",
    renderLogo: () => (
      <img src="/images/logos/new/ibm-logo.png" alt="IBM" className="company-logo-img" />
    )
  },
  {
    name: "JSW",
    renderLogo: () => (
      <img src="/images/logos/new/jsw.png" alt="JSW" className="company-logo-img" />
    )
  },
  {
    name: "RXO",
    renderLogo: () => (
      <img src="/images/logos/new/RXO.svg" alt="RXO" className="company-logo-img" />
    )
  },
  {
    name: "Accenture",
    renderLogo: () => (
      <img src="/images/logos/new/Accenture_logo.svg" alt="Accenture" className="company-logo-img" />
    )
  },
  {
    name: "ArConnect",
    renderLogo: () => (
      <img src="/images/logos/arconnect.jpg" alt="ArConnect" className="company-logo-img" />
    )
  },
  {
    name: "Codvo.ai",
    renderLogo: () => (
      <img src="/images/logos/codvo.ai.jpg" alt="Codvo.ai" className="company-logo-img" />
    )
  },
  {
    name: "Concorde",
    renderLogo: () => (
      <img src="/images/logos/concorde.jpg" alt="Concorde" className="company-logo-img" />
    )
  },
  {
    name: "Guidepoint",
    renderLogo: () => (
      <img src="/images/logos/guidepoint.jpg" alt="Guidepoint" className="company-logo-img" />
    )
  },
  {
    name: "Hafele",
    renderLogo: () => (
      <img src="/images/logos/new/haefele_logo.png" alt="Hafele" className="company-logo-img" />
    )
  },
  {
    name: "Intuit",
    renderLogo: () => (
      <svg width="85" height="30" viewBox="0 0 260 53" fill="none" xmlns="http://www.w3.org/2000/svg" className="company-logo-svg">
        <path d="M133.457 30.1055C133.457 42.7658 143.954 52.0264 157.29 52.0264C170.625 52.0264 181.134 42.7658 181.134 30.1055V1.01878H168.221V28.6059C168.221 35.4397 163.482 40.0414 157.255 40.0414C151.028 40.0414 146.289 35.4626 146.289 28.6059V1.01878H133.377L133.457 30.1055ZM215.635 12.6603H231.042V51.0648H243.954V12.6603H259.362V0.995884H215.635V12.6603ZM207.29 0.995884H194.378V51.0648H207.29V0.995884ZM81.2933 12.6603H96.7008V51.0648H109.613V12.6603H125.009V0.995884H81.2933V12.6603ZM13.5502 0.995884H0.638062V51.0648H13.5502V0.995884ZM74.4938 21.9095C74.4938 9.24913 63.9969 0 50.6498 0C37.3026 0 26.8058 9.24913 26.8058 21.9095V51.0648H39.7179V23.4777C39.7179 16.6439 44.457 12.0422 50.6841 12.0422C56.9112 12.0422 61.6503 16.621 61.6503 23.4777V51.0648H74.5624L74.4823 21.9095H74.4938Z" fill="#236CFF"></path>
      </svg>
    )
  },
  {
    name: "Maersk",
    renderLogo: () => (
      <img src="/images/logos/maersk.jpg" alt="Maersk" className="company-logo-img" />
    )
  },
  {
    name: "Neo",
    renderLogo: () => (
      <svg viewBox="0 0 90 35" className="company-logo-svg">
        <rect x="8" y="7" width="36" height="22" rx="6" fill="none" stroke="#6366F1" strokeWidth="2" />
        <text x="15" y="22" fill="#6366F1" fontFamily="sans-serif" fontSize="12" fontWeight="800">neo</text>
        <text x="50" y="23" fill="#111111" fontFamily="'DM Sans', sans-serif" fontSize="14" fontWeight="800">Do Good.</text>
      </svg>
    )
  },
  {
    name: "Pramukh",
    renderLogo: () => (
      <img src="/images/logos/pramukh.jpg" alt="Pramukh" className="company-logo-img" />
    )
  },
  {
    name: "Seed Global Education",
    renderLogo: () => (
      <div className="seed-logo-wrapper">
        <img src="/images/logos/new/seed_logo.png" alt="Seed Cap" className="seed-logo-cap" />
        <span className="seed-logo-text">
          <span className="seed-logo-seed">SEED</span>
          <span className="seed-logo-global"> Global Education</span>
        </span>
      </div>
    )
  },
  {
    name: "Suryoday",
    renderLogo: () => (
      <img src="/images/logos/new/Suryodaylogo_1_1_a157d376fe.webp" alt="Suryoday" className="company-logo-img" />
    )
  },
  {
    name: "Synergy Group",
    renderLogo: () => (
      <img src="/images/logos/new/synergy-logo.webp" alt="Synergy Group" className="company-logo-img" />
    )
  },
  {
    name: "Unified",
    renderLogo: () => (
      <img src="/images/logos/unified.jpg" alt="Unified" className="company-logo-img" />
    )
  },
  {
    name: "WeWork",
    renderLogo: () => (
      <img src="/images/logos/wework.jpg" alt="WeWork" className="company-logo-img" />
    )
  },
  {
    name: "WTW",
    renderLogo: () => (
      <img src="/images/logos/wtw.jpg" alt="WTW" className="company-logo-img" />
    )
  }
];

const CompanyLogoSlider: React.FC = () => {
  // Duplicate logo list to make infinite continuous marquee
  const duplicatedLogos = [...logoItems, ...logoItems, ...logoItems];

  return (
    <div className="company-slider-container">
      <style dangerouslySetInnerHTML={{__html: `
        .company-slider-container {
          background-color: #ffffff;
          padding: 36px 0 28px 0;
          overflow: hidden;
          width: 100%;
          box-sizing: border-box;
        }
        .company-slider-title {
          text-align: center;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 13.5px;
          font-weight: 750;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 32px;
        }
        .company-slider-track-wrap {
          overflow: hidden;
          position: relative;
          width: 100%;
          display: flex;
        }
        /* Gradient mask for smooth fading edges */
        .company-slider-track-wrap::before,
        .company-slider-track-wrap::after {
          content: "";
          height: 100%;
          position: absolute;
          width: clamp(50px, 12vw, 150px);
          z-index: 2;
          pointer-events: none;
        }
        .company-slider-track-wrap::before {
          left: 0;
          top: 0;
          background: linear-gradient(to right, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
        }
        .company-slider-track-wrap::after {
          right: 0;
          top: 0;
          background: linear-gradient(to left, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
        }
        .company-slider-track {
          display: flex;
          width: max-content;
          align-items: center;
          animation: companyMarquee 45s linear infinite;
          will-change: transform;
        }
        .company-logo-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 0;
          margin-right: clamp(55px, 8vw, 85px);
        }
        .company-logo-svg,
        .company-logo-img {
          height: clamp(34px, 5.5vw, 42px);
          width: auto;
          max-width: 190px;
          object-fit: contain;
        }
        /* Fine-tune individual logo sizes for perfect visual balance */
        .company-logo-ibm img, .company-logo-ibm svg {
          transform: scale(1.65);
        }
        .company-logo-wtw img, .company-logo-wtw svg {
          transform: scale(1.25);
        }
        .company-logo-bni img, .company-logo-bni svg {
          transform: scale(0.85);
        }
        .company-logo-cdsl img, .company-logo-cdsl svg {
          transform: scale(0.95);
        }
        .company-logo-rxo img, .company-logo-rxo svg {
          transform: scale(0.9);
        }
        .company-logo-codvo-ai img, .company-logo-codvo-ai svg {
          transform: scale(1.65);
        }
        .company-logo-concorde img, .company-logo-concorde svg {
          transform: scale(0.85);
        }
        .company-logo-hafele img, .company-logo-hafele svg {
          transform: scale(0.9);
        }
        .company-logo-intuit img, .company-logo-intuit svg {
          transform: scale(1.25);
        }
        .company-logo-seed-global-education .seed-logo-wrapper {
          transform: scale(1.05);
        }
        .seed-logo-wrapper {
          display: flex;
          align-items: center;
          gap: clamp(6px, 1.2vw, 10px);
          height: clamp(34px, 5.5vw, 42px);
        }
        .seed-logo-cap {
          height: 100%;
          width: auto;
          object-fit: contain;
        }
        .seed-logo-text {
          font-family: 'Inter', sans-serif;
          font-size: clamp(14px, 2.2vw, 19.2px);
          font-weight: 700;
          white-space: nowrap;
          line-height: 1;
          letter-spacing: -0.2px;
        }
        .seed-logo-seed {
          color: #0C8395;
        }
        .seed-logo-global {
          color: #E98039;
        }
        .company-logo-synergy-group img, .company-logo-synergy-group svg {
          transform: scale(1.35);
        }
        .company-logo-wework img, .company-logo-wework svg {
          transform: scale(1.1);
        }
        .company-logo-arconnect img, .company-logo-arconnect svg {
          transform: scale(1.1);
        }
        .company-logo-accenture img, .company-logo-accenture svg {
          transform: scale(1.05);
        }
        @keyframes companyMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333333%, 0, 0);
          }
        }
      `}} />
      <h3 className="company-slider-title">Trusted by Leading Corporates</h3>
      <div className="company-slider-track-wrap">
        <div className="company-slider-track">
          {duplicatedLogos.map((logo, idx) => (
            <div 
              key={`${idx}-${logo.name}`} 
              className={`company-logo-item company-logo-${logo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} 
              title={logo.name}
            >
              {logo.renderLogo()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyLogoSlider;
