import type { Metadata } from "next"; import { Inter } from "next/font/google"; import "./globals.css"; import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = { title: "Vivek | YouTube Shorts Editor", description: "Professional YouTube Shorts editor showcasing editing skills and visual storytelling", };

export default function RootLayout({ children }: { children: React.ReactNode }) { return ( <html lang="en" className="dark"> <head> <meta
name="viewport"
content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
/> <meta name="theme-color" content="#000000" /> </head> <body className={inter.className}> {/* Google Analytics */} <Script
strategy="afterInteractive"
src="https://www.googletagmanager.com/gtag/js?id=G-HX53G7NGPX"
/> <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-HX53G7NGPX');, }} />

{children}

    {/* Enhance blur effects */}
    <Script id="enhance-blur" strategy="afterInteractive">
      {`
        document.addEventListener('touchstart', function(e) {
          if (e.touches.length > 1) {
            e.preventDefault();
          }
        }, { passive: false });
        
        document.addEventListener('DOMContentLoaded', function() {
          document.body.style.transform = 'translateZ(0)';
        });
      `}
    </Script>

    {/* Script to ensure thumbnails are visible */}
    <Script src="/ensure-thumbnails.js" strategy="beforeInteractive" />
  </body>
</html>

); }

