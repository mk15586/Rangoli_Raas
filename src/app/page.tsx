'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Camera,
  ChevronDown,
  ExternalLink,
  Mail,
  MapPin,
  Music,
  Phone,
  ShieldCheck,
  Soup,
  User,
  Users,
} from 'lucide-react';
import { MobileStickyBar } from '@/components/layout/MobileStickyBar';
import { TicketTierId } from '@/lib/types';

const layoutBackgroundImage = '/pictures/Elegant Garba Night Dandiya Background.png';
const mapLink = 'https://maps.app.goo.gl/KmShKinUXKTfCWna7';
const mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d230273.7059166395!2d85.06993390722658!3d25.60403050707979!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed59714de8ca13%3A0x6cc0f8ee032081ba!2sMaharashtra%20Mandal!5e0!3m2!1sen!2sin!4v1790167541716!5m2!1sen!2sin';

const tickets = [
  {
    id: 'regular' as TicketTierId,
    name: 'Regular',
    price: 299,
    benefits: ['Event Entry', 'Access to dance arena'],
  },
  {
    id: 'family' as TicketTierId,
    name: 'Family Pass',
    price: 999,
    benefits: ['Entry for 5 people', 'Access to dance arena'],
    popular: true,
  },
  {
    id: 'couple' as TicketTierId,
    name: 'Couple Pass',
    price: 599,
    benefits: ['Entry for 2 people', 'Access to dance arena'],
  },
];

