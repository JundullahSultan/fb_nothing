import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { ChevronDown, Check, Handshake, Shirt, Car, Clapperboard } from 'lucide-react';

/* ==========================================================================
   CONTACT DROPDOWN TYPES & DEFAULT OPTIONS
   ========================================================================== */
export interface ContactDropdownOption {
  value: string;
  label: string;
  group: 'ventures' | 'media';
  icon: React.ComponentType<{ className?: string }>;
}

export const CONTACT_DROPDOWN_OPTIONS: ContactDropdownOption[] = [
  {
    value: 'Business Collaboration',
    label: 'Business Collaboration',
    group: 'ventures',
    icon: Handshake,
  },
  {
    value: 'Fashion & Retail',
    label: 'Fashion & Apparel',
    group: 'ventures',
    icon: Shirt,
  },
  {
    value: 'Automotive & Cars',
    label: 'Automotive Venture',
    group: 'ventures',
    icon: Car,
  },
  {
    value: 'Media & Sponsorship',
    label: 'Media & Sponsorship',
    group: 'media',
    icon: Clapperboard,
  },
];

export interface ContactDropdownProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options?: ContactDropdownOption[];
  disabled?: boolean;
  className?: string;
  ariaDescribedBy?: string;
}

/* ==========================================================================
   CUSTOM FLOATING CONTACT DROPDOWN COMPONENT
   Accessible WAI-ARIA combobox/listbox with custom rounded menu card.
   ========================================================================== */
export default function ContactDropdown({
  id = 'contact-inquiry',
  name = 'subject',
  value,
  onChange,
  options = CONTACT_DROPDOWN_OPTIONS,
  disabled = false,
  className = '',
  ariaDescribedBy,
}: ContactDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const uniqueId = useId();
  const listboxId = `${id}-listbox-${uniqueId}`;

  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : options[0];

  // Calculate flip-up placement (collision detection)
  const updatePlacement = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const estimatedHeight = 230; // 4 items + separators + padding
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
      setPlacement('top');
    } else {
      setPlacement('bottom');
    }
  }, []);

  // Update placement and reset highlighted index on open
  useEffect(() => {
    if (isOpen) {
      updatePlacement();
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, selectedIndex, updatePlacement]);

  // Click outside listener (pointerdown ensures immediate capture on touch & mouse)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isOpen]);

  // Scroll highlighted item into view if necessary
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [isOpen, highlightedIndex]);

  const selectOption = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            selectOption(options[highlightedIndex].value);
          } else {
            setIsOpen(false);
          }
        } else {
          setIsOpen(true);
        }
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
        } else {
          setHighlightedIndex((prev) => (prev + 1) % options.length);
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(
            selectedIndex >= 0 ? selectedIndex : options.length - 1
          );
        } else {
          setHighlightedIndex((prev) =>
            prev <= 0 ? options.length - 1 : prev - 1
          );
        }
        break;
      }
      case 'Home': {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      }
      case 'End': {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;
      }
      case 'Escape': {
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
      }
      case 'Tab': {
        // Close menu and let focus advance naturally to the next field
        if (isOpen) {
          setIsOpen(false);
        }
        break;
      }
      default: {
        // Quick type-ahead character jump
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const char = e.key.toLowerCase();
          const matchIndex = options.findIndex((opt) =>
            opt.label.toLowerCase().startsWith(char)
          );
          if (matchIndex >= 0) {
            e.preventDefault();
            if (!isOpen) setIsOpen(true);
            setHighlightedIndex(matchIndex);
          }
        }
        break;
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Hidden input to preserve standard form submission / FormData */}
      <input type="hidden" name={name} value={value} />

      {/* Trigger Button: matches underlined form field styling */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen && highlightedIndex >= 0
            ? `${listboxId}-opt-${highlightedIndex}`
            : undefined
        }
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
        className={`contact-input w-full bg-transparent rounded-none px-0 py-2.5 h-[44px] text-base text-[var(--contact-ink)] flex items-center justify-between text-left cursor-pointer transition-colors duration-150 select-none ${
          isOpen ? 'is-open' : ''
        }`}
      >
        <span className="truncate font-normal">
          {selectedOption ? selectedOption.label : value}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--contact-muted)] shrink-0 transition-transform duration-200 pointer-events-none ${
            isOpen ? 'rotate-180 text-[var(--contact-accent)]' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Floating Menu Card */}
      {isOpen && (
        <div
          className={`contact-dropdown-card absolute left-0 z-50 w-full sm:w-[360px] bg-white rounded-2xl p-1.5 shadow-[0_16px_38px_-6px_rgba(11,28,49,0.14),0_6px_16px_rgba(11,28,49,0.06)] border border-[rgba(11,28,49,0.08)] backdrop-blur-none ${
            placement === 'top'
              ? 'bottom-full mb-2 origin-bottom animate-contact-dropdown-top'
              : 'top-full mt-2 origin-top animate-contact-dropdown-bottom'
          }`}
        >
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-label="Service or Inquiry Type"
            tabIndex={-1}
            className="p-0 m-0 list-none focus:outline-none"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;
              const Icon = option.icon;
              const prevOption = index > 0 ? options[index - 1] : null;
              const showDivider = prevOption && prevOption.group !== option.group;

              return (
                <React.Fragment key={option.value}>
                  {showDivider && (
                    <li
                      role="separator"
                      className="my-1 border-t border-[rgba(11,28,49,0.08)]"
                      aria-hidden="true"
                    />
                  )}
                  <li
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    id={`${listboxId}-opt-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectOption(option.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex items-center justify-between w-full px-3.5 py-3 rounded-xl text-left cursor-pointer transition-colors duration-150 select-none ${
                      isHighlighted
                        ? 'bg-[var(--poster-bg,#f5ebe0)]/60 text-[var(--contact-ink)]'
                        : isSelected
                        ? 'bg-black/[0.03] text-[var(--contact-ink)]'
                        : 'text-[var(--contact-ink)] hover:bg-[var(--poster-bg,#f5ebe0)]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isSelected || isHighlighted
                            ? 'text-[var(--contact-accent)]'
                            : 'text-[var(--contact-ink)]/70'
                        }`}
                        aria-hidden="true"
                      />
                      <span
                        className={`text-[14px] sm:text-[15px] truncate leading-tight ${
                          isSelected ? 'font-semibold text-[var(--contact-ink)]' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>

                    {isSelected && (
                      <Check
                        className="w-4 h-4 text-[var(--contact-accent)] shrink-0 ml-auto"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
