'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles, Ticket } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Event', href: '#event-info' },
    { label: 'Highlights', href: '#highlights' },
    { label: 'Artists', href: '#artists' },
    { label: 'Passes', href: '#tickets' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090306]/95 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-lg shadow-black/40 py-3'
          : 'bg-gradient-to-b from-[#090306]/90 via-[#090306]/50 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Wordmark */}
        <Link href="/" className="group flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded-lg p-1">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/60 bg-[#6E1E3A] flex items-center justify-center shadow-md shadow-[#6E1E3A]/40 group-hover:scale-105 transition-transform duration-200">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#F3E5AB]">
              <path d="M3 21L21 3M3 3L21 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3.5" fill="#D4AF37" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-serif tracking-[0.2em] text-lg sm:text-xl font-bold uppercase gold-gradient-text">
              RANGILO RAAS
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/80 -mt-1 font-medium">
              Play. Dance. Celebrate.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#FAF5EF]/80 hover:text-[#F3E5AB] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="/#tickets"
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wider uppercase text-[#090306] bg-gradient-to-r from-[#F3E5AB] via-[#E5B869] to-[#D4AF37] hover:from-[#FFF1D0] hover:to-[#E5B869] rounded-full shadow-md shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-[#6E1E3A]" />
            <span>Book Tickets</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <a
            href="/#tickets"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#090306] bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] rounded-full shadow-sm"
          >
            <Ticket className="w-3.5 h-3.5 text-[#6E1E3A]" />
            <span>Book</span>
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#FAF5EF] hover:text-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-lg"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0F050B] border-b border-[#D4AF37]/30 px-6 py-6 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#FAF5EF]/90 hover:text-[#F3E5AB] py-1 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]/40" />
              </a>
            ))}
            <div className="pt-2">
              <a
                href="/#tickets"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wider text-[#090306] bg-gradient-to-r from-[#F3E5AB] via-[#E5B869] to-[#D4AF37] rounded-lg shadow-lg shadow-[#D4AF37]/20"
              >
                <Ticket className="w-4 h-4 text-[#6E1E3A]" />
                <span>Book Tickets Now</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
