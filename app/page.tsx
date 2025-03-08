import Hero from "@/components/hero"
import VideoShowcase from "@/components/video-showcase"
import Skills from "@/components/skills"
import Pricing from "@/components/pricing"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import Menu from "@/components/menu"
import AnimatedBackground from "@/components/animated-background"

export default function Home() {
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
    </main>
  )
}

