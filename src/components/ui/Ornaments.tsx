import React from 'react';

export function DandiyaDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-6 ${className}`} aria-hidden="true">
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
      <div className="relative flex items-center justify-center">
        {/* Subtle crossed dandiya sticks motif */}
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#D4AF37]">
          {/* Stick 1 */}
          <line x1="4" y1="20" x2="28" y2="4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="28" cy="4" r="1.5" fill="#E85D04" />
          <circle cx="4" cy="20" r="1.5" fill="#E85D04" />
          {/* Stick 2 */}
          <line x1="4" y1="4" x2="28" y2="20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="4" cy="4" r="1.5" fill="#E85D04" />
          <circle cx="28" cy="20" r="1.5" fill="#E85D04" />
          {/* Central diamond */}
          <polygon points="16,8 20,12 16,16 12,12" fill="#6E1E3A" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
    </div>
  );
}

export function MandalaCorner({ position = "top-left", className = "" }: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"; className?: string }) {
  const rotationClass = {
    "top-left": "",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "-rotate-90",
  }[position];

  return (
    <div className={`absolute pointer-events-none opacity-30 select-none ${rotationClass} ${className}`} aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2 H28 C28 2 28 14 14 28 C2 28 2 2 2 2 Z" stroke="#D4AF37" strokeWidth="0.75" fill="none" />
        <path d="M2 2 H18 C18 2 18 10 10 18 C2 18 2 2 2 2 Z" stroke="#6E1E3A" strokeWidth="0.75" fill="none" />
        <circle cx="8" cy="8" r="2" fill="#D4AF37" />
        <line x1="2" y1="2" x2="16" y2="16" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="1 2" />
      </svg>
    </div>
  );
}

export function GoldBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F3E5AB] bg-[#6E1E3A]/80 border border-[#D4AF37]/40 rounded-full backdrop-blur-sm shadow-sm ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-pulse" />
      {children}
    </span>
  );
}
