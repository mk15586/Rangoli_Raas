'use client';

import React, { useState } from 'react';
import { DandiyaDivider } from '@/components/ui/Ornaments';
import { Camera, Sparkles } from 'lucide-react';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "The Midnight Maha Raas",
    category: "Main Arena",
    subtitle: "5,000+ dancers moving in concentric circles to live dhol",
    gradient: "from-[#6E1E3A] via-[#380D1D] to-[#12040B]",
    accent: "text-[#F3E5AB]",
  },
  {
    id: 2,
    title: "Mirror Work & Bandhani Elegance",
    category: "Festive Attire",
    subtitle: "Traditional Gujarati craftsmanship illuminated by lanterns",
    gradient: "from-[#4D1227] via-[#2A0B17] to-[#0A0206]",
    accent: "text-[#E5B869]",
  },
  {
    id: 3,
    title: "12-Piece Live Dhol Troupe",
    category: "Music & Beats",
    subtitle: "Rhythmic beats that resonate through the starlit night",
    gradient: "from-[#6E1E3A]/80 via-[#36081B] to-[#14060E]",
    accent: "text-[#F5D061]",
  },
  {
    id: 4,
    title: "Royal Lantern Illumination",
    category: "Atmosphere",
    subtitle: "Festive hanging lamps and ambient fairy light tunnels",
    gradient: "from-[#52132A] via-[#250814] to-[#0B0408]",
    accent: "text-[#E5B869]",
  },
  {
    id: 5,
    title: "Gourmet Kathiyawadi Street",
    category: "Culinary Haven",
    subtitle: "Piping hot Jalebi, crispy Fafda, and royal Kesar milk",
    gradient: "from-[#430D20] via-[#220711] to-[#0D0409]",
    accent: "text-[#F3E5AB]",
  },
  {
    id: 6,
    title: "360° Celebrity Photo Plaza",
    category: "Memories",
    subtitle: "Capturing festive glamour and unforgettable candid smiles",
    gradient: "from-[#6E1E3A] via-[#33091B] to-[#11050D]",
    accent: "text-[#F3E5AB]",
  },
];

export function GallerySection() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Main Arena', 'Festive Attire', 'Music & Beats', 'Atmosphere'];

  const filteredItems = activeFilter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0408] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Visual Memories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-[#FAF5EF] mt-2">
            The Celebration Gallery
          </h2>
          <DandiyaDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#FAF5EF]/70">
            A glimpse into the magical nights of devotion, music, dance, and togetherness.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#6E1E3A] text-[#F3E5AB] border border-[#D4AF37]/60 shadow-md shadow-[#6E1E3A]/40'
                  : 'bg-[#14060E] text-[#FAF5EF]/70 border border-white/10 hover:border-[#D4AF37]/30 hover:text-[#FAF5EF]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Gallery Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative h-80 rounded-2xl overflow-hidden border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all duration-300 shadow-xl"
            >
              {/* Artistically Art-directed Festive Background Visual */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} group-hover:scale-105 transition-transform duration-700`}>
                {/* Traditional motif pattern watermark */}
                <div 
                  className="absolute inset-0 opacity-15 bg-repeat"
                  style={{
                    backgroundImage: `radial-gradient(#D4AF37 1.5px, transparent 1.5px)`,
                    backgroundSize: '24px 24px'
                  }}
                />
                
                {/* Visual Camera/Sparkle Emblem */}
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#090306]/70 border border-[#D4AF37]/40 flex items-center justify-center text-[#E5B869] backdrop-blur-md">
                  <Camera className="w-4 h-4" />
                </div>
              </div>

              {/* Foreground Dark Vignette & Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090306] via-[#090306]/60 to-transparent flex flex-col justify-end p-6 z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5B869] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  {item.category}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#FAF5EF] group-hover:text-[#F3E5AB] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#FAF5EF]/70 mt-1 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
