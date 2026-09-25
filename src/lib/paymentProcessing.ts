import QRCode from 'qrcode';
import { EmailSendResult, sendTicketEmail } from './mailjet';
import { getSupabaseServerClient } from './supabaseServer';
import {
  isTicketTier,
  normalizePhone,
  parseQuantity,
  TICKET_ADMITS,
  TICKET_PRICES,
} from './bookingValidation';
import { encryptTicketPayload, generateTicketId, TicketPayload } from './ticketSecurity';

export interface VerifiedOrder {
  id: string;
  amount: number;
  currency: string;
  notes?: Record<string, string>;
}

export interface VerifiedPayment {
  id: string;
  order_id: string;
  amount: number;
  status: string;
}

export interface ProcessedPayment {
  ticket: TicketPayload;
  encryptedToken: string;
  qrCodeDataUrl: string;
  verifyUrl: string;
  emailDelivery: EmailSendResult;
}

const TIER_DETAILS: Record<string, { name: string; price: number }> = {
  regular: { name: 'Regular Pass', price: 299 },
  couple: { name: 'Couple Pass', price: 599 },
  family: { name: 'Family Pass', price: 999 },
};

function getEmailResult(value: Record<string, unknown> | null): EmailSendResult {
  if (value && typeof value.success === 'boolean') {
    return value as unknown as EmailSendResult;
  }

  return {
    success: false,
    message: 'Ticket email has not been sent yet.',
  };
}

function ticketFromRecord(record: {
  ticket_id: string;
  ticket_token: string;
  order_id: string;
  payment_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tier_id: string;
  tier_name: string;
  quantity: number;
  total_attendees: number;
  total_paid: number;
  event_date: string;
  venue: string;
  issued_at: string;
  verify_url: string;
}): TicketPayload {
  return {
    ticketId: record.ticket_id,
    orderId: record.order_id,
    paymentId: record.payment_id,
    customerName: record.customer_name,
    customerEmail: record.customer_email,
    customerPhone: record.customer_phone,
    tierId: record.tier_id,
    tierName: record.tier_name,
    quantity: record.quantity,
    totalAttendees: record.total_attendees,
    totalPaid: Number(record.total_paid),
    issuedAt: Date.parse(record.issued_at),
    eventDate: record.event_date,
    venue: record.venue,
  };
}

async function resultFromRecord(record: Parameters<typeof ticketFromRecord>[0]): Promise<ProcessedPayment> {
  const ticket = ticketFromRecord(record);
  const qrCodeDataUrl = await QRCode.toDataURL(record.verify_url, {
    errorCorrectionLevel: 'H',
    width: 400,
    margin: 1,
    color: { dark: '#14040b', light: '#ffffff' },
  });

  const { data } = await getSupabaseServerClient()
    .from('bookings')
    .select('email_delivery')
    .eq('order_id', record.order_id)
    .maybeSingle();

  return {
    ticket,
    encryptedToken: record.ticket_token,
    qrCodeDataUrl,
    verifyUrl: record.verify_url,
    emailDelivery: getEmailResult(data?.email_delivery ?? null),
  };
}

