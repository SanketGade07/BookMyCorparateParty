import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Book Corporate Party Venues in 30 Minutes | Free for HR Teams",
  description: "Planning a corporate party? Submit one enquiry and get 3–5 curated venue options with pricing in 30 minutes. Free for HR and Admin teams. No cold calls.",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Unbounded:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
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
