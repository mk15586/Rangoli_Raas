'use client';

import React from 'react';
import { Check, Plus, Minus, Sparkles } from 'lucide-react';
import { TicketTier } from '@/lib/types';

interface TicketCardProps {
  tier: TicketTier;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export function TicketCard({ tier, quantity, onQuantityChange }: TicketCardProps) {
  const isSelected = quantity > 0;

  return (
    <div
      className={`relative rounded-xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isSelected
          ? 'bg-gradient-to-b from-[#1F0A15] to-[#14060E] border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/15 ring-1 ring-[#D4AF37]/40 scale-[1.01]'
          : 'bg-[#12060C] border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 shadow-md'
      }`}
    >
      {/* Top Banner for Badges */}
      {tier.badge && (
        <div className="absolute top-0 right-0">
          <div className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 bg-gradient-to-r from-[#D4AF37] to-[#E5B869] text-[#090306] rounded-bl-lg shadow-sm flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{tier.badge}</span>
          </div>
        </div>
      )}

      {/* Main Ticket Content */}
      <div className="p-6 sm:p-7">
        {/* Tier Header */}
        <div className="mb-4 pr-12">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF5EF]">
            {tier.name}
          </h3>
          <p className="text-xs text-[#FAF5EF]/70 mt-1">
            {tier.tagline}
          </p>
        </div>

        {/* Pricing Area */}
        <div className="my-5 pb-5 border-b border-white/10 flex items-baseline gap-3">
          <span className="font-serif text-3xl sm:text-4xl font-black gold-gradient-text tracking-tight">
            ₹{tier.price.toLocaleString('en-IN')}
          </span>
          {tier.originalPrice && (
            <span className="text-sm text-[#FAF5EF]/40 line-through">
              ₹{tier.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          <span className="text-xs text-[#D4AF37]/80 uppercase tracking-wider font-semibold ml-auto">
            {tier.admitCount === 1 ? 'Admit 1' : `Admit ${tier.admitCount}`}
          </span>
        </div>

        {/* Pass Highlight Callout */}
        <div className="mb-5 p-2.5 rounded-lg bg-[#6E1E3A]/30 border border-[#D4AF37]/25 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E5B869] shrink-0" />
          <span className="text-xs font-semibold text-[#F3E5AB]">
            {tier.passHighlight}
          </span>
        </div>

        {/* Benefits Checklist */}
        <ul className="space-y-2.5 mb-6 text-xs sm:text-sm text-[#FAF5EF]/80" aria-label={`Benefits of ${tier.name}`}>
          {tier.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2.5 leading-relaxed">
              <span className="mt-0.5 p-0.5 rounded-full bg-[#6E1E3A] text-[#D4AF37] shrink-0 border border-[#D4AF37]/30">
                <Check className="w-3 h-3 text-[#E5B869]" />
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Perforation Dotted Line Separator */}
      <div className="relative w-full border-t border-dashed border-[#D4AF37]/30 my-0">
        {/* Left cutout circle */}
        <div className="absolute -left-2.5 -top-2.5 w-5 h-5 rounded-full bg-[#090306] border-r border-[#D4AF37]/30" />
        {/* Right cutout circle */}
        <div className="absolute -right-2.5 -top-2.5 w-5 h-5 rounded-full bg-[#090306] border-l border-[#D4AF37]/30" />
      </div>

      {/* Ticket Footer / Quantity Controls */}
      <div className="p-5 bg-[#0D0409]/90 flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#FAF5EF]/60 font-medium block">
            Quantity
          </span>
          <span className="text-xs font-bold text-[#F3E5AB]">
            {quantity === 0 ? 'None Selected' : `${quantity} pass${quantity > 1 ? 'es' : ''} (₹${(quantity * tier.price).toLocaleString('en-IN')})`}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-[#1A0A14] border border-[#D4AF37]/40 rounded-lg p-1">
          <button
            type="button"
            onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
            disabled={quantity === 0}
            className="w-8 h-8 rounded flex items-center justify-center text-[#FAF5EF] hover:bg-[#6E1E3A] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            aria-label={`Decrease ${tier.name} quantity`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <span className="w-7 text-center font-bold text-sm text-[#FAF5EF]">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
            disabled={quantity >= 10}
            className="w-8 h-8 rounded flex items-center justify-center text-[#FAF5EF] hover:bg-[#6E1E3A] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
            aria-label={`Increase ${tier.name} quantity`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
