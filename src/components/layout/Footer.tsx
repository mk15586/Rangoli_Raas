'use client';

import React from 'react';
import Link from 'next/link';
import { EVENT_DETAILS } from '@/lib/constants';
import { DandiyaDivider } from '@/components/ui/Ornaments';
import { ShieldCheck, Lock, Mail, Phone, MapPin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#070204] border-t border-[#D4AF37]/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-[#FAF5EF]/70 text-sm relative">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#6E1E3A]/20 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#D4AF37]/60 bg-[#6E1E3A] flex items-center justify-center shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F3E5AB]">
                  <path d="M3 21L21 3M3 3L21 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" fill="#D4AF37" />
                </svg>
              </div>
              <div>
                <span className="font-serif tracking-[0.2em] text-lg font-bold uppercase gold-gradient-text block">
                  RANGILO RAAS
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/80 block">
                  Play. Dance. Celebrate.
                </span>
              </div>
            </div>

            <p className="text-xs text-[#FAF5EF]/60 leading-relaxed">
              India&apos;s premier luxury Dandiya and Garba Raas experience. Celebrating heritage, devotion, music, and community with royal hospitality.
            </p>

            <div className="flex items-center gap-3 text-xs text-[#E5B869]">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Secured
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#F3E5AB] mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#event-info" className="hover:text-[#F3E5AB] transition-colors">Event Details & Schedule</a>
              </li>
              <li>
                <a href="#tickets" className="hover:text-[#F3E5AB] transition-colors">Book Passes & Packages</a>
              </li>
              <li>
                <a href="#highlights" className="hover:text-[#F3E5AB] transition-colors">Special Highlights</a>
              </li>
              <li>
                <a href="#artists" className="hover:text-[#F3E5AB] transition-colors">Artists & DJ Lineup</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Venue Information */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#F3E5AB] mb-4">
              Event Venue
            </h4>
            <div className="space-y-2.5 text-xs text-[#FAF5EF]/70">
              <p className="font-semibold text-[#FAF5EF] flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{EVENT_DETAILS.venue}</span>
              </p>
              <p className="pl-6">{EVENT_DETAILS.address}</p>
              <p className="pl-6">{EVENT_DETAILS.city}</p>
              <p className="pl-6 text-[#D4AF37] font-medium pt-1">
                Gates Open: {EVENT_DETAILS.doorsOpen}
              </p>
            </div>
          </div>

          {/* Col 4: Concierge & Helpline */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#F3E5AB] mb-4">
              Concierge Support
            </h4>
            <div className="space-y-3 text-xs">
              <p className="text-[#FAF5EF]/60">
                For corporate bulk pass bookings, VIP cabana reservations, or sponsorship inquiries:
              </p>
              <div className="space-y-2">
                <a href={`tel:${EVENT_DETAILS.helpline}`} className="flex items-center gap-2 text-[#FAF5EF] hover:text-[#F3E5AB] transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{EVENT_DETAILS.helpline}</span>
                </a>
                <a href={`tel:${EVENT_DETAILS.sponsorshipPhone}`} className="flex items-center gap-2 text-[#FAF5EF] hover:text-[#F3E5AB] transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{EVENT_DETAILS.sponsorshipPhone}</span>
                </a>
                <a href={`mailto:${EVENT_DETAILS.supportEmail}`} className="flex items-center gap-2 text-[#FAF5EF] hover:text-[#F3E5AB] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{EVENT_DETAILS.supportEmail}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF5EF]/50">
          <p>© 2026 Rangilo Raas. All rights reserved. Managed with festive pride.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Refund Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
