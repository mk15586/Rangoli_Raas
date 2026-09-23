'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Ticket, ChevronDown, Sparkles } from 'lucide-react';
import { EVENT_DETAILS } from '@/lib/constants';
import { DandiyaDivider, MandalaCorner } from '@/components/ui/Ornaments';

interface HeroSectionProps {
  onOpenBookingModal: () => void;
}

export function HeroSection({ onOpenBookingModal }: HeroSectionProps) {
  // Countdown Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 28,
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const targetDate = new Date(EVENT_DETAILS.isoDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#090306]">
      {/* Layer 1: Atmospheric Background Gradient Mesh & Bokeh */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Deep wine radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-[#6E1E3A]/30 blur-[130px] rounded-full" />
        
        {/* Warm gold ambient accent */}
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-[#D4AF37]/12 blur-[120px] rounded-full" />

        {/* Deep maroon base vignette */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#090306] via-[#090306]/80 to-transparent z-10" />
      </div>

      {/* Layer 2: Subtle Geometric Rangoli Vector Pattern Watermark */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
        aria-hidden="true"
      />

      {/* Mandala Corners */}
      <MandalaCorner position="top-left" className="top-20 left-4 sm:left-8" />
      <MandalaCorner position="top-right" className="top-20 right-4 sm:right-8" />

      {/* Main Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center">
        
        {/* Urgency / Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6E1E3A]/40 border border-[#D4AF37]/40 backdrop-blur-md mb-6 shadow-inner animate-in fade-in duration-500">
          <Sparkles className="w-3.5 h-3.5 text-[#E5B869] animate-pulse" />
          <span className="text-xs sm:text-sm font-medium tracking-widest text-[#F3E5AB] uppercase">
            Official 2026 Ticket Bookings Open
          </span>
        </div>

        {/* Editorial Royal Headings */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-[0.12em] text-[#FAF5EF] leading-[1.05] drop-shadow-2xl">
          <span className="block text-white/95">DANDIYA</span>
          <span className="block gold-gradient-text mt-1">NIGHTS</span>
        </h1>

        {/* Cinematic Tagline */}
        <p className="mt-4 text-base sm:text-xl md:text-2xl font-light tracking-[0.25em] text-[#F3E5AB]/90 uppercase">
          {EVENT_DETAILS.tagline}
        </p>

        {/* Elegant Dandiya Divider */}
        <DandiyaDivider className="my-5" />

        {/* Subtitle / Description */}
        <p className="max-w-2xl text-sm sm:text-base text-[#FAF5EF]/75 font-normal leading-relaxed mb-8">
          Step into India&apos;s most anticipated luxury Garba spectacle. An unforgettable night of electrifying folk beats, live celebrity DJs, mirror-lit traditional attire, and royal culinary indulgence.
        </p>

        {/* Key Event Metadata Cards / Pill */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-3xl mb-10 text-left">
          {/* Date */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#14070F]/80 border border-[#D4AF37]/25 backdrop-blur-md shadow-lg">
            <div className="p-2 rounded-lg bg-[#6E1E3A]/50 text-[#F3E5AB] border border-[#D4AF37]/30">
              <Calendar className="w-5 h-5 text-[#E5B869]" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#D4AF37]/80 font-semibold">Date</p>
              <p className="text-sm font-semibold text-[#FAF5EF]">{EVENT_DETAILS.dateFormatted}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#14070F]/80 border border-[#D4AF37]/25 backdrop-blur-md shadow-lg">
            <div className="p-2 rounded-lg bg-[#6E1E3A]/50 text-[#F3E5AB] border border-[#D4AF37]/30">
              <Clock className="w-5 h-5 text-[#E5B869]" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#D4AF37]/80 font-semibold">Timings</p>
              <p className="text-sm font-semibold text-[#FAF5EF]">{EVENT_DETAILS.doorsOpen} onwards</p>
            </div>
          </div>

          {/* Venue */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#14070F]/80 border border-[#D4AF37]/25 backdrop-blur-md shadow-lg">
            <div className="p-2 rounded-lg bg-[#6E1E3A]/50 text-[#F3E5AB] border border-[#D4AF37]/30">
              <MapPin className="w-5 h-5 text-[#E5B869]" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#D4AF37]/80 font-semibold">Venue</p>
              <p className="text-sm font-semibold text-[#FAF5EF] truncate max-w-[180px]" title={EVENT_DETAILS.venue}>
                {EVENT_DETAILS.venue}
              </p>
            </div>
          </div>
        </div>

        {/* Live Countdown Timer */}
        <div className="mb-10 w-full max-w-lg">
          <div className="flex items-center justify-center gap-3 sm:gap-6 p-4 rounded-2xl bg-[#160711]/60 border border-[#D4AF37]/20 backdrop-blur-md shadow-inner">
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF5EF]">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D4AF37]/75 font-medium mt-0.5">
                Days
              </span>
            </div>
            <span className="text-[#D4AF37]/40 font-serif text-xl -mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF5EF]">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D4AF37]/75 font-medium mt-0.5">
                Hours
              </span>
            </div>
            <span className="text-[#D4AF37]/40 font-serif text-xl -mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF5EF]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D4AF37]/75 font-medium mt-0.5">
                Mins
              </span>
            </div>
            <span className="text-[#D4AF37]/40 font-serif text-xl -mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="font-serif text-2xl sm:text-3xl font-bold gold-gradient-text">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D4AF37]/75 font-medium mt-0.5">
                Secs
              </span>
            </div>
          </div>
        </div>

        {/* Primary & Secondary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onOpenBookingModal}
            className="w-full sm:w-auto px-8 py-4 text-base font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] via-[#E5B869] to-[#D4AF37] hover:from-[#FFF2D6] hover:to-[#E5B869] rounded-full shadow-lg shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Ticket className="w-5 h-5 text-[#6E1E3A]" />
            <span>Book Passes from ₹299</span>
          </button>

          <a
            href="#event-info"
            className="w-full sm:w-auto px-7 py-4 text-sm font-semibold uppercase tracking-wider text-[#FAF5EF] hover:text-[#F3E5AB] bg-[#1A0A14]/70 hover:bg-[#250E1D] border border-[#D4AF37]/35 hover:border-[#D4AF37]/60 rounded-full transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Explore Experience</span>
            <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
          </a>
        </div>

        {/* Security & Satisfaction Tagline */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-[#FAF5EF]/60 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Instant Digital Pass with QR
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="hidden sm:flex items-center gap-1.5">
            Free Wooden Dandiya Sticks
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            Guaranteed Verified Entry
          </span>
        </div>

      </div>
    </section>
  );
}
