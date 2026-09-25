import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import {
  isTicketTier,
  normalizePhone,
  parseQuantity,
  TICKET_PRICES,
  validateBookingDetails,
} from '@/lib/bookingValidation';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tierId, quantity, customerName, customerEmail, customerPhone } = body;

    // Strict validation
    if (!isTicketTier(tierId)) {
      return NextResponse.json({ error: 'Invalid ticket tier selected' }, { status: 400 });
    }

    const qty = parseQuantity(quantity);
    if (!qty) {
      return NextResponse.json({ error: 'Quantity must be between 1 and 10' }, { status: 400 });
    }

    const validationErrors = validateBookingDetails(customerName || '', customerEmail || '', customerPhone || '');
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json({ error: Object.values(validationErrors)[0] }, { status: 400 });
    }

    const phoneTenDigits = normalizePhone(customerPhone);

    const unitPrice = TICKET_PRICES[tierId];
    const totalAmount = unitPrice * qty;
    const amountInPaise = totalAmount * 100;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay is not configured on the server.' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${tierId}_${Date.now().toString(36)}`,
      notes: {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: phoneTenDigits,
        tierId,
        quantity: String(qty),
        eventName: 'Rangilo Raas 2026',
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId,
      tierId,
      quantity: qty,
      totalAmount,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: phoneTenDigits,
    });
  } catch (error: unknown) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initialize payment gateway with Razorpay' },
      { status: 500 }
    );
  }
}
