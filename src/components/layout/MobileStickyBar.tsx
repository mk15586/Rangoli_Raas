'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Sparkles } from 'lucide-react';

interface MobileStickyBarProps {
}

export function MobileStickyBar({}: MobileStickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#0F040A]/95 backdrop-blur-lg border-t border-[#D4AF37]/30 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
            <Sparkles className="w-2.5 h-2.5 text-[#E5B869]" />
            <span>Rangilo Raas 2026</span>
          </div>
          <p className="text-xs font-bold text-[#FAF5EF]">Passes from <strong className="gold-gradient-text text-sm">₹299</strong></p>
        </div>

        <a
          href="#tickets"
          className="flex-1 max-w-[180px] py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] via-[#E5B869] to-[#D4AF37] active:scale-[0.97] rounded-full shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Ticket className="w-4 h-4 text-[#6E1E3A]" />
          <span>Book Passes</span>
        </a>
      </div>
    </div>
  );
}
