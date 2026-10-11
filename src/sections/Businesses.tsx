import { useEffect, useRef, useState } from 'react';

// ============================================================================
// 1. CONFIGURATION
// ============================================================================
/* DEBUG-FRAME-OVERLAY: START - Configuration flag */
const SHOW_FRAME_DEBUG = true;
/* DEBUG-FRAME-OVERLAY: END - Configuration flag */

const FRAME_COUNT = 162;
const PATH_PATTERN = '/images/frames-1/';
const PADDING = 4;
const INITIAL_BURST_COUNT = 10;

/**
 * ============================================================================
 * SCROLL SEQUENCE TUNING SETTINGS
 * ============================================================================
 *
 * 1. CSS Variable: --sequence-height (in src/styles/index.css)
 *    Recommended range: 800vh to 1400vh (Default: 1000vh desktop, 1200vh mobile)
 *    Controls total scroll distance required to scrub through the sequence.
 *
 * 2. EASE
 *    Recommended range: 0.04 to 0.10 (Default: 0.06)
 *    Frame-rate-independent smoothing factor (lower = calmer, more inertia/delay).
 *
 * 3. MAX_PROGRESS_PER_SECOND
 *    Recommended range: 0.12 (very slow) to 0.30 (fast) (Default: 0.18)
 *    Maximum sequence progress allowed per second. At 0.18, full sequence takes
 *    at least ~5.5s, preventing frames from skipping or flying by on fast scrolls.
 *
 * 4. START_HOLD_VH & END_HOLD_VH
 *    Recommended range: start 5-15vh, end 20-40vh (Default: 10vh start, 30vh end)
 *    Holds first and last frames at section edges so viewers can absorb them.
 * ============================================================================
 */
const EASE = 0.06;
const MAX_PROGRESS_PER_SECOND = 0.18;
const START_HOLD_VH = 10;
const END_HOLD_VH = 30;

/* DEBUG-FRAME-OVERLAY: START - Expose current frame getter & range check */
let activeDrawnFrame = 1;

/**
 * Returns the currently rendered 1-based frame number (1 to FRAME_COUNT).
 * Can be called by other components or overlay triggers to query current frame.
 */
export function getCurrentFrame(): number {
  return activeDrawnFrame;
}

/**
 * Example helper function to check if the current frame is within a specific range:
 *
 * Example usage:
 *   const frame = getCurrentFrame();
 *   if (isInRange(frame, 20, 45)) {
 *     // Display element or trigger animation
 *   }
 */
export const isInRange = (frame: number, start: number, end: number): boolean => {
  return frame >= start && frame <= end;
};
/* DEBUG-FRAME-OVERLAY: END - Expose current frame getter & range check */

/**
 * Returns formatted frame path, e.g. /images/frames-1/0001.webp
 */
function getFramePath(index: number): string {
  const frameNumber = (index + 1).toString().padStart(PADDING, '0');
  return `${PATH_PATTERN}${frameNumber}.webp`;
}

