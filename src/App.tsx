import { useEffect, useState, type CSSProperties } from 'react'
import { images } from './data/images'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useParallax } from './hooks/useParallax'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/home/Hero'
import FeatureStrip from './components/sections/FeatureStrip'
import About from './components/sections/About'
import Projects from './components/projects/Projects'
import Skills from './components/sections/Skills'
import Process from './components/sections/Process'
import Experience from './components/sections/Experience'
import Proof from './components/sections/Proof'
import Lab from './components/sections/Lab'
import Contact from './components/sections/Contact'
import './App.css'
import './styles/animations.css'

export default function App() {
  const [activeSection, setActiveSection] = useState('home')
  const scrollProgress = useScrollProgress()
  const backgroundRef = useParallax<HTMLDivElement>(0.012)

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { threshold: [0.16, 0.3, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div
      className="site"
      style={{
        '--scroll-progress': scrollProgress,
        '--background-image': `url("${images.background}")`,
      } as CSSProperties}
    >
      <a className="skip-link" href="#main-content">Bỏ qua đến nội dung</a>
      <div className="scroll-progress" aria-hidden="true"><span /></div>
      <div className="site-bg" ref={backgroundRef} />

      <Navbar activeSection={activeSection} onNavigate={navigate} />

      <main id="main-content">
        <Hero onNavigate={navigate} />
        <FeatureStrip />
        <About />
        <Projects onContact={() => navigate('contact')} />
        <Skills />
        <Process />
        <Experience />
        <Proof />
        <Lab />
        <Contact />
      </main>

      <Footer />

      <button
        className={`back-to-top ${showTop ? 'visible' : ''}`}
        onClick={() => navigate('home')}
        aria-label="Về đầu trang"
        tabIndex={showTop ? 0 : -1}
      >
        ↑
      </button>
    </div>
  )
}