const highlights = [
  { icon: Music, title: 'Live Music', copy: 'Top DJs & Artists' },
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
    <div className="flex items-center gap-3">
      <div className="relative hidden h-12 w-11 shrink-0 sm:block">
        <span className="absolute left-1 top-1 h-9 w-3 rotate-[-18deg] rounded-full bg-[#f4b55d] shadow-[0_0_14px_rgba(244,181,93,0.35)]" />
        <span className="absolute right-2 top-2 h-9 w-3 rotate-[18deg] rounded-full bg-[#ce1d35] shadow-[0_0_14px_rgba(206,29,53,0.35)]" />
        <span className="absolute left-0 top-8 h-4 w-4 rounded-full border border-[#f7ce75]" />
        <span className="absolute right-0 top-8 h-4 w-4 rounded-full border border-[#f7ce75]" />
      </div>
      <div>
        <p className="font-serif text-[16px] font-semibold leading-none tracking-[0.08em] text-[#f7d88d] sm:text-[22px]">
          RANGILO RAAS
        </p>
        <p className="mt-1 hidden text-[11px] font-semibold tracking-[0.16em] text-white/80 sm:block">
          DANCE &bull; CULTURE &bull; CELEBRATE
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedTicket, setSelectedTicket] = useState<TicketTierId>('regular');
  const [formQuantity, setFormQuantity] = useState(1);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080303] text-[#fff8ed]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#bb6a3d]/20 bg-[#0b0304]/82 shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1320px] items-center justify-between gap-3 px-4 sm:h-[86px] sm:px-8">
          <a href="#" aria-label="Rangilo Raas home">
            <BrandMark />
          </a>

          <nav className="hidden items-center gap-9 text-[15px] font-medium text-white/76 md:flex">
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

          <a
            href="#tickets"
            className="rounded-xl bg-gradient-to-b from-[#ffe38f] to-[#efae4b] px-4 py-3 text-[13px] font-bold text-[#180908] shadow-[0_8px_26px_rgba(239,174,75,0.24)] transition hover:brightness-110 sm:px-6 sm:text-[15px]"
          >
            Book<span className="hidden sm:inline"> Tickets</span>
          </a>
        </div>
      </header>

      <main>
        <section
          className="hero-responsive-background relative min-h-[560px] overflow-hidden border-b border-[#6b281f] bg-cover bg-center pt-[78px] sm:min-h-[710px] sm:pt-[86px]"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#090203_0%,rgba(9,2,3,0.96)_18%,rgba(20,5,6,0.66)_43%,rgba(20,5,6,0.12)_74%,rgba(8,2,3,0.45)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#090303] to-transparent" />
          <div className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full border border-[#9a3f28]/20 opacity-50" />

          <div className="relative z-10 mx-auto flex min-h-[624px] max-w-[1320px] items-center px-5 py-12 sm:px-8">
            <div className="max-w-[560px]">
              <p className="mb-5 text-[17px] font-medium tracking-[0.34em] text-[#ffd98a]">
                LET&apos;S RAAS TOGETHER
              </p>
              <h1 className="font-serif text-[56px] font-black uppercase leading-[0.98] tracking-[0.02em] text-[#ffe19a] drop-shadow-[0_6px_24px_rgba(0,0,0,0.8)] sm:text-[92px]">
                RANGILO
                <span className="block">RAAS</span>
              </h1>
              <p className="mt-5 text-[28px] font-semibold text-white">Play. Dance. Celebrate.</p>
              <p className="mt-4 max-w-[500px] text-[17px] leading-8 text-white/90">
                Non-stop DJ beats, cultural programs and a vibrant evening of Raas for everyone.
              </p>

              <div className="mt-8 grid max-w-[610px] gap-6 sm:grid-cols-2">
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

              <div className="mt-10 grid max-w-full grid-cols-2 gap-3 border-t border-[#8d3c2d]/24 pt-7 sm:max-w-[600px] sm:grid-cols-4 sm:gap-4">
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

        <div
          className="relative overflow-hidden"
          style={{
            backgroundImage: `url("${layoutBackgroundImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <section id="tickets" className="relative overflow-hidden border-b border-[#5b1c19] px-5 py-9 sm:px-8">
          <div className="relative mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[1fr_430px]">
            <div>
              <h2 className="font-serif text-[28px] font-bold text-[#f4ce78] sm:text-[34px]">Choose Your Tickets</h2>
              <p className="mt-1 text-[16px] text-white/83">Select your ticket type and get ready to dance!</p>

              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {tickets.map((ticket) => (
                  <article
                    key={ticket.id}
                    className={`relative flex min-h-[306px] flex-col rounded-lg border bg-[#130807]/82 p-7 text-center shadow-[0_18px_42px_rgba(0,0,0,0.28)] ${
                      ticket.popular ? 'border-[#f3c266]' : 'border-[#7b3729]/55'
                    }`}
                  >
                    {ticket.popular && (
                      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2c760] px-4 py-1.5 text-[12px] font-bold text-[#1a0806]">
                        Most Popular
                      </span>
                    )}
                    <h3 className="mt-1 text-[19px] font-medium text-white">{ticket.name}</h3>
                    <p className="mt-2 font-serif text-[31px] font-bold text-[#f4ce78]">&#8377;{ticket.price}</p>
                    <ul className="mt-6 space-y-3 text-left text-[14px] text-white/77">
                      {ticket.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3">
                          <span className="mt-0.5 text-[#f0a659]">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <aside className="rounded-[10px] border border-[#6e3327]/62 bg-[#160b08]/92 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
              <h2 className="font-serif text-[29px] font-bold text-[#f4ce78]">Book Your Tickets</h2>
              <form className="mt-5 space-y-4" onSubmit={(event) => { event.preventDefault(); window.location.hash = 'tickets'; }}>
                <label className="flex items-center gap-4 rounded-md bg-[#241611] px-4 py-3 text-white/85">
                  <User className="h-5 w-5 shrink-0 text-[#ffd58a]" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] text-white/50">Full Name</span>
                    <input className="w-full bg-transparent text-sm outline-none placeholder:text-white/76" placeholder="John Doe" />
                  </span>
                </label>
                <label className="flex items-center gap-4 rounded-md bg-[#241611] px-4 py-3 text-white/85">
                  <Mail className="h-5 w-5 shrink-0 text-[#ffd58a]" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] text-white/50">Email Address</span>
                    <input className="w-full bg-transparent text-sm outline-none placeholder:text-white/76" placeholder="john@example.com" type="email" />
                  </span>
                </label>
                <label className="flex items-center gap-4 rounded-md bg-[#241611] px-4 py-3 text-white/85">
                  <Phone className="h-5 w-5 shrink-0 text-[#ffd58a]" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] text-white/50">Mobile Number</span>
                    <input className="w-full bg-transparent text-sm outline-none placeholder:text-white/76" placeholder="+91 98765 43210" type="tel" />
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label>
                    <span className="mb-2 block text-[13px] font-semibold text-white">Ticket Type</span>
                    <span className="relative block">
                      <select
                        value={selectedTicket}
                        onChange={(event) => setSelectedTicket(event.target.value as TicketTierId)}
                        className="h-12 w-full appearance-none rounded-md bg-[#241611] px-4 text-[14px] text-white outline-none ring-1 ring-transparent focus:ring-[#e9b35d]"
                      >
                        <option value="regular">Select ticket type</option>
                        <option value="regular">Regular</option>
                        <option value="couple">Couple Pass</option>
                        <option value="family">Family Pass</option>
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
                        className="h-12 w-full appearance-none rounded-md bg-[#241611] px-4 text-[14px] text-white outline-none ring-1 ring-transparent focus:ring-[#e9b35d]"
                      >
                        {[1, 2, 3, 4, 5, 6].map((quantity) => (
                          <option key={quantity} value={quantity}>{quantity}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#e9b35d]" />
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-2 flex h-[58px] w-full items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-[#c70d29] to-[#dc1f38] text-[16px] font-bold text-white shadow-[0_14px_28px_rgba(199,13,41,0.24)] transition hover:brightness-110"
                >
                  Proceed to Payment <ArrowRight className="h-5 w-5" />
                </button>
                <div className="flex items-center justify-center gap-2 pt-2 text-[13px] text-white/68">
                  <span className="text-[#ffbf68]">▣</span>
                  <span>Secure payments powered by</span>
                  <strong className="text-white">Razorpay</strong>
                </div>
              </form>
            </aside>
          </div>
        </section>

        <section id="event" className="px-5 py-8 sm:px-8">
          <div className="mx-auto grid max-w-[1180px] gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="flex items-center gap-5">
                <Icon className="h-11 w-11 shrink-0 text-[#f4ce78]" />
                <div>
                  <p className="text-[17px] font-bold text-[#f4ce78]">{title}</p>
                  <p className="mt-1 text-[13px] text-white/68">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      <footer className="relative overflow-hidden border-t border-[#551a18] px-5 py-8 sm:px-8">
        <div className="relative mx-auto max-w-[1320px]">
          <div className="relative mx-auto grid max-w-[1320px] gap-9 pb-10 lg:grid-cols-[1.1fr_0.9fr_1fr]">
            <section className="lg:border-r lg:border-[#6b3326]/68 lg:pr-9">
              <div className="flex items-center gap-4">
                <MapPin className="h-8 w-8 text-[#f0a659]" />
                <h2 className="font-serif text-[24px] font-bold text-[#f4ce78]">Event Venue</h2>
              </div>
              <p className="mt-4 text-[15px] font-semibold">Maharashtra Mandal</p>
              <p className="text-[14px] text-white/82">Patna, Bihar</p>
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-md border border-[#d49353]/70 px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-[#2a130e]"
              >
                View on Google Maps <ExternalLink className="h-4 w-4" />
              </a>
              <iframe
                className="mt-7 aspect-[1.95] w-full rounded-md border-0 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                src={mapEmbedUrl}
                title="Maharashtra Mandal location map"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </section>

            <section>
              <div className="flex items-center gap-4">
                <CalendarDays className="h-6 w-6 text-[#f0a659]" />
                <h2 className="font-serif text-[24px] font-bold text-[#f4ce78]">Event Details</h2>
              </div>
              <div className="mt-8 space-y-6">
                {details.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[110px_1fr] items-center gap-5 text-[14px]">
                    <span className="flex items-center gap-3 text-white/62">
                      <span className="h-4 w-4 rounded-sm border border-[#f0a659]/70" />
                      {label}
                    </span>
                    <span className="font-medium text-white">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="faqs" className="relative min-h-[356px] overflow-hidden rounded-md">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_100%,rgba(140,35,26,0.26),transparent_34%)]" />
              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-[#f0a659] text-[#f0a659]">?</span>
                  <h2 className="font-serif text-[24px] font-bold text-[#f4ce78]">Important Notes</h2>
                </div>
                <ul className="mt-8 space-y-4 text-[14px] leading-6 text-white/82">
                  {notes.map((note) => (
                    <li key={note} className="flex gap-4">
                      <span className="text-[#f0a659]">✓</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </section>
          </div>

          <div className="border-t border-[#551a18] pt-8">
            <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-start gap-4 md:flex-row md:items-center md:gap-6">
              <BrandMark />
              <nav className="flex flex-wrap items-center justify-start gap-x-4 gap-y-3 text-[13px] text-white/70 md:ml-1">
                <a
                  href="tel:+917557787551"
                  className="inline-flex items-center rounded-md border border-[#d49353]/70 px-4 py-2 font-semibold text-white transition hover:bg-[#2a130e] hover:text-[#ffd37e]"
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

      <MobileStickyBar />
    </div>
  );
}
