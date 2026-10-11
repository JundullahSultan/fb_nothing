import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowDownLeft, Youtube, Facebook } from 'lucide-react';
import { SOCIAL_LINKS } from '../lib/constants';

/* ==========================================================================
   DECORATIVE ASSETS & ICONS
   All decorative elements carry aria-hidden="true" for accessibility.
   ========================================================================== */

function BarcodeSVG() {
  return (
    <svg
      viewBox="0 0 100 28"
      className="h-7 w-24 text-[var(--poster-ink)]"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="2" height="28" />
      <rect x="4" y="0" width="1" height="28" />
      <rect x="7" y="0" width="3" height="28" />
      <rect x="12" y="0" width="1.5" height="28" />
      <rect x="15" y="0" width="4" height="28" />
      <rect x="21" y="0" width="1" height="28" />
      <rect x="24" y="0" width="2.5" height="28" />
      <rect x="28" y="0" width="1" height="28" />
      <rect x="31" y="0" width="3.5" height="28" />
      <rect x="36" y="0" width="1.5" height="28" />
      <rect x="40" y="0" width="2" height="28" />
      <rect x="44" y="0" width="4" height="28" />
      <rect x="50" y="0" width="1" height="28" />
      <rect x="53" y="0" width="2" height="28" />
      <rect x="57" y="0" width="3" height="28" />
      <rect x="62" y="0" width="1" height="28" />
      <rect x="65" y="0" width="2.5" height="28" />
      <rect x="70" y="0" width="4" height="28" />
      <rect x="76" y="0" width="1" height="28" />
      <rect x="79" y="0" width="3" height="28" />
      <rect x="84" y="0" width="1.5" height="28" />
      <rect x="88" y="0" width="2" height="28" />
      <rect x="92" y="0" width="3.5" height="28" />
      <rect x="98" y="0" width="2" height="28" />
    </svg>
  );
}

