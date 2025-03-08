import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vivek | YouTube Shorts Editor",
  description: "Professional YouTube Shorts editor showcasing editing skills and visual storytelling",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          /* Force blur effects to be applied across all browsers */
          .apple-blur, .apple-blur-light, .apple-blur-heavy, .menu-backdrop {
            -webkit-backdrop-filter: blur(35px) !important;
            backdrop-filter: blur(35px) !important;
            transform: translateZ(0);
            will-change: transform, backdrop-filter;
            backface-visibility: hidden;
          }
          
          /* Safari-specific enhancements */
          @supports (-webkit-backdrop-filter: none) {
            .apple-blur {
              background-color: rgba(18, 18, 18, 0.25) !important;
            }
            .apple-blur-light {
              background-color: rgba(18, 18, 18, 0.2) !important;
            }
            .apple-blur-heavy {
              background-color: rgba(18, 18, 18, 0.35) !important;
            }
            .menu-backdrop {
              background-color: rgba(10, 10, 10, 0.3) !important;
            }
          }
          
          /* Firefox fallback (since it doesn't support backdrop-filter well) */
          @-moz-document url-prefix() {
            .apple-blur {
              background-color: rgba(18, 18, 18, 0.65) !important;
            }
            .apple-blur-light {
              background-color: rgba(18, 18, 18, 0.55) !important;
            }
            .apple-blur-heavy {
              background-color: rgba(18, 18, 18, 0.75) !important;
            }
            .menu-backdrop {
              background-color: rgba(10, 10, 10, 0.65) !important;
            }
          }
        `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}

        <Script id="enhance-blur" strategy="afterInteractive">
          {`
            document.addEventListener('touchstart', function(e) {
              if (e.touches.length > 1) {
                e.preventDefault();
              }
            }, { passive: false });
            
            // Force repaint to ensure blur effects are applied correctly
            document.addEventListener('DOMContentLoaded', function() {
              // Force hardware acceleration
              document.body.style.transform = 'translateZ(0)';
              
              // Apply blur effects to all elements with apple-blur classes
              const blurElements = document.querySelectorAll('.apple-blur, .apple-blur-light, .apple-blur-heavy, .menu-backdrop');
              blurElements.forEach(function(element) {
                // Force a repaint by temporarily modifying a property
                element.style.opacity = '0.99';
                setTimeout(function() {
                  element.style.opacity = '1';
                }, 0);
              });
            });
          `}
        </Script>
      </body>
    </html>
  )
}



import './globals.css'