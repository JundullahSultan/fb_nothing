# PROJECT CONTEXT: FB NOTHING WEBSITE

---

## 1. SUMMARY
Official personal brand and business website for **FB Nothing**. It showcases his transition from competitive PUBG gaming and streaming to fashion retail and luxury automotive ventures. Key interactions include an interactive mouse/touch-scrubbed hero background video, an editorial pinned-card hero reveal, a 162-frame reverse scroll-driven canvas sequence with delta-time inertia and speed limits, media highlights, an editorial 5-card featured products carousel, and inquiry sections.

---

## 2. TECH STACK AND RUNNING IT

### Stack
- **Framework:** React 19.0.1 (`react`, `react-dom`)
- **Build Tool:** Vite 8.3.0 (`@vitejs/plugin-react` ^6.1.1, `@tailwindcss/vite` ^4.3.3)
- **Language:** TypeScript 7.0.2 (`typescript`)
- **Styling:** Tailwind CSS v4.3.3 (`tailwindcss`), CSS custom properties, native keyframes
- **Icons:** Lucide React ^0.546.0 (`lucide-react`)
- **Animation Helper:** Motion ^12.23.24 (`motion`)
- **Backend / Utility:** Express ^4.21.2 (`express`), Dotenv ^17.2.3 (`dotenv`), Google Gen AI ^2.4.0 (`@google/genai`)

### Commands
- **Install:** `npm install`
- **Dev Server:** `npm run dev` (`vite --port=5173 --host=0.0.0.0`)
- **Build:** `npm run build` (`vite build`)
- **Preview:** `npm run preview` (`vite preview`)
- **Type-Check:** `npm run lint` (`tsc --noEmit`)
- **Clean:** `npm run clean` (`rm -rf dist server.js`)

### Local Environment
- **Default Port:** `5173`
- **Local URL:** `http://localhost:5173`
- **Network URL:** `http://0.0.0.0:5173`
- **Environment Variables:** Defined in `.env.example` (names only: `GEMINI_API_KEY`, `APP_URL`).

---

## 3. FILE STRUCTURE

```text
v1/
├── .env.example                     # Declares required env variables (GEMINI_API_KEY, APP_URL)
├── .gitignore                       # Git ignore rules for node_modules, dist, and local caches
├── index.html                       # HTML document root with web fonts
├── metadata.json                    # Application metadata (name, description)
├── package.json                     # NPM packages, dependencies, and script definitions
├── PROJECT_CONTEXT.md               # Complete architectural documentation file
├── README.md                        # Project introductory readme
├── tsconfig.json                    # TypeScript compiler configuration (ES2022, bundler)
├── vite.config.ts                   # Vite plugins, aliases, and port 5173 configuration
├── incoming/                        # Original uncompressed product images and reference assets
├── public/
│   ├── images/
│   │   ├── logo_black.png           # Header brand logo asset
│   │   ├── logo_white.png           # Footer brand logo asset
│   │   ├── logo_yellow.png          # Alternate yellow brand logo asset
│   │   ├── media-photo.jpg          # Editorial portrait for Section 3 poster (1600x900, 62.8 KB)
│   │   ├── frames-1/                # 162 reversed WebP frames (0001.webp - 0162.webp)
│   │   └── products/                # Optimized WebP assets for Section 4 carousel
│   │       ├── background.webp      # Cream background with soft leaf shadows (8.7 KB)
│   │       ├── smartwatch.webp      # Minimal smartwatch transparent cutout (56.5 KB)
│   │       ├── running-shoes.webp   # Modern running sneakers transparent cutout (96.7 KB)
│   │       ├── headphones.webp      # Wireless headphones transparent cutout (66.5 KB)
│   │       ├── camera.webp          # Vintage camera transparent cutout (91.8 KB)
│   │       └── backpack.webp        # Modern everyday backpack transparent cutout (66.3 KB)
│   └── videos/
│       ├── hero-video.mp4           # 23-second scrubbable MP4 video for Section 1 hero
│       └── ShowIndustry.mp4         # Master source video for frame extraction (22.7 MB)
├── scripts/
│   └── extract-frames.sh            # Bash automation script for ffmpeg frame extraction
├── source/
│   └── video.mp4                    # Master video file used by extraction script
└── src/
    ├── main.tsx                     # React 19 root bootstrap and DOM mount
    ├── App.tsx                      # Root layout, hero pinning, observers, and cover effect
    ├── types/
    │   └── index.ts                 # Shared TypeScript interfaces (NavbarProps, MobileMenuProps)
    ├── lib/
    │   ├── constants.ts             # Navigation links, social links, indicator tags, video src
    │   └── products.ts              # Featured products dataset, interfaces, and carousel configuration
    ├── hooks/
    │   └── useVideoScrub.ts         # Custom hook for mouse/touch horizontal video scrubbing
    ├── styles/
    │   └── index.css                # Tailwind imports, CSS tokens, color presets, scrollbar styling
    ├── components/
    │   ├── ContactDropdown.tsx      # Accessible floating dropdown with outline icons & groups
    │   └── layout/
    │       ├── Navbar.tsx           # Transparent header with links and mobile menu toggle
    │       └── MobileMenu.tsx       # Slide-down mobile drawer overlay
    └── sections/
        ├── Hero.tsx                 # Editorial typography, category tags, CTAs, indicator tags
        ├── Businesses.tsx           # Section 2: 1000vh canvas sequence, color grading, notched tabs
        ├── Content.tsx              # Section 3: Gaming highlights, YouTube and TikTok channel cards
        ├── Products.tsx             # Section 4: 5-card arch/stack carousel with center highlight
        └── Contact.tsx              # Section 5: Full-screen minimal contact page with integrated footer
```

