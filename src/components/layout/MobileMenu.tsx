import { ArrowRight } from 'lucide-react';
import { NAV_LINKS, SOCIAL_LINKS } from '../../lib/constants';
import type { MobileMenuProps } from '../../types';

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col justify-center items-start px-8 sm:px-12 gap-6 md:hidden transition-all duration-300 ${
        isOpen
          ? 'opacity-100 pointer-events-auto translate-y-0'
          : 'opacity-0 pointer-events-none -translate-y-4'
      }`}
    >
      <div className="flex flex-col gap-4">
        {NAV_LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={onClose}
            className="text-xl sm:text-2xl font-medium text-neutral-800 hover:text-neutral-950 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="pt-4 border-t border-neutral-200/80 w-full flex flex-col gap-4">
        <a
          href="#contact"
          onClick={onClose}
          className="inline-flex items-center gap-2 bg-[#0b1c31] text-white px-4 py-2 rounded-full text-xs font-medium w-fit"
        >
          <span>Get in Touch</span>
          <ArrowRight className="w-3 h-3" />
        </a>

        {/* Official Social Links */}
        <div className="flex items-center gap-4 text-xs font-medium text-neutral-600 pt-1">
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            Facebook
          </a>
          <span>•</span>
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-600 transition-colors"
          >
            YouTube
          </a>
          <span>•</span>
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-950 transition-colors"
          >
            TikTok
          </a>
        </div>
      </div>
    </div>
  );
}
