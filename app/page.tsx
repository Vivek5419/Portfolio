import Hero from "@/components/hero"
import VideoShowcase from "@/components/video-showcase"
import Skills from "@/components/skills"
import Pricing from "@/components/pricing"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import Menu from "@/components/menu"
import AnimatedBackground from "@/components/animated-background"
import StaticVideoThumbnails from "@/components/static-video-thumbnails"

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

      {/* Component to ensure videos have visible thumbnails */}
      <StaticVideoThumbnails />
    </main>
  )
}
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-HX53G7NGPX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-HX53G7NGPX');
</script>
