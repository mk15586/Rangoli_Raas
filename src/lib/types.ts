export type TicketTierId = 'regular' | 'couple' | 'family';

export interface TicketTier {
  id: TicketTierId;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  admitCount: number;
  badge?: string;
  popular?: boolean;
  benefits: string[];
  stockWarning?: string;
  sticksIncluded: string;
}

export interface CartItem {
  tierId: TicketTierId;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  acceptTerms: boolean;
}

export interface GeneratedTicket {
  ticketId: string;
  ticketToken: string; // e.g. DND_x8K29Lm72Qp91
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tierId: TicketTierId;
  tierName: string;
  quantity: number;
  totalAttendees: number;
  subtotal: number;
  tax: number;
  totalPaid: number;
  bookingDate: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  gateEntry: string;
  qrDataUrl?: string;
}

export interface EventHighlight {
  id: string;
  title: string;
  description: string;
  iconName: string;
  tag: string;
}
