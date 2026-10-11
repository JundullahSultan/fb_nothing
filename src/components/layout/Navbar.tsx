import { useState } from 'react';
import { ArrowRight, Menu } from 'lucide-react';
import { NAV_LINKS } from '../../lib/constants';
import type { NavbarProps } from '../../types';

export default function Navbar({ mobileMenuOpen, onToggleMenu }: NavbarProps) {
  const [activeHref, setActiveHref] = useState<string>('#home');

  return (
    <header className="absolute top-0 left-0 right-0 z-30 w-full px-6 sm:px-10 md:px-14 py-4 sm:py-5 bg-transparent">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Logo & Wordmark */}
        <a
          href="#home"
          className="flex items-center gap-2.5 select-none text-neutral-900 group"
        >
          <img
            src="/images/logo_black.png"
            alt="FB Nothing Logo"
            className="h-5 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <span className="font-semibold text-[13px] tracking-[0.2em] uppercase text-neutral-900">
            FB NOTHING
          </span>
        </a>

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7 lg:gap-8">
          {NAV_LINKS.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setActiveHref(item.href)}
                className={`relative py-1 text-[12px] tracking-wide transition-colors ${
                  isActive
                    ? 'text-neutral-900 font-medium'
                    : 'text-neutral-600 hover:text-neutral-900 font-normal'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#1a73e8] rounded-full" />
                )}
              </a>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* CTA Button: Get in Touch */}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#0b1c31] hover:bg-[#152e4d] text-white px-3.5 py-1.5 rounded-full text-[11px] tracking-wide font-medium shadow-sm transition-all duration-200 hover:shadow"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-3 h-3 text-neutral-300 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>

          {/* Menu button for mobile */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={onToggleMenu}
            className="w-7 h-7 flex items-center justify-center text-neutral-800 hover:text-neutral-950 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? (
              <div className="relative w-4 h-4 flex items-center justify-center">
                <span className="absolute w-4 h-[1.5px] bg-neutral-900 rotate-45" />
                <span className="absolute w-4 h-[1.5px] bg-neutral-900 -rotate-45" />
              </div>
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