export default function Businesses() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* DEBUG-FRAME-OVERLAY: START - DOM Ref for direct update */
  const debugOverlayRef = useRef<HTMLDivElement>(null);
  /* DEBUG-FRAME-OVERLAY: END - DOM Ref for direct update */

  // References for animation and scroll states (avoid component re-renders)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const isSectionVisibleRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const hasStartedPreloadRef = useRef<boolean>(false);

  // Layout measurements cached on resize to keep scroll listener passive and fast
  const layoutRef = useRef<{ containerTop: number; containerHeight: number; windowHeight: number }>({
    containerTop: 0,
    containerHeight: 0,
    windowHeight: 0,
  });

  // UI state for loading indicator
  const [loadPercent, setLoadPercent] = useState<number>(0);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);

  // ============================================================================
  // 2. CANVAS SETUP & DRAWING (Cover fitting)
  // ============================================================================
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const imgAspect = iw / ih;
    const canvasAspect = cw / ch;

    let renderW = cw;
    let renderH = ch;
    let offsetX = 0;
    let offsetY = 0;

    // "Cover" fit algorithm: fill canvas, preserve aspect ratio, center image
    if (canvasAspect > imgAspect) {
      renderW = cw;
      renderH = cw / imgAspect;
      offsetX = 0;
      offsetY = (ch - renderH) / 2;
    } else {
      renderH = ch;
      renderW = ch * imgAspect;
      offsetX = (cw - renderW) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

    /* DEBUG-FRAME-OVERLAY: START - Update debug overlay DOM directly */
    if (SHOW_FRAME_DEBUG) {
      const current1Based = frameIndex + 1;
      activeDrawnFrame = current1Based;
      if (debugOverlayRef.current) {
        const padded = current1Based.toString().padStart(PADDING, '0');
        debugOverlayRef.current.textContent = `Frame ${padded} / ${FRAME_COUNT}`;
      }
    }
    /* DEBUG-FRAME-OVERLAY: END - Update debug overlay DOM directly */
  };

  const updateCanvasDimensions = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Read the canvas element's actual displayed size inside the framed container
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width || canvas.clientWidth || (window.innerWidth - 32);
    const displayHeight = rect.height || canvas.clientHeight || (window.innerHeight - 32);

    // Scale canvas buffer by devicePixelRatio (capped at 2 for performance)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.floor(displayWidth * dpr));
    canvas.height = Math.max(1, Math.floor(displayHeight * dpr));

    // Re-draw current frame immediately after canvas resize so it never goes blank
    drawFrame(Math.round(currentFrameRef.current));
  };

  const updateLayoutMetrics = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    layoutRef.current = {
      containerTop: rect.top + scrollTop,
      containerHeight: containerRef.current.offsetHeight,
      windowHeight: window.innerHeight,
    };

    updateCanvasDimensions();
  };

  // ============================================================================
  // 3. FRAME PRELOADING
  // ============================================================================
  const startPreloading = () => {
    if (hasStartedPreloadRef.current) return;
    hasStartedPreloadRef.current = true;

    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 2 : 1; // Load every 2nd frame on mobile to save bandwidth

    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    imagesRef.current = images;

    let loadedCount = 0;
    const totalToLoad = isMobile ? Math.ceil(FRAME_COUNT / 2) : FRAME_COUNT;

    const onImageLoaded = (index: number) => {
      loadedCount++;
      const percent = Math.min(100, Math.round((loadedCount / totalToLoad) * 100));
      setLoadPercent(percent);

      // Once the first frame or initial burst is ready, display it
      if (index === 0) {
        drawFrame(0);
      }
      if (loadedCount >= Math.min(INITIAL_BURST_COUNT, totalToLoad)) {
        setIsInitialReady(true);
      }
    };

    const loadSingleFrame = (index: number) => {
      const img = new Image();
      img.src = getFramePath(index);
      img.onload = () => onImageLoaded(index);
      img.onerror = () => {
        // Fallback gracefully without crashing
        onImageLoaded(index);
      };
      images[index] = img;

      // On mobile, duplicate pointer to adjacent odd frame so index lookups stay valid
      if (isMobile && index + 1 < FRAME_COUNT) {
        images[index + 1] = img;
      }
    };

    // Stage 1: Load initial burst of frames first for instant responsiveness
    for (let i = 0; i < Math.min(INITIAL_BURST_COUNT, FRAME_COUNT); i += step) {
      loadSingleFrame(i);
    }

    // Stage 2: Load remaining frames in the background
    const timer = setTimeout(() => {
      for (let i = INITIAL_BURST_COUNT; i < FRAME_COUNT; i += step) {
        loadSingleFrame(i);
      }
    }, 120);

    return () => clearTimeout(timer);
  };

  // ============================================================================
  // 4. SCROLL PROGRESS & SMOOTH RENDERING LOOP
  // ============================================================================
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { containerTop, containerHeight, windowHeight } = layoutRef.current;
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Calculate progress (0 to 1) relative to Section 2 container only
    const maxScrollDistance = containerHeight - windowHeight;
    if (maxScrollDistance <= 0) return;

    const scrollIntoSection = scrollY - containerTop;

    // STEP 1: Holds at section boundaries in pixels
    // (Holds first frame for START_HOLD_VH at top, holds last frame for END_HOLD_VH before next section)
    const startHoldPx = (windowHeight * START_HOLD_VH) / 100;
    const endHoldPx = (windowHeight * END_HOLD_VH) / 100;
    const activeScrollDistance = maxScrollDistance - startHoldPx - endHoldPx;

    let progress = 0;
    if (activeScrollDistance > 0) {
      if (scrollIntoSection <= startHoldPx) {
        progress = 0;
      } else if (scrollIntoSection >= maxScrollDistance - endHoldPx) {
        progress = 1;
      } else {
        progress = (scrollIntoSection - startHoldPx) / activeScrollDistance;
      }
    } else {
      progress = Math.max(0, Math.min(1, scrollIntoSection / maxScrollDistance));
    }

    // Convert progress to continuous target frame index
    targetFrameRef.current = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, progress * (FRAME_COUNT - 1))
    );

    // Keep animation loop active while catching up to scroll target
    if (isSectionVisibleRef.current) {
      startAnimationLoop();
    }
  };

  const startAnimationLoop = () => {
    if (rafIdRef.current !== null) return;
    lastTimeRef.current = performance.now();

    const animate = (time: number) => {
      if (!isSectionVisibleRef.current) {
        rafIdRef.current = null;
        return;
      }

      const now = time || performance.now();
      const rawDt = lastTimeRef.current > 0 ? (now - lastTimeRef.current) / 1000 : 1 / 60;
      lastTimeRef.current = now;

      // STEP 2: Clamp dt to a maximum of 0.05s so lag spikes or background tabs do not cause jumps
      const dt = Math.min(Math.max(rawDt, 0.0001), 0.05);

      const diff = targetFrameRef.current - currentFrameRef.current;
      const lastIndex = FRAME_COUNT - 1;

      if (Math.abs(diff) < 0.005) {
        currentFrameRef.current = targetFrameRef.current;
      } else {
        // STEP 2: Slower, frame-rate-independent easing using delta time
        const t = 1 - Math.pow(1 - EASE, dt * 60);
        const easedStep = diff * t;

        // STEP 3: Speed limit (sequence travels at most MAX_PROGRESS_PER_SECOND of total length per second)
        const maxStep = MAX_PROGRESS_PER_SECOND * lastIndex * dt;
        const clampedStep = Math.max(-maxStep, Math.min(maxStep, easedStep));
        currentFrameRef.current += clampedStep;
      }

      const roundedFrame = Math.round(currentFrameRef.current);
      // Only draw when the integer frame index actually changes
      if (roundedFrame !== lastDrawnFrameRef.current) {
        drawFrame(roundedFrame);
        lastDrawnFrameRef.current = roundedFrame;
      }

      // Continue running only while current differs from target, then stop to save battery
      if (Math.abs(targetFrameRef.current - currentFrameRef.current) > 0.005) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);
  };

  const stopAnimationLoop = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  // ============================================================================
  // 5. LIFECYCLE & INTERSECTION OBSERVERS
  // ============================================================================
  useEffect(() => {
    updateLayoutMetrics();
    window.addEventListener('resize', updateLayoutMetrics, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 1. Observer for Preloading: triggers when approaching Section 2
    const container = containerRef.current;
    if (!container) return;

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startPreloading();
          preloadObserver.disconnect();
        }
      },
      { rootMargin: '400px 0px 400px 0px' }
    );
    preloadObserver.observe(container);

    // 2. Observer for Animation Loop: active only when Section 2 is visible
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isSectionVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startAnimationLoop();
        } else {
          stopAnimationLoop();
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    return () => {
      window.removeEventListener('resize', updateLayoutMetrics);
      window.removeEventListener('scroll', handleScroll);
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
      stopAnimationLoop();
    };
  }, []);

  return (
    <section
      id="businesses"
      ref={containerRef}
      className="relative z-20 w-full"
      style={{
        height: 'var(--sequence-height, var(--section-2-height, 1000vh))',
        backgroundColor: 'var(--frame-color, #f5ebe0)',
      }}
    >
      {/* Sticky container creating the narrow #f5ebe0 frame on all four sides */}
      <div
        className="sticky top-0 left-0 w-full h-screen box-border flex items-center justify-center"
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          padding: 'var(--frame-gap, clamp(10px, 1.2vw, 18px))',
          backgroundColor: 'var(--frame-color, #f5ebe0)',
          boxSizing: 'border-box',
        }}
      >
        {/* Rounded inner card (window inside frame) */}
        <div
          className="relative w-full h-full overflow-hidden bg-black shadow-sm"
          style={{
            borderRadius: 'var(--frame-radius, clamp(16px, 2vw, 28px))',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Canvas fills rounded inner card */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block object-cover select-none pointer-events-none canvas-color-graded"
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              borderRadius: 'var(--frame-radius, clamp(16px, 2vw, 28px))',
            }}
          />

          {/* COLOR-GRADE: Multi-layer palette grading, ambient light & vignette */}
          <div
            className="color-grade-overlay absolute inset-0 z-20 pointer-events-none select-none"
            style={{
              borderRadius: 'var(--frame-radius, clamp(16px, 2vw, 28px))',
            }}
            aria-hidden="true"
          >
            {/* Base Layer: Warm-to-Navy diagonal gradient + vignette (normal blending) */}
            <div className="color-grade-base absolute inset-0 pointer-events-none" />

            {/* Accent & Ambient Light Layer: Top-right blue glow + Bottom-left warm glow */}
            <div className="color-grade-blend absolute inset-0 pointer-events-none" />
          </div>

          {/* HERO-CARD CONNECTION: START - Top-Right Notched Arrow Tab with Concave Fillets */}
          <div
            className="absolute top-0 right-0 z-30 flex items-center justify-center notched-tab-animated select-none pointer-events-none"
            style={{
              width: 'clamp(44px, 4vw, 54px)',
              height: 'clamp(44px, 4vw, 54px)',
              backgroundColor: 'var(--frame-color, #f5ebe0)',
              borderBottomLeftRadius: 'var(--notch-radius, clamp(14px, 1.6vw, 24px))',
            }}
            aria-hidden="true"
          >
            {/* Concave fillet on left of arrow tab (joins top card edge with tab) */}
            <div
              className="absolute top-0 right-full pointer-events-none"
              style={{
                width: 'var(--notch-radius, clamp(14px, 1.6vw, 24px))',
                height: 'var(--notch-radius, clamp(14px, 1.6vw, 24px))',
                background:
                  'radial-gradient(circle at 0% 100%, transparent var(--notch-radius, 18px), var(--frame-color, #f5ebe0) calc(var(--notch-radius, 18px) + 0.5px))',
              }}
            />

            {/* Concave fillet on bottom of arrow tab (joins right card edge with tab) */}
            <div
              className="absolute top-full right-0 pointer-events-none"
              style={{
                width: 'var(--notch-radius, clamp(14px, 1.6vw, 24px))',
                height: 'var(--notch-radius, clamp(14px, 1.6vw, 24px))',
                background:
                  'radial-gradient(circle at 0% 100%, transparent var(--notch-radius, 18px), var(--frame-color, #f5ebe0) calc(var(--notch-radius, 18px) + 0.5px))',
              }}
            />

            {/* Downward / Diagonal arrow icon inside tab */}
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 7l10 10M17 7v10H7" />
            </svg>
          </div>
          {/* HERO-CARD CONNECTION: END - Top-Right Notched Arrow Tab with Concave Fillets */}

          {/* HERO-CARD CONNECTION: START - Top-Left Notched Label Tab with Concave Fillets */}
          <div
            className="absolute top-0 left-0 z-30 hidden sm:flex items-center justify-center notched-tab-animated select-none pointer-events-none"
            style={{
              height: 'clamp(34px, 2.8vw, 42px)',
              paddingLeft: 'clamp(14px, 1.4vw, 20px)',
              paddingRight: 'clamp(14px, 1.4vw, 20px)',
              backgroundColor: 'var(--frame-color, #f5ebe0)',
              borderBottomRightRadius: 'var(--notch-radius, clamp(14px, 1.6vw, 24px))',
            }}
            aria-hidden="true"
          >
            {/* Concave fillet on right of label tab (joins top card edge with tab) */}
            <div
              className="absolute top-0 left-full pointer-events-none"
              style={{
                width: 'var(--notch-radius, clamp(14px, 1.6vw, 24px))',
                height: 'var(--notch-radius, clamp(14px, 1.6vw, 24px))',
                background:
                  'radial-gradient(circle at 100% 100%, transparent var(--notch-radius, 18px), var(--frame-color, #f5ebe0) calc(var(--notch-radius, 18px) + 0.5px))',
              }}
            />

            {/* Concave fillet on bottom of label tab (joins left card edge with tab) */}
            <div
              className="absolute top-full left-0 pointer-events-none"
              style={{
                width: 'var(--notch-radius, clamp(14px, 1.6vw, 24px))',
                height: 'var(--notch-radius, clamp(14px, 1.6vw, 24px))',
                background:
                  'radial-gradient(circle at 100% 100%, transparent var(--notch-radius, 18px), var(--frame-color, #f5ebe0) calc(var(--notch-radius, 18px) + 0.5px))',
              }}
            />

            <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-widest text-neutral-800 uppercase">
              02 / CARS
            </span>
          </div>
          {/* HERO-CARD CONNECTION: END - Top-Left Notched Label Tab with Concave Fillets */}

          {/* DEBUG-FRAME-OVERLAY: START - Debug Badge positioned below top-left label tab */}
          {SHOW_FRAME_DEBUG && (
            <div
              ref={debugOverlayRef}
              className="absolute top-11 left-3 sm:top-13 sm:left-4 z-40 px-3 py-1.5 rounded bg-black/75 backdrop-blur-xs text-white font-mono text-[11px] sm:text-xs tracking-wider border border-white/10 select-none pointer-events-none shadow-sm opacity-0"
            >
              Frame 0001 / {FRAME_COUNT}
            </div>
          )}
          {/* DEBUG-FRAME-OVERLAY: END - Debug Badge positioned below top-left label tab */}

          {/* Minimal loading indicator inside rounded card */}
          {!isInitialReady && (
            <div className="absolute bottom-6 right-6 z-30 pointer-events-none flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#1774c8] animate-pulse" />
              <span className="font-mono tracking-wider">LOADING {loadPercent}%</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
