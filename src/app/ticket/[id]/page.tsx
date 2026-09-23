'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TicketPass } from '@/components/ticket/TicketPass';
import { GeneratedTicket } from '@/lib/types';
import { EVENT_DETAILS } from '@/lib/constants';
import { ArrowLeft, Ticket } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TicketPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;

  // Fallback demo ticket if viewed directly via URL
  const demoTicket: GeneratedTicket = {
    ticketId: ticketId || 'DN-892415',
    ticketToken: `DND_${ticketId || '9K2LP91Q'}X882`,
    orderId: 'order_rzp_9829381',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.sharma@example.com',
    customerPhone: '+91 98250 12345',
    tierId: 'family',
    tierName: 'Family Pass',
    quantity: 1,
    totalAttendees: 5,
    subtotal: 999,
    tax: 180,
    totalPaid: 1179,
    bookingDate: '13 Sep 2026',
    eventDate: EVENT_DETAILS.dateFormatted,
    eventTime: EVENT_DETAILS.doorsOpen,
    venue: EVENT_DETAILS.venue,
    gateEntry: 'Gate 1 (Family Entry)',
  };

  return (
    <div className="min-h-screen bg-[#090306] text-[#FAF5EF] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#FAF5EF]/70 hover:text-[#F3E5AB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Event Home</span>
          </Link>

          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#D4AF37] hover:text-[#F3E5AB] transition-colors"
          >
            <Ticket className="w-4 h-4" />
            <span>Book Additional Passes</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Official E-Ticket Pass
          </span>
          <h1 className="font-serif text-3xl font-bold uppercase tracking-wider text-[#FAF5EF] mt-1">
            Gate Entry Pass
          </h1>
          <p className="text-xs text-[#FAF5EF]/60 mt-1">
            Present this digital QR code or printed pass at the venue entrance.
          </p>
        </div>

        {/* The Ticket Pass */}
        <TicketPass ticket={demoTicket} />
      </main>

      <Footer />
    </div>
  );
}