---

## 4. PAGE LAYOUT AND SECTIONS

### Sections Breakdown

1. **Navigation (`Navbar.tsx`):**
   - **Position:** `absolute top-0 left-0 right-0`, `z-30`, `bg-transparent`, height ~68px.
   - **Contents:** Brand wordmark, desktop links (`#home`, `#fashion`, `#cars`, `#content`, `#products`), "Get in Touch" button, mobile menu toggle.

2. **Mobile Menu (`MobileMenu.tsx`):**
   - **Position:** `fixed inset-0`, `z-20`, `bg-white/95 backdrop-blur-md`, height `100vh`.
   - **Contents:** Full-screen navigation links, CTA button, social media links.

3. **Section 1: Hero (`Hero.tsx` + `App.tsx` wrapper):**
   - **Position:** `sticky top-0`, `h-[100vh] h-[100svh]`, `z-0`, `overflow: hidden`.
   - **Contents:** Interactive scrubbed `<video>` (`object-cover`), atmospheric white gradient (`z-1`), headline ("The World of Nothing."), category tag (`GAMING — FASHION — BUSINESS`), CTA buttons ("Explore My Businesses", "Watch My Content"), indicators (`01 / ME`, `02 / FASHION`, `03 / CARS`), vertical keywords.

4. **Section 2: Scroll Sequence (`Businesses.tsx`):**
   - **Position:** `relative`, `z-20`, height `var(--sequence-height, 1000vh)` (1200vh mobile), `bg-[#f5ebe0]`.
   - **Contents:** Sticky viewport container (`100vh`) with `padding: var(--frame-gap)`. Holds rounded card (`border-radius: var(--frame-radius)`), HTML5 canvas, color-grade overlay, notched tabs (top-left `02 / CARS`, top-right arrow), loading badge, and debug frame counter.

