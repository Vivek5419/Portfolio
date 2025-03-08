import Hero from "@/components/hero"
import VideoShowcase from "@/components/video-showcase"
import Skills from "@/components/skills"
import Pricing from "@/components/pricing"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import Menu from "@/components/menu"
import AnimatedBackground from "@/components/animated-background"
import EnsureVideoPosters from "@/components/ensure-video-posters"

export default function Home() {
  // Define video sources to ensure posters are generated
  const videoSources = [
    "/videos/main-showcase.mp4",
    "/videos/short-sample-1.mp4",
    "/videos/short-sample-2.mp4",
    "/videos/short-sample-3.mp4",
  ]

  return (
    <main className="min-h-screen text-white">
      <AnimatedBackground />
      <Menu />
      <Hero />
      <VideoShowcase />
      <Skills />
      <Pricing />
      <Contact />
      <Footer />

      {/* Component to ensure videos have posters */}
      <EnsureVideoPosters videoSources={videoSources} />
    </main>
  )
}
