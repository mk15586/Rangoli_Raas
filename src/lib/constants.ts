import { TicketTier, EventHighlight } from './types';

export const EVENT_DETAILS = {
  name: "RANGILO RAAS 2026",
  tagline: "Play. Dance. Celebrate.",
  subtitle: "Non-stop DJ beats, cultural programs and many more",
  dateFormatted: "Saturday, 17 October 2026",
  isoDate: "2026-10-17T18:00:00+05:30",
  doorsOpen: "Time to be announced",
  eventEnd: "Time to be announced",
  venue: "Maharashtra Mandal",
  address: "Maharashtra Mandal, Patna",
  city: "Bihar, India",
  agePolicy: "All age groups welcome (children under 5 require an accompanying adult pass)",
  dressCode: "Festive Traditional (Chaniya Choli / Kediyu / Kurta Pajama)",
  parking: "Reserved parking available for pass holders",
  helpline: "+91 79031 27663",
  sponsorshipPhone: "+91 75577 87551",
  supportEmail: "concierge@dandiyanights.in",
};

export const TICKET_TIERS: TicketTier[] = [
  {
    id: "regular",
    name: "Regular",
    tagline: "Full access to the central dancing arena",
    price: 299,
    admitCount: 1,
    benefits: [
      "Event entry",
      "Access to the dance arena",
    ],
    passHighlight: "Verified Digital QR Entry",
  },
  {
    id: "couple",
    name: "Couple Pass",
    tagline: "Designed for couples and dancing duos",
    price: 599,
    admitCount: 2,
    badge: "Couple Favorite",
    benefits: [
      "Entry for 2 people",
      "Access to the dance arena",
    ],
    passHighlight: "Priority Couple Entry",
  },
  {
    id: "family",
    name: "Family Pass",
    tagline: "A festive pass for the whole family",
    price: 999,
    admitCount: 5,
    popular: true,
    badge: "Best Value",
    benefits: [
      "Entry for 5 people",
      "Access to the dance arena",
    ],
    passHighlight: "Family Gate Access",
  },
];

export const HIGHLIGHTS: EventHighlight[] = [
  {
    id: "live-music",
    title: "Live Dhol & Celebrity DJ",
    description: "Heart-thumping live beats by Mumbai's finest 12-piece dhol troupe coupled with top celebrity Bollywood & Gujarati fusion DJs.",
    iconName: "Music",
    tag: "Acoustics & Rhythm",
  },
  {
    id: "garba-arena",
    title: "Mega 50,000 sq.ft Arena",
    description: "Spacious wooden dance flooring designed for smooth circular Garba swirls with dust-free comfort and 360-degree acoustics.",
    iconName: "Sparkles",
    tag: "Grand Scale",
  },
  {
    id: "food-street",
    title: "Royal Gujarati Food Street",
    description: "Curated gourmet culinary stalls serving authentic Kathiyawadi bites, piping hot Jalebi Fafda, fusion Chaats, and festive mocktails.",
    iconName: "Utensils",
    tag: "Culinary Haven",
  },
  {
    id: "photo-experience",
    title: "Cinematic Photo Booths",
    description: "Art-directed Instagrammable installations with mirror work, royal canopies, fairy light tunnels, and slow-mo 360° video platforms.",
    iconName: "Camera",
    tag: "Memories",
  },
  {
    id: "family-safe",
    title: "Safe & Premium Atmosphere",
    description: "Zero-tolerance security with female guards, medical desk, sanitized VIP washrooms, and seamless crowd flow management.",
    iconName: "ShieldCheck",
    tag: "Safety First",
  },
  {
    id: "decor-lighting",
    title: "Mesmerizing Night Lights",
    description: "Immersive architectural illumination, warm hanging lanterns, and laser light shows synchronized to traditional festive raas.",
    iconName: "Flame",
    tag: "Ambience",
  },
];

export const ARTISTS = [
  {
    name: "Kinjal Vora & The Raas Band",
    role: "Headlining Traditional Garba Vocalist",
    image: "/images/artist1.jpg",
    bio: "Famed singer with 10+ years leading legendary Navratri nights across India & the UK.",
    tag: "Live Folk Vocals"
  },
  {
    name: "DJ Rohit & The Dhol Beats",
    role: "Bollywood & Gujarati Fusion Maestro",
    image: "/images/artist2.jpg",
    bio: "Pioneering the modern electronic Dandiya sound with pulsating beats and brass horn ensembles.",
    tag: "EDM x Dhol"
  },
  {
    name: "The Puneri Dhol Tasha Troupe",
    role: "12-Piece Live Percussion Ensemble",
    image: "/images/artist3.jpg",
    bio: "High-octane rhythmic performance setting the adrenaline rush for the midnight Raas finale.",
    tag: "Thunderous Beats"
  }
];

export const FAQS = [
  {
    question: "What do I need for entry?",
    answer: "Bring your digital QR pass and a valid photo ID for smooth verification at the venue entrance."
  },
  {
    question: "What is the dress code for the evening?",
    answer: "Festive traditional attire is enthusiastically recommended! For women: Chaniya Choli, Lehenga, or Anarkali. For men: Kediyu, Kurta Pajama, or Dhoti Kurta with festive jackets."
  },
  {
    question: "How will I receive my ticket after booking?",
    answer: "Immediately upon completing payment, a unique digital e-ticket with an encrypted QR pass is generated on your screen. You can download it directly as a pass and an email copy is simultaneously dispatched to your registered inbox."
  },
  {
    question: "Is there a specific age limit?",
    answer: "The event is family-friendly and welcoming to all age groups. Children aged 5 and under require an accompanying adult pass-holder."
  },
  {
    question: "Can I cancel or transfer my ticket?",
    answer: "Tickets are non-refundable once purchased, but they are fully transferable. Anyone presenting the valid digital QR pass at the entrance gate will be granted admission."
  },
  {
    question: "Is parking available at the venue?",
    answer: "Yes, the venue features dedicated multi-acre secure parking. VIP ticket holders have access to priority valet parking at the grand portico."
  }
];