5. **Section 3: Gaming & Media (`Content.tsx`):**
   - **Position:** `relative`, `z-10`, height auto (`py-20 sm:py-28`), `bg-neutral-900 text-neutral-900`.
   - **Contents:** Editorial cream poster card (max-width `1240px`, `--frame-radius` rounded corners, soft shadow, paper grain noise, inset 1px outline with opposite corner diagonal arrows). Organised in 3 horizontal bands:
     - *Top Band:* Barcode SVG, "ARCHIVE // 2026", "03 PLATFORMS" display number, pill tag ("GAMING & MEDIA") + intro paragraph, 4x3 checkerboard grid with dimensions, and large display word "MEDIA" with copyright mark and arrow.
     - *Middle Band:* Full-width photo slot (`/images/media-photo.jpg`, 1600x900) with brand tint overlay and subtle inner edge shading.
     - *Bottom Band:* Heading `<h2>` ("PUBG Roots, Endless Energy." in Playfair Display italic), row of 3 sparkles, wireframe sphere icons, display word "FOLLOW.", and 3 platform channel columns (YouTube, TikTok, Facebook) with numbers, outline icons, descriptions, and diagonal arrow hover links. Responsive stacking and one-time IntersectionObserver fade/translate reveal.

6. **Section 4: Featured Products (`Products.tsx`):**
   - **Position:** `relative`, `z-10`, height auto (`py-20 sm:py-28`), `bg-[var(--products-bg,#F4ECE1)] text-neutral-900`.
   - **Contents:** Warm cream section with leaf shadow overlay (`background.webp`), "OUR COLLECTION" pill badge, serif "Featured Products" heading, subtitle ("Explore our featured items."), 5-card arch/stack carousel where the active center card is elevated and prominent with warm drop-shadows, flanking cards scale down with subtle opacity drop, circular navigation chevrons, pagination indicator pills, favorite heart toggle, and "Add to Cart" CTA smoothly scrolling to `#contact`. Includes touch swipe, keyboard navigation, and ARIA roles.

7. **Section 5: Contact & Inquiries (`Contact.tsx`):**
   - **Position:** `relative`, `z-10`, height `min-h-[100vh] min-h-[100svh]`, `bg-[var(--contact-bg,#fbf8f3)] text-[var(--contact-ink,#0b1c31)]`.
   - **Contents:** Full-screen minimal editorial contact page. Giant ultra-bold `<h2>` "Get in touch" with masked slide-up reveal, 12-column middle grid with real project description text on the left and minimal underlined form (name, custom accessible floating dropdown for inquiry types via `ContactDropdown.tsx`, email, project message, submit button with arrow nudge) on the right, integrated thin bottom row with copyright and social outline links (Facebook, YouTube, TikTok). Form inputs utilize strictly underline-only focus styling (`.contact-input`) with zero rectangular ring or box outlines and WebKit autofill background neutralization. Replaces separate legacy footer.

### Stacking Map

| Z-Index | Element / Selector | Component | Positioning | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `z-0` | Sticky Hero Wrapper | `App.tsx` | `sticky top-0` | Pinned hero layer behind Section 2 |
| `z-1` | Atmospheric Gradient | `App.tsx` | `absolute inset-0` | Left-side text legibility gradient |
| `z-10` | Section Content (`#home`, `#content`, `#products`, `#contact`) | Section components | `relative` | Standard document flow sections |
| `z-20` | Section 2 Container (`#businesses`) | `Businesses.tsx` | `relative` | Slides over the sticky hero |
| `z-20` | Mobile Drawer Menu | `MobileMenu.tsx` | `fixed inset-0` | Fullscreen mobile drawer overlay |
| `z-20` | Color Grade Overlay | `Businesses.tsx` | `absolute inset-0` | Canvas palette grading layers |
| `z-30` | Top Navigation Header | `Navbar.tsx` | `absolute top-0` | Stays at page top, scrolls off |
| `z-30` | Notched Tabs (Top-Left & Right) | `Businesses.tsx` | `absolute top-0` | Concave card tabs above canvas |
| `z-30` | Loading Indicator Badge | `Businesses.tsx` | `absolute bottom-6` | Preload percentage badge |
| `z-40` | Debug Frame Overlay | `Businesses.tsx` | `absolute top-11` | Monospace frame counter badge |

---

## 5. DESIGN SYSTEM

### Color Palette

