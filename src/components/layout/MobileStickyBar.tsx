'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Sparkles } from 'lucide-react';

interface MobileStickyBarProps {
  onOpenBooking?: () => void;
}

export function MobileStickyBar({ onOpenBooking }: MobileStickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 150px
      if (window.scrollY > 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Quick mobile booking bar"
      className="sm:hidden fixed bottom-3 inset-x-3.5 z-40 max-w-[420px] mx-auto transition-all duration-300 animate-sheet-up"
    >
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-[#120409]/92 backdrop-blur-xl border border-[#F4C45B]/30 shadow-[0_12px_40px_rgba(0,0,0,0.75)]">
        {/* Left: Price preview & Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#3A080D] border border-[#F4C45B]/35 flex items-center justify-center text-[#F4C45B] shrink-0 shadow-inner">
            <Ticket className="w-4 h-4" />
          </div>
          <div className="leading-tight truncate">
            <div className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-[#F4C45B]/90 uppercase">
              <Sparkles className="w-2.5 h-2.5 text-[#FFE8A3]" />
              <span>Rangilo Raas</span>
            </div>
            <p className="text-[12px] font-medium text-white/80">
              From <strong className="font-serif text-[15px] font-bold text-[#F4C45B] ml-0.5">₹299</strong>
            </p>
          </div>
        </div>

        {/* Right: Booking CTA */}
        {onOpenBooking ? (
          <button
            type="button"
            onClick={onOpenBooking}
            className="shrink-0 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-[#140407] bg-gradient-to-r from-[#FFE8A3] via-[#F4C45B] to-[#E5A83B] hover:brightness-105 active:scale-[0.96] rounded-full shadow-[0_4px_16px_rgba(244,196,91,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Book Passes</span>
          </button>
        ) : (
          <a
            href="#tickets"
            className="shrink-0 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-[#140407] bg-gradient-to-r from-[#FFE8A3] via-[#F4C45B] to-[#E5A83B] hover:brightness-105 active:scale-[0.96] rounded-full shadow-[0_4px_16px_rgba(244,196,91,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Book Passes</span>
          </a>
        )}
      </div>
    </aside>
  );
}

