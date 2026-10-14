import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Maintain in-memory processed event IDs for webhook idempotency
const processedEventIds = new Set<string>();

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event;

    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      event = JSON.parse(rawBody);
    }

    // Idempotency check: Ignore duplicate delivery
    if (processedEventIds.has(event.id)) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    processedEventIds.add(event.id);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Stripe checkout completed for customer:', session.customer);
        // Update user product tier in database to 'premium'
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription cancelled:', subscription.id);
        // Revert user product tier to 'free'
        break;
      }
      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
