import type { Metadata, Viewport } from "next";
import { Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rangilo Raas 2026 — Official Premium Ticket Booking",
  description: "Join Rangilo Raas at Maharashtra Mandal on 17 October 2026 for non-stop DJ beats, cultural programs and festive celebration.",
  keywords: ["Rangilo Raas", "Garba 2026", "Navratri Tickets", "Dandiya Raas", "Dandiya Passes", "Patna", "Maharashtra Mandal"],
  openGraph: {
    title: "Rangilo Raas 2026 — Play. Dance. Celebrate.",
    description: "Book your official passes for Rangilo Raas at Maharashtra Mandal.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#090306",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${plusJakartaSans.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#090306] text-[#FAF5EF] flex flex-col font-sans selection:bg-[#6E1E3A] selection:text-[#F3E5AB]">
        {children}
      </body>
    </html>
  );
}
