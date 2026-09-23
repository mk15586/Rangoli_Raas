'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TICKET_TIERS, EVENT_DETAILS } from '@/lib/constants';
import { TicketTierId, CustomerDetails, GeneratedTicket } from '@/lib/types';
import { TicketPass } from '@/components/ticket/TicketPass';
import { DandiyaDivider } from '@/components/ui/Ornaments';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, ShieldCheck, CreditCard, Smartphone, Building, Sparkles, Check, AlertCircle, RefreshCw } from 'lucide-react';

export default function BookPage() {
  const [step, setStep] = useState<'select' | 'details' | 'review' | 'payment' | 'success'>('select');
  const [quantities, setQuantities] = useState<Record<TicketTierId, number>>({
    regular: 1,
    couple: 0,
    family: 0,
  });

  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    city: 'Patna',
    acceptTerms: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [generatedTicket, setGeneratedTicket] = useState<GeneratedTicket | null>(null);

  // Pricing
  const totalCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalAttendees = TICKET_TIERS.reduce((sum, tier) => {
    return sum + (quantities[tier.id] || 0) * tier.admitCount;
  }, 0);

  const subtotal = TICKET_TIERS.reduce((sum, tier) => {
    return sum + (quantities[tier.id] || 0) * tier.price;
  }, 0);

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const gstAmount = Math.round(discountedSubtotal * 0.18);
  const grandTotal = discountedSubtotal + gstAmount;

  const primaryTier = TICKET_TIERS.find((t) => (quantities[t.id] || 0) > 0) || TICKET_TIERS[0];

  const handleQty = (tierId: TicketTierId, val: number) => {
    setQuantities((prev) => ({ ...prev, [tierId]: val }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customer.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!customer.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      errs.email = 'Valid email is required for ticket delivery';
    }
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Valid 10-digit mobile number required';
    }
    if (!customer.acceptTerms) errs.terms = 'Please accept entry rules';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'GARBA2026' || promoCode.trim().toUpperCase() === 'RAAS10') {
      setDiscountPercent(10);
      setPromoMessage('✨ 10% Festive Discount Applied!');
    } else {
      setPromoMessage('❌ Invalid coupon code');
      setDiscountPercent(0);
    }
  };

  const handlePay = (fail = false) => {
    setIsProcessing(true);
    setPaymentError(null);

    setTimeout(() => {
      if (fail) {
        setIsProcessing(false);
        setPaymentError('Payment was declined by your bank. Please retry.');
        return;
      }

      const randomToken = `DND_${Math.random().toString(36).substring(2, 10).toUpperCase()}${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const ticketId = `DN-${Math.floor(100000 + Math.random() * 900000)}`;

      const pass: GeneratedTicket = {
        ticketId,
        ticketToken: randomToken,
        orderId: `order_${Math.random().toString(36).substring(2, 10)}`,
        customerName: customer.fullName,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        tierId: primaryTier.id,
        tierName: primaryTier.name,
        quantity: totalCount,
        totalAttendees,
        subtotal,
        tax: gstAmount,
        totalPaid: grandTotal,
        bookingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        eventDate: EVENT_DETAILS.dateFormatted,
        eventTime: EVENT_DETAILS.doorsOpen,
        venue: EVENT_DETAILS.venue,
        gateEntry: primaryTier.id === 'family' ? 'Gate 1 (Family Entry)' : 'Gate 3 (Central)',
      };

      setGeneratedTicket(pass);
      setIsProcessing(false);
      setStep('success');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#6E1E3A', '#F3E5AB', '#E85D04'],
        });
      } catch (e) {
        console.log(e);
      }
    }, 1300);
  };

  return (
    <div className="min-h-screen bg-[#090306] text-[#FAF5EF] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#FAF5EF]/70 hover:text-[#F3E5AB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Event Overview</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
            Official Ticket Booking
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-[#FAF5EF] mt-2">
            Secure Your Passes
          </h1>
          <DandiyaDivider className="my-4" />
          <p className="text-xs sm:text-sm text-[#FAF5EF]/70">
            {EVENT_DETAILS.name} • {EVENT_DETAILS.dateFormatted} • {EVENT_DETAILS.venue}
          </p>
        </div>

        {/* Steps Breadcrumb */}
        {step !== 'success' && (
          <div className="flex items-center justify-between max-w-md mx-auto mb-10 text-xs">
            <span className={`font-semibold ${step === 'select' ? 'text-[#F3E5AB] border-b-2 border-[#D4AF37] pb-1' : 'text-[#FAF5EF]/50'}`}>
              1. Passes
            </span>
            <span className="text-white/20">→</span>
            <span className={`font-semibold ${step === 'details' ? 'text-[#F3E5AB] border-b-2 border-[#D4AF37] pb-1' : 'text-[#FAF5EF]/50'}`}>
              2. Attendee
            </span>
            <span className="text-white/20">→</span>
            <span className={`font-semibold ${step === 'review' ? 'text-[#F3E5AB] border-b-2 border-[#D4AF37] pb-1' : 'text-[#FAF5EF]/50'}`}>
              3. Review
            </span>
            <span className="text-white/20">→</span>
            <span className={`font-semibold ${step === 'payment' ? 'text-[#F3E5AB] border-b-2 border-[#D4AF37] pb-1' : 'text-[#FAF5EF]/50'}`}>
              4. Payment
            </span>
          </div>
        )}

        {/* Step 1: Select Passes */}
        {step === 'select' && (
          <div className="space-y-6">
            <div className="space-y-3">
              {TICKET_TIERS.map((tier) => {
                const qty = quantities[tier.id] || 0;
                return (
                  <div
                    key={tier.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      qty > 0
                        ? 'bg-[#1D0915] border-[#D4AF37] shadow-lg'
                        : 'bg-[#14060E] border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-[#FAF5EF] text-lg">
                          {tier.name}
                        </h3>
                        {tier.badge && (
                          <span className="text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#6E1E3A] text-[#F3E5AB] border border-[#D4AF37]/30">
                            {tier.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#FAF5EF]/70 mt-1">
                        {tier.tagline} • <span className="text-[#E5B869] font-medium">{tier.sticksIncluded}</span>
                      </p>
                      <p className="font-serif text-lg font-bold gold-gradient-text mt-1">
                        ₹{tier.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center bg-[#090306] border border-[#D4AF37]/30 rounded-lg p-1.5">
                      <button
                        type="button"
                        onClick={() => handleQty(tier.id, Math.max(0, qty - 1))}
                        className="w-8 h-8 rounded flex items-center justify-center text-[#FAF5EF] hover:bg-[#6E1E3A] transition-colors disabled:opacity-30 cursor-pointer"
                        disabled={qty === 0}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-[#FAF5EF]">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQty(tier.id, Math.min(10, qty + 1))}
                        className="w-8 h-8 rounded flex items-center justify-center text-[#FAF5EF] hover:bg-[#6E1E3A] transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 rounded-2xl bg-[#14060E] border border-[#D4AF37]/30 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-[#D4AF37] uppercase font-semibold">Subtotal ({totalCount} passes)</p>
                <p className="text-xl font-bold text-[#FAF5EF]">₹{subtotal.toLocaleString('en-IN')}</p>
              </div>
              <button
                type="button"
                disabled={totalCount === 0}
                onClick={() => setStep('details')}
                className="px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] hover:from-[#FFF1D0] hover:to-[#E5B869] disabled:opacity-40 rounded-full shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Attendee Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Attendee Details */}
        {step === 'details' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#14060E] border border-[#D4AF37]/30 space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={customer.fullName}
                onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                placeholder="e.g. Aryan Patel"
                className="w-full px-4 py-3 rounded-xl bg-[#170710] border border-[#D4AF37]/30 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
              {errors.fullName && <p className="text-xs text-rose-400 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1.5">
                Email Address (E-Ticket Delivery) *
              </label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                placeholder="e.g. aryan@example.com"
                className="w-full px-4 py-3 rounded-xl bg-[#170710] border border-[#D4AF37]/30 text-sm focus:outline-none focus:border-[#D4AF37]"
              />
              {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1.5">
                  Mobile Number (+91) *
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 rounded-xl bg-[#170710] border border-[#D4AF37]/30 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
                {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#170710] border border-[#D4AF37]/30 text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="px-5 py-2.5 text-xs uppercase font-semibold text-[#FAF5EF]/70 hover:text-white"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validate()) setStep('review');
                }}
                className="px-8 py-3 text-xs font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] rounded-full shadow-md cursor-pointer"
              >
                Review Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 'review' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#14060E] border border-[#D4AF37]/30 space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#FAF5EF] pb-3 border-b border-white/10">
              Order Summary
            </h3>

            <div className="space-y-2 text-sm">
              {TICKET_TIERS.map((t) => {
                const q = quantities[t.id] || 0;
                if (q === 0) return null;
                return (
                  <div key={t.id} className="flex justify-between py-1">
                    <span>{t.name} ({q} × ₹{t.price})</span>
                    <span className="font-bold text-[#F3E5AB]">₹{(q * t.price).toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Coupon (e.g. GARBA2026)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#170710] border border-[#D4AF37]/30 text-xs text-[#FAF5EF] uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-5 py-2.5 text-xs font-bold uppercase text-[#090306] bg-[#D4AF37] rounded-xl"
              >
                Apply
              </button>
            </div>
            {promoMessage && <p className="text-xs text-emerald-400">{promoMessage}</p>}

            <div className="p-4 rounded-xl bg-[#090306] space-y-2 text-xs">
              <div className="flex justify-between text-[#FAF5EF]/70">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#FAF5EF]/70">
                <span>GST (18%)</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between text-base font-bold text-[#FAF5EF]">
                <span>Total Amount</span>
                <span className="gold-gradient-text text-xl">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-5 py-2.5 text-xs uppercase font-semibold text-[#FAF5EF]/70"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="px-8 py-3 text-xs font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] rounded-full shadow-md cursor-pointer"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 'payment' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#14060E] border border-[#D4AF37]/30 space-y-6">
            <div className="p-4 rounded-xl bg-[#0C2340] border border-blue-400/30 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Razorpay Secure Checkout</p>
                <p className="text-[10px] text-blue-200">256-Bit Bank Grade Encryption</p>
              </div>
              <p className="text-sm font-bold text-white">₹{grandTotal.toLocaleString('en-IN')}</p>
            </div>

            {paymentError && (
              <div className="p-3 bg-rose-950 border border-rose-500 text-xs text-rose-200 rounded-lg">
                {paymentError}
              </div>
            )}

            <div className="space-y-2">
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'upi' ? 'bg-[#1C0D19] border-[#D4AF37]' : 'bg-[#12060C] border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-[#E5B869]" />
                  <span className="text-sm">UPI (GPay / PhonePe / Paytm)</span>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full ${paymentMethod === 'upi' ? 'bg-[#D4AF37]' : 'border border-white/30'}`} />
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'card' ? 'bg-[#1C0D19] border-[#D4AF37]' : 'bg-[#12060C] border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#E5B869]" />
                  <span className="text-sm">Credit / Debit Card</span>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full ${paymentMethod === 'card' ? 'bg-[#D4AF37]' : 'border border-white/30'}`} />
              </div>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handlePay(false)}
              className="w-full py-4 text-xs font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying & Generating Pass...</span>
                </>
              ) : (
                <span>Pay ₹{grandTotal.toLocaleString('en-IN')} & Generate E-Ticket</span>
              )}
            </button>
          </div>
        )}

        {/* Step 5: Success Pass */}
        {step === 'success' && generatedTicket && (
          <div>
            <TicketPass ticket={generatedTicket} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