| Hex Code | Semantic Role | Locations in Code |
| :--- | :--- | :--- |
| `#f5ebe0` | Warm Frame Beige | `--frame-color`, `--scrollbar-track`, Section 2 gutter, notched tabs, color-grade base |
| `#f4ece1` | Warm Cream Products BG | `--products-bg`, Section 4 background |
| `#c49a6c` | Tan / Caramel Accent | `--products-tan`, Product action buttons, active indicator |
| `#b3895b` | Tan Hover Accent | `--products-tan-hover`, Product CTA hover state |
| `#2b2118` | Deep Espresso Brown | `--products-text-dark`, Section 4 headings and card titles |
| `#7a6f64` | Muted Warm Brown | `--products-text-muted`, Section 4 descriptions and subtitles |
| `#8f7a62` | Warm Earth Thumb | `--scrollbar-thumb` (3.44:1 contrast ratio against `#f5ebe0`) |
| `#1774c8` | Brand Blue Accent | `--scrollbar-thumb-hover`, "Nothing." hero text, loading dot |
| `#1474c6` | Primary Button Blue | Hero "Explore My Businesses" button (`hover: #1062a8`) |
| `#0b1c31` | Dark Navy Button | Navbar & Mobile Menu "Get in Touch" button (`hover: #152e4d`) |
| `#0b1322` | Body Dark Blue | `body` background color in `src/styles/index.css` |
| `#60a5fa` | Sky Blue Accent | Category taglines in Content and Contact sections |
| `#ffffff` | Pure White | Section 4 card backgrounds (`--products-card-bg`), card backgrounds, white text |
| `#f5f5f5` | Neutral 50 | Card background accents |
| `#262626` | Neutral 800 | Content channel card backgrounds (`bg-neutral-800/80`) |
| `#171717` | Neutral 900 | Content section background (`bg-neutral-900`), hero text |
| `#0a0a0a` | Neutral 950 | Contact section background (`bg-neutral-950`) |
| `#000000` | Pure Black | Canvas inner card background, Footer background |

### Typography
- **Serif (`--font-serif`):** `'Playfair Display', Georgia, Cambria, 'Times New Roman', serif`. Used for main headings (h1: 34-54px, h2: 30-42px) and editorial quotes / product title.
- **Sans (`--font-sans`):** `'Plus Jakarta Sans', 'HelveticaNowDisplayW01-Rg', system-ui, -apple-system, sans-serif`. Used for body copy (12-14px), buttons (11-12px), and navigation links.
- **Heading Sans (`--font-heading`):** `'Plus Jakarta Sans', 'HelveticaNowDisplay-Medium', sans-serif`.
- **Monospace (`font-mono`):** System monospace. Used for indicators, notched tab labels, debug frame overlay, loading percentage.

### CSS Custom Properties (`src/styles/index.css`)

