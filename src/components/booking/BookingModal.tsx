'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { TICKET_TIERS, EVENT_DETAILS } from '@/lib/constants';
import { TicketTierId, CustomerDetails, GeneratedTicket } from '@/lib/types';
import { TicketPass } from '@/components/ticket/TicketPass';
import { X, ArrowRight, ArrowLeft, Check, ShieldCheck, CreditCard, Smartphone, Building, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuantities?: Record<TicketTierId, number>;
}

type Step = 'select' | 'details' | 'review' | 'payment' | 'success';

export function BookingModal({ isOpen, onClose, initialQuantities }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('select');
  const [quantities, setQuantities] = useState<Record<TicketTierId, number>>(
    initialQuantities || {
      regular: 0,
      couple: 0,
      family: 0,
    }
  );

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

  // Payment simulation state
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Generated Ticket Result
  const [generatedTicket, setGeneratedTicket] = useState<GeneratedTicket | null>(null);

  if (!isOpen) return null;

  // Pricing calculations
  const totalCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalAttendees = TICKET_TIERS.reduce((sum, tier) => {
    return sum + (quantities[tier.id] || 0) * tier.admitCount;
  }, 0);

  const subtotal = TICKET_TIERS.reduce((sum, tier) => {
    return sum + (quantities[tier.id] || 0) * tier.price;
  }, 0);

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const gstAmount = Math.round(discountedSubtotal * 0.18); // 18% GST standard on events
  const grandTotal = discountedSubtotal + gstAmount;

  // Selected tier for primary display
  const primaryTier = TICKET_TIERS.find((t) => (quantities[t.id] || 0) > 0) || TICKET_TIERS[0];

  const handleQuantityUpdate = (tierId: TicketTierId, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [tierId]: val,
    }));
  };

  // Validation
  const validateDetails = () => {
    const errs: Record<string, string> = {};
    if (!customer.fullName.trim() || customer.fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full legal name';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customer.email.trim() || !emailRegex.test(customer.email.trim())) {
      errs.email = 'Please provide a valid email (e-ticket will be sent here)';
    }
    const phoneDigits = customer.phone.replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!customer.acceptTerms) {
      errs.terms = 'Please accept the event entry guidelines to proceed';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Promo code apply
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'GARBA2026' || promoCode.trim().toUpperCase() === 'RAAS10') {
      setDiscountPercent(10);
      setPromoMessage('✨ 10% Festive Discount Applied!');
    } else if (promoCode.trim().toUpperCase() === 'ROYALVIP') {
      setDiscountPercent(15);
      setPromoMessage('✨ 15% Royal Privilege Discount Applied!');
    } else {
      setPromoMessage('❌ Invalid coupon code. Try GARBA2026');
      setDiscountPercent(0);
    }
  };

  // Execute Simulated Razorpay Payment
  const handleExecutePayment = (simulateFailure = false) => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    setTimeout(() => {
      if (simulateFailure) {
        setIsProcessingPayment(false);
        setPaymentError('Payment was declined by the issuing bank. Please retry with UPI or an alternative card.');
        return;
      }

      // Generate Unguessable Unique Token (e.g. DND_x8K29Lm72Qp91...)
      const randomAlphanumeric = Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 10).toUpperCase();
      const uniqueToken = `DND_${randomAlphanumeric}`;
      const uniqueTicketId = `DN-${Math.floor(100000 + Math.random() * 900000)}`;

      const newTicket: GeneratedTicket = {
        ticketId: uniqueTicketId,
        ticketToken: uniqueToken,
        orderId: `order_rzp_${Math.random().toString(36).substring(2, 12)}`,
        customerName: customer.fullName,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        tierId: primaryTier.id,
        tierName: primaryTier.name,
        quantity: totalCount,
        totalAttendees: totalAttendees,
        subtotal: subtotal,
        tax: gstAmount,
        totalPaid: grandTotal,
        bookingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        eventDate: EVENT_DETAILS.dateFormatted,
        eventTime: EVENT_DETAILS.doorsOpen,
        venue: EVENT_DETAILS.venue,
        gateEntry: primaryTier.id === 'family' ? 'Gate 1 (Family Entry)' : 'Gate 3 (Central)',
      };

      setGeneratedTicket(newTicket);
      setIsProcessingPayment(false);
      setCurrentStep('success');

      // Trigger Confetti Celebration
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
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden sm:overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#12050D] border-t sm:border-2 border-[#D4AF37]/50 rounded-t-[28px] sm:rounded-2xl shadow-2xl my-0 sm:my-6 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[92vh] animate-sheet-up">
        {/* Mobile Pull / Drag Indicator */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <span className="w-12 h-1 rounded-full bg-white/25" />
        </div>

        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[#D4AF37]/25 bg-[#170711] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#6E1E3A] border border-[#D4AF37]/60 flex items-center justify-center text-[#F3E5AB]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-sm sm:text-base font-bold uppercase gold-gradient-text block">
                {currentStep === 'success' ? 'Pass Confirmed' : 'Rangilo Raas Ticket Booking'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#FAF5EF]/60 block">
                {currentStep === 'select' && 'Step 1 of 4: Select Passes'}
                {currentStep === 'details' && 'Step 2 of 4: Attendee Details'}
                {currentStep === 'review' && 'Step 3 of 4: Review & Payment'}
                {currentStep === 'payment' && 'Step 4 of 4: Razorpay Secure Gateway'}
                {currentStep === 'success' && 'Official Admission Pass Issued'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#FAF5EF]/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: SELECT PASSES */}
          {currentStep === 'select' && (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Select category and quantity:
              </p>

              <div className="space-y-3">
                {TICKET_TIERS.map((tier) => {
                  const qty = quantities[tier.id] || 0;
                  return (
                    <div
                      key={tier.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        qty > 0
                          ? 'bg-[#1C0914] border-[#D4AF37] shadow-md'
                          : 'bg-[#14060E] border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-[#FAF5EF] text-base sm:text-lg">
                            {tier.name}
                          </h4>
                          {tier.badge && (
                            <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#6E1E3A] text-[#F3E5AB] border border-[#D4AF37]/30">
                              {tier.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#FAF5EF]/70 mt-0.5">
                          {tier.tagline} • <span className="text-[#E5B869] font-medium">{tier.sticksIncluded}</span>
                        </p>
                        <p className="font-serif text-base font-bold gold-gradient-text mt-1">
                          ₹{tier.price.toLocaleString('en-IN')} <span className="text-xs text-[#FAF5EF]/50 font-normal">/ pass</span>
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-3 self-end sm:self-center bg-[#090306] border border-[#D4AF37]/30 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => handleQuantityUpdate(tier.id, Math.max(0, qty - 1))}
                          className="w-7 h-7 rounded flex items-center justify-center text-[#FAF5EF] hover:bg-[#6E1E3A] transition-colors disabled:opacity-30 cursor-pointer"
                          disabled={qty === 0}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-[#FAF5EF]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityUpdate(tier.id, Math.min(10, qty + 1))}
                          className="w-7 h-7 rounded flex items-center justify-center text-[#FAF5EF] hover:bg-[#6E1E3A] transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: ATTENDEE DETAILS */}
          {currentStep === 'details' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl bg-[#6E1E3A]/20 border border-[#D4AF37]/30 text-xs text-[#F3E5AB] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>The unique QR e-ticket will be dispatched to this email immediately upon payment.</span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1.5">
                  Full Name (Primary Attendee) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aryan Patel"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#170710] border border-[#D4AF37]/30 text-[#FAF5EF] placeholder-white/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. aryan@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#170710] border border-[#D4AF37]/30 text-[#FAF5EF] placeholder-white/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                />
                {errors.email && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1.5">
                    Mobile Number (+91) *
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#170710] border border-[#D4AF37]/30 text-[#FAF5EF] placeholder-white/30 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm"
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#170710] border border-[#D4AF37]/30 text-[#FAF5EF] text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-[#FAF5EF]/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={customer.acceptTerms}
                    onChange={(e) => setCustomer({ ...customer, acceptTerms: e.target.checked })}
                    className="mt-0.5 accent-[#6E1E3A]"
                  />
                  <span>
                    I confirm that all attendees will adhere to the festive traditional dress code and entry guidelines.
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-rose-400 mt-1">{errors.terms}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: ORDER REVIEW */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              {/* Items Table */}
              <div className="p-4 rounded-xl bg-[#160710] border border-[#D4AF37]/30 space-y-3">
                <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold border-b border-white/10 pb-2">
                  Selected Passes Breakdown
                </p>

                {TICKET_TIERS.map((tier) => {
                  const qty = quantities[tier.id] || 0;
                  if (qty === 0) return null;
                  return (
                    <div key={tier.id} className="flex items-center justify-between text-sm py-1">
                      <div>
                        <span className="font-semibold text-[#FAF5EF]">{tier.name}</span>
                        <span className="text-xs text-[#FAF5EF]/60 block">{qty} × ₹{tier.price} ({qty * tier.admitCount} attendee{qty * tier.admitCount > 1 ? 's' : ''})</span>
                      </div>
                      <span className="font-bold text-[#F3E5AB]">
                        ₹{(qty * tier.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Promo code input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. GARBA2026)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#170710] border border-[#D4AF37]/30 text-[#FAF5EF] uppercase placeholder-white/30 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#090306] bg-[#D4AF37] hover:bg-[#E5B869] rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className={`text-xs ${discountPercent > 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400'}`}>
                  {promoMessage}
                </p>
              )}

              {/* Totals */}
              <div className="p-4 rounded-xl bg-[#0F040A] border border-white/10 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-[#FAF5EF]/70">
                  <span>Passes Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Festive Privilege Discount ({discountPercent}%)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#FAF5EF]/70">
                  <span>GST & Service Levy (18%)</span>
                  <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t border-white/10 pt-2 flex justify-between items-center text-base sm:text-lg font-bold text-[#FAF5EF]">
                  <span>Total Payable Amount</span>
                  <span className="gold-gradient-text text-xl sm:text-2xl font-black">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Attendee Confirmation Recap */}
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-[#FAF5EF]/70 flex items-center justify-between">
                <div>
                  <span>E-Ticket recipient: <strong className="text-[#FAF5EF]">{customer.fullName}</strong></span>
                  <span className="block text-[11px] text-[#FAF5EF]/50">{customer.email} • {customer.phone}</span>
                </div>
                <button
                  onClick={() => setCurrentStep('details')}
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REALISTIC RAZORPAY CHECKOUT MODAL */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              {/* Razorpay Brand Header */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#0C2340] to-[#0A192F] border border-blue-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center p-1 font-bold text-blue-900 text-xs shadow">
                    Rzp
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Razorpay Trusted Gateway
                    </span>
                    <span className="text-[10px] text-blue-200 block">
                      256-Bit Bank Grade Encryption
                    </span>
                  </div>
                </div>
                <span className="text-sm font-bold text-white">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {paymentError && (
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs text-rose-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Payment Error</p>
                    <p>{paymentError}</p>
                  </div>
                </div>
              )}

              {/* Payment Methods Tabs */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block mb-2">
                  Select Payment Method:
                </label>

                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'upi'
                      ? 'bg-[#1C0D19] border-[#D4AF37] text-[#FAF5EF]'
                      : 'bg-[#12060C] border-white/10 text-[#FAF5EF]/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#E5B869]" />
                    <div>
                      <span className="text-sm font-semibold block">UPI (GPay / PhonePe / Paytm / BHIM)</span>
                      <span className="text-[10px] text-[#FAF5EF]/50">Instant verification without extra charges</span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/30'}`}>
                    {paymentMethod === 'upi' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                </div>

                {/* Credit / Debit Card Option */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'card'
                      ? 'bg-[#1C0D19] border-[#D4AF37] text-[#FAF5EF]'
                      : 'bg-[#12060C] border-white/10 text-[#FAF5EF]/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#E5B869]" />
                    <div>
                      <span className="text-sm font-semibold block">Credit / Debit Card</span>
                      <span className="text-[10px] text-[#FAF5EF]/50">Visa, Mastercard, RuPay, Amex</span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/30'}`}>
                    {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                </div>

                {/* Netbanking Option */}
                <div
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'netbanking'
                      ? 'bg-[#1C0D19] border-[#D4AF37] text-[#FAF5EF]'
                      : 'bg-[#12060C] border-white/10 text-[#FAF5EF]/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-[#E5B869]" />
                    <div>
                      <span className="text-sm font-semibold block">Net Banking</span>
                      <span className="text-[10px] text-[#FAF5EF]/50">All major Indian banks supported</span>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'netbanking' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/30'}`}>
                    {paymentMethod === 'netbanking' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                </div>
              </div>

              {/* Dynamic Sub-form */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-xl bg-black/40 border border-[#D4AF37]/20 space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                    Enter UPI ID (VPA) or select Quick App
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#170710] border border-[#D4AF37]/30 text-xs text-[#FAF5EF] focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="button"
                      onClick={() => setUpiId('attendee@upi')}
                      className="px-3 py-1 text-[11px] font-semibold bg-[#6E1E3A] text-[#F3E5AB] rounded-lg border border-[#D4AF37]/30 hover:bg-[#862447] cursor-pointer"
                    >
                      Autofill Test VPA
                    </button>
                  </div>
                </div>
              )}

              {/* Two buttons: Complete Payment & Test Failure recovery */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => handleExecutePayment(false)}
                  className="w-full py-4 text-sm font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] via-[#E5B869] to-[#D4AF37] hover:from-[#FFF1D0] hover:to-[#E5B869] rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#6E1E3A]" />
                      <span>Verifying with Razorpay & Issuing Pass...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#6E1E3A]" />
                      <span>Pay ₹{grandTotal.toLocaleString('en-IN')} & Generate Pass</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-[11px] text-[#FAF5EF]/50 pt-1">
                  <span>Testing error handling?</span>
                  <button
                    type="button"
                    onClick={() => handleExecutePayment(true)}
                    className="text-rose-400/80 hover:text-rose-300 underline cursor-pointer"
                  >
                    Simulate Payment Decline
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS STATE & TICKET PASS */}
          {currentStep === 'success' && generatedTicket && (
            <div>
              <TicketPass ticket={generatedTicket} onClose={onClose} />
            </div>
          )}

        </div>

        {/* Modal Footer Navigation (Only for steps 1-3) */}
        {currentStep !== 'success' && (
          <div className="p-4 sm:p-6 border-t border-[#D4AF37]/20 bg-[#150610] flex items-center justify-between shrink-0">
            {currentStep !== 'select' ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 'details') setCurrentStep('select');
                  if (currentStep === 'review') setCurrentStep('details');
                  if (currentStep === 'payment') setCurrentStep('review');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FAF5EF]/80 hover:text-[#FAF5EF] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div className="text-xs text-[#FAF5EF]/60">
                {totalCount} pass{totalCount > 1 ? 'es' : ''} selected
              </div>
            )}

            <div>
              {currentStep === 'select' && (
                <button
                  type="button"
                  disabled={totalCount === 0}
                  onClick={() => setCurrentStep('details')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] hover:from-[#FFF1D0] hover:to-[#E5B869] disabled:opacity-40 disabled:cursor-not-allowed rounded-full shadow-md cursor-pointer transition-all"
                >
                  <span>Attendee Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {currentStep === 'details' && (
                <button
                  type="button"
                  onClick={() => {
                    if (validateDetails()) {
                      setCurrentStep('review');
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] hover:from-[#FFF1D0] hover:to-[#E5B869] rounded-full shadow-md cursor-pointer transition-all"
                >
                  <span>Review Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {currentStep === 'review' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('payment')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] hover:from-[#FFF1D0] hover:to-[#E5B869] rounded-full shadow-md cursor-pointer transition-all"
                >
                  <span>Proceed to Pay (₹{grandTotal.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
