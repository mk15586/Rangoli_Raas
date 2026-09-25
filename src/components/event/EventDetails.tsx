'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Shirt, ShieldCheck, Users, ExternalLink } from 'lucide-react';
import { EVENT_DETAILS } from '@/lib/constants';
import { DandiyaDivider, MandalaCorner } from '@/components/ui/Ornaments';

export function EventDetails() {
  const mapLink = 'https://maps.app.goo.gl/KmShKinUXKTfCWna7';

  return (
    <section id="event-info" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0408] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-[#6E1E3A]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-80 h-80 bg-[#D4AF37]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            About The Celebration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-[#FAF5EF] mt-2">
            The Royal Festive Experience
          </h2>
          <DandiyaDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#FAF5EF]/70 leading-relaxed">
            Immerse yourself in Gujarat&apos;s most opulent festive tradition. An evening of synchronized rhythm, authentic melodies, vibrant swirl of colors, and unmatched celebratory spirit.
          </p>
        </div>

        {/* Cohesive Editorial Layout (No generic floating card spam) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border border-[#D4AF37]/20 rounded-2xl p-6 sm:p-10 md:p-12 bg-[#12050D]/60 backdrop-blur-md relative">
          
          <MandalaCorner position="top-left" className="top-4 left-4" />
          <MandalaCorner position="bottom-right" className="bottom-4 right-4" />

          {/* Left Narrative Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-[#D4AF37]/15 pb-8 lg:pb-0">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E5B869] font-semibold">
                Tradition Meets Grandeur
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#FAF5EF] mt-1 mb-4">
                Where Heritage Comes Alive Under The Starlight
              </h3>
              <p className="text-sm sm:text-base text-[#FAF5EF]/80 leading-relaxed mb-4">
                Rangilo Raas brings an authentic festive experience without compromising on comfort, energy, and safety. Join the celebration for an evening of music, dance, cultural programs, and community.
              </p>
              <p className="text-sm sm:text-base text-[#FAF5EF]/80 leading-relaxed">
                Whether you are a seasoned Garba enthusiast dancing in synchronized mandalis or joining with your family for an enchanting evening, our multi-tiered arena accommodates every dancing style with dedicated fast tracks, curated seating, and world-class acoustics.
              </p>
            </div>

            {/* Quick Experience Highlights Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-2xl font-serif font-bold gold-gradient-text">5,000+</p>
                <p className="text-xs text-[#FAF5EF]/70 uppercase tracking-wider mt-1">Festive Revelers</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold gold-gradient-text">6+ Hours</p>
                <p className="text-xs text-[#FAF5EF]/70 uppercase tracking-wider mt-1">Non-Stop Raas</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold gold-gradient-text">100%</p>
                <p className="text-xs text-[#FAF5EF]/70 uppercase tracking-wider mt-1">Live Folk & Beats</p>
              </div>
            </div>

            {/* Venue Location Callout */}
            <div className="p-4 rounded-xl bg-[#1A0A14] border border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E5B869]" />
                  Event Location
                </p>
                <p className="text-sm font-semibold text-[#FAF5EF] mt-0.5">{EVENT_DETAILS.venue}</p>
                <p className="text-xs text-[#FAF5EF]/70">{EVENT_DETAILS.address}, {EVENT_DETAILS.city}</p>
              </div>
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#F3E5AB] hover:text-white bg-[#6E1E3A] hover:bg-[#862447] px-3.5 py-2 rounded-lg border border-[#D4AF37]/40 transition-colors shrink-0"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Essential Details Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h4 className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
              Essential Event Guidelines
            </h4>

            {/* Timeline & Entry */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#6E1E3A]/40 text-[#D4AF37] border border-[#D4AF37]/30 mt-0.5 shrink-0">
                  <Clock className="w-4 h-4 text-[#F3E5AB]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Event Timings</p>
                  <p className="text-sm font-medium text-[#FAF5EF] mt-0.5">{EVENT_DETAILS.doorsOpen} – {EVENT_DETAILS.eventEnd}</p>
                  <p className="text-xs text-[#FAF5EF]/60 mt-0.5">Gates open at 6:30 PM. Live performances start sharply at 7:30 PM.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#6E1E3A]/40 text-[#D4AF37] border border-[#D4AF37]/30 mt-0.5 shrink-0">
                  <Shirt className="w-4 h-4 text-[#F3E5AB]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Dress Code</p>
                  <p className="text-sm font-medium text-[#FAF5EF] mt-0.5">Festive Indian Traditional</p>
                  <p className="text-xs text-[#FAF5EF]/60 mt-0.5">Chaniya Choli, Bandhani, Kediyu, or Kurta Pajama. Casual t-shirts are discouraged.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#6E1E3A]/40 text-[#D4AF37] border border-[#D4AF37]/30 mt-0.5 shrink-0">
                  <Users className="w-4 h-4 text-[#F3E5AB]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Age & Entry Policy</p>
                  <p className="text-sm font-medium text-[#FAF5EF] mt-0.5">Family & Friends Welcomed</p>
                  <p className="text-xs text-[#FAF5EF]/60 mt-0.5">Children under 5 years require an accompanying adult pass.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-[#6E1E3A]/40 text-[#D4AF37] border border-[#D4AF37]/30 mt-0.5 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#F3E5AB]" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">Security & Verification</p>
                  <p className="text-sm font-medium text-[#FAF5EF] mt-0.5">Contactless QR Gate Scanning</p>
                  <p className="text-xs text-[#FAF5EF]/60 mt-0.5">Each pass features an encrypted one-time QR code. Carry a valid photo ID.</p>
                </div>
              </div>
            </div>

            {/* Helpline Box */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#FAF5EF]/70">
              <span>Have special concierge questions?</span>
              <a href={`tel:${EVENT_DETAILS.helpline}`} className="text-[#F3E5AB] font-semibold hover:underline">
                {EVENT_DETAILS.helpline}
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