| Variable | Value | Meaning |
| :--- | :--- | :--- |
| `--sequence-height` | `1000vh` (`1200vh` mobile) | Total height of Section 2 scroll track |
| `--section-2-height` | `var(--sequence-height)` | Alias for Section 2 height |
| `--frame-color` | `#f5ebe0` | Outer frame gutter and notched tab fill color |
| `--frame-gap` | `clamp(10px, 1.2vw, 18px)` | Border gutter width around Section 2 card (`8px` mobile) |
| `--frame-radius` | `clamp(16px, 2vw, 28px)` | Corner radius of the inner card (`14px` mobile) |
| `--notch-radius` | `clamp(14px, 1.6vw, 24px)` | Radius of concave fillets on notched tabs (`10px` mobile) |
| `--scrollbar-track` | `#f5ebe0` | Background track of page scrollbar |
| `--scrollbar-thumb` | `#8f7a62` | Scrollbar thumb color |
| `--scrollbar-thumb-hover` | `#1774c8` | Scrollbar thumb hover/active state color |
| `--scrollbar-width` | `12px` | Scrollbar width in WebKit browsers |
| `--grade-warm` | `#f5ebe0` | Warm beige tone for canvas grading |
| `--grade-cool` | `#0b1c31` | Dark navy tone for canvas grading |
| `--grade-accent` | `#1774c8` | Blue brand accent for canvas grading |
| `--grade-opacity` | `0.92` | Master opacity of canvas color-grade overlay |
| `--grade-vignette` | `0.35` | Radial edge vignette darkening strength |
| `--grade-blend-mode` | `soft-light` | Blending mode for secondary ambient light layer |
| `--grade-base-warm-a` | `0.28` | Alpha for warm beige diagonal glow (top-left) |
| `--grade-base-cool-a` | `0.50` | Alpha for navy shading (bottom-right) |
| `--grade-accent-a` | `0.30` | Alpha for brand blue radial glow (top-right) |
| `--grade-warm-a` | `0.16` | Alpha for amber ambient light (bottom-left) |
| `--products-bg` | `#F4ECE1` | Warm cream background for Section 4 |
| `--products-card-bg` | `#FFFFFF` | Background for product cards |
| `--products-card-border` | `rgba(43, 33, 24, 0.08)` | Subtle border for product cards |
| `--products-text-dark` | `#2B2118` | Deep espresso brown for section headings & titles |
| `--products-text-muted` | `#7A6F64` | Muted warm brown for subtitles & descriptions |
| `--products-tan` | `#C49A6C` | Warm tan / caramel accent for primary CTA buttons |
| `--products-tan-hover` | `#B3895B` | Hover tone for product primary CTA buttons |
| `--products-badge-bg` | `rgba(196, 154, 108, 0.15)` | Translucent tan fill for section pill badge |
| `--poster-bg` | `#f5ebe0` | Warm cream background for Section 3 poster card |
| `--poster-ink` | `#0b1c31` | Deep navy ink color for poster text, borders, icons |
| `--poster-accent` | `#1774c8` | Brand blue accent color for poster elements |
| `--poster-muted` | `rgba(11, 28, 49, 0.65)` | Semi-transparent navy for descriptions & labels |
| `--contact-bg` | `#fbf8f3` | Warm white background for full-screen Contact section |
| `--contact-ink` | `#0b1c31` | Deep navy / near-black ink for headings and form labels |
| `--contact-muted` | `rgba(11, 28, 49, 0.62)` | Muted navy for info paragraph and placeholders |
| `--contact-line` | `rgba(11, 28, 49, 0.55)` | Underline rule color for minimal form inputs |
| `--contact-accent` | `#1774c8` | Brand blue accent for active field underlines |

### Responsive Rules & Breakpoints
- **Mobile (< 768px):** `--sequence-height: 1200vh`, `--frame-gap: 8px`, `--frame-radius: 14px`, `--notch-radius: 10px`. Top-left notched tab hidden (`hidden sm:flex`).
- **Desktop (>= 768px):** `--sequence-height: 1000vh`, clamp-scaled gaps and radii.

### Visual Treatments
- **Notched Tabs:** Mounted on top edge of Section 2 card. Connected via concave fillets using CSS `radial-gradient` masks.
- **Color Grade Overlay:** Active preset is `"visible"`. Contains `.color-grade-base` (diagonal gradient + vignette) and `.color-grade-blend` (blue/amber ambient light).
- **Custom Scrollbar:** Styled using standard `scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track)` and `scrollbar-gutter: stable` on `html`, with WebKit fallback rendering a floating inset pill.
- **Contact Form Underline Focus (`.contact-input`):** Clean editorial styling with 1px base underline (`--contact-line`). On focus/active, applies `border-bottom-color: var(--contact-accent)` with `box-shadow: 0 1px 0 0 var(--contact-accent)` (Technique B), doubling underline thickness downwards with zero layout shift and strictly no top/left/right border, box shadow, or focus ring. Overrides `:-webkit-autofill` using an inset background mask with `--contact-bg` and text color `--contact-ink` to eliminate default browser blue autofill boxes.
- **Custom Floating Contact Dropdown (`ContactDropdown.tsx`):** Accessible WAI-ARIA combobox/listbox with a trigger matching `.contact-input`, rotating chevron indicator, collision-aware flip-up positioning, and a floating rounded card (`rounded-2xl`, shadow, 1px border) with Lucide outline icons (`Handshake`, `Shirt`, `Car`, `Clapperboard`), category dividers, checkmark indicators, keyboard navigation, and click-outside dismissal.

---

## 6. HERO SECTION BEHAVIOR

