import crypto from 'crypto';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { processVerifiedPayment, VerifiedOrder, VerifiedPayment } from '@/lib/paymentProcessing';

export const runtime = 'nodejs';

interface WebhookPayload {
  event?: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string } };
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Webhook processing failed';
}

export async function POST(req: Request) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Razorpay webhook is not configured on the server.' }, { status: 500 });
  }

  const signature = req.headers.get('x-razorpay-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing Razorpay webhook signature.' }, { status: 400 });
  }

  const rawBody = await req.text();
  const expectedSignature = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return NextResponse.json({ error: 'Invalid Razorpay webhook signature.' }, { status: 400 });
  }

  try {
    const payload = JSON.parse(rawBody) as WebhookPayload;
    if (payload.event !== 'payment.captured' && payload.event !== 'order.paid') {
      return NextResponse.json({ received: true });
    }

    const paymentEntity = payload.payload?.payment?.entity;
    if (!paymentEntity?.id || !paymentEntity.order_id) {
      return NextResponse.json({ error: 'Webhook payment payload is incomplete.' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay is not configured on the server.' }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.fetch(paymentEntity.order_id) as unknown as VerifiedOrder;
    const payment = await razorpay.payments.fetch(paymentEntity.id) as unknown as VerifiedPayment;
    await processVerifiedPayment(order, payment);

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Razorpay webhook processing error:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}
