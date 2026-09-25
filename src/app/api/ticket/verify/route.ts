import { NextResponse } from 'next/server';
import { decryptTicketToken } from '@/lib/ticketSecurity';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const ticketId = searchParams.get('ticketId');

    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token missing' }, { status: 400 });
    }

    const payload = decryptTicketToken(token);

    if (!payload) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid or tampered ticket token. Entry Denied!',
      });
    }

    if (ticketId && payload.ticketId !== ticketId) {
      return NextResponse.json({ valid: false, error: 'Ticket ID does not match the security token.' });
    }

    const { data: booking, error: bookingError } = await getSupabaseServerClient()
      .from('bookings')
      .select('ticket_id')
      .eq('ticket_id', payload.ticketId)
      .eq('ticket_token', token)
      .eq('payment_status', 'captured')
      .maybeSingle();

    if (bookingError || !booking) {
      return NextResponse.json({ valid: false, error: 'Ticket is not an active captured booking.' });
    }

    return NextResponse.json({
      valid: true,
      ticket: payload,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error: unknown) {
    return NextResponse.json({
      valid: false,
      error: error instanceof Error ? error.message : 'Verification error',
    }, { status: 500 });
  }
}