### Mouse / Touch Video Scrubbing (`useVideoScrub.ts`)
- **Element:** `<video>` pointing to `/videos/hero-video.mp4?v=64ce3dce`.
- **Listeners:** `window` listeners for `mousemove`, `mouseleave`, `touchstart`, `touchmove`, `touchend`.
- **Sensitivity:** `SENSITIVITY = 0.8`.
- **Formula:** `timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration`.
- **Seeking:** Runs in `requestAnimationFrame` with `isSeekingRef` lock to prevent pipeline flooding. Synchronizes smoothly via `onSeeked`.

### Pinned Hero Layout & Card Stacking (`App.tsx`)
- Container is `position: sticky; top: 0; h-[100vh] h-[100svh]; z-index: 0; overflow: hidden;`.
- Inner wrapper has `borderRadius: var(--frame-radius)` and `transform-origin: top`.
- **`HERO-COVER-EFFECT`:** As Section 2 slides over the hero, a passive scroll listener scales down and dims the hero card:
  ```ts
  const progress = Math.min(Math.max(scrollY / vh, 0), 1);
  const scale = 1 - (progress * 0.03);    // 1.0 -> 0.97
  const opacity = 1 - (progress * 0.15);  // 1.0 -> 0.85
  ```

### Stop / Resume Observer (`App.tsx`)
- `IntersectionObserver` watches `#businesses` with `rootMargin: '0px 0px -100% 0px'`.
- When Section 2 covers 100% of the screen, `isHeroActive` toggles to `false`.
- When `isHeroActive === false`: scrubbing listeners detach, rAF cancels, video pauses, and `visibility: hidden` disables clicks/links on the covered hero.
- Automatically resumes when scrolling back up.

---

## 7. SCROLL SEQUENCE (SECTION 2) BEHAVIOR

### Frame Assets & Extraction
- **Location:** `public/images/frames-1/`
- **Naming:** `0001.webp` through `0162.webp` (zero-padded 4 digits).
- **Total Frames:** `162` frames.
- **Extraction Parameters:** 7 fps, 1280px width (`scale=1280:-2`), quality 75, libwebp.
- **Sequence Order:** **Reversed**. Frame `0001.webp` is the video's end; frame `0162.webp` is the video's start. Scrolling down plays the video backward.
- **Extraction Command (`scripts/extract-frames.sh`):**
  ```bash
  ffmpeg -y -i source/video.mp4 -an -vf "fps=7,scale=1280:-2,reverse" -c:v libwebp -quality 75 public/images/frames-1/%04d.webp
  ```
- **Fallback Mechanism:** If in-memory reverse filter fails, script extracts forward to a temporary directory, renames files in reverse order (`TOTAL + 1 - IDX`), and cleans up temporary files.

### Configuration Settings (`Businesses.tsx`)
```ts
const SHOW_FRAME_DEBUG = true;
const FRAME_COUNT = 162;
const PATH_PATTERN = '/images/frames-1/';
const PADDING = 4;
const INITIAL_BURST_COUNT = 10;
const EASE = 0.06;                    // Frame-rate-independent smoothing factor
const MAX_PROGRESS_PER_SECOND = 0.18; // Speed limit (<= 18% sequence per second; >= 5.5s total)
const START_HOLD_VH = 10;             // Holds frame 0001 for first 10vh of scroll
const END_HOLD_VH = 30;               // Holds frame 0162 for final 30vh of scroll
```

### Scroll Progress & Animation Logic
1. **Boundary Holds:**
   - Active scroll distance: `activeDistance = maxScrollDistance - startHoldPx - endHoldPx`.
   - `scrollIntoSection <= 10vh` -> `progress = 0`.
   - `scrollIntoSection >= maxScrollDistance - 30vh` -> `progress = 1`.
2. **Delta-Time Easing & Speed Limit:**
   ```ts
   const dt = Math.min(Math.max(rawDt, 0.0001), 0.05);
   const t = 1 - Math.pow(1 - EASE, dt * 60);
   const easedStep = diff * t;
   const maxStep = MAX_PROGRESS_PER_SECOND * (FRAME_COUNT - 1) * dt;
   const clampedStep = Math.max(-maxStep, Math.min(maxStep, easedStep));
   currentFrameRef.current += clampedStep;
   ```
