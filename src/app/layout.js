import { DM_Sans, Playfair_Display, Unbounded } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700"],
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  weight: ["400", "700", "800"],
});

export const metadata = {
  title: "Book Corporate Party Venues in 30 Minutes | Free for HR Teams",
  description: "Planning a corporate party? Submit one enquiry and get 3–5 curated venue options with pricing in 30 minutes. Free for HR and Admin teams. No cold calls.",
  icons: {
    icon: "/images/logo-lg.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${unbounded.variable}`}>
      <body style={{ fontFamily: "var(--font-dm-sans), sans-serif", margin: 0 }}>
        {children}
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-Z4D7SK0ZCF"
        strategy="afterInteractive"
      />
      <Script id="google-tags" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Z4D7SK0ZCF');
          gtag('config', 'AW-17399689995');
        `}
      </Script>
    </html>
  );
}
