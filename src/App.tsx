import { useState, useEffect, useRef } from 'react';
import { useVideoScrub } from './hooks/useVideoScrub';
import { HERO_VIDEO_SRC } from './lib/constants';
import Navbar from './components/layout/Navbar';
import MobileMenu from './components/layout/MobileMenu';
import Hero from './sections/Hero';
import Businesses from './sections/Businesses';
import Content from './sections/Content';
import Products from './sections/Products';
import Contact from './sections/Contact';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeroActive, setIsHeroActive] = useState(true);
  const heroWrapperRef = useRef<HTMLDivElement>(null);

  // Hook receives isHeroActive: when false (<10% visible), mouse scrubbing and rAF loop stop completely
  const { videoRef, handleSeeked, handleLoadedMetadata } = useVideoScrub(isHeroActive);

  // IntersectionObserver on Section 2 (stops animation when >= 90% covering hero)
  useEffect(() => {
    const section2 = document.getElementById('businesses');
    if (!section2) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When Section 2 reaches the very top of the viewport, it has fully covered the hero.
        setIsHeroActive(!entry.isIntersecting);
      },
      { rootMargin: '0px 0px -100% 0px', threshold: 0 }
    );

    observer.observe(section2);
    return () => observer.disconnect();
  }, []);

  /* HERO-COVER-EFFECT: Dim and scale the hero as Section 2 slides over it */
  useEffect(() => {
    const handleScroll = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || !heroWrapperRef.current) return;

      requestAnimationFrame(() => {
        if (!heroWrapperRef.current) return;
        const scrollY = window.scrollY;
        const vh = window.innerHeight;
        
        // Progress from 0 (top of page) to 1 (scrolled 100vh down)
        const progress = Math.min(Math.max(scrollY / vh, 0), 1);
        
        // Scale from 1 to 0.97
        const scale = 1 - (progress * 0.03);
        // Opacity from 1 to 0.85
        const opacity = 1 - (progress * 0.15);
        
        heroWrapperRef.current.style.transform = `scale(${scale})`;
        heroWrapperRef.current.style.opacity = `${opacity}`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-neutral-900">
      {/* Navigation Bar */}
      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Pinned Hero Section Container */}
      <div 
        className="sticky top-0 h-[100vh] h-[100svh] w-full z-0 overflow-hidden"
        style={{
          visibility: isHeroActive ? 'visible' : 'hidden',
        }}
      >
        <div 
          ref={heroWrapperRef} 
          className="w-full h-full origin-top"
          style={{
            borderRadius: 'var(--frame-radius, clamp(16px, 2vw, 28px))',
            overflow: 'hidden'
          }}
        >
          {/* BACKGROUND VIDEO (mouse-scrub controlled behind hero) */}
          <video
            ref={videoRef}
            src={HERO_VIDEO_SRC}
            muted
            playsInline
            preload="auto"
            onSeeked={handleSeeked}
            onLoadedMetadata={handleLoadedMetadata}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{
              objectPosition: '70% center',
            }}
          />

          {/* Atmospheric light gradient overlay on the left for hero readability */}
          <div
            className="absolute inset-0 pointer-events-none z-1"
            style={{
              background:
                'linear-gradient(to right, rgba(255, 255, 255, 0.94) 0%, rgba(255, 255, 255, 0.82) 32%, rgba(255, 255, 255, 0.42) 54%, rgba(255, 255, 255, 0) 74%)',
            }}
          />

          {/* Hero Content */}
          <Hero />
        </div>
      </div>

      {/* Section 2: Scroll-driven Image Sequence (500vh sticky canvas) */}
      <Businesses />

      {/* Gaming & Media Content */}
      <Content />

      {/* Featured Products */}
      <Products />

      {/* Contact & Inquiries (Full-screen contact page with integrated footer) */}
      <Contact />
    </div>
  );
}