3. **Loop Lifecycle:**
   - Runs only while `Math.abs(target - current) > 0.005`.
   - When target is reached, loop stops (`rafId = null`) to save battery.
   - Wakes up on scroll events via `handleScroll()` or when section enters visibility.

### Canvas Setup & Sizing
- Sized using `canvas.getBoundingClientRect()`.
- Buffer dimensions scaled by `dpr = Math.min(window.devicePixelRatio || 1, 2)`.
- "Cover" fit algorithm in `drawFrame()` centers and scales images without distortion.
- Re-renders current frame synchronously on window resize.

### Preloading & Loader
- **Stage 1:** Loads initial burst of 10 frames for instant responsiveness.
- **Stage 2:** Loads remaining frames after 120ms timeout.
- **Mobile Decimation:** On screens < 768px, loads every 2nd frame (step = 2) and duplicates adjacent pointers.
- Loader UI displays `LOADING {percent}%` with a pulsing blue dot, disappearing once `isInitialReady` is true.

### Debug Overlay & Helper Functions
- **Debug Badge:** Shows `Frame 0042 / 162` at top-left. Controlled by `SHOW_FRAME_DEBUG = true;`. DOM updated directly in `drawFrame()` without React re-renders.
- **Exported Helpers:**
  - `getCurrentFrame(): number` (returns active 1-based frame 1 to 162).
  - `isInRange(frame, start, end): boolean` (checks if active frame falls in range).

---

## 8. FRAME RANGES AND TIMED ELEMENTS
- **Current Status:** None yet.
- The helper `isInRange(frame, start, end)` is exported in `src/sections/Businesses.tsx` to support timed callouts or overlay elements in future updates.

---

## 9. PERFORMANCE AND ACCESSIBILITY

### Performance
- **Zero React Re-Renders on Scrubbing:** Video scrubbing and canvas rendering use React `useRef` for all active metrics and rAF loops.
- **Selective RAF:** Canvas loop halts when target frame is reached.
- **Passive Listeners:** All scroll, resize, touch, and mouse listeners use `{ passive: true }`.
- **DPR Capping:** Canvas buffer resolution capped at `dpr = 2`.
- **Preload Decimation:** Mobile loads 50% fewer frames.

### Accessibility
- **Reduced Motion (`prefers-reduced-motion: reduce`):** Hero cover scaling/dimming and notched tab animations are disabled.
- **High Contrast (`prefers-contrast: more`):** Color-grade opacity drops to `0.40`, vignettes reduce to `0.10`.
- **WCAG Contrast:** Thumb `#8f7a62` against track `#f5ebe0` provides `3.44:1` contrast (exceeding 3:1 graphical component minimum).
- **Semantics:** Landmark tags (`<header>`, `<nav>`, `<section>`, `<footer>`), `aria-hidden="true"` on decorative fillets, `aria-label` on navigation buttons.

---

## 10. KNOWN ISSUES AND LIMITATIONS
- **Parent Overflow Constraint:** Ancestors of the sticky hero cannot use `overflow: hidden`, `overflow: auto`, or `overflow: scroll` (breaks CSS `position: sticky`). Protected using `overflow-x: clip`.
- **Mobile Overlay Scrollbars:** Mobile browsers ignore custom scrollbar CSS rules, rendering native OS overlay scrollbars.
- **WebP Support in FFmpeg:** Frame re-extraction requires `libwebp`. If missing, the script falls back to JPEG (`.jpg`), requiring `PATH_PATTERN` in `Businesses.tsx` to be updated.
- **Fast Scroll Lag:** If a user scrolls 1000vh in under 5.5s, the speed limit (`0.18`) causes the sequence to lag behind the scroll. The 30vh end hold absorbs this, but if faster playback is desired, increase `MAX_PROGRESS_PER_SECOND` or `--sequence-height`.
- **TODO / FIXME:** None present in the source code.

---

## 11. DEBUG AND TUNING GUIDE

