import { NextRequest, NextResponse } from 'next/server';
import { stripe, isStripeConfigured } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (!isStripeConfigured()) {
      // Simulation mode if Stripe keys are not yet provided by the user
      return NextResponse.json({
        mock: true,
        message: 'Stripe test mode simulated. Add STRIPE_SECRET_KEY to .env.local to activate live Stripe Checkout.',
        url: `${siteUrl}/?subscription=success`,
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Resound Premium',
              description: 'Ad-free high-bitrate music streaming, true shuffle, and unlimited skips.',
            },
            unit_amount: 999, // $9.99
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/?subscription=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
