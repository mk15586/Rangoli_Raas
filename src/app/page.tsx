'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  Lock,
  Mail,
  MapPin,
  Music,
  Phone,
  RefreshCw,
  ShieldCheck,
  Soup,
  Sparkles,
  Ticket,
  User,
  Users,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MobileStickyBar } from '@/components/layout/MobileStickyBar';
import { TicketTierId } from '@/lib/types';
import { validateEmail, validateName, validatePhone } from '@/lib/bookingValidation';

const layoutBackgroundImage = '/pictures/Elegant Garba Night Dandiya Background.png';
const mapLink = 'https://maps.app.goo.gl/KmShKinUXKTfCWna7';
const mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d230273.7059166395!2d85.06993390722658!3d25.60403050707979!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed59714de8ca13%3A0x6cc0f8ee032081ba!2sMaharashtra%20Mandal!5e0!3m2!1sen!2sin!4v1790167541716!5m2!1sen!2sin';

interface TicketItem {
  id: TicketTierId;
  name: string;
  price: number;
  admitText: string;
  benefits: string[];
  popular?: boolean;
}

const tickets: TicketItem[] = [
  {
    id: 'regular',
    name: 'Regular Pass',
    price: 299,
    admitText: 'Admit 1',
    benefits: ['Event Entry for 1 Person', 'Access to dance arena', 'Verified Digital QR Entry'],
  },
  {
    id: 'family',
    name: 'Family Pass',
    price: 999,
    admitText: 'Admit 5',
    benefits: ['Entry for 5 people', 'Access to dance arena', 'Priority family entry gate'],
    popular: true,
  },
  {
    id: 'couple',
    name: 'Couple Pass',
    price: 599,
    admitText: 'Admit 2',
    benefits: ['Entry for 2 people', 'Access to dance arena', 'Express couple entrance'],
  },
];

const highlights = [
  { icon: Music, title: 'Live DJ', copy: 'Top DJs & Artists' },
  { icon: SparkSticks, title: 'Festive Vibes', copy: 'Traditional Decor' },
  { icon: Soup, title: 'Delicious Food', copy: 'Variety of Stalls' },
  { icon: ShieldCheck, title: 'Safe & Secure', copy: 'Your Safety, Our Priority' },
];

const details = [
  ['Date', 'Saturday, 17 October 2026'],
  ['Time', 'Time to be announced'],
  ['Venue', 'Maharashtra Mandal, Patna'],
  ['Event Type', 'Rangilo Raas'],
  ['Age Limit', 'Open for all'],
  ['Dress Code', 'Traditional / Festive'],
];

const notes = [
  'E-tickets will be sent to your email after successful payment.',
  'Tickets are non-refundable.',
  'Please carry a valid ID at the venue.',
  'Outside food & beverages are not allowed.',
  'Organizers reserve the right to entry.',
  'Have fun and keep the tradition alive!',
];

function SparkSticks({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path d="M5 27 27 5M5 5l22 22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M16 2v4M16 26v4M2 16h4M26 16h4M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M24.5 7.5l-2.8 2.8M10.3 21.7l-2.8 2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </svg>
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <div className="relative h-9 w-8 sm:h-12 sm:w-11 shrink-0">
        <span className="absolute left-0.5 top-0.5 h-7 w-2 sm:left-1 sm:top-1 sm:h-9 sm:w-3 rotate-[-18deg] rounded-full bg-[#f4b55d] shadow-[0_0_12px_rgba(244,181,93,0.35)]" />
        <span className="absolute right-1 top-1 h-7 w-2 sm:right-2 sm:top-2 sm:h-9 sm:w-3 rotate-[18deg] rounded-full bg-[#ce1d35] shadow-[0_0_12px_rgba(206,29,53,0.35)]" />
        <span className="absolute left-0 top-6 h-3 w-3 sm:top-8 sm:h-4 sm:w-4 rounded-full border border-[#f7ce75]" />
        <span className="absolute right-0 top-6 h-3 w-3 sm:top-8 sm:h-4 sm:w-4 rounded-full border border-[#f7ce75]" />
      </div>
      <div>
        <p className="font-serif text-[15px] font-bold leading-none tracking-[0.08em] text-[#f7d88d] sm:text-[22px]">
          RANGILO RAAS
        </p>
        <p className="mt-1 hidden text-[11px] font-semibold tracking-[0.16em] text-white/80 sm:block">
          DANCE &bull; CULTURE &bull; CELEBRATE
        </p>
      </div>
    </div>
  );
}

