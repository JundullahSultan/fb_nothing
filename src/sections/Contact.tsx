import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2, Youtube, Facebook } from 'lucide-react';
import { SOCIAL_LINKS } from '../lib/constants';
import ContactDropdown from '../components/ContactDropdown';

/* ==========================================================================
   TIKTOK OUTLINE ICON
   Clean SVG matching lucide outline icon style.
   ========================================================================== */
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

/* ==========================================================================
   CONTACT SECTION
   Full-screen minimal editorial contact page.
   ========================================================================== */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Business Collaboration',
    message: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  // One-time IntersectionObserver for reveal animation
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!form.name.trim()) newErrors.name = 'Please enter your name.';
    if (!form.email.trim()) newErrors.email = 'Please enter a valid email address.';
    if (!form.message.trim()) newErrors.message = 'Please enter your message.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({
        name: '',
        email: '',
        subject: 'Business Collaboration',
        message: '',
      });
    }, 4000);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-10 w-full min-h-[100vh] min-h-[100svh] bg-[var(--contact-bg,#fbf8f3)] text-[var(--contact-ink,#0b1c31)] flex flex-col justify-between overflow-x-clip px-6 sm:px-10 md:px-14 lg:px-16 pt-20 sm:pt-24 lg:pt-28 pb-6"
      style={{
        scrollMarginTop: '0px',
        color: 'var(--contact-ink, #0b1c31)',
      }}
    >
      <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between gap-8 sm:gap-12">
        {/* ====================================================================
            1. HEADING (Top): Giant ultra-bold "Get in touch"
            ==================================================================== */}
        <div className="w-full overflow-hidden">
          <h2 className="text-[clamp(52px,11.8vw,195px)] font-extrabold tracking-[-0.05em] leading-[0.88] text-[var(--contact-ink)] select-none w-full">
            <span className="inline-block overflow-hidden pb-2 -mb-2">
              <span
                className={`inline-block transition-transform duration-600 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                  isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
              >
                Get&nbsp;
              </span>
            </span>
            <span className="inline-block overflow-hidden pb-2 -mb-2">
              <span
                className={`inline-block transition-transform duration-600 ease-out delay-[80ms] motion-reduce:transition-none motion-reduce:transform-none ${
                  isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
              >
                in&nbsp;
              </span>
            </span>
            <span className="inline-block overflow-hidden pb-2 -mb-2">
              <span
                className={`inline-block transition-transform duration-600 ease-out delay-[160ms] motion-reduce:transition-none motion-reduce:transform-none ${
                  isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
              >
                touch
              </span>
            </span>
          </h2>
        </div>

        {/* ====================================================================
            2. MIDDLE (Grid: 12 Columns)
               Left (cols 1-5): Real project description & info
               Right (cols 6-12): Minimal underlined form
            ==================================================================== */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start my-auto py-4 sm:py-6 transition-all duration-700 ease-out delay-200 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          {/* LEFT: Info Block */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6 max-w-md">
            <div>
              <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--contact-muted)] font-normal mb-4">
                For business inquiries, clothing collaborations, automotive consultation, or brand partnerships, reach out directly.
              </p>
              <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--contact-muted)] font-normal">
                Direct inquiries are reviewed and answered in the order received.
              </p>
            </div>
          </div>

          {/* RIGHT: Minimal Form */}
          <div className="lg:col-span-7 w-full">
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="py-12 flex flex-col items-start gap-3 bg-[var(--contact-bg)] border-b border-[var(--contact-line)]"
              >
                <div className="flex items-center gap-3 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <h3 className="text-base font-semibold text-[var(--contact-ink)]">
                    Message Received
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[var(--contact-muted)]">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[12px] font-semibold tracking-wide text-[var(--contact-ink)] mb-1"
                  >
                    Name{' '}
                    <span className="text-[var(--contact-muted)] font-normal">
                      (required)
                    </span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="Your name"
                    className="contact-input w-full bg-transparent rounded-none px-0 py-2.5 h-[44px] text-base text-[var(--contact-ink)] placeholder:text-[var(--contact-muted)]/50"
                  />
                  {errors.name && (
                    <p
                      id="contact-name-error"
                      role="alert"
                      className="mt-1 text-xs text-red-700 font-medium"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Service / Inquiry Type */}
                <div>
                  <label
                    htmlFor="contact-inquiry"
                    className="block text-[12px] font-semibold tracking-wide text-[var(--contact-ink)] mb-1"
                  >
                    Service{' '}
                    <span className="text-[var(--contact-muted)] font-normal">
                      (required)
                    </span>
                  </label>
                  <ContactDropdown
                    id="contact-inquiry"
                    name="subject"
                    value={form.subject}
                    onChange={(val) => setForm({ ...form, subject: val })}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[12px] font-semibold tracking-wide text-[var(--contact-ink)] mb-1"
                  >
                    Email{' '}
                    <span className="text-[var(--contact-muted)] font-normal">
                      (required)
                    </span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="name@company.com"
                    className="contact-input w-full bg-transparent rounded-none px-0 py-2.5 h-[44px] text-base text-[var(--contact-ink)] placeholder:text-[var(--contact-muted)]/50"
                  />
                  {errors.email && (
                    <p
                      id="contact-email-error"
                      role="alert"
                      className="mt-1 text-xs text-red-700 font-medium"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[12px] font-semibold tracking-wide text-[var(--contact-ink)] mb-1"
                  >
                    Project description{' '}
                    <span className="text-[var(--contact-muted)] font-normal">
                      (required)
                    </span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={2}
                    value={form.message}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    placeholder="Describe your inquiry..."
                    className="contact-input w-full bg-transparent rounded-none px-0 py-2.5 min-h-[44px] text-base text-[var(--contact-ink)] placeholder:text-[var(--contact-muted)]/50 resize-y"
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      role="alert"
                      className="mt-1 text-xs text-red-700 font-medium"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="rounded-full bg-[var(--contact-ink)] text-[var(--contact-bg)] hover:bg-[#152e4d] h-[44px] px-8 font-medium text-xs tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer transition-all duration-200 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--contact-accent)] shadow-sm hover:shadow"
                  >
                    <span>Send Message</span>
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ====================================================================
            3. BOTTOM ROW 2: Thin footer line with Copyright & Social Links
            ==================================================================== */}
        <div
          className={`w-full border-t border-[var(--contact-line)]/30 pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--contact-muted)] transition-all duration-700 ease-out delay-300 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          {/* Copyright */}
          <div>
            © {new Date().getFullYear()} FB Nothing. All rights reserved.
          </div>

          {/* Social Links as small outline icons */}
          <div className="flex items-center gap-5">
            <a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FB Nothing YouTube Channel"
              className="text-[var(--contact-ink)] hover:text-[var(--contact-accent)] transition-colors p-1"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FB Nothing TikTok Profile"
              className="text-[var(--contact-ink)] hover:text-[var(--contact-accent)] transition-colors p-1"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FB Nothing Facebook Page"
              className="text-[var(--contact-ink)] hover:text-[var(--contact-accent)] transition-colors p-1"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