| Desired Change | File to Edit | Property / Line to Change | Range / Notes |
| :--- | :--- | :--- | :--- |
| Faster / slower scroll sequence playback | `src/styles/index.css` | `--sequence-height: 1000vh;` | 800vh to 1400vh |
| Calmer / tighter canvas easing | `src/sections/Businesses.tsx` | `const EASE = 0.06;` | 0.04 (calm) to 0.10 (snappy) |
| Sequence speed limit | `src/sections/Businesses.tsx` | `const MAX_PROGRESS_PER_SECOND = 0.18;` | 0.12 (slow) to 0.30 (fast) |
| Boundary holds (start / end) | `src/sections/Businesses.tsx` | `START_HOLD_VH = 10;`, `END_HOLD_VH = 30;` | 5-15vh start, 20-40vh end |
| Frame border gap & radius | `src/styles/index.css` | `--frame-gap`, `--frame-radius` | clamp values in `:root` |
| Notched tab corner radius | `src/styles/index.css` | `--notch-radius` | clamp values in `:root` |
| Turn off frame debug overlay | `src/sections/Businesses.tsx` | `const SHOW_FRAME_DEBUG = false;` | `false` removes badge |
| Change color-grade preset | `src/styles/index.css` | `data-grade="visible"` | `subtle`, `visible`, `strong` |
| Disable color grade completely | `src/sections/Businesses.tsx` | Add `no-color-grade` class to canvas wrapper | Completely removes overlays |
| Scrollbar colors & width | `src/styles/index.css` | `--scrollbar-track`, `--scrollbar-thumb`, `--scrollbar-width` | Hex colors and px width |
| Mouse video scrub sensitivity | `src/hooks/useVideoScrub.ts` | `const SENSITIVITY = 0.8;` | 0.4 to 1.5 |
| Products autoplay setting | `src/lib/products.ts` | `AUTOPLAY = false;` | `true` or `false` |
| Products catalog & placeholders | `src/lib/products.ts` | `FEATURED_PRODUCTS` array | Edit titles, prices, ratings, and copy |
| Products section colors | `src/styles/index.css` | `--products-bg`, `--products-tan`, etc. | Adjust carousel theme colors |

---

## 12. QUICK FACTS TABLE

| Metric / Setting | Exact Value in Code |
| :--- | :--- |
| **Total Frames** | 162 frames (`0001.webp` - `0162.webp`) |
| **Frame Extraction FPS** | 7 fps |
| **Frame Resolution** | 1280x720 (`scale=1280:-2`) |
| **Frame Quality & Codec** | WebP (libwebp, `-quality 75`) |
| **Extraction Sequence Order** | Reversed (`0001` = End, `0162` = Start) |
| **Section 2 Track Height** | `1000vh` (desktop) / `1200vh` (mobile < 768px) |
| **Active Scrub Distance** | ~860vh (desktop) |
| **Boundary Holds** | Start: `10vh`, End: `30vh` |
| **Animation Easing (`EASE`)** | `0.06` |
| **Speed Limit (`MAX_PROGRESS_PER_SECOND`)** | `0.18` (minimum ~5.5s full playback) |
| **Frame Gap** | `clamp(10px, 1.2vw, 18px)` (desktop) / `8px` (mobile) |
| **Frame Corner Radius** | `clamp(16px, 2vw, 28px)` (desktop) / `14px` (mobile) |
| **Notch Fillet Radius** | `clamp(14px, 1.6vw, 24px)` (desktop) / `10px` (mobile) |
| **Featured Products Count** | 5 items (`smartwatch`, `shoes`, `headphones`, `camera`, `backpack`) |
| **Products Carousel Layout** | 5-card arch/stack (center card prominent, initial index 2) |
| **Products Image Format** | WebP with alpha transparency (`public/images/products/`) |
| **Frame Track Color** | `#f5ebe0` |
| **Scrollbar Thumb Color** | `#8f7a62` |
| **Brand Accent Color** | `#1774c8` |
| **Primary Typography** | Playfair Display (Serif), Plus Jakarta Sans (Sans) |
| **Development Port** | `5173` |
