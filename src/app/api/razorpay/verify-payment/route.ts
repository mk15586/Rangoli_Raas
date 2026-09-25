import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { processVerifiedPayment, toTicketResponse, VerifiedOrder, VerifiedPayment } from '@/lib/paymentProcessing';

export const runtime = 'nodejs';

interface VerifyPaymentBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

function isVerifyPaymentBody(value: unknown): value is VerifyPaymentBody {
  if (!value || typeof value !== 'object') return false;
  const body = value as Record<string, unknown>;
  return [body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature]
    .every((field) => typeof field === 'string' && field.length > 0);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Error processing payment verification';
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (!isVerifyPaymentBody(body)) {
      return NextResponse.json(
        { error: 'Incomplete payment verification payload from Razorpay' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay is not configured on the server.' }, { status: 500 });
    }

    // Verify Razorpay HMAC signature
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const signaturesMatch = generatedSignature.length === body.razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(body.razorpay_signature));
    if (!signaturesMatch) {
      return NextResponse.json(
        { error: 'Payment signature verification failed. Tampering detected!' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.fetch(body.razorpay_order_id) as unknown as VerifiedOrder;
    const payment = await razorpay.payments.fetch(body.razorpay_payment_id) as unknown as VerifiedPayment;
    const result = await processVerifiedPayment(order, payment);

    return NextResponse.json({
      success: true,
      ticket: toTicketResponse(result),
      emailDelivery: result.emailDelivery,
    });
  } catch (error: unknown) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
