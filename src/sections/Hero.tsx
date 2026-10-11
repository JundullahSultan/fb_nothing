import { useState } from 'react';
import { ArrowRight, Play, ArrowDown } from 'lucide-react';
import { VERTICAL_KEYWORDS, INDICATORS } from '../lib/constants';

export default function Hero() {
  const [activeIndicator, setActiveIndicator] = useState('01');

  return (
    <section
      id="home"
      className="relative z-10 w-full h-full flex flex-col justify-between px-6 sm:px-10 md:px-14 pt-20 sm:pt-24 pb-10 sm:pb-12 overflow-hidden select-none"
    >
      {/* HERO-CARD CONNECTION: Subtle gradient fade at hero bottom edge */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none z-10 bg-gradient-to-t from-black/[0.04] to-transparent"
        aria-hidden="true"
      />
      {/* Subtle Right-side Vertical Keywords */}
      <div className="absolute right-6 sm:right-10 md:right-14 top-20 sm:top-24 pointer-events-none max-w-7xl">
        <div className="hidden sm:flex flex-col gap-1 text-right text-[9px] sm:text-[10px] tracking-[0.25em] font-medium text-neutral-700/80 uppercase">
          {VERTICAL_KEYWORDS.map((word) => (
            <span key={word}>{word}</span>
          ))}
        </div>
      </div>

      {/* Main Left Content: Editorial Headline, Subtitle, CTAs */}
      <div className="w-full max-w-7xl mx-auto mt-3 sm:mt-5 md:mt-6 mb-auto flex flex-col justify-start">
        <div className="max-w-md sm:max-w-lg">
          {/* Subheading / Category Tagline */}
          <div className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase font-semibold text-neutral-600 mb-3 sm:mb-4 flex items-center gap-2">
            <span>GAMING</span>
            <span className="text-neutral-400">—</span>
            <span>FASHION</span>
            <span className="text-neutral-400">—</span>
            <span>BUSINESS</span>
          </div>

          {/* Main Title: Exact 3 Lines with Editorial Typography */}
          <h1
            className="text-[34px] sm:text-[44px] md:text-[50px] lg:text-[54px] font-normal leading-[1.06] tracking-[-0.015em] text-neutral-900"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            <span className="block">The World</span>
            <span className="block">of</span>
            <span className="block text-[#1774c8]">Nothing.</span>
          </h1>

          {/* Supporting Paragraph */}
          <p className="text-[12px] sm:text-[13px] leading-relaxed text-neutral-600 font-normal mt-4 sm:mt-5 mb-6 sm:mb-7 max-w-[360px] sm:max-w-[420px]">
            From PUBG to fashion and a new chapter in cars. Explore my businesses,
            discover my content, and be part of the journey.
          </p>

          {/* Main Buttons: Explore My Businesses + Watch My Content */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-5">
            {/* Primary Action Button */}
            <a
              href="#businesses"
              className="inline-flex items-center gap-2 bg-[#1474c6] hover:bg-[#1062a8] text-white px-5 sm:px-6 py-2.5 rounded-full text-[12px] tracking-wide font-medium shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer group shrink-0"
            >
              <span>Explore My Businesses</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>

            {/* Watch Content Button */}
            <a
              href="#content"
              className="inline-flex items-center gap-2.5 text-neutral-800 hover:text-neutral-950 text-[12px] font-medium transition-colors cursor-pointer group shrink-0"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-neutral-300 flex items-center justify-center bg-white/40 backdrop-blur-xs group-hover:border-neutral-700 group-hover:bg-white transition-all shadow-2xs">
                <Play className="w-3 h-3 fill-neutral-800 text-neutral-800 ml-0.5" />
              </span>
              <span className="tracking-wide">Watch My Content</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Indicators (Left) & Discover My World (Right) */}
      <div className="w-full max-w-7xl mx-auto flex items-end justify-between pt-6 sm:pt-4">
        {/* Bottom-left Indicators: 01 / ME, 02 / FASHION, 03 / CARS */}
        <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-medium tracking-widest text-neutral-400">
          {INDICATORS.map((item) => {
            const isActive = activeIndicator === item.number;
            return (
              <a
                key={item.number}
                href={item.href}
                onClick={() => setActiveIndicator(item.number)}
                className={`relative pb-2 cursor-pointer transition-colors ${
                  isActive ? 'text-neutral-900 font-semibold' : 'hover:text-neutral-700'
                }`}
              >
                {/* Full label on sm+ screens, compact number on mobile */}
                <span className="hidden sm:inline">{item.fullLabel}</span>
                <span className="sm:hidden">{item.shortLabel}</span>

                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 rounded-full" />
                )}
              </a>
            );
          })}
        </div>

        {/* Bottom-right Scroll Indicator: DISCOVER MY WORLD */}
        <a
          href="#businesses"
          className="flex items-center gap-2 text-neutral-700 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium cursor-pointer hover:text-neutral-950 transition-colors"
        >
          <span>DISCOVER MY WORLD</span>
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-neutral-300 flex items-center justify-center bg-white/40 backdrop-blur-xs">
            <ArrowDown className="w-3 h-3" />
          </div>
        </a>
      </div>
    </section>
  );
}
