import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Star } from 'lucide-react';
import { PRODUCTS, PRODUCTS_HEADER, AUTOPLAY } from '../lib/products';

export default function Products() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const total = PRODUCTS.length;

  // Touch & Pointer swipe tracking (passive and non-blocking)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const prevProduct = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const nextProduct = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Autoplay handler (respects prefers-reduced-motion and hover/focus pause)
  useEffect(() => {
    if (!AUTOPLAY || isPaused) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      nextProduct();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextProduct]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevProduct();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextProduct();
    }
  };

  // Touch gestures for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
    const diffY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Trigger only if horizontal swipe dominates vertical scroll
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        prevProduct();
      } else {
        nextProduct();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Toggle favorite / wishlist heart locally
  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Smooth scroll to contact section for product inquiries
  // (NOTE: There is no shopping cart on this website. Both buttons scroll smoothly to #contact for product inquiries.)
  const handleProductAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="products"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="relative z-10 w-full py-20 sm:py-28 overflow-x-clip select-none outline-none focus-visible:ring-2 focus-visible:ring-[#b89a74]"
      style={{
        backgroundColor: 'var(--products-bg, #f5ebe0)',
        backgroundImage: 'url(/images/products/background.webp)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* Soft gradient fade at bottom edge to seamlessly blend into Section 5 (Contact) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 sm:h-28 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--contact-bg, #fbf8f3))',
        }}
        aria-hidden="true"
      />

      {/* Visually hidden live region announcing current product to screen readers */}
      <div className="sr-only" aria-live="polite">
        {PRODUCTS[activeIndex].name} selected. Item {activeIndex + 1} of {total}.
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 relative z-20">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-semibold block mb-2 sm:mb-3"
            style={{ color: 'var(--products-text-muted, #8f7a62)' }}
          >
            {PRODUCTS_HEADER.eyebrow}
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal leading-[1.08] tracking-tight mb-3"
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'var(--products-text-dark, #3b2f26)',
            }}
          >
            {PRODUCTS_HEADER.title}
          </h2>
          <p
            className="text-xs sm:text-[13px] md:text-sm font-normal"
            style={{ color: 'var(--products-text-muted, #8f7a62)' }}
          >
            {PRODUCTS_HEADER.subtitle}
          </p>
        </div>

        {/* Carousel Viewport & Controls */}
        <div
          className="relative w-full flex items-center justify-center touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={prevProduct}
            aria-label="Previous product"
            className="absolute left-1 sm:left-3 md:left-6 lg:left-8 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 text-[#3b2f26] shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#b89a74] cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={nextProduct}
            aria-label="Next product"
            className="absolute right-1 sm:right-3 md:right-6 lg:right-8 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 text-[#3b2f26] shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#b89a74] cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Carousel Cards Stage */}
          <div className="relative w-full h-[470px] sm:h-[500px] md:h-[530px] flex items-center justify-center">
            {PRODUCTS.map((product, index) => {
              // Compute circular relative offset (-2, -1, 0, 1, 2)
              let offset = (index - activeIndex) % total;
              if (offset > 2) offset -= total;
              if (offset < -2) offset += total;

              const isCenter = offset === 0;
              const isLiked = !!likedMap[product.id];

              // Inline transform & visibility styles based on offset
              let transform = '';
              let opacity = 1;
              let zIndex = 10;
              let visibility: 'visible' | 'hidden' = 'visible';
              let pointerEvents: 'auto' | 'none' = 'auto';

              if (offset === 0) {
                // Center active card
                transform = 'translateX(0) scale(1) translateY(0)';
                opacity = 1;
                zIndex = 25;
              } else if (offset === -1) {
                // Left neighbor
                transform = 'translateX(-106%) scale(0.92) translateY(12px)';
                opacity = 0.92;
                zIndex = 20;
              } else if (offset === 1) {
                // Right neighbor
                transform = 'translateX(106%) scale(0.92) translateY(12px)';
                opacity = 0.92;
                zIndex = 20;
              } else if (offset === -2) {
                // Outer left card (desktop only)
                transform = 'translateX(-212%) scale(0.84) translateY(24px)';
                opacity = 0.82;
                zIndex = 15;
              } else if (offset === 2) {
                // Outer right card (desktop only)
                transform = 'translateX(212%) scale(0.84) translateY(24px)';
                opacity = 0.82;
                zIndex = 15;
              } else {
                visibility = 'hidden';
                pointerEvents = 'none';
                opacity = 0;
              }

              return (
                <div
                  key={product.id}
                  onClick={() => setActiveIndex(index)}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${total}: ${product.name}`}
                  aria-hidden={!isCenter}
                  style={{
                    transform,
                    opacity,
                    zIndex,
                    visibility,
                    pointerEvents,
                    borderRadius: 'var(--frame-radius, clamp(16px, 2vw, 28px))',
                    backgroundColor: 'var(--products-card-bg, #fffbf5)',
                    borderColor: 'var(--products-card-border, rgba(143, 122, 98, 0.14))',
                  }}
                  className={`absolute w-[220px] sm:w-[240px] md:w-[260px] lg:w-[270px] p-4 sm:p-5 flex flex-col justify-between border shadow-[0_12px_32px_rgba(59,47,38,0.08)] cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isCenter ? 'ring-1 ring-[#b89a74]/30' : ''
                  }`}
                >
                  {/* Top Bar: Badge pill on left, heart on right */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{
                        backgroundColor: 'var(--products-badge-bg, #eddccb)',
                        color: 'var(--products-text-dark, #3b2f26)',
                      }}
                      className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase font-mono"
                    >
                      {product.badge}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => toggleLike(product.id, e)}
                      aria-label={isLiked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-rose-500 transition-colors focus-visible:ring-2 focus-visible:ring-[#b89a74] cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'hover:scale-105'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Image */}
                  <div className="w-full h-36 sm:h-44 md:h-48 flex items-center justify-center p-2 my-1">
                    <img
                      src={product.image}
                      alt={product.imageAlt}
                      width="800"
                      height="800"
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain drop-shadow-[0_8px_16px_rgba(59,47,38,0.12)] transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Product Info & Action */}
                  <div className="mt-2 pt-2 border-t border-[#8f7a62]/10">
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        color: 'var(--products-text-dark, #3b2f26)',
                      }}
                      className="text-base sm:text-lg font-medium leading-snug line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{ color: 'var(--products-text-muted, #8f7a62)' }}
                      className="text-[11px] sm:text-xs leading-relaxed line-clamp-2 mt-1 min-h-[30px]"
                    >
                      {product.description}
                    </p>

                    {/* Conditional Star Rating & Review Count (Only rendered when non-null) */}
                    {product.rating !== null && product.reviewCount !== null && (
                      <div className="flex items-center gap-1 mt-2 text-[11px] text-[#8f7a62]">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span className="font-medium text-[#3b2f26]">{product.rating.toFixed(1)}</span>
                        <span>({product.reviewCount})</span>
                      </div>
                    )}

                    {/* Bottom Row: Price & Action Buttons */}
                    <div className="mt-3 pt-2 flex items-center justify-between gap-2">
                      <div>
                        {product.price !== null ? (
                          <span
                            style={{ color: 'var(--products-text-dark, #3b2f26)' }}
                            className="text-sm sm:text-base font-bold tracking-tight block"
                          >
                            {product.price}
                          </span>
                        ) : (
                          <span
                            style={{ color: 'var(--products-text-muted, #8f7a62)' }}
                            className="text-[11px] font-medium tracking-wide uppercase font-mono"
                          >
                            INQUIRE
                          </span>
                        )}
                      </div>

                      {/* Action Button: Pill "Add to Cart" on active card, round button on side cards */}
                      {isCenter ? (
                        <button
                          type="button"
                          onClick={handleProductAction}
                          style={{ backgroundColor: 'var(--products-tan, #b89a74)' }}
                          className="hover:opacity-90 text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium flex items-center gap-1.5 shadow-sm transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3b2f26] cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleProductAction}
                          aria-label={`Inquire about ${product.name}`}
                          style={{
                            backgroundColor: 'var(--products-badge-bg, #eddccb)',
                            color: 'var(--products-text-dark, #3b2f26)',
                          }}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center hover:bg-[#b89a74] hover:text-white transition-colors duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#b89a74] cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots */}
        <div
          role="tablist"
          aria-label="Product selector"
          className="flex items-center justify-center gap-2 mt-8 sm:mt-10"
        >
          {PRODUCTS.map((product, dotIndex) => {
            const isActive = dotIndex === activeIndex;
            return (
              <button
                key={product.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to product ${dotIndex + 1}: ${product.name}`}
                onClick={() => setActiveIndex(dotIndex)}
                style={{
                  backgroundColor: isActive
                    ? 'var(--products-tan, #b89a74)'
                    : 'rgba(184, 154, 116, 0.3)',
                }}
                className={`transition-all duration-300 rounded-full focus-visible:ring-2 focus-visible:ring-[#b89a74] cursor-pointer ${
                  isActive ? 'w-7 sm:w-8 h-2 sm:h-2.5' : 'w-2 sm:w-2.5 h-2 sm:h-2.5 hover:opacity-80'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
