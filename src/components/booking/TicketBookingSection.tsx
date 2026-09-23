'use client';

import React from 'react';
import { TICKET_TIERS } from '@/lib/constants';
import { TicketTierId } from '@/lib/types';
import { TicketCard } from './TicketCard';
import { DandiyaDivider } from '@/components/ui/Ornaments';
import { Ticket, ArrowRight, ShieldCheck } from 'lucide-react';

interface TicketBookingSectionProps {
  quantities: Record<TicketTierId, number>;
  onQuantityChange: (tierId: TicketTierId, quantity: number) => void;
  onProceedToCheckout: () => void;
}

export function TicketBookingSection({
  quantities,
  onQuantityChange,
  onProceedToCheckout,
}: TicketBookingSectionProps) {
  // Compute total tickets & total amount
  const totalCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalAmount = TICKET_TIERS.reduce((sum, tier) => {
    return sum + (quantities[tier.id] || 0) * tier.price;
  }, 0);

  return (
    <section id="tickets" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#090306] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Choose Your Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wider text-[#FAF5EF] mt-2">
            Select Passes
          </h2>
          <DandiyaDivider className="my-4" />
          <p className="text-sm sm:text-base text-[#FAF5EF]/70">
            All passes include admission, complimentary authentic Dandiya sticks, and contactless digital gate entry.
          </p>
        </div>

        {/* 4 Ticket Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {TICKET_TIERS.map((tier) => (
            <TicketCard
              key={tier.id}
              tier={tier}
              quantity={quantities[tier.id] || 0}
              onQuantityChange={(q) => onQuantityChange(tier.id, q)}
            />
          ))}
        </div>

        {/* Live Booking Summary Strip */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#170710] via-[#200816] to-[#170710] border border-[#D4AF37]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#6E1E3A] border border-[#D4AF37]/50 flex items-center justify-center text-[#F3E5AB] shrink-0 shadow-lg">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
                Booking Summary
              </p>
              <p className="text-lg sm:text-xl font-bold text-[#FAF5EF] mt-0.5">
                {totalCount === 0 ? (
                  <span className="text-[#FAF5EF]/50 text-base font-normal">Select passes above to proceed</span>
                ) : (
                  <span>{totalCount} Pass{totalCount > 1 ? 'es' : ''} Selected • ₹{totalAmount.toLocaleString('en-IN')}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#FAF5EF]/60 pr-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Razorpay Verified Gateway</span>
            </div>

            <button
              type="button"
              disabled={totalCount === 0}
              onClick={onProceedToCheckout}
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] via-[#E5B869] to-[#D4AF37] hover:from-[#FFF1D0] hover:to-[#E5B869] disabled:opacity-40 disabled:cursor-not-allowed rounded-full shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
            >
              <span>Continue to Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