export async function processVerifiedPayment(
  order: VerifiedOrder,
  payment: VerifiedPayment,
): Promise<ProcessedPayment> {
  const notes = order.notes || {};
  const tierId = notes.tierId;
  const quantity = parseQuantity(notes.quantity);
  const customerName = notes.customerName?.trim();
  const customerEmail = notes.customerEmail?.trim().toLowerCase();
  const customerPhone = normalizePhone(notes.customerPhone || '');

  if (!isTicketTier(tierId) || !quantity || !customerName || !customerEmail || !customerPhone) {
    throw new Error('Verified Razorpay order is missing valid booking details.');
  }

  const tier = TIER_DETAILS[tierId];
  const expectedAmount = TICKET_PRICES[tierId] * quantity * 100;
  if (order.currency !== 'INR' || order.amount !== expectedAmount) {
    throw new Error('Verified Razorpay order amount does not match the booking.');
  }
  if (payment.order_id !== order.id || payment.amount !== expectedAmount || payment.status !== 'captured') {
    throw new Error('Razorpay payment was not captured for this booking.');
  }

  const supabase = getSupabaseServerClient();
  const { data: existing, error: existingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('order_id', order.id)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }
  if (existing) {
    if (existing.payment_id !== payment.id) {
      throw new Error('This Razorpay order is already linked to a different payment.');
    }
    return resultFromRecord(existing);
  }

  const ticket: TicketPayload = {
    ticketId: generateTicketId(),
    orderId: order.id,
    paymentId: payment.id,
    customerName,
    customerEmail,
    customerPhone,
    tierId,
    tierName: tier.name,
    quantity,
    totalAttendees: TICKET_ADMITS[tierId] * quantity,
    totalPaid: tier.price * quantity,
    issuedAt: Date.now(),
    eventDate: 'Saturday, 17 October 2026',
    venue: 'Maharashtra Mandal, Patna',
  };

  const encryptedToken = encryptTicketPayload(ticket);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verifyUrl = `${appUrl}/ticket/${ticket.ticketId}?token=${encodeURIComponent(encryptedToken)}`;
  const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: 'H',
    width: 400,
    margin: 1,
    color: { dark: '#14040b', light: '#ffffff' },
  });

  const { data: inserted, error: insertError } = await supabase
    .from('bookings')
    .insert({
      ticket_id: ticket.ticketId,
      ticket_token: encryptedToken,
      order_id: ticket.orderId,
      payment_id: ticket.paymentId,
      payment_status: 'captured',
      customer_name: ticket.customerName,
      customer_email: ticket.customerEmail,
      customer_phone: ticket.customerPhone,
      tier_id: ticket.tierId,
      tier_name: ticket.tierName,
      quantity: ticket.quantity,
      total_attendees: ticket.totalAttendees,
      unit_price: tier.price,
      total_paid: ticket.totalPaid,
      event_date: ticket.eventDate || 'Saturday, 17 October 2026',
      venue: ticket.venue || 'Maharashtra Mandal, Patna',
      gate_entry: tierId === 'family' ? 'Gate 1 (Family Entry)' : 'Gate 3 (Central)',
      issued_at: new Date(ticket.issuedAt).toISOString(),
      verify_url: verifyUrl,
      email_delivery: null,
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (insertError) {
    if (insertError.code === '23505') {
      const { data: duplicate } = await supabase
        .from('bookings')
        .select('*')
        .eq('order_id', order.id)
        .maybeSingle();
      if (duplicate && duplicate.payment_id === payment.id) {
        return resultFromRecord(duplicate);
      }
    }
    throw insertError;
  }

  let emailDelivery: EmailSendResult;
  try {
    emailDelivery = await sendTicketEmail({
      ticket,
      encryptedToken,
      qrCodeDataUrl,
    });
  } catch (error: unknown) {
    emailDelivery = {
      success: false,
      message: 'Gmail SMTP connection error',
      error: error instanceof Error ? error.message : 'Gmail dispatch failed',
    };
  }

  await supabase
    .from('bookings')
    .update({ email_delivery: emailDelivery as unknown as Record<string, unknown>, updated_at: new Date().toISOString() })
    .eq('order_id', inserted.order_id);

  return {
    ticket,
    encryptedToken,
    qrCodeDataUrl,
    verifyUrl,
    emailDelivery,
  };
}

export function toTicketResponse(result: ProcessedPayment) {
  const { ticket } = result;
  return {
    ticketId: ticket.ticketId,
    ticketToken: result.encryptedToken,
    qrCodeUrl: result.qrCodeDataUrl,
    verifyUrl: result.verifyUrl,
    customerName: ticket.customerName,
    customerEmail: ticket.customerEmail,
    customerPhone: ticket.customerPhone,
    tierName: ticket.tierName,
    quantity: ticket.quantity,
    totalAttendees: ticket.totalAttendees,
    totalPaid: ticket.totalPaid,
    orderId: ticket.orderId,
    paymentId: ticket.paymentId,
    eventDate: ticket.eventDate,
    venue: ticket.venue,
    gateEntry: ticket.tierId === 'family' ? 'Gate 1 (Family Entry)' : 'Gate 3 (Central)',
  };
}
