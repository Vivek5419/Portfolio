import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vivek | YouTube Shorts Editor",
  description: "Professional YouTube Shorts editor showcasing editing skills and visual storytelling",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
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
              background-color: rgba(10,18,18,0.75) !important;
            }
            .menu-backdrop {
              background-color: rgba(10, 10, 10, 0.65) !important;
            }
          }
          
          /* Ensure video thumbnails are visible */
          video {
            background-color: #1a1a1a;
          }

          /* Force blur effects for loading animation */
          .loading-blur-background {
            -webkit-backdrop-filter: blur(15px) !important;
            backdrop-filter: blur(15px) !important;
            transform: translateZ(0);
            will-change: backdrop-filter;
            backface-visibility: hidden;
          }

          /* Fix for mobile viewport issues */
          body {
            width: 100%;
            max-width: 100vw;
            overflow-x: hidden;
          }

          /* Fix for menu container on small screens */
          @media (max-width: 360px) {
            .menu-container {
              max-width: 98%;
            }
            .menu-container button {
              padding: 0.25rem 0.5rem;
              font-size: 0.75rem;
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
              
              // Ensure video thumbnails are visible
              const videos = document.querySelectorAll('video');
              videos.forEach(function(video) {
                if (!video.poster || video.poster === "") {
                  video.poster = "/placeholder.svg?height=720&width=405&text=Video";
                }
                video.preload = "none";
                video.load();
              });

              // Force repaint for loading animation blur backgrounds
              const loadingBlurs = document.querySelectorAll('.loading-blur-background');
              loadingBlurs.forEach(function(element) {
                // Force a repaint by temporarily modifying a property
                element.style.opacity = '0.99';
                setTimeout(function() {
                  element.style.opacity = '1';
                }, 0);
              });

              // Fix for menu container width on different screen sizes
              function adjustMenuWidth() {
                const menuContainer = document.querySelector('.menu-container');
                if (menuContainer) {
                  const viewportWidth = window.innerWidth;
                  if (viewportWidth < 360) {
                    menuContainer.style.maxWidth = '98%';
                  } else if (viewportWidth < 640) {
                    menuContainer.style.maxWidth = '95%';
                  } else {
                    menuContainer.style.maxWidth = '90%';
                  }
                }
              }
              
              // Run on load and resize
              adjustMenuWidth();
              window.addEventListener('resize', adjustMenuWidth);
            });
          `}
        </Script>

        {/* Script to ensure thumbnails are visible */}
        <Script src="/ensure-thumbnails.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