function CheckerboardGrid() {
  return (
    <div className="grid grid-cols-4 gap-0.5 w-6 h-4.5" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 ${
            (Math.floor(i / 4) + (i % 4)) % 2 === 0
              ? 'bg-[var(--poster-ink)]'
              : 'bg-transparent'
          }`}
        />
      ))}
    </div>
  );
}

function Sparkle({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function WireframeSphere({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4.5" ry="10" />
      <path d="M2 12h20" />
      <path d="M4.5 6.5h15" />
      <path d="M4.5 17.5h15" />
    </svg>
  );
}

/* ==========================================================================
   PLATFORM DATA
   Exact texts, links and IDs matching existing codebase.
   ========================================================================== */

interface PlatformItem {
  number: string;
  title: string;
  description: string;
  linkText: string;
  url: string;
  icon: 'youtube' | 'tiktok' | 'facebook';
}

const PLATFORMS: PlatformItem[] = [
  {
    number: '01',
    title: 'YouTube Official',
    description:
      'Full-length match highlights, gaming sessions, and deep-dive community streams.',
    linkText: 'Watch on YouTube',
    url: SOCIAL_LINKS.youtube,
    icon: 'youtube',
  },
  {
    number: '02',
    title: 'TikTok Shorts',
    description:
      'Fast-paced gaming clips, daily lifestyle, cars, and behind-the-scenes moments.',
    linkText: 'Follow on TikTok',
    url: SOCIAL_LINKS.tiktok,
    icon: 'tiktok',
  },
  {
    number: '03',
    title: 'Facebook Community',
    description:
      'The primary gathering ground for news, live tournament updates, and discussions.',
    linkText: 'Join on Facebook',
    url: SOCIAL_LINKS.facebook,
    icon: 'facebook',
  },
];

/* ==========================================================================
   CONTENT COMPONENT (Section 3: Gaming & Media)
   Styled in the editorial aesthetic of the reference poster card.
   ========================================================================== */

export default function Content() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Subtle one-time IntersectionObserver reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="content"
      className="relative z-10 w-full min-h-[100vh] min-h-[100dvh] py-0 px-0 bg-neutral-900 text-neutral-900 flex flex-col"
    >
      <div className="w-full overflow-x-clip flex-1 flex flex-col">
        {/* EDITORIAL POSTER CARD - full bleed reaching screen edges */}
        <div
          className="relative w-full flex-1 flex flex-col bg-[var(--poster-bg,#f5ebe0)] shadow-2xl shadow-black/60 overflow-hidden text-[var(--poster-ink,#0b1c31)]"
          style={{
            color: 'var(--poster-ink, #0b1c31)',
          }}
        >
          {/* Subtle paper grain texture via SVG feTurbulence */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.045] mix-blend-multiply"
            aria-hidden="true"
          >
            <filter id="poster-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.75"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#poster-grain)" />
          </svg>

          {/* Card Outer Inset Padding (~14px frame margin) */}
          <div className="relative p-2.5 sm:p-3.5 md:p-[14px]">
            {/* Inner Outline Frame with 1px border and opposite corner diagonal arrows */}
            <div className="relative border border-[var(--poster-ink)]/60 rounded-[calc(var(--frame-radius,20px)-6px)] overflow-hidden flex flex-col">
              {/* Corner Diagonal Arrows (Top-Right & Bottom-Left) */}
              <div
                className="absolute top-2.5 right-2.5 pointer-events-none z-30"
                aria-hidden="true"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--poster-ink)]/80" />
              </div>
              <div
                className="absolute bottom-2.5 left-2.5 pointer-events-none z-30 hidden sm:block"
                aria-hidden="true"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-[var(--poster-ink)]/80" />
              </div>

              {/* ==============================================================
                  TOP BAND: Barcode, Numbers, Pill Tag, Headline Word "MEDIA"
                  ============================================================== */}
              <div
                className={`p-5 sm:p-7 lg:p-8 transition-all duration-700 ease-out ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  {/* Left Column: Intro & Barcode */}
                  <div className="hidden sm:flex flex-col justify-between gap-2.5 min-w-[130px]">
                    <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--poster-muted)]">
                      ARCHIVE // 2026
                    </div>
                    <div aria-hidden="true">
                      <BarcodeSVG />
                    </div>
                  </div>

                  {/* Center-Left: Big bold number 03 + PLATFORMS */}
                  <div className="hidden md:flex items-baseline gap-2">
                    <span className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter text-[var(--poster-ink)] leading-none select-none">
                      03
                    </span>
                    <span className="text-[9px] uppercase font-extrabold tracking-[0.25em] text-[var(--poster-muted)]">
                      PLATFORMS
                    </span>
                  </div>

                  {/* Center: Pill tag + Eyebrow paragraph */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-3 max-w-md">
                    <div className="inline-flex items-center rounded-full border border-[var(--poster-ink)] px-3.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--poster-ink)]">
                      GAMING & MEDIA
                    </div>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--poster-muted)]">
                      Connecting with thousands across the gaming community
                      through competitive gameplay, candid moments, and shared
                      milestones.
                    </p>
                  </div>

                  {/* Checkerboard + dimension tag (matching poster) */}
                  <div
                    className="hidden xl:flex flex-col items-start gap-1.5"
                    aria-hidden="true"
                  >
                    <CheckerboardGrid />
                    <span className="text-[9px] font-mono tracking-widest text-[var(--poster-muted)]">
                      1080 px / 1920 px
                    </span>
                  </div>

                  {/* Right: Huge heavy word MEDIA */}
                  <div
                    className="flex items-start justify-end gap-1 select-none"
                    aria-hidden="true"
                  >
                    <span className="text-[clamp(3.5rem,7.5vw,8.5rem)] font-extrabold tracking-tighter uppercase text-[var(--poster-ink)] leading-none">
                      MEDIA
                    </span>
                    <div className="flex flex-col items-center gap-1 pt-1 text-[var(--poster-ink)]">
                      <span className="text-xs font-bold leading-none">©</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ==============================================================
                  MIDDLE BAND: Full-Width Photo Slot (Flexible Height & Face Crop)
                  ============================================================== */}
              <div
                className={`relative w-full h-[calc(100vh-280px)] h-[calc(100dvh-280px)] min-h-[250px] max-h-[520px] overflow-hidden bg-neutral-900 border-y border-[var(--poster-ink)]/20 transition-all duration-700 ease-out delay-100 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <img
                  src="/images/media-photo.png"
                  alt="FB Nothing portrait"
                  width={1024}
                  height={575}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full"
                  style={{
                    objectFit: 'cover',
                    objectPosition: '51% 32%',
                    transform: 'scale(2.35)',
                    transformOrigin: '51% 32%',
                  }}
                />

                {/* Light tint overlay matching the website's brand colors */}
                <div
                  className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-[0.09] bg-gradient-to-tr from-[#0b1c31] via-transparent to-[#1774c8]"
                  aria-hidden="true"
                />

                {/* Subtle inner edge shading */}
                <div
                  className="absolute inset-0 pointer-events-none shadow-[inset_0_0_24px_rgba(0,0,0,0.18)]"
                  aria-hidden="true"
                />
              </div>

              {/* ==============================================================
                  BOTTOM BAND: H2 Title, Sparkles, Channels Grid, "FOLLOW."
                  ============================================================== */}
              <div
                className={`p-5 sm:p-7 lg:p-8 flex flex-col gap-8 lg:gap-10 transition-all duration-700 ease-out delay-200 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                {/* Header Row: Heading H2 + Sparkles + FOLLOW. display text (Desktop) */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[var(--poster-ink)]/20 pb-6 sm:pb-8">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Eyebrow and 3 Sparkles */}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] uppercase text-[var(--poster-ink)]">
                        COMMUNITY
                      </span>
                      <div
                        className="flex items-center gap-1.5 text-[var(--poster-accent)]"
                        aria-hidden="true"
                      >
                        <Sparkle className="w-3.5 h-3.5 fill-current" />
                        <Sparkle className="w-3.5 h-3.5 fill-current" />
                        <Sparkle className="w-3.5 h-3.5 fill-current" />
                      </div>
                    </div>

                    {/* Single H2 Element for Accessibility */}
                    <h2
                      className="text-[clamp(2.1rem,4.8vw,4.75rem)] font-normal leading-[1.05] tracking-tight text-[var(--poster-ink)]"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      <span className="block italic">PUBG Roots,</span>
                      <span className="block italic text-[var(--poster-accent)]">
                        Endless Energy.
                      </span>
                    </h2>
                  </div>

                  {/* Desktop Right side: Wireframes and decorative FOLLOW. word */}
                  <div
                    className="hidden lg:flex items-end justify-end gap-6 sm:gap-8"
                    aria-hidden="true"
                  >
                    <div className="flex items-center gap-3 text-[var(--poster-ink)]/60">
                      <WireframeSphere className="w-6 h-6 animate-[spin_20s_linear_infinite] motion-reduce:animate-none" />
                      <WireframeSphere className="w-6 h-6" />
                    </div>
                    <div className="flex items-baseline gap-1 select-none">
                      <span className="text-[clamp(1.75rem,3.8vw,3.75rem)] font-extrabold tracking-tighter uppercase text-[var(--poster-ink)] leading-none">
                        FOLLOW.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Platforms Grid: 3 columns on desktop, stacked on mobile/tablet */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {PLATFORMS.map((platform) => (
                    <div
                      key={platform.number}
                      className="border-t border-[var(--poster-ink)]/30 pt-4 flex flex-col justify-between"
                    >
                      <div>
                        {/* Number + Outline Icon */}
                        <div className="flex items-center justify-between text-[var(--poster-ink)] mb-2.5">
                          <span className="text-sm font-extrabold tracking-wider">
                            {platform.number}
                          </span>
                          <div className="text-[var(--poster-ink)]/80">
                            {platform.icon === 'youtube' && (
                              <Youtube className="w-4 h-4" />
                            )}
                            {platform.icon === 'tiktok' && (
                              <TikTokIcon className="w-4 h-4" />
                            )}
                            {platform.icon === 'facebook' && (
                              <Facebook className="w-4 h-4" />
                            )}
                          </div>
                        </div>

                        {/* Platform Name H3 */}
                        <h3 className="font-extrabold uppercase tracking-tight text-base sm:text-lg text-[var(--poster-ink)]">
                          {platform.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--poster-muted)] mt-1.5 mb-5">
                          {platform.description}
                        </p>
                      </div>

                      {/* Link Row: Nudges arrow 3px up-right and draws underline */}
                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-between w-full pt-3 border-t border-[var(--poster-ink)]/15 text-xs font-bold uppercase tracking-wider text-[var(--poster-ink)] hover:text-[var(--poster-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors"
                      >
                        <span className="border-b border-transparent group-hover:border-current transition-all">
                          {platform.linkText}
                        </span>
                        <ArrowUpRight
                          className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  ))}
                </div>

                {/* Mobile / Tablet FOLLOW. word placed after platform items */}
                <div
                  className="flex lg:hidden items-center justify-between pt-4 border-t border-[var(--poster-ink)]/20"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-2 text-[var(--poster-ink)]/60">
                    <WireframeSphere className="w-5 h-5 animate-[spin_20s_linear_infinite] motion-reduce:animate-none" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tighter uppercase text-[var(--poster-ink)] select-none">
                    FOLLOW.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