// Razorpay checkout script loader
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Home() {
  const [selectedTicket, setSelectedTicket] = useState<TicketTierId>('regular');
  const [formQuantity, setFormQuantity] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form inputs
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Validation state
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [touched, setTouched] = useState<{ name?: boolean; email?: boolean; phone?: boolean }>({});
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Confirmed ticket details from server
  const [confirmedTicket, setConfirmedTicket] = useState<{
    ticketId: string;
    ticketToken: string;
    qrCodeUrl: string;
    verifyUrl: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    tierName: string;
    quantity: number;
    totalAttendees: number;
    totalPaid: number;
    orderId: string;
    paymentId: string;
    eventDate: string;
    venue: string;
    gateEntry: string;
  } | null>(null);

  const [emailDeliveryStatus, setEmailDeliveryStatus] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  // Lock body scroll when mobile modal is open
  useEffect(() => {
    if (isBookingModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isBookingModalOpen]);

  const activeTicketObj = tickets.find((t) => t.id === selectedTicket) || tickets[0];
  const totalPrice = activeTicketObj.price * formQuantity;

  const handleOpenBooking = (tierId?: TicketTierId) => {
    if (tierId) {
      setSelectedTicket(tierId);
    }
    setBookingSuccess(false);
    setPaymentError(null);
    setIsBookingModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setCustomerName(val);
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateName(val) }));
    }
  };

  const handleEmailChange = (val: string) => {
    setCustomerEmail(val);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
    }
  };

  const handlePhoneChange = (val: string) => {
    setCustomerPhone(val);
    if (touched.phone) {
      setErrors((prev) => ({ ...prev, phone: validatePhone(val) }));
    }
  };

  const handleBlur = (field: 'name' | 'email' | 'phone') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'name') setErrors((prev) => ({ ...prev, name: validateName(customerName) }));
    if (field === 'email') setErrors((prev) => ({ ...prev, email: validateEmail(customerEmail) }));
    if (field === 'phone') setErrors((prev) => ({ ...prev, phone: validatePhone(customerPhone) }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateName(customerName);
    const emailErr = validateEmail(customerEmail);
    const phoneErr = validatePhone(customerPhone);

    setErrors({ name: nameErr, email: emailErr, phone: phoneErr });
    setTouched({ name: true, email: true, phone: true });

    if (nameErr || emailErr || phoneErr) {
      return;
    }

    setPaymentError(null);
    setIsProcessing(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setPaymentError('Could not load Razorpay SDK. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }

      // 1. Create order on backend API
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: selectedTicket,
          quantity: formQuantity,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.orderId) {
        setPaymentError(orderData.error || 'Failed to initialize payment gateway.');
        setIsProcessing(false);
        return;
      }

      // 2. Open Razorpay test checkout window
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Rangilo Raas 2026',
        description: `${activeTicketObj.name} (${formQuantity} Pass${formQuantity > 1 ? 'es' : ''})`,
        image: '/favicon.ico',
        order_id: orderData.orderId,
        prefill: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          contact: customerPhone.trim(),
        },
        theme: {
          color: '#6E1E3A', // Primary deep wine red
        },
        handler: async function (response: any) {
          setIsBookingModalOpen(true);
          setIsVerifying(true);
          try {
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                tierId: selectedTicket,
                quantity: formQuantity,
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim(),
                customerPhone: customerPhone.trim(),
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setConfirmedTicket(verifyData.ticket);
              setEmailDeliveryStatus(verifyData.emailDelivery);
              setBookingSuccess(true);
              try {
                confetti({
                  particleCount: 90,
                  spread: 75,
                  origin: { y: 0.6 },
                  colors: ['#F4C45B', '#6E1E3A', '#FFE8A3', '#E85D04'],
                });
              } catch (err) {
                console.error(err);
              }
            } else {
              setPaymentError(verifyData.error || 'Payment signature verification failed.');
            }
          } catch (vErr: any) {
            console.error('Verification error:', vErr);
            setPaymentError('Network error while verifying payment.');
          } finally {
            setIsProcessing(false);
            setIsVerifying(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setPaymentError(response.error?.description || 'Payment was declined or cancelled.');
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Payment checkout error:', err);
      setPaymentError(err?.message || 'Payment initiation failed.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080303] text-[#fff8ed]">
      {/* 1. MOBILE & DESKTOP NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#bb6a3d]/20 bg-[#0b0304]/88 shadow-[0_12px_36px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-200">
        <div className="mx-auto flex h-14 sm:h-[86px] max-w-[1320px] items-center justify-between gap-3 px-4 sm:px-8">
          <a href="#" aria-label="Rangilo Raas home" className="focus:outline-none">
            <BrandMark />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-9 text-[15px] font-medium text-white/76 md:flex" aria-label="Main navigation">
            {['Home', 'Event', 'Tickets'].map((item) => (
              <a
                key={item}
                href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                className={`relative py-2 transition hover:text-[#ffd37e] ${
                  item === 'Home' ? 'text-[#ffd37e] after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-[#ffd37e]' : ''
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Header Action Button */}
          <div className="flex items-center gap-2">
            {/* Mobile Mini Book Button */}
            <button
              type="button"
              onClick={() => handleOpenBooking()}
              className="sm:hidden rounded-full bg-gradient-to-r from-[#ffe38f] to-[#efae4b] px-3.5 py-1.5 text-xs font-bold text-[#180908] shadow-[0_4px_14px_rgba(239,174,75,0.28)] active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 text-[#6E1E3A]" />
              <span>Book</span>
            </button>

            {/* Desktop Full Button */}
            <a
              href="#tickets"
              className="hidden sm:inline-flex rounded-xl bg-gradient-to-b from-[#ffe38f] to-[#efae4b] px-6 py-3 text-[15px] font-bold text-[#180908] shadow-[0_8px_26px_rgba(239,174,75,0.24)] transition hover:brightness-110"
            >
              Book Tickets
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* 2. HERO SECTION */}
        <section
          className="hero-responsive-background relative min-h-[92svh] sm:min-h-[100svh] overflow-hidden border-b border-[#6b281f] bg-cover bg-center pt-14 sm:pt-[86px]"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Gradients: Mobile bottom-heavy wine overlay keeps text readable while showing dancers */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090203] via-[#20050c]/80 to-black/35 sm:bg-[linear-gradient(90deg,#090203_0%,rgba(9,2,3,0.96)_18%,rgba(20,5,6,0.66)_43%,rgba(20,5,6,0.12)_74%,rgba(8,2,3,0.45)_100%)] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-[#090303] to-transparent pointer-events-none" />
          <div className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full border border-[#9a3f28]/20 opacity-50" />

          <div className="relative z-10 mx-auto flex min-h-[calc(92svh-56px)] sm:min-h-[calc(100svh-86px)] max-w-[1320px] items-center px-4 sm:px-8 py-8 sm:py-12">
            <div className="w-full max-w-[580px]">
              {/* Eyebrow */}
              <p className="mb-2 sm:mb-5 text-[11px] sm:text-[17px] font-semibold tracking-[0.26em] sm:tracking-[0.34em] text-[#ffd98a] uppercase">
                LET&apos;S RAAS TOGETHER
              </p>

              {/* Main Responsive Heading */}
              <h1 className="font-serif text-[38px] xs:text-[44px] sm:text-[56px] lg:text-[92px] font-black uppercase leading-[1.04] sm:leading-[0.98] tracking-[0.02em] text-[#ffe19a] drop-shadow-[0_6px_24px_rgba(0,0,0,0.85)]">
                RANGILO
                <span className="block sm:inline lg:block sm:ml-3 lg:ml-0">RAAS</span>
              </h1>

              {/* Subtitle & Description */}
              <p className="mt-2.5 sm:mt-5 text-[19px] sm:text-[28px] font-semibold text-white tracking-wide">
                Play. Dance. Celebrate.
              </p>
              <p className="mt-2 sm:mt-4 max-w-[500px] text-[13px] sm:text-[17px] leading-relaxed sm:leading-8 text-white/85">
                Non-stop DJ beats, cultural programs and a vibrant evening of Raas for everyone.
              </p>

              {/* Mobile Compact Glassmorphism Information Chips */}
              <div className="mt-5 grid grid-cols-1 gap-2.5 sm:hidden">
                <div className="flex items-center gap-3 rounded-xl bg-[#1d080e]/85 border border-[#F4C45B]/25 p-2.5 backdrop-blur-md shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3A080D] text-[#F4C45B] border border-[#F4C45B]/30">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-white">Saturday, 17 Oct 2026</p>
                    <p className="text-[11px] text-white/70">Time to be announced</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-[#1d080e]/85 border border-[#F4C45B]/25 p-2.5 backdrop-blur-md shadow-sm">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3A080D] text-[#F4C45B] border border-[#F4C45B]/30">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-white">Maharashtra Mandal</p>
                    <p className="text-[11px] text-white/70">Patna, Bihar</p>
                  </div>
                </div>
              </div>

              {/* Mobile Action CTAs */}
              <div className="mt-5 flex items-center gap-3 sm:hidden">
                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#ffe38f] via-[#f4c45b] to-[#efae4b] py-3.5 px-5 text-center text-[14px] font-bold uppercase tracking-wider text-[#180908] shadow-[0_8px_24px_rgba(239,174,75,0.3)] active:scale-[0.97] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4 text-[#6E1E3A]" />
                  <span>Book Tickets</span>
                </button>

                <a
                  href="#tickets"
                  className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-md py-3.5 px-4 text-center text-[13px] font-semibold text-white/90 hover:text-white active:scale-[0.97] transition-all"
                >
                  Explore Event
                </a>
              </div>

              {/* Desktop Details Grid (Preserved) */}
              <div className="mt-8 hidden sm:grid max-w-[610px] gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#26120e] text-[#f3a65d] ring-1 ring-[#f3a65d]/35">
                    <CalendarDays className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-[17px] font-bold">Saturday, 17 Oct 2026</p>
                    <p className="mt-1 text-[15px] text-white/82">Time to be announced</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-12 w-12 shrink-0 text-[#f3a65d]" />
                  <div>
                    <p className="text-[17px] font-bold">Maharashtra Mandal</p>
                    <p className="mt-1 text-[15px] text-white/82">Patna, Bihar</p>
                  </div>
                </div>
              </div>

              {/* 3. EVENT HIGHLIGHTS: Mobile Horizontal Swipeable Cards */}
              <div className="mt-7 sm:hidden">
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f4ce78]">
                    Highlights
                  </span>
                  <span className="text-[10px] text-white/45">Swipe &rarr;</span>
                </div>
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 pb-1">
                  {[
                    { icon: Music, label: 'Live DJ', desc: 'Non-stop Garba beats' },
                    { icon: Soup, label: 'Food Stalls', desc: 'Traditional delicacies' },
                    { icon: Camera, label: 'Photo Booth', desc: 'Festive memories' },
                    { icon: Users, label: 'Family Friendly', desc: 'Safe atmosphere' },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div
                      key={label}
                      className="snap-start shrink-0 w-[142px] rounded-2xl bg-[#16060c]/85 border border-[#f4c45b]/20 p-3 backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3a080d] text-[#f4ce78] border border-[#f4ce78]/25 mb-2">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-[13px] font-bold text-white leading-snug">{label}</p>
                      <p className="text-[10px] text-white/65 mt-0.5 leading-tight">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Highlights Grid (Preserved) */}
              <div className="mt-10 hidden sm:grid max-w-full grid-cols-2 gap-3 border-t border-[#8d3c2d]/24 pt-7 sm:max-w-[600px] sm:grid-cols-4 sm:gap-4">
                {[
                  [Music, 'Live DJ'],
                  [Soup, 'Food Stalls'],
                  [Camera, 'Photo Booth'],
                  [Users, 'Family Friendly'],
                ].map(([Icon, label]) => (
                  <div key={String(label)} className="text-center">
                    <Icon className="mx-auto h-7 w-7 text-[#ed934d]" />
                    <p className="mt-3 text-[12px] text-white sm:text-[14px]">{String(label)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-16 right-[7%] hidden rotate-[-9deg] text-right font-[cursive] text-[50px] leading-[0.98] text-[#ffdf90] drop-shadow-[0_0_18px_rgba(255,187,92,0.5)] lg:block">
              Feel
              <span className="block text-[31px]">the</span>
              <span className="block text-[54px]">Tradition</span>
              <span className="ml-4 text-[28px]">♡</span>
            </div>
          </div>
        </section>

        {/* 4. TICKET SECTION */}
        <div
          className="relative overflow-hidden"
          style={{
            backgroundImage: `url("${layoutBackgroundImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <section id="tickets" className="relative scroll-mt-16 sm:scroll-mt-[86px] overflow-hidden border-b border-[#5b1c19] px-4 sm:px-8 py-10 sm:py-14">
            <div className="relative mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[1fr_430px]">
              <div>
                <div className="max-w-2xl">
                  <span className="text-[11px] sm:text-xs uppercase font-bold tracking-[0.24em] text-[#f4ce78] block">
                    Tickets & Passes
                  </span>
                  <h2 className="font-serif text-[26px] sm:text-[34px] font-bold text-[#f4ce78] mt-1">
                    Choose Your Tickets
                  </h2>
                  <p className="mt-1 text-[14px] sm:text-[16px] text-white/80">
                    Select your pass and get ready to dance.
                  </p>
                </div>

                {/* Ticket Cards Grid */}
                <div className="mt-6 sm:mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2 md:grid-cols-3">
                  {tickets.map((ticket) => (
                    <article
                      key={ticket.id}
                      className={`relative flex flex-col justify-between rounded-[22px] border p-5 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-[#f4ce78]/60 ${
                        ticket.popular
                          ? 'border-[#f4ce78]/80 bg-gradient-to-b from-[#240813]/95 via-[#16050d]/95 to-[#0e0207]/95 ring-1 ring-[#f4ce78]/40'
                          : 'border-[#7b3729]/55 bg-gradient-to-b from-[#18060e]/90 to-[#0e0307]/90'
                      }`}
                    >
                      {/* Integrated Popular Banner */}
                      {ticket.popular && (
                        <div className="mb-3 -mt-1 flex items-center justify-between rounded-xl bg-gradient-to-r from-[#f4c45b] to-[#e5a83b] px-3 py-1 text-[11px] font-bold text-[#140407] shadow-sm">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Most Popular Choice
                          </span>
                          <span className="text-[10px] uppercase tracking-wider">{ticket.admitText}</span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-baseline justify-between">
                          <h3 className="text-[19px] sm:text-[20px] font-bold text-white tracking-wide">
                            {ticket.name}
                          </h3>
                          {!ticket.popular && (
                            <span className="text-[11px] text-[#f4ce78]/80 uppercase font-medium">
                              {ticket.admitText}
                            </span>
                          )}
                        </div>

                        <div className="mt-2.5 flex items-baseline gap-1">
                          <span className="font-serif text-[32px] sm:text-[36px] font-black text-[#f4ce78] tracking-tight">
                            &#8377;{ticket.price}
                          </span>
                          <span className="text-[12px] text-white/55 font-normal">/ pass</span>
                        </div>

                        {/* Benefits Checklist with Gold Checks */}
                        <ul className="mt-4 mb-6 space-y-2.5 text-left text-[13px] text-white/80">
                          {ticket.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-center gap-2.5">
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#3a080d] text-[#f4ce78] text-[10px] border border-[#f4ce78]/40">
                                ✓
                              </span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Card CTA Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(ticket.id)}
                        className={`w-full py-3 px-4 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer ${
                          ticket.popular
                            ? 'bg-gradient-to-r from-[#ffe38f] via-[#f4c45b] to-[#efae4b] text-[#180908] shadow-[0_6px_20px_rgba(239,174,75,0.25)] hover:brightness-105'
                            : 'bg-[#2b0c16] text-[#ffd88d] border border-[#f4c45b]/35 hover:bg-[#3d1222]'
                        }`}
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Book {ticket.name}</span>
                      </button>
                    </article>
                  ))}
                </div>
              </div>

              {/* Desktop Booking Sidebar (Preserved for Desktop, hidden on Mobile in favor of Bottom Sheet) */}
              <aside className="hidden lg:block rounded-2xl border border-[#6e3327]/62 bg-[#160b08]/92 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
                <h2 className="font-serif text-[28px] font-bold text-[#f4ce78]">Book Your Tickets</h2>

                {paymentError && (
                  <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <form className="mt-5 space-y-4" onSubmit={handleFormSubmit} noValidate>
                  {/* Full Name */}
                  <div>
                    <label className={`flex items-center gap-4 rounded-xl bg-[#241611] px-4 py-3 text-white/85 transition-colors ${
                      touched.name && errors.name
                        ? 'border border-rose-500/80 ring-1 ring-rose-500/40 bg-rose-950/20'
                        : touched.name && !errors.name
                        ? 'border border-emerald-500/60 ring-1 ring-emerald-500/30'
                        : 'border border-transparent'
                    }`}>
                      <User className={`h-5 w-5 shrink-0 ${touched.name && errors.name ? 'text-rose-400' : 'text-[#ffd58a]'}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] text-white/50">Full Name *</span>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          onBlur={() => handleBlur('name')}
                          className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                          placeholder="e.g. Aryan Patel"
                        />
                      </span>
                      {touched.name && !errors.name && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </label>
                    {touched.name && errors.name && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400 pl-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className={`flex items-center gap-4 rounded-xl bg-[#241611] px-4 py-3 text-white/85 transition-colors ${
                      touched.email && errors.email
                        ? 'border border-rose-500/80 ring-1 ring-rose-500/40 bg-rose-950/20'
                        : touched.email && !errors.email
                        ? 'border border-emerald-500/60 ring-1 ring-emerald-500/30'
                        : 'border border-transparent'
                    }`}>
                      <Mail className={`h-5 w-5 shrink-0 ${touched.email && errors.email ? 'text-rose-400' : 'text-[#ffd58a]'}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] text-white/50">Email Address (For E-Ticket) *</span>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          onBlur={() => handleBlur('email')}
                          className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                          placeholder="e.g. aryan@example.com"
                        />
                      </span>
                      {touched.email && !errors.email && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </label>
                    {touched.email && errors.email && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400 pl-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className={`flex items-center gap-4 rounded-xl bg-[#241611] px-4 py-3 text-white/85 transition-colors ${
                      touched.phone && errors.phone
                        ? 'border border-rose-500/80 ring-1 ring-rose-500/40 bg-rose-950/20'
                        : touched.phone && !errors.phone
                        ? 'border border-emerald-500/60 ring-1 ring-emerald-500/30'
                        : 'border border-transparent'
                    }`}>
                      <Phone className={`h-5 w-5 shrink-0 ${touched.phone && errors.phone ? 'text-rose-400' : 'text-[#ffd58a]'}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] text-white/50">Mobile Number (10 Digits) *</span>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          onBlur={() => handleBlur('phone')}
                          className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                          placeholder="9876543210"
                        />
                      </span>
                      {touched.phone && !errors.phone && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </label>
                    {touched.phone && errors.phone && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400 pl-1">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label>
                      <span className="mb-2 block text-[13px] font-semibold text-white">Ticket Type</span>
                      <span className="relative block">
                        <select
                          value={selectedTicket}
                          onChange={(event) => setSelectedTicket(event.target.value as TicketTierId)}
                          className="h-12 w-full appearance-none rounded-xl bg-[#241611] px-4 text-[14px] text-white outline-none ring-1 ring-transparent focus:ring-[#e9b35d] cursor-pointer"
                        >
                          <option value="regular">Regular - &#8377;299</option>
                          <option value="couple">Couple Pass - &#8377;599</option>
                          <option value="family">Family Pass - &#8377;999</option>
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#e9b35d]" />
                      </span>
                    </label>
                    <label>
                      <span className="mb-2 block text-[13px] font-semibold text-white">Quantity</span>
                      <span className="relative block">
                        <select
                          value={formQuantity}
                          onChange={(event) => setFormQuantity(Number(event.target.value))}
                          className="h-12 w-full appearance-none rounded-xl bg-[#241611] px-4 text-[14px] text-white outline-none ring-1 ring-transparent focus:ring-[#e9b35d] cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6].map((quantity) => (
                            <option key={quantity} value={quantity}>{quantity}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#e9b35d]" />
                      </span>
                    </label>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1c0c08] border border-[#f4ce78]/20 flex justify-between items-center text-sm">
                    <span className="text-white/70">Total Amount:</span>
                    <span className="font-serif text-xl font-bold text-[#f4ce78]">&#8377;{totalPrice.toLocaleString('en-IN')}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="mt-2 flex h-[54px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#c70d29] to-[#dc1f38] text-[16px] font-bold text-white shadow-[0_14px_28px_rgba(199,13,41,0.24)] transition hover:brightness-110 active:scale-[0.98] cursor-pointer disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Initializing Razorpay...</span>
                      </>
                    ) : (
                      <>
                        Proceed to Payment <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-2 pt-2 text-[13px] text-white/68">
                    <ShieldCheck className="h-4 w-4 text-[#ffbf68]" />
                    <span>Secure test payment powered by</span>
                    <strong className="text-white">Razorpay</strong>
                  </div>
                </form>
              </aside>
            </div>
          </section>

          {/* Highlights Info Bar */}
          <section id="event" className="px-4 sm:px-8 py-8 sm:py-10">
            <div className="mx-auto grid max-w-[1180px] gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-4">
              {highlights.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="flex items-center gap-4 rounded-xl bg-[#15060c]/60 sm:bg-transparent p-3 sm:p-0 border sm:border-0 border-[#f4ce78]/15">
                  <Icon className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 text-[#f4ce78]" />
                  <div>
                    <p className="text-[16px] sm:text-[17px] font-bold text-[#f4ce78]">{title}</p>
                    <p className="mt-0.5 sm:mt-1 text-[13px] text-white/68">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Section */}
          <footer className="relative overflow-hidden border-t border-[#551a18] px-4 sm:px-8 py-8 sm:py-10">
            <div className="relative mx-auto max-w-[1320px]">
              <div className="relative mx-auto grid max-w-[1320px] gap-8 sm:gap-9 pb-10 lg:grid-cols-[1.1fr_0.9fr_1fr]">
                {/* Venue */}
                <section className="lg:border-r lg:border-[#6b3326]/68 lg:pr-9">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <MapPin className="h-7 w-7 sm:h-8 sm:w-8 text-[#f0a659]" />
                    <h2 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#f4ce78]">Event Venue</h2>
                  </div>
                  <p className="mt-3 text-[15px] font-semibold text-white">Maharashtra Mandal</p>
                  <p className="text-[14px] text-white/80">Patna, Bihar</p>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#d49353]/70 px-4 py-2.5 text-[13px] sm:text-[14px] font-semibold text-white transition hover:bg-[#2a130e]"
                  >
                    View on Google Maps <ExternalLink className="h-4 w-4" />
                  </a>
                  <iframe
                    className="mt-5 aspect-[1.95] w-full rounded-xl border-0 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                    src={mapEmbedUrl}
                    title="Maharashtra Mandal location map"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </section>

                {/* Details */}
                <section>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <CalendarDays className="h-6 w-6 text-[#f0a659]" />
                    <h2 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#f4ce78]">Event Details</h2>
                  </div>
                  <div className="mt-6 space-y-4 sm:space-y-6">
                    {details.map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[100px_1fr] sm:grid-cols-[110px_1fr] items-center gap-4 text-[13px] sm:text-[14px]">
                        <span className="flex items-center gap-2.5 text-white/60">
                          <span className="h-3.5 w-3.5 rounded-sm border border-[#f0a659]/70" />
                          {label}
                        </span>
                        <span className="font-medium text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Notes */}
                <section id="faqs" className="relative min-h-[300px] overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_100%,rgba(140,35,26,0.26),transparent_34%)]" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-[#f0a659] text-[#f0a659] text-xs font-bold">?</span>
                      <h2 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#f4ce78]">Important Notes</h2>
                    </div>
                    <ul className="mt-6 space-y-3.5 text-[13px] sm:text-[14px] leading-relaxed text-white/80">
                      {notes.map((note) => (
                        <li key={note} className="flex gap-3">
                          <span className="text-[#f0a659]">✓</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>

              {/* Footer Bottom */}
              <div className="border-t border-[#551a18] pt-6 pb-20 sm:pb-6">
                <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-start gap-4 md:flex-row md:items-center md:gap-6">
                  <BrandMark />
                  <nav className="flex flex-wrap items-center justify-start gap-x-4 gap-y-3 text-[13px] text-white/70 md:ml-1">
                    <a
                      href="tel:+917557787551"
                      className="inline-flex items-center rounded-xl border border-[#d49353]/70 px-4 py-2.5 font-semibold text-white transition hover:bg-[#2a130e] hover:text-[#ffd37e]"
                    >
                      Contact Us: +91 755 778 7551
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>

      {/* 5. SLEEK FLOATING MOBILE PURCHASE BAR */}
      <MobileStickyBar onOpenBooking={() => handleOpenBooking()} />

      {/* 10. MOBILE BOTTOM-SHEET BOOKING MODAL */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md transition-opacity">
          {/* Backdrop Click Dismiss */}
          <div
            className="absolute inset-0"
            onClick={() => setIsBookingModalOpen(false)}
            aria-hidden="true"
          />

          {/* Bottom Sheet Modal Container */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Ticket Checkout"
            className="relative z-10 w-full max-w-lg rounded-t-[28px] sm:rounded-2xl bg-gradient-to-b from-[#1c0612] via-[#14040c] to-[#0d0207] border-t sm:border border-[#f4c45b]/40 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-sheet-up"
          >
            {/* Top Drag Indicator (Mobile) */}
            <div className="pt-3 pb-1 flex justify-center sm:hidden">
              <span className="w-12 h-1 rounded-full bg-white/25" />
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#f4c45b]/20 bg-[#16040e]/80">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3a080d] text-[#f4ce78] border border-[#f4ce78]/40">
                  <Ticket className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[16px] font-bold text-[#f4ce78]">
                    {bookingSuccess ? 'Booking Confirmed!' : 'Book Passes'}
                  </h3>
                  <p className="text-[11px] text-white/60">
                    Maharashtra Mandal • 17 Oct 2026
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close booking modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {bookingSuccess && confirmedTicket ? (
                /* Success View with Encrypted QR Pass & Gmail Status */
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] animate-bounce-short">
                    <Check className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#f4ce78] block">
                      Pass Confirmed • Ready for Entry
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-white mt-1">
                      You&apos;re Going to Rangilo Raas!
                    </h4>
                    <p className="text-xs text-white/70 mt-1">
                      Thank you, <strong className="text-[#ffd58a]">{confirmedTicket.customerName}</strong>. Your passes have been confirmed and secured.
                    </p>
                  </div>

                  {/* Scannable Encrypted QR Code Card */}
                  <div className="p-4 rounded-2xl bg-[#1c0812] border border-[#f4ce78]/40 shadow-xl space-y-3">
                    <div className="p-3 bg-white rounded-xl inline-block shadow-lg mx-auto">
                      <img
                        src={confirmedTicket.qrCodeUrl}
                        alt="Encrypted Ticket QR Code"
                        className="w-40 h-40 mx-auto block"
                      />
                      <p className="text-[10px] font-mono text-zinc-900 text-center mt-1.5 font-bold tracking-wider">
                        {confirmedTicket.ticketId}
                      </p>
                    </div>

                    <div className="text-xs text-white/80 space-y-1.5 text-left border-t border-white/10 pt-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Pass Category:</span>
                        <span className="font-bold text-white">{confirmedTicket.tierName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Quantity:</span>
                        <span className="font-bold text-white">
                          {confirmedTicket.quantity} Pass ({confirmedTicket.totalAttendees} Attendees)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Gate Entrance:</span>
                        <span className="font-bold text-emerald-400">{confirmedTicket.gateEntry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Amount Paid:</span>
                        <span className="font-bold text-[#f4ce78]">&#8377;{confirmedTicket.totalPaid.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Payment Ref:</span>
                        <span className="font-mono text-[11px] text-sky-400 truncate max-w-[200px]">{confirmedTicket.paymentId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gmail Dispatch Notification */}
                  {emailDeliveryStatus?.success ? (
                    <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-left text-xs text-emerald-300 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-emerald-200">Email Sent via Gmail</p>
                        <p className="text-[11px] text-emerald-300/80">
                          A digital pass with this encrypted QR code has been delivered to <strong>{confirmedTicket.customerEmail}</strong>.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#280d19] border border-[#f4ce78]/40 text-left text-xs text-[#ffd58a] flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#f4ce78] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">Pass Verified & Issued</p>
                        <p className="text-[11px] text-white/70">
                          Your pass has been generated with encrypted QR. You can save or open your digital pass online below.
                          {emailDeliveryStatus?.error && (
                            <span className="block mt-1 text-rose-300">Email delivery: {emailDeliveryStatus.error}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <a
                      href={`/ticket/${confirmedTicket.ticketId}?token=${encodeURIComponent(confirmedTicket.ticketToken)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#ffe38f] via-[#f4c45b] to-[#efae4b] text-[14px] font-bold uppercase tracking-wider text-[#180908] shadow-[0_6px_22px_rgba(239,174,75,0.35)] flex items-center justify-center gap-2 transition hover:brightness-105 active:scale-[0.98]"
                    >
                      <span>View Official Digital Pass</span>
                      <ExternalLink className="w-4 h-4 text-[#180908]" />
                    </a>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="py-2.5 px-3 rounded-xl bg-[#240816] border border-[#f4ce78]/30 text-xs font-semibold text-white hover:bg-[#340c21] transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#f4ce78]" />
                        <span>Print Pass</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsBookingModalOpen(false)}
                        className="py-2.5 px-3 rounded-xl bg-[#1b0812] border border-white/10 text-xs font-semibold text-white/80 hover:bg-white/10 transition cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
                  {paymentError && (
                    <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-200 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{paymentError}</span>
                    </div>
                  )}

                  {/* Ticket Type Selector (Compact Segmented Pills) */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#f4ce78] mb-1.5">
                      Select Ticket Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {tickets.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTicket(t.id)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedTicket === t.id
                              ? 'bg-[#3a080d] border-[#f4ce78] shadow-md ring-1 ring-[#f4ce78]/50'
                              : 'bg-[#18050e] border-[#f4ce78]/25 hover:border-[#f4ce78]/50'
                          }`}
                        >
                          <p className="text-[11px] font-bold text-white truncate">{t.name}</p>
                          <p className="text-[13px] font-serif font-black text-[#f4ce78] mt-0.5">
                            &#8377;{t.price}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Stepper (44px+ Touch Targets) */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#1c0812] border border-[#f4ce78]/25">
                    <div>
                      <span className="text-xs font-bold text-white block">Number of Passes</span>
                      <span className="text-[11px] text-white/60">
                        &#8377;{activeTicketObj.price} &times; {formQuantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormQuantity(Math.max(1, formQuantity - 1))}
                        disabled={formQuantity <= 1}
                        className="h-11 w-11 rounded-xl bg-[#2a0b16] border border-[#f4ce78]/30 text-white text-lg font-bold flex items-center justify-center active:scale-95 disabled:opacity-30 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-base font-bold text-white">
                        {formQuantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormQuantity(Math.min(10, formQuantity + 1))}
                        disabled={formQuantity >= 10}
                        className="h-11 w-11 rounded-xl bg-[#2a0b16] border border-[#f4ce78]/30 text-white text-lg font-bold flex items-center justify-center active:scale-95 disabled:opacity-30 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Customer Inputs with Live Validation */}
                  <div className="space-y-3">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-white/80 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          onBlur={() => handleBlur('name')}
                          placeholder="e.g. Aryan Patel"
                          className={`w-full h-11 px-3.5 rounded-xl bg-[#18050e] text-sm text-white placeholder:text-white/40 focus:outline-none transition-colors ${
                            touched.name && errors.name
                              ? 'border border-rose-500/80 ring-1 ring-rose-500/40 bg-rose-950/20'
                              : touched.name && !errors.name
                              ? 'border border-emerald-500/60 ring-1 ring-emerald-500/30'
                              : 'border border-[#f4ce78]/30 focus:border-[#f4ce78] focus:ring-1 focus:ring-[#f4ce78]'
                          }`}
                        />
                        {touched.name && !errors.name && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      {touched.name && errors.name && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400 pl-1">
                          <AlertCircle className="w-3 h-3 shrink-0" /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[11px] font-semibold text-white/80 mb-1">
                        Email Address (For E-Ticket) *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          onBlur={() => handleBlur('email')}
                          placeholder="e.g. aryan@example.com"
                          className={`w-full h-11 px-3.5 rounded-xl bg-[#18050e] text-sm text-white placeholder:text-white/40 focus:outline-none transition-colors ${
                            touched.email && errors.email
                              ? 'border border-rose-500/80 ring-1 ring-rose-500/40 bg-rose-950/20'
                              : touched.email && !errors.email
                              ? 'border border-emerald-500/60 ring-1 ring-emerald-500/30'
                              : 'border border-[#f4ce78]/30 focus:border-[#f4ce78] focus:ring-1 focus:ring-[#f4ce78]'
                          }`}
                        />
                        {touched.email && !errors.email && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      {touched.email && errors.email && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400 pl-1">
                          <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-[11px] font-semibold text-white/80 mb-1">
                        Mobile Number (10 Digits) *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          onBlur={() => handleBlur('phone')}
                          placeholder="9876543210"
                          className={`w-full h-11 px-3.5 rounded-xl bg-[#18050e] text-sm text-white placeholder:text-white/40 focus:outline-none transition-colors ${
                            touched.phone && errors.phone
                              ? 'border border-rose-500/80 ring-1 ring-rose-500/40 bg-rose-950/20'
                              : touched.phone && !errors.phone
                              ? 'border border-emerald-500/60 ring-1 ring-emerald-500/30'
                              : 'border border-[#f4ce78]/30 focus:border-[#f4ce78] focus:ring-1 focus:ring-[#f4ce78]'
                          }`}
                        />
                        {touched.phone && !errors.phone && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      {touched.phone && errors.phone && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-400 pl-1">
                          <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Total & Submit Button */}
                  <div className="pt-2 border-t border-white/10 space-y-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                        Total Payable:
                      </span>
                      <span className="font-serif text-2xl font-black text-[#f4ce78]">
                        &#8377;{totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing || isVerifying}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ffe38f] via-[#f4c45b] to-[#efae4b] text-[14px] font-bold uppercase tracking-wider text-[#180908] shadow-[0_6px_22px_rgba(239,174,75,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#180908]" />
                          <span>Verifying Payment & Issuing Pass...</span>
                        </>
                      ) : isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#180908]" />
                          <span>Connecting to Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <span>Proceed to Payment</span>
                          <ArrowRight className="w-4 h-4 text-[#180908]" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/60">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#f4ce78]" />
                      <span>Secure test payment powered by</span>
                      <strong className="text-white font-semibold">Razorpay</strong>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

