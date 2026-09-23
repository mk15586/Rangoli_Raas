'use client';

import React from 'react';
import { ARTISTS } from '@/lib/constants';
import { DandiyaDivider } from '@/components/ui/Ornaments';
import { Mic2, Music4, Flame } from 'lucide-react';

export function ArtistsLineup() {
  return (
    <section id="artists" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0C0409] relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Headlining Performers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-[#FAF5EF] mt-2">
            The Star Lineup
          </h2>
          <DandiyaDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#FAF5EF]/70">
            A harmonious fusion of iconic Gujarati folk vocalists, high-energy Bollywood remix artists, and majestic dhol tasha ensembles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTISTS.map((artist, idx) => (
            <div
              key={artist.name}
              className="group relative rounded-2xl bg-[#14070F] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              {/* Artistically Art-directed Banner Visual */}
              <div className="relative h-60 w-full overflow-hidden bg-gradient-to-t from-[#14070F] via-[#2D0D1D] to-[#6E1E3A]/40 flex items-center justify-center">
                {/* Background Pattern */}
                <div 
                  className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-700 bg-repeat"
                  style={{
                    backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
                    backgroundSize: '16px 16px'
                  }}
                />
                
                {/* Visual Icon / Artistic Graphic */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-[#090306]/80 border-2 border-[#D4AF37]/60 flex items-center justify-center text-[#F3E5AB] shadow-xl group-hover:scale-105 transition-transform duration-300">
                  {idx === 0 && <Mic2 className="w-9 h-9 text-[#E5B869]" />}
                  {idx === 1 && <Music4 className="w-9 h-9 text-[#E5B869]" />}
                  {idx === 2 && <Flame className="w-9 h-9 text-[#E5B869]" />}
                </div>

                <div className="absolute bottom-3 left-4 z-10">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-[#6E1E3A]/90 text-[#F3E5AB] border border-[#D4AF37]/40 backdrop-blur-sm">
                    {artist.tag}
                  </span>
                </div>
              </div>

              {/* Artist Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#FAF5EF] group-hover:text-[#F3E5AB] transition-colors">
                    {artist.name}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mt-1 mb-3">
                    {artist.role}
                  </p>
                  <p className="text-sm text-[#FAF5EF]/70 leading-relaxed">
                    {artist.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#FAF5EF]/60">
                  <span>Main Arena Stage</span>
                  <span className="text-[#E5B869] font-medium">8:00 PM Onwards</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
