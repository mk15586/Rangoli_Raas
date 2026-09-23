'use client';

import React from 'react';
import { HIGHLIGHTS } from '@/lib/constants';
import { DandiyaDivider } from '@/components/ui/Ornaments';

// Custom bespoke minimalist SVG icons tailored to the festive luxury identity
function HighlightIcon({ type }: { type: string }) {
  switch (type) {
    case 'Live Dhol & Celebrity DJ':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="9" r="6" />
          <path d="M15 9l5-5M15 15l5 5" />
          <path d="M12 18v3M9 21h6" />
          <circle cx="9" cy="9" r="2" fill="#D4AF37" fillOpacity="0.4" />
        </svg>
      );
    case 'Mega 50,000 sq.ft Arena':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
          <circle cx="12" cy="12" r="2" fill="#D4AF37" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      );
    case 'Royal Gujarati Food Street':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      );
    case 'Cinematic Photo Booths':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" fill="#D4AF37" fillOpacity="0.2" />
        </svg>
      );
    case 'Safe & Premium Atmosphere':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'Mesmerizing Night Lights':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="3" fill="#D4AF37" />
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export function Highlights() {
  return (
    <section id="highlights" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#090306] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Unrivaled Ambiance
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-[#FAF5EF] mt-2">
            Event Highlights
          </h2>
          <DandiyaDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#FAF5EF]/70">
            Carefully curated to deliver an elevated celebratory atmosphere with seamless comfort.
          </p>
        </div>

        {/* 6 Minimal Highlight Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HIGHLIGHTS.map((item, index) => (
            <div
              key={item.id}
              className="group p-6 sm:p-8 rounded-xl bg-[#13070E] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#6E1E3A]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Tag and Index */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#D4AF37]/90 bg-[#6E1E3A]/30 border border-[#D4AF37]/30 px-2.5 py-1 rounded">
                  {item.tag}
                </span>
                <span className="font-serif text-xs text-[#FAF5EF]/30 font-bold">
                  0{index + 1}
                </span>
              </div>

              {/* Custom Icon */}
              <div className="w-12 h-12 rounded-lg bg-[#1A0A13] border border-[#D4AF37]/30 text-[#F3E5AB] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:border-[#D4AF37]/70 transition-all duration-200">
                <HighlightIcon type={item.title} />
              </div>

              {/* Title & Description */}
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF5EF] mb-2 group-hover:text-[#F3E5AB] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-[#FAF5EF]/70 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
