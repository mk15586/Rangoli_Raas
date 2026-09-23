'use client';

import React, { useState } from 'react';
import { FAQS } from '@/lib/constants';
import { DandiyaDivider } from '@/components/ui/Ornaments';
import { ChevronDown } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#090306] relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-[#FAF5EF] mt-2">
            Frequently Asked Questions
          </h2>
          <DandiyaDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#FAF5EF]/70">
            Everything you need to know about passes, entry protocols, dress guidelines, and venue amenities.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-[#D4AF37]/20 bg-[#12050D] overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-[#1A0A13] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg font-semibold text-[#FAF5EF]">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-[#6E1E3A]/40 text-[#D4AF37] border border-[#D4AF37]/30 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-[#6E1E3A]' : ''}`}>
                    <ChevronDown className="w-4 h-4 text-[#F3E5AB]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#FAF5EF]/75 leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
