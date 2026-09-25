'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { GeneratedTicket } from '@/lib/types';
import { DandiyaDivider, MandalaCorner } from '@/components/ui/Ornaments';
import { Calendar, Clock, MapPin, Download, Printer, Share2, CheckCircle2, ShieldCheck, Mail, Sparkles, User, Ticket } from 'lucide-react';

interface TicketPassProps {
  ticket: GeneratedTicket;
  onClose?: () => void;
}

export function TicketPass({ ticket, onClose }: TicketPassProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate QR code containing the unguessable unique ticket token
    QRCode.toDataURL(ticket.ticketToken, {
      width: 260,
      margin: 1,
      color: {
        dark: '#090306',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
      });
  }, [ticket.ticketToken]);

  // Handle printing
  const handlePrint = () => {
    window.print();
  };

  // Add to calendar (.ics download)
  const handleDownloadCalendar = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Rangilo Raas//Pass Booking//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Rangilo Raas 2026 - ${ticket.tierName}`,
      `DESCRIPTION:Official Pass for Rangilo Raas 2026. Ticket ID: ${ticket.ticketId}. Token: ${ticket.ticketToken}`,
      `LOCATION:${ticket.venue}`,
      'DTSTART:20261010T130000Z',
      'DTEND:20261010T193000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Dandiya_Nights_${ticket.ticketId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy share link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-3 sm:px-4">
      
      {/* Top Banner Alert */}
      <div className="mb-6 p-4 rounded-xl bg-[#170B12] border border-[#D4AF37]/50 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#FAF5EF]">
              Payment Verified & E-Ticket Issued!
            </p>
            <p className="text-xs text-[#FAF5EF]/70">
              A copy has been queued for <strong className="text-[#F3E5AB]">{ticket.customerEmail}</strong>
            </p>
          </div>
        </div>
        <button
          onClick={() => setEmailModalOpen(true)}
          className="text-xs uppercase tracking-wider font-semibold text-[#D4AF37] hover:text-[#F3E5AB] bg-[#6E1E3A]/40 hover:bg-[#6E1E3A] px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>View Email Pass</span>
        </button>
      </div>

      {/* The Physical-Aesthetic Luxury E-Ticket Pass Card */}
      <div
        ref={ticketRef}
        id="printable-ticket"
        className="relative rounded-2xl bg-gradient-to-b from-[#1E0814] via-[#14060E] to-[#1E0814] border-2 border-[#D4AF37] shadow-2xl overflow-hidden print:bg-white print:text-black print:border-black"
      >
        {/* Subtle Watermark Texture */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none bg-repeat"
          style={{
            backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Decorative Mandala Corners */}
        <MandalaCorner position="top-left" className="top-2 left-2" />
        <MandalaCorner position="top-right" className="top-2 right-2" />

        {/* Header Ribbon */}
        <div className="p-6 sm:p-8 border-b border-[#D4AF37]/25 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] bg-[#6E1E3A] flex items-center justify-center text-[#F3E5AB] shadow-md shadow-[#6E1E3A]/50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F3E5AB]">
                <path d="M3 21L21 3M3 3L21 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3.5" fill="#D4AF37" />
              </svg>
            </div>
            <div>
              <span className="font-serif tracking-[0.2em] text-xl font-black uppercase gold-gradient-text block">
                RANGILO RAAS 2026
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block">
                Official Digital Admission Pass
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-widest text-[#FAF5EF]/60 block">Ticket No.</span>
            <span className="font-mono text-xs sm:text-sm font-bold text-[#F3E5AB] bg-[#6E1E3A]/60 px-2.5 py-1 rounded border border-[#D4AF37]/30">
              {ticket.ticketId}
            </span>
          </div>
        </div>

        {/* Main Body Grid: Details (Left) + Secure QR Code (Right) */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Left: Attendee and Event Details (7 cols) */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                Primary Attendee
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF5EF]">
                {ticket.customerName}
              </h3>
              <p className="text-xs text-[#FAF5EF]/70 mt-0.5">
                {ticket.customerPhone} • {ticket.customerEmail}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                  Pass Tier
                </span>
                <span className="text-sm font-bold text-[#F3E5AB] block mt-0.5">
                  {ticket.tierName}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
                  Admit Count
                </span>
                <span className="text-sm font-bold text-[#FAF5EF] block mt-0.5">
                  {ticket.totalAttendees} Person{ticket.totalAttendees > 1 ? 's' : ''} ({ticket.quantity} Pass{ticket.quantity > 1 ? 'es' : ''})
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-[#FAF5EF]/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{ticket.eventDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Gates Open: {ticket.eventTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span className="truncate">{ticket.venue}</span>
              </div>
            </div>
          </div>

          {/* Right: Real Encrypted QR Code (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-5 rounded-xl bg-white/95 text-[#090306] shadow-xl border-2 border-[#D4AF37]/50 text-center">
            {qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCodeUrl}
                alt="Ticket QR Code"
                className="w-40 h-40 object-contain rounded"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-100 flex items-center justify-center animate-pulse">
                <span className="text-xs text-gray-500">Generating QR...</span>
              </div>
            )}
            <div className="mt-3">
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block">
                Gate Entry Verification Code
              </span>
              <span className="font-mono text-xs font-bold text-[#6E1E3A] block truncate max-w-[170px]" title={ticket.ticketToken}>
                {ticket.ticketToken}
              </span>
            </div>
          </div>

        </div>

        {/* Perforated Separator with Cutouts */}
        <div className="relative w-full border-t border-dashed border-[#D4AF37]/40">
          <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#090306] border-r border-[#D4AF37]" />
          <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#090306] border-l border-[#D4AF37]" />
        </div>

        {/* Ticket Bottom Security Strip */}
        <div className="p-4 sm:p-6 bg-[#0D0308] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#FAF5EF]/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Digital Cryptographic Pass • Single Entry Only</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Entry Gate: <strong className="text-[#F3E5AB]">{ticket.gateEntry}</strong></span>
            <span>•</span>
            <span>Total Paid: <strong className="text-[#F3E5AB]">₹{ticket.totalPaid.toLocaleString('en-IN')}</strong></span>
          </div>
        </div>

      </div>

      {/* Ticket Actions Toolbar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] hover:from-[#FFF1D0] hover:to-[#E5B869] rounded-full shadow-md transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-[#6E1E3A]" />
          <span>Print / Save PDF</span>
        </button>

        <button
          onClick={handleDownloadCalendar}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF5EF] hover:text-[#F3E5AB] bg-[#1A0A13] hover:bg-[#280E1E] border border-[#D4AF37]/35 rounded-full transition-all cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Add to Calendar (.ics)</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF5EF] hover:text-[#F3E5AB] bg-[#1A0A13] hover:bg-[#280E1E] border border-[#D4AF37]/35 rounded-full transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{copied ? 'Link Copied!' : 'Share Pass'}</span>
        </button>
      </div>

      {/* Email Pass Preview Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#12060C] border-2 border-[#D4AF37] rounded-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                  Email Dispatch Preview
                </span>
                <h4 className="font-serif text-lg font-bold text-[#FAF5EF]">
                  Customer E-Ticket Email Pass
                </h4>
              </div>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="text-[#FAF5EF]/60 hover:text-[#FAF5EF] p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#1A0912] border border-[#D4AF37]/30 space-y-4 text-xs text-[#FAF5EF]/80">
              <div className="border-b border-white/10 pb-2">
                <p><strong>To:</strong> {ticket.customerEmail}</p>
                <p><strong>Subject:</strong> Your Official Pass for Rangilo Raas 2026 — #{ticket.ticketId}</p>
              </div>

              <div className="text-center py-2">
                <span className="font-serif text-base font-bold gold-gradient-text uppercase block">
                  Rangilo Raas 2026
                </span>
                <p className="text-[11px] text-[#FAF5EF]/70">Music. Moves. Memories.</p>
              </div>

              <div className="p-3 bg-black/40 rounded border border-white/5 space-y-1">
                <p><strong>Attendee:</strong> {ticket.customerName}</p>
                <p><strong>Tier:</strong> {ticket.tierName}</p>
                <p><strong>Admit:</strong> {ticket.totalAttendees} Person(s)</p>
                <p><strong>Venue:</strong> {ticket.venue}</p>
                <p><strong>Date & Time:</strong> {ticket.eventDate} at {ticket.eventTime}</p>
              </div>

              <div className="flex flex-col items-center justify-center p-3 bg-white rounded text-black text-center">
                {qrCodeUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrCodeUrl} alt="Email QR Code" className="w-28 h-28" />
                )}
                <span className="font-mono text-[10px] font-bold mt-1 text-[#6E1E3A]">
                  Token: {ticket.ticketToken}
                </span>
              </div>

              <div className="text-[11px] text-[#FAF5EF]/60 space-y-1">
                <p><strong>Entry Guidelines:</strong></p>
                <p>• Show this digital pass or QR at Gate {ticket.gateEntry}.</p>
                <p>• Present your digital QR pass and valid photo ID at the entry gate.</p>
                <p>• Dress code: Festive Traditional (Chaniya Choli / Kurta Pajama).</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setEmailModalOpen(false)}
                className="px-6 py-2 text-xs font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] rounded-full"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
