'use client';

import React, { use, useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TicketPass } from '@/components/ticket/TicketPass';
import { GeneratedTicket } from '@/lib/types';
import { EVENT_DETAILS } from '@/lib/constants';
import { ArrowLeft, Ticket, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

function TicketContent({ ticketId }: { ticketId: string }) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(!!token);
  const [isVerified, setIsVerified] = useState(false);
  const [ticketData, setTicketData] = useState<GeneratedTicket | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/ticket/verify?ticketId=${encodeURIComponent(ticketId)}&token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && data.ticket) {
          const t = data.ticket;
          setIsVerified(true);
          setTicketData({
            ticketId: t.ticketId || ticketId,
            ticketToken: token,
            orderId: t.orderId || 'order_verified',
            customerName: t.customerName || 'Pass Holder',
            customerEmail: t.customerEmail || '',
            customerPhone: t.customerPhone || '',
            tierId: (t.tierId as any) || 'regular',
            tierName: t.tierName || 'Entry Pass',
            quantity: t.quantity || 1,
            totalAttendees: t.totalAttendees || 1,
            subtotal: t.totalPaid || 299,
            tax: 0,
            totalPaid: t.totalPaid || 299,
            bookingDate: new Date(t.issuedAt || Date.now()).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            eventDate: t.eventDate || EVENT_DETAILS.dateFormatted,
            eventTime: EVENT_DETAILS.doorsOpen,
            venue: t.venue || EVENT_DETAILS.venue,
            gateEntry: t.tierId === 'family' ? 'Gate 1 (Family Entry)' : 'Gate 3 (Central)',
          });
        }
      })
      .catch((err) => {
        console.error('Error verifying token:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, ticketId]);

  if (!isVerified || !ticketData) {
    return (
      <div className="mb-6 p-5 rounded-xl bg-[#1c0812] border border-rose-500/40 text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-300" />
        <p className="text-sm font-bold text-white">Ticket verification required</p>
        <p className="text-xs text-rose-200/80 mt-1">This page does not display an admission pass without a valid captured payment token.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Top Banner Verification Status */}
      {loading ? (
        <div className="mb-6 p-4 rounded-xl bg-[#1c0812] border border-[#f4c45b]/30 flex items-center justify-center gap-3 text-sm text-[#f4c45b]">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Verifying encrypted security signature...</span>
        </div>
      ) : isVerified ? (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/60 flex items-center gap-3 shadow-lg">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Cryptographically Verified Entry Pass</p>
            <p className="text-xs text-emerald-300">
              AES-256 authenticated token confirmed for <strong>{ticketData.customerName}</strong>. Valid for event admission.
            </p>
          </div>
        </div>
      ) : null}

      {/* The Ticket Pass */}
      <TicketPass ticket={ticketData} />
    </div>
  );
}

export default function TicketPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const ticketId = resolvedParams.id;

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
            href="/#tickets"
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

        <Suspense fallback={<div className="p-8 text-center text-white/50">Loading ticket...</div>}>
          <TicketContent ticketId={ticketId} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
