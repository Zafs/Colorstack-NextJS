import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature!, webhookSecret);
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return new NextResponse('Webhook Error', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    console.log('[WEBHOOK_DEBUG] Processing checkout.session.completed event');
    console.log('[WEBHOOK_DEBUG] Session ID:', session.id);
    console.log('[WEBHOOK_DEBUG] User ID from metadata:', userId);

    if (!userId) {
      console.error('[WEBHOOK_ERROR] User ID not found in session metadata');
      return new NextResponse('User ID not found', { status: 400 });
    }

    try {
      console.log('[WEBHOOK_DEBUG] Updating user metadata for userId:', userId);
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: { tier: 'pro' }
      });
      console.log('[WEBHOOK_SUCCESS] Successfully updated user metadata for userId:', userId);
    } catch (error) {
      console.error('[WEBHOOK_ERROR] Failed to update user metadata:', error);
      throw error;
    }
  }

  return new NextResponse(null, { status: 200 });
}
